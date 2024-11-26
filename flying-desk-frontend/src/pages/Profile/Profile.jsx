import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom"; // Do przekierowania na login

import Sidebar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";
import Personal from "./Personal"; // Komponent Personal

import { useAuth } from "../../services/AuthProvider";

import { ReactComponent as HomeIcon } from "../../assets/icons/desk.svg";
import { ReactComponent as LockIcon } from "../../assets/icons/summary.svg";
import { ReactComponent as KeyIcon } from "../../assets/icons/key.svg";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const sidebarItems = [
    { icon: <HomeIcon />, name: "rentals", path: "rentals" },
    { icon: <LockIcon />, name: "personal information", path: "personal-info" },
    { icon: <KeyIcon />, name: "account sign-in", path: "account-signin" },
  ];

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar header="Account Management" items={sidebarItems} />
        <main className="content-container">
          <Routes>
            <Route
              path="personal-info"
              element={<Personal />}
            />
            <Route
              path="rentals"
              element={
                <div>
                  <h2>Rentals Page</h2>
                  <p>Here you can manage your rentals.</p>
                </div>
              }
            />
            <Route
              path="account-signin"
              element={
                <div>
                  <h2>Account Sign-In</h2>
                  <p>Manage your sign-in preferences here.</p>
                </div>
              }
            />
            <Route
              path="/"
              element={
                <div>
                  <h1>Welcome to your profile!</h1>
                  <p>User ID: {user?.userId}</p>
                  <p>Role: {user?.role}</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};


export default Profile;