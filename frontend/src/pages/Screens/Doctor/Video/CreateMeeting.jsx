import React, { useState } from "react";
import api from "../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function CreateMeeting() {
    const [patientName, setPatientName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/create-meeting", {
                patientName,
            }, { withCredentials: true });

            const { roomName } = res.data;


            navigate(`/doctor/meeting/room/${roomName}`);
        } catch (err) {
            setError("Erro ao criar a reunião. Verifique o nome do paciente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Criar Consulta</h1>
            <form onSubmit={handleCreateMeeting} className="w-full max-w-md">
                <label className="block mb-4">
                    <span className="text-gray-700">Nome do paciente:</span>
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border px-3 py-2"
                        placeholder="Digite o nome do paciente"
                        required
                    />
                </label>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                >
                    {loading ? "Criando..." : "Criar reunião"}
                </button>
            </form>
        </div>
    )
}