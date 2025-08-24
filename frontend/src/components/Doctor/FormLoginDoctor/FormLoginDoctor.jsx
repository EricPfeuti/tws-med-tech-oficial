import React from "react";
import logoMiniatura from "../../../assets/images/logoMiniaturaTWSMedTech.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import api from "../../../api/api";

export default function FormLoginDoctor() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const navigate = useNavigate();
  const { setDoctor } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post(
        "/loginDoctor",
        { doctorName, doctorPassword },
        { withCredentials: true }
      );

      if (res.data.sucesso) {
        setDoctor({ name: res.data.doctorName });
        navigate("/doctor");
      } else {
        navigate("/erro");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      navigate("/erro");
    }
  }

  return (
    <div class="container-form">
      <section class="container-header">
        <img src={logoMiniatura} alt="Logo Miniatura" />
        <h2>Login Médico - TWSMedTech</h2>
      </section>

      <form onSubmit={handleLogin} id="form" class="form">
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
          Não tem uma conta? <a href="/signDoctor">Cadastrar</a>
        </p>
        <button type="submit">FAZER LOGIN</button>
      </form>
    </div>
  );
}
