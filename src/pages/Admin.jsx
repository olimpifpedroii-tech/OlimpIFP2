import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy, Newspaper, Medal, Image as ImageIcon, LayoutDashboard, Plus, Trash2,
  Upload, ArrowLeft, Save, Calendar, LogOut, Loader2, X, ExternalLink, Pencil,
  XCircle, Video as VideoIcon, Youtube, FileVideo, Play, CalendarDays, Clock, MapPin,
} from "lucide-react";
import {
  noticias as noticiasApi,
  medalhistas as medalhistasApi,
  olimpiadas as olimpiadasApi,
  galeria as galeriaApi,
  videos as videosApi,
  eventos as eventosApi,
  auth,
  getToken,
} from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TABS = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "noticias", label: "Notícias", icon: Newspaper },
  { id: "eventos", label: "Eventos", icon: CalendarDays },
  { id: "medalhistas", label: "Medalhistas", icon: Medal },
  { id: "olimpiadas", label: "Olimpíadas", icon: Trophy },
  { id: "galeria", label: "Galeria", icon: ImageIcon },
  { id: "videos", label: "Vídeos", icon: VideoIcon },
];

const inputCls = "w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/30";

/* ============ HELPERS ============ */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

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

function getYoutubeThumbnail(url) {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

/* ============ UPLOAD DE IMAGEM ============ */
function ImageUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.url);
            } catch {
              reject(new Error("Resposta inválida do servidor"));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.detail || "Erro ao enviar imagem"));
            } catch {
              reject(new Error(`Erro ${xhr.status} ao enviar imagem`));
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Erro de rede")));

        xhr.open("POST", `${API_URL}/api/upload`);
        xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);
        xhr.send(formData);
      });

      onChange(url);
    } catch (err) {
      setError(err.message || "Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>

      {value ? (
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
            <img src={value} alt="preview" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              title="Remover imagem"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Trocar imagem
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
            uploading
              ? "border-amber-400 bg-amber-50"
              : "border-slate-300 hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/5"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
              <span className="text-sm text-slate-600 font-semibold">Enviando... {progress}%</span>
              <div className="w-32 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-7 h-7 text-slate-400" />
              <span className="text-sm text-slate-500">Clique para escolher uma imagem</span>
              <span className="text-xs text-slate-400">JPG, PNG, WebP, GIF (máx. 10 MB)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </>
          )}
        </label>
      )}

      {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

/* ============ UPLOAD DE VÍDEO ============ */
function VideoUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.url);
            } catch {
              reject(new Error("Resposta inválida do servidor"));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.detail || "Erro ao enviar vídeo"));
            } catch {
              reject(new Error(`Erro ${xhr.status} ao enviar vídeo`));
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Erro de rede")));

        xhr.open("POST", `${API_URL}/api/upload/video`);
        xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);
        xhr.send(formData);
      });

      onChange(url);
    } catch (err) {
      setError(err.message || "Erro ao enviar vídeo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="space-y-2">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-black">
            <video src={value} controls className="w-full max-h-64" />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-sm font-semibold text-red-700 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            Remover vídeo
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
            uploading
              ? "border-amber-400 bg-amber-50"
              : "border-slate-300 hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/5"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
              <span className="text-sm text-slate-600 font-semibold">Enviando... {progress}%</span>
              <div className="w-32 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <FileVideo className="w-7 h-7 text-slate-400" />
              <span className="text-sm text-slate-500">Clique para escolher um vídeo</span>
              <span className="text-xs text-slate-400">MP4, WebM, MOV (máx. 50 MB)</span>
              <input type="file" accept="video/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </>
          )}
        </label>
      )}

      {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

/* ============ ADMIN PRINCIPAL ============ */
export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [noticias, setNoticias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [medalhistas, setMedalhistas] = useState([]);
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [albuns, setAlbuns] = useState([]);
  const [listaVideos, setListaVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTudo();
  }, []);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      const [n, e, m, o, g, v] = await Promise.all([
        noticiasApi.list(),
        eventosApi.list(),
        medalhistasApi.list(),
        olimpiadasApi.list(),
        galeriaApi.list(),
        videosApi.list(),
      ]);
      setNoticias(n);
      setEventos(e);
      setMedalhistas(m);
      setOlimpiadas(o);
      setAlbuns(g);
      setListaVideos(v);
    } catch (err) {
      if (err.message?.includes("401") || err.message?.includes("Token")) {
        auth.logout();
        navigate("/login", { replace: true });
      } else {
        console.error("Erro ao carregar:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--canvas))] pt-16 lg:pt-20">
      <div className="bg-[hsl(var(--navy))] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-lg">Painel Administrativo</h1>
              <p className="text-white/50 text-xs">OlimpIFP2 • Gerenciar conteúdo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Ver site
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-sm font-semibold transition-colors">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === t.id ? "bg-[hsl(var(--navy))] text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "dashboard" && <Dashboard noticias={noticias} eventos={eventos} medalhistas={medalhistas} olimpiadas={olimpiadas} albuns={albuns} videos={listaVideos} />}
        {tab === "noticias" && <NoticiasAdmin items={noticias} setItems={setNoticias} />}
        {tab === "eventos" && <EventosAdmin items={eventos} setItems={setEventos} />}
        {tab === "medalhistas" && <MedalhistasAdmin items={medalhistas} setItems={setMedalhistas} />}
        {tab === "olimpiadas" && <OlimpiadasAdmin items={olimpiadas} setItems={setOlimpiadas} />}
        {tab === "galeria" && <GaleriaAdmin items={albuns} setItems={setAlbuns} />}
        {tab === "videos" && <VideosAdmin items={listaVideos} setItems={setListaVideos} />}
      </div>
    </div>
  );
}

/* ============ DASHBOARD ============ */
function Dashboard({ noticias, eventos, medalhistas, olimpiadas, albuns, videos }) {
  const cards = [
    { icon: Newspaper, label: "Notícias", count: noticias.length, color: "bg-blue-50 text-blue-700" },
    { icon: CalendarDays, label: "Eventos", count: eventos.length, color: "bg-orange-50 text-orange-700" },
    { icon: Medal, label: "Medalhistas", count: medalhistas.length, color: "bg-amber-50 text-amber-700" },
    { icon: Trophy, label: "Olimpíadas", count: olimpiadas.length, color: "bg-emerald-50 text-emerald-700" },
    { icon: ImageIcon, label: "Álbuns", count: albuns.length, color: "bg-violet-50 text-violet-700" },
    { icon: VideoIcon, label: "Vídeos", count: videos.length, color: "bg-rose-50 text-rose-700" },
  ];
  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-slate-900 mb-6">Visão geral</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-heading font-extrabold text-2xl text-slate-900">{c.count}</div>
              <div className="text-xs text-slate-500">{c.label}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-[hsl(var(--navy))] rounded-2xl p-6 text-white">
        <h3 className="font-heading font-bold text-lg mb-2">Bem-vindo ao painel administrativo</h3>
        <p className="text-white/70 text-sm">Use as abas acima para cadastrar notícias, eventos, medalhistas, olimpíadas, álbuns e vídeos.</p>
      </div>
    </div>
  );
}

/* ============ EVENTOS ============ */
function EventosAdmin({ items, setItems }) {
  const formVazio = { title: "", date: "", time: "", location: "", description: "" };
  const [form, setForm] = useState(formVazio);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        const atualizado = await eventosApi.update(editingId, form);
        setItems(items.map((x) => (x.id === editingId ? atualizado : x)));
      } else {
        const novo = await eventosApi.create(form);
        setItems([novo, ...items]);
      }
      resetForm();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const resetForm = () => { setForm(formVazio); setEditingId(null); setError(""); };

  const startEdit = (ev) => {
    setForm({
      title: ev.title || "",
      date: ev.date || "",
      time: ev.time || "",
      location: ev.location || "",
      description: ev.description || "",
    });
    setEditingId(ev.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Apagar este evento?")) return;
    try {
      await eventosApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
      if (editingId === id) resetForm();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className={`bg-white rounded-2xl border p-6 shadow-sm ${isEditing ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          {isEditing ? (<><Pencil className="w-5 h-5 text-amber-600" /> Editar Evento</>) : (<><Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Novo Evento</>)}
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Field label="Título do evento">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Aplicação da OBMEP 2026" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data">
              <input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="15 OUT 2026" />
            </Field>
            <Field label="Hora (opcional)">
              <input className={inputCls} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="14h" />
            </Field>
          </div>

          <Field label="Local (opcional)">
            <input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Auditório do IFPI" />
          </Field>

          <Field label="Descrição (opcional)">
            <textarea rows={3} className={`${inputCls} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição do evento" />
          </Field>

          <div className="flex gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar evento"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} eventos cadastrados</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((ev) => (
            <div key={ev.id} className={`bg-white rounded-xl border p-4 flex gap-4 shadow-sm ${editingId === ev.id ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
              <div className="w-14 h-14 rounded-lg bg-orange-100 flex flex-col items-center justify-center shrink-0 text-orange-700">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-slate-900 leading-snug">{ev.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ev.date}</span>
                  {ev.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time}</span>}
                  {ev.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.location}</span>}
                </div>
              </div>
              <div className="self-start flex gap-1">
                <button onClick={() => startEdit(ev)} className="text-slate-300 hover:text-amber-600 transition-colors p-1" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(ev.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Apagar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ NOTÍCIAS ============ */
function NoticiasAdmin({ items, setItems }) {
  const formVazio = { title: "", date: "", category: "Premiações", summary: "", content: "", image: "" };
  const [form, setForm] = useState(formVazio);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        const atualizada = await noticiasApi.update(editingId, form);
        setItems(items.map((x) => (x.id === editingId ? atualizada : x)));
      } else {
        const nova = await noticiasApi.create({ ...form, views: 0, read_time: "3 min" });
        setItems([nova, ...items]);
      }
      resetForm();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const resetForm = () => { setForm(formVazio); setEditingId(null); setError(""); };

  const startEdit = (n) => {
    setForm({
      title: n.title || "", date: n.date || "", category: n.category || "Premiações",
      summary: n.summary || "", content: n.content || "", image: n.image || "",
    });
    setEditingId(n.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Apagar esta notícia?")) return;
    try {
      await noticiasApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
      if (editingId === id) resetForm();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className={`bg-white rounded-2xl border p-6 shadow-sm ${isEditing ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          {isEditing ? (<><Pencil className="w-5 h-5 text-amber-600" /> Editar Notícia</>) : (<><Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Nova Notícia</>)}
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Field label="Título"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título da notícia" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data"><input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="12 MAI 2025" /></Field>
            <Field label="Categoria">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Premiações", "Olimpíadas", "Projeto", "Eventos", "Institucional", "Aulas", "Comunicados"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Resumo"><textarea rows={2} className={`${inputCls} resize-none`} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Resumo curto" /></Field>
          <Field label="Conteúdo completo"><textarea rows={6} className={`${inputCls} resize-none`} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Texto completo da notícia" /></Field>
          <ImageUpload label="Imagem de capa" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <div className="flex gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Publicar notícia"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} notícias cadastradas</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((n) => (
            <div key={n.id} className={`bg-white rounded-xl border p-4 flex gap-4 shadow-sm ${editingId === n.id ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
              <img src={n.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 bg-slate-100" />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 mb-1">{n.category}</span>
                <h3 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-2">{n.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> {n.date}</p>
              </div>
              <div className="self-start flex gap-1">
                <button onClick={() => startEdit(n)} className="text-slate-300 hover:text-amber-600 transition-colors p-1" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(n.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Apagar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ MEDALHISTAS ============ */
function MedalhistasAdmin({ items, setItems }) {
  const formVazio = { name: "", medal: "Ouro", olympiad: "", course: "", quote: "", photo: "" };
  const [form, setForm] = useState(formVazio);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        const atualizado = await medalhistasApi.update(editingId, form);
        setItems(items.map((x) => (x.id === editingId ? atualizado : x)));
      } else {
        const novo = await medalhistasApi.create(form);
        setItems([novo, ...items]);
      }
      resetForm();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const resetForm = () => { setForm(formVazio); setEditingId(null); setError(""); };

  const startEdit = (m) => {
    setForm({
      name: m.name || "", medal: m.medal || "Ouro", olympiad: m.olympiad || "",
      course: m.course || "", quote: m.quote || "", photo: m.photo || "",
    });
    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Apagar este medalhista?")) return;
    try {
      await medalhistasApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
      if (editingId === id) resetForm();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className={`bg-white rounded-2xl border p-6 shadow-sm ${isEditing ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          {isEditing ? (<><Pencil className="w-5 h-5 text-amber-600" /> Editar Medalhista</>) : (<><Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Novo Medalhista</>)}
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Field label="Nome do estudante"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Medalha">
              <select className={inputCls} value={form.medal} onChange={(e) => setForm({ ...form, medal: e.target.value })}>
                {["Ouro", "Prata", "Bronze", "Honra ao Mérito", "Classificado", "Participação"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Olimpíada"><input className={inputCls} value={form.olympiad} onChange={(e) => setForm({ ...form, olympiad: e.target.value })} placeholder="OBMEP 2024" /></Field>
          </div>
          <Field label="Curso / Ano"><input className={inputCls} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="3º ano - Informática" /></Field>
          <Field label="Frase do estudante"><textarea rows={2} className={`${inputCls} resize-none`} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder='"Cada problema resolvido..."' /></Field>
          <ImageUpload label="Foto do estudante" value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} />
          <div className="flex gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar medalhista"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} medalhistas cadastrados</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((m) => (
            <div key={m.id} className={`bg-white rounded-xl border p-4 flex gap-4 shadow-sm ${editingId === m.id ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
              <img src={m.photo} alt="" className="w-16 h-16 rounded-full object-cover shrink-0 bg-slate-100" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-slate-900">{m.name}</h3>
                <p className="text-xs text-slate-500">{m.course}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{m.medal} • {m.olympiad}</span>
              </div>
              <div className="self-start flex gap-1">
                <button onClick={() => startEdit(m)} className="text-slate-300 hover:text-amber-600 transition-colors p-1" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(m.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Apagar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ OLIMPÍADAS ============ */
function OlimpiadasAdmin({ items, setItems }) {
  const formVazio = { name: "", area: "Matemática", level: "", desc: "", medal: "Ouro", site_url: "" };
  const [form, setForm] = useState(formVazio);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        const atualizada = await olimpiadasApi.update(editingId, form);
        setItems(items.map((x) => (x.id === editingId ? atualizada : x)));
      } else {
        const nova = await olimpiadasApi.create(form);
        setItems([nova, ...items]);
      }
      resetForm();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const resetForm = () => { setForm(formVazio); setEditingId(null); setError(""); };

  const startEdit = (o) => {
    setForm({
      name: o.name || "", area: o.area || "Matemática", level: o.level || "",
      desc: o.desc || "", medal: o.medal || "Ouro", site_url: o.site_url || "",
    });
    setEditingId(o.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Apagar esta olimpíada?")) return;
    try {
      await olimpiadasApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
      if (editingId === id) resetForm();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className={`bg-white rounded-2xl border p-6 shadow-sm ${isEditing ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          {isEditing ? (<><Pencil className="w-5 h-5 text-amber-600" /> Editar Olimpíada</>) : (<><Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Nova Olimpíada</>)}
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Field label="Nome da olimpíada"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="OBMEP" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Área">
              <select className={inputCls} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
                {["Matemática", "Ciências da Natureza", "Tecnologia", "Linguagens", "Humanas", "Empreendedorismo", "Interdisciplinares"].map((a) => <option key={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Nível"><input className={inputCls} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Ensino Médio" /></Field>
          </div>
          <Field label="Descrição"><textarea rows={3} className={`${inputCls} resize-none`} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Descrição da olimpíada" /></Field>
          <Field label="Medalha conquistada">
            <select className={inputCls} value={form.medal} onChange={(e) => setForm({ ...form, medal: e.target.value })}>
              {["Ouro", "Prata", "Bronze", "Honra"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Site oficial (URL)">
            <input className={inputCls} value={form.site_url} onChange={(e) => setForm({ ...form, site_url: e.target.value })} placeholder="https://www.obmep.org.br" type="url" />
          </Field>
          <div className="flex gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar olimpíada"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} olimpíadas cadastradas</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((o) => (
            <div key={o.id} className={`bg-white rounded-xl border p-4 flex gap-4 shadow-sm ${editingId === o.id ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--navy))]/5 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-[hsl(var(--navy))]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-slate-900">{o.name}</h3>
                <p className="text-xs text-slate-500">{o.area} • {o.level}</p>
                {o.site_url && (
                  <a href={o.site_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 mt-1">
                    <ExternalLink className="w-3 h-3" /> Site cadastrado
                  </a>
                )}
              </div>
              <div className="self-start flex gap-1">
                <button onClick={() => startEdit(o)} className="text-slate-300 hover:text-amber-600 transition-colors p-1" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(o.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Apagar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ GALERIA ============ */
function GaleriaAdmin({ items, setItems }) {
  const formVazio = { title: "", date: "", category: "Aplicações", photos: 0, image: "" };
  const [form, setForm] = useState(formVazio);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, photos: Number(form.photos) || 0 };
      if (isEditing) {
        const atualizado = await galeriaApi.update(editingId, payload);
        setItems(items.map((x) => (x.id === editingId ? atualizado : x)));
      } else {
        const novo = await galeriaApi.create(payload);
        setItems([novo, ...items]);
      }
      resetForm();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const resetForm = () => { setForm(formVazio); setEditingId(null); setError(""); };

  const startEdit = (a) => {
    setForm({
      title: a.title || "", date: a.date || "", category: a.category || "Aplicações",
      photos: a.photos || 0, image: a.image || "",
    });
    setEditingId(a.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Apagar este álbum?")) return;
    try {
      await galeriaApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
      if (editingId === id) resetForm();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className={`bg-white rounded-2xl border p-6 shadow-sm ${isEditing ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          {isEditing ? (<><Pencil className="w-5 h-5 text-amber-600" /> Editar Álbum</>) : (<><Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Novo Álbum</>)}
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Field label="Título do evento"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Aplicação da OBMEP 2026" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data"><input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="07 JUN 2026" /></Field>
            <Field label="Nº de fotos"><input type="number" className={inputCls} value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} placeholder="122" /></Field>
          </div>
          <Field label="Categoria">
            <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Premiações", "Aplicações", "Aulas e Oficinas", "Palestras", "Visitas e Passeios", "Equipe e Reuniões", "Bastidores"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <ImageUpload label="Imagem de capa do álbum" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <div className="flex gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar álbum"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} álbuns cadastrados</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((a) => (
            <div key={a.id} className={`bg-white rounded-xl border p-4 flex gap-4 shadow-sm ${editingId === a.id ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
              <img src={a.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 bg-slate-100" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-slate-900 leading-snug">{a.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{a.date} • {a.photos} fotos</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))]">{a.category}</span>
              </div>
              <div className="self-start flex gap-1">
                <button onClick={() => startEdit(a)} className="text-slate-300 hover:text-amber-600 transition-colors p-1" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(a.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Apagar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ VÍDEOS ============ */
function VideosAdmin({ items, setItems }) {
  const formVazio = {
    title: "", description: "", video_type: "youtube",
    youtube_url: "", video_url: "", thumbnail: "", date: "", category: "Geral",
  };
  const [form, setForm] = useState(formVazio);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = editingId !== null;
  const isYoutube = form.video_type === "youtube";

  const handleYoutubeChange = (url) => {
    const thumb = getYoutubeThumbnail(url);
    setForm({ ...form, youtube_url: url, thumbnail: thumb });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) return;

    if (isYoutube && !form.youtube_url) {
      setError("Cole a URL do YouTube ou mude para upload de arquivo.");
      return;
    }
    if (!isYoutube && !form.video_url) {
      setError("Faça upload do vídeo ou mude para YouTube.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        const atualizado = await videosApi.update(editingId, form);
        setItems(items.map((x) => (x.id === editingId ? atualizado : x)));
      } else {
        const novo = await videosApi.create(form);
        setItems([novo, ...items]);
      }
      resetForm();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const resetForm = () => { setForm(formVazio); setEditingId(null); setError(""); };

  const startEdit = (v) => {
    setForm({
      title: v.title || "",
      description: v.description || "",
      video_type: v.video_type || "youtube",
      youtube_url: v.youtube_url || "",
      video_url: v.video_url || "",
      thumbnail: v.thumbnail || "",
      date: v.date || "",
      category: v.category || "Geral",
    });
    setEditingId(v.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Apagar este vídeo?")) return;
    try {
      await videosApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
      if (editingId === id) resetForm();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className={`bg-white rounded-2xl border p-6 shadow-sm ${isEditing ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          {isEditing ? (<><Pencil className="w-5 h-5 text-amber-600" /> Editar Vídeo</>) : (<><Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Novo Vídeo</>)}
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Field label="Título do vídeo"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Cerimônia de Premiação 2025" /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data"><input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="22 MAI 2026" /></Field>
            <Field label="Categoria">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Geral", "Premiações", "Aplicações", "Aulas e Oficinas", "Palestras", "Depoimentos", "Bastidores"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Tipo de vídeo">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, video_type: "youtube" })}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                  isYoutube ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Youtube className="w-4 h-4" /> YouTube
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, video_type: "upload" })}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                  !isYoutube ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <FileVideo className="w-4 h-4" /> Upload
              </button>
            </div>
          </Field>

          {isYoutube ? (
            <Field label="URL do YouTube">
              <input className={inputCls} value={form.youtube_url} onChange={(e) => handleYoutubeChange(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." type="url" />
              <p className="mt-1 text-xs text-slate-400">Cole o link do vídeo. A miniatura é preenchida automaticamente.</p>
            </Field>
          ) : (
            <Field label="Arquivo de vídeo">
              <VideoUpload value={form.video_url} onChange={(v) => setForm({ ...form, video_url: v })} />
              <p className="mt-1 text-xs text-amber-600">⚠️ Máx. 50 MB por vídeo. Para vídeos maiores, use YouTube.</p>
            </Field>
          )}

          {form.thumbnail && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Miniatura</label>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img src={form.thumbnail} alt="thumb" className="w-full h-40 object-cover" />
              </div>
            </div>
          )}

          <Field label="Descrição (opcional)">
            <textarea rows={3} className={`${inputCls} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição do vídeo" />
          </Field>

          <div className="flex gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar vídeo"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} vídeos cadastrados</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((v) => (
            <div key={v.id} className={`bg-white rounded-xl border p-4 flex gap-4 shadow-sm ${editingId === v.id ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
              <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                    <VideoIcon className="w-6 h-6" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1 ${v.video_type === "youtube" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {v.video_type === "youtube" ? "YouTube" : "Upload"}
                </span>
                <h3 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-2">{v.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{v.date} • {v.category}</p>
              </div>
              <div className="self-start flex gap-1">
                <button onClick={() => startEdit(v)} className="text-slate-300 hover:text-amber-600 transition-colors p-1" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(v.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Apagar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}