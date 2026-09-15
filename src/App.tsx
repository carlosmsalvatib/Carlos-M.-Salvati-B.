import React, { useState, useEffect } from 'react';
import { CmsContent, LotItem, HousingModel } from './types';
import { getContent, getLots } from './lib/api';
import { initialCmsContent } from './data/initialContent';
import { initialLots } from './data/initialLots';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ValuePropSection } from './components/ValuePropSection';
import { LocationSection } from './components/LocationSection';
import { MasterPlanSection } from './components/MasterPlanSection';
import { HousingModelsSection } from './components/HousingModelsSection';
import { CustomerProfilesSection } from './components/CustomerProfilesSection';
import { TechnicalAttributesSection } from './components/TechnicalAttributesSection';
import { SalesFinancingSection } from './components/SalesFinancingSection';
import { SocialImpactSection } from './components/SocialImpactSection';
import { ContactConversionSection } from './components/ContactConversionSection';
import { FooterSection } from './components/FooterSection';
import { CmsAdminModal } from './components/CmsAdminModal';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

export function App() {
  const [content, setContent] = useState<CmsContent>(initialCmsContent);
  const [lots, setLots] = useState<LotItem[]>(initialLots);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCmsOpen, setIsCmsOpen] = useState<boolean>(false);

  // Quote & prefill state for Contact form
  const [prefilledLot, setPrefilledLot] = useState<string>('');
  const [prefilledModel, setPrefilledModel] = useState<string>('');
  const [prefilledProfile, setPrefilledProfile] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const [remoteContent, remoteLots] = await Promise.all([
          getContent().catch(() => initialCmsContent),
          getLots().catch(() => initialLots),
        ]);
        if (remoteContent) setContent(remoteContent);
        if (remoteLots && remoteLots.length > 0) setLots(remoteLots);
      } catch (e) {
        console.warn('Using initial seed state', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler from MasterPlan: user clicks "Cotizar" on a lot
  const handleSelectLotForQuote = (lot: LotItem) => {
    setPrefilledLot(`${lot.code} (Mz. ${lot.manzana}, ${lot.areaM2} m²)`);
    scrollToContact();
  };

  // Handler from HousingModels: user clicks "Cotiza tu modelo"
  const handleSelectModelForQuote = (model: HousingModel) => {
    setPrefilledModel(`${model.name} (${model.areaM2} m²)`);
    scrollToContact();
  };

  // Handler from CustomerProfiles: user clicks "Quiero ser parte"
  const handleSelectProfile = (profileId: string) => {
    setPrefilledProfile(profileId);
    scrollToContact();
  };

  // Handler from Financing Simulator
  const handleSimulatedQuote = (quoteData: {
    lotAreaM2: number;
    totalLotUsd: number;
    initial50Usd: number;
    monthlyInstallmentUsd: number;
    selectedHouseModel?: string;
    totalCombinedUsd: number;
  }) => {
    const modelText = quoteData.selectedHouseModel ? ` + Casa ${quoteData.selectedHouseModel}` : '';
    setPrefilledLot(`Lote de ${quoteData.lotAreaM2} m²${modelText} (Total: $${quoteData.totalCombinedUsd.toLocaleString()} USD)`);
    scrollToContact();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-200">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg font-semibold tracking-wide text-amber-400">
          Mis Delirios Ranch
        </p>
        <p className="text-xs text-stone-400 mt-1">Cargando desarrollo urbanístico...</p>
      </div>
    );
  }

  const cleanWhatsapp = content.site.contactWhatsapp.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Top Navigation */}
      <Navbar content={content} onOpenCms={() => setIsCmsOpen(true)} />

      {/* 1. Hero Section */}
      <HeroSection content={content} />

      {/* 2. Value Proposition Section */}
      <ValuePropSection content={content} />

      {/* 3. Location & Environment Section */}
      <LocationSection content={content} />

      {/* 4. Master Plan & Lot Inventory Section */}
      <MasterPlanSection
        content={content}
        lots={lots}
        onSelectLotForQuote={handleSelectLotForQuote}
      />

      {/* 5. Ecological Housing Models Section */}
      <HousingModelsSection
        content={content}
        onSelectModelForQuote={handleSelectModelForQuote}
      />

      {/* 6. Customer Profiles Section */}
      <CustomerProfilesSection
        content={content}
        onSelectProfile={handleSelectProfile}
      />

      {/* 7. Technical Attributes & UN SDGs Section */}
      <TechnicalAttributesSection content={content} />

      {/* 8. Sales, Financing & Interactive Simulator */}
      <SalesFinancingSection
        content={content}
        onSimulatedQuote={handleSimulatedQuote}
      />

      {/* 9. Social Impact & Bulevar de la Guadua Section */}
      <SocialImpactSection content={content} />

      {/* 10. High-Conversion Contact Form Section */}
      <ContactConversionSection
        content={content}
        prefilledLot={prefilledLot}
        prefilledModel={prefilledModel}
        prefilledProfile={prefilledProfile}
      />

      {/* 11. Comprehensive Footer */}
      <FooterSection
        content={content}
        onOpenCms={() => setIsCmsOpen(true)}
      />

      {/* Persistent Floating WhatsApp Speed-Dial for Mobile/Desktop Conversion */}
      <a
        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
          content.contactForm.whatsappMessageTemplate || 'Hola, deseo consultar sobre los lotes en preventa en Mis Delirios Ranch.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:shadow-emerald-600/40 transform hover:scale-105 transition-all duration-200 group"
        id="floating-whatsapp-cta"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 animate-bounce" />
        <span className="hidden sm:inline font-bold text-xs">
          Consultar Preventa
        </span>
      </a>

      {/* CMS Administration Modal */}
      <CmsAdminModal
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        content={content}
        lots={lots}
        onContentUpdated={(newContent) => setContent(newContent)}
        onLotsUpdated={(newLots) => setLots(newLots)}
      />
    </div>
  );
}

export default App;
