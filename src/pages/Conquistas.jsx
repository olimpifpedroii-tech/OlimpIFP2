import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Trophy, Search, ArrowRight, Star, Award, HelpCircle, Megaphone, Crown,
  Calculator, Atom, FlaskConical, Dna, Code, BookOpen, Landmark, Lightbulb,
} from "lucide-react";
import { MEDALISTS, MEDAL_TYPES, STATS } from "@/lib/siteData";
import MedalistCard from "@/components/MedalistCard";
import { useApiData } from "@/hooks/use-api-data";
import { medalhistas as medalhistasApi } from "@/lib/api";

// ─────────────────────────────────────────────────────────
// MAPA: olimpíada → área (pra filtrar por área)
// ─────────────────────────────────────────────────────────
const OLYMPIAD_AREA = {
  OBMEP: "Matemática",
  OBM: "Matemática",
  OBI: "Tecnologia",
  "OBI Jr": "Tecnologia",
  ONC: "Ciências da Natureza",
  OBQ: "Ciências da Natureza",
  OBF: "Ciências da Natureza",
  OBB: "Ciências da Natureza",
  OBA: "Ciências da Natureza",
  OBNE: "Empreendedorismo",
  OPL: "Linguagens",
  OBH: "Humanas",
};

// Extrai o "código" da olimpíada (ex: "OBMEP 2024" → "OBMEP")
const extrairSigla = (olympiad) => {
  if (!olympiad) return "";
  return olympiad.split(" ")[0].toUpperCase();
};

// Extrai o ano (ex: "OBMEP 2024" → "2024")
const extrairAno = (olympiad) => {
  if (!olympiad) return "";
  const match = olympiad.match(/\d{4}/);
  return match ? match[0] : "";
};

// Deriva a área do medalhista
const getArea = (m) => OLYMPIAD_AREA[extrairSigla(m.olympiad)] || "Outra";

// Deriva o ano do medalhista (prioriza o ano do olympiad, senão o created_at)
const getAno = (m) => {
  const ano = extrairAno(m.olympiad);
  if (ano) return ano;
  if (m.created_at) return new Date(m.created_at).getFullYear().toString();
  return "";
};

// ─────────────────────────────────────────────────────────
// LISTAS DE FILTRO (derivadas dinamicamente)
// ─────────────────────────────────────────────────────────
const getSiglasDisponiveis = (medalhistas) => {
  const siglas = new Set(medalhistas.map((m) => extrairSigla(m.olympiad)).filter(Boolean));
  return ["Todas", ...Array.from(siglas).sort()];
};

const AREAS_DISPONIVEIS = [
  "Todas",
  "Matemática",
  "Tecnologia",
  "Ciências da Natureza",
  "Empreendedorismo",
  "Linguagens",
  "Humanas",
];

const ANOS_DISPONIVEIS = ["Todos", "2026", "2025", "2024", "2023"];

// ─────────────────────────────────────────────────────────
// CONTEÚDO ESTÁTICO
// ─────────────────────────────────────────────────────────
const howItWorks = [
  { icon: Search, title: "Participe", text: "Inscreva-se nas olimpíadas através do projeto.", color: "bg-amber-100 text-amber-700" },
  { icon: Trophy, title: "Compita", text: "Represente o campus com dedicação e estudo.", color: "bg-yellow-100 text-yellow-700" },
  { icon: Award, title: "Celebre", text: "Suas conquistas são registradas e celebradas.", color: "bg-orange-100 text-orange-700" },
];

const recentHighlights = [
  { name: "Ana Beatriz Silva", medal: "Ouro - OBMEP 2024", year: "2024", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "Pedro Henrique Alves", medal: "Ouro - OBM 2024", year: "2024", photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
  { name: "Mariana Rocha Lima", medal: "Prata - OBQ 2024", year: "2024", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop" },
];

const knowledgeAreas = [
  { icon: Calculator, label: "Matemática", color: "bg-blue-100 text-blue-700" },
  { icon: Atom, label: "Física", color: "bg-violet-100 text-violet-700" },
  { icon: FlaskConical, label: "Química", color: "bg-emerald-100 text-emerald-700" },
  { icon: Dna, label: "Biologia", color: "bg-lime-100 text-lime-700" },
  { icon: Code, label: "Tecnologia", color: "bg-purple-100 text-purple-700" },
  { icon: BookOpen, label: "Linguagens", color: "bg-orange-100 text-orange-700" },
  { icon: Landmark, label: "Humanas", color: "bg-amber-100 text-amber-700" },
  { icon: Lightbulb, label: "Empreendedorismo", color: "bg-teal-100 text-teal-700" },
];

const medalBadgeColors = {
  Ouro: "bg-amber-100 text-amber-800 border-amber-300",
  Prata: "bg-slate-100 text-slate-700 border-slate-300",
  Bronze: "bg-orange-100 text-orange-800 border-orange-300",
  "Honra ao Mérito": "bg-emerald-100 text-emerald-800 border-emerald-300",
  Classificado: "bg-blue-100 text-blue-800 border-blue-300",
  Participação: "bg-violet-100 text-violet-800 border-violet-300",
};

// ─────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────
export default function Conquistas() {
  const [search, setSearch] = useState("");
  const [medalType, setMedalType] = useState("Todas");
  const [olympiad, setOlympiad] = useState("Todas");
  const [area, setArea] = useState("Todas");
  const [year, setYear] = useState("Todos");
  const [onlyRecent, setOnlyRecent] = useState(false);
  const [ordenacao, setOrdenacao] = useState("Mais recentes");

  const { data: medalhistas, loading } = useApiData(() => medalhistasApi.list(), MEDALISTS);

  const siglasDisponiveis = useMemo(() => getSiglasDisponiveis(medalhistas), [medalhistas]);

  const filtered = useMemo(() => {
    let lista = medalhistas.filter((m) => {
      // 1. Busca por nome
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;

      // 2. Pills de medalha
      if (medalType !== "Todas" && m.medal !== medalType) return false;

      // 3. Select olimpíada
      if (olympiad !== "Todas" && extrairSigla(m.olympiad) !== olympiad) return false;

      // 4. Select área
      if (area !== "Todas" && getArea(m) !== area) return false;

      // 5. Select ano
      if (year !== "Todos" && getAno(m) !== year) return false;

      return true;
    });

    // 6. Toggle "Destaques recentes" — filtra só do ano corrente (2026)
    if (onlyRecent) {
      lista = lista.filter((m) => getAno(m) === "2026");
    }

    // 7. Ordenação
    if (ordenacao === "Nome") {
      lista = [...lista].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // "Mais recentes" — usa created_at
      lista = [...lista].sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
    }

    return lista;
  }, [medalhistas, search, medalType, olympiad, area, year, onlyRecent, ordenacao]);

  const limparFiltros = () => {
    setSearch("");
    setMedalType("Todas");
    setOlympiad("Todas");
    setArea("Todas");
    setYear("Todos");
    setOnlyRecent(false);
    setOrdenacao("Mais recentes");
  };

  const temFiltroAtivo =
    search || medalType !== "Todas" || olympiad !== "Todas" ||
    area !== "Todas" || year !== "Todos" || onlyRecent;

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-[hsl(var(--navy))] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-4">
                <Star className="w-4 h-4" /> Orgulho que inspira. Conquistas que transformam.
              </span>
              <h1 className="font-heading font-extrabold text-balance" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>
                Nossos Medalhistas
              </h1>
              <p className="mt-4 text-white/80 text-lg leading-relaxed">
                Cada medalha representa dedicação, estudo e superação. Aqui celebramos as conquistas dos estudantes
                do IFPI – Campus Pedro II nas olimpíadas do conhecimento.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-amber-400/40">
              <img src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=700&h=450&fit=crop" alt="Medalhistas" className="w-full h-[300px] object-cover" />
              <div className="absolute top-4 right-4 bg-[hsl(var(--navy-deep))]/90 backdrop-blur-sm rounded-xl p-4 max-w-[200px] border border-amber-400/30">
                <p className="text-white text-sm font-heading font-semibold text-balance">"Cada medalha tem uma história. Cada estudante deixa um legado."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter toolbar */}
      <section className="py-10 bg-amber-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-l-4 border-amber-400 border-t border-r border-b border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Search className="w-4 h-4 text-amber-600" />
                </span>
                Encontre conquistas
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                {temFiltroAtivo && (
                  <button
                    onClick={limparFiltros}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline transition-colors"
                  >
                    Limpar filtros
                  </button>
                )}
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <button
                    onClick={() => setOnlyRecent(!onlyRecent)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${onlyRecent ? "bg-amber-500" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${onlyRecent ? "translate-x-5" : ""}`} />
                  </button>
                  Exibir apenas destaques recentes
                </label>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Digite o nome do aluno..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-colors"
                />
              </div>
              <select
                value={olympiad}
                onChange={(e) => setOlympiad(e.target.value)}
                className="px-3 py-2.5 rounded-lg border-2 border-amber-100 text-sm bg-white focus:outline-none focus:border-amber-400"
              >
                {siglasDisponiveis.map((s) => (
                  <option key={s} value={s}>{s === "Todas" ? "Todas as olimpíadas" : s}</option>
                ))}
              </select>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="px-3 py-2.5 rounded-lg border-2 border-amber-100 text-sm bg-white focus:outline-none focus:border-amber-400"
              >
                {AREAS_DISPONIVEIS.map((a) => (
                  <option key={a} value={a}>{a === "Todas" ? "Todas as áreas" : a}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="px-3 py-2.5 rounded-lg border-2 border-amber-100 text-sm bg-white focus:outline-none focus:border-amber-400"
              >
                {ANOS_DISPONIVEIS.map((a) => (
                  <option key={a} value={a}>{a === "Todos" ? "Todos os anos" : a}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {MEDAL_TYPES.map((t) => {
                const isActive = medalType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setMedalType(t)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                      isActive
                        ? "bg-[hsl(var(--navy))] text-white border-[hsl(var(--navy))] shadow-md"
                        : `${medalBadgeColors[t] || "bg-white text-slate-600 border-slate-200"} hover:scale-105`
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 flex-wrap gap-3">
              <span>
                Mostrando <strong className="text-amber-700">{filtered.length}</strong> de{" "}
                <strong className="text-slate-700">{medalhistas.length}</strong> conquistas
              </span>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="px-3 py-1.5 rounded-lg border-2 border-amber-100 text-sm bg-white focus:outline-none focus:border-amber-400"
              >
                <option value="Mais recentes">Ordenar por: Mais recentes</option>
                <option value="Nome">Ordenar por: Nome</option>
              </select>
            </div>
          </div>

          <Link
            to="/destaques-anuais"
            className="mt-5 group flex items-center justify-between gap-4 rounded-2xl p-6 text-white hover:shadow-xl transition-all border-l-4 border-amber-400"
            style={{ backgroundColor: "#003300" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center shrink-0 shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Destaques Anuais</h3>
                <p className="text-white/70 text-sm">Conheça os três estudantes mais premiados de cada ano.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-200 font-semibold text-sm shrink-0">
              Ver destaques <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-16 lg:pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {loading && (
                <div className="text-center py-12 text-slate-400">Carregando medalhistas...</div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-400 mb-3">Nenhum medalhista encontrado.</p>
                  {temFiltroAtivo && (
                    <button
                      onClick={limparFiltros}
                      className="text-sm font-semibold text-amber-700 hover:text-amber-900 underline"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((m) => (
                  <div key={m.id ?? m.name} className="flex flex-col">
                    <MedalistCard medalist={m} />
                    <Link
                      to="/noticias"
                      className="mt-3 mx-auto inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                    >
                      Ler notícia <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-amber-600" />
                  </span>
                  Nossos números
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {STATS.map((s, i) => {
                    const bgColors = ["bg-amber-50", "bg-yellow-50", "bg-orange-50", "bg-rose-50"];
                    const textColors = ["text-amber-700", "text-yellow-700", "text-orange-700", "text-rose-700"];
                    return (
                      <div key={s.label} className={`${bgColors[i % 4]} rounded-xl p-3 text-center border border-white`}>
                        <div className={`font-heading font-extrabold text-xl ${textColors[i % 4]}`}>{s.value}</div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-600" />
                  </span>
                  Destaques recentes
                </h3>
                <div className="space-y-3">
                  {recentHighlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-colors">
                      <img src={h.photo} alt={h.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-200" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">{h.name}</p>
                        <p className="text-xs text-amber-700">{h.medal}</p>
                      </div>
                      <span className="ml-auto text-xs font-bold text-amber-600">{h.year}</span>
                    </div>
                  ))}
                </div>
                <Link to="/destaques-anuais" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 hover:gap-2.5 transition-all">
                  Ver todos os destaques
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                  </span>
                  Como funciona?
                </h3>
                <div className="space-y-4">
                  {howItWorks.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{s.title}</p>
                          <p className="text-xs text-slate-500">{s.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[hsl(var(--navy))] rounded-2xl p-6 text-white border-l-4 border-amber-400">
                <Megaphone className="w-8 h-8 text-amber-300 mb-3" />
                <h3 className="font-heading font-bold text-lg">Tem uma novidade?</h3>
                <p className="text-white/70 text-sm mt-1 mb-4">Compartilhe conquistas e histórias com a comunidade.</p>
                <Link to="/noticias" className="inline-flex items-center gap-2 px-4 py-2 rounded-full gold-gradient text-white text-sm font-semibold">
                  Ver notícias <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Knowledge areas */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-heading font-bold text-center text-slate-900 mb-2">Nossas áreas do conhecimento</h3>
          <p className="text-center text-sm text-slate-500 mb-6">Cada área com sua cor, cada conquista com sua história</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {knowledgeAreas.map((a, i) => {
              const Icon = a.icon;
              const isAreaFiltrada = area === a.label;
              return (
                <button
                  key={i}
                  onClick={() => setArea(isAreaFiltrada ? "Todas" : a.label)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${isAreaFiltrada ? "ring-4 ring-offset-2 ring-amber-400" : ""}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-slate-600 text-center leading-tight font-semibold">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}