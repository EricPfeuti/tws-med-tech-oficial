import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import FormSignPatient from "../../../components/Patient/FormSignPatient/FormSignPatient";

function SignPatient() {
    return (
        <div>
            <Header />
            <main>
                <FormSignPatient />
            </main>
            <Footer />
        </div>
    )

}

export default SignPatient;