import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../../api/api";

export default function DoctorChat() {
  const { doctorName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef();

  // Conectar ao socket
  useEffect(() => {
    socketRef.current = io("http://localhost:3001", {
      withCredentials: true,
    });

    // Ouvir novas mensagens do servidor
    socketRef.current.on("newMessage", (message) => {
      if (message.doctorName === doctorName) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [doctorName]);

  // Pegar mensagens históricas
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${doctorName}`, {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };
    fetchMessages();
  }, [doctorName]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMsg = {
      text,
    };

    try {
      // Salvar no backend
      const res = await api.post(`/messages/${doctorName}`, newMsg, {
        withCredentials: true,
      });

      // Emitir via socket para todos conectados na mesma sala
      socketRef.current.emit("sendMessage", res.data);

      // Atualizar localmente
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat com Dr(a). {doctorName}</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <strong>{msg.senderName || msg.sender}: </strong>
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
