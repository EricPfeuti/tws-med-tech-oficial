import React from "react";
import HeaderDoctor from "../../../../components/Web/Header/HeaderDoctor";
import Footer from "../../../../components/Web/Footer/Footer";
import PatientsDoctor from "../../../../components/Chat/PatientsDoctor";

export default function DoctorPatients() {

    return (
        <div>
            <HeaderDoctor />
            <main>
                <PatientsDoctor />
            </main>
            <Footer />
        </div>
    )
}