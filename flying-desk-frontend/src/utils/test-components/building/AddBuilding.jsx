import React, { useState } from "react";
import axios from "axios";

const BuildingForm = () => {
  const [buildingName, setBuildingName] = useState(""); // Nazwa budynku
  const [description, setDescription] = useState(""); // Opis budynku
  const [address, setAddress] = useState(""); // Adres budynku
  const [city, setCity] = useState(""); // Miasto
  const [country, setCountry] = useState(""); // Kraj
  const [errorMessage, setErrorMessage] = useState(""); // Komunikat błędu

  // Funkcja obsługująca wysyłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sprawdzenie, czy wszystkie wymagane pola zostały wypełnione
    if (!buildingName || !description || !address || !city || !country) {
      setErrorMessage("Wszystkie pola muszą być wypełnione!");
      return;
    }

    // Przygotowanie danych JSON do wysłania
    const buildingData = {
      id: 3,
      building: buildingName,
      description: description,
      address: {
        id: 1,
        address: address,
        city: {
          id: 1,
          city: city,
          country: {
            id: 1,
            country: country,
          },
        },
        country: {
          id: 1,
          country: country,
        },
      },
      photoUrl: null,
    };

    try {
        const token = localStorage.getItem("accessToken");
      // Wysłanie danych do serwera
      const response = await axios.post("http://localhost:8081/buildings", buildingData, {
        headers: {
          "Content-Type": "application/json", // Nagłówek określający typ danych
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert("Budynek został pomyślnie dodany!");
      } else {
        setErrorMessage("Wystąpił problem podczas dodawania budynku.");
      }
    } catch (error) {
      setErrorMessage("Wystąpił błąd przy wysyłaniu danych.");
    }
  };

  return (
    <div className="building-form">
      <h2>Dodaj Budynek</h2>

      {/* Formularz */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa Budynku:</label>
          <input
            type="text"
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
            placeholder="Wprowadź nazwę budynku"
          />
        </div>

        <div>
          <label>Opis Budynku:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Wprowadź opis budynku"
          />
        </div>

        <div>
          <label>Adres:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Wprowadź adres"
          />
        </div>

        <div>
          <label>Miasto:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Wprowadź miasto"
          />
        </div>

        <div>
          <label>Kraj:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Wprowadź kraj"
          />
        </div>

        {/* Wyświetlanie komunikatu błędu */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Przycisk wysyłania */}
        <button type="submit">Dodaj Budynek</button>
      </form>
    </div>
  );
};

export default BuildingForm;
