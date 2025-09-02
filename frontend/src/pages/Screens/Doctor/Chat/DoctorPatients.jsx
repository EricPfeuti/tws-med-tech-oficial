import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";

export default function DoctorPatients() {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try{
                const res = await api.fetch("/patients", {
                    credentials: "include",
                });
                const data = await res.json();
                setPatients(data);
            } catch (err) {
                console.error("Erro ao buscar pacientes:", err)
            }
        };

        fetchPatients();
    }, [])

    return (
        <div>
            <h1>Selecione um paciente</h1>
            <div>
                {patients.map((p) => {
                    <div key={p._id}>
                        <span>{p.patientName}</span>
                        <div id="btn-vermelho">
                            <a href="#">
                                <button onClick={() => navigate(`/doctor/chat/${p.patientName}`)}>INICIAR CHAT</button>
                            </a>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}