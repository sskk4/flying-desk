import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../services/AuthProvider';

const Buildings = () => {
    const { accessToken } = useAuth();
    const [buildings, setBuildings] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/building`, {
                    params: { page, size, sort: "creationDate,desc" },
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setBuildings(response.data.content); // Zakładamy, że API zwraca paginowany wynik
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("Error fetching buildings:", err);
                setError("Failed to load buildings.");
            }
        };
        fetchBuildings();
    }, [accessToken, page, size]);

    const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
    const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

    if (error) return <p className="ap-error error-message">{error}</p>;

    return (
        <div className="buildings-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Address</th>
                        <th>Creation Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {buildings.map((building) => (
                        <tr key={building.id}>
                            <td>{building.id}</td>
                            <td>{building.building}</td>
                            <td>{building.description}</td>
                            <td>
                                {building.address.address}, {building.address.city.city}, {building.address.city.country.country}
                            </td>
                            <td>{new Date(building.creationDate).toLocaleString()}</td>
                            <td className={`status-${building.status.toLowerCase()}`}>
                                {building.status}
                            </td>
                            <td>
                                <button className="create-button" onClick={() => navigate(`/admin-fd/buildings/${building.id}`)}>Details</button>
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

export default Buildings;
