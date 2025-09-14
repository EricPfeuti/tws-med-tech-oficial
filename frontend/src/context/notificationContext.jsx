import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import api from "../api/api";

export const NotificationContext = createContext(null);

const socket = io("http://localhost:3001", { withCredentials: true });

export function NotificationProvider({ children }) {
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
      toast.info(`💬 Nova mensagem de ${msg.sender}: ${msg.text}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
}