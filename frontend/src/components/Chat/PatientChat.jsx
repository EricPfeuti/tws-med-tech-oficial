import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../api/api";
import "./Chat.css";

const socket = io("http://localhost:3001", { withCredentials: true });

export default function PatientChat() {
  const { doctorName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/patient/${doctorName}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };

    fetchMessages();

    const sessionGet = async () => {
      try {
        const s = await api.get("/checkPatientSession", { withCredentials: true });
        if (s.data.logado) {
          socket.emit("joinRoom", { doctorName, patientName: s.data.patientName });
        }
      } catch (e) {
        console.error(e);
      }
    };
    sessionGet();

    socket.on("newMessage", (msg) => {
      console.log("Nova mensagem recebida:", msg);
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [doctorName]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post(`/messages/patient/${doctorName}`, { text }, { withCredentials: true });
      setText("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <section className="chat-container">
      <h2>Chat com Dr(a). {doctorName}</h2>
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
    </section>

  );
}
