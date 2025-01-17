import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import "../../components/Card/Card.css";

const OfficeList = () => {
  const [buildings, setBuildings] = useState([]); // Lista budynków
  const [error, setError] = useState(""); // Błąd
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [page, setPage] = useState(0); // Numer aktualnej strony
  const [totalPages, setTotalPages] = useState(0); // Łączna liczba stron

  // Pobieranie budynków zatwierdzonych
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);

        // Pobierz zatwierdzone budynki
        const response = await axios.get("http://localhost:8081/api/v1/building", {
          params: {
            isApproved: true, // Filtruj tylko zatwierdzone budynki
            page, // Numer strony
            size: 10, // Liczba wyników na stronę
          },
        });

        // Aktualizuj stan komponentu
        setBuildings(response.data.content); // Lista budynków z odpowiedzi
        setTotalPages(response.data.totalPages); // Liczba stron
      } catch (err) {
        setError("Failed to fetch buildings. Please try again later.");
        console.error("Error fetching buildings:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [page]);

  // Zmiana strony
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Debugowanie danych budynków
  useEffect(() => {
    console.log("Buildings data:", buildings);
  }, [buildings]);

  // Obsługa ładowania i błędów
  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <Header />
      <SearchBar />

      <div className="card-container">
        {buildings.map((building) => (
          <div className="card" key={building.id}>
            <div className="card-image">
              <img
                className="card-img"
                src={
                  building.photos && building.photos.length > 0
                    ? building.photos[0].url // Wyświetl pierwszy dostępny URL zdjęcia
                    : "https://via.placeholder.com/400" // Placeholder, jeśli brak zdjęcia
                }
                alt={building.building}
                onError={(e) => {
                  console.error(`Error loading image for building ${building.id}:`, e);
                  e.target.src = "https://via.placeholder.com/400";
                }}
              />
            </div>
            <div className="card-title">{building.building}</div>
            <div className="card-price">
              <span className="card-small-text">Daily</span>

            </div>
            <Link to={`/office/${building.id}`}>
              <button className="purple-button card-button">Check</button>
            </Link>
            <div className="card-status">
              {building.status}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default OfficeList;
