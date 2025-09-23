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

        try {
            await api.post("/calendar/doctor");
            setFormData({ title: "", description: "", date: "", time: "" });
            navigate("/doctor/calendar/list");
        } catch (err) {
            console.error("Erro ao salvar evento:", err);
        }
    };

    return (
        <div className="calendar-container">
            <h2>📅 Criar Evento - Paciente</h2>
            <form onSubmit={handleSubmit} className="calendar-form">
                <input type="text" name="title" value={formData.title} placeholder="Título" onChange={handleChange} />
                <textarea name="description" value={formData.description} placeholder="Descrição" onChange={handleChange}></textarea>
                <input type="date" name="date" value={formData.date} onChange={handleChange} />
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
                <button type="submit">Salvar</button>
                <button><a href="/patient/calendar/list">Ver Eventos</a></button>
            </form>
        </div>
    );
}