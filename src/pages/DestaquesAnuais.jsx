import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award, ArrowRight, Calendar, Crown } from "lucide-react";
import { medalhistas as medalhistasApi } from "@/lib/api";


const ORDEM_MEDALHAS = [
  "Diamante",
  "Ouro",
  "Prata",
  "Bronze",
  "Honra ao Mérito",
  "Menção Honrosa",
];

const TODAS_PREMIACOES = [
  ...ORDEM_MEDALHAS,
  "Outra Premiação",
];


const medalColors = {
  Diamante: { bg: "bg-cyan-500", text: "text-cyan-900", light: "bg-cyan-100" },
  Ouro: { bg: "bg-amber-400", text: "text-amber-900", light: "bg-amber-100" },
  Prata: { bg: "bg-slate-400", text: "text-slate-800", light: "bg-slate-100" },
  Bronze: { bg: "bg-orange-500", text: "text-orange-900", light: "bg-orange-100" },
  "Honra ao Mérito": { bg: "bg-emerald-500", text: "text-emerald-900", light: "bg-emerald-100" },
  "Menção Honrosa": { bg: "bg-teal-500", text: "text-teal-900", light: "bg-teal-100" },
  "Outra Premiação": { bg: "bg-violet-500", text: "text-violet-900", light: "bg-violet-100" },
};

const rankColors = [
  { bg: "bg-amber-500", label: "1º Lugar", icon: Crown },
  { bg: "bg-slate-400", label: "2º Lugar", icon: Medal },
  { bg: "bg-orange-600", label: "3º Lugar", icon: Award },
];

const getAno = (m) => {
  const anoOlimpiada = m.olympiad?.match(/\b(20\d{2})\b/)?.[1];
  if (anoOlimpiada) return anoOlimpiada;
  if (m.created_at) return new Date(m.created_at).getFullYear().toString();
  return "";
};

const normalizar = (texto = "") => texto.trim().toLocaleLowerCase("pt-BR").replace(/\s+/g, " ");

export default function DestaquesAnuais() {
  const [medalhistas, setMedalhistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    let ativo = true;
    medalhistasApi.list()
      .then((dados) => {
        if (!ativo) return;
        setMedalhistas(Array.isArray(dados) ? dados : []);
      })
      .catch((err) => ativo && setError(err.message || "Não foi possível carregar os medalhistas."))
      .finally(() => ativo && setLoading(false));
    return () => { ativo = false; };
  }, []);

  const anos = useMemo(() => {
    return [...new Set(medalhistas.map(getAno).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  }, [medalhistas]);

  useEffect(() => {
    if (!year && anos.length) setYear(anos[0]);
  }, [anos, year]);

  const ranking = useMemo(() => {
  if (!year) return [];

  const grupos = new Map();

  medalhistas
    .filter(
      (m) =>
        getAno(m) === year &&
        TODAS_PREMIACOES.includes(m.medal)
    )
    .forEach((m) => {
      // O aluno é identificado somente pelo nome completo.
      const chave = normalizar(m.name);

      if (!grupos.has(chave)) {
        grupos.set(chave, {
          name: m.name,
          course: m.course || "",
          photo: m.photo || "",
          quote: m.quote || "",
          total: 0,
          counts: Object.fromEntries(
            TODAS_PREMIACOES.map((premiacao) => [premiacao, 0])
          ),
          conquests: [],
        });
      }

      const aluno = grupos.get(chave);

      // Toda conquista conta como 1, inclusive "Outra Premiação".
      aluno.total += 1;
      aluno.counts[m.medal] += 1;

      aluno.conquests.push(
  `${m.medal}${m.olympiad ? ` — ${m.olympiad}` : ""}${m.scope ? ` — ${m.scope}` : ""}`
);

      // Se o primeiro registro não tiver esses dados,
      // aproveita os dados de outro registro do mesmo aluno.
      if (!aluno.course && m.course) aluno.course = m.course;
      if (!aluno.photo && m.photo) aluno.photo = m.photo;
      if (!aluno.quote && m.quote) aluno.quote = m.quote;
    });

  return [...grupos.values()]
    .sort((a, b) => {
      // 1º critério: quantidade total de conquistas.
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      // 2º critério: hierarquia das medalhas.
      // "Outra Premiação" não participa deste desempate.
      for (const medalha of ORDEM_MEDALHAS) {
        if (b.counts[medalha] !== a.counts[medalha]) {
          return b.counts[medalha] - a.counts[medalha];
        }
      }

      // Se continuar completamente empatado, apenas estabiliza a ordem.
      return a.name.localeCompare(b.name, "pt-BR");
    })
    .slice(0, 3);
}, [medalhistas, year]);

  return (
    <div className="pt-16 lg:pt-20">
      <section className="relative py-16 lg:py-24 bg-[hsl(var(--navy))] overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-4">
                <Crown className="w-4 h-4" /> Hall da Fama OlimpIFP2
              </span>
              <h1 className="font-heading font-extrabold" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>DESTAQUES ANUAIS</h1>
              <p className="mt-3 text-amber-200 text-lg font-semibold">Ranking calculado a partir das conquistas cadastradas.</p>
              <p className="mt-4 text-white/60 leading-relaxed max-w-xl">
  A classificação considera primeiro a quantidade total de conquistas.
  Em caso de empate, o desempate segue a hierarquia: Diamante, Ouro,
  Prata, Bronze, Honra ao Mérito e Menção Honrosa.
</p>
            </div>
            <div className="flex justify-center lg:justify-end gap-4">
              {rankColors.map((r, i) => {
                const Icon = r.icon;
                return <div key={i} className="text-center"><div className={`w-20 h-20 rounded-full ${r.bg} flex items-center justify-center shadow-xl ring-4 ring-white/10`}><Icon className="w-10 h-10 text-white" strokeWidth={2.5} /></div><p className="mt-2 text-white/80 text-xs font-semibold uppercase tracking-wider">{r.label}</p></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-amber-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-3 bg-white rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm">
              <Calendar className="w-5 h-5 text-amber-600" />
              <select value={year} onChange={(e) => setYear(e.target.value)} className="text-sm font-semibold text-slate-900 bg-transparent focus:outline-none" disabled={!anos.length}>
                {!anos.length && <option value="">Sem anos cadastrados</option>}
                {anos.map((ano) => <option key={ano} value={ano}>{ano}</option>)}
              </select>
            </div>
            <div className="flex-1 bg-white border-2 border-amber-100 rounded-xl px-5 py-3 text-sm text-slate-600 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              O ranking é atualizado automaticamente conforme novas conquistas são cadastradas.
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10">
          {loading && <div className="text-center py-12 text-slate-500">Calculando destaques...</div>}
          {!loading && error && <div className="text-center py-12 text-red-600">{error}</div>}
          {!loading && !error && ranking.length === 0 && <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">Nenhuma conquista válida cadastrada para {year || "este ano"}.</div>}

          {ranking.map((h, i) => {
            const rank = rankColors[i];
            const RankIcon = rank.icon;
            return (
              <article key={`${h.name}-${h.course}-${i}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-amber-100 transition-all overflow-hidden grid md:grid-cols-12 border-l-4 border-l-amber-500">
                <div className="md:col-span-2 bg-[hsl(var(--navy))] p-6 flex md:flex-col items-center justify-center gap-4 text-center">
                  <div className={`w-16 h-16 rounded-full ${rank.bg} flex items-center justify-center text-white shadow-lg ring-4 ring-white/20`}><RankIcon className="w-8 h-8" strokeWidth={2.5} /></div>
                  <div><p className="text-amber-300 text-[10px] font-bold uppercase tracking-widest">{rank.label}</p><p className="text-white font-heading font-bold text-lg">{year}</p></div>
                </div>

                <div className="md:col-span-3 bg-slate-100 min-h-[240px]">
                  {h.photo ? <img src={h.photo} alt={h.name} className="w-full h-full max-h-[360px] object-cover" /> : <div className="w-full h-full min-h-[240px] flex items-center justify-center text-slate-400"><Medal className="w-16 h-16" /></div>}
                </div>

                <div className="md:col-span-7 p-6 lg:p-8">
                  <h3 className="font-heading font-extrabold text-xl text-slate-900">{h.name}</h3>
                  {h.course && <p className="text-sm text-slate-500">{h.course}</p>}
                  <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-[hsl(var(--navy))] text-white text-sm font-bold">
  {h.total} {h.total === 1 ? "conquista" : "conquistas"}
</div>

                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TODAS_PREMIACOES.filter((medalha) => h.counts[medalha] > 0).map((medalha) => {
                      const colors = medalColors[medalha];
                      return <div key={medalha} className={`text-center ${colors.light} rounded-xl p-3 border border-white`}><div className={`w-9 h-9 mx-auto rounded-full ${colors.bg} flex items-center justify-center mb-1.5 shadow-sm`}><Medal className="w-5 h-5 text-white" /></div><div className={`font-heading font-extrabold text-lg ${colors.text}`}>{h.counts[medalha]}</div><div className="text-[10px] text-slate-500 font-semibold">{medalha}</div></div>;
                    })}
                  </div>

                  <div className="mt-3 text-center text-sm font-bold text-white bg-[hsl(var(--navy))] rounded-lg py-2 border-l-4 border-amber-400">TOTAL: {h.total} CONQUISTAS</div>
                  <div className="mt-5"><h4 className="font-heading font-semibold text-sm text-slate-900 mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" />Todas as conquistas ({h.conquests.length}):</h4><ul className="space-y-1.5">{h.conquests.map((c, j) => <li key={j} className="flex items-center gap-2 text-sm text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{c}</li>)}</ul></div>
                  {h.quote && <div className="mt-5 bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400"><p className="text-sm italic text-slate-700">“{h.quote}”</p></div>}
                  <Link to="/noticias" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors group">Ler notícias relacionadas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
