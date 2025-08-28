import React from "react";
import Header from "../../../../components/Web/Header/Header";
import Footer from "../../../../components/Web/Footer/Footer";
import FormLoginDoctor from "../../../../components/Screens/Doctor/FormLoginDoctor/FormLoginDoctor";

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