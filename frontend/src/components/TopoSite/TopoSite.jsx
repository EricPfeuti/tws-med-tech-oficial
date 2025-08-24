import React from "react";
import estetoscopioImg from "../../assets/images/estetoscopia-img.png";
import "./TopoSite.css";

export default function TopoSite() {
  return (
    <section id="topo-do-site" className="topo-do-site">
        <div className="interface">
            <div className="flex">
                <div className="txt-topo-site">
                    <h1>
                        CONSULTAS ONLINE com <span>CARDIOLOGISTAS</span>.
                    </h1>
                    <p>
                        Venha conhecer a plataforma da fundação TWSMedTech para médicos
                        cardiologistas particulares. Aqui você terá uma pré versão do que
                        será a plataforma, neste momento com teleconsultas e histórico do
                        chat da sua teleconsulta.
                    </p>
                    <div id="btn-vermelho">
                        <a href="#servicos">
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
