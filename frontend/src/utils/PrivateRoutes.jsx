import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"

export default function PrivateRoute({ children }) {
  const { doctor, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  return doctor ? children : <Navigate to="/loginDoctor" replace />;
}