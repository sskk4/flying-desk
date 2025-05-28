import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { useAuth } from "../../services/AuthProvider";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "react-feather";
import "../../components/Card/Card.css";
import "../../styles/DeskList.css";

const DeskList = () => {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availableDesksIds, setAvailableDesksIds] = useState([]);
  const [weeklySchedules, setWeeklySchedules] = useState({});
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState(getMonday(new Date()));
  
  const { accessToken, user } = useAuth();

  const [filters, setFilters] = useState({
    countryId: "",
    cityId: "",
    priceFrom: "",
    priceTo: "",
    sort: "desk-asc",
    search: "",
    availabilityDate: "",
    availabilityStartTime: "09:00",
    availabilityEndTime: "17:00",
    onlyAvailable: false,
  });

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDays(mondayDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(mondayDate);
      day.setDate(mondayDate.getDate() + i);
      week.push(day);
    }
    return week;
  }

  function formatDayName(dayCode) {
    const days = {
      MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", 
      THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun"
    };
    return days[dayCode] || dayCode;
  }

  function formatTime(timeString) {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  function getDayCode(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  }

  function isDateInAvailabilityRange(date, availableFrom, availableTo) {
    if (!availableFrom || !availableTo) return true;
    
    const dateToCheck = new Date(date);
    const fromDate = new Date(availableFrom);
    const toDate = new Date(availableTo);
    
    return dateToCheck >= fromDate && dateToCheck <= toDate;
  }

  function hasAvailabilityInWeek(schedule) {
    if (!schedule) return false;
    
    const weekDays = getWeekDays(selectedWeekStart);
    
    return weekDays.some(date => {
      if (!isDateInAvailabilityRange(date, schedule.availableFrom, schedule.availableTo)) {
        return false;
      }
      
      const dayData = schedule[date.toDateString()];
      return dayData && dayData.slots && dayData.slots.length > 0;
    });
  }

  function canShowPreviousWeek() {
    let earliestAvailableFrom = null;
    
    Object.values(weeklySchedules).forEach(schedule => {
      if (schedule.availableFrom) {
        const availableFrom = new Date(schedule.availableFrom);
        if (!earliestAvailableFrom || availableFrom < earliestAvailableFrom) {
          earliestAvailableFrom = availableFrom;
        }
      }
    });

    if (!earliestAvailableFrom) return true; 
    const previousWeekStart = new Date(selectedWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    const previousWeekEnd = new Date(previousWeekStart);
    previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);

    return previousWeekEnd >= earliestAvailableFrom;
  }

  function hasCustomTimeFilters() {
    return filters.availabilityStartTime && filters.availabilityEndTime && 
           (filters.availabilityStartTime !== "09:00" || filters.availabilityEndTime !== "17:00");
  }

  const fetchDeskSchedule = async (deskId) => {
    try {
      console.log(`Fetching schedule for desk ${deskId}`);
      
      const availabilityResponse = await axios.get(
        `http://localhost:8083/api/v1/availability/resource`,
        {
          params: { type: "DESK", resourceId: deskId }
        }
      );

      console.log(`Availability response for desk ${deskId}:`, availabilityResponse.data);

      let rentalHistory = [];
      if (accessToken && user?.userId) {
        try {
          const rentalResponse = await axios.get(
            `http://localhost:8083/api/v1/rent/resource`,
            {
              params: { resourceType: "DESK", resourceId: deskId },
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-User-Id": user.userId
              }
            }
          );
          console.log(`Rental response for desk ${deskId}:`, rentalResponse.data);
          rentalHistory = rentalResponse.data || [];
        } catch (error) {
          console.error(`Error fetching rental history for desk ${deskId}:`, error);
        }
      }

      const availabilityData = availabilityResponse.data?.[0];

      if (!availabilityData) {
        console.log(`No availability data for desk ${deskId}`);
        return null;
      }

      const weekDays = getWeekDays(selectedWeekStart);
      const weekSchedule = {};

      weekDays.forEach(date => {
        if (!isDateInAvailabilityRange(date, availabilityData.availableFrom, availabilityData.availableTo)) {
          return; 
        }

        const dayCode = getDayCode(date);
        const dayAvailability = availabilityData.availableDaysWithHours?.find(
          day => day.dayOfWeek === dayCode
        );

        if (dayAvailability) {
          let availableSlots = [...dayAvailability.timeSlots];

          if (rentalHistory.length > 0) {
            const dayRentals = rentalHistory.filter(rental => {
              const rentalDate = new Date(rental.startDate).toDateString();
              return rentalDate === date.toDateString() && rental.status === "PAID";
            });

            dayRentals.forEach(rental => {
              const rentalStart = new Date(rental.startDate);
              const rentalEnd = new Date(rental.endDate);
              
              availableSlots = availableSlots.filter(slot => {
                const slotStart = new Date(`${date.toISOString().split('T')[0]}T${slot.startTime}`);
                const slotEnd = new Date(`${date.toISOString().split('T')[0]}T${slot.endTime}`);
                
                return !(
                  (slotStart >= rentalStart && slotStart < rentalEnd) ||
                  (slotEnd > rentalStart && slotEnd <= rentalEnd) ||
                  (slotStart <= rentalStart && slotEnd >= rentalEnd)
                );
              });
            });
          }

          weekSchedule[date.toDateString()] = {
            dayCode,
            dayName: formatDayName(dayCode),
            date: date,
            slots: availableSlots,
            rentals: rentalHistory.filter(rental => {
              const rentalDate = new Date(rental.startDate).toDateString();
              return rentalDate === date.toDateString() && rental.status === "PAID";
            })
          };
        }
      });

      const scheduleWithDates = {
        ...weekSchedule,
        availableFrom: availabilityData.availableFrom,
        availableTo: availabilityData.availableTo
      };

      console.log(`Week schedule for desk ${deskId}:`, scheduleWithDates);
      return scheduleWithDates;
    } catch (error) {
      console.error(`Error fetching schedule for desk ${deskId}:`, error);
      return null;
    }
  };

  const fetchAllSchedules = async () => {
    if (desks.length === 0) {
      console.log('Cannot fetch schedules - no desks');
      return;
    }
    
    console.log('Fetching schedules for all desks');
    setScheduleLoading(true);
    const schedules = {};

    try {
      const schedulePromises = desks.map(async (desk) => {
        const schedule = await fetchDeskSchedule(desk.id);
        return { deskId: desk.id, schedule };
      });

      const results = await Promise.all(schedulePromises);
      
      results.forEach(({ deskId, schedule }) => {
        if (schedule) {
          schedules[deskId] = schedule;
        }
      });

      console.log('All schedules fetched:', schedules);
      setWeeklySchedules(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setScheduleLoading(false);
    }
  };

  const applyFilters = debounce(() => {
    setPage(0);
  }, 500);

  const handleFilterChange = (field, value) => {
    console.log(`Filter changed: ${field} = ${value}`);
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(0);
  };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({ ...prev, sort }));
    setPage(0);
  };

  const handleSearchChange = (search) => {
    setFilters((prev) => ({
      ...prev,
      search,
    }));
    setPage(0);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();
    Object.entries({
      country: filters.countryId,
      city: filters.cityId,
      minPrice: filters.priceFrom,
      maxPrice: filters.priceTo,
      availabilityDate: filters.availabilityDate,
      availabilityStartTime: filters.availabilityStartTime,
      availabilityEndTime: filters.availabilityEndTime,
      onlyAvailable: filters.onlyAvailable.toString(),
      sort: filters.sort,
      page: page.toString(),
      size: "9",
    }).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    window.history.replaceState(null, "", `?${queryParams.toString()}`);
  }, [filters, page]);

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        setLoading(true);
        const [sortBy, sortDir] = filters.sort.split("-");
        const params = {
          country: filters.countryId || null,
          city: filters.cityId || null,
          minPrice: filters.priceFrom || null,
          maxPrice: filters.priceTo || null,
          isApproved: true,
          sortBy,
          sortDir,
          page,
          size: 9,
        };

        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== null)
        );

        const response = await axios.get("http://localhost:8081/api/v1/building/desks", {
          params: filteredParams,
        });

        const allDesks = response.data?.content || [];
        setDesks(allDesks);
        setTotalPages(response.data?.totalPages || 0);
      } catch (err) {
        console.error("Error fetching desks:", err);
        setError("Failed to fetch desks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDesks();
  }, [filters.countryId, filters.cityId, filters.priceFrom, filters.priceTo, filters.sort, page]);

  useEffect(() => {
    console.log('Schedule fetch effect triggered', { 
      desksLength: desks.length
    });
    
    if (desks.length > 0) {
      fetchAllSchedules();
    }
  }, [desks, selectedWeekStart]);

  useEffect(() => {
const checkAvailability = async () => {
  console.log('Checking availability with filters:', {
    availabilityDate: filters.availabilityDate,
    availabilityStartTime: filters.availabilityStartTime,
    availabilityEndTime: filters.availabilityEndTime,
    onlyAvailable: filters.onlyAvailable
  });

  if (!filters.availabilityDate || !filters.onlyAvailable) {
    setAvailableDesksIds([]);
    return;
  }

  setAvailabilityLoading(true);
  try {
    const availableIds = [];

    for (const desk of desks) {
      try {
        // 1. Check base availability
        const availabilityResponse = await axios.get(
          `http://localhost:8083/api/v1/availability/check`,
          {
            params: {
              resourceType: "DESK",
              resourceId: desk.id,
              date: filters.availabilityDate,
              startTime: filters.availabilityStartTime,
              endTime: filters.availabilityEndTime
            }
          }
        );

        const isAvailableBySchedule = availabilityResponse.data === true;

        // 2. If not available by schedule, skip
        if (!isAvailableBySchedule) continue;

        // 3. Fetch rental history
        const rentalHistoryResponse = await axios.get(
          `http://localhost:8083/api/v1/rent/resource`,
          {
            params: {
              resourceType: "DESK",
              resourceId: desk.id
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-User-Id": user?.userId
            }
          }
        );

        const rentalHistory = rentalHistoryResponse.data || [];
        const targetDateStr = filters.availabilityDate;
        const targetStart = new Date(`${targetDateStr}T${filters.availabilityStartTime}`);
        const targetEnd = new Date(`${targetDateStr}T${filters.availabilityEndTime}`);

        // 4. Check for reservation conflicts
        const isReserved = rentalHistory.some(rental => {
          if (rental.status !== "PAID") return false;
          const rentalStart = new Date(rental.startDate);
          const rentalEnd = new Date(rental.endDate);

          return (
            (targetStart >= rentalStart && targetStart < rentalEnd) ||
            (targetEnd > rentalStart && targetEnd <= rentalEnd) ||
            (targetStart <= rentalStart && targetEnd >= rentalEnd)
          );
        });

        if (!isReserved) {
          availableIds.push(desk.id);
        }

      } catch (error) {
        console.error(`Error checking availability or rental history for desk ${desk.id}:`, error);
      }
    }

    console.log('Filtered available desk IDs (not reserved):', availableIds);
    setAvailableDesksIds(availableIds);

  } catch (error) {
    console.error("Error checking availability:", error);
  } finally {
    setAvailabilityLoading(false);
  }
};


    const timer = setTimeout(() => {
      if (desks.length > 0) {
        checkAvailability();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [desks, filters.availabilityDate, filters.availabilityStartTime, filters.availabilityEndTime, filters.onlyAvailable]);

  let filteredDesks = desks;

  if (filters.onlyAvailable && filters.availabilityDate) {
    console.log('Filtering by specific availability date');
    filteredDesks = filteredDesks.filter(desk => availableDesksIds.includes(desk.id));
  }

  if (!filters.availabilityDate || !filters.onlyAvailable) {
    console.log('Filtering by weekly availability');
    filteredDesks = filteredDesks.filter(desk => {
      const schedule = weeklySchedules[desk.id];
      return hasAvailabilityInWeek(schedule);
    });
  }

  const searchFilteredDesks = filters.search 
    ? filteredDesks.filter(desk => 
        desk.desk.toLowerCase().includes(filters.search.toLowerCase()) ||
        (desk.description && desk.description.toLowerCase().includes(filters.search.toLowerCase())) ||
        (desk.building && desk.building.building && desk.building.building.toLowerCase().includes(filters.search.toLowerCase())) ||
        (desk.building && desk.building.address && desk.building.address.address && desk.building.address.address.toLowerCase().includes(filters.search.toLowerCase()))
      )
    : filteredDesks;

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeekStart(newDate);
  };

  const formatWeekRange = (mondayDate) => {
    const sunday = new Date(mondayDate);
    sunday.setDate(mondayDate.getDate() + 6);
    return `${mondayDate.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
  };

  const DeskSchedule = ({ desk }) => {
    const schedule = weeklySchedules[desk.id];
    
    console.log(`Rendering schedule for desk ${desk.id}:`, schedule);
    
    if (scheduleLoading) {
      return (
        <div className="desk-schedule">
          <div className="schedule-header">
            <Calendar size={12} />
            <span>Loading schedule...</span>
          </div>
        </div>
      );
    }
    
    if (!schedule || !hasAvailabilityInWeek(schedule)) {
      return (
        <div className="desk-schedule">
          <div className="schedule-header">
            <Calendar size={12} />
            <span>No availability this week</span>
          </div>
        </div>
      );
    }

    const weekDays = getWeekDays(selectedWeekStart);

    return (
      <div className="desk-schedule">
        <div className="schedule-header">
          <Calendar size={12} />
          <span>Weekly Schedule</span>
        </div>
        
        {schedule.availableFrom && schedule.availableTo && (
          <div className="availability-period">
            <h3> 
              Available: {formatDate(schedule.availableFrom)} - {formatDate(schedule.availableTo)}
            </h3>
          </div>
        )}
        
        <div className="schedule-days">
          {weekDays
            .filter(date => isDateInAvailabilityRange(date, schedule.availableFrom, schedule.availableTo))
            .map(date => {
              const dayData = schedule[date.toDateString()];
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={date.toDateString()} className={`schedule-day ${isToday ? 'today' : ''}`}>
                  <div className="day-name">
                    {formatDayName(getDayCode(date))}
                  </div>
                  <div className="day-date">
                    {date.getDate()}
                  </div>
                  <div className="day-slots">
                    {dayData ? (
                      dayData.slots.length > 0 ? (
                        dayData.slots.slice(0, 2).map((slot, index) => (
                          <div key={index} className="time-slot-mini">
                            <Clock size={8} />
                            <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="no-slots">Booked</div>
                      )
                    ) : (
                      <div className="no-availability">N/A</div>
                    )}
                    {dayData && dayData.slots.length > 2 && (
                      <div className="more-slots">+{dayData.slots.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />

      <SearchBar
        filterType="desk"
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <div className="week-navigation">
        {canShowPreviousWeek() && (
          <button onClick={() => navigateWeek(-1)} className="week-nav-btn">
            <ChevronLeft size={16} />
          </button>
        )}
        <span className="week-range">{formatWeekRange(selectedWeekStart)}</span>
        <button onClick={() => navigateWeek(1)} className="week-nav-btn">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="result-count">
        <label>{searchFilteredDesks.length} results</label>
        {filters.availabilityDate && filters.onlyAvailable && (
          <div className="availability-badge">
            <Calendar size={14} />
            Showing desks available on {new Date(filters.availabilityDate).toLocaleDateString()}
            {hasCustomTimeFilters() && 
              ` from ${filters.availabilityStartTime} to ${filters.availabilityEndTime}`
            }
          </div>
        )}
        <hr />
      </div>

      {(loading || availabilityLoading || scheduleLoading) && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      
      {error && <div className="error-container">{error} <hr /></div>}

      {searchFilteredDesks.length > 0 ? (
        <div className="card-container">
          {searchFilteredDesks.map((desk) => (
            <div className="card" key={desk.id}>
              <div className="card-image">
                <img
                  src={desk.photos?.[0]?.url || "https://via.placeholder.com/400"}
                  alt={desk.desk}
                  className="card-img"
                />
                <h2 className="card-title">{desk.desk}</h2>
                <h4 className="card-title">
                  {desk.building.address.city.city}, {desk.building.address.address},{" "}
                  {desk.building.address.country.country}
                </h4>
                <div className="card-price-container">
                  <h4 className="card-price">{desk.price}$ {desk.currency}/day</h4>
                </div>
                
                <DeskSchedule desk={desk} />
                
                {filters.availabilityDate && filters.onlyAvailable && availableDesksIds.includes(desk.id) && (
                  <div className="availability-tag">
                    <Clock size={12} /> Available {hasCustomTimeFilters() && 
                      `${filters.availabilityStartTime}-${filters.availabilityEndTime}`
                    }
                  </div>
                )}
                <Link to={`/desk/${desk.id}`}>
                  <button className="purple-button card-button">Check</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !availabilityLoading && !scheduleLoading && !error ? (
        <div className="no-results">
          {filters.search
            ? `No desks found for "${filters.search}". Try adjusting your search.`
            : filters.availabilityDate && filters.onlyAvailable
              ? "No available desks for the selected date and time. Try adjusting your availability filters."
              : "No desks with availability for this week. Try selecting a different week or adjusting your filters."}
        </div>
      ) : null}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-left-button" onClick={() => setPage(page - 1)} disabled={page === 0}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button className="pagination-right-button" onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
            Next
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DeskList;