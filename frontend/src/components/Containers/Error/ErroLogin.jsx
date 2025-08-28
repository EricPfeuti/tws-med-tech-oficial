import React from "react";
import erroImage from "../../../assets/images/erro-image.png";
import "./ErroLogin.css";

export default function ErroLogin() {
  return (
    <section id="erro-login" className="erro-login">
      <div className="interface">
        <div className="flex">
          <div className="txt-erro-login">
            <h1>Page not Found!</h1>
            <p>
              Sentimos muito, mas a página que você requisitou não foi
              encontrada. Por favor volte para home.
            </p>
            <div id="btn-vermelho">
              <a href="/">
                <button type="button">VOLTAR PARA HOME</button>
              </a>
            </div>
          </div>
          <div className="img-erro-login">
            <img src={erroImage} alt="Img Erro" />
          </div>
        </div>
      </div>
    </section>
  );
}
