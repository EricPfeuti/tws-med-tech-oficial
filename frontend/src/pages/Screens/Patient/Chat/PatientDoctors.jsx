import React from "react";
import HeaderPatient from "../../../../components/Web/Header/HeaderPatient";
import Footer from "../../../../components/Web/Footer/Footer";
import DoctorsPatient from "../../../../components/Chat/DoctorsPatient";

export default function PatientDoctors() {
    return (
        <div>
            <HeaderPatient />
            <main>
                <DoctorsPatient />
            </main>
            <Footer />
        </div>
    )
}