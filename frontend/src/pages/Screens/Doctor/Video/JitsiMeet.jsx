import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import HeaderDoctor from "../../../../components/Web/Header/HeaderDoctor";
import Footer from "../../../../components/Web/Footer/Footer";

export default function JitsiMeet() {
  const { roomName } = useParams();
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
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

    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => api.dispose();
  }, [roomName]);

  return (
    <div>
      <HeaderDoctor />
      <main>
        <div ref={jitsiContainerRef} className="consulta"/>
      </main>
      <Footer />
    </div>
  );
}
