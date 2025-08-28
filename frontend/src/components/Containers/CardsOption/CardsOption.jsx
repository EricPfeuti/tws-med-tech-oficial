import React from "react";
import "./CardsOption.css";

export default function CardsOption() {
    return (

        <section className="cards-option">
            <h1 id="titulo">ESCOLHA de <span>ÁREA</span>.</h1><br />
            <div className="cards-option-container">
                <div className="card-option">
                    <i class="bi bi-person-video"></i>
                    <h2>Área do Paciente</h2>
                    <a href="/signPatient" id="btn-vermelho">
                        <button>CADASTRAR</button>
                    </a>
                </div>
                <div className="card-option">
                    <i class="bi bi-clipboard2-pulse-fill"></i>
                    <h2>Área do Médico</h2>
                    <a href="/signDoctor" id="btn-vermelho">
                        <button>CADASTRAR</button>
                    </a>
                </div>
            </div>
        </section>

    )
}