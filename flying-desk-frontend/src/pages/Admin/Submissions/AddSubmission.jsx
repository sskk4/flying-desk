import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../services/AuthProvider';


const SubmissionsAdd = () => {
    const { accessToken, user } = useAuth();

    

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        country: '',
        address: '',
        buildingName: '',
        buildingDescription: '',
    });

    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB
        const validFiles = selectedFiles.filter((file) => file.size <= maxSize);

        if (validFiles.length !== selectedFiles.length) {
            setError('Some files exceed the maximum size of 5MB and were excluded.');
        }

        setFiles(validFiles);
    };

    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            country: '',
            address: '',
            buildingName: '',
            buildingDescription: '',
        });
        setFiles([]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        if (!accessToken) {
            setError('Authorization error: No access token available.');
            setLoading(false);
            return;
        }
    
        if (!user || !user.userId) {
            setError('Authorization error: No user information available.');
            setLoading(false);
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('submission', new Blob([JSON.stringify(formData)], { type: 'application/json' })); // Dodaj część jako JSON
        files.forEach((file) => formDataToSend.append('files', file)); // Dodaj pliki
    
        try {
            await axios.post('http://localhost:8081/api/v1/submissions', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-User-Id': user.userId,
                },
            });
            navigate('/admin-fd/submissions');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please log in again.');
            } else {
                setError('Something went wrong. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <div className="ap-form-container">
        
            <form onSubmit={handleSubmit} className="ap-form">

            <h2 className="ap-h2"> User information </h2>

                <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
                <hr className="ap-hr"></hr>
                <input
                    name="phone"
                    type="text"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                                <hr className="ap-hr"></hr>

                                <h2 className="ap-h2"> Building information </h2>

                <input
                    name="country"
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="address"
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                />
                                <hr className="ap-hr"></hr>
                                
                <input
                    name="buildingName"
                    type="text"
                    placeholder="Building Name"
                    value={formData.buildingName}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="buildingDescription"
                    placeholder="Building Description"
                    value={formData.buildingDescription}
                    onChange={handleInputChange}
                    required
                />
                            
            
                <hr className="ap-hr"></hr>
                <h2 className="ap-h2"> Photos of offices and documents allowing for rental </h2>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
                <hr className="ap-hr"></hr>
                {error && <p className="error-message ap-error">{error}</p>}
                <button type="submit" className="login-button">
                    Create
                </button>
                <button type="button" onClick={handleReset} className="create-button ap-create-button">
                    Reset
                </button>
            </form>
        </div>
    );
};

export default SubmissionsAdd;
