import React from "react";
import HeaderPatient from "../../../components/Header/HeaderPatient";
import Footer from "../../../components/Footer/Footer";
import Membros from "../../../components/Membros/Membros";
import ServicosPatient from "../../../components/Servicos/ServicosPatient";
import TopoSite from "../../../components/TopoSite/TopoSite";

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
