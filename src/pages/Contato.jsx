import React, { useState } from "react";
import {
  Mail, Phone, MapPin, Send, MessageSquare, Loader2, Check,
  Clock, Lock, Heart, Users, GraduationCap, Home, Globe, QrCode, Quote, User, ArrowRight, Calendar,
} from "lucide-react";

// Cores unificadas com o resto do site (verde IFPI)
const GREEN = "#004d00";
const GREEN_DARK = "#003300";
const RED = "#C62828";
const BG = "#F4F7F6";

// URL do Google Apps Script (vem do .env)
// @ts-ignore
const CONTACT_URL = import.meta.env.VITE_CONTACT_FORM_URL;

const heroIcons = [
  { icon: Heart, label: "Atendimento acolhedor" },
  { icon: Clock, label: "Respostas rápidas" },
  { icon: Users, label: "Parceria que transforma" },
];

export default function Contato() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const formData = new FormData(e.target);
    const payload = {
      nome: formData.get("nome") || "",
      email: formData.get("email") || "",
      assunto: formData.get("assunto") || "",
      mensagem: formData.get("mensagem") || "",
    };

    try {
      // Google Apps Script aceita POST simples; no-cors é necessário pro Google
      await fetch(CONTACT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      setSent(true);
      e.target.reset();
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      console.error(err);
      setError("Não foi possível enviar. Tente novamente ou use o email direto.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-16 lg:pt-20" style={{ background: BG }}>
      {/* HERO */}
      <section className="relative grid lg:grid-cols-2 min-h-[460px]">
        <div className="relative px-6 sm:px-10 lg:px-16 py-14 lg:py-20 flex flex-col justify-center" style={{ background: GREEN }}>
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/90 mb-5" style={{ background: GREEN_DARK }}>
              OlimpIFP2 • IFPI Campus Pedro II
            </span>
            <h1 className="font-heading font-extrabold text-white leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 5vw, 4.25rem)" }}>
              Entre em contato!
            </h1>
            <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed max-w-lg">
              Tem dúvidas, sugestões ou quer fazer parte do projeto? Nossa equipe está pronta para ouvir você.
              Cada mensagem é o início de uma nova conquista.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              {heroIcons.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white/90 text-sm font-semibold max-w-[110px] leading-tight">{h.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative min-h-[260px] lg:min-h-full bg-slate-200">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0146f9?w=900&h=700&fit=crop"
            alt="Estudantes em evento"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,77,0,0.25)" }} />
        </div>
      </section>

      {/* CONTACT BODY */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Col 1 — Quem coordena */}
            <div className="bg-white rounded-2xl border-l-4 border border-slate-200 p-6 shadow-sm" style={{ borderLeftColor: GREEN }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GREEN }}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-heading font-bold text-lg text-slate-900">Quem coordena</h2>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full border-4 border-slate-100 bg-slate-100 flex items-center justify-center overflow-hidden mb-4 ring-4 ring-emerald-500/10">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                    alt="William Melo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-heading font-bold text-slate-900">William Melo</h3>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>Coordenador do OlimpIFP2</p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Professor do IFPI – Campus Pedro II, dedica-se a incentivar a participação dos estudantes em
                  olimpíadas acadêmicas, acreditando que cada desafio lapida potencial e forma cidadãos.
                </p>
                <div className="mt-4 w-full flex gap-2 items-start text-left border-l-4 pl-3 py-1" style={{ borderColor: GREEN }}>
                  <Quote className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GREEN }} />
                  <p className="text-sm text-slate-600 italic">"Cada medalha tem uma história. Cada estudante deixa um legado."</p>
                </div>
              </div>
            </div>

            {/* Col 2 — Fale conosco */}
            <div className="bg-white rounded-2xl border-l-4 border border-slate-200 p-6 shadow-sm" style={{ borderLeftColor: GREEN }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GREEN }}>
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-heading font-bold text-lg text-slate-900">Fale conosco</h2>
              </div>
              <div className="space-y-5">
                <ContactRow icon={Mail} title="E-mail" value="olimpifp2@ifpi.edu.br" sub="Resposta em até 48h" green={GREEN} />
                <ContactRow icon={Phone} title="WhatsApp" value="(86) 9 9999-9999" sub="Seg a Sex, 8h às 12h" green={GREEN} />
                <ContactRow icon={MapPin} title="Localização" value="IFPI – Campus Pedro II" sub="BR-230, Km 12 — Pedro II, PI" green={GREEN} />

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href="mailto:olimpifp2@ifpi.edu.br"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white text-sm font-semibold transition-colors hover:brightness-110"
                    style={{ background: GREEN }}
                  >
                    <Mail className="w-4 h-4" />
                    Enviar email
                  </a>
                </div>
              </div>
            </div>

            {/* Col 3 — Form */}
            <div className="bg-white rounded-2xl border-l-4 border border-slate-200 p-6 shadow-sm" style={{ borderLeftColor: RED }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: RED }}>
                  <Send className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-heading font-bold text-lg text-slate-900">Envie sua mensagem</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Nome completo" required>
                  <input
                    required
                    name="nome"
                    type="text"
                    placeholder="Seu nome"
                    className="form-input"
                  />
                </FormField>
                <FormField label="E-mail" required>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Assunto">
                  <select name="assunto" className="form-input">
                    <option>Dúvida geral</option>
                    <option>Sugestão de pauta</option>
                    <option>Envio de fotos</option>
                    <option>Parceria</option>
                  </select>
                </FormField>
                <FormField label="Mensagem">
                  <textarea
                    required
                    name="mensagem"
                    rows={4}
                    placeholder="Escreva sua mensagem..."
                    className="form-input resize-none"
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-bold uppercase text-sm tracking-wide shadow-md hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: RED }}
                >
                  {sending ? (
                    <>
                      Enviando... <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : sent ? (
                    <>
                      Mensagem enviada! <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Enviar mensagem <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                {sent && (
                  <p className="text-center text-sm font-medium" style={{ color: GREEN }}>
                    Obrigado! Sua mensagem foi enviada com sucesso.
                  </p>
                )}
                {error && (
                  <p className="text-center text-sm font-medium text-red-600">{error}</p>
                )}

                <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Lock className="w-3 h-3" /> Seus dados estão protegidos e não serão compartilhados.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* LOWER INFO */}
      <section className="pb-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Onde estamos */}
            <div className="bg-white rounded-2xl border-l-4 border border-slate-200 p-6 shadow-sm" style={{ borderLeftColor: GREEN }}>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: GREEN }} /> Onde estamos
              </h3>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-100 relative">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d19?w=500&h=300&fit=crop" alt="Mapa" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg" style={{ background: RED }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                BR-230, Km 12 — Zona Rural<br />Pedro II, Piauí — CEP 64258-000
              </p>
              <a
                href="https://www.google.com/maps/search/IFPI+Campus+Pedro+II"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: GREEN }}
              >
                Ver no Google Maps <ArrowRight className="w-4 h-4" />
              </a>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" style={{ color: GREEN }} /> Como chegar
                  </p>
                  <p className="text-xs text-slate-400">Escaneie o QR Code</p>
                </div>
              </div>
            </div>

            {/* Horário */}
            <div className="bg-white rounded-2xl border-l-4 border border-slate-200 p-6 shadow-sm" style={{ borderLeftColor: GREEN }}>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: GREEN }} /> Horário de atendimento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: BG }}>
                  <span className="text-sm font-semibold text-slate-700">Segunda a Sexta</span>
                  <span className="text-sm font-bold" style={{ color: GREEN }}>08h às 12h</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: BG }}>
                  <span className="text-sm font-semibold text-slate-700">Turno da tarde</span>
                  <span className="text-sm font-bold" style={{ color: GREEN }}>14h às 17h</span>
                </div>
              </div>
              <div className="mt-5 p-4 rounded-lg border-l-4" style={{ borderColor: GREEN, background: BG }}>
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-800">Atendimento preferencial por e-mail.</strong> Responderemos o mais breve possível.
                </p>
              </div>
              <a
                href="mailto:olimpifp2@ifpi.edu.br"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold uppercase tracking-wide hover:brightness-110 transition"
                style={{ background: RED }}
              >
                <Calendar className="w-4 h-4" /> Agende uma conversa
              </a>
            </div>

            {/* Promotional card */}
            <div className="rounded-2xl p-6 text-white flex flex-col border-l-4 border-amber-400" style={{ background: GREEN_DARK }}>
              <h3 className="font-heading font-bold text-xl leading-tight">
                Juntos, lapidamos sonhos e celebramos conquistas!
              </h3>
              <p className="mt-2 text-white/75 text-sm leading-relaxed">
                O OlimpIFP2 é mais que um projeto: é um movimento de valorização do conhecimento.
              </p>
              <div className="mt-4 rounded-xl overflow-hidden border border-white/10 flex-1 min-h-[140px]">
                <img src="https://images.unsplash.com/photo-1523580494853-5066c0c5e4a7?w=500&h=350&fit=crop" alt="Equipe" className="w-full h-full object-cover" />
              </div>
              <a href="/projeto" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white">
                Conheça o projeto <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="py-14" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Quer fazer parte dessa história?
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            O OlimpIFP2 é construído por toda a comunidade. Seja estudante, professor, família ou apoiador — há um lugar para você.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: GraduationCap, label: "Estudantes", color: "bg-blue-100 text-blue-700" },
              { icon: User, label: "Professores", color: "bg-emerald-100 text-emerald-700" },
              { icon: Home, label: "Famílias", color: "bg-amber-100 text-amber-700" },
              { icon: Globe, label: "Comunidade", color: "bg-violet-100 text-violet-700" },
            ].map((g, i) => {
              const Icon = g.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className={`w-12 h-12 mx-auto rounded-full ${g.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{g.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid #d8e0dd;
          font-size: 0.875rem;
          background: #fff;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .form-input:focus {
          border-color: ${GREEN};
          box-shadow: 0 0 0 3px rgba(0,77,0,0.15);
        }
      `}</style>
    </div>
  );
}

function ContactRow({ icon: Icon, title, value, sub, green }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: green }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span style={{ color: "#C62828" }}>*</span>}
      </label>
      {children}
    </div>
  );
}