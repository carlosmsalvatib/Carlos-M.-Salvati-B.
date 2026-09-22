import React, { useState, useEffect, useCallback } from 'react';
import { CmsContent, LotItem, HousingModel, AppUser } from './types';
import {
  getContent,
  getLots,
  getHousingModels,
  getLocalCachedContent,
  getLocalCachedLots,
  getLocalCachedModels,
  subscribeToLiveContent,
  subscribeToLiveModels,
  subscribeToLiveLots,
} from './lib/api';
import { initialCmsContent } from './data/initialContent';
import { initialLots } from './data/initialLots';

import { Navbar } from './components/Navbar';
import { HomePageOverview } from './components/HomePageOverview';
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
import { CmsLoginModal } from './components/CmsLoginModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import {
  MessageCircle,
  Home,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  LogOut,
} from 'lucide-react';

const VALID_PAGES = [
  'inicio',
  'propuesta',
  'plan-maestro',
  'modelos',
  'ubicacion',
  'perfiles',
  'financiamiento',
  'sostenibilidad',
  'contacto',
] as const;

type PageId = typeof VALID_PAGES[number];

const PAGE_METADATA: Record<PageId, { title: string; subtitle: string }> = {
  inicio: {
    title: 'Inicio',
    subtitle: 'Bienvenido a Mis Delirios Ranch · Complejo Agroproductivo y Turístico',
  },
  propuesta: {
    title: 'Propuesta de Valor & Renders',
    subtitle: 'Desarrollo sostenible, agroproducción orgánica y bioconstrucción andina',
  },
  'plan-maestro': {
    title: 'Plan Maestro & Catálogo de Lotes',
    subtitle: '57 parcelas en 2 sectores con planos arquitectónicos e inventario en tiempo real',
  },
  modelos: {
    title: 'Modelos de Vivienda Ecológica',
    subtitle: 'Arquitectura sismorresistente en bambú Guadua con terrazas y mirador',
  },
  ubicacion: {
    title: 'Ubicación & Entorno Andino',
    subtitle: 'Cordero, Sabana Larga y Aldea Salomón · Municipio Andrés Bello, Táchira',
  },
  perfiles: {
    title: 'Perfiles de Cliente & Inversión',
    subtitle: 'Familias, proyectos de retiro, producción ecológica y rentabilidad turística',
  },
  financiamiento: {
    title: 'Planes de Venta & Financiamiento',
    subtitle: 'Precio base de $20 USD/m² con reserva desde el 10% y simulador de cuotas',
  },
  sostenibilidad: {
    title: 'Sostenibilidad & Bulevar de la Guadua',
    subtitle: '+14.600 m² de áreas comunales cedidas y alineación con los ODS de la ONU',
  },
  contacto: {
    title: 'Contacto & Cotización Oficial',
    subtitle: 'Atención personalizada directa de los promotores y equipo técnico',
  },
};

export function App() {
  const [content, setContent] = useState<CmsContent>(() => getLocalCachedContent() || initialCmsContent);
  const [lots, setLots] = useState<LotItem[]>(() => getLocalCachedLots() || initialLots);
  const [loading, setLoading] = useState<boolean>(false);

  // Multi-page routing state
  const [currentPage, setCurrentPage] = useState<PageId>('inicio');

  // Authentication & CMS state
  const [currentUser, setCurrentUser] = useState<Partial<AppUser> | null>(() => {
    try {
      const saved = localStorage.getItem('mdr_cms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isCmsAdminOpen, setIsCmsAdminOpen] = useState<boolean>(false);

  // Directional Image Amplification Modal State
  const [imageViewerState, setImageViewerState] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    title?: string;
    subtitle?: string;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  // Quote & prefill state for Contact form
  const [prefilledLot, setPrefilledLot] = useState<string>('');
  const [prefilledModel, setPrefilledModel] = useState<string>('');
  const [prefilledProfile, setPrefilledProfile] = useState<string>('');

  // Synchronize routing with URL hash on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_PAGES.includes(rawHash as PageId)) {
        setCurrentPage(rawHash as PageId);
      } else if (!rawHash) {
        setCurrentPage('inicio');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch and synchronize content, lots, and housing models from database in real-time
  const loadData = useCallback(async () => {
    try {
      const [remoteContent, remoteLots, remoteModelsRes] = await Promise.all([
        getContent(),
        getLots(),
        getHousingModels().catch(() => null),
      ]);
      if (remoteContent && remoteContent.site) {
        if (remoteModelsRes?.models && Array.isArray(remoteModelsRes.models) && remoteModelsRes.models.length > 0) {
          if (!remoteContent.housingModels) {
            remoteContent.housingModels = { ...initialCmsContent.housingModels, models: remoteModelsRes.models };
          } else {
            remoteContent.housingModels.models = remoteModelsRes.models;
          }
        }
        setContent({ ...remoteContent });
      }
      if (remoteLots && Array.isArray(remoteLots) && remoteLots.length > 0) {
        setLots([...remoteLots]);
      }
    } catch (e) {
      console.warn('Error sincronizando con base de datos en tiempo de ejecución:', e);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Listen to real-time events broadcasted when CMS saves or updates data
    const handleDataUpdated = (e: any) => {
      if (e.detail?.content) {
        setContent({ ...e.detail.content });
      } else if (e.detail?.models && Array.isArray(e.detail.models)) {
        setContent((prev) => ({
          ...prev,
          housingModels: {
            ...(prev.housingModels || initialCmsContent.housingModels),
            models: e.detail.models,
          },
        }));
      }
      if (e.detail?.lots && Array.isArray(e.detail.lots)) {
        setLots([...e.detail.lots]);
      }
    };

    const handleModelsUpdated = (e: any) => {
      if (e.detail?.models && Array.isArray(e.detail.models)) {
        setContent((prev) => ({
          ...prev,
          housingModels: {
            ...(prev.housingModels || initialCmsContent.housingModels),
            models: e.detail.models,
          },
        }));
      }
    };

    window.addEventListener('mdr_data_updated', handleDataUpdated);
    window.addEventListener('mdr_models_updated', handleModelsUpdated);

    // Cross-tab synchronization via storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mdr_runtime_cms_content_v2' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'mdr_runtime_models_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setContent((prev) => ({
              ...prev,
              housingModels: {
                ...(prev.housingModels || initialCmsContent.housingModels),
                models: parsed,
              },
            }));
          }
        } catch {}
      }
      if (e.key === 'mdr_runtime_lots_v2' && e.newValue) {
        try {
          setLots(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // Visibility / focus refresh: re-sync when tab becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Real-time Firestore continuous synchronization
    const unsubContent = subscribeToLiveContent((remoteContent) => {
      if (remoteContent && remoteContent.site) {
        setContent((prev) => ({
          ...prev,
          ...remoteContent,
          housingModels: remoteContent.housingModels?.models ? {
            ...(prev.housingModels || initialCmsContent.housingModels),
            ...remoteContent.housingModels,
          } : prev.housingModels,
        }));
      }
    });

    const unsubModels = subscribeToLiveModels((remoteModels) => {
      if (Array.isArray(remoteModels) && remoteModels.length > 0) {
        setContent((prev) => ({
          ...prev,
          housingModels: {
            ...(prev.housingModels || initialCmsContent.housingModels),
            models: remoteModels,
          },
        }));
      }
    });

    const unsubLots = subscribeToLiveLots((remoteLots) => {
      if (Array.isArray(remoteLots) && remoteLots.length > 0) {
        setLots([...remoteLots]);
      }
    });

    return () => {
      unsubContent();
      unsubModels();
      unsubLots();
      window.removeEventListener('mdr_data_updated', handleDataUpdated);
      window.removeEventListener('mdr_models_updated', handleModelsUpdated);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadData]);

  // Navigate to a specific page
  const navigateTo = (page: string) => {
    const targetPage = VALID_PAGES.includes(page as PageId) ? (page as PageId) : 'inicio';
    setCurrentPage(targetPage);
    window.location.hash = `#${targetPage}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetPage === 'modelos' || targetPage === 'plan-maestro') {
      loadData();
    }
  };

  // Handler for CMS button: prompt credentials first if not logged in
  const handleOpenCms = () => {
    if (currentUser) {
      setIsCmsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: Partial<AppUser> & { token: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('mdr_cms_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not persist user in localStorage', e);
    }
    setIsLoginModalOpen(false);
    setIsCmsAdminOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mdr_cms_user');
    } catch (e) {
      console.warn('Could not remove user from localStorage', e);
    }
    setIsCmsAdminOpen(false);
  };

  // Open directional image viewer
  const handleOpenImageViewer = (
    images: string[],
    index = 0,
    title?: string,
    subtitle?: string
  ) => {
    if (!images || images.length === 0) return;
    setImageViewerState({
      isOpen: true,
      images,
      currentIndex: Math.max(0, Math.min(index, images.length - 1)),
      title,
      subtitle,
    });
  };

  // Handlers for quote actions across sections
  const handleSelectLotForQuote = (lot: LotItem) => {
    setPrefilledLot(`${lot.code} (Mz. ${lot.manzana}, ${lot.areaM2} m²)`);
    navigateTo('contacto');
  };

  const handleSelectModelForQuote = (model: HousingModel) => {
    setPrefilledModel(`${model.name} (${model.areaM2} m²)`);
    navigateTo('contacto');
  };

  const handleSelectProfile = (profileId: string) => {
    setPrefilledProfile(profileId);
    navigateTo('contacto');
  };

  const handleSimulatedQuote = (quoteData: {
    lotAreaM2: number;
    totalLotUsd: number;
    initial50Usd: number;
    monthlyInstallmentUsd: number;
    selectedHouseModel?: string;
    totalCombinedUsd: number;
  }) => {
    const modelText = quoteData.selectedHouseModel ? ` + Casa ${quoteData.selectedHouseModel}` : '';
    setPrefilledLot(
      `Lote de ${quoteData.lotAreaM2} m²${modelText} (Total: $${quoteData.totalCombinedUsd.toLocaleString()} USD)`
    );
    navigateTo('contacto');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-200">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg font-semibold tracking-wide text-amber-400">
          Mis Delirios Ranch
        </p>
        <p className="text-xs text-stone-400 mt-1">Cargando desarrollo urbanístico multi-página...</p>
      </div>
    );
  }

  const rawPhone = content.site.contactWhatsapp || content.site.phone || '+584147187596';
  const cleanWhatsapp = rawPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    content.contactForm.whatsappMessageTemplate ||
      'Hola, deseo consultar sobre los lotes en preventa y modelos de casas en Mis Delirios Ranch.'
  )}`;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950 flex flex-col justify-between">
      <div>
        {/* Top Navigation */}
        <Navbar
          content={content}
          currentPage={currentPage}
          currentUser={currentUser}
          onNavigate={navigateTo}
          onOpenCms={handleOpenCms}
        />

        {/* Page Breadcrumb & Header Banner (For pages other than 'inicio') */}
        {currentPage !== 'inicio' && (
          <div className="pt-24 pb-6 bg-stone-900 border-b border-stone-800 text-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-400">
                  <button
                    onClick={() => navigateTo('inicio')}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Inicio</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span className="text-amber-400 font-bold capitalize">
                    {PAGE_METADATA[currentPage]?.title || currentPage}
                  </span>
                </div>

                {/* Back to Home CTA */}
                <button
                  onClick={() => navigateTo('inicio')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-all border border-stone-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a Inicio</span>
                </button>
              </div>

              {/* Sub-header title */}
              <div className="mt-4">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {PAGE_METADATA[currentPage]?.title}
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
                  {PAGE_METADATA[currentPage]?.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Multi-Page Content Area */}
        <main className="w-full">
          {currentPage === 'inicio' && (
            <HomePageOverview
              content={content}
              lots={lots}
              onNavigate={navigateTo}
              onSelectModelForQuote={handleSelectModelForQuote}
              onOpenImageViewer={handleOpenImageViewer}
            />
          )}

          {currentPage === 'propuesta' && (
            <div className="space-y-12">
              <ValuePropSection
                content={content}
                onOpenImageViewer={handleOpenImageViewer}
                onNavigate={navigateTo}
              />
            </div>
          )}

          {currentPage === 'plan-maestro' && (
            <div className="space-y-12">
              <MasterPlanSection
                content={content}
                lots={lots}
                onSelectLotForQuote={handleSelectLotForQuote}
                onOpenImageViewer={handleOpenImageViewer}
                onNavigate={navigateTo}
              />
            </div>
          )}

          {currentPage === 'modelos' && (
            <div className="space-y-12">
              <HousingModelsSection
                content={content}
                onSelectModelForQuote={handleSelectModelForQuote}
                onOpenImageViewer={handleOpenImageViewer}
                onNavigate={navigateTo}
              />
            </div>
          )}

          {currentPage === 'ubicacion' && (
            <div className="space-y-12">
              <LocationSection content={content} />
            </div>
          )}

          {currentPage === 'perfiles' && (
            <div className="space-y-12">
              <CustomerProfilesSection content={content} onSelectProfile={handleSelectProfile} />
            </div>
          )}

          {currentPage === 'financiamiento' && (
            <div className="space-y-12">
              <SalesFinancingSection content={content} onSimulatedQuote={handleSimulatedQuote} />
            </div>
          )}

          {currentPage === 'sostenibilidad' && (
            <div className="space-y-12">
              <SocialImpactSection content={content} />
              <TechnicalAttributesSection content={content} />
            </div>
          )}

          {currentPage === 'contacto' && (
            <div className="space-y-12 py-6">
              <ContactConversionSection
                content={content}
                prefilledLot={prefilledLot}
                prefilledModel={prefilledModel}
                prefilledProfile={prefilledProfile}
              />
            </div>
          )}
        </main>
      </div>

      {/* Comprehensive Multi-Page Footer */}
      <FooterSection
        content={content}
        onOpenCms={handleOpenCms}
        onNavigate={navigateTo}
      />

      {/* Active Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:shadow-emerald-600/50 transform hover:scale-105 transition-all duration-200 group border-2 border-emerald-400/40"
        id="floating-whatsapp-cta"
        aria-label="Contactar por WhatsApp (+58 414-7187596)"
      >
        <MessageCircle className="w-6 h-6 fill-current animate-bounce" />
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs leading-tight">WhatsApp Preventa</span>
          <span className="text-[10px] text-emerald-100 hidden sm:inline leading-none">
            Respuesta Inmediata
          </span>
        </div>
      </a>

      {/* Directional Amplified Image Viewer Modal */}
      <ImageViewerModal
        isOpen={imageViewerState.isOpen}
        onClose={() => setImageViewerState((prev) => ({ ...prev, isOpen: false }))}
        images={imageViewerState.images}
        initialIndex={imageViewerState.currentIndex}
        title={imageViewerState.title}
        subtitle={imageViewerState.subtitle}
      />

      {/* CMS Login Modal (Only prompted when clicking Accesos CMS) */}
      <CmsLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Full CMS Administration Modal (Accessible only after login) */}
      <CmsAdminModal
        isOpen={isCmsAdminOpen}
        onClose={() => {
          setIsCmsAdminOpen(false);
        }}
        content={content}
        lots={lots}
        currentUser={currentUser}
        onContentUpdated={(newContent) => {
          setContent({ ...newContent });
        }}
        onLotsUpdated={(newLots) => {
          setLots([...newLots]);
        }}
      />
    </div>
  );
}

export default App;
