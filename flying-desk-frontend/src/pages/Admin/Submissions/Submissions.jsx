import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../../services/AuthProvider';


const Submissions = () => {
    const { accessToken } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/submissions`, {
                    params: { page, size, sort: "createdAt,desc" },
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setSubmissions(response.data.content); // Przyjęto, że API zwraca paginowany wynik
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("Error fetching submissions:", err);
                setError("Failed to load submissions.");
            }
        };
        fetchSubmissions();
    }, [accessToken, page, size]);

    const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
    const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

    if (error) return <p className="ap-error error-message">{error}</p>;

    return (
        <div className="submissions-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission) => (
                        <tr key={submission.id}>
                            <td>{submission.id}</td>
                            <td>{submission.firstName} {submission.lastName}</td>
                            <td>{submission.address}</td>
                            <td>{new Date(submission.createdAt).toLocaleString()}</td>
                            <td className={`status-${submission.status.toLowerCase()}`}>
                                {submission.status}
                            </td>
                            <td>
                                <button className="create-button" onClick={() => navigate(`/admin-fd/submissions/${submission.id}`)}>Details</button>

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


export default Submissions;
