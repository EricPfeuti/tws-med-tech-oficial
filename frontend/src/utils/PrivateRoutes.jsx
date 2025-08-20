import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

export default function PrivateRoute({ children }) {
  const { doctor, loading } = useContext(DoctorContext);

  if (loading) return <p>Carregando...</p>;

  if (!doctor) {
    return <Navigate to="/loginDoctor" replace />;
  }

  return children;
}