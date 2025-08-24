import React, { useContext, useEffect, useState } from "react";
import api from "../../../api/api"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

export default function EditPatient() {
    const { patient, editPatient } = useContext(UserContext);
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
                setTimeout(() => navigate("/patient"), 1500); // redireciona após 1.5s
            } else {
                setMessage("Erro ao atualizar nome.");
            }
        } catch (err) {
            setMessage("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    if (!patient) {
        return <div>Carregando dados do paciente...</div>;
    }

 

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="name">Novo Nome:</label>
                    <input
                        id="name"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "#4caf50",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
            </form>
            {message && <p style={{ marginTop: "15px" }}>{message}</p>}
        </div>
    )
}