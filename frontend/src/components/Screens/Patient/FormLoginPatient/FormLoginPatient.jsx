import React from "react";
import logoMiniatura from "../../../../assets/images/logoMiniaturaTWSMedTech.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import api from "../../../../api/api";

export default function FormLoginPatient() {
  const [patientName, setPatientName] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const navigate = useNavigate();
  const { setPatient } = useAuth();

  async function handleLoginPatient(e) {
    e.preventDefault(); 
        try {
            const res = await api.post("/loginPatient", { patientName, patientPassword }, { withCredentials: true });

            if(res.data.sucesso) {
                setPatient({ name: res.data.patientName });
                navigate("/patient");
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
            <h2>Login Paciente - TWSMedTech</h2>
        </section>

        <form onSubmit={handleLoginPatient} id="form" className="form">
            <div class="form-content">
                <label for="patientName">Nome:</label>
                <input
                    type="text"
                    value={patientName}
                    onChange={(e)=> setPatientName(e.target.value)}
                    placeholder="Digite seu nome:"
                    required
                />
            </div>
            <div class="form-content">
                <label for="patientPassword">Senha:</label>
                <input
                    type="password"
                    value={patientPassword}
                    onChange={(e)=> setPatientPassword(e.target.value)}
                    placeholder="Digite a sua senha:"
                    required
                />
            </div>
            <p>
            Não tem uma conta? <a href="/signPatient">Cadastrar</a>
            </p>
            <button type="submit">FAZER LOGIN</button>
        </form>
        </div>
    );
}