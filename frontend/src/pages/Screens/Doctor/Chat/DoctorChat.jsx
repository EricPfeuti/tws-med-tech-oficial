import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../../../api/api";

export default function DoctorChat() {
  const { patientName } = useParams();
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
      if (message.patientName === patientName) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [patientName]);

  // Pegar mensagens históricas
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${patientName}`, {
          withCredentials: true,
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };
    fetchMessages();
  }, [patientName]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMsg = {
      text,
    };

    try {
      // Salvar no backend
      const res = await api.post(`/messages/${patientName}`, newMsg, {
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
      <h2>Chat com {patientName}</h2>
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
