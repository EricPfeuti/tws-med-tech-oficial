import React from "react";
import HeaderPatient from "../../../components/Web/Header/HeaderPatient";
import Footer from "../../../components/Web/Footer/Footer";
import Membros from "../../../components/Web/Membros/Membros";
import ServicosPatient from "../../../components/Web/Servicos/ServicosPatient";
import TopoSite from "../../../components/Web/TopoSite/TopoSite";

export default function Patient() {

  return (
    <div>
      <HeaderPatient />
      <main>
        <TopoSite />
        <ServicosPatient />
        <Membros />
      </main>
      <Footer />
    </div>
  );
}
