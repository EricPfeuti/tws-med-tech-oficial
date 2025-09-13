import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import api from "../../api/api";
import "./Chat.css";

const socket = io("http://localhost:3001", { withCredentials: true });

export default function PatientChat() {
  const { doctorName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [patientName, setPatientName] = useState("");

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
          setPatientName(s.data.patientName);
          socket.emit("joinRoom", { doctorName, patientName: s.data.patientName });
        }
      } catch (e) {
        console.error(e);
      }
    };
    sessionGet();

    socket.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
      toast.info(`Nova mensagem de ${msg.sender}`, {
        position: "top-right"
      });
    });

    socket.on("notifyMessage", ({ sender, text }) => {
      if (sender !== patientName) {
        toast.success(`Nova mensagem de ${sender}: ${text}`);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("notifyMessage");
    };
  }, [doctorName, patientName]);

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
      <h2>Chat com {doctorName}</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === patientName ? "message patient" : "message doctor"}
          >
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
