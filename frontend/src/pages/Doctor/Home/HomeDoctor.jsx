import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function Doctor() {
  const { doctor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();          
    navigate("/loginDoctor"); 
  };

  if (!doctor) return <p>Carregando...</p>

  return (
    <div>
      <h1>Área do Médico</h1>
      <p>Bem-vindo, Dr. {doctor.name} ao seu painel!</p>
      <button onClick={handleLogout}>SAIR</button>
    </div>
  );
}
