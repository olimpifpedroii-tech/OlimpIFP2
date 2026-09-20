import { Loader2, ChevronDown } from "lucide-react";

/**
 * Botão "Carregar mais" com estados.
 *
 * @param {Function} onClick - Callback quando clica
 * @param {boolean} loading - Se está carregando no momento
 * @param {boolean} hasMore - Se ainda tem mais itens para carregar
 * @param {number} total - Total de itens
 * @param {number} shown - Quantos itens estão sendo mostrados
 * @param {string} label - Texto customizado (opcional)
 */
export default function CarregarMais({
  onClick,
  loading,
  hasMore,
  total,
  shown,
  label = "Carregar mais",
  corBase = "blue", // "blue" | "amber" | "violet" | "rose"
}) {
  // Estilos por cor
  const cores = {
    blue:   { border: "border-blue-200", text: "text-blue-700", hover: "hover:border-blue-400 hover:bg-blue-50" },
    amber:  { border: "border-amber-200", text: "text-amber-700", hover: "hover:border-amber-400 hover:bg-amber-50" },
    violet: { border: "border-violet-200", text: "text-violet-700", hover: "hover:border-violet-400 hover:bg-violet-50" },
    rose:   { border: "border-rose-200", text: "text-rose-700", hover: "hover:border-rose-400 hover:bg-rose-50" },
  };
  const c = cores[corBase] || cores.blue;

  // Se não tem mais e não está carregando, mostra mensagem
  if (!hasMore && shown > 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-slate-400 italic">
          Você viu todas as {total} {total === 1 ? "publicação" : "publicações"}.
        </p>
      </div>
    );
  }

  // Se não tem nada para mostrar
  if (total === 0) {
    return null;
  }

  return (
    <div className="text-center py-8">
      <button
        onClick={onClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 ${c.border} ${c.text} font-semibold ${c.hover} transition-all disabled:opacity-60 disabled:cursor-wait`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando...
          </>
        ) : (
          <>
            {label}
            <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-slate-400">
        Mostrando {shown} de {total}
      </p>
    </div>
  );
}