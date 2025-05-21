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
import DesksInBuilding from './Desks/DesksInBuilding';

import Rents from './Rents/Rents';
import RentDetails from './Rents/DetailsRent';

import Payments from './Payments/Payments';

import Users from './Users/Users';
import UserDetails from './Users/UserDetails';

import AdminPanelPhoto from '../../assets/png/giphy.gif';

const AdminPanel = () => {
    const views = {
        submissions: { title: 'Submissions', addButtonText: '+ Add Submission', addPath:"/admin-fd/submissions/add" },
        submissionsadd: {title: 'Add submission', addButtonText: 'Back', addPath:"/admin-fd/submissions"},
        submissiondetails: {title: 'Submission details', addButtonText: 'Back', addPath:"/admin-fd/submissions"},

        buildings: { title: 'Buildings', addButtonText: '+ Add Building', addPath:"/admin-fd/buildings/add"},
        buildingadd: { title: 'Add building', addButtonText: 'Back', addPath:"/admin-fd/buildings"},
        buildingdetails: { title: 'Building details', addButtonText: 'Back', addPath:"/admin-fd/buildings"},

        desks: { title: 'Desks', addButtonText: '+ Add Desk', addPath:"/admin-fd/buildings"},
        deskadd: { title: 'Add desk', addButtonText: 'Back', addPath:"/admin-fd/buildings/:buildingId/desks"},
        deskdetails: { title: 'Desk details', addButtonText: 'Back', addPath:"/admin-fd/desks"},

        rooms: { title: 'Rooms', addButtonText: '+ Add Room', addPath:"/admin-fd/buildings"  },
        roomadd: { title: 'Add rooom', addButtonText: 'Back', addPath:"/admin-fd/buildings/:buildingId/rooms"  },
        roomdetails: { title: 'Room details', addButtonText: 'Back', addPath:"/admin-fd/rooms" },

        rents: { title: 'Rents', addButtonText: '+ Add Rent', addPath:"/admin-fd/rents/add" },
        rentdetails: { title: 'Rent details', addButtonText: 'Back', addPath:"/admin-fd/rents" },
        
        payments: { title: 'Payments', addButtonText: '+ Add Payment', addPath:"/admin-fd/payments/add" },
        paymentadd: { title: 'Add payment', addButtonText: 'Back', addPath:"/admin-fd/payments" },
        paymentdetails: { title: 'Payment details', addButtonText: 'Back', addPath:"/admin-fd/payments" },
        
        users: { title: 'Users', addButtonText: '+ Add User', addPath:"/admin-fd/users/add" },
        useradd: { title: 'Add user', addButtonText: 'Back', addPath:"/admin-fd/users" },
        userdetails: { title: 'User details', addButtonText: 'Back', addPath:"/admin-fd/users" },
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
                    
                    {/* Submissions Routes */}
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

                    {/* Buildings Routes */}
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

                    {/* Desks Routes */}
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
                        path="/buildings/:buildingId/add-desk"
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
                        path="/buildings/:buildingId/desks"
                        element={
                            <>
                                <Header
                                    title="Desks in building"
                                    addButtonText="+ Add Desk"
                                    addPath={`/admin-fd/buildings/:buildingId/add-desk`}
                                />
                                <DesksInBuilding />
                            </>
                        }
                    />

                    {/* Rooms Routes */}
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

                    {/* Rents Routes */}
                    <Route
                        path="/rents"
                        element={
                            <>
                                <Header {...views.rents} />
                                <Rents />
                            </>
                        }
                    />
                    <Route
                        path="/rents/:id"
                        element={
                            <>
                                <Header {...views.rentdetails} />
                                <RentDetails />
                            </>
                        }
                    />

                    {/* Payments Routes */}
                    <Route
                        path="/payments"
                        element={
                            <>
                                <Header {...views.payments} />
                                <Payments />
                            </>
                        }
                    />


                    {/* Users Routes */}
                    <Route
                        path="/users"
                        element={
                            <>
                                <Header {...views.users} />
                                <Users />
                            </>
                        }
                    />
                    <Route
                        path="/users/:id"
                        element={
                            <>
                                <Header {...views.userdetails} />
                                <UserDetails />
                            </>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPanel;