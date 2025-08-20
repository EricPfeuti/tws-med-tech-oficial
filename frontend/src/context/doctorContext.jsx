import React from "react";
import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const DoctorContext = createContext();

export function DoctorProvider({ children }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDoctorSession = async () => {
      try {
        const res = await api.get("/checkDoctorSession", { withCredentials: true });
        if (res.data.logado) {
          setDoctor({
            name: res.data.doctorName
          });
        } else {
          setDoctor(null);
        }
      } catch (err) {
        console.error("Erro no login do médico", err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    checkDoctorSession();
  }, []);

  const logoutDoctor = async () => {
    try {
      await api.post("/logoutDoctor", {}, { withCredentials: true });
      setDoctor(null);
    } catch (err) {
      console.error("Erro no logout do médico:", err);
    }
  };

  return (
    <DoctorContext.Provider value={{ doctor, setDoctor, loading, logoutDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
}
