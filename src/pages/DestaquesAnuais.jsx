import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award, ArrowRight, Calendar, Quote, Crown } from "lucide-react";
import { ANNUAL_HIGHLIGHTS } from "@/lib/siteData";

// Cores das medalhas (com contraste melhor)
const medalColors = {
  ouro: { bg: "bg-amber-400", text: "text-amber-900", light: "bg-amber-100" },
  prata: { bg: "bg-slate-400", text: "text-slate-800", light: "bg-slate-100" },
  bronze: { bg: "bg-orange-500", text: "text-orange-900", light: "bg-orange-100" },
  merito: { bg: "bg-emerald-500", text: "text-emerald-900", light: "bg-emerald-100" },
};

const rankColors = [
  { bg: "bg-amber-500", label: "1º Lugar", icon: Crown },
  { bg: "bg-slate-400", label: "2º Lugar", icon: Medal },
  { bg: "bg-orange-600", label: "3º Lugar", icon: Award },
];

export default function DestaquesAnuais() {
  const [year, setYear] = useState("2026");

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-[hsl(var(--navy))] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-4">
                <Crown className="w-4 h-4" /> Hall da Fama OlimpIFP2
              </span>
              <h1 className="font-heading font-extrabold" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>
                DESTAQUES ANUAIS
              </h1>
              <p className="mt-3 text-amber-200 text-lg font-semibold">Reconhecendo trajetórias que inspiram.</p>
              <p className="mt-4 text-white/60 leading-relaxed max-w-xl">
                A cada ano letivo, três estudantes se destacam pelo número de medalhas e pela dedicação às olimpíadas
                do conhecimento. Conheça quem faz a história do OlimpIFP2.
              </p>
            </div>
            {/* Trophies */}
            <div className="flex justify-center lg:justify-end gap-4">
              {rankColors.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="text-center">
                    <div className={`w-20 h-20 rounded-full ${r.bg} flex items-center justify-center shadow-xl ring-4 ring-white/10`}>
                      <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="mt-2 text-white/80 text-xs font-semibold uppercase tracking-wider">{r.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-amber-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-3 bg-white rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm">
              <Calendar className="w-5 h-5 text-amber-600" />
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
              >
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
            <div className="flex-1 bg-white border-2 border-amber-100 rounded-xl px-5 py-3 text-sm text-slate-600 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              A premiação é realizada em cerimônia oficial ao final de cada ano letivo.
            </div>
          </div>
        </div>
      </section>

      {/* Highlight cards */}
      <section className="pb-16 lg:pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10">
          {ANNUAL_HIGHLIGHTS.map((h, i) => {
            const rank = rankColors[i] || rankColors[0];
            const RankIcon = rank.icon;
            return (
              <article
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-amber-100 transition-all overflow-hidden grid md:grid-cols-12 border-l-4 border-l-amber-500"
              >
                {/* Sidebar */}
                <div className="md:col-span-2 bg-[hsl(var(--navy))] p-6 flex md:flex-col items-center justify-center gap-4 text-center">
                  <div className={`w-16 h-16 rounded-full ${rank.bg} flex items-center justify-center text-white shadow-lg ring-4 ring-white/20`}>
                    <RankIcon className="w-8 h-8" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-amber-300 text-[10px] font-bold uppercase tracking-widest">
                      Destaque do ano
                    </p>
                    <p className="text-white font-heading font-bold text-lg">{h.year}</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-amber-400/20 border border-amber-300/40">
                    <Trophy className="w-5 h-5 text-amber-300" />
                  </div>
                </div>

                {/* Photo */}
                <div className="md:col-span-3 bg-slate-100">
                  <img
                    src={h.photo}
                    alt={h.name}
                    className="w-full h-full max-h-[320px] object-cover"
                  />
                </div>

                {/* Info */}
                <div className="md:col-span-7 p-6 lg:p-8">
                  <h3 className="font-heading font-extrabold text-xl text-slate-900">
                    {h.name}
                  </h3>
                  <p className="text-sm text-slate-500">{h.course}</p>

                  {/* Medal counts */}
                  <div className="mt-5 grid grid-cols-4 gap-3">
                    {Object.entries(h.counts).map(([key, count]) => {
                      const colors = medalColors[key] || medalColors.merito;
                      return (
                        <div key={key} className={`text-center ${colors.light} rounded-xl p-3 border border-white`}>
                          <div className={`w-9 h-9 mx-auto rounded-full ${colors.bg} flex items-center justify-center mb-1.5 shadow-sm`}>
                            <Medal className="w-5 h-5 text-white" />
                          </div>
                          <div className={`font-heading font-extrabold text-lg ${colors.text}`}>
                            {count}
                          </div>
                          <div className="text-[10px] text-slate-500 capitalize font-semibold">
                            {key}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 text-center text-sm font-bold text-white bg-[hsl(var(--navy))] rounded-lg py-2 border-l-4 border-amber-400">
                    TOTAL: {h.total} CONQUISTAS
                  </div>

                  {/* Conquests list */}
                  <div className="mt-5">
                    <h4 className="font-heading font-semibold text-sm text-slate-900 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      Principais conquistas:
                    </h4>
                    <ul className="space-y-1.5">
                      {h.conquests.slice(0, 5).map((c, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors inline-flex items-center gap-1">
                      Ver todas as conquistas ({h.total})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quote */}
                  <div className="mt-5 bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
                    <Quote className="w-5 h-5 text-amber-300 mb-1" />
                    <p className="text-sm italic text-slate-700">"{h.quote}"</p>
                    <p className="mt-2 text-xs font-semibold text-amber-700">— {h.name}</p>
                  </div>

                  <Link
                    to="/noticias"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors group"
                  >
                    Ler notícias relacionadas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[hsl(var(--navy))] border-t-4 border-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-amber-300" />
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl mb-4">
            Fique por dentro de todas as histórias!
          </h3>
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold shadow-lg shadow-amber-500/20"
          >
            Ir para a página de notícias
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}