import React, { useState, useEffect } from 'react';
import { CmsContent } from '../types';
import { Phone, MessageCircle, Menu, X, Shield, Settings } from 'lucide-react';

interface NavbarProps {
  content: CmsContent;
  onOpenCms: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ content, onOpenCms, isAdminLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Propuesta', href: '#propuesta' },
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'Plan Maestro', href: '#plan-maestro' },
    { label: 'Modelos', href: '#modelos' },
    { label: 'Perfiles', href: '#perfiles' },
    { label: 'Financiamiento', href: '#financiamiento' },
    { label: 'Bulevar', href: '#impacto-social' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const whatsappUrl = `https://wa.me/${content.site.contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    content.contactForm.whatsappMessageTemplate || 'Hola, deseo información de Mis Delirios Ranch'
  )}`;

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-900/95 backdrop-blur-md shadow-lg border-b border-stone-800/80 py-2.5'
          : 'bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="#inicio" className="flex items-center gap-3 group focus:outline-none" id="nav-brand-link">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-emerald-800 border-2 border-amber-400/90 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={content.site.logoUrl || '/api/images/logo'}
                alt="Logo Mis Delirios Ranch"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-white text-base sm:text-lg tracking-wide leading-tight group-hover:text-amber-400 transition-colors">
                MIS DELIRIOS RANCH
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 tracking-wider uppercase font-medium">
                Complejo Agroproductivo & Turístico
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs xl:text-sm font-medium text-stone-200 hover:text-amber-400 rounded-md transition-colors hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs & CMS Trigger */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            {/* Direct WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-105"
              id="nav-whatsapp-btn"
              title="Chatear por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Quick Contact CTA */}
            <a
              href="#contacto"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all hover:scale-105"
              id="nav-reserve-cta"
            >
              <span>Reservar Lote</span>
            </a>

            {/* CMS Panel Button */}
            <button
              onClick={onOpenCms}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30'
                  : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white'
              }`}
              id="nav-cms-toggle-btn"
              title="Panel Administrativo CMS"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isAdminLoggedIn ? 'Panel CMS' : 'Acceso CMS'}</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenCms}
              className="p-2 rounded-lg bg-stone-800 text-stone-300 border border-stone-700"
              title="CMS"
              id="nav-mobile-cms-btn"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 focus:outline-none"
              aria-label="Menú móvil"
              id="nav-mobile-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-stone-900/98 border-b border-stone-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-800">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-stone-200 hover:text-amber-400 hover:bg-stone-800/60 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors"
            >
              Reservar Lote (Desde 10% Inicial)
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
