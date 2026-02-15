import React, { useEffect, useState } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refreshToken, fetchUserProfile } =
    useAuthStore();

  console.log("ProtectedRoute - accessToken:", accessToken);
  console.log("ProtectedRoute - user:", user);

  const [starting, setStarting] = useState(true);

  const init = async () => {
    if (!accessToken) {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
    if (accessToken && !user) {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;
