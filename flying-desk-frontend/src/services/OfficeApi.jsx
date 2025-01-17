import axios from "axios";

const BASE_URL = "http://localhost:8081";
const token = localStorage.getItem("accessToken");

export const uploadPhotos = async (files, folderName) => {
  const uploadedUrls = [];
  const AuthToken = localStorage.getItem("accessToken");

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${BASE_URL}/photos/upload`, formData, {
        headers: {
          "folderName": folderName, // Wysyłamy folderName w nagłówku
          "Authorization": `Bearer ${AuthToken}`,
        },
      });

      if (response.status === 200 && response.data.url) {
        uploadedUrls.push(response.data.url); // Dodaj URL do tablicy
      } else {
        console.error("Invalid response from photo upload API:", response.data);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  }

  return uploadedUrls;
};


export const addBuilding = async (buildingData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/building`, buildingData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Building added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding building:", error);
    throw error;
  }
};

export const getBuildingDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/building/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching building details:", error);
    throw error;
  }
};
