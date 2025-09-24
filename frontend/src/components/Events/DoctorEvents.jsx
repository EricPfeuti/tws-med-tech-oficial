import React, { useEffect, useState } from "react";
import api from "../../api/api";
import HeaderDoctor from "../../components/Web/Header/HeaderDoctor";
import Footer from "../../components/Web/Footer/Footer";

export default function DoctorEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/calendar/doctor");
      setEvents(res.data);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await api.delete(`/calendar/doctor/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
    }
  };


  return (
    <div>
        <HeaderDoctor />
        <div className="calendar-container">
        <h1 id="titulo">Lista de Eventos</h1><br />

        <div className="card-grid">
            {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <p>
                <strong>📅 Data:</strong> {event.date}
              </p>
              <p>
                <strong>⏰ Hora:</strong> {event.time}
              </p>
              {event.description && (
                <p>
                  <strong>📝 Descrição:</strong> {event.description}
                </p>
              )}
                <div className="card-buttons">
                  <button onClick={() => handleDelete(event._id)}>🗑️ Excluir</button>
                </div><br />
              </div>
              ))}
          </div>
        </div>
        <Footer />
    </div>
  );
}
