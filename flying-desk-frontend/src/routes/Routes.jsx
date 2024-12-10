// src/routes/Routes.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import OfficeList from "../pages/Office/OfficeList";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute"; // Import osłony
import AddOffice from "../pages/Office/AddOffice";
import OfficeDetails from "../pages/Office/OfficeDetails";
import TestBuilding from "../utils/test-components/building/TestBuilding";
import OwnerContainer from "../pages/Owner/Start";
import RentContainer from "../pages/Rent/Start";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OfficeList />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Ochrona trasy /profile */}
      <Route
        path="/profile/*"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add/office"
        element={
          <ProtectedRoute>
            <AddOffice />
          </ProtectedRoute>
        }
      />

        <Route path="/become-owner" element={<OwnerContainer />} />

        <Route path="/start-rent" element={<RentContainer />} />

        <Route path="/office/:id" element={<OfficeDetails />} />

        <Route path="/test/building" element={<TestBuilding />} />

        

    </Routes>
  );
};

export default AppRoutes;
