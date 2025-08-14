import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./components/Header/Header";
import TopoSite from "./components/TopoSite/TopoSite";
import Servicos from "./components/Servicos/Servicos";
import Membros from "./components/Membros/Membros";
import Footer from "./components/Footer/Footer";

function App() {
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

export default App;
