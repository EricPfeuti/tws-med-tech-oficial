import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import logoMiniatura from "../../../../assets/images/logoMiniaturaTWSMedTech.png";

export default function EditDoctor() {
  const { doctor, editDoctor, logoutDoctor } = useAuth();
  const [newDoctorName, setNewNameDoctor] = useState(doctor?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await editDoctor(newDoctorName)
      if (res.data.sucesso) {
        setMessage("Nome atualizado com sucesso!");
        setTimeout(() => navigate("/doctor"), 1500);
      } else {
        setMessage("Erro ao atualizar nome.");
      }
    } catch (err) {
      setMessage("Erro ao atualizar nome.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutDoctor();
      navigate("/loginDoctor");
    } catch (err) {
      console.error("Erro no logout:", err);
      alert("Erro ao sair da conta");
    }
  };

  if (!doctor) {
    return <div>Carregando dados do médico...</div>;
  }

  return (
    <section id="formulario-editar" className="formulario-editar">
      <div className="container-form">
        <section class="container-header">
          <img src={logoMiniatura} alt="Logo Miniatura" />
          <h2>Editar Dados Médico - TWSMedTech</h2>
        </section>
        <form onSubmit={handleSubmit} id="form" className="form">
          <div className="form-content">
            <label for="name">Insira aqui seu novo nome:</label>
            <input
              id="name"
              type="text"
              value={newDoctorName}
              onChange={(e) => setNewNameDoctor(e.target.value)}
              required
            />
          </div>
          <button>{loading ? "Salvando..." : "SALVAR ALTERAÇÕES"}</button>
          <button type="button" onClick={handleLogout}>
            SAIR
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </section>
  );
}
