import React from "react";
import "./Header.css";
import logo from "../../assets/images/logoTWSMedTechPreto.png";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <a href="#">
          <img src={logo} alt="TWS MedTech" className="logo" />
        </a>
        <nav className="navbar desktop-nav">
          <a href="#servicos">Serviços</a>
          <a href="#membros">Quem somos</a>
          <a href="#area-medico">Área do médico</a>
        </nav>
      </div>
      <div className="header-right">
        <div id="btn-entrar">
          <a href="#">
            <button>
              <i class="bi bi-person-fill"></i> Entrar
            </button>
          </a>
        </div>
        {/* Botão Menu Hambúrguer */}
        <button
          className="menu-btn mobile-only"
          onClick={() => setMenuOpen(true)}
        >
          <i className="bi bi-list"></i>
        </button>
      </div>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          <i className="bi bi-x"></i>
        </button>
        <nav className="navbar mobile-nav">
          <a href="#servicos" onClick={() => setMenuOpen(false)}>
            Serviços
          </a>
          <a href="#quem-somos" onClick={() => setMenuOpen(false)}>
            Quem somos
          </a>
          <a href="#area-medico" onClick={() => setMenuOpen(false)}>
            Área do médico
          </a>
          <a href="#" id="mobile-login" onClick={() => setMenuOpen(false)}>
            <i className="bi bi-person-fill"></i> Entrar
          </a>
        </nav>
      </div>

      {/* Overlay para fechar clicando fora */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}
