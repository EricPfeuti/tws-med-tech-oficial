import React from "react";
import "./Header.css";
import { useState } from "react";
import logo from "../../assets/images/logoTWSMedTechPreto.png";
import api from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function HeaderPatient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { patient, setPatient } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/logoutPatient", {}, { withCredentials: true });
      setPatient(null);
      navigate("/loginPatient");
    } catch (err) {
      console.error("Erro no logout:", err);
      alert("Erro ao sair da conta");
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <a href="#">
          <img src={logo} alt="TWS MedTech" className="logo" />
        </a>
        <nav className="navbar desktop-nav">
          <a href="#servicos">Serviços</a>
          <a href="#membros">Quem somos</a>
          <a href="/signDoctor">Área do médico</a>
        </nav>
      </div>
      <div className="header-right">
        <div id="btn-perfil">
          <a href="#">
            <button onClick={handleLogout}>
              <i class="bi bi-person-fill"></i>
            </button>
          </a>
        </div>
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
          <a href="#funcionalidades" onClick={() => setMenuOpen(false)}>
            Serviços
          </a>
          <a href="#membros" onClick={() => setMenuOpen(false)}>
            Quem somos
          </a>
          <a href="/signDoctor" onClick={() => setMenuOpen(false)}>
            Área do médico
          </a>
          <a
            href="/patient"
            id="mobile-login"
            onClick={() => setMenuOpen(false)}
          >
            <i className="bi bi-person-fill"></i> Perfil
          </a>
        </nav>
      </div>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}