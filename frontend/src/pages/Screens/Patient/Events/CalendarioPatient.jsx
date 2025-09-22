import React from "react";
import HeaderPatient from "../../../../components/Web/Header/HeaderPatient";
import PatientCalendar from "../../../../components/Events/PatientCalendar";
import Footer from "../../../../components/Web/Footer/Footer";

export default function CalendarioPatient() {
    return (
        <div>
            <HeaderPatient />
            <main>
                <PatientCalendar />
            </main>
            <Footer />
        </div>
    )
}