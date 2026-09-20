import { useState, useEffect, useCallback } from "react";

/**
 * Hook para gerenciar paginação com botão "Carregar mais".
 *
 * @param {Function} fetchPage - Função que recebe (skip, limit) e retorna {items, total, skip, limit, has_more}
 * @param {number} pageSize - Itens por página
 * @param {Array} fallback - Dados iniciais (usados enquanto carrega ou se falhar)
 * @returns {{ items, loading, loadingMore, error, hasMore, loadMore, reset }}
 */
export function useApiPaginado(fetchPage, pageSize, fallback = []) {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(fallback.length);

  // Carga inicial
  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      try {
        setLoading(true);
        const data = await fetchPage(0, pageSize);
        if (!cancelado) {
          setItems(data.items);
          setTotal(data.total);
          setHasMore(data.has_more);
          setError(null);
        }
      } catch (err) {
        if (!cancelado) {
          console.error("Erro ao buscar dados:", err);
          setError(err);
          // mantém o fallback
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Carregar mais
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchPage(items.length, pageSize);
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.has_more);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar mais:", err);
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [items.length, pageSize, hasMore, loadingMore]); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, loading, loadingMore, error, hasMore, total, loadMore };
}