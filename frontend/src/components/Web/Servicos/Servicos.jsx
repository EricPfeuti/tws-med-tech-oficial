import React from "react";
import "./Servicos.css";

export default function Servicos() {
  return (
    <section id="servicos" className="servicos">
        <h1 id="titulo">
            NOSSOS <span>SERVIÇOS</span>.
        </h1><br />
        <div className="container-grid-cards-servicos">
            <div className="card">
                <div className="bg">
                    <h2>Teleconsultas</h2>
                    <p>
                        Consultas em tempo real com médicos cardiologistas.
                    </p><br />
                    <div className="circles">
                        <div className="circle">
                            Consulta Médica
                        </div>
                        <div className="circle">
                            Videoconferência
                        </div>
                        <div className="circle">
                            Tecnologia
                        </div>
                    </div>
                </div><br />
                <div id="btn-saiba-mais">
                    <a href="#"><button>SAIBA MAIS</button></a>
                </div>
            </div>
            <div className="card">
                <div className="bg">
                    <h2>Chat disponível</h2>
                    <p>
                        Chat disponível entre médico e paciente.
                    </p><br />
                    <div className="circles">
                        <div className="circle">
                            Bate-papo
                        </div>
                        <div className="circle">
                            Cliente
                        </div>
                        <div className="circle">
                            Atendimento
                        </div>
                    </div>
                </div><br />
                <div id="btn-saiba-mais">
                    <a href="#"><button>SAIBA MAIS</button></a>
                </div>
            </div>
            <div className="card">
                <div className="bg">
                    <h2>Histórico do Chat</h2>
                    <p>
                        Histórico do chat disponível, entre outras funcionalidades.
                    </p><br />
                    <div className="circles">
                        <div className="circle">
                            Registro
                        </div>
                        <div className="circle">
                            Mensagens
                        </div>
                        <div className="circle">
                            Armazenamento
                        </div>
                    </div>
                </div><br />
                <div id="btn-saiba-mais">
                    <a href="#"><button>SAIBA MAIS</button></a>
                </div>
            </div>
        </div>
    </section>

  )
}