import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Calendar, Play, Search, Upload, ImageIcon, Video, FolderOpen } from "lucide-react";
import { GALLERY_ALBUMS, GALLERY_CATEGORIES } from "@/lib/siteData";
import { useApiData } from "@/hooks/use-api-data";
import { galeria as galeriaApi } from "@/lib/api";

const categoryColors = {
  "Premiações": "bg-amber-100 text-amber-800",
  "Aplicações": "bg-blue-100 text-blue-800",
  "Aulas e Oficinas": "bg-emerald-100 text-emerald-800",
  "Palestras": "bg-rose-100 text-rose-800",
  "Visitas e Passeios": "bg-teal-100 text-teal-800",
  "Equipe e Reuniões": "bg-violet-100 text-violet-800",
  "Bastidores": "bg-orange-100 text-orange-800",
};

export default function Galeria() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const { data: albuns, loading } = useApiData(() => galeriaApi.list(), GALLERY_ALBUMS);

  const filtered = albuns.filter((a) => {
    if (category !== "Todos" && a.category !== category) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero — sem os cards de stats */}
      <section className="relative py-16 lg:py-24 bg-[hsl(var(--navy))] overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-200 text-xs font-semibold uppercase tracking-widest mb-4">
                <Camera className="w-4 h-4" /> Memórias em imagens
              </span>
              <h1 className="font-heading font-extrabold" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>GALERIA</h1>
              <p className="mt-3 text-white/80 text-lg">Momentos que constroem nossa história</p>
              <p className="mt-4 text-white/60 leading-relaxed max-w-lg">
                Cada fotografia preserva um momento que ajudou a construir a história do OlimpIFP2. Reviva eventos,
                conquistas e experiências que marcaram nossa trajetória.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-violet-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-l-4 border-violet-400 border-t border-r border-b border-slate-100 shadow-sm p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Digite palavras-chave..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-violet-100 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"
                />
              </div>
              <select className="px-3 py-2.5 rounded-lg border-2 border-violet-100 text-sm bg-white focus:outline-none focus:border-violet-400">
                <option>Filtrar por olimpíada</option>
                <option>OBMEP</option>
                <option>OBI</option>
              </select>
              <select className="px-3 py-2.5 rounded-lg border-2 border-violet-100 text-sm bg-white focus:outline-none focus:border-violet-400">
                <option>Filtrar por ano</option>
                <option>2026</option>
                <option>2025</option>
              </select>
              <select className="px-3 py-2.5 rounded-lg border-2 border-violet-100 text-sm bg-white focus:outline-none focus:border-violet-400">
                <option>Tipo de evento</option>
                <option>Aplicações</option>
                <option>Premiações</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {GALLERY_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border-2 ${
                    category === c
                      ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Album grid */}
      <section className="pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <h2 className="font-heading font-bold text-xl text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-violet-600" />
            </span>
            Álbuns de Eventos
          </h2>

          {loading && (
            <div className="text-center py-12 text-slate-400">Carregando álbuns...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">Nenhum álbum encontrado.</div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((a) => {
              const catColor = categoryColors[a.category] || "bg-violet-100 text-violet-700";
              return (
                <article
                  key={a.id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[hsl(var(--navy))] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                      {a.date}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-slate-900 leading-snug group-hover:text-violet-700 transition-colors">
                      {a.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {a.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5" /> {a.photos} fotos
                      </span>
                    </div>
                    <span className={`mt-3 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor}`}>
                      {a.category}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button className="px-6 py-3 rounded-full border-2 border-violet-200 text-violet-700 font-semibold hover:border-violet-400 hover:bg-violet-50 transition-all">
              Carregar mais álbuns
            </button>
          </div>
        </div>
      </section>

      {/* Event showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Aplicação da OBMEP 2026
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> 07 JUN 2026
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> 122 fotos
              </span>
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" /> 3 vídeos
              </span>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-lg ring-4 ring-violet-500/20">
              <img
                src="https://images.unsplash.com/photo-1503676267111-225ef20ad4f0?w=700&h=500&fit=crop"
                alt="Evento"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`rounded-xl overflow-hidden shadow-sm ${i === 4 ? "relative" : ""}`}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${["1503676267111-225ef20ad4f0", "1427504494785-3a9ca7044f45", "1517486808906-6ca880c8c6c0", "1523050854058"][i - 1]}?w=300&h=200&fit=crop`}
                    alt=""
                    className="w-full h-[190px] object-cover"
                  />
                  {i === 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-heading font-bold text-lg">
                      +118 fotos
                    </div>
                  )}
                </div>
              ))}
              <div className="col-span-2 bg-violet-50 rounded-xl p-5 border border-violet-100">
                <h3 className="font-heading font-bold text-slate-900 mb-2">Sobre o evento</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A aplicação da OBMEP 2026 reuniu estudantes do campus em um dia de desafios e superação. Confira os melhores momentos.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=200&h=120&fit=crop"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Entrevista com medalhistas</p>
                    <p className="text-xs text-slate-500">02:45</p>
                  </div>
                </div>
                <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-md shadow-violet-200">
                  Ver todos os vídeos <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[hsl(var(--navy))] border-t-4 border-violet-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-violet-200" />
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl mb-2">Tem fotos do evento?</h3>
          <p className="text-white/60 mb-5">Compartilhe seus registros com a comunidade OlimpIFP2.</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors shadow-lg shadow-violet-500/30">
            Enviar fotos <Upload className="w-5 h-5" />
          </button>
          <p className="mt-8 font-heading text-lg font-semibold text-balance text-white/80">
            "Fotografias não são apenas lembranças, são capítulos da nossa história."
          </p>
        </div>
      </section>
    </div>
  );
}