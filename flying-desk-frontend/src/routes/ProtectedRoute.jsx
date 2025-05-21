import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  allowedStatuses = [],
  allowedSubmissionStatuses = [],
  isBecomeOwner = false,
  isForCustomer = false,
}) => {
  const { isAuthenticated, user, submissionStatus, submissionDetails, loading } = useAuth();

  console.log("Protected Route debug:", {
    isAuthenticated,
    user,
    submissionStatus,
    submissionDetails,
    role: user?.role,
    isBecomeOwner,
    allowedRoles,
    allowedStatuses,
    allowedSubmissionStatuses
  });

  if (loading || (isAuthenticated && !user)) {
    console.log("Still loading user data...");
    return <div><h2 className="fancy-text"> Loading...</h2></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isBecomeOwner) {
    if (submissionStatus === "PENDING") {
      return <Navigate to="/waiting-status" />;
    }
    if (submissionStatus === "REJECTED") {
      return <Navigate to="/rejected" />;
    }
    if (user?.role === "OWNER" || user?.role === "ADMIN") {
      return <Navigate to="/owner" />;
    }
    return children;
  }

  if (
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role))
  ) {
    console.log("Role access denied. User role:", user?.role, "Allowed roles:", allowedRoles);
    return <Navigate to="/error-403" />;
  }

  if (
    allowedSubmissionStatuses?.length > 0 &&
    (!submissionStatus || !allowedSubmissionStatuses.includes(submissionStatus)) &&
    user?.role !== "ADMIN"
  ) {
    console.log("Submission status check failed:", {
      userSubmissionStatus: submissionStatus,
      allowedSubmissionStatuses
    });
    return <Navigate to="/error-403" />;
  }

  if (
    allowedStatuses.length > 0 &&
    (!submissionStatus || !allowedStatuses.includes(submissionStatus)) &&
    user?.role !== "ADMIN"
  ) {
    console.log("Status check failed:", {
      userStatus: submissionStatus,
      allowedStatuses
    });
    return <Navigate to="/error-403" />;
  }

  return children;
};

export default ProtectedRoute;