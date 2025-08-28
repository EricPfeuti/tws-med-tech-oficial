import React from "react";
import logoMiniatura from "../../../../assets/images/logoMiniaturaTWSMedTech.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";

export default function FormSignPatient() {
  const [patientName, setPatientName] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignPatient(e) {
    e.preventDefault();
    try {
      const resp = await api.post(
        "/signPatient",
        { patientName, patientPassword },
        { withCredentials: true }
      );

      if (resp.status === 201 || resp.status === 200) {
        navigate("/loginPatient");
      } else {
        navigate("/erro");
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div class="container-form">
      <section class="container-header">
        <img src={logoMiniatura} alt="Logo Miniatura" />
        <h2>Nova Conta Paciente - TWSMedTech</h2>
      </section>

      <form onSubmit={handleSignPatient} id="form" class="form">
        <div class="form-content">
          <label for="patientName">Nome:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Digite seu nome:"
            required
          />
        </div>
        <div class="form-content">
          <label for="patientPassword">Senha:</label>
          <input
            type="password"
            value={patientPassword}
            onChange={(e) => setPatientPassword(e.target.value)}
            placeholder="Digite a sua senha:"
            required
          />
        </div>
        <p>
          Já possui uma conta? <a href="/loginPatient">Login</a>
        </p>
        <button type="submit">CADASTRAR</button>
      </form>
    </div>
  );
}