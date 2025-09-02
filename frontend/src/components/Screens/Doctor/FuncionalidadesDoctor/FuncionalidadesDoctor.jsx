import React, { useState } from "react";
import "./FuncionalidadesDoctor.css";
import api from "../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function FuncionalidadesDoctor() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("meetings/create", {}, { withCredentials: true });
      
      if (res.data.sucesso) {
        const { roomName } = res.data.meeting;
        navigate(`/doctor/meeting/${roomName}`);
      }
    } catch (err) {
      console.error("Erro ao criar reunião:", err);
      alert("Erro ao criar reunião. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="funcionalidades" className="funcionalidades">
      <h1 id="titulo">
        FUNCIONALIDADES <span>.</span>
      </h1>
      <br />
      <br />
      <div className="container-grid-funcionalidades">
        <div className="card">
          <i class="bi bi-camera-video-fill"></i>
          <br />
          <br />
          <h2>Teleconsulta</h2>
          <p>
            Comece agora uma teleconsulta com um de seus pacientes, em tempo
            real.
          </p>
          <div id="btn-vermelho">
            <form onSubmit={handleCreateMeeting}>
              <button type="submit" id="btn-vermelho" disabled={loading}>{loading ? "Criando..." : "Criar Consulta"}</button>
            </form>
          </div>
        </div>
        <div className="card">
          <i class="bi bi-calendar-week-fill"></i>
          <br />
          <br />
          <h2>Calendário</h2>
          <p>Verifique o calendário de consultas com outros pacientes.</p>
          <div id="btn-vermelho">
            <a href="#">
              <button>COMEÇAR</button>
            </a>
          </div>
        </div>
        <div className="card">
          <i class="bi bi-chat-left-text-fill"></i>
          <br />
          <br />
          <h2>Chat</h2>
          <p>Chat entre médico e paciente com histórico de mensagens.</p>
          <div id="btn-vermelho">
            <a href="/doctor/patients">
              <button>COMEÇAR</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
