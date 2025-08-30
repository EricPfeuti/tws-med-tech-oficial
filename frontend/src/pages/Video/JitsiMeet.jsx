import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export default function MeetingRoom() {
  const { roomName } = useParams();
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [loadingKey, setLoadingKey] = useState(true);

  useEffect(() => {
    let mounted = true;

    const ensureScript = () =>
      new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) return resolve();
        const s = document.createElement("script");
        s.src = "https://meet.jit.si/external_api.js";
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });

    const start = async () => {
      try {
        await ensureScript();
        apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: 700,
          configOverwrite: {
            e2ee: {
              enabled: true,
              externallyManagedKey: true
            },
          },
          userInfo: {},
        });

        const res = await api.get(`/meeting-key/${roomName}`);
        if (!mounted) return;
        if (res.data.sucesso && res.data.key) {
          const keyBytes = base64ToUint8Array(res.data.key);
          apiRef.current.executeCommand("setMediaEncryptionKey", keyBytes);
          setLoadingKey(false);
        } else {
          console.error("Não recebeu chave:", res.data);
          alert("Não autorizado a obter chave E2EE desta reunião");
        }

        apiRef.current.addEventListener("participantJoined", (e) => {
          console.log("participantJoined", e);
        });
      } catch (err) {
        console.error("Erro Jitsi / pegar chave:", err);
        alert("Erro ao entrar na reunião");
      }
    };

    start();

    return () => {
      mounted = false;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName]);

  return (
    <div>
      <h3>Sala: {roomName}</h3>
      {loadingKey && <p>Obtendo chave E2EE...</p>}
      <div ref={containerRef} id="jitsi-container" style={{ width: "100%", height: 700 }} />
    </div>
  );
}