import React from "react";
import HeaderPatient from "../../../../components/Web/Header/HeaderPatient";
import PatientChat from "../../../../components/Chat/PatientChat";
import Footer from "../../../../components/Web/Footer/Footer";

export default function ChatPatient(){
    return (
        <div>
            <HeaderPatient />
            <main>
                <PatientChat />
            </main>
            <Footer />
        </div>
    )
}