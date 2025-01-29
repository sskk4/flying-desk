import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../services/AuthProvider';

const Desks = () => {
    const { accessToken } = useAuth();
    const [desks, setDesks] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDesks = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/building/desk`, {
                    params: { page, size, sort: "creationDate,desc" },
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setDesks(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("Error fetching desks:", err);
                setError("Failed to load desks.");
            }
        };
        fetchDesks();
    }, [accessToken, page, size]);

    const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
    const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

    if (error) return <p className="ap-error error-message">{error}</p>;

    return (
        <div className="desks-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Equipment</th>
                        <th>Building</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {desks.map((desk) => (
                        <tr key={desk.id}>
                            <td>{desk.id}</td>
                            <td>{desk.desk}</td>
                            <td>{desk.equipment}</td>
                            <td>{desk.building.building}</td>
                            <td>{desk.description}</td>
                            <td>{desk.price ? `$${desk.price.toFixed(2)}` : "N/A"}</td>
                            <td className={`status-${desk.status.toLowerCase()}`}>
                                {desk.status}
                            </td>
                            <td>
                                <button className="create-button" onClick={() => navigate(`/admin-fd/desks/${desk.id}`)}>Details</button>
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

export default Desks;
