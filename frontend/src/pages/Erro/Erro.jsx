import React from "react";
import ErroLogin from "../../components/ErroLogin/ErroLogin";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

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
