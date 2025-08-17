import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import FormSignDoctor from "../../../components/Doctor/FormSignDoctor/FormSignDoctor";

function SignDoctor() {
    return (
        <div>
            <Header />
            <main>
                <FormSignDoctor />
            </main>
            <Footer />
        </div>
    )

}

export default SignDoctor;