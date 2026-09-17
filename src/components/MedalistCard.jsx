import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Quote } from "lucide-react";

const medalStyles = {
  Ouro: { ring: "medal-gold", label: "bg-amber-100 text-amber-800 border-amber-300", text: "text-amber-700" },
  Prata: { ring: "medal-silver", label: "bg-slate-100 text-slate-700 border-slate-300", text: "text-slate-600" },
  Bronze: { ring: "medal-bronze", label: "bg-orange-100 text-orange-800 border-orange-300", text: "text-orange-700" },
  "Honra ao Mérito": { ring: "bg-emerald-500", label: "bg-emerald-100 text-emerald-800 border-emerald-300", text: "text-emerald-700" },
};

export default function MedalistCard({ medalist }) {
  const style = medalStyles[medalist.medal] || medalStyles.Ouro;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Medal badge */}
      <div className="relative">
        <div className={`absolute top-3 left-3 z-10 w-12 h-12 rounded-full ${style.ring} flex items-center justify-center shadow-lg ring-2 ring-white`}>
          <Trophy className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <span className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.label}`}>
          {medalist.medal}
        </span>
        {/* Photo */}
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={medalist.photo}
            alt={medalist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-lg text-slate-900 leading-tight">{medalist.name}</h3>
        <p className="text-sm text-slate-500 mt-0.5">{medalist.course}</p>

        <div className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${style.text}`}>
          <Trophy className="w-4 h-4" />
          {medalist.olympiad}
        </div>

        {medalist.quote && (
          <div className="mt-4 flex gap-2 text-sm text-slate-600 italic border-l-2 border-slate-200 pl-3">
            <Quote className="w-4 h-4 shrink-0 text-slate-300 mt-0.5" />
            <span>"{medalist.quote}"</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] text-slate-400 uppercase tracking-wider border-t border-slate-100">
          <Trophy className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
          OlimpIFP2 • Cada medalha tem uma história
        </div>
      </div>
    </article>
  );
}