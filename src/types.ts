export type LotStatus = 'disponible' | 'reservado' | 'vendido' | 'no-disponible';
export type LotLocation = 'alta' | 'baja';
export type LotType = 'mini-granja' | 'residencial' | 'comercial' | 'galpon';

export type UserLevel = 1 | 2 | 3 | 4 | 5;

export interface AppUser {
  id: string;
  username: string;
  name: string;
  email: string;
  level: UserLevel;
  levelName: string;
  password?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface MasterPlanBlueprint {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  sector: string;
  description?: string;
}

export interface PropuestaVideo {
  id: string;
  title: string;
  videoUrl: string;
  url?: string;
  posterUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  duration?: string;
  videoType?: string;
}

export interface LotItem {
  id: string;
  code: string;
  manzana: string;
  loteNum: string;
  areaM2: number;
  type: LotType;
  status: LotStatus;
  priceUsdPerM2: number;
  pricePerM2Usd?: number;
  totalPriceUsd: number;
  location: LotLocation;
  features?: string[];
  dimensions?: {
    norte?: number;
    sur?: number;
    este?: number;
    oeste?: number;
  };
}

export interface HousingModel {
  id: string;
  name: string;
  tagline: string;
  areaM2: number;
  priceUsd: number;
  pricePerM2Usd: number;
  description: string;
  benefits: string[];
  specs: {
    levels: number;
    bedrooms: number;
    bathrooms: number;
    terraceM2: number;
    foundation: string;
    structure: string;
  };
  images: string[];
  brochurePdfUrl?: string;
  showPrice: boolean;
  active: boolean;
}

export interface CustomerProfile {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  benefits: string[];
  ctaText: string;
  ctaAction: string;
  active: boolean;
}

export interface TechnicalAttribute {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: string;
  active: boolean;
}

export interface OdsItem {
  id: string;
  number: number;
  name: string;
  description: string;
  color: string;
}

export interface FinancingModality {
  id: string;
  title: string;
  description: string;
  percentageInitial: number;
  installments: number;
  status: 'Disponible' | 'En evaluación' | 'No disponible';
  badge: string;
  active: boolean;
}

export interface LeadSubmission {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  profileInterest: 'ecologico' | 'hogar' | 'inversionista' | 'general';
  message: string;
  lotPreference?: string;
  modelPreference?: string;
  source: 'formulario' | 'simulador' | 'whatsapp';
  status: 'nuevo' | 'contactado' | 'en_seguimiento' | 'cerrado';
}

export interface CmsContent {
  // General Site Config
  site: {
    projectName: string;
    fullName: string;
    tagline: string;
    logoUrl: string;
    contactPhone: string;
    contactWhatsapp: string;
    contactEmail: string;
    salesOfficeAddress: string;
    socialMedia: {
      instagram: string;
      facebook: string;
      youtube: string;
    };
  };

  // 1. Hero
  hero: {
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    badgeText: string;
    priceBadge: string;
    backgroundImageUrl: string;
    showBadge: boolean;
    active: boolean;
  };

  // 2. Propuesta de valor
  valueProp: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    videos?: PropuestaVideo[];
    selectedVideoId?: string;
    benefits: {
      id: string;
      title: string;
      description: string;
      icon: string;
    }[];
    columnsCount: number;
    active: boolean;
  };

  // 3. Ubicación y entorno
  location: {
    title: string;
    subtitle: string;
    description: string;
    municipality: string;
    sectors: string;
    roadAccess: string;
    travelTimes: {
      sanCristobal: string;
      cordero: string;
      trasandina: string;
    };
    googleMapsEmbedUrl: string;
    mapExternalUrl: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    features: {
      id: string;
      title: string;
      description: string;
      icon: string;
    }[];
    active: boolean;
  };

  // 4. Plan maestro y lotificación
  masterPlan: {
    title: string;
    subtitle: string;
    description: string;
    lote1: {
      name: string;
      zone: string;
      lotsCount: number;
      areaM2: number;
      description: string;
    };
    lote2: {
      name: string;
      zone: string;
      lotsCount: number;
      areaM2: number;
      description: string;
    };
    totalLots: number;
    planImageUrl: string;
    planPdfUrl: string;
    blueprints?: MasterPlanBlueprint[];
    primaryCtaText: string;
    secondaryCtaText: string;
    active: boolean;
  };

  // 5. Modelos de vivienda
  housingModels: {
    title: string;
    subtitle: string;
    description: string;
    priceNotice: string;
    models: HousingModel[];
    active: boolean;
  };

  // 6. Perfiles de cliente
  customerProfiles: {
    title: string;
    subtitle: string;
    profiles: CustomerProfile[];
    active: boolean;
  };

  // 7. Atributos técnicos y sostenibles
  technicalAttributes: {
    title: string;
    subtitle: string;
    attributes: TechnicalAttribute[];
    sdgs: OdsItem[];
    imageUrl: string;
    imageAlt: string;
    active: boolean;
  };

  // 8. Planes de venta y financiamiento
  salesFinancing: {
    title: string;
    subtitle: string;
    pricePerM2Usd: number;
    modalities: FinancingModality[];
    specialPromo: string;
    legalNotice: string;
    active: boolean;
  };

  // 9. Impacto social y garantía promotora
  socialImpact: {
    title: string;
    subtitle: string;
    description: string;
    cededAreaM2: number;
    costCoveredPercentage: number;
    publicEquipments: string[];
    promoterGuarantee: string;
    vision2030: string;
    imageUrl: string;
    imageAlt: string;
    active: boolean;
  };

  // 10. Formulario de contacto y conversión
  contactForm: {
    title: string;
    subtitle: string;
    badgeText?: string;
    directChannelsTitle?: string;
    formTitle?: string;
    formSubtitle?: string;
    scheduleText?: string;
    whatsappSubtitle?: string;
    emailSubtitle?: string;
    directPhone?: string;
    directWhatsapp?: string;
    directEmail?: string;
    directAddress?: string;
    submitButtonText: string;
    callButtonText: string;
    whatsappMessageTemplate: string;
    successMessage: string;
    privacyPolicyText: string;
    active: boolean;
  };

  // 11. Pie de página
  footer: {
    legalNotice: string;
    credits: {
      promoter: string;
      architect: string;
      promoterCi: string;
      architectCiv: string;
    };
    copyrightYear: number;
    quickLinks: {
      label: string;
      href: string;
    }[];
    active: boolean;
  };

  // SEO & Analytics
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    googleAnalyticsId?: string;
    metaPixelId?: string;
    googleTagManagerId?: string;
  };

  // System metadata
  lastUpdated: string;
  version: number;
}
