import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../api/api";

export default function DoctorChat() {
    const { patientName } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [doctorName, setDoctorName] = useState("");

    useEffect(() => {
        const fetchMeesages = async () => {
            try{
                const res = await api.get(`/messages/${patientName}`, { withCredentials: true, });

                setMessages(res.data);
            } catch (err) {
                console.error("Erro ao buscar mensagens:", err)
            }
        };

        fetchMeesages();
    }, [patientName]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const res = await api.post(`/messages/${patientName}`, 
                { text }, 
                { withCredentials: true }
            );
            setMessages((prev) => [...prev, res.data]);
            setText("");
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
        }
    }

    const getSenderName = (msg) => {
        if (msg.sender === "medico") return msg.doctorName;
        return msg.patientName;
    };

    return (
        <div>
            <h1>Chat com {patientName}</h1>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <strong>{getSenderName(msg)}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="DIgite sua mensagem: " />
                <button type="submit">ENVIAR</button>
            </form>
        </div>
    )
}