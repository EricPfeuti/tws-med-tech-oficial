import React from "react";
import logoMiniatura from "../../../../assets/images/logoMiniaturaTWSMedTech.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";

export default function FormSignDoctor() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const navigate = useNavigate();

  async function handleSign(e) {
    e.preventDefault();
    try {
      const resp = await api.post(
        "/signDoctor",
        { doctorName, doctorPassword },
        { withCredentials: true }
      );

      if (resp.status === 201 || resp.status === 200) {
        navigate("/loginDoctor");
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
        <h2>Nova Conta Médico - TWSMedTech</h2>
      </section>

      <form onSubmit={handleSign} id="form" class="form">
        <div class="form-content">
          <label for="doctorName">Nome:</label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="Digite seu nome:"
            required
          />
        </div>
        <div class="form-content">
          <label for="doctorPassword">Senha:</label>
          <input
            type="password"
            value={doctorPassword}
            onChange={(e) => setDoctorPassword(e.target.value)}
            placeholder="Digite a sua senha:"
            required
          />
        </div>
        <p>
          Já possui uma conta? <a href="/loginDoctor">Login</a>
        </p>
        <button type="submit">CADASTRAR</button>
      </form>
    </div>
  );
}
