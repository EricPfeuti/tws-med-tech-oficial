import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export default function PrivateRoute({ children }) {
  const { doctor, loading, patient } = useContext(UserContext);

  if (loading) return <p>Carregando...</p>;

  if (!doctor) {
    return <Navigate to="/loginDoctor" replace />;
  }

  if (!patient) {
    return <Navigate to="/loginPatient" replace />;
  }

  return children;
}