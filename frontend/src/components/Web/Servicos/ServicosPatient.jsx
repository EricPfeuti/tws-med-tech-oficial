import React, { useState, useEffect } from "react";
import "./Servicos.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import api from "../../../api/api";

export default function ServicosPatient() {
  const { patient } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get("/api/allowed-meetings", {
          withCredentials: true,
        });
        if (res.data.sucesso) {
          setMeetings(res.data.collectionReunioes);
        }
      } catch (err) {
        console.error("Erro ao buscar reuniões:", err);
      }
    };

    fetchMeetings();
  }, []);

  const handleJoin = (roomName) => {
    navigate(`/meeting/${roomName}`);
  };

  return (
    <section id="servicos" className="servicos">
      <h1 id="titulo">
        NOSSOS <span>SERVIÇOS</span>.
      </h1>
      <br />
      <div className="container-grid-cards-servicos">
        <div style={{ maxWidth: "600px", margin: "50px auto" }}>
          <h2>Reuniões disponíveis para {patient?.name}</h2>
          {meetings.length === 0 && <p>Nenhuma reunião disponível</p>}
          <ul>
            {meetings.map((room) => (
              <li key={room.roomName} style={{ marginBottom: "10px" }}>
                <span>{room.roomName}</span>
                <button
                  onClick={() => handleJoin(room.roomName)}
                  style={{ marginLeft: "10px" }}
                >
                  Entrar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="bg">
            <h2>Chat disponível</h2>
            <p>Chat disponível entre médico e paciente.</p>
            <br />
            <div className="circles">
              <div className="circle">Bate-papo</div>
              <div className="circle">Cliente</div>
              <div className="circle">Atendimento</div>
            </div>
          </div>
          <br />
          <div id="btn-saiba-mais">
            <a href="#">
              <button>SAIBA MAIS</button>
            </a>
          </div>
        </div>
        <div className="card">
          <div className="bg">
            <h2>Histórico do Chat</h2>
            <p>Histórico do chat disponível, entre outras funcionalidades.</p>
            <br />
            <div className="circles">
              <div className="circle">Registro</div>
              <div className="circle">Mensagens</div>
              <div className="circle">Armazenamento</div>
            </div>
          </div>
          <br />
          <div id="btn-saiba-mais">
            <a href="#">
              <button>SAIBA MAIS</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
