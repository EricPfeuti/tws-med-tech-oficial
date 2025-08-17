import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import FormLoginDoctor from "../../../components/Doctor/FormLoginDoctor/FormLoginDoctor";

function LoginDoctor() {
    return (
        <div>
            <Header />
            <main>
                <FormLoginDoctor />
            </main>
            <Footer />
        </div>
    )

}

export default LoginDoctor;