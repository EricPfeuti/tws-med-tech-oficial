import React from "react"; 
import estetoscopioImg from "../../../assets/images/estetoscopia-img.png";
import "./TopoSite.css";

export default function TopoSiteDoctor() {
    return (
        <section id="topo-do-site" className="topo-do-site">
            <div className="interface">
                <div className="flex">
                    <div className="txt-topo-site">
                        <h1>
                            CONHECA a ÁREA do <span>MÉDICO</span>.
                        </h1>
                        <p>
                            Aqui você pode começar reuniões com histórico especial do chat entre paciente, entre diversas outras funcionalidades para disponibilizar teleconsultas de alto nível.
                        </p>
                        <div id="btn-vermelho">
                            <a href="#funcionalidades">
                                <button type="button">CONHECER</button>
                            </a>
                        </div>
                    </div>
                    <div className="img-topo-site">
                        <img src={estetoscopioImg} alt="Estetoscopio" />
                    </div>
                </div>
            </div>
        </section>
    )
}