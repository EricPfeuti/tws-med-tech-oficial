import React from "react";
import HeaderDoctor from "../../../components/Web/Header/HeaderDoctor";
import TopoSiteDoctor from "../../../components/Web/TopoSite/TopoSiteDoctor";
import Footer from "../../../components/Web/Footer/Footer";
import Membros from "../../../components/Web/Membros/Membros";
import FuncionalidadesDoctor from "../../../components/Screens/Doctor/FuncionalidadesDoctor/FuncionalidadesDoctor";

export default function Doctor() {
  return (
    <div>
      <HeaderDoctor />
      <br></br>
      <main>
        <TopoSiteDoctor />
        <FuncionalidadesDoctor />
        <Membros />
      </main>
      <Footer />
    </div>
  );
}
