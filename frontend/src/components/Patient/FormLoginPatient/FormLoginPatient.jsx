import React from "react";
import logoMiniatura from "../../../assets/images/logoMiniaturaTWSMedTech.png"

export default function FormLoginPatient() {
    return (

        <div class="container-form">
            <section class="container-header">
                <img src={logoMiniatura} alt="Logo Miniatura" />
                <h2>Login Paciente - TWSMedTech</h2>
            </section>

            <form action="#" method="POST" id="form" class="form">
                <div class="form-content">
                    <label for="patientName">Nome:</label>
                    <input type="text" id="patientName" name="patientName" placeholder="Digite seu nome:" required />
                </div>
                <div class="form-content">
                    <label for="patientPassword">Senha:</label>
                    <input type="password" id="patientPassword" name="patientPassword" placeholder="Digite a sua senha:" required />
                </div>
                <p>Não tem uma conta? <a href="/signPatient">Cadastrar</a></p>
                <button type="submit">FAZER LOGIN</button>
            </form>
        </div>

    )
}