import React from "react";
import DoctorChat from "../../../../components/Chat/DoctorChat";
import HeaderDoctor from "../../../../components/Web/Header/HeaderDoctor";
import Footer from "../../../../components/Web/Footer/Footer";

export default function ChatDoctor(){
    return (
        <div>
            <HeaderDoctor />
            <main>
                <DoctorChat />
            </main>
            <Footer />
        </div>
    )
}