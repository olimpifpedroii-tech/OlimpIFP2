import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy, Users, Medal, Layers, BookOpen, Leaf, Target, TrendingUp,
  ArrowRight, Megaphone, Calendar, Award, ChevronLeft, ChevronRight, Star,
} from "lucide-react";
import { STATS, PILLARS, FEATURE_BAR, MEDALISTS, NEWS } from "@/lib/siteData";
import MedalistCard from "@/components/MedalistCard";
import { useApiData } from "@/hooks/use-api-data";
import { noticias as noticiasApi, medalhistas as medalhistasApi } from "@/lib/api";

const iconMap = { Trophy, Users, Medal, Layers, BookOpen, Leaf, Target, TrendingUp, Award };

const statColors = [
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
];

const builderColors = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
];

export default function Home() {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const visible = 3;

  const { data: noticias } = useApiData(() => noticiasApi.list(), NEWS);
  const { data: medalhistas } = useApiData(() => medalhistasApi.list(), MEDALISTS);

  const maxIdx = Math.max(0, medalhistas.length - visible);

  return (
    <div>
      {/* ============ BLOCO 1: HERO ============ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[hsl(var(--navy))]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f3?w=1600&h=1000&fit=crop"
            alt="Estudantes medalhistas"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--gold))]/20 border border-[hsl(var(--gold))]/40 text-[hsl(var(--gold-light))] text-xs font-semibold uppercase tracking-widest mb-6">
                <Trophy className="w-4 h-4" /> Projeto Institucional IFPI
              </span>
              <h1
                className="font-heading font-extrabold text-white leading-[0.95] tracking-tight"
                style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
              >
                OlimpIFP<span className="text-[hsl(var(--gold-light))]">2</span>
              </h1>
              <p className="mt-6 font-heading text-xl sm:text-2xl font-semibold text-white/90 text-balance">
                Cada medalha tem uma história. Cada estudante deixa um legado.
              </p>
              <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl leading-relaxed">
                Projeto institucional de incentivo e valorização das olimpíadas acadêmicas do IFPI – Campus Pedro II.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/projeto"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full gold-gradient text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
                >
                  Conheça o Projeto <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/conquistas"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-[hsl(var(--gold))] text-[hsl(var(--gold-light))] font-semibold hover:bg-[hsl(var(--gold))]/10 transition-colors"
                >
                  Nossas Conquistas
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=800&h=1000&fit=crop"
                  alt="Estudantes com medalhas"
                  className="w-full h-[560px] object-cover"
                />
                <div
                  className="absolute bottom-0 inset-x-0 p-6 border-t-4 border-[hsl(var(--gold))]"
                  style={{ backgroundColor: "rgba(0,51,0,0.85)" }}
                >
                  <p className="text-white font-heading font-bold text-lg">Nossos medalhistas</p>
                  <p className="text-white/70 text-sm">Orgulho que inspira. Conquistas que transformam.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" className="w-full h-12 sm:h-16" preserveAspectRatio="none">
            <path d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80 Z" fill="hsl(var(--canvas))" />
          </svg>
        </div>
      </section>

      {/* ============ BLOCO 2: MISSÃO + DESTAQUES ============ */}
      <section className="py-16 lg:py-24 bg-[hsl(var(--canvas))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Missão */}
            <div className="bg-[hsl(var(--navy))] rounded-2xl p-8 text-white flex flex-col border-l-4 border-[hsl(var(--gold))]">
              <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-5">
                <Trophy className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-3">Nossa Missão</h3>
              <p className="text-white/70 leading-relaxed flex-1">
                Promover a cultura científica e o protagonismo estudantil através das olimpíadas do conhecimento,
                valorizando cada conquista como parte de um legado que permanece para sempre no IFPI – Campus Pedro II.
              </p>
              <Link
                to="/projeto"
                className="mt-6 inline-flex items-center gap-2 text-[hsl(var(--gold-light))] font-semibold text-sm hover:gap-3 transition-all"
              >
                Saiba mais <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Destaques Recentes */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-heading font-bold text-xl text-slate-900 mb-5 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-blue-700" />
                </span>
                Destaques Recentes
              </h3>
              <div className="space-y-4 flex-1">
                {noticias.slice(0, 2).map((n, i) => {
                  const c = statColors[i % 4];
                  return (
                    <Link key={n.id ?? `noticia-${i}`} to="/noticias" className="block group">
                      <div className="flex items-start gap-2 mb-1">
                        <span className={`w-6 h-6 rounded-md ${c.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Calendar className={`w-3.5 h-3.5 ${c.text}`} />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                          {n.date}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug pl-8">
                        {n.title}
                      </p>
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/noticias"
                className="mt-5 inline-flex items-center gap-1.5 text-blue-700 font-semibold text-sm hover:gap-2.5 transition-all"
              >
                Ver todas as notícias <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCO 3: FILOSOFIA ============ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <h2
                className="font-heading font-extrabold text-slate-900 leading-tight text-balance"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
              >
                Toda grande <span className="text-amber-600">conquista</span> começa muito antes da competição:
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  { icon: BookOpen, lead: "nasce", bold: "no estudo,", color: "bg-blue-100 text-blue-700" },
                  { icon: Leaf, lead: "cresce", bold: "na dedicação", color: "bg-emerald-100 text-emerald-700" },
                  { icon: Medal, lead: "e se transforma", bold: "em legado.", color: "bg-amber-100 text-amber-700" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="font-heading text-lg sm:text-xl font-semibold text-slate-700">
                        {item.lead} <span className="font-extrabold text-slate-900">{item.bold}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-amber-500/10">
                <img
                  src="https://images.unsplash.com/photo-1517486808906-6ca880c8c6c0?w=800&h=600&fit=crop"
                  alt="Estudantes na biblioteca"
                  className="w-full h-[420px] lg:h-[500px] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature bar */}
          <div className="mt-12 lg:mt-16 bg-[hsl(var(--canvas))] rounded-2xl border border-slate-200 p-6 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-slate-200">
              {FEATURE_BAR.map((f, i) => {
                const Icon = iconMap[f.icon] || Target;
                const c = statColors[i % 4];
                return (
                  <div key={i} className={`flex flex-col items-center text-center ${i > 0 ? "lg:pl-6" : ""}`}>
                    <div className={`w-12 h-12 rounded-full ${c.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 ${c.text}`} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 leading-snug">{f.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOCO 4: SOBRE O PROJETO ============ */}
      <section className="py-16 lg:py-24 bg-[hsl(var(--canvas))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--navy))] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[hsl(var(--gold-light))]" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">Quem somos OlimpIFP2</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                O OlimpIFP2 é um projeto institucional do IFPI – Campus Pedro II dedicado à promoção das olimpíadas
                acadêmicas e da cultura científica. Acreditamos que cada estudante tem o potencial de transformar
                desafios em conquistas — e que cada conquista deixa um legado que permanece para sempre.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Nossa missão é incentivar, valorizar e celebrar a dedicação dos estudantes que representam o campus
                nas olimpíadas do conhecimento.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl ring-4 ring-emerald-500/10">
              <img
                src="https://images.unsplash.com/photo-1562774053-8817958e864b?w=800&h=500&fit=crop"
                alt="IFPI Campus Pedro II"
                className="w-full h-[320px] object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading font-extrabold text-white text-3xl drop-shadow-lg">EU AMO IFPI</span>
              </div>
            </div>
          </div>

          {/* Construímos Juntos */}
          <h3 className="font-heading font-bold text-xl text-slate-900 text-center mb-6">Construímos Juntos</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: "Estudantes", text: "Protagonistas que transformam desafios em conquistas." },
              { title: "Professores", text: "Orientam, inspiram e impulsionam novos talentos." },
              { title: "Servidores", text: "Apoiam, organizam e fortalecem cada etapa do projeto." },
              { title: "Colaboradores", text: "Parcerias que multiplicam o conhecimento." },
              { title: "Todos Juntos", text: "Uma comunidade que deixa histórias e constrói legados." },
            ].map((c, i) => {
              const color = builderColors[i % 5];
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/4] bg-slate-100">
                    <img
                      src={`https://images.unsplash.com/photo-${["1523580494853-5066c0c5e4a7", "1523050854058-8df90110c9f3", "1517486808906-6ca880c8c6c0", "1523580845648-3d6s8c0c5e4a7", "1427504494785-3a9ca7044f45"][i]}?w=300&h=400&fit=crop`}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-[hsl(var(--navy))] p-3 text-center border-t-4 border-[hsl(var(--gold))]">
                    <p className={`font-heading font-bold text-xs uppercase tracking-wider mb-1 ${color.text}`}>
                      {c.title}
                    </p>
                    <p className="text-white/70 text-[11px] leading-snug">{c.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ BLOCO 5: CONQUISTAS + NOTÍCIAS ============ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2
              className="font-heading font-extrabold text-slate-900 text-balance"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
            >
              O OlimpIFP2 está sempre em movimento.
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Acompanhe nossas conquistas e fique por dentro das últimas novidades.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-amber-700" />
                    </span>
                    CONQUISTAS RECENTES
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Nossos estudantes, nosso orgulho!</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCarouselIdx((i) => Math.max(0, i - 1))}
                    className="w-9 h-9 rounded-full border-2 border-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCarouselIdx((i) => Math.min(maxIdx, i + 1))}
                    className="w-9 h-9 rounded-full border-2 border-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {medalhistas.slice(carouselIdx, carouselIdx + visible).map((m, i) => (
                  <MedalistCard key={m.id ?? `medalhista-${carouselIdx}-${i}`} medalist={m} />
                ))}
              </div>

              <Link
                to="/conquistas"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[hsl(var(--navy))] text-white font-semibold hover:bg-[hsl(var(--navy-deep))] transition-colors border-l-4 border-[hsl(var(--gold))]"
              >
                <Trophy className="w-5 h-5 text-[hsl(var(--gold-light))]" />
                Ver todas as conquistas
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-3 mb-1">
                <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-blue-700" />
                </span>
                NOTÍCIAS
              </h3>
              <p className="text-sm text-slate-500 mb-5">Fique por dentro do que acontece!</p>

              <div className="space-y-5">
                {noticias.slice(0, 2).map((n, i) => {
                  const c = statColors[i % 4];
                  return (
                    <Link
                      key={n.id ?? `noticia-final-${i}`}
                      to="/noticias"
                      className={`block group bg-white rounded-xl border-l-4 ${c.bg.replace("bg-", "border-").replace("-100", "-400")} border-t border-r border-b border-slate-200 p-5 hover:shadow-md transition-shadow`}
                    >
                      <span className={`inline-block px-2.5 py-1 rounded-full ${c.bg} ${c.text} text-[10px] font-bold uppercase tracking-wider mb-2`}>
                        {n.date}
                      </span>
                      <h4 className="font-heading font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                        {n.title}
                      </h4>
                      <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{n.summary}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-blue-700 font-semibold text-sm group-hover:gap-2 transition-all">
                        Leia mais <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>

              <Link
                to="/noticias"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-blue-200 text-blue-700 font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                Ver todas as notícias <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}