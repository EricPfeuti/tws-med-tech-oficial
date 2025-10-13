import React, { useEffect, useState } from "react";
import api from "../../api/api";
import HeaderDoctor from "../../components/Web/Header/HeaderDoctor";
import Footer from "../../components/Web/Footer/Footer";

export default function DoctorEvents() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

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

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      date: event.date,
      time: event.time,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja atualizar este evento?");
    if (!confirm) return;
    if (confirm) {
      window.location.reload();
    }
    try {
      await api.put(`/calendar/doctor/${id}`, formData);
      await fetchEvents();
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
      });
    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
    }
  };

  return (
    <div>
      <HeaderDoctor />
      <div className="calendar-container">
        <h1 id="titulo">Lista de Eventos</h1>
        <div className="card-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              {editingEvent && editingEvent._id === event._id ? (
                <div className="pop-up-edit">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descrição"
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                  <div className="card-buttons">
                    <button
                      className="btn-save"
                      onClick={() => handleUpdate(event._id)}
                    >
                      💾 Salvar
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditingEvent(null)}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(event)}
                    >
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(event._id)}
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
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
