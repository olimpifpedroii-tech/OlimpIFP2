import React, { useState } from "react";
import { Camera, Calendar, Play, Search, ImageIcon, FolderOpen, Video as VideoIcon, X, Youtube, FileVideo } from "lucide-react";
import { GALLERY_ALBUMS, GALLERY_CATEGORIES } from "@/lib/siteData";
import { useApiPaginado } from "@/hooks/use-api-paginado";
import { galeria as galeriaApi, videos as videosApi } from "@/lib/api";
import CarregarMais from "@/components/CarregarMais";

const categoryColors = {
  "Premiações": "bg-amber-100 text-amber-800",
  "Aplicações": "bg-blue-100 text-blue-800",
  "Aulas e Oficinas": "bg-emerald-100 text-emerald-800",
  "Palestras": "bg-rose-100 text-rose-800",
  "Visitas e Passeios": "bg-teal-100 text-teal-800",
  "Equipe e Reuniões": "bg-violet-100 text-violet-800",
  "Bastidores": "bg-orange-100 text-orange-800",
};

/* ============ HELPER YOUTUBE ============ */
function getYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/* ============ MODAL DE VÍDEO ============ */
function VideoModal({ video, onClose }) {
  if (!video) return null;
  const youtubeId = video.video_type === "youtube" ? getYoutubeId(video.youtube_url) : null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <div className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors" title="Fechar">
          <X className="w-5 h-5" />
        </button>

        <div className="bg-black aspect-video">
          {video.video_type === "youtube" && youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : video.video_type === "upload" && video.video_url ? (
            <video src={video.video_url} controls autoPlay className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Vídeo não disponível</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              video.video_type === "youtube" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            }`}>
              {video.video_type === "youtube" ? <><Youtube className="w-3 h-3" /> YouTube</> : <><FileVideo className="w-3 h-3" /> Upload</>}
            </span>
            {video.date && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {video.date}
              </span>
            )}
            <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-100">{video.category}</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-2">{video.title}</h2>
          {video.description && <p className="text-sm text-slate-600 leading-relaxed">{video.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Galeria() {
  const [tab, setTab] = useState("albuns");
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [videoAberto, setVideoAberto] = useState(null);

  // Álbuns com paginação (8 por vez)
  const {
    items: albuns,
    loading: loadingAlbuns,
    loadingMore: loadingMoreAlbuns,
    hasMore: hasMoreAlbuns,
    total: totalAlbuns,
    loadMore: loadMoreAlbuns,
  } = useApiPaginado((skip, limit) => galeriaApi.listPaginado(skip, limit), 8, GALLERY_ALBUMS);

  // Vídeos com paginação (6 por vez)
  const {
    items: videos,
    loading: loadingVideos,
    loadingMore: loadingMoreVideos,
    hasMore: hasMoreVideos,
    total: totalVideos,
    loadMore: loadMoreVideos,
  } = useApiPaginado((skip, limit) => videosApi.listPaginado(skip, limit), 6, []);

  const filteredAlbuns = albuns.filter((a) => {
    if (category !== "Todos" && a.category !== category) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredVideos = videos.filter((v) => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Verifica se tem filtro ativo
  const temFiltroAlbum = category !== "Todos" || search !== "";
  const temFiltroVideo = search !== "";

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-[hsl(var(--navy))] overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-200 text-xs font-semibold uppercase tracking-widest mb-4">
                <Camera className="w-4 h-4" /> Memórias em imagens e vídeos
              </span>
              <h1 className="font-heading font-extrabold" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>GALERIA</h1>
              <p className="mt-3 text-white/80 text-lg">Momentos que constroem nossa história</p>
              <p className="mt-4 text-white/60 leading-relaxed max-w-lg">
                Cada fotografia e cada vídeo preserva um momento que ajudou a construir a história do OlimpIFP2.
                Reviva eventos, conquistas e experiências que marcaram nossa trajetória.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-violet-50/60 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 border-b-2 border-violet-100">
            <button
              onClick={() => setTab("albuns")}
              className={`inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-4 -mb-0.5 ${
                tab === "albuns" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-violet-600"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Álbuns de Fotos
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tab === "albuns" ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {totalAlbuns}
              </span>
            </button>
            <button
              onClick={() => setTab("videos")}
              className={`inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-b-4 -mb-0.5 ${
                tab === "videos" ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-violet-600"
              }`}
            >
              <VideoIcon className="w-4 h-4" />
              Vídeos
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${tab === "videos" ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {totalVideos}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-violet-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-l-4 border-violet-400 border-t border-r border-b border-slate-100 shadow-sm p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={tab === "albuns" ? "Buscar álbuns..." : "Buscar vídeos..."}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-violet-100 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-colors"
                />
              </div>
              {tab === "albuns" && (
                <>
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
                </>
              )}
            </div>

            {tab === "albuns" && (
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
            )}
          </div>
        </div>
      </section>

      {/* ─── ABA: ÁLBUNS ─── */}
      {tab === "albuns" && (
        <section className="pb-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <h2 className="font-heading font-bold text-xl text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-violet-600" />
              </span>
              Álbuns de Eventos
            </h2>

            {loadingAlbuns && <div className="text-center py-12 text-slate-400">Carregando álbuns...</div>}

            {!loadingAlbuns && filteredAlbuns.length === 0 && (
              <div className="text-center py-12 text-slate-400">Nenhum álbum encontrado.</div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredAlbuns.map((a) => {
                const catColor = categoryColors[a.category] || "bg-violet-100 text-violet-700";
                return (
                  <article key={a.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-[hsl(var(--navy))] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                        {a.date}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-bold text-slate-900 leading-snug group-hover:text-violet-700 transition-colors">{a.title}</h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {a.date}</span>
                        <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> {a.photos} fotos</span>
                      </div>
                      <span className={`mt-3 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor}`}>
                        {a.category}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Botão "Carregar mais" (só sem filtro) */}
            {!temFiltroAlbum && (
              <CarregarMais
                onClick={loadMoreAlbuns}
                loading={loadingMoreAlbuns}
                hasMore={hasMoreAlbuns}
                total={totalAlbuns}
                shown={albuns.length}
                label="Carregar mais álbuns"
                corBase="violet"
              />
            )}

            {temFiltroAlbum && hasMoreAlbuns && (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 italic">Limpe os filtros para carregar mais álbuns.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── ABA: VÍDEOS ─── */}
      {tab === "videos" && (
        <section className="pb-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <h2 className="font-heading font-bold text-xl text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <VideoIcon className="w-5 h-5 text-rose-600" />
              </span>
              Vídeos do OlimpIFP2
            </h2>

            {loadingVideos && <div className="text-center py-12 text-slate-400">Carregando vídeos...</div>}

            {!loadingVideos && filteredVideos.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <VideoIcon className="w-8 h-8 text-rose-500" />
                </div>
                <p className="text-slate-500 font-semibold">Nenhum vídeo cadastrado ainda</p>
                <p className="text-sm text-slate-400 mt-1">Os vídeos aparecerão aqui quando forem adicionados pelo painel.</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((v) => (
                <article key={v.id} onClick={() => setVideoAberto(v)} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-rose-100 hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="relative aspect-video bg-slate-800 overflow-hidden">
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoIcon className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 flex items-center justify-center transition-all shadow-lg">
                        <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-1" />
                      </div>
                    </div>
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      v.video_type === "youtube" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
                    }`}>
                      {v.video_type === "youtube" ? <><Youtube className="w-3 h-3" /> YouTube</> : <><FileVideo className="w-3 h-3" /> Upload</>}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-slate-900 leading-snug group-hover:text-rose-700 transition-colors line-clamp-2">
                      {v.title}
                    </h3>
                    {v.description && (
                      <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">{v.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      {v.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {v.date}</span>}
                      <span className="px-2 py-0.5 rounded-full bg-slate-100">{v.category}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Botão "Carregar mais" (só sem busca) */}
            {!temFiltroVideo && (
              <CarregarMais
                onClick={loadMoreVideos}
                loading={loadingMoreVideos}
                hasMore={hasMoreVideos}
                total={totalVideos}
                shown={videos.length}
                label="Carregar mais vídeos"
                corBase="rose"
              />
            )}

            {temFiltroVideo && hasMoreVideos && (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 italic">Limpe a busca para carregar mais vídeos.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-[hsl(var(--navy))] border-t-4 border-violet-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7 text-violet-200" />
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl mb-2">Compartilhe seus registros</h3>
          <p className="text-white/60 mb-5">Em breve você poderá enviar fotos e vídeos diretamente pelo site.</p>
          <p className="mt-8 font-heading text-lg font-semibold text-balance text-white/80">
            "Fotografias e vídeos não são apenas lembranças, são capítulos da nossa história."
          </p>
        </div>
      </section>

      {videoAberto && <VideoModal video={videoAberto} onClose={() => setVideoAberto(null)} />}
    </div>
  );
}