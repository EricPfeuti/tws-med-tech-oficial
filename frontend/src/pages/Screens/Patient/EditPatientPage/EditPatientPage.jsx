import React from "react";
import EditPatient from "../../../../components/Screens/Patient/EditPatient/EditPatient";
import Footer from "../../../../components/Web/Footer/Footer";
import HeaderPatient from "../../../../components/Web/Header/HeaderPatient";

export default function EditPatientPage(){
    return (
        <div>
            <HeaderPatient />
            <main>
                <EditPatient />
            </main>
            <Footer />
        </div>
    )
}