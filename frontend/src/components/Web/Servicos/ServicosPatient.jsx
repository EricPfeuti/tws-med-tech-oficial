import React from "react";
import "./Servicos.css";

export default function ServicosPatient() {

  return (
    <section id="servicos" className="servicos">
      <h1 id="titulo">
        NOSSOS <span>SERVIÇOS</span>.
      </h1>
      <br />
      <div className="container-grid-cards-servicos">
        <div className="card">
          <div className="bg">
            <h2>Organizar Consultas</h2>
            <p>Organizar suas consultas como uma agenda.</p>
            <br />
            <div className="circles">
              <div className="circle">Agenda</div>
              <div className="circle">Consultas</div>
              <div className="circle">Organização</div>
            </div>
          </div>
          <br />
          <div id="btn-saiba-mais">
            <a href="/patient/calendar">
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
            <a href="/patient/doctors">
              <button>SAIBA MAIS</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
