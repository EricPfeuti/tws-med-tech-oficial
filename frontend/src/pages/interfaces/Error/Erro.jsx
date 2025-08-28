import React from "react";
import ErroLogin from "../../../components/Containers/Error/ErroLogin";
import Header from "../../../components/Web/Header/Header";
import Footer from "../../../components/Web/Footer/Footer";

export default function Erro() {
  return (
    <div>
      <Header />
      <main>
        <ErroLogin />
      </main>
      <Footer />
    </div>
  );
}
