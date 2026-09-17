import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Users, Trophy, ExternalLink, ChevronRight,
  Calculator, Leaf, Code, Languages, Landmark, Rocket, Layers, X, Award,
} from "lucide-react";
import { OLYMPIADS, OLYMPIAD_AREAS } from "@/lib/siteData";
import { useApiData } from "@/hooks/use-api-data";
import { olimpiadas as olimpiadasApi } from "@/lib/api";

const AREA_THEME = {
  "Matemática": { solid: "#2563eb", dark: "#1e3a8f", light: "#dbeafe", border: "#3b82f6", icon: Calculator },
  "Ciências da Natureza": { solid: "#059669", dark: "#064e3b", light: "#d1fae5", border: "#10b981", icon: Leaf },
  "Tecnologia": { solid: "#9333ea", dark: "#581c87", light: "#f3e8ff", border: "#a855f7", icon: Code },
  "Linguagens": { solid: "#ea580c", dark: "#7c2d12", light: "#ffedd5", border: "#f97316", icon: Languages },
  "Humanas": { solid: "#ca8a04", dark: "#713f12", light: "#fef9c3", border: "#eab308", icon: Landmark },
  "Empreendedorismo": { solid: "#0d9488", dark: "#134e4a", light: "#ccfbf1", border: "#14b8a6", icon: Rocket },
  "Interdisciplinares": { solid: "#4f46e5", dark: "#312e81", light: "#e0e7ff", border: "#6366f1", icon: Layers },
};

const GREEN_IF = "#004d00";
const GREEN_DEEP = "#003300";
const GOLD = "#d4af37";

const heroStats = [
  { icon: BookOpen, label: "Diversas áreas" },
  { icon: Layers, label: "Vários níveis" },
  { icon: Users, label: "Amizades" },
  { icon: Trophy, label: "Conquistas" },
];

export default function Olimpiadas() {
  const [area, setArea] = useState("Todas");
  const [modal, setModal] = useState(null);

  // 🔌 Busca olimpíadas da API (fallback pro siteData.js)
  const { data: olimpiadas, loading } = useApiData(() => olimpiadasApi.list(), OLYMPIADS);

  const grouped = (area === "Todas" ? olimpiadas : olimpiadas.filter((o) => o.area === area))
    .reduce((acc, o) => { (acc[o.area] = acc[o.area] || []).push(o); return acc; }, {});

  return (
    <div className="pt-16 lg:pt-20 bg-[#f8fafc]">
      {/* HERO */}
      <header className="text-white" style={{ backgroundColor: GREEN_IF }}>
        <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Olimpíadas <br />
              <span className="font-light italic text-2xl md:text-4xl" style={{ color: GOLD }}>
                do Conhecimento
              </span>
            </h1>
            <p className="text-sm md:text-base leading-relaxed mb-8 text-white/90">
              As olimpíadas são desafios que vão além da sala de aula. Elas desenvolvem talentos,
              despertam curiosidades e abrem portas para novas possibilidades.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/30 p-4 rounded-xl border border-white/10">
              {heroStats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="text-center border-r border-white/10 last:border-0 md:border-r">
                    <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: GOLD }} />
                    <p className="text-[9px] uppercase font-bold">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* FILTRO */}
      <div className="sticky top-16 lg:top-20 z-30 shadow-inner" style={{ backgroundColor: GREEN_DEEP }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex space-x-6 overflow-x-auto scrollbar-hide whitespace-nowrap text-white text-[11px] font-bold uppercase">
          {OLYMPIAD_AREAS.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`px-5 py-1.5 cursor-pointer transition-colors rounded-full ${
                area === a ? "bg-white" : "hover:opacity-80"
              }`}
              style={area === a ? { color: GREEN_IF } : {}}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {loading && (
          <div className="text-center py-12 text-slate-400">Carregando olimpíadas...</div>
        )}

        {!loading && Object.entries(grouped).length === 0 && (
          <div className="text-center py-12 text-slate-400">Nenhuma olimpíada encontrada.</div>
        )}

        {!loading && Object.entries(grouped).map(([areaName, items]) => {
          const theme = AREA_THEME[areaName] || AREA_THEME["Interdisciplinares"];
          const Icon = theme.icon;
          return (
            <section key={areaName}>
              <div className="flex items-center space-x-3 mb-8 pb-3" style={{ borderBottom: `2px solid ${theme.border}` }}>
                <div className="p-3 rounded-lg text-white" style={{ backgroundColor: theme.solid }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold" style={{ color: theme.dark }}>{areaName}</h2>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    {areaName === "Matemática" && "Lógica e resolução de problemas"}
                    {areaName === "Ciências da Natureza" && "Entender o mundo natural e suas transformações"}
                    {areaName === "Tecnologia" && "Inovação, digital e desenvolvimento de soluções"}
                    {areaName === "Linguagens" && "Comunicação, literatura e fluência"}
                    {areaName === "Humanas" && "História, sociedade e cultura"}
                    {areaName === "Empreendedorismo" && "Inovação, liderança e soluções criativas"}
                    {areaName === "Interdisciplinares" && "Múltiplas áreas do conhecimento em um só desafio"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setModal({ ...o, theme })}
                    className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer group hover:-translate-y-2 transition-all"
                    style={{ borderBottom: `4px solid ${theme.border}` }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.light }}>
                        <Trophy className="w-6 h-6" style={{ color: theme.solid }} />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:opacity-100 transition" style={{ color: theme.solid }} />
                    </div>
                    <h3 className="font-extrabold text-lg mb-2" style={{ color: theme.dark }}>{o.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 line-clamp-2">{o.desc}</p>
                    <span
                      className="text-[10px] font-bold uppercase border px-2 py-1 rounded"
                      style={{ color: theme.solid, borderColor: theme.light }}
                    >
                      {o.medal}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* CTA final */}
      <section className="py-12 text-white" style={{ backgroundColor: GREEN_IF }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Trophy className="w-10 h-10 mx-auto mb-4" style={{ color: GOLD }} />
          <p className="text-xl md:text-2xl font-bold text-balance">
            "Participar de uma olimpíada é mais que ganhar medalhas. É descobrir talentos, enfrentar desafios e construir um futuro cheio de possibilidades."
          </p>
          <Link
            to="/conquistas"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase text-xs text-white hover:brightness-110 transition"
            style={{ backgroundColor: GOLD, color: GREEN_DEEP }}
          >
            Ver nossos medalhistas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* MODAL */}
      {modal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white max-w-md w-full rounded-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: modal.theme.light }}>
                <Trophy className="w-7 h-7" style={{ color: GOLD }} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold leading-tight" style={{ color: modal.theme.dark }}>{modal.name}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{modal.area}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2">Sobre a Olimpíada</h4>
                <p className="text-sm leading-relaxed text-gray-600 font-medium">{modal.desc}</p>
              </div>
              <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: modal.theme.light, borderColor: modal.theme.border }}>
                <h4 className="text-[9px] font-black uppercase mb-1" style={{ color: modal.theme.solid }}>Público Alvo</h4>
                <p className="text-sm font-bold italic" style={{ color: modal.theme.dark }}>{modal.level}</p>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: GOLD }} />
                <span className="text-sm font-bold text-gray-700">Medalha: {modal.medal}</span>
              </div>
            </div>
            <a
              href="#"
              className="mt-8 block text-center text-white py-4 rounded-xl font-bold uppercase text-xs hover:brightness-110 transition"
              style={{ backgroundColor: GREEN_IF }}
            >
              Visitar Site Oficial <ExternalLink className="w-4 h-4 inline ml-2" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}