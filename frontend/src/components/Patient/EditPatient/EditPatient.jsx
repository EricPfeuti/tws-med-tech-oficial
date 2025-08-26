import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoMiniatura from "../../../assets/images/logoMiniaturaTWSMedTech.png";
import useAuth from "../../../hooks/useAuth";

export default function EditPatient() {
  const { patient, editPatient, logoutPatient } = useAuth();
  const [newName, setNewName] = useState(patient?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await editPatient(newName);
      if (res.sucesso) {
        setMessage("Nome atualizado com sucesso!");
        setTimeout(() => navigate("/patient"), 1500);
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
      await logoutPatient();
      navigate("/loginPatient");
    } catch (err) {
      console.error("Erro no logout:", err);
      alert("Erro ao sair da conta");
    }
  };

  if (!patient) {
    return <div>Carregando dados do paciente...</div>;
  }

  return (
    <section id="formulario-editar" className="formulario-editar">
        <div className="container-form">
            <section class="container-header">
            <img src={logoMiniatura} alt="Logo Miniatura" />
            <h2>Editar Dados Paciente - TWSMedTech</h2>
            </section>
            <form onSubmit={handleSubmit} id="form" className="form">
            <div className="form-content">
                <label for="name">Insira aqui seu novo nome:</label>
                <input
                id="name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
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
