import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import "./Chat.css";
import { NotificationContext } from "../../context/notificationContext";

export default function DoctorChat() {
  const { patientName } = useParams();
  const { socket } = useContext(NotificationContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [file, setFile] = useState(null);

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
    });

    return () => {
      socket.off("newMessage");
    };
  }, [patientName, socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);
    
      await api.post(`/messages/doctor/${patientName}`, formData, {
        credentials: "include",
        body: formData,
      });

      setText("");
      setFile(null);
      document.getElementById("fileInput").value = ""; // limpa o input file
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <section className="chat-container">
      <h2>Chat com Paciente {patientName}</h2>
      <div className="messages">
        {messages.map((msg, idx) => {
          const isOwnMessage = msg.sender === doctorName;
          return (
            <div
              key={idx}
              className={`message ${isOwnMessage ? "enviada" : "recebida"}`}
            >
              <div className="bubble">
                <strong>{msg.sender}: </strong>
                {msg.text && <span>{msg.text}</span>}
                {msg.fileUrl && (
                  <a href={`http://localhost:3001${msg.fileUrl}`} 
                  target="_blank" 
                  rel="noreferrer">
                    📎 {msg.fileUrl.split("/").pop()}
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <div className="inputs">
          <input
            type="text"
            placeholder="Digite sua mensagem:"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            id="fileInput"
          />
          <label htmlFor="fileInput" id="clip">
            <i className="bi bi-paperclip"></i>
          </label>
          <button type="submit" id="send"><i class="bi bi-send-fill"></i></button>
        </div>
      </form>
    </section>
  );
}
