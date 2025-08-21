import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import api from "../../../api/api";
import HeaderDoctor from "../../../components/Header/HeaderDoctor";
import TopoSiteDoctor from "../../../components/TopoSite/TopoSiteDoctor";
import Footer from "../../../components/Footer/Footer";
import Membros from "../../../components/Membros/Membros";
import FuncionalidadesDoctor from "../../../components/Doctor/FuncionalidadesDoctor/FuncionalidadesDoctor";

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
