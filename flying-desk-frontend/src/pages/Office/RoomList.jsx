import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { Calendar, Clock } from "react-feather";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import "../../components/Card/Card.css";

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availableRoomsIds, setAvailableRoomsIds] = useState([]);
  const { accessToken, user } = { accessToken: localStorage.getItem('accessToken'), user: JSON.parse(localStorage.getItem('user')) };

  const [filters, setFilters] = useState({
    countryId: "",
    cityId: "",
    priceFrom: "",
    priceTo: "",
    sort: "room-asc",
    search: "",
    availabilityDate: "",
    availabilityStartTime: "09:00",
    availabilityEndTime: "17:00",
    onlyAvailable: false,
  });

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
      search: filters.search,
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
        setAvailableRoomsIds([]);
        return;
      }

      try {
        setAvailabilityLoading(true);

        const checkPromises = rooms.map(async (room) => {
          try {
            const startDateTime = `${filters.availabilityDate}T${filters.availabilityStartTime}:00`;
            const endDateTime = `${filters.availabilityDate}T${filters.availabilityEndTime}:00`;
            
            const availabilityResponse = await axios.get(
              "http://localhost:8083/api/v1/availability/resource", {
                params: {
                  type: "ROOM",
                  resourceId: room.id
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
              params: { resourceType: "ROOM", resourceId: room.id },
              headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
                "X-User-Id": user?.userId
              } : {}
            });
            
            if (!rentalHistoryResponse.data) {
              return room.id; 
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
            
            return room.id; 
          } catch (err) {
            console.error(`Error checking availability for room ${room.id}:`, err);
            return null;
          }
        });
        
        const availabilityResults = await Promise.all(checkPromises);
        const availableIds = availabilityResults.filter(id => id !== null);
        
        setAvailableRoomsIds(availableIds);
      } catch (err) {
        console.error("Error during batch availability check:", err);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (rooms.length > 0) {
        checkAvailability();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [rooms, filters.availabilityDate, filters.availabilityStartTime, filters.availabilityEndTime, filters.onlyAvailable, accessToken, user?.userId]);

  useEffect(() => {
    const fetchRooms = async () => {
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
          search: filters.search || null,
          page,
          size: 9,
        };

        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== null)
        );

        const response = await axios.get("http://localhost:8081/api/v1/building/rooms", {
          params: filteredParams,
        });

        const allRooms = response.data?.content || [];
        setRooms(allRooms);
        setTotalPages(response.data?.totalPages || 0);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to fetch rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filters, page]);

  const filteredRooms = filters.onlyAvailable && filters.availabilityDate
    ? rooms.filter(room => availableRoomsIds.includes(room.id))
    : rooms;

  const searchFilteredRooms = filters.search 
    ? filteredRooms.filter(room => 
        room.room.toLowerCase().includes(filters.search.toLowerCase()) ||
        (room.description && room.description.toLowerCase().includes(filters.search.toLowerCase())) ||
        (room.building && room.building.building && room.building.building.toLowerCase().includes(filters.search.toLowerCase())) ||
        (room.building && room.building.address && room.building.address.address && room.building.address.address.toLowerCase().includes(filters.search.toLowerCase()))
      )
    : filteredRooms;

  return (
    <div>
      <Header />

      <SearchBar
        filterType="room"
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <div className="result-count">
        <label>{searchFilteredRooms.length} results</label>
        {filters.availabilityDate && filters.onlyAvailable && (
          <div className="availability-badge">
            <Calendar size={14} /> 
            Showing rooms available on {new Date(filters.availabilityDate).toLocaleDateString()} 
            from {filters.availabilityStartTime} to {filters.availabilityEndTime}
          </div>
        )}
        <hr />
      </div>

      {(loading || availabilityLoading) && <div className="loader-container"><div className="loader"></div></div>}
      {error && <div className="error-container">{error} <hr /></div>}

      {searchFilteredRooms.length > 0 ? (
        <div className="card-container">
          {searchFilteredRooms.map((room) => (
            <div className="card" key={room.id}>
              <div className="card-image">
                <img
                  src={room.photos?.[0]?.url || "https://via.placeholder.com/400"}
                  alt={room.room}
                  className="card-img"
                />
                <h2 className="card-title">{room.room}</h2>
                <h4 className="card-title">
                  {room.building.address.city.city}, {room.building.address.address}, {room.building.address.country.country}
                </h4>
                <div className="card-price-container">
                  <h4 className="card-price">{room.price}$ {room.currency} /day</h4>
                </div>
                {filters.availabilityDate && filters.onlyAvailable && availableRoomsIds.includes(room.id) && (
                  <div className="availability-tag">
                    <Clock size={12} /> Available
                  </div>
                )}
                <Link to={`/room/${room.id}`}>
                  <button className="purple-button card-button">Check</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !availabilityLoading && !error ? (
        <div className="no-results">
          {filters.search
            ? `No rooms found for "${filters.search}". Try adjusting your search.`
            : filters.availabilityDate && filters.onlyAvailable
              ? "No available rooms for the selected date and time. Try adjusting your availability filters."
              : "No rooms available. Try modifying your filters or search criteria."}
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

export default RoomsList;