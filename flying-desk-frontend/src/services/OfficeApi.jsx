import axios from "axios";

// Base URL for the API
const BASE_URL = "http://localhost:8081";

// Function to upload photos
export const uploadPhotos = async (files, folderName, token) => {
  const uploadedUrls = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${BASE_URL}/photos/upload`,
      formData,
      {
        headers: {
          "folderName": folderName,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // Get the correct URL for the uploaded photo
      const photoUrl = `https://storage.googleapis.com/office-images/${folderName}/${file.name}`;
      uploadedUrls.push(photoUrl);
    } else {
      throw new Error("Error uploading photo.");
    }
  }
  return uploadedUrls;
};
