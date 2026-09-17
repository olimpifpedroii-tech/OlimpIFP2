import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/siteData";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[hsl(var(--navy))]/95 backdrop-blur-md shadow-lg" : "bg-[hsl(var(--navy))]/90 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&h=120&fit=crop"
              alt="Logo OlimpIFP2"
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg object-cover shadow-md ring-1 ring-white/20"
            />
            <div className="leading-tight">
              <div className="text-white font-heading font-extrabold text-lg tracking-tight">OlimpIFP2</div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest hidden sm:block">IFPI • Campus Pedro II</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  isActive(link.path)
                    ? "text-[hsl(var(--gold-light))] border-b-2 border-[hsl(var(--gold))] -mb-0.5"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-white rounded-md hover:bg-white/10"
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-[hsl(var(--navy-deep))] border-t border-white/10">
          <nav className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-sm font-semibold ${
                  isActive(link.path)
                    ? "bg-white/10 text-[hsl(var(--gold-light))]"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}