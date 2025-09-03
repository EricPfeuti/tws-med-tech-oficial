import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../api/api";

export default function PatientChat() {
    const { doctorName } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const fetchMeesages = async () => {
            try{
                const res = await api.get(`/messages/${doctorName}`, { credentials: "include" });

                const data = await res.json();
                setMessages(data);
            } catch (err) {
                console.error("Erro ao buscar mensagens:", err)
            }
        };

        fetchMeesages();
    }, [doctorName]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const newMsg = { text };
        try {
            const res = await api.fetch(`/messages/${doctorName}`, 
                { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(newMsg)
                }
            );
            const data = await res.json();
            setMessages((prev) => [...prev, data]);
            setText("");
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
        }
    }

    return (
        <div>
            <h1>Chat com {doctorName}</h1>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        {msg.text}
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