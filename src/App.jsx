import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Projeto from "@/pages/Projeto";
import Lugar from "@/pages/Lugar";
import Olimpiadas from "@/pages/Olimpiadas";
import Conquistas from "@/pages/Conquistas";
import DestaquesAnuais from "@/pages/DestaquesAnuais";
import Galeria from "@/pages/Galeria";
import Noticias from "@/pages/Noticias";
import NoticiaDetalhe from "@/pages/NoticiaDetalhe";
import Contato from "@/pages/Contato";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projeto" element={<Projeto />} />
            <Route path="/lugar" element={<Lugar />} />
            <Route path="/olimpiadas" element={<Olimpiadas />} />
            <Route path="/conquistas" element={<Conquistas />} />
            <Route path="/destaques-anuais" element={<DestaquesAnuais />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalhe />} />
            <Route path="/contato" element={<Contato />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;