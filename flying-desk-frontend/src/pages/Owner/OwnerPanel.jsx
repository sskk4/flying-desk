import React from "react";
import { Routes, Route } from "react-router-dom";

import OwnerOffices from "./Office/OwnerOffices"; 
import OwnerAddOffice from "./Office/OwnerAddOffice";
import OwnerManageOffice from "./Office/OwnerManageOffice";

import OwnerAddDesk from "./Office/OwnerAddDesk";
import OwnerDesksInOffice from "./Office/OwnerDesksByBuilding";
import OwnerDesks from "./Office/OwnerDesks"; 
import OwnerManageDesk from "./Office/OwnerManageDesk";

import OwnerRooms from "./Office/OwnerRooms";
import OwnerAddRoom from "./Office/OwnerAddRoom";
import OwnerRoomsInOffice from "./Office/OwnerRoomsByBuilding";
import OwnerManageRoom from "./Office/OwnerManageRoom";
import RentDeskDetails from "./Office/RentDeskDetails";


const OwnerPages = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerOffices />} />
 

      <Route path="/offices" element={<OwnerOffices />} />
      <Route path="/office/add" element={<OwnerAddOffice />} />
      <Route path="/office/:buildingId/manage" element={<OwnerManageOffice />} />

      <Route path="/desks" element={<OwnerDesks />} />
      <Route path="/office/:buildingId/desk/add" element={<div><OwnerAddDesk /></div>} />
      <Route path="/office/:buildingId/desks" element={<div><OwnerDesksInOffice /></div>} />
      <Route path="/desk/:deskId/manage" element={<div><OwnerManageDesk /></div>} />
      <Route path="/desk/:deskId" element={<RentDeskDetails />} />

      <Route path="/rooms" element={<div><OwnerRooms /></div>} />
      <Route path="/office/:buildingId/room/add" element={<div><OwnerAddRoom></OwnerAddRoom></div>} />
      <Route path="/office/:buildingId/rooms" element={<div><OwnerRoomsInOffice></OwnerRoomsInOffice></div>} />
      <Route path="/room/:roomId/manage" element={<div><OwnerManageRoom /></div>} />


    </Routes>
  );
};

export default OwnerPages;
