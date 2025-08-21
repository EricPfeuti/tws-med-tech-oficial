import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import api from "../../../api/api";

export default function Patient() {
  const { patient, setPatient } = useAuth();
  const navigate = useNavigate();

  async function handleLogoutPatient() {
    try {
      await api.post("/logoutPatient", {}, { withCredentials: true });
      setPatient(null);
      navigate("/loginPatient");
    } catch (err) {
      console.error("Erro no logout:", err);
      alert("Erro ao sair da conta");
    }
  }

  return (
    <div>
      <h1>Área do Paciente</h1>
      <p>Bem-vindo, Paciente {patient.name} ao seu painel!</p>
      <button onClick={handleLogoutPatient}>SAIR</button>
    </div>
  );
}
