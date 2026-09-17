import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Mail } from "lucide-react";
import { NAV_LINKS } from "@/lib/siteData";

export default function SiteFooter() {
  return (
    <footer className="bg-[hsl(var(--navy-deep))] text-white">
      {/* Top quote band */}
      <div className="border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <p className="font-heading text-xl sm:text-2xl font-bold text-balance">
            "Cada medalha tem uma história. Cada estudante deixa um legado."
          </p>
          <p className="mt-2 text-white/50 text-sm uppercase tracking-widest">
            OlimpIFP2 • Lapidar sonhos e celebrar conquistas
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&h=120&fit=crop"
                alt="Logo OlimpIFP2"
                className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/20"
              />
              <div>
                <div className="font-heading font-extrabold text-lg">OlimpIFP2</div>
                <div className="text-white/50 text-xs uppercase tracking-widest">
                  IFPI • Campus Pedro II
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-md leading-relaxed">
              Projeto institucional de incentivo e valorização das olimpíadas acadêmicas do
              IFPI – Campus Pedro II. Cada medalha tem uma história. Cada estudante deixa um legado.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-[hsl(var(--gold-light))] mb-4">
              Navegação
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 6).map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contato — email apenas */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white/60">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40">Contato</p>
              <a
                href="mailto:olimpifp2@ifpi.edu.br"
                className="text-sm font-semibold hover:text-white transition-colors"
              >
                olimpifp2@ifpi.edu.br
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© 2026 IFPI – Campus Pedro II. Todos os direitos reservados.</p>
          <p>Wiilam Melo / Coord. OlimpIF</p>
        </div>
      </div>
    </footer>
  );
}