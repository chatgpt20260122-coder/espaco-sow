import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/HomePage";
import ClientesNovos from "./pages/ClientesNovos";
import Cetim from "./pages/Cetim";
import Depilacao from "./pages/Depilacao";
import Estoque from "./pages/Estoque";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<ClientesNovos />} />
          <Route path="/cetim" element={<Cetim />} />
          <Route path="/depilacao" element={<Depilacao />} />
          <Route path="/estoque" element={<Estoque />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
