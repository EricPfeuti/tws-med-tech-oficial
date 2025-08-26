import React from "react";
import EditPatient from "../../../components/Patient/EditPatient/EditPatient";
import Footer from "../../../components/Footer/Footer";
import HeaderPatient from "../../../components/Header/HeaderPatient";

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