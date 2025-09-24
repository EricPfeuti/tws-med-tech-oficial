import React, { useEffect, useState } from "react";
import api from "../../api/api";
import Footer from "../../components/Web/Footer/Footer";
import HeaderPatient from "../Web/Header/HeaderPatient";

export default function DoctorEvents() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/calendar/patient");
      setEvents(res.data);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await api.delete(`/calendar/patient/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
    }
  };

  return (
    <div>
        <HeaderPatient />
          <div div className="calendar-container">
            <h1 id="titulo">Lista de Eventos</h1>
            <div className="card-grid">
                {events.map((event) => (
                  <div key={event._id} className="event-card">
                    <h3>{event.title}</h3>
                    <p>
                      <strong>Data:</strong> {event.date}
                    </p>
                    <p>
                      <strong>Hora:</strong> {event.time}
                    </p>
                    {event.description && (
                      <p>
                        <strong>Descrição:</strong> {event.description}
                      </p>
                    )}
                    <div className="card-buttons">
                      <button className="btn-delete" onClick={() => handleDelete(event._id)}>🗑️ Excluir</button>
                    </div><br />
                  </div>
                ))}
            </div>
          </div>
        <Footer />
    </div>
  );
}