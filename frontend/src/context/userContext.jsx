import React from "react";
import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSessions = async () => {
      try {
        const [resDoctor, resPatient] = await Promise.allSettled([
          api.get("/checkDoctorSession", { withCredentials: true }),
          api.get("/checkPatientSession", { withCredentials: true }),
        ]);

        if (resDoctor.status === "fulfilled" && resDoctor.value.data.logado) {
          setDoctor({ name: resDoctor.value.data.doctorName });
        } else {
          setDoctor(null);
        }

        if (resPatient.status === "fulfilled" && resPatient.value.data.logado) {
          setPatient({ name: resPatient.value.data.patientName });
        } else {
          setPatient(null);
        }
      } catch (err) {
        console.error("Erro ao checar sessões:", err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    checkSessions();
  }, []);

  const loginDoctor = async (credentials) => {
    const res = await api.post("/loginDoctor", credentials, {
      withCredentials: true,
    });
    if (res.data.logado) {
      setDoctor({ name: res.data.doctorName });
    }
    return res.data;
  };

  const loginPatient = async (credentials) => {
    const res = await api.post("/loginPatient", credentials, {
      withCredentials: true,
    });
    if (res.data.logado) {
      setPatient({ name: res.data.patientName });
    }
    return res.data;
  };

  const logoutDoctor = async () => {
    await api.post("/logoutDoctor", {}, { withCredentials: true });
    setDoctor(null);
  };

  const logoutPatient = async () => {
    await api.post("/logoutPatient", {}, { withCredentials: true });
    setPatient(null);
  };

  async function editPatient(newPatientName) {
    try {
      const res = await api.put(
        "/editPatient",
        { newPatientName },
        { withCredentials: true }
      );

      if (res.data.sucesso) {
        setPatient({ ...patient, name: res.data.patientName });
      }

      return res.data;
    } catch {
      console.error("Erro ao editar paciente.");
      return { sucesso: false, msg: "Erro ao editar paciente." };
    }
  }

  async function editDoctor(newDoctorName) {
    try {
      const res = await api.put(
        "/editDoctor",
        { newDoctorName },
        { withCredentials: true }
      );
      if(res.data.sucesso) {
        setDoctor({ ...doctor, name: res.data.doctorName });
      }
      return res
    } catch {
      console.error("Erro ao editar médico.");
      return { sucesso: false, msg: "Erro ao editar médico." };
    }
  }

  return (
    <UserContext.Provider
      value={{
        doctor,
        setDoctor,
        patient,
        setPatient,
        loading,
        loginDoctor,
        loginPatient,
        logoutDoctor,
        logoutPatient,
        editPatient,
        editDoctor,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
