import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Chat.css"

export default function PatientsDoctor() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/patients");
        console.log("Pacientes recebidos:", res.data);
        setPatients(res.data);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => p.patientName.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="escolha">
      <h1 id="titulo">PESQUISE O NOME do <span>PACIENTE</span>.</h1><br />

      <input type="text" placeholder="Pesquisar paciente:" value={search} onChange={(e) => setSearch(e.target.value)} className="input-search" /><br/>

      <div>
        {filteredPatients.length === 0 ? (
          <p>Nenhum paciente encontrado.</p>
        ) : (
          filteredPatients.map((p) => (
            <div key={p._id}>
              <div>
                <div className="card-escolha" onClick={() => navigate(`/doctor/chat/${p.patientName}`)}>
                  <i className="bi bi-person-fill"></i>
                  <h3>{p.patientName}</h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
