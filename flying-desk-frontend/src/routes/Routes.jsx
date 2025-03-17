import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { useAuth } from "../services/AuthProvider";
import ProtectedRoute from "./ProtectedRoute"; 

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ActivateAccountPage from "../pages/Auth/ActivateAccount";
import RentDesk from "../pages/Rent/RentDesk";
import Profile from "../pages/Profile/Profile";

import OfficeList from "../pages/Office/OfficeList";
import OfficeDetails from "../pages/Office/OfficeDetails";

import RoomList from "../pages/Office/RoomList";
import RoomDetails from "../pages/Office/RoomDetails";

import DeskList from "../pages/Office/DeskList";
import DeskDetails from "../pages/Office/DeskDetails";


import TestBuilding from "../utils/test-components/building/TestBuilding";

import RentContainer from "../pages/Rent/Start";

import BecomeOwner from "../pages/Owner/BecomeOwner";
import OwnerWaitingContainer from "../pages/Error/Owner/Approve";
import OwnerRejectedContainer from "../pages/Error/Owner/Wrong";

import Info from "../pages/Home/Info";
import Contact from "../pages/Home/Contact";

import OwnerPanel from "../pages/Owner/OwnerPanel";

import AdminPanel from "../pages/Admin/AdminPanel";

import Error403 from "../pages/Error/Error403";
import Error404 from "../pages/Error/Error404";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    
    <Routes>
    
      <Route path="/" element={<OfficeList />} />
      <Route path="/rooms" element={<RoomList />} />

      <Route path="/office/:id" element={<OfficeDetails />} />
      <Route path="/room/:id" element={<RoomDetails />} />

      <Route
    path="/desk/:deskid/rent"
    element={
      <ProtectedRoute>
        <RentDesk />
      </ProtectedRoute>
    }
  />
      <Route path="/desk/:id" element={<DeskDetails />} />
      <Route path="/desks" element={<DeskList />} />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/profile" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/profile" /> : <Register />}
      />

        <Route
          path="/activate/:activationId"
          element={<ActivateAccountPage />}
        />

      <Route
        path="/profile/*"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />



<Route
  path="/become-owner/*"
  element={
    <ProtectedRoute isBecomeOwner={true}>
      <BecomeOwner />
    </ProtectedRoute>
  }
/>




      {/* Zależne od statusu zgłoszenia */}
      <Route
  path="/waiting-status"
  element={
    <ProtectedRoute allowedStatuses={['PENDING']}>
      <OwnerWaitingContainer />
    </ProtectedRoute>
  }
/>
<Route
  path="/rejected"
  element={
    <ProtectedRoute allowedStatuses={['REJECTED']}>
      <OwnerRejectedContainer />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/*"
  element={
    <ProtectedRoute
      allowedRoles={["ADMIN", "OWNER"]} // Upewnij się, że te wartości pasują do user.role
      allowedSubmissionStatuses={["APPROVED"]} // Zależnie od implementacji
    >
      <OwnerPanel />
    </ProtectedRoute>
  }
/>


      <Route path="/start-rent" element={<RentContainer />} />

      
      <Route path="/test/building" element={<TestBuilding />} />

      <Route
        path="/admin-fd/*"
        element={
          <ProtectedRoute 
         >
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route path="/contact" element={<Contact />} />
      <Route path="/info" element={<Info />} />
      <Route path="/error-403" element={<Error403 />} />
      <Route path="/error-404" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;