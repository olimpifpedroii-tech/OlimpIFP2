import React from "react";
import { Link } from "react-router-dom";
import { Users, Award, ArrowRight, Trophy } from "lucide-react";
import { PILLARS } from "@/lib/siteData";

const iconMap = { Award, Trophy, Users };

const builders = [
  { title: "Estudantes", text: "Protagonistas que transformam desafios em conquistas.", img: "https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=400&h=500&fit=crop" },
  { title: "Professores", text: "Orientam, inspiram e impulsionam novos talentos.", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f3?w=400&h=500&fit=crop" },
  { title: "Servidores", text: "Apoiam, organizam e fortalecem cada etapa do projeto.", img: "https://images.unsplash.com/photo-1517486808906-6ca880c8c6c0?w=400&h=500&fit=crop" },
  { title: "Colaboradores", text: "Parcerias que multiplicam o conhecimento.", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=500&fit=crop" },
  { title: "Todos Juntos", text: "Uma comunidade que deixa histórias e constrói legados.", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=500&fit=crop" },
];

export default function Projeto() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-[hsl(var(--navy))] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Trophy className="w-12 h-12 mx-auto text-[hsl(var(--gold-light))] mb-4" />
          <h1 className="font-heading font-extrabold text-balance" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>Sobre o Projeto</h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-lg">Conheça a história, a missão e as pessoas que fazem do OlimpIFP2 um projeto de legado.</p>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-16 lg:py-24 bg-[hsl(var(--canvas))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--navy))] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[hsl(var(--gold-light))]" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">Quem somos</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                O OlimpIFP2 é um projeto institucional do IFPI – Campus Pedro II dedicado à promoção das olimpíadas
                acadêmicas e da cultura científica. Acreditamos que cada estudante tem o potencial de transformar
                desafios em conquistas — e que cada conquista deixa um legado que permanece para sempre.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Nossa missão é incentivar, valorizar e celebrar a dedicação dos estudantes que representam o campus
                nas olimpíadas do conhecimento, formando cidadãos críticos, curiosos e preparados para os desafios do futuro.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1562774053-8817958e864b?w=800&h=500&fit=crop" alt="IFPI Campus Pedro II" className="w-full h-[360px] object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading font-extrabold text-white text-4xl drop-shadow-lg">EU ♥ IFPI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building together */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 text-center mb-3">Construímos Juntos</h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">Uma comunidade que se une para transformar desafios em conquistas.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {builders.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="aspect-[3/4] bg-slate-100">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="bg-[hsl(var(--navy))] p-3 text-center">
                  <p className="text-[hsl(var(--gold-light))] font-heading font-bold text-xs uppercase tracking-wider mb-1">{c.title}</p>
                  <p className="text-white/70 text-[11px] leading-snug">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 lg:py-24 bg-[hsl(var(--canvas))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 text-center mb-3">Nossos Pilares</h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">Os valores que sustentam cada conquista.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {PILLARS.map((p) => {
              const Icon = iconMap[p.icon] || Award;
              return (
                <div key={p.title} className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[hsl(var(--navy))] flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[hsl(var(--gold-light))]" />
                  </div>
                  <p className="font-heading font-bold text-slate-900">{p.title}</p>
                  <p className="text-sm text-slate-500 mt-1.5 leading-snug">{p.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[hsl(var(--navy))]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <Trophy className="w-10 h-10 mx-auto text-[hsl(var(--gold-light))] mb-4" />
          <p className="font-heading text-xl sm:text-2xl font-bold text-balance">"Cada medalha tem uma história. Cada estudante deixa um legado."</p>
          <Link to="/conquistas" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold">
            Ver nossas conquistas <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}