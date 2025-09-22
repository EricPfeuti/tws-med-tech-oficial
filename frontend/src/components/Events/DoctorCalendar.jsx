import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./Calendar.css";

export default function DoctorCalendar() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        attendees: "",
    });

    useEffect(() => {
        api.get("/calendar/doctor")
            .then((res) => setEvents(res.data))
            .catch((err) => console.log("Erro ao carregar eventos:", err));
    }, []);

    const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
        ...formData,
        attendees: formData.attendees
            ? formData.attendees.split(",").map((a) => a.trim())
            : [],
        };

        try {
            const res = await api.post("/calendar/doctor", payload);
            setEvents([...events, res.data]);
            setFormData({ title: "", description: "", date: "", time: "", attendees: "" });
        } catch (err) {
            console.error("Erro ao salvar evento:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/calendar/doctor/${id}`);
            setEvents(events.filter((ev) => ev._id !== id));
        } catch (err) {
            console.error("Erro ao excluir evento:", err);
        }
    };

    return (
        <div className="calendar-container">
            <h2>📅 Calendário do Médico</h2>
            <form onSubmit={handleSubmit} className="calendar-form">
                <input type="text" name="title" value={formData.title} placeholder="Título" onChange={handleChange} />
                <textarea name="description" value={formData.description} placeholder="Descrição" onChange={handleChange}></textarea>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
                <input type="text" name="attendees" value={formData.attendees} placeholder="Participantes (separados por vírgula)" onChange={handleChange} />
                <button type="submit">Salvar</button>
            </form>
            <ul>
                {events.map((ev) => (
                <li key={ev._id}>
                    <strong>{ev.title}</strong> - {ev.date} {ev.time}
                    <button onClick={() => handleDelete(ev._id)}>Excluir</button>
                </li>
                ))}
            </ul>
        </div>
    );
}