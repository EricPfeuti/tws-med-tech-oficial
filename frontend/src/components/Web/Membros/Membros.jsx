import React from "react";
import EricImg from "../../../assets/images/EricImage.png";
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
            <img src={EricImg} alt="Rafa Img" />
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
        </div><br />
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
            <img src={EricImg} alt="Rafa Img"/>
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
        </div>
      </div>
    </section>
  );
}
