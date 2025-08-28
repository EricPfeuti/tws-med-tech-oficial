import React from "react";
import Header from "../../../../components/Web/Header/Header";
import Footer from "../../../../components/Web/Footer/Footer";
import FormLoginPatient from "../../../../components/Screens/Patient/FormLoginPatient/FormLoginPatient";

function LoginPatient() {
    return (
        <div>
            <Header />
            <main>
                <FormLoginPatient />
            </main>
            <Footer />
        </div>
    )

}

export default LoginPatient;