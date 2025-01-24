import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './AdminSideBar';
import Header from './AdminHeader';

import Submissions from './Submissions/Submissions';
import SubmissionsAdd from './Submissions/AddSubmission';
import SubmissionDetails from './Submissions/SubmissionDetails';

import Buildings from './Buildings/Buildings';
import BuildingAdd from './Buildings/AddBuilding';
import BuildingDetails from './Buildings/BuildingDetails';

import Rooms from './Rooms/Rooms'; 
import RoomAdd from './Rooms/AddRoom'; 
import RoomDetails from './Rooms/RoomDetails'; 
import RoomsInBuilding from './Rooms/RoomsInBuilding';

import Desks from './Desks/Desks';
import DeskAdd from './Desks/AddDesk';
import DeskDetails from './Desks/DeskDetails';

import AdminPanelPhoto from '../../assets/png/giphy.gif';


// Importy dla innych komponentów jak Rooms, Payments itd.

const AdminPanel = () => {
    const views = {
        submissions: { title: 'Submissions', addButtonText: '+ Add Submission', addPath:"/admin-fd/submissions/add" },
        submissionsadd: {title: 'Add submission', addButtonText: 'Back', addPath:"/admin-fd/submissions"},
        submissiondetails: {title: 'Submission details', addButtonText: 'Back', addPath:"/admin-fd/submissions"},

        buildings: { title: 'Buildings', addButtonText: '+ Add Building', addPath:"/admin-fd/buildings/add"},
        buildingadd: { title: 'Add building', addButtonText: 'Back', addPath:"/admin-fd/buildings"},
        buildingdetails: { title: 'Building details', addButtonText: 'Back', addPath:"/admin-fd/buildings"},

        desks: { title: 'Desks', addButtonText: '+ Add Desk', addPath:"/admin-fd/desks/add"},
        deskadd: { title: 'Add desk', addButtonText: 'Back', addPath:"/admin-fd/desks"},
        deskdetails: { title: 'Desk details', addButtonText: 'Back', addPath:"/admin-fd/desks"},

        rooms: { title: 'Rooms', addButtonText: '+ Add Room', addPath:"/admin-fd/buildings"  },
        roomadd: { title: 'Add rooom', addButtonText: 'Back', addPath:"/admin-fd/buildings/:buildingId/rooms"  },
        roomdetails: { title: 'Room details', addButtonText: 'Back', addPath:"/admin-fd/rooms" },
    };

    return (
        <div className="admin-panel">
            <Sidebar />
            <div className="main-content">

                <Routes>

                    <Route path="/" element={

<div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0' 
}}>
    <img 
        src={AdminPanelPhoto} 
        alt="Admin Panel" 
        style={{
            width: '20%', 
            height: 'auto', 
            objectFit: 'contain' 
        }} 
    />
</div>
                    } />
                    <Route
                        path="/submissions"
                        element={
                            <>
                                <Header {...views.submissions} />
                                <Submissions />
                            </>
                        }
                    />
                    <Route
                        path="/submissions/add"
                        element={
                            <>
                                <Header {...views.submissionsadd} />
                                <SubmissionsAdd />
                            </>
                        }
                    />

                    <Route
                        path="/submissions/:id"
                        element={
                            <>
                                <Header {...views.submissiondetails} />
                                <SubmissionDetails />
                            </>
                        }
                    />


<Route
                        path="/buildings"
                        element={
                            <>
                                <Header {...views.buildings} />
                                <Buildings />
                            </>
                        }
                    />
                    <Route
                        path="/buildings/add"
                        element={
                            <>
                                <Header {...views.buildingadd} />
                                <BuildingAdd />
                            </>
                        }
                    />

                    <Route
                        path="/buildings/:id"
                        element={
                            <>
                                <Header {...views.buildingdetails} />
                                <BuildingDetails />
                            </>
                        }
                    />

<Route
                        path="/desks"
                        element={
                            <>
                                <Header {...views.desks} />
                                <Desks />
                            </>
                        }
                    />
                    <Route
                        path="/desks/add"
                        element={
                            <>
                                <Header {...views.deskadd} />
                                <DeskAdd />
                            </>
                        }
                    />

                    <Route
                        path="/desks/:id"
                        element={
                            <>
                                <Header {...views.deskdetails} />
                                <DeskDetails />
                            </>
                        }
                    />

<Route
                        path="/rooms"
                        element={
                            <>
                                <Header {...views.rooms} />
                                <Rooms />
                            </>
                        }
                    />
                    <Route
                        path="/buildings/:buildingId/add-room"
                        element={
                            <>
                                <Header {...views.roomadd} />
                                <RoomAdd />
                            </>
                        }
                    />

                    <Route
                        path="/rooms/:id"
                        element={
                            <>
                                <Header {...views.roomdetails} />
                                <RoomDetails />
                            </>
                        }
                    />
                    <Route
                        path="/buildings/:buildingId/rooms"
                        element={
                            <>
                                      <Header
                                        title="Rooms in building"
                                        addButtonText="+ Add Room"
                                        addPath={`/admin-fd/buildings/:buildingId/add-room`} 
                                    />
                                <RoomsInBuilding />
                            </>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPanel;
