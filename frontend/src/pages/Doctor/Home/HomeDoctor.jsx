import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import api from "../../../api/api";

export default function Doctor() {
  const { doctor, setDoctor } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/logoutDoctor", {}, { withCredentials: true });
      setDoctor(null);
      navigate("/loginDoctor");
    } catch (err) {
      console.error("Erro no logout:", err);
      alert("Erro ao sair da conta");
    }
  }

  return (
    <div>
      <h1>Área do Médico</h1>
      <p>Bem-vindo, Dr. {doctor.name} ao seu painel!</p>
      <button onClick={handleLogout}>SAIR</button>
    </div>
  );
}
