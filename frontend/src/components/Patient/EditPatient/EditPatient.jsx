import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

export default function EditPatient() {
    const { patient, editPatient, logoutPatient } = useContext(UserContext);
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
            setMessage("Erro de conexão com o servidor.", err);
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
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="name">Novo Nome:</label>
                    <input id="name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                <button>{loading ? "Salvando..." : "Salvar Alterações"}</button>
                <button type="button" onClick={handleLogout}>SAIR</button>
            </form>
            {message && <p style={{ marginTop: "15px" }}>{message}</p>}
        </div>
    )
}