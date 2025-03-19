import React from "react";
import { Routes, Route } from "react-router-dom";

import OwnerOffices from "./Office/OwnerOffices"; 
import OwnerAddOffice from "./Office/OwnerAddOffice";
import OwnerAddDesk from "./Office/OwnerAddDesk";
import OwnerDesksInOffice from "./Office/OwnerDesks";

const OwnerPages = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerOffices />} />
      <Route path="/offices" element={<div>Offices page content</div>} />
      <Route path="/office/add" element={<OwnerAddOffice />} />
      <Route path="/office/:buildingId/desk/add" element={<div><OwnerAddDesk /></div>} />
      <Route path="/office/:buildingId/desks" element={<div><OwnerDesksInOffice /></div>} />
      <Route path="/rooms" element={<div>Rooms page content</div>} />
    </Routes>
  );
};

export default OwnerPages;
