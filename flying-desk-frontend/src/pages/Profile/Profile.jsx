import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Sidebar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Personal from "./Personal"; 
import ChangePassword from "./Password";
import Rentals from "./Rentals";
import RentalConfirm from "./RentalConfirm";
import RentalCancel from "./RentalCancel";
import RentalDetails from "./RentalDetails";

import { useAuth } from "../../services/AuthProvider";

import { ReactComponent as HomeIcon } from "../../assets/icons/desk.svg";
import { ReactComponent as LockIcon } from "../../assets/icons/summary.svg";
import { ReactComponent as KeyIcon } from "../../assets/icons/key.svg";

import Women from "../../assets/png/women.png";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  let linkPath = '';

  if (user?.role === 'ADMIN') {
    linkPath = '/admin-fd';
  } else if (user?.role === 'OWNER') {
    linkPath = '/owner';
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
        <div className="conent">
          <Sidebar 
            header="Account Management" 
            headerPath="/profile" 
            items={sidebarItems} 
          />
          <main className="content-container">
            <Routes>
              <Route path="personal-info" element={<Personal />} />
              <Route path="rentals" element={<Rentals />} />
              <Route path="rentals/:rentalId/confirm" element={<RentalConfirm />} />
              <Route path="rentals/:rentalId/cancel" element={<RentalCancel />} />
              <Route path="rentals/:rentalId/details" element={<RentalDetails />} />
              <Route path="account-signin" element={<ChangePassword />} />
              <Route
                path="/"
                element={
                  <div>
                    <div className="profile-title-container">
                      <h1 className="owner-title">Welcome to your profile!</h1>
                      <h3 className="fancy-text">{user?.firstName}</h3>
                      
                      <h4>Role </h4>
                      <a href={linkPath}>
                        <h2>{user?.role}</h2>
                      </a>
                      <h4>User id {user?.userId}</h4>
    <div onClick={handleLogout} className="panel-forgot menu-bar-button slide-in-out margin">
                        Logout
                      </div>
                      <img src={Women} alt="women" className="women" />
                    </div>
                    <div className="contact-button-container">
                      <a href="/contact" className="contact-button">
                        <span>Contact us</span>
                      </a>

                    </div>
                    
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;