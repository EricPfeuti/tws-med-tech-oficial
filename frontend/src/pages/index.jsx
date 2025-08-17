import Header from "../components/Header/Header"
import TopoSite from "../components/TopoSite/TopoSite"
import Membros from "../components/Membros/Membros"
import Servicos from "../components/Servicos/Servicos"
import Footer from "../components/Footer/Footer"

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