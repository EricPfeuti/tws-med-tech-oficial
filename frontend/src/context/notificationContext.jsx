import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import api from "../api/api";
import { useLocation } from "react-router-dom";

export const NotificationContext = createContext(null);

const socket = io("http://localhost:3001", { withCredentials: true });

export function NotificationProvider({ children }) {
  const location = useLocation();

  useEffect(() => {
    const joinRooms = async () => {
      try {

        const doctorSession = await api.get("/checkDoctorSession", { withCredentials: true });
        if (doctorSession.data.logado) {
          socket.emit("joinDoctor", { doctorName: doctorSession.data.doctorName });
        }

        const patientSession = await api.get("/checkPatientSession", { withCredentials: true });
        if (patientSession.data.logado) {
          socket.emit("joinPatient", { patientName: patientSession.data.patientName });
        }
      } catch (err) {
        console.error("Erro ao entrar em salas:", err);
      }
    };

    joinRooms();

    socket.on("newMessage", (msg) => {
      toast(`💬 Nova mensagem de ${msg.sender}`);
    });

    socket.on("notifyMessage", ({ sender }) => {
      const isChatOpen = 
        location.pathname.startsWith("/doctor/chat") || location.pathname.startsWith("/patient/chat");
      
        if(!isChatOpen) {
          toast(`💬 Nova mensagem de ${sender}`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    });

    return () => {
      socket.off("notifyMessage");
      socket.off("newMessage");
    };
  }, [location]);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
}