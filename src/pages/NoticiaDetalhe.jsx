import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Eye, Clock, Tag, Share2, Newspaper, ArrowRight, AlertCircle,
} from "lucide-react";
import { noticias as noticiasApi } from "@/lib/api";

// Cores por categoria (mesmo padrão da página Noticias)
const categoryColors = {
  "Premiações":    { bg: "bg-amber-100",   text: "text-amber-800",   border: "border-amber-400" },
  "Olimpíadas":    { bg: "bg-blue-100",    text: "text-blue-800",    border: "border-blue-400" },
  "Projeto":       { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-400" },
  "Eventos":       { bg: "bg-violet-100",  text: "text-violet-800",  border: "border-violet-400" },
  "Institucional": { bg: "bg-rose-100",    text: "text-rose-800",    border: "border-rose-400" },
  "Aulas":         { bg: "bg-cyan-100",    text: "text-cyan-800",    border: "border-cyan-400" },
  "Comunicados":   { bg: "bg-fuchsia-100", text: "text-fuchsia-800", border: "border-fuchsia-400" },
};

const getCategoryStyle = (cat) =>
  categoryColors[cat] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" };

export default function NoticiaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setError("");
      try {
        const data = await noticiasApi.get(id);
        setNoticia(data);
      } catch (err) {
        if (err.message?.includes("404") || err.message?.includes("não encontrada")) {
          setError("Esta notícia não foi encontrada.");
        } else {
          setError("Erro ao carregar a notícia. Tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: noticia.title,
          text: noticia.summary,
          url: window.location.href,
        });
      } catch {
        // usuário cancelou
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  // ─── Estados de loading / erro ─────────────────────
  if (loading) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-slate-900 mb-2">
            {error || "Notícia não encontrada"}
          </h1>
          <p className="text-slate-500 mb-6">
            A notícia que você procura não existe ou foi removida.
          </p>
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para notícias
          </Link>
        </div>
      </div>
    );
  }

  const style = getCategoryStyle(noticia.category);

  // ─── Render principal ──────────────────────────────
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero com imagem de capa */}
      <section className="relative bg-[hsl(var(--navy))] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={noticia.image}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-[hsl(var(--navy))]/70 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Botão voltar */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          {/* Badge de categoria */}
          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${style.bg} ${style.text}`}>
            {noticia.category}
          </span>

          {/* Título */}
          <h1 className="font-heading font-extrabold text-white text-balance leading-tight mb-6" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
            {noticia.title}
          </h1>

          {/* Metadados */}
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {noticia.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {noticia.read_time} de leitura
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> {noticia.views} visualizações
            </span>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <article className="py-12 lg:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Resumo destacado */}
          {noticia.summary && (
            <div className={`border-l-4 ${style.border} bg-slate-50 rounded-r-lg p-5 mb-8`}>
              <p className="text-lg text-slate-700 leading-relaxed italic">
                {noticia.summary}
              </p>
            </div>
          )}

          {/* Imagem de capa grande */}
          <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
            <img
              src={noticia.image}
              alt={noticia.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Texto completo */}
          {noticia.content ? (
            <div className="prose prose-slate prose-lg max-w-none">
              {noticia.content.split("\n").map((paragrafo, i) =>
                paragrafo.trim() ? (
                  <p key={i} className="text-slate-700 leading-relaxed mb-4">
                    {paragrafo}
                  </p>
                ) : null
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                O conteúdo completo desta notícia ainda não foi publicado.
              </p>
            </div>
          )}

          {/* Botões de ação */}
          <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Ver todas as notícias
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Compartilhar
            </button>
          </div>
        </div>
      </article>

      {/* CTA final */}
      <section className="py-12 bg-[hsl(var(--navy))] border-t-4 border-blue-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-7 h-7 text-blue-200" />
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl mb-2">
            Fique por dentro de tudo
          </h3>
          <p className="text-white/60 mb-5">
            Acompanhe as novidades, conquistas e eventos do OlimpIFP2.
          </p>
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Ver mais notícias <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}