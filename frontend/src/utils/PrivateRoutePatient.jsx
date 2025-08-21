import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function PrivateRoutePatient({ children }) {
  const { patient, loading } = useContext(UserContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return patient ? children : <Navigate to="/loginPatient" />;
}