import React from "react";
import Header from "../../../../components/Web/Header/Header";
import Footer from "../../../../components/Web/Footer/Footer";
import FormSignDoctor from "../../../../components/Screens/Doctor/FormSignDoctor/FormSignDoctor";

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