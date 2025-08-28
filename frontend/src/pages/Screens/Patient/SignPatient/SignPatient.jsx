import React from "react";
import Header from "../../../../components/Web/Header/Header";
import Footer from "../../../../components/Web/Footer/Footer";
import FormSignPatient from "../../../../components/Screens/Patient/FormSignPatient/FormSignPatient";

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