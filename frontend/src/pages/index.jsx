import React from "react";

import Header from "../components/Web/Header/Header";
import TopoSite from "../components/Web/TopoSite/TopoSite";
import Membros from "../components/Web/Membros/Membros";
import Servicos from "../components/Web/Servicos/Servicos";
import Footer from "../components/Web/Footer/Footer";

function Home() {
  return (
    <div>
      <Header /><br /><br />
      <main>
        <TopoSite />
        <Servicos />
        <Membros />
      </main>
      <Footer />
    </div>
  );
}

export default Home;