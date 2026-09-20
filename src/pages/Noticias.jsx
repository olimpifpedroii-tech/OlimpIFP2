import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Clock, ArrowRight, TrendingUp, Calendar, Megaphone, Camera, Newspaper } from "lucide-react";
import { NEWS } from "@/lib/siteData";
import { useApiData } from "@/hooks/use-api-data";
import { noticias as noticiasApi } from "@/lib/api";

const CATEGORIES = ["Todas", "Olimpíadas", "Premiações", "Projeto", "Aulas", "Eventos", "Comunicados", "Institucional"];

const categoryColors = {
  "Premiações":    { bg: "bg-amber-100",   text: "text-amber-800",   border: "border-amber-400",   hover: "hover:border-amber-500" },
  "Olimpíadas":    { bg: "bg-blue-100",    text: "text-blue-800",    border: "border-blue-400",    hover: "hover:border-blue-500" },
  "Projeto":       { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-400", hover: "hover:border-emerald-500" },
  "Eventos":       { bg: "bg-violet-100",  text: "text-violet-800",  border: "border-violet-400",  hover: "hover:border-violet-500" },
  "Institucional": { bg: "bg-rose-100",    text: "text-rose-800",    border: "border-rose-400",    hover: "hover:border-rose-500" },
  "Aulas":         { bg: "bg-cyan-100",    text: "text-cyan-800",    border: "border-cyan-400",    hover: "hover:border-cyan-500" },
  "Comunicados":   { bg: "bg-fuchsia-100", text: "text-fuchsia-800", border: "border-fuchsia-400", hover: "hover:border-fuchsia-500" },
};

const getCategoryStyle = (cat) => categoryColors[cat] || { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300", hover: "hover:border-slate-400" };

const upcomingEvents = [
  { date: "15 OUT", title: "Aplicação OBMEP 2026" },
  { date: "22 OUT", title: "Cerimônia de Premiação" },
  { date: "05 NOV", title: "Aulão preparatório OBI" },
];

export default function Noticias() {
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");

  const { data: noticias, loading } = useApiData(() => noticiasApi.list(), NEWS);

  const filtered = noticias.filter((n) => {
    if (category !== "Todas" && n.category !== category) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = noticias[0] || NEWS[0];
  const mostRead = [...noticias].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-20 bg-[hsl(var(--navy))] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={featured.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-semibold uppercase tracking-widest mb-4">
                <Newspaper className="w-4 h-4" /> Notícias atualizadas
              </span>
              <h1 className="font-heading font-extrabold" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>NOTÍCIAS</h1>
              <p className="mt-3 text-white/80 text-lg">Acompanhe tudo o que acontece no OlimpIFP2</p>
              <p className="mt-4 text-white/60 leading-relaxed max-w-lg">
                Fique por dentro das conquistas, eventos e histórias que movem o projeto OlimpIFP2 do IFPI – Campus Pedro II.
              </p>
              <div className="mt-6 flex gap-6">
                <div>
                  <div className="font-heading font-extrabold text-2xl text-[hsl(var(--gold-light))]">{noticias.length}</div>
                  <div className="text-xs text-white/50">Notícias</div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-2xl text-[hsl(var(--gold-light))]">+2.800</div>
                  <div className="text-xs text-white/50">Estudantes</div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-2xl text-[hsl(var(--gold-light))]">2020</div>
                  <div className="text-xs text-white/50">Desde</div>
                </div>
              </div>
            </div>
            {/* Featured spotlight — LINKADO */}
            <Link
              to={`/noticias/${featured.id}`}
              className="group relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-blue-500/30 hover:ring-blue-400/60 transition-all block"
            >
              <img src={featured.image} alt={featured.title} className="w-full h-[320px] object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,51,0,0.55)" }} />
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${getCategoryStyle(featured.category).bg} ${getCategoryStyle(featured.category).text}`}>
                  {featured.category}
                </span>
                <h3 className="font-heading font-bold text-lg leading-snug group-hover:text-blue-200 transition-colors">{featured.title}</h3>
                <p className="mt-1 text-sm text-white/70 line-clamp-2">{featured.summary}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-6 bg-blue-50/50 sticky top-16 lg:top-20 z-30 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar notícias..."
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-blue-100 text-sm bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    category === c
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <select className="px-3 py-2.5 rounded-lg border-2 border-blue-100 text-sm bg-white focus:outline-none focus:border-blue-400">
              <option>Mais recentes</option>
              <option>Mais lidas</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* News grid */}
            <div className="lg:col-span-3">
              {loading && (
                <div className="text-center py-12 text-slate-400">Carregando notícias...</div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400">Nenhuma notícia encontrada.</div>
              )}

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((n) => {
                  const style = getCategoryStyle(n.category);
                  return (
                    <Link
                      key={n.id}
                      to={`/noticias/${n.id}`}
                      className={`group bg-white rounded-2xl border-l-4 ${style.border} ${style.hover} border-t border-r border-b border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 transition-all flex flex-col`}
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                        <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                            {n.category}
                          </span>
                          <span className="text-xs text-slate-400">{n.date}</span>
                        </div>
                        <h3 className="font-heading font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                          {n.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">{n.summary}</p>
                        <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {n.views}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {n.read_time}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <button className="px-6 py-3 rounded-full border-2 border-blue-200 text-blue-700 font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all">
                  Carregar mais notícias
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Most read — LINKADO */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </span>
                  Mais lidas
                </h3>
                <div className="space-y-4">
                  {mostRead.map((n, i) => (
                    <Link key={n.id} to={`/noticias/${n.id}`} className="flex items-start gap-3 group">
                      <span className={`font-heading font-extrabold text-2xl leading-none ${i === 0 ? "text-blue-600" : i === 1 ? "text-blue-400" : "text-slate-300"}`}>
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                          {n.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span>{n.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {n.views}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Upcoming events */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </span>
                  Próximos eventos
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-[hsl(var(--navy))] flex flex-col items-center justify-center text-white shrink-0 shadow-sm">
                        <span className="text-[10px] font-bold leading-none">{e.date.split(" ")[1]}</span>
                        <span className="text-[9px] leading-none mt-0.5">{e.date.split(" ")[0]}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{e.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestion CTA */}
              <div className="bg-[hsl(var(--navy))] rounded-2xl p-6 text-white">
                <Megaphone className="w-8 h-8 text-[hsl(var(--gold-light))] mb-3" />
                <h3 className="font-heading font-bold text-lg">Tem uma sugestão de pauta?</h3>
                <p className="text-white/70 text-sm mt-1 mb-4">Envie sua ideia e ela pode virar uma notícia.</p>
                <Link to="/contato" className="inline-flex items-center gap-2 px-4 py-2 rounded-full gold-gradient text-white text-sm font-semibold">
                  Enviar sugestão <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer quote */}
      <section className="py-12 bg-[hsl(var(--navy))]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <Camera className="w-10 h-10 mx-auto text-[hsl(var(--gold-light))] mb-4" />
          <p className="font-heading text-lg sm:text-xl font-semibold text-balance">
            "Cada conquista é um passo. Cada história, um legado. Juntos, vamos mais longe!"
          </p>
        </div>
      </section>
    </div>
  );
}