import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import { Calendar, Clock } from "react-feather";
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
  const { accessToken, user } = { accessToken: localStorage.getItem('accessToken'), user: JSON.parse(localStorage.getItem('user')) };

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

  const [tempFilters, setTempFilters] = useState({ ...filters }); 

  const applyFilters = debounce(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...tempFilters, 
    }));
    setPage(0); 
  }, 500);

  const handleFilterChange = (field, value) => {
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
    const checkAvailability = async () => {
      if (!filters.availabilityDate || !filters.onlyAvailable) {
        setAvailableDesksIds([]);
        return;
      }

      try {
        setAvailabilityLoading(true);

        const checkPromises = desks.map(async (desk) => {
          try {
            const startDateTime = `${filters.availabilityDate}T${filters.availabilityStartTime}:00`;
            const endDateTime = `${filters.availabilityDate}T${filters.availabilityEndTime}:00`;
            
            const availabilityResponse = await axios.get(
              "http://localhost:8083/api/v1/availability/resource", {
                params: {
                  type: "DESK",
                  resourceId: desk.id
                },
                headers: accessToken ? {
                  Authorization: `Bearer ${accessToken}`,
                  "X-User-Id": user?.userId
                } : {}
              }
            );
            
            if (!availabilityResponse.data || availabilityResponse.data.length === 0) {
              return null;
            }
            
            const availabilityData = availabilityResponse.data[0];
            
            const startDay = new Date(filters.availabilityDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
            const dayAvailability = availabilityData.availableDaysWithHours.find(day => day.dayOfWeek === startDay);
            
            if (!dayAvailability) {
              return null;
            }
            
            const startDateObj = new Date(`${filters.availabilityDate}T${filters.availabilityStartTime}`);
            const endDateObj = new Date(`${filters.availabilityDate}T${filters.availabilityEndTime}`);
            
            const isTimeSlotAvailable = dayAvailability.timeSlots.some(slot => {
              const slotStart = new Date(`${filters.availabilityDate}T${slot.startTime}`);
              const slotEnd = new Date(`${filters.availabilityDate}T${slot.endTime}`);
              return startDateObj >= slotStart && endDateObj <= slotEnd;
            });
            
            if (!isTimeSlotAvailable) {
              return null;
            }
            
            const rentalHistoryResponse = await axios.get(`http://localhost:8083/api/v1/rent/resource`, {
              params: { resourceType: "DESK", resourceId: desk.id },
              headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
                "X-User-Id": user?.userId
              } : {}
            });
            
            if (!rentalHistoryResponse.data) {
              return desk.id; 
            }
            
            const rentalHistory = rentalHistoryResponse.data;
            
            const conflictingRental = rentalHistory.find(rental => {
              const rentalStart = new Date(rental.startDate);
              const rentalEnd = new Date(rental.endDate);
              return (
                (startDateObj >= rentalStart && startDateObj < rentalEnd) ||
                (endDateObj > rentalStart && endDateObj <= rentalEnd) ||
                (startDateObj <= rentalStart && endDateObj >= rentalEnd)
              );
            });
            
            if (conflictingRental) {
              return null; 
            }
            
            return desk.id; 
          } catch (err) {
            console.error(`Error checking availability for desk ${desk.id}:`, err);
            return null;
          }
        });
        
        const availabilityResults = await Promise.all(checkPromises);
        const availableIds = availabilityResults.filter(id => id !== null);
        
        setAvailableDesksIds(availableIds);
      } catch (err) {
        console.error("Error during batch availability check:", err);
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
  }, [desks, filters.availabilityDate, filters.availabilityStartTime, filters.availabilityEndTime, filters.onlyAvailable, accessToken, user?.userId]);

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

  const filteredDesks = filters.onlyAvailable && filters.availabilityDate
    ? desks.filter(desk => availableDesksIds.includes(desk.id))
    : desks;

  const searchFilteredDesks = filters.search 
    ? filteredDesks.filter(desk => 
        desk.desk.toLowerCase().includes(filters.search.toLowerCase()) ||
        (desk.description && desk.description.toLowerCase().includes(filters.search.toLowerCase())) ||
        (desk.building && desk.building.building && desk.building.building.toLowerCase().includes(filters.search.toLowerCase())) ||
        (desk.building && desk.building.address && desk.building.address.address && desk.building.address.address.toLowerCase().includes(filters.search.toLowerCase()))
      )
    : filteredDesks;

  return (
    <div>
      <Header />

      <SearchBar
        filterType="desk" 
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <div className="result-count">
        <label>{searchFilteredDesks.length} results</label>
        {filters.availabilityDate && filters.onlyAvailable && (
          <div className="availability-badge">
            <Calendar size={14} /> 
            Showing desks available on {new Date(filters.availabilityDate).toLocaleDateString()} 
            from {filters.availabilityStartTime} to {filters.availabilityEndTime}
          </div>
        )}
        <hr />
      </div>

      {(loading || availabilityLoading) && <div className="loader-container"><div className="loader"></div></div>}
      {error && <div className="error-container">{error} <hr></hr></div>}

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
                {filters.availabilityDate && filters.onlyAvailable && availableDesksIds.includes(desk.id) && (
                  <div className="availability-tag">
                    <Clock size={12} /> Available
                  </div>
                )}
                <Link to={`/desk/${desk.id}`}>
                  <button className="purple-button card-button">Check</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !availabilityLoading && !error ? (
        <div className="no-results">
          {filters.search
            ? `No desks found for "${filters.search}". Try adjusting your search.`
            : filters.availabilityDate && filters.onlyAvailable
              ? "No available desks for the selected date and time. Try adjusting your availability filters."
              : "No desks available. Try modifying your filters or search criteria."}
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