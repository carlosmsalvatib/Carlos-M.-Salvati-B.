import React from 'react';
import { CmsContent } from '../types';
import { ArrowUp, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

interface FooterSectionProps {
  content: CmsContent;
  onOpenCms: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ content, onOpenCms }) => {
  const { footer, site } = content;
  if (!footer.active) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Identity Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-900 border-2 border-amber-400 flex items-center justify-center">
                <img
                  src={site.logoUrl || '/api/images/logo'}
                  alt="Logo Mis Delirios Ranch"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-white text-lg block leading-tight">
                  {site.projectName}
                </span>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                  {site.fullName}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Complejo Urbanístico Agroproductivo y Turístico en el Municipio Andrés Bello, Táchira. Mini-granjas autosustentables y viviendas en bambú Guadua.
            </p>

            {/* Legal Notice */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-400">
              <span className="font-bold text-amber-400 block mb-1">Aviso Legal:</span>
              <p>{footer.legalNotice}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footer.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenCms}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Panel Administrativo (CMS)
                </button>
              </li>
            </ul>
          </div>

          {/* Credits and Authorship Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Créditos Profesionales</h4>
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
              <div>
                <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Promotor Principal:</span>
                <strong className="text-white">{footer.credits.promoter}</strong>
                <span className="block text-[11px] text-stone-400">{footer.credits.promoterCi}</span>
              </div>
              <div className="pt-2 border-t border-stone-800">
                <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Proyectista Arquitectónico:</span>
                <strong className="text-white">{footer.credits.architect}</strong>
                <span className="block text-[11px] text-stone-400">{footer.credits.architectCiv}</span>
              </div>
            </div>

            <div className="text-xs text-stone-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Aldea Sabana Larga y Sector Salomón · Cordero, Táchira</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {footer.copyrightYear} Mis Delirios Ranch. Todos los derechos reservados.</p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            id="btn-scroll-top"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
