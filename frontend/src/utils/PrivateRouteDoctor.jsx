import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function PrivateRouteDoctor({ children }) {
  const { doctor, loading } = useContext(UserContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return doctor ? children : <Navigate to="/loginDoctor" />;
}