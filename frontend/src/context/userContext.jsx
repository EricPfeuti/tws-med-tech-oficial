import React from "react";
import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
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

    const checkPatientSession = async () => {
      try {
        const res = await api.get("/checkPatientSession", { withCredentials: true });
        if (res.data.logado) {
          setPatient({
            name: res.data.patientName
          });
        } else {
          setPatient(null);
        }
      } catch (err) {
        console.error("Erro no login do paciente", err);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    checkPatientSession();
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

  const logoutPatient = async () => {
    try {
      await api.post("/logoutPatient", {}, { withCredentials: true });
      setPatient(null);
    } catch (err) {
      console.error("Erro no logout do paciente:", err);
    }
  };

  return (
    <UserContext.Provider value={{ doctor, setDoctor, patient, setPatient, loading, logoutDoctor,logoutPatient }}>
      {children}
    </UserContext.Provider>
  );
}
