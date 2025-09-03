import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

export default function DoctorsPatient() {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        console.log("Médicos recebidos:", res.data);
        setDoctors(res.data);
      } catch (err) {
        console.error("Erro ao buscar médicos:", err);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((d) => d.doctorName.toLowerCase().includes(search.toLowerCase()));
    
    return (
        <section className="escolha">
            <h1 id="titulo">PESQUISE O NOME do <span>MÉDICO</span>.</h1><br />

            <input type="text" placeholder="Pesquisar médico:" value={search} onChange={(e) => setSearch(e.target.value)} className="input-search" /><br/>

            <div>
                {filteredDoctors.length === 0 ? (
                <p>Nenhum médico encontrado.</p>
                ) : (
                filteredDoctors.map((d) => (
                        <div key={d._id}>
                            <div>
                                <div className="card-escolha" onClick={() => navigate(`/patient/chat/${d.doctorName}`)}>
                                <i className="bi bi-person-fill"></i>
                                <h3>{d.doctorName}</h3>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}