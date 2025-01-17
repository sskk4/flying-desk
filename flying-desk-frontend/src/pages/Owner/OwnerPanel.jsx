import React from "react";
import { Routes, Route } from "react-router-dom";

import OwnerOffices from "./Office/OwnerOffices"; 
import OwnerAddOffice from "./Office/OwnerAddOffice";

const OwnerPages = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerOffices />} />
      <Route path="/offices" element={<div>Offices page content</div>} />
      <Route path="/office/add" element={<OwnerAddOffice />} />
      <Route path="/desks" element={<div>Desks page content</div>} />
      <Route path="/rooms" element={<div>Rooms page content</div>} />
    </Routes>
  );
};

export default OwnerPages;
