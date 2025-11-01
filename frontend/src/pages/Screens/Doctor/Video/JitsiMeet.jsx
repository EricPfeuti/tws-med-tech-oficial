import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderDoctor from "../../../../components/Web/Header/HeaderDoctor";
import Footer from "../../../../components/Web/Footer/Footer";
import api from "../../../../api/api";
import "./JitsiMeet.css";


export default function JitsiMeet() {
  const { roomName } = useParams();
  const jitsiContainerRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Inicializa Jitsi
    if (!window.JitsiMeetExternalAPI) {
      alert("Jitsi Meet API não encontrada!");
      return;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: "100%",
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
    };

    const apiInstance = new window.JitsiMeetExternalAPI(domain, options);
    return () => apiInstance.dispose();
  }, [roomName]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/patients");
        setPatients(res.data);
      } catch (err) {
        console.error("Erro ao carregar pacientes:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleSendLink = async () => {
    if (!selectedPatient) {
      setMessage("Selecione um paciente antes de enviar o link.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/meetings/send-link", {
        patientName: selectedPatient,
        roomName,
      });
      if (res.data.sucesso) {
        setMessage("✅ Link enviado com sucesso!");
      } else {
        setMessage("❌ Erro ao enviar o link.");
      }
    } catch (err) {
      console.error("Erro ao enviar link:", err);
      setMessage("❌ Erro ao enviar o link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeaderDoctor />
      <main className="meet-container">
        <div className="video-section" ref={jitsiContainerRef}></div>

        <div className="side-panel">
          <h2>Enviar link da reunião</h2>
          <p>Selecione o paciente que receberá o link:</p>

          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            <option value="">Selecione um paciente</option>
            {patients.map((p) => (
              <option key={p._id} value={p.patientName}>
                {p.patientName}
              </option>
            ))}
          </select>

          <button onClick={handleSendLink} disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
          </button>

          {message && <p className="status-message">{message}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
