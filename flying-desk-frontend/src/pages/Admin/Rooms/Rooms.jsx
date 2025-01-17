import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../services/AuthProvider';

const Rooms = () => {
    const { accessToken } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/room`, {
                    params: { page, size, sort: "creationDate,desc" },
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setRooms(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("Error fetching rooms:", err);
                setError("Failed to load rooms.");
            }
        };
        fetchRooms();
    }, [accessToken, page, size]);

    const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
    const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

    if (error) return <p className="ap-error error-message">{error}</p>;

    return (
        <div className="rooms-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Equipment</th>
                        <th>Building</th>
                        <th>Description</th>
                        <th>Max Occupants</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id}>
                            <td>{room.id}</td>
                            <td>{room.room}</td>
                            <td>{room.equipment}</td>
                            <td>{room.building.building}</td>
                            <td>{room.description}</td>
                            <td>{room.maxOccupants}</td>
                            <td className={`status-${room.status.toLowerCase()}`}>
                                {room.status}
                            </td>
                            <td>
                                <button className="create-button" onClick={() => navigate(`/admin-fd/rooms/${room.id}`)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="ap-pagination-controls">
                <button className="ap-paggination-button ap-p-b-left" onClick={goToPreviousPage} disabled={page === 0}>Previous</button>
                <span className="ap-paggination-text">Page {page + 1} of {totalPages}</span>
                <button className="ap-paggination-button ap-p-b-right" onClick={goToNextPage} disabled={page === totalPages - 1}>Next</button>
            </div>
        </div>
    );
};

export default Rooms;
