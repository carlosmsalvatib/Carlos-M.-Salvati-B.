import React, { useState, useEffect } from 'react';
import { CmsContent, AppUser } from '../types';
import { Phone, MessageCircle, Menu, X, Shield, Settings, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  content: CmsContent;
  currentPage: string;
  currentUser?: Partial<AppUser> | null;
  onNavigate: (page: string) => void;
  onOpenCms: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  content,
  currentPage,
  currentUser,
  onNavigate,
  onOpenCms,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pages = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'propuesta', label: 'Propuesta' },
    { id: 'plan-maestro', label: 'Plan Maestro' },
    { id: 'modelos', label: 'Modelos' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'perfiles', label: 'Perfiles' },
    { id: 'financiamiento', label: 'Financiamiento' },
    { id: 'sostenibilidad', label: 'Sostenibilidad' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const rawPhone = content.site.contactWhatsapp || content.site.phone || '+584147114245';
  const cleanWhatsapp = rawPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    content.contactForm?.whatsappMessageTemplate ||
      'Hola, deseo consultar sobre los lotes en preventa y modelos de casas en Mis Delirios Ranch.'
  )}`;

  const handlePageClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-900/98 backdrop-blur-md shadow-xl border-b border-stone-800/90 py-2.5'
          : 'bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handlePageClick('inicio')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            id="nav-brand-link"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-emerald-800 border-2 border-amber-400/90 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={content.site.logoUrl || '/api/images/logo'}
                alt="Logo Mis Delirios Ranch"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-white text-sm sm:text-base tracking-wide leading-tight group-hover:text-amber-400 transition-colors">
                MIS DELIRIOS RANCH
              </span>
              <span className="text-[10px] sm:text-xs text-stone-300 tracking-wider uppercase font-medium">
                Complejo Agroproductivo & Turístico
              </span>
            </div>
          </button>

          {/* Desktop Multi-Page Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Navegación principal por páginas">
            {pages.map((p) => {
              const isActive = currentPage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePageClick(p.id)}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-stone-200 hover:text-amber-400 hover:bg-stone-800/60'
                  }`}
                  id={`nav-link-${p.id}`}
                >
                  {p.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & CMS Trigger */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2.5">
            {/* Direct WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-105"
              id="nav-whatsapp-btn"
              title="Chatear por WhatsApp con asesor oficial"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Quick Cotizar CTA */}
            <button
              onClick={() => handlePageClick('contacto')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all hover:scale-105"
              id="nav-reserve-cta"
            >
              <span>Cotizar Lote</span>
            </button>

            {/* CMS Panel Button: Prompt for credentials or open CMS if logged in */}
            <button
              onClick={onOpenCms}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                currentUser
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30'
                  : 'bg-stone-800/90 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white'
              }`}
              id="nav-cms-toggle-btn"
              title="Accesos CMS (requiere credenciales)"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">
                {currentUser ? `CMS (${currentUser.name?.split(' ')[0]})` : 'Accesos CMS'}
              </span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenCms}
              className="p-2 rounded-lg bg-stone-800 text-amber-400 border border-stone-700"
              title="Accesos CMS"
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
        <div className="sm:hidden bg-stone-900/98 border-b border-stone-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-800">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePageClick(p.id)}
                className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  currentPage === p.id
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-200 hover:text-amber-400 hover:bg-stone-800/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => handlePageClick('contacto')}
              className="w-full text-center py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-md"
            >
              Cotizar Preventa (Desde 10% Reserva)
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Chatear por WhatsApp (+58 414-7114245)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
