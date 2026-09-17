import React from "react";
import { Link } from "react-router-dom";
import {
  Users, Building2, Mountain, Trophy, BookOpen, Medal, ArrowRight,
  ExternalLink, GraduationCap, Heart, Gem, TreePalm, Landmark, MapPinned,
  FlaskConical, Library, Laptop, Lightbulb, PlayCircle, Quote,
} from "lucide-react";

const GREEN_IF = "#004d00";
const GREEN_DEEP = "#003300";
const GREEN_900 = "#064e3b";
const GREEN_700 = "#15803d";
const GOLD = "#d4af37";
const YELLOW_600 = "#ca8a04";

const sidebarPoints = [
  { icon: GraduationCap, text: "Centenas de estudantes impactados" },
  { icon: Medal, text: "Diversas olimpíadas do conhecimento" },
  { icon: Trophy, text: "Medalhas que orgulham nosso campus e nossa cidade" },
  { icon: Heart, text: "Histórias que nos inspiram a seguir em frente" },
];

const campusFeatures = [
  { icon: FlaskConical, text: "Laboratórios modernos" },
  { icon: Library, text: "Biblioteca com amplo acervo" },
  { icon: Laptop, text: "Salas de tecnologia" },
  { icon: Lightbulb, text: "Projetos de extensão" },
];

const cityFeatures = [
  { icon: Gem, title: "Capital da Opala", text: "Reconhecida mundialmente pela beleza e riqueza de suas opalas." },
  { icon: TreePalm, title: "Natureza exuberante", text: "Montanhas, cachoeiras e trilhas que encantam e inspiram." },
  { icon: Landmark, title: "História e cultura", text: "Patrimônio histórico e tradições que somam à nossa identidade." },
  { icon: MapPinned, title: "Turismo e aventura", text: "Roteiros que atraem visitantes de todo o Brasil e do mundo." },
];

export default function Lugar() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-50 text-gray-800">
      {/* HERO — verde sólido, sem gradiente */}
      <header className="text-white flex items-center" style={{ backgroundColor: GREEN_IF, minHeight: "420px" }}>
        <div className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 uppercase">
              O lugar ao qual pertencemos
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-white/90">
              Toda grande conquista nasce de um lugar, de uma comunidade e de pessoas que acreditam no poder da
              educação. Conheça o <strong>OlimpIFP2</strong>, o <strong>IFPI - Campus Pedro II</strong> e a cidade
              de <strong>Pedro II</strong>, os pilares que dão vida à nossa história.
            </p>
          </div>
        </div>
      </header>

      {/* TRIPLE CARDS OVERLAY */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 shadow-xl rounded-lg overflow-hidden border-b-4" style={{ borderColor: GOLD }}>
          {[
            { icon: Users, title: "Um Projeto", sub: "que transforma vidas", bg: "#f3f4f6" },
            { icon: Building2, title: "Um Campus", sub: "que forma e inspira", bg: "#ffffff" },
            { icon: Mountain, title: "Uma Cidade", sub: "que nos conecta e motiva", bg: "#f3f4f6" },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="p-6 flex items-center space-x-4" style={{ backgroundColor: c.bg, borderLeft: i !== 0 ? "1px solid #e5e7eb" : "none" }}>
                <Icon className="w-8 h-8" style={{ color: GREEN_700 }} />
                <div>
                  <p className="font-bold uppercase text-sm" style={{ color: GREEN_900 }}>{c.title}</p>
                  <p className="text-xs text-gray-600">{c.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* O OLIMP IFP2 */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4">
          <img
            src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=500&h=400&fit=crop"
            alt="Alunos"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
        <div className="md:col-span-5">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: GREEN_900 }}>
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold uppercase" style={{ color: GREEN_900 }}>
              O Olimp<span style={{ color: GOLD }}>IFP2</span>
            </h2>
          </div>
          <p className="text-sm mb-4 leading-relaxed">
            O OlimpIFP2 nasceu do sonho de incentivar nossos estudantes a irem além da sala de aula, a desafiarem
            seus limites e a descobrirem o poder do conhecimento.
          </p>
          <p className="text-sm mb-4 leading-relaxed">
            Acolhemos jovens talentos, oferecemos apoio, orientação e oportunidades para que cada aluno possa
            crescer, competir e se superar em diversas olimpíadas acadêmicas.
          </p>
          <p className="text-sm mb-6 leading-relaxed italic border-l-4 pl-4" style={{ borderColor: GOLD }}>
            "No OlimpIFP2, cada estudante permanece por alguns anos. O legado que deixa permanece para sempre."
          </p>
        </div>
        <div className="md:col-span-3 space-y-6">
          {sidebarPoints.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex items-center space-x-3">
                <Icon className="w-5 h-5" style={{ color: GREEN_700 }} />
                <p className="text-xs font-bold">{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* IFPI CAMPUS — fundo cinza claro */}
      <section className="py-16" style={{ backgroundColor: "#f3f4f6" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: GREEN_900 }}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold uppercase leading-tight" style={{ color: GREEN_900 }}>
                O IFPI <br />Campus Pedro II
              </h2>
            </div>
            <p className="text-xs mb-6 leading-relaxed text-gray-600">
              Mais que um espaço físico, nosso campus é um ambiente de aprendizado, inovação e convivência.
              Estudantes encontram estrutura, tecnologia e professores dedicados.
            </p>
            <div className="grid grid-cols-2 gap-4 text-[10px]">
              {campusFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <p key={i} className="flex items-center gap-1.5 font-semibold text-gray-700">
                    <Icon className="w-4 h-4" style={{ color: GREEN_700 }} /> {f.text}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-5 relative group">
            <img
              src="https://images.unsplash.com/photo-1562774053-8817958e864b?w=600&h=350&fit=crop"
              alt="Campus"
              className="rounded-xl shadow-lg w-full h-[350px] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 h-16 w-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition">
                <PlayCircle className="w-8 h-8" style={{ color: GREEN_900 }} />
              </div>
            </div>
          </div>
          <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border-t-4" style={{ borderColor: GREEN_700 }}>
            <h3 className="font-bold text-sm mb-2 uppercase">Conheça mais</h3>
            <p className="text-xs mb-4 text-gray-600">
              Acesse o site oficial do IFPI - Campus Pedro II e descubra tudo o que nosso campus oferece.
            </p>
            <a
              href="#"
              className="text-white text-[10px] px-4 py-2 rounded flex justify-between items-center hover:brightness-110 transition uppercase font-bold"
              style={{ backgroundColor: GREEN_900 }}
            >
              Visitar Site Oficial <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* PEDRO II CIDADE — fundo branco, acento amarelo/dourado */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 order-2 md:order-1 relative">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=350&fit=crop"
              alt="Pedro II"
              className="rounded-xl shadow-lg w-full h-[350px] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
            </div>
          </div>
          <div className="md:col-span-5 order-1 md:order-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: YELLOW_600 }}>
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold uppercase leading-tight" style={{ color: GREEN_900 }}>
                Pedro II <br />Nossa Cidade
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cityFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i}>
                    <h4 className="font-bold text-xs uppercase flex items-center mb-1">
                      <Icon className="w-4 h-4 mr-2" style={{ color: YELLOW_600 }} /> {f.title}
                    </h4>
                    <p className="text-[10px] text-gray-600">{f.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-3 order-3 p-6 rounded-xl shadow-sm border-t-4" style={{ backgroundColor: "#fff7ed", borderColor: YELLOW_600 }}>
            <h3 className="font-bold text-sm mb-2 uppercase">Conheça mais</h3>
            <p className="text-xs mb-4 text-gray-600">
              Descubra mais sobre a cidade de Pedro II, seus atrativos e sua cultura.
            </p>
            <MapPinned className="w-8 h-8 mb-4" style={{ color: YELLOW_600 }} />
            <a
              href="https://pedroii.pi.gov.br/"
              target="_blank"
              rel="noreferrer"
              className="text-white text-[10px] px-4 py-2 rounded flex justify-between items-center hover:brightness-110 transition uppercase font-bold"
              style={{ backgroundColor: YELLOW_600 }}
            >
              Visitar Site Oficial <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* QUOTE FOOTER — verde sólido */}
      <section className="py-12 text-white" style={{ backgroundColor: GREEN_IF }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Quote className="w-8 h-8 mx-auto mb-4" style={{ color: GOLD }} />
          <p className="text-xl md:text-2xl font-light italic">
            É daqui que nasce cada conquista do OlimpIFP2. <br className="hidden md:block" />
            Nosso projeto, nosso campus e nossa cidade nos unem e nos fazem ir cada vez mais longe.
          </p>
          <Link
            to="/olimpiadas"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase text-xs hover:brightness-110 transition"
            style={{ backgroundColor: GOLD, color: GREEN_DEEP }}
          >
            Conheça as Olimpíadas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}