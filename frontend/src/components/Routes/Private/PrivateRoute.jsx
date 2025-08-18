import React from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`/api/check${role}Session`, {
          credentials: "include"
        });
        const data = await res.json();
        setIsAuth(data.logado);
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, [role]);

  if (isLoading) return <p>Carregando...</p>;
  if (!isAuth) return <Navigate to={`/login${role}`} />;

  return children;
}
