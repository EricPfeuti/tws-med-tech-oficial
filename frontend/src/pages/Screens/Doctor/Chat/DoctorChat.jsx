import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../../api/api";

const socket = io("https://localhost:3001", { withCredentials: true });

export default function DoctorChat() {
  const { patientName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/doctor/${patientName}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };

    fetchMessages();

    socket.emit("joinRoom", { doctorName: "doctor-session", patientName }); 
    socket.on("novaMensagem", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("novaMensagem");
    };
  }, [patientName]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await api.post(`/messages/doctor/${patientName}`, { text });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat com {patientName}</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Digite sua mensagem"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
