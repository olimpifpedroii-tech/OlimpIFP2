import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy, Newspaper, Medal, Image as ImageIcon, LayoutDashboard, Plus, Trash2,
  Upload, ArrowLeft, Save, Calendar, LogOut, Loader2, X,
} from "lucide-react";
import { noticias as noticiasApi, medalhistas as medalhistasApi, olimpiadas as olimpiadasApi, galeria as galeriaApi, auth } from "@/lib/api";

const TABS = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "noticias", label: "Notícias", icon: Newspaper },
  { id: "medalhistas", label: "Medalhistas", icon: Medal },
  { id: "olimpiadas", label: "Olimpíadas", icon: Trophy },
  { id: "galeria", label: "Galeria", icon: ImageIcon },
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

function ImageUpload({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
          <img src={value} alt="preview" className="w-full h-40 object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/5 transition-colors">
          <Upload className="w-7 h-7 text-slate-400" />
          <span className="text-sm text-slate-500">Clique para enviar uma imagem</span>
          <input type="file" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onChange(URL.createObjectURL(f));
          }} />
        </label>
      )}
      <input
        type="text"
        value={value.startsWith?.("blob:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="...ou cole a URL da imagem"
        className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/30"
      />
    </div>
  );
}

/* ============ ADMIN PRINCIPAL ============ */
export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [noticias, setNoticias] = useState([]);
  const [medalhistas, setMedalhistas] = useState([]);
  const [olimpiadas, setOlimpiadas] = useState([]);
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega tudo da API ao abrir
  useEffect(() => {
    carregarTudo();
  }, []);

  const carregarTudo = async () => {
    setLoading(true);
    try {
      const [n, m, o, g] = await Promise.all([
        noticiasApi.list(),
        medalhistasApi.list(),
        olimpiadasApi.list(),
        galeriaApi.list(),
      ]);
      setNoticias(n);
      setMedalhistas(m);
      setOlimpiadas(o);
      setAlbuns(g);
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
      {/* Header */}
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
        {/* Tabs */}
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

        {tab === "dashboard" && <Dashboard noticias={noticias} medalhistas={medalhistas} olimpiadas={olimpiadas} albuns={albuns} />}
        {tab === "noticias" && <NoticiasAdmin items={noticias} setItems={setNoticias} />}
        {tab === "medalhistas" && <MedalhistasAdmin items={medalhistas} setItems={setMedalhistas} />}
        {tab === "olimpiadas" && <OlimpiadasAdmin items={olimpiadas} setItems={setOlimpiadas} />}
        {tab === "galeria" && <GaleriaAdmin items={albuns} setItems={setAlbuns} />}
      </div>
    </div>
  );
}

/* ============ DASHBOARD ============ */
function Dashboard({ noticias, medalhistas, olimpiadas, albuns }) {
  const cards = [
    { icon: Newspaper, label: "Notícias", count: noticias.length, color: "bg-blue-50 text-blue-700" },
    { icon: Medal, label: "Medalhistas", count: medalhistas.length, color: "bg-amber-50 text-amber-700" },
    { icon: Trophy, label: "Olimpíadas", count: olimpiadas.length, color: "bg-emerald-50 text-emerald-700" },
    { icon: ImageIcon, label: "Álbuns", count: albuns.length, color: "bg-violet-50 text-violet-700" },
  ];
  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-slate-900 mb-6">Visão geral</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="font-heading font-extrabold text-3xl text-slate-900">{c.count}</div>
              <div className="text-sm text-slate-500">{c.label}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-[hsl(var(--navy))] rounded-2xl p-6 text-white">
        <h3 className="font-heading font-bold text-lg mb-2">Bem-vindo ao painel administrativo</h3>
        <p className="text-white/70 text-sm">Use as abas acima para cadastrar notícias, medalhistas, olimpíadas e álbuns. Tudo é salvo no banco de dados.</p>
      </div>
    </div>
  );
}

/* ============ NOTÍCIAS ============ */
function NoticiasAdmin({ items, setItems }) {
  const [form, setForm] = useState({ title: "", date: "", category: "Premiações", summary: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const add = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setSaving(true);
    setError("");
    try {
      const nova = await noticiasApi.create({ ...form, views: 0, read_time: "3 min" });
      setItems([nova, ...items]);
      setForm({ title: "", date: "", category: "Premiações", summary: "", image: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Apagar esta notícia?")) return;
    try {
      await noticiasApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Nova Notícia
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={add} className="space-y-4">
          <Field label="Título"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título da notícia" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data"><input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="12 MAI 2025" /></Field>
            <Field label="Categoria">
              <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Premiações", "Olimpíadas", "Projeto", "Eventos", "Institucional", "Aulas", "Comunicados"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Resumo"><textarea rows={3} className={`${inputCls} resize-none`} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Resumo da notícia" /></Field>
          <ImageUpload label="Imagem de capa" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Publicar notícia"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} notícias cadastradas</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((n) => (
            <div key={n.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 shadow-sm">
              <img src={n.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 mb-1">{n.category}</span>
                <h3 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-2">{n.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> {n.date}</p>
              </div>
              <button onClick={() => remove(n.id)} className="self-start text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ MEDALHISTAS ============ */
function MedalhistasAdmin({ items, setItems }) {
  const [form, setForm] = useState({ name: "", medal: "Ouro", olympiad: "", course: "", quote: "", photo: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const add = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    setError("");
    try {
      const novo = await medalhistasApi.create(form);
      setItems([novo, ...items]);
      setForm({ name: "", medal: "Ouro", olympiad: "", course: "", quote: "", photo: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Apagar este medalhista?")) return;
    try {
      await medalhistasApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Novo Medalhista
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={add} className="space-y-4">
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
          <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Cadastrar medalhista"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} medalhistas cadastrados</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 shadow-sm">
              <img src={m.photo} alt="" className="w-16 h-16 rounded-full object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-slate-900">{m.name}</h3>
                <p className="text-xs text-slate-500">{m.course}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{m.medal} • {m.olympiad}</span>
              </div>
              <button onClick={() => remove(m.id)} className="self-start text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ OLIMPÍADAS ============ */
function OlimpiadasAdmin({ items, setItems }) {
  const [form, setForm] = useState({ name: "", area: "Matemática", level: "", desc: "", medal: "Ouro" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const add = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    setError("");
    try {
      const nova = await olimpiadasApi.create(form);
      setItems([nova, ...items]);
      setForm({ name: "", area: "Matemática", level: "", desc: "", medal: "Ouro" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Apagar esta olimpíada?")) return;
    try {
      await olimpiadasApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Nova Olimpíada
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={add} className="space-y-4">
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
          <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Cadastrar olimpíada"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} olimpíadas cadastradas</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((o) => (
            <div key={o.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--navy))]/5 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-[hsl(var(--navy))]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-slate-900">{o.name}</h3>
                <p className="text-xs text-slate-500">{o.area} • {o.level}</p>
              </div>
              <button onClick={() => remove(o.id)} className="self-start text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ GALERIA ============ */
function GaleriaAdmin({ items, setItems }) {
  const [form, setForm] = useState({ title: "", date: "", category: "Aplicações", photos: 0, image: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const add = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    setError("");
    try {
      const novo = await galeriaApi.create({ ...form, photos: Number(form.photos) || 0 });
      setItems([novo, ...items]);
      setForm({ title: "", date: "", category: "Aplicações", photos: 0, image: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Apagar este álbum?")) return;
    try {
      await galeriaApi.remove(id);
      setItems(items.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[hsl(var(--gold))]" /> Novo Álbum
        </h2>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <form onSubmit={add} className="space-y-4">
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
          <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full gold-gradient text-white font-semibold disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Cadastrar álbum"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-heading font-bold text-lg text-slate-900 mb-4">{items.length} álbuns cadastrados</h2>
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {items.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 shadow-sm">
              <img src={a.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-slate-900 leading-snug">{a.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{a.date} • {a.photos} fotos</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))]">{a.category}</span>
              </div>
              <button onClick={() => remove(a.id)} className="self-start text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}