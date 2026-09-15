import React from 'react';
import { CmsContent } from '../types';
import { Leaf, HeartHandshake, TrendingUp, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';

interface CustomerProfilesSectionProps {
  content: CmsContent;
  onSelectProfile: (profileId: string) => void;
}

export const CustomerProfilesSection: React.FC<CustomerProfilesSectionProps> = ({ content, onSelectProfile }) => {
  const { customerProfiles } = content;
  if (!customerProfiles.active) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-8 h-8 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-8 h-8 text-amber-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-8 h-8 text-blue-600" />;
      default:
        return <Leaf className="w-8 h-8 text-emerald-600" />;
    }
  };

  const getProfileBorderColor = (idx: number) => {
    if (idx === 0) return 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20';
    if (idx === 1) return 'border-amber-200 hover:border-amber-400 bg-amber-50/20';
    return 'border-blue-200 hover:border-blue-400 bg-blue-50/20';
  };

  const getProfileBadge = (idx: number) => {
    if (idx === 0) return { bg: 'bg-emerald-100 text-emerald-800', label: 'Sustentabilidad' };
    if (idx === 1) return { bg: 'bg-amber-100 text-amber-800', label: 'Bienestar' };
    return { bg: 'bg-blue-100 text-blue-800', label: 'Alta Rentabilidad' };
  };

  return (
    <section id="perfiles" className="py-20 bg-stone-100 text-stone-800 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-200 text-stone-700 text-xs font-semibold mb-3">
            <span>Segmentación a Tu Medida</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4" id="profiles-title">
            {customerProfiles.title || 'Una Oferta Diseñada para Cada Perfil'}
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed" id="profiles-desc">
            {customerProfiles.subtitle || 'Descubre cómo Mis Delirios Ranch se alinea con tus propósitos familiares, productivos o financieros.'}
          </p>
        </div>

        {/* 3 Profile Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {customerProfiles.profiles.map((profile, idx) => {
            const badge = getProfileBadge(idx);

            return (
              <div
                key={profile.id}
                className={`bg-white rounded-2xl border-2 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${getProfileBorderColor(
                  idx
                )}`}
                id={`profile-card-${profile.id}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-center">
                      {renderIcon(profile.icon)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                    {profile.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mb-6">
                    {profile.subtitle}
                  </p>

                  <div className="space-y-3 mb-8">
                    {profile.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 text-sm text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex flex-col gap-2.5">
                  <button
                    onClick={() => onSelectProfile(profile.id)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm bg-stone-900 hover:bg-stone-800 text-white shadow-md transition-colors"
                  >
                    <span>{profile.ctaText || 'Quiero ser parte del proyecto'}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>

                  <a
                    href="#contacto?asunto=agendar_visita"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <span>Agenda una visita guiada</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
