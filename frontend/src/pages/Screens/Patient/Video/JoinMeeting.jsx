import React, { useState } from "react";
import api from "../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function JoinMeeting() {
    const [doctorName, setDoctorName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleJoinMeeting = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post(
                "/join-meeting",
                { doctorName },
                { withCredentials: true }
            );

            const { roomName } = res.data;

            navigate(`/patient/meeting/room/${roomName}`);
        } catch (err) {
            setError("Nenhuma reunião encontrada com este médico.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Entrar na Consulta</h1>

            <form onSubmit={handleJoinMeeting} className="w-full max-w-md">
                <label className="block mb-4">
                    <span className="text-gray-700">Nome do médico:</span>
                    <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border px-3 py-2"
                        placeholder="Digite o nome do médico"
                        required
                    />
                </label>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                    {loading ? "Entrando..." : "Entrar na reunião"}
                </button>
            </form>
        </div>
    )

}