import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "./axiosConfig";
import fetchUserSubmissionStatus from './SubbmisionApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearError = () => setError(null);

    const fetchAndSetSubmissionStatus = async () => {
        if (!user?.userId) {
            console.warn("Cannot fetch submission status: no user ID available");
            return null;
        }
        
        console.log("User ID przekazywane do fetchUserSubmissionStatus:", user?.userId);
        try {
            const statusData = await fetchUserSubmissionStatus(user?.userId);
            console.log('Fetched submission status from API:', statusData);
            
            if (statusData) {
                setSubmissionStatus(statusData.status);
                setSubmissionDetails(statusData);
                return statusData;
            }
            return null;
        } catch (error) {
            console.error("Error fetching submission status:", error);
            return null;
        }
    };
    

    const fetchUserData = async (token) => {
        if (!token) {
            console.warn("Fetch user data skipped: no token provided.");
            return null;
        }
        try {
            const response = await axiosInstance.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Fetch user data error:", error);
            throw new Error("Unable to fetch user data.");
        }
    };

    const login = async (email, password) => {
        clearError();
        try {
            const response = await axiosInstance.post("/auth/authenticate", { email, password });
            const { accessToken, refreshToken } = response.data;

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setIsAuthenticated(true);

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            const data = await fetchUserData(accessToken);
            setUser(data);
        } catch (error) {
            setError("Login failed. Please check your credentials.");
            console.error("Login error:", error);
        }
    };

    const logout = () => {
        clearError();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setSubmissionStatus(null);
        setSubmissionDetails(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    const refresh = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        try {
            const response = await axiosInstance.post("/auth/refresh", { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            setAccessToken(accessToken);
            setRefreshToken(newRefreshToken);

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            const data = await fetchUserData(accessToken);
            setUser(data);
        } catch (error) {
            setError("Session expired. Please log in again.");
            logout();
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchUserData(accessToken)
                .then((data) => {
                    setUser(data);
                    console.log("User data fetched:", data);
                })
                .catch(() => logout());
        }
    }, [accessToken]);
    

    useEffect(() => {
        if (user && user.userId) {
            console.log("Fetching submission status for user:", user.userId);
            fetchAndSetSubmissionStatus().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);
    
    return (
        <AuthContext.Provider
            value={{ 
                isAuthenticated, 
                user, 
                submissionStatus, 
                submissionDetails,
                accessToken, 
                login, 
                logout, 
                refresh, 
                error, 
                clearError, 
                loading,
                fetchAndSetSubmissionStatus  
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);