import React from "react";
import EricImg from "../../../assets/images/EricImage.png";
import LeoImg from "../../../assets/images/LeoImage.png";
import MatheusImg from "../../../assets/images/MatheusImage.png";
import RafaelImg from "../../../assets/images/RafaelImage.png";
import EmanuelImg from "../../../assets/images/EmanuelImage.png";
import "./Membros.css";

export default function Membros() {
  return (
    <section id="membros" className="membros">
      <h1 id="titulo">
        QUEM <span>SOMOS</span>
      </h1><br />
      <div className="container-membros">
        <div className="row">
          <div className="membro">
            <img src={EricImg} alt="Eric Img" />
            <h2>Eric Pfeuti</h2>
            <div className="btn-social">
              <a href="#">
                <button>
                  <i class="bi bi-instagram"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-linkedin"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-github"></i>
                </button>
              </a>
            </div>
          </div>
          <div className="membro">
            <img src={LeoImg} alt="Leo Img" />
            <h2>Leonardo Duarte</h2>
            <div className="btn-social">
              <a href="#">
                <button>
                  <i class="bi bi-instagram"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-linkedin"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-github"></i>
                </button>
              </a>
            </div>
          </div>
          <div className="membro">
            <img src={RafaelImg} alt="Rafa Img" />
            <h2>Rafael Sá</h2>
            <div className="btn-social">
              <a href="#">
                <button>
                  <i class="bi bi-instagram"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-linkedin"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-github"></i>
                </button>
              </a>
            </div>
          </div>
        </div><br />
        <div className="row">
          <div className="membro">
            <img src={MatheusImg} alt="Matheus Img" />
            <h2>Matheus Santos</h2>
            <div className="btn-social">
              <a href="#">
                <button>
                  <i class="bi bi-instagram"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-linkedin"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-github"></i>
                </button>
              </a>
            </div>
          </div>
          <div className="membro">
            <img src={EmanuelImg} alt="Emanuel Img"/>
            <h2>Emanuel Domingues</h2>
            <div className="btn-social">
              <a href="#">
                <button>
                  <i class="bi bi-instagram"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-linkedin"></i>
                </button>
              </a>
              <a href="#">
                <button>
                  <i class="bi bi-github"></i>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
