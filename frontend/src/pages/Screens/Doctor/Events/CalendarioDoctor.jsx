import React from "react";
import HeaderDoctor from "../../../../components/Web/Header/HeaderDoctor";
import DoctorCalendar from "../../../../components/Events/DoctorCalendar";
import Footer from "../../../../components/Web/Footer/Footer";

export default function CalendarioDoctor() {
    return (
        <div>
            <HeaderDoctor />
            <main>
                <DoctorCalendar />
            </main>
            <Footer />
        </div>
    )
}