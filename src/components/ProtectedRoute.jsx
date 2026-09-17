import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, auth } from "@/lib/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "denied"

  useEffect(() => {
    async function verificar() {
      // 1. Não tem token? Fora.
      if (!isAuthenticated()) {
        setStatus("denied");
        return;
      }

      // 2. Tem token, mas será que ainda é válido?
      try {
        await auth.me();
        setStatus("ok");
      } catch (err) {
        // Token expirado ou inválido → limpa e manda pro login
        auth.logout();
        setStatus("denied");
      }
    }
    verificar();
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "denied") {
    // Redireciona pra /login guardando pra onde voltar depois
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}