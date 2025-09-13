import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../api/api";
import { toast } from "react-toastify";
import "./Chat.css"

const socket = io("http://localhost:3001", { withCredentials: true });

export default function DoctorChat() {
  const { patientName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [doctorName, setDoctorName] = useState("");

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

    const sessionGet = async () => {
      try {
        const s = await api.get("/checkDoctorSession", { withCredentials: true });
        if (s.data.logado) {
          setDoctorName(s.data.doctorName);
          socket.emit("joinRoom", { doctorName: s.data.doctorName, patientName });
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
      if (sender !== doctorName) {
        toast.info(`Nova mensagem de ${sender}: ${text}`);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("notifyMessage");
    };
  }, [patientName, doctorName]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post(`/messages/doctor/${patientName}`, { text }, { withCredentials: true });
      setText("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <section className="chat-container">
      <h2>Chat com {patientName}</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === doctorName ? "message doctor" : "message patient"}
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
