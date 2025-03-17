import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { Navigate } from "react-router-dom"; // Do przekierowania na login

import Sidebar from "../../components/SideBar/SideBar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import Personal from "./Personal"; // Komponent Personal
import ChangePassword from "./Password";

import { useAuth } from "../../services/AuthProvider";

import { ReactComponent as HomeIcon } from "../../assets/icons/desk.svg";
import { ReactComponent as LockIcon } from "../../assets/icons/summary.svg";
import { ReactComponent as KeyIcon } from "../../assets/icons/key.svg";


import Women from "../../assets/png/women.png"

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

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
        headerPath="/profile" // Ścieżka, na którą przenosi nagłówek
        items={sidebarItems} 
      />
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
              element={<ChangePassword />}
            />
            <Route
              path="/"
              element={
                <div>
                <div className="profile-title-container">
                  
                  <h1 className="owner-title">Welcome to your profile!</h1>
                  <h3 className="fancy-text" >{user?.firstName}</h3>
                  
                  <h4>Role </h4>
                  <Link to={linkPath}>
                  <h2>{user?.role}</h2>
                  </Link>
                  <h4>User id {user?.userId}</h4>
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