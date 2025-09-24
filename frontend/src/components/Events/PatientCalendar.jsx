import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Calendar.css";

export default function PatientCalendar() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
        }

        try {
            await api.post("/calendar/patient", payload, {
                headers: { "Content-Type": "application/json" }
            });
            navigate("/patient/calendar/list");
        } catch (err) {
            console.error("Erro ao salvar evento:", err);
        }
    };

    return (
        <div className="calendar-container">
            <h1 id="titulo">Criar Evento - Paciente</h1><br />
            <form onSubmit={handleSubmit} className="calendar-form">
                <input type="text" name="title" value={formData.title} placeholder="Título" onChange={handleChange} />
                <textarea name="description" value={formData.description} placeholder="Descrição" onChange={handleChange}></textarea>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
                <button type="submit">Salvar</button>
            </form>
            <div id="events-btn">
                <button><a href="/patient/calendar/list">Ver Eventos</a></button>
            </div>
        </div>
    );
}