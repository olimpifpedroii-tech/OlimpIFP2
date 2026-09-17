import { useState, useEffect } from "react";

/**
 * Hook que busca dados da API e retorna { data, loading, error }.
 *
 * @param {Function} fetcher - função que retorna uma Promise (ex: () => noticias.list())
 * @param {any} fallback - dados iniciais enquanto carrega (ex: NEWS)
 * @returns {{ data, loading, error }}
 */
export function useApiData(fetcher, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        setLoading(true);
        const resultado = await fetcher();
        if (!cancelado) {
          setData(resultado);
          setError(null);
        }
      } catch (err) {
        if (!cancelado) {
          console.error("Erro ao buscar dados da API:", err);
          setError(err);
          // mantém o fallback se a API falhar
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}