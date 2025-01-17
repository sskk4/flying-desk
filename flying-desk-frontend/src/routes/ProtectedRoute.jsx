import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  allowedStatuses = [],
  isBecomeOwner = false,
}) => {
  const { isAuthenticated, user, submissionStatus, loading } = useAuth();

  console.log("Auth context debug:", {
    isAuthenticated,
    user,
    submissionStatus,
    role: user?.role?.toUpperCase(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Specjalna logika dla /become-owner
  if (isBecomeOwner) {
    if (submissionStatus === "PENDING") {
      return <Navigate to="/waiting-status" />;
    }
    if (submissionStatus === "REJECTED") {
      return <Navigate to="/rejected" />;
    }
    if (user?.role?.toUpperCase() === "ADMIN" || user?.role?.toUpperCase() === "OWNER") {
      return <Navigate to="/owner" />;
    }
    return children;
  }

  // Warunek dla ról
  if (
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role.toUpperCase()))
  ) {
    console.log("Role mismatch or missing role:", user?.role);
    return <Navigate to="/error-403" />;
  }

  // Warunek dla statusów
  if (
    allowedStatuses.length > 0 &&
    !allowedStatuses.includes(submissionStatus) &&
    user?.role?.toUpperCase() !== "ADMIN"
  ) {
    console.log("Status mismatch:", { submissionStatus });
    return <Navigate to="/error-403" />;
  }

  return children;
};

export default ProtectedRoute;
