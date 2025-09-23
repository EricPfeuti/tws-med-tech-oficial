import React, { useEffect, useState } from "react";
import api from "../../api/api";
import HeaderDoctor from "../../components/Web/Header/HeaderDoctor";
import Footer from "../../components/Web/Footer/Footer";

export default function DoctorEvents() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null)

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

  const handleSaveEdit = async () => {
    try {
      await api.put(`/calendar/doctor/${editingEvent._id}`, editingEvent);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Erro ao editar evento:", err);
    }
  };

  return (
    <div>
        <HeaderDoctor />
        <div className="calendar-container">
        <h2>📌 Lista de Eventos - Médico</h2>

        <div className="card-grid">
            {events.map((event) => (
            <div key={event._id} className="event-card">
                {editingEvent && editingEvent._id === event._id ? (
                <>
                    <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) =>
                        setEditingEvent({ ...editingEvent, title: e.target.value })
                    }
                    />
                    <textarea
                    value={editingEvent.description}
                    onChange={(e) =>
                        setEditingEvent({
                        ...editingEvent,
                        description: e.target.value,
                        })
                    }
                    />
                    <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) =>
                        setEditingEvent({ ...editingEvent, date: e.target.value })
                    }
                    />
                    <input
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) =>
                        setEditingEvent({ ...editingEvent, time: e.target.value })
                    }
                    />
                    <div className="card-buttons">
                      <button onClick={handleSaveEdit}>Salvar</button>
                      <button onClick={() => setEditingEvent(null)}>Cancelar</button>
                    </div>
                </>
                ) : (
                <>
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
                      <button onClick={() => setEditingEvent(event)}>✏️ Editar</button>
                      <button onClick={() => handleDelete(event._id)}>🗑️ Excluir</button>
                    </div>
                </>
                )}
            </div>
            ))}
        </div>
        </div>
        <Footer />
    </div>
  );
}
