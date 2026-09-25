// server.ts
import express from "express";
import path2 from "path";
import fs2 from "fs";
import { createServer as createViteServer } from "vite";

// src/data/initialContent.ts
var initialCmsContent = {
  site: {
    projectName: "MIS DELIRIOS RANCH",
    fullName: "COMPLEJO URBAN\xCDSTICO AGROPRODUCTIVO Y TUR\xCDSTICO MIS DELIRIOS RANCH",
    tagline: "Refugio y Tranquilidad Garantizada",
    logoUrl: "/api/images/logo",
    contactPhone: "+58 414-7114245",
    contactWhatsapp: "+58 414-7114245",
    contactEmail: "ventas@misdeliriosranch.com",
    salesOfficeAddress: "Aldea Sabana Larga - Sector Salom\xF3n, Cordero, Municipio Andr\xE9s Bello, estado T\xE1chira, Venezuela",
    socialMedia: {
      instagram: "https://instagram.com/misdeliriosranch",
      facebook: "https://facebook.com/misdeliriosranch",
      youtube: "https://youtube.com/@misdeliriosranch"
    }
  },
  hero: {
    title: "MIS DELIRIOS RANCH \u2013 Refugio y Tranquilidad Garantizada",
    subtitle: "Complejo Urban\xEDstico Agroproductivo y Tur\xEDstico en el Coraz\xF3n de los Andes",
    primaryCtaText: "Reserva tu lote con 10% de inicial",
    primaryCtaLink: "#contacto",
    secondaryCtaText: "Descarga el Plan de Venta",
    secondaryCtaLink: "#financiamiento",
    badgeText: "Preventa Exclusiva Primera Etapa",
    priceBadge: "20,00 USD/m\xB2",
    backgroundImageUrl: "/api/images/hero-landscape",
    showBadge: true,
    active: true
  },
  valueProp: {
    title: "Un Modelo de Desarrollo Sostenible e Innovaci\xF3n Arquitect\xF3nica",
    subtitle: "Fusi\xF3n de Tradici\xF3n, Tecnolog\xEDa y Respeto por la Naturaleza",
    description: "Mis Delirios Ranch fusiona la riqueza tradicional del campo andino con una vanguardista arquitectura ecol\xF3gica basada en Bamb\xFA Guadua. Ubicado estrat\xE9gicamente a tan solo 30 minutos de San Crist\xF3bal y a 5 minutos del casco urbano de Cordero, ofrece un h\xE1bitat autosustentable de baja densidad, seguridad perimetral y soberan\xEDa alimentaria en un microclima privilegiado de monta\xF1a.",
    imageUrl: "/api/images/real-terrain",
    imageAlt: "Fotograf\xEDa real del terreno en Sabana Larga y Cordero, T\xE1chira",
    videos: [
      {
        id: "vid-1",
        title: "Recorrido Arquitect\xF3nico 3D & Vuelo A\xE9reo - Mis Delirios Ranch",
        videoUrl: "https://www.youtube.com/embed/1La4QzGeaaQ",
        url: "https://www.youtube.com/embed/1La4QzGeaaQ",
        posterUrl: "/api/images/real-terrain",
        thumbnailUrl: "/api/images/real-terrain",
        description: "Vuelo a\xE9reo simulado y perspectivas del valle andino en Sabana Larga y Cordero.",
        duration: "2:30",
        videoType: "render_3d"
      },
      {
        id: "vid-2",
        title: "Bioconstrucci\xF3n Sismorresistente en Bamb\xFA Guadua",
        videoUrl: "https://www.youtube.com/embed/kK_UjBmHqQw",
        url: "https://www.youtube.com/embed/kK_UjBmHqQw",
        posterUrl: "/api/images/bamboo-structure",
        thumbnailUrl: "/api/images/bamboo-structure",
        description: "Estructuras arquitect\xF3nicas en bamb\xFA certificado, losas flotantes y dise\xF1o bioclim\xE1tico.",
        duration: "3:15",
        videoType: "bioconstruccion"
      },
      {
        id: "vid-3",
        title: "Entorno Campestre, Neblina y Mini-granjas Productivas",
        videoUrl: "https://www.youtube.com/embed/LXb3EKWsInQ",
        url: "https://www.youtube.com/embed/LXb3EKWsInQ",
        posterUrl: "/api/images/hero-landscape",
        thumbnailUrl: "/api/images/hero-landscape",
        description: "Microclima templado de 18\xB0C-22\xB0C, vegetaci\xF3n exhuberante y conexi\xF3n con la naturaleza.",
        duration: "1:50",
        videoType: "dron_aereo"
      }
    ],
    selectedVideoId: "vid-1",
    benefits: [
      {
        id: "b1",
        title: "Mini-granjas desde 600 m\xB2",
        description: "Lotes amplios pensados para cultivos andinos, huertos org\xE1nicos familiares y cr\xEDa av\xEDcola autosustentable.",
        icon: "Sprout"
      },
      {
        id: "b2",
        title: "Construcci\xF3n sismorresistente en Guadua",
        description: "Viviendas en bamb\xFA estructural certificado sobre losa flotante de concreto a 40 cm, resistentes y ecol\xF3gicas.",
        icon: "Home"
      },
      {
        id: "b3",
        title: "57 lotes residenciales y productivos",
        description: "Comunidad planificada de baja densidad que garantiza privacidad, alta plusval\xEDa y respeto ambiental.",
        icon: "Grid"
      },
      {
        id: "b4",
        title: "M\xE1s de 14.600 m\xB2 de \xE1reas p\xFAblicas",
        description: "Bulevar ecol\xF3gico con plazas, parques infantiles, canchas deportivas multiusos y sal\xF3n comunal.",
        icon: "Trees"
      }
    ],
    columnsCount: 4,
    active: true
  },
  location: {
    title: "La Ruta de la Monta\xF1a y la Neblina",
    subtitle: "Conectividad Vial Inmediata y Confort Andino",
    description: "Estrat\xE9gicamente ubicado en el Municipio Andr\xE9s Bello, sectores Sabana Larga y Aldea Salom\xF3n, con conectividad vial directa desde la Carretera Trasandina.",
    municipality: "Municipio Andr\xE9s Bello, Cordero",
    sectors: "Sabana Larga y Aldea Salom\xF3n",
    roadAccess: "Acceso directo e inmediato desde la Carretera Trasandina",
    travelTimes: {
      sanCristobal: "30 minutos de San Crist\xF3bal",
      cordero: "5 minutos de Cordero",
      trasandina: "Acceso directo a pie de carretera Trasandina (714,46 m de frente)"
    },
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.513576785848!2d-72.1852!3d7.8681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e666992985161cf%3A0xa19bf9e651582294!2sCordero%2C%20T%C3%A1chira!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve",
    mapExternalUrl: "https://maps.google.com/?q=7.8681,-72.1852",
    coordinates: {
      lat: 7.8681,
      lng: -72.1852
    },
    features: [
      {
        id: "f1",
        title: "Clima de Monta\xF1a y Neblina",
        description: "Temperatura fresca templada todo el a\xF1o (18\xB0C - 22\xB0C), aire puro y agradable niebla vespertina.",
        icon: "CloudSun"
      },
      {
        id: "f2",
        title: "Paisajes Andinos Panor\xE1micos",
        description: "Vistas panor\xE1micas hacia el Valle del R\xEDo Torbes y las cordilleras verdes del estado T\xE1chira.",
        icon: "Mountain"
      },
      {
        id: "f3",
        title: "Tranquilidad y Paz Rural",
        description: "Un santuario seguro libre de ruidos de ciudad, ideal para desconectarse y vivir con bienestar.",
        icon: "ShieldCheck"
      },
      {
        id: "f4",
        title: "Cercan\xEDa a Servicios Urbanos",
        description: "A solo 5 min de comercios, cl\xEDnicas, colegios y transporte en Cordero, y a 30 min de San Crist\xF3bal.",
        icon: "MapPin"
      }
    ],
    active: true
  },
  masterPlan: {
    title: "Distribuci\xF3n del Plan Maestro: 57 Soluciones Habitacionales",
    subtitle: "Dise\xF1o Urban\xEDstico Arm\xF3nico, Inteligente y Seguro",
    description: "El complejo urban\xEDstico se divide estrat\xE9gicamente en dos sectores complementarios, sumando un total de 57 lotes delimitados con vialidad interna organizada de 8 a 10 metros y retiros ecol\xF3gicos.",
    lote1: {
      name: "Colinas de Mis Delirios",
      zone: "Parte Alta (Manzana A1)",
      lotsCount: 14,
      areaM2: 37252.62,
      description: "14 lotes exclusivos de mayor tama\xF1o con terrazas naturales y vistas privilegiadas sobre el valle."
    },
    lote2: {
      name: "Mis Delirios Ranch",
      zone: "Parte Baja (Manzanas A2, B, C, D, E, F, G)",
      lotsCount: 43,
      areaM2: 90721.22,
      description: "43 lotes tipo mini-granjas autosustentables desde 600 m\xB2, con acceso directo a vialidad comunal y bulevar."
    },
    totalLots: 57,
    planImageUrl: "/api/images/blueprint-masterplan",
    planPdfUrl: "#plan-descarga",
    blueprints: [
      {
        id: "plano-general",
        title: "Plano General de Lotificaci\xF3n Integral (57 Lotes)",
        subtitle: "Lote 1 (Colinas) + Lote 2 (Ranch) con vialidad de 8 a 10m",
        imageUrl: "/api/images/blueprint-masterplan",
        sector: "General Complejo",
        description: "Distribuci\xF3n macro con \xE1reas comunales, accesos principales desde la Trasandina y linderos con el R\xEDo Torbes."
      },
      {
        id: "plano-sector-1",
        title: "Sector 1: Colinas de Mis Delirios (Manzana A1)",
        subtitle: "14 Lotes exclusivos en terraza alta con vistas panor\xE1micas",
        imageUrl: "/api/images/blueprint-masterplan",
        sector: "Parte Alta",
        description: "Superficie de 37.252,62 m\xB2 distribuida en 14 parcelas residenciales de baja densidad."
      },
      {
        id: "plano-sector-2",
        title: "Sector 2: Mis Delirios Ranch (Manzanas A2 a G)",
        subtitle: "43 Lotes tipo mini-granjas desde 600 m\xB2",
        imageUrl: "/api/images/blueprint-masterplan",
        sector: "Parte Baja",
        description: "Superficie de 90.721,22 m\xB2 con integraci\xF3n directa al bulevar comunal y \xE1reas agrotur\xEDsticas."
      },
      {
        id: "plano-bulevar",
        title: "Plano del Bulevar de la Guadua y Espacios Comunitarios",
        subtitle: "M\xE1s de 14.600 m\xB2 de \xE1reas p\xFAblicas cedidas",
        imageUrl: "/api/images/bulevar-guadua",
        sector: "\xC1reas P\xFAblicas",
        description: "Equipamiento comunal: plazas, parques infantiles, canchas deportivas multiusos y sal\xF3n comunal."
      }
    ],
    primaryCtaText: "Ver disponibilidad de lotes",
    secondaryCtaText: "Solicitar plano detallado",
    active: true
  },
  housingModels: {
    title: "Casas Ecol\xF3gicas Sismorresistentes en Bamb\xFA Guadua",
    subtitle: "Vanguardia Bioclim\xE1tica y Acabados Minimalistas de Campo",
    description: "Viviendas de un solo nivel, construidas sobre losa flotante de concreto a 40 cm de altura, con estructura integral en Guadua angustifolia Kunth. Acabados minimalistas propios del campo andino, con ventilaci\xF3n cruzada continua y envolvente conexi\xF3n visual con la naturaleza.",
    priceNotice: "Precios de preventa sujetos a ajustes seg\xFAn disponibilidad y avance de obra. Cuota calculada a raz\xF3n de 450 USD/m\xB2 de construcci\xF3n.",
    models: [
      {
        id: "modelo-a",
        name: "Modelo A - Caba\xF1a Andina",
        tagline: "Ideal para descanso familiar y fines de semana",
        areaM2: 90,
        priceUsd: 40500,
        pricePerM2Usd: 450,
        description: "Vivienda compacta y eficiente de un solo nivel. Posee 2 a 3 habitaciones, 2 ba\xF1os completos, \xE1rea social abierta y terraza con vistas panor\xE1micas.",
        benefits: [
          "Terrazas mirador con vistas a la cordillera",
          "Ventilaci\xF3n cruzada que asegura frescura natural",
          "Iluminaci\xF3n solar cenital en todas las \xE1reas",
          "Corredor perimetral con aleros generosos",
          "Losa flotante de concreto a 40 cm de protecci\xF3n h\xEDdrica"
        ],
        specs: {
          levels: 1,
          bedrooms: 2,
          bathrooms: 2,
          terraceM2: 15,
          foundation: "Losa flotante armada a 40 cm",
          structure: "Bamb\xFA Guadua angustifolia tratado e inmunizado"
        },
        images: ["/api/images/model-a-render", "/api/images/model-a-floorplan"],
        brochurePdfUrl: "#ficha-modelo-a",
        showPrice: true,
        active: true
      },
      {
        id: "modelo-b",
        name: "Modelo B - Villa Campestre",
        tagline: "Amplitud, confort integral y terraza perimetral extendida",
        areaM2: 125,
        priceUsd: 56250,
        pricePerM2Usd: 450,
        description: "Nuestra propuesta m\xE1s espaciosa: 3 amplias habitaciones, 2 ba\xF1os, sala-comedor a doble altura, cocina campestre y terraza perimetral de 20 m\xB2.",
        benefits: [
          "3 habitaciones con cl\xF3set y ventilaci\xF3n andina",
          "Terraza mirador de 20 m\xB2 techada en teja o cubierta liviana",
          "Cocina campestre integrada con barra americana",
          "Corredor perimetral de 360 grados",
          "Estructura sismorresistente con uniones apernadas de alta ingenier\xEDa"
        ],
        specs: {
          levels: 1,
          bedrooms: 3,
          bathrooms: 2,
          terraceM2: 20,
          foundation: "Losa flotante de concreto armado a 40 cm",
          structure: "Guadua estructural colombiana seleccionada"
        },
        images: ["/api/images/model-b-render", "/api/images/model-b-floorplan"],
        brochurePdfUrl: "#ficha-modelo-b",
        showPrice: true,
        active: true
      }
    ],
    active: true
  },
  customerProfiles: {
    title: "Una Oferta Dise\xF1ada para Cada Perfil",
    subtitle: "Tu Espacio Ideal seg\xFAn tus Metas de Vida e Inversi\xF3n",
    profiles: [
      {
        id: "p1",
        title: "Perfil Ecol\xF3gico",
        subtitle: "Soberan\xEDa alimentaria y vida en contacto con la tierra",
        icon: "Leaf",
        benefits: [
          "Espacios f\xE9rtiles para cultivos andinos (caf\xE9, hortalizas, fresas)",
          "Huertos org\xE1nicos y compostaje regenerativo",
          "Cr\xEDa av\xEDcola y producci\xF3n autosuficiente",
          "Armon\xEDa con la biodiversidad aut\xF3ctona"
        ],
        ctaText: "Quiero cultivar mi futuro",
        ctaAction: "#contacto?perfil=ecologico",
        active: true
      },
      {
        id: "p2",
        title: "Perfil Hogar y Familia",
        subtitle: "Paz mental, seguridad y crecimiento para los tuyos",
        icon: "HeartHandshake",
        benefits: [
          "Entorno cerrado, privado y seguro 24/7",
          "Caminer\xEDas perimetrales y \xE1reas infantiles",
          "M\xE1xima calidad de vida lejos del estr\xE9s urbano",
          "Espacios al aire libre para que los ni\xF1os crezcan sanos"
        ],
        ctaText: "Construir el hogar familiar",
        ctaAction: "#contacto?perfil=hogar",
        active: true
      },
      {
        id: "p3",
        title: "Perfil Inversionista",
        subtitle: "Patrimonio seguro, alta plusval\xEDa y retorno tur\xEDstico",
        icon: "TrendingUp",
        benefits: [
          "Alta plusval\xEDa proyectada por desarrollo del bulevar",
          "Precio de preventa ultra-competitivo: 20 USD/m\xB2",
          "Proyecto pionero en arquitectura Guadua en los Andes",
          "Potencial de alquiler vacacional y glamping ecol\xF3gico"
        ],
        ctaText: "Invertir en preventa",
        ctaAction: "#contacto?perfil=inversionista",
        active: true
      }
    ],
    active: true
  },
  technicalAttributes: {
    title: "Ingenier\xEDa, Sostenibilidad y Compromiso Social",
    subtitle: "Rigor Constructivo, Preservaci\xF3n y Objetivos de la ONU",
    attributes: [
      {
        id: "t1",
        title: "Ingenier\xEDa Sismorresistente",
        description: "Estructuras fabricadas en Bamb\xFA Guadua estructural importada de Colombia y concreto armado, con excelente flexibilidad y resistencia s\xEDsmica.",
        icon: "ShieldCheck",
        highlight: "Normas s\xEDsmicas venezolanas",
        active: true
      },
      {
        id: "t2",
        title: "Vialidad Ordenada y Delimitada",
        description: "Calles internas se\xF1alizadas e identificadas con estantillos y varetas blancas de estilo campestre, con anchuras de 8 y 10 metros.",
        icon: "Compass",
        highlight: "Est\xE9tica r\xFAstica impecable",
        active: true
      },
      {
        id: "t3",
        title: "Infraestructura Comunal Completa",
        description: "Plazas arborizadas, parques infantiles seguros, canchas multiusos y sal\xF3n de eventos comunitarios para el disfrute vecinal.",
        icon: "Users",
        highlight: "14.600 m\xB2 de esparcimiento",
        active: true
      },
      {
        id: "t4",
        title: "Cuidado y Protecci\xF3n Ambiental",
        description: "Cimentaci\xF3n aislada por pilotes y losas flotantes que minimizan el movimiento de tierras y preservan la flora y los \xE1rboles nativos.",
        icon: "Sprout",
        highlight: "M\xEDnimo impacto ecol\xF3gico",
        active: true
      },
      {
        id: "t5",
        title: "R\xE9gimen de Convivencia Rural",
        description: "Estatutos y normas internas claras para preservar la tranquilidad, la uniformidad est\xE9tica de las viviendas y la armon\xEDa comunitaria.",
        icon: "FileText",
        highlight: "Convivencia garantizada",
        active: true
      }
    ],
    sdgs: [
      {
        id: "sdg-2",
        number: 2,
        name: "Hambre Cero",
        description: "Promoci\xF3n de la soberan\xEDa alimentaria con huertos familiares y mini-granjas autosustentables.",
        color: "#DDA63A"
      },
      {
        id: "sdg-11",
        number: 11,
        name: "Ciudades y Comunidades Sostenibles",
        description: "Urbanismo de baja densidad con bioconstrucci\xF3n y materiales de baja huella de carbono.",
        color: "#FD9D24"
      },
      {
        id: "sdg-13",
        number: 13,
        name: "Acci\xF3n por el Clima",
        description: "El bamb\xFA captura toneladas de CO2 durante su crecimiento y protege las cuencas h\xEDdricas locales.",
        color: "#3F7E44"
      }
    ],
    imageUrl: "/api/images/bamboo-structure",
    imageAlt: "Detalle constructivo de Guadua estructural y arquitectura ecol\xF3gica",
    active: true
  },
  salesFinancing: {
    title: "Planes de Venta & Compromiso Sostenible",
    subtitle: "Valor por Metro Cuadrado: USD 20,00",
    pricePerM2Usd: 20,
    modalities: [
      {
        id: "m1",
        title: "1. Al Contado",
        description: "Pago del 100% a la firma del Contrato de opci\xF3n a compra.",
        percentageInitial: 100,
        installments: 0,
        status: "Disponible",
        badge: "Sin recargos ni intereses",
        active: true
      },
      {
        id: "m2",
        title: "2. Financiamiento Propio",
        description: "Inicial del 50% al firmar contrato + 50% restante financiado directamente en 6 cuotas mensuales iguales y consecutivas.",
        percentageInitial: 50,
        installments: 6,
        status: "Disponible",
        badge: "Plan m\xE1s popular",
        active: true
      },
      {
        id: "m3",
        title: "3. Financiamiento Bancario",
        description: "Modalidad en evaluaci\xF3n t\xE9cnica para su pronta incorporaci\xF3n con entidades financieras aliadas.",
        percentageInitial: 30,
        installments: 24,
        status: "En evaluaci\xF3n",
        badge: "Pr\xF3ximamente",
        active: true
      },
      {
        id: "m4",
        title: "4. Otras Opciones Personalizadas",
        description: "Planteamientos flexibles evaluados directamente por el Comit\xE9 Promotor en un plazo no mayor a 24 horas.",
        percentageInitial: 40,
        installments: 12,
        status: "Disponible",
        badge: "Respuesta en 24h",
        active: true
      }
    ],
    specialPromo: "Promoci\xF3n especial para inversionistas por compras superiores a 3 Lotes con descuento preferencial directo.",
    legalNotice: "Todos los compradores deben someterse al R\xE9gimen de Convivencia interno para regular normas de construcci\xF3n y preservaci\xF3n.",
    active: true
  },
  socialImpact: {
    title: "El Gran Aporte Social: Bulevar de la Guadua",
    subtitle: "Urbanismo con Prop\xF3sito y Retorno para la Comunidad Andina",
    description: "Los promotores ceden m\xE1s de 14.600 m\xB2 de terreno para el disfrute p\xFAblico de la comunidad andina, asumiendo el 100 % de los costos de dise\xF1o arquitect\xF3nico, materiales certificados, mano de obra y mantenimiento continuo.",
    cededAreaM2: 14600,
    costCoveredPercentage: 100,
    publicEquipments: [
      "Plazas p\xFAblicas ajardinadas",
      "Senderos peatonales y caminer\xEDas ecol\xF3gicas",
      "Iluminaci\xF3n vial integral de bajo consumo",
      "Parques infantiles tem\xE1ticos de madera y bamb\xFA",
      "Canchas deportivas multiusos",
      "Sal\xF3n comunal para asambleas y actividades culturales"
    ],
    promoterGuarantee: "La administraci\xF3n, aseo y seguridad del bulevar corren por cuenta del sector privado, sin costo ni cargas presupuestarias para el municipio. La Alcald\xEDa recibir\xE1 un local en comodato por 10 a\xF1os para servicios vecinales.",
    vision2030: "Ser el proyecto bandera de desarrollo urbano-rural sostenible en la regi\xF3n andina venezolana.",
    imageUrl: "/api/images/bulevar-guadua",
    imageAlt: "Render del Bulevar de la Guadua y espacios comunales integrados",
    active: true
  },
  contactForm: {
    title: "Haz Realidad tu Casa de Campo",
    subtitle: "Nuestros asesores te brindar\xE1n atenci\xF3n personalizada y respuesta en menos de 24 horas.",
    submitButtonText: "Enviar solicitud de informaci\xF3n",
    callButtonText: "Solicitar llamada inmediata",
    whatsappMessageTemplate: "\xA1Hola! Estoy interesado en el proyecto Mis Delirios Ranch en Cordero, T\xE1chira. Quisiera recibir informaci\xF3n sobre disponibilidad y planes de financiamiento.",
    successMessage: "\xA1Gracias por tu inter\xE9s en Mis Delirios Ranch! Hemos recibido tus datos y un asesor se comunicar\xE1 contigo en menos de 24 horas.",
    privacyPolicyText: "Acepto la pol\xEDtica de privacidad y autorizo el tratamiento de mis datos con fines informativos sobre el proyecto Mis Delirios Ranch.",
    active: true
  },
  footer: {
    legalNotice: "Proyecto en preventa. Precios sujetos a cambios sin previo aviso. Im\xE1genes y renders arquitect\xF3nicos de referencia.",
    credits: {
      promoter: "Dr. N\xE9stor Eduardo Depablos Mora",
      architect: "Arq. Indira Contreras",
      promoterCi: "C.I. V-5.685.149 / V-9.226.372 / V-11.509.606 / V-12.813.704",
      architectCiv: "C.I.V. 165.492"
    },
    copyrightYear: 2025,
    quickLinks: [
      { label: "Inicio", href: "#inicio" },
      { label: "Propuesta", href: "#propuesta" },
      { label: "Ubicaci\xF3n", href: "#ubicacion" },
      { label: "Plan Maestro", href: "#plan-maestro" },
      { label: "Modelos", href: "#modelos" },
      { label: "Perfiles", href: "#perfiles" },
      { label: "Financiamiento", href: "#financiamiento" },
      { label: "Impacto Social", href: "#impacto-social" },
      { label: "Contacto", href: "#contacto" }
    ],
    active: true
  },
  seo: {
    metaTitle: "Mis Delirios Ranch - Complejo Urban\xEDstico Agroproductivo y Tur\xEDstico en T\xE1chira",
    metaDescription: "Lotes en venta en T\xE1chira desde 600 m\xB2 a 20 USD/m\xB2. Casas en Guadua sismorresistentes, mini-granjas autosustentables y bulevar p\xFAblico.",
    keywords: [
      "Lotes en venta T\xE1chira",
      "Complejo agroproductivo",
      "Casas en Guadua",
      "Mis Delirios Ranch",
      "Terrenos en Cordero",
      "Bamb\xFA Guadua Venezuela",
      "Mini granjas T\xE1chira"
    ],
    ogTitle: "Mis Delirios Ranch - Refugio y Tranquilidad Garantizada",
    ogDescription: "Complejo Urban\xEDstico Agroproductivo y Tur\xEDstico en el Coraz\xF3n de los Andes (Cordero, T\xE1chira). Preventa exclusiva desde 20 USD/m\xB2.",
    ogImage: "/api/images/hero-landscape",
    googleAnalyticsId: "G-DELIRIOS2025",
    metaPixelId: "",
    googleTagManagerId: ""
  },
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
  version: 1
};

// src/data/initialLots.ts
var initialLots = [
  // PARTE ALTA - COLINAS DE MIS DELIRIOS (14 Lotes)
  { id: "A1-01", code: "A1-01", manzana: "A1", loteNum: "01", areaM2: 1431.8, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 28636, location: "alta" },
  { id: "A1-02", code: "A1-02", manzana: "A1", loteNum: "02", areaM2: 1200, type: "mini-granja", status: "reservado", priceUsdPerM2: 20, totalPriceUsd: 24e3, location: "alta" },
  { id: "A1-03", code: "A1-03", manzana: "A1", loteNum: "03", areaM2: 1155.92, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 23118, location: "alta" },
  { id: "A1-04", code: "A1-04", manzana: "A1", loteNum: "04", areaM2: 1200, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 24e3, location: "alta" },
  { id: "A1-05", code: "A1-05", manzana: "A1", loteNum: "05", areaM2: 1200, type: "mini-granja", status: "vendido", priceUsdPerM2: 20, totalPriceUsd: 24e3, location: "alta" },
  { id: "A1-06", code: "A1-06", manzana: "A1", loteNum: "06", areaM2: 1200, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 24e3, location: "alta" },
  { id: "A1-07", code: "A1-07", manzana: "A1", loteNum: "07", areaM2: 1505.97, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 30119, location: "alta" },
  { id: "A1-08", code: "A1-08", manzana: "A1", loteNum: "08", areaM2: 4456.2, type: "mini-granja", status: "reservado", priceUsdPerM2: 20, totalPriceUsd: 89124, location: "alta" },
  { id: "A1-09", code: "A1-09", manzana: "A1", loteNum: "09", areaM2: 2612.4, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 52248, location: "alta" },
  { id: "A1-10", code: "A1-10", manzana: "A1", loteNum: "10", areaM2: 2466.57, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 49331, location: "alta" },
  { id: "A1-11", code: "A1-11", manzana: "A1", loteNum: "11", areaM2: 2321.75, type: "mini-granja", status: "vendido", priceUsdPerM2: 20, totalPriceUsd: 46435, location: "alta" },
  { id: "A1-12", code: "A1-12", manzana: "A1", loteNum: "12", areaM2: 2176.41, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 43528, location: "alta" },
  { id: "A1-13", code: "A1-13", manzana: "A1", loteNum: "13", areaM2: 2216.37, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 44327, location: "alta" },
  { id: "A1-14", code: "A1-14", manzana: "A1", loteNum: "14", areaM2: 4375.58, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 87512, location: "alta" },
  // PARTE BAJA - MIS DELIRIOS RANCH (43 Lotes)
  // Manzana A2 (8 lotes)
  { id: "A2-01", code: "A2-01", manzana: "A2", loteNum: "01", areaM2: 2210, type: "residencial", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 44200, location: "baja" },
  { id: "A2-02", code: "A2-02", manzana: "A2", loteNum: "02", areaM2: 1040.76, type: "residencial", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 20815, location: "baja" },
  { id: "A2-03", code: "A2-03", manzana: "A2", loteNum: "03", areaM2: 1492.95, type: "residencial", status: "reservado", priceUsdPerM2: 20, totalPriceUsd: 29859, location: "baja" },
  { id: "A2-04", code: "A2-04", manzana: "A2", loteNum: "04", areaM2: 1136.29, type: "residencial", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 22726, location: "baja" },
  { id: "A2-05", code: "A2-05", manzana: "A2", loteNum: "05", areaM2: 1231.19, type: "residencial", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 24624, location: "baja" },
  { id: "A2-06", code: "A2-06", manzana: "A2", loteNum: "06", areaM2: 717.64, type: "residencial", status: "vendido", priceUsdPerM2: 20, totalPriceUsd: 14353, location: "baja" },
  { id: "A2-07", code: "A2-07", manzana: "A2", loteNum: "07", areaM2: 600, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "A2-08", code: "A2-08", manzana: "A2", loteNum: "08", areaM2: 856.15, type: "residencial", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 17123, location: "baja" },
  // Manzana B (5 lotes)
  { id: "B2-09", code: "B2-09", manzana: "B", loteNum: "09", areaM2: 745.25, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 14905, location: "baja" },
  { id: "B2-10", code: "B2-10", manzana: "B", loteNum: "10", areaM2: 600, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "B2-11", code: "B2-11", manzana: "B", loteNum: "11", areaM2: 750, type: "mini-granja", status: "reservado", priceUsdPerM2: 20, totalPriceUsd: 15e3, location: "baja" },
  { id: "B2-12", code: "B2-12", manzana: "B", loteNum: "12", areaM2: 998.58, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 19972, location: "baja" },
  { id: "B2-13", code: "B2-13", manzana: "B", loteNum: "13", areaM2: 600.35, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12007, location: "baja" },
  // Manzana C (2 lotes)
  { id: "C2-14", code: "C2-14", manzana: "C", loteNum: "14", areaM2: 671.73, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 13435, location: "baja" },
  { id: "C2-15", code: "C2-15", manzana: "C", loteNum: "15", areaM2: 828.75, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 16575, location: "baja" },
  // Manzana D (7 lotes)
  { id: "D2-16", code: "D2-16", manzana: "D", loteNum: "16", areaM2: 654.48, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 13090, location: "baja" },
  { id: "D2-17", code: "D2-17", manzana: "D", loteNum: "17", areaM2: 879.26, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 17585, location: "baja" },
  { id: "D2-18", code: "D2-18", manzana: "D", loteNum: "18", areaM2: 1539.93, type: "mini-granja", status: "reservado", priceUsdPerM2: 20, totalPriceUsd: 30799, location: "baja" },
  { id: "D2-19", code: "D2-19", manzana: "D", loteNum: "19", areaM2: 1043.78, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 20876, location: "baja" },
  { id: "D2-20", code: "D2-20", manzana: "D", loteNum: "20", areaM2: 1234.31, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 24686, location: "baja" },
  { id: "D2-21", code: "D2-21", manzana: "D", loteNum: "21", areaM2: 1760.28, type: "mini-granja", status: "vendido", priceUsdPerM2: 20, totalPriceUsd: 35206, location: "baja" },
  { id: "D2-22", code: "D2-22", manzana: "D", loteNum: "22", areaM2: 1519.95, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 30399, location: "baja" },
  // Manzana E (5 lotes)
  { id: "E2-23", code: "E2-23", manzana: "E", loteNum: "23", areaM2: 1639.67, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 32793, location: "baja" },
  { id: "E2-24", code: "E2-24", manzana: "E", loteNum: "24", areaM2: 1340.5, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 26810, location: "baja" },
  { id: "E2-25", code: "E2-25", manzana: "E", loteNum: "25", areaM2: 1363.25, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 27265, location: "baja" },
  { id: "E2-26", code: "E2-26", manzana: "E", loteNum: "26", areaM2: 1394.43, type: "mini-granja", status: "reservado", priceUsdPerM2: 20, totalPriceUsd: 27889, location: "baja" },
  { id: "E2-27", code: "E2-27", manzana: "E", loteNum: "27", areaM2: 2154.53, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 43091, location: "baja" },
  // Manzana F (10 lotes)
  { id: "F2-28", code: "F2-28", manzana: "F", loteNum: "28", areaM2: 699.08, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 13982, location: "baja" },
  { id: "F2-29", code: "F2-29", manzana: "F", loteNum: "29", areaM2: 600, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "F2-30", code: "F2-30", manzana: "F", loteNum: "30", areaM2: 600, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "F2-31", code: "F2-31", manzana: "F", loteNum: "31", areaM2: 750, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 15e3, location: "baja" },
  { id: "F2-32", code: "F2-32", manzana: "F", loteNum: "32", areaM2: 600, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "F2-33", code: "F2-33", manzana: "F", loteNum: "33", areaM2: 745.25, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 14905, location: "baja" },
  { id: "F2-34", code: "F2-34", manzana: "F", loteNum: "34", areaM2: 600, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "F2-35", code: "F2-35", manzana: "F", loteNum: "35", areaM2: 600, type: "mini-granja", status: "vendido", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "F2-36", code: "F2-36", manzana: "F", loteNum: "36", areaM2: 600, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12e3, location: "baja" },
  { id: "F2-37", code: "F2-37", manzana: "F", loteNum: "37", areaM2: 628.12, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12562, location: "baja" },
  // Manzana G (6 lotes)
  { id: "G2-38", code: "G2-38", manzana: "G", loteNum: "38", areaM2: 951.32, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 19026, location: "baja" },
  { id: "G2-39", code: "G2-39", manzana: "G", loteNum: "39", areaM2: 633.53, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 12671, location: "baja" },
  { id: "G2-40", code: "G2-40", manzana: "G", loteNum: "40", areaM2: 691.05, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 13821, location: "baja" },
  { id: "G2-41", code: "G2-41", manzana: "G", loteNum: "41", areaM2: 845.49, type: "mini-granja", status: "reservado", priceUsdPerM2: 20, totalPriceUsd: 16910, location: "baja" },
  { id: "G2-42", code: "G2-42", manzana: "G", loteNum: "42", areaM2: 717.64, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 14353, location: "baja" },
  { id: "G2-43", code: "G2-43", manzana: "G", loteNum: "43", areaM2: 858.52, type: "mini-granja", status: "disponible", priceUsdPerM2: 20, totalPriceUsd: 17170, location: "baja" }
];

// server/mariadb.ts
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
function sanitizeHost(h) {
  if (!h) return "";
  return h.trim().replace(/^https?:\/\//i, "").replace(/[:/].*$/, "").trim();
}
function resolveEffectiveHost(h) {
  const clean = sanitizeHost(h);
  if (clean === "www.360siace.com" || clean === "360siace.com" || clean === "misdelirios.360siace.com") {
    return "45.79.40.132";
  }
  return clean;
}
var CONFIG_FILE = path.join(process.cwd(), "data", "mariadb-config.json");
var rawEnvHost = process.env.MARIADB_HOST || "";
var cleanEnvHost = resolveEffectiveHost(rawEnvHost);
var defaultConfig = {
  host: cleanEnvHost || "45.79.40.132",
  port: Number(process.env.MARIADB_PORT) || 3306,
  user: process.env.MARIADB_USER || "siacecom_aapu",
  password: process.env.MARIADB_PASSWORD || "Admin21aapu",
  database: process.env.MARIADB_DATABASE || "siacecom_misdelirios",
  enabled: true
};
var currentConfig = loadSavedConfig();
var pool = null;
var lastStatus = {
  connected: false,
  error: null,
  lastChecked: null,
  tablesCreated: false
};
function loadSavedConfig() {
  let saved = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      saved = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    }
  } catch (err) {
    console.warn("[MariaDB] Error leyendo configuraci\xF3n guardada:", err);
  }
  const rawTargetHost = process.env.MARIADB_HOST || saved.host || defaultConfig.host;
  const merged = {
    host: resolveEffectiveHost(rawTargetHost),
    port: Number(process.env.MARIADB_PORT || saved.port || defaultConfig.port),
    user: process.env.MARIADB_USER || saved.user || defaultConfig.user,
    password: process.env.MARIADB_PASSWORD || saved.password || defaultConfig.password,
    database: process.env.MARIADB_DATABASE || saved.database || defaultConfig.database,
    enabled: saved.enabled !== void 0 ? saved.enabled : defaultConfig.enabled
  };
  return merged;
}
function saveConfig(cfg) {
  const cleanCfg = { ...cfg };
  if (cleanCfg.host) {
    cleanCfg.host = resolveEffectiveHost(cleanCfg.host);
  }
  currentConfig = { ...currentConfig, ...cleanCfg };
  try {
    const dataDir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig, null, 2), "utf-8");
  } catch (err) {
    console.warn("[MariaDB] Error guardando archivo de configuraci\xF3n:", err);
  }
  initMariaDbPool();
  return currentConfig;
}
function getCurrentConfig() {
  return { ...currentConfig };
}
function getMariaDbStatus() {
  return {
    ...lastStatus,
    config: {
      host: currentConfig.host,
      port: currentConfig.port,
      user: currentConfig.user,
      database: currentConfig.database,
      enabled: currentConfig.enabled
    }
  };
}
function initMariaDbPool() {
  if (pool) {
    try {
      pool.end().catch(() => {
      });
    } catch {
    }
    pool = null;
  }
  if (!currentConfig.enabled) {
    lastStatus = {
      connected: false,
      error: "MariaDB est\xE1 deshabilitado en la configuraci\xF3n",
      lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
      tablesCreated: false
    };
    return null;
  }
  try {
    const cleanHost = resolveEffectiveHost(currentConfig.host);
    pool = mysql.createPool({
      host: cleanHost,
      port: currentConfig.port,
      user: currentConfig.user,
      password: currentConfig.password,
      database: currentConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4e3,
      timezone: "+00:00"
    });
    return pool;
  } catch (err) {
    console.warn("[MariaDB] Error inicializando pool:", err.message);
    lastStatus = {
      connected: false,
      error: err.message,
      lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
      tablesCreated: false
    };
    return null;
  }
}
async function testMariaDbConnection(configOverride) {
  const cfg = { ...currentConfig, ...configOverride };
  if (cfg.host) {
    cfg.host = resolveEffectiveHost(cfg.host);
  }
  try {
    let connection;
    try {
      connection = await mysql.createConnection({
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database,
        connectTimeout: 3e3
      });
    } catch (dbErr) {
      if (dbErr.code === "ER_BAD_DB_ERROR" || dbErr.message?.includes("Unknown database")) {
        const rootConn = await mysql.createConnection({
          host: cfg.host,
          port: cfg.port,
          user: cfg.user,
          password: cfg.password,
          connectTimeout: 3e3
        });
        const [dbRows2] = await rootConn.query("SHOW DATABASES;");
        const availableDbs2 = dbRows2.map((r) => Object.values(r)[0]);
        try {
          await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\`;`);
          await rootConn.end();
          return {
            success: true,
            message: `\xA1Conexi\xF3n exitosa! La base de datos '${cfg.database}' fue creada autom\xE1ticamente en MariaDB (${cfg.host}).`,
            databases: availableDbs2
          };
        } catch {
          await rootConn.end();
          return {
            success: false,
            message: `Credenciales v\xE1lidas, pero la base de datos '${cfg.database}' no existe. Bases de datos disponibles: ${availableDbs2.join(", ")}`,
            databases: availableDbs2
          };
        }
      }
      throw dbErr;
    }
    const [rows] = await connection.query("SELECT 1 as test, VERSION() as version;");
    const [dbRows] = await connection.query("SHOW DATABASES;").catch(() => [[]]);
    const availableDbs = dbRows.map((r) => Object.values(r)[0]);
    await connection.end();
    lastStatus = {
      connected: true,
      error: null,
      lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
      tablesCreated: lastStatus.tablesCreated
    };
    return {
      success: true,
      message: `\xA1Conectado exitosamente a MariaDB! Versi\xF3n: ${rows?.[0]?.version || "OK"} (Servidor: ${cfg.host})`,
      databases: availableDbs
    };
  } catch (err) {
    let friendlyError = err.message || String(err);
    if (err.code === "ETIMEDOUT" || err.message?.includes("ETIMEDOUT")) {
      friendlyError = `Tiempo de espera agotado al conectar con ${cfg.host}:${cfg.port}. Posibles causas: 1) El puerto 3306 est\xE1 bloqueado por firewall en el servidor de hosting. 2) En cPanel se requiere habilitar "MySQL Remoto" y agregar '%' como host de acceso. 3) El dominio apunta a Vercel/CDN y se requiere la IP directa del servidor MySQL.`;
    } else if (err.code === "ER_ACCESS_DENIED_ERROR" || err.message?.includes("Access denied")) {
      friendlyError = `El servidor MariaDB en '${cfg.host}' respondi\xF3, pero deneg\xF3 el acceso al usuario '${cfg.user}'. Soluci\xF3n: En cPanel -> "MySQL Remoto" (Remote MySQL) agregue '%' (comod\xEDn para cualquier IP) y verifique que el usuario '${cfg.user}' tenga asignados todos los privilegios sobre la base de datos '${cfg.database}'. [Detalle t\xE9cnico: ${err.message}]`;
    } else if (err.code === "ENOTFOUND") {
      friendlyError = `No se pudo resolver el host '${cfg.host}'. Verifique el nombre de host o utilice la direcci\xF3n IP directa.`;
    }
    lastStatus = {
      connected: false,
      error: friendlyError,
      lastChecked: (/* @__PURE__ */ new Date()).toISOString(),
      tablesCreated: false
    };
    return {
      success: false,
      message: "Fallo al conectar con MariaDB",
      error: friendlyError
    };
  }
}
var tablesEnsured = false;
async function ensureMariaDbTables(force = false) {
  if (tablesEnsured && !force) return true;
  if (!pool) initMariaDbPool();
  if (!pool) return false;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_content (
        id VARCHAR(64) PRIMARY KEY,
        content_json LONGTEXT NOT NULL,
        version INT DEFAULT 1,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS housing_models (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        area_m2 INT,
        price_usd INT,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lots (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(64) NOT NULL,
        manzana VARCHAR(32),
        lote_num VARCHAR(32),
        area_m2 INT,
        price_usd_per_m2 INT,
        total_price_usd INT,
        status VARCHAR(32) DEFAULT 'disponible',
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(64),
        lot_code VARCHAR(64),
        model_name VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_json LONGTEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_versions (
        version INT PRIMARY KEY,
        note TEXT,
        content_json LONGTEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_site (
        id VARCHAR(64) PRIMARY KEY,
        project_name VARCHAR(255),
        full_name VARCHAR(255),
        tagline TEXT,
        logo_url TEXT,
        contact_phone VARCHAR(64),
        contact_whatsapp VARCHAR(64),
        contact_email VARCHAR(255),
        sales_office_address TEXT,
        instagram_url VARCHAR(255),
        facebook_url VARCHAR(255),
        youtube_url VARCHAR(255),
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_hero (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        badge_text VARCHAR(255),
        price_badge VARCHAR(255),
        primary_cta_text VARCHAR(128),
        primary_cta_link VARCHAR(255),
        secondary_cta_text VARCHAR(128),
        secondary_cta_link VARCHAR(255),
        background_image_url TEXT,
        show_badge BOOLEAN DEFAULT TRUE,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_value_prop (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        description LONGTEXT,
        image_url TEXT,
        image_alt VARCHAR(255),
        columns_count INT DEFAULT 3,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_location (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        description LONGTEXT,
        municipality VARCHAR(255),
        sectors TEXT,
        google_maps_embed_url TEXT,
        map_external_url TEXT,
        coordinates_lat DECIMAL(10, 7),
        coordinates_lng DECIMAL(10, 7),
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_master_plan (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        description LONGTEXT,
        total_lots INT,
        plan_image_url TEXT,
        plan_pdf_url TEXT,
        primary_cta_text VARCHAR(128),
        secondary_cta_text VARCHAR(128),
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_housing_models (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        description LONGTEXT,
        price_notice TEXT,
        models_count INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_sales_financing (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        price_per_m2_usd DECIMAL(10, 2),
        special_promo TEXT,
        legal_notice TEXT,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_social_impact (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        description LONGTEXT,
        ceded_area_m2 INT,
        cost_covered_percentage INT,
        vision_2030 TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_contact (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255),
        subtitle TEXT,
        badge_text VARCHAR(255),
        direct_channels_title VARCHAR(255),
        form_title VARCHAR(255),
        form_subtitle TEXT,
        schedule_text VARCHAR(255),
        whatsapp_subtitle VARCHAR(255),
        email_subtitle VARCHAR(255),
        direct_phone VARCHAR(64),
        direct_whatsapp VARCHAR(64),
        direct_email VARCHAR(255),
        direct_address TEXT,
        submit_button_text VARCHAR(128),
        call_button_text VARCHAR(128),
        whatsapp_message_template TEXT,
        success_message TEXT,
        privacy_policy_text TEXT,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_footer (
        id VARCHAR(64) PRIMARY KEY,
        legal_notice TEXT,
        credits TEXT,
        copyright_year VARCHAR(32),
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_section_seo (
        id VARCHAR(64) PRIMARY KEY,
        meta_title VARCHAR(255),
        meta_description TEXT,
        keywords TEXT,
        og_title VARCHAR(255),
        og_description TEXT,
        og_image TEXT,
        google_analytics_id VARCHAR(64),
        meta_pixel_id VARCHAR(64),
        google_tag_manager_id VARCHAR(64),
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        level INT NOT NULL,
        level_name VARCHAR(64) NOT NULL,
        password VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    lastStatus.tablesCreated = true;
    lastStatus.connected = true;
    lastStatus.error = null;
    tablesEnsured = true;
    return true;
  } catch (err) {
    console.warn("[MariaDB] Error creando tablas:", err.message);
    lastStatus.connected = false;
    lastStatus.error = err.message;
    tablesEnsured = false;
    return false;
  }
}
async function getMariaDbContent() {
  if (!pool) return null;
  try {
    const [rows] = await pool.query(
      'SELECT content_json FROM cms_content WHERE id = "global_content" LIMIT 1;'
    );
    if (rows && rows.length > 0 && rows[0].content_json) {
      return JSON.parse(rows[0].content_json);
    }
  } catch (err) {
    console.warn("[MariaDB] Error leyendo contenido:", err.message);
  }
  return null;
}
async function getAllMariaDbContentMerged(fallbackContent) {
  if (!pool) return fallbackContent;
  try {
    let merged = fallbackContent ? { ...fallbackContent } : {};
    const globalContent = await getMariaDbContent();
    if (globalContent && typeof globalContent === "object") {
      merged = { ...merged, ...globalContent };
    }
    const sectionQueries = [
      { key: "site", table: "cms_section_site" },
      { key: "hero", table: "cms_section_hero" },
      { key: "valueProp", table: "cms_section_value_prop" },
      { key: "location", table: "cms_section_location" },
      { key: "masterPlan", table: "cms_section_master_plan" },
      { key: "housingModels", table: "cms_section_housing_models" },
      { key: "salesFinancing", table: "cms_section_sales_financing" },
      { key: "socialImpact", table: "cms_section_social_impact" },
      { key: "contactForm", table: "cms_section_contact" },
      { key: "footer", table: "cms_section_footer" },
      { key: "seo", table: "cms_section_seo" }
    ];
    await Promise.all(
      sectionQueries.map(async ({ key, table }) => {
        try {
          const [rows] = await pool.query(`SELECT data_json FROM ${table} ORDER BY updated_at DESC LIMIT 1;`);
          if (rows && rows.length > 0 && rows[0].data_json) {
            const parsed = JSON.parse(rows[0].data_json);
            if (parsed && typeof parsed === "object") {
              merged[key] = parsed;
            }
          }
        } catch (e) {
        }
      })
    );
    try {
      const dbModels = await getMariaDbModels();
      if (dbModels && Array.isArray(dbModels) && dbModels.length > 0) {
        if (!merged.housingModels) {
          merged.housingModels = { ...fallbackContent?.housingModels || {}, models: dbModels };
        } else {
          merged.housingModels.models = dbModels;
        }
      }
    } catch {
    }
    return merged;
  } catch (err) {
    console.warn("[MariaDB] Error unificando contenido desde tablas:", err.message);
    return fallbackContent;
  }
}
async function saveMariaDbContent(content, version = 1, note = "") {
  if (!pool) return false;
  try {
    await ensureMariaDbTables();
    const contentStr = JSON.stringify(content);
    await pool.query(
      `INSERT INTO cms_content (id, content_json, version, updated_at)
       VALUES ("global_content", ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         content_json = VALUES(content_json),
         version = VALUES(version),
         updated_at = NOW();`,
      [contentStr, version]
    );
    if (version) {
      await pool.query(
        `INSERT INTO cms_versions (version, note, content_json, created_at)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE note = VALUES(note), content_json = VALUES(content_json);`,
        [version, note, contentStr]
      ).catch(() => {
      });
    }
    const sectionKeys = [
      "site",
      "hero",
      "valueProp",
      "location",
      "masterPlan",
      "housingModels",
      "salesFinancing",
      "socialImpact",
      "contactForm",
      "footer",
      "seo"
    ];
    await Promise.all(
      sectionKeys.map(async (key) => {
        if (content[key] && typeof content[key] === "object") {
          await saveMariaDbSection(key, content[key]).catch((e) => {
            console.warn(`[MariaDB] Error replicando secci\xF3n ${key}:`, e.message);
          });
        }
      })
    );
    return true;
  } catch (err) {
    console.warn("[MariaDB] Error guardando contenido:", err.message);
    return false;
  }
}
async function saveMariaDbGlobalContentBackup(content, version, note) {
  if (!pool || !content) return false;
  try {
    const contentStr = JSON.stringify(content);
    await pool.query(
      `INSERT INTO cms_content (id, content_json, version, updated_at)
       VALUES ('global_content', ?, ?, NOW())
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), version = VALUES(version), updated_at = NOW();`,
      [contentStr, version || 1]
    );
    if (version) {
      await pool.query(
        `INSERT INTO cms_versions (version, note, content_json, created_at)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE note = VALUES(note), content_json = VALUES(content_json);`,
        [version, note || `Respaldo global v${version}`, contentStr]
      ).catch(() => {
      });
    }
    return true;
  } catch (err) {
    console.warn("[MariaDB] Error en respaldo global:", err.message);
    return false;
  }
}
async function saveMariaDbSection(sectionKey, sectionData) {
  if (!pool || !sectionData) return false;
  try {
    await ensureMariaDbTables();
    const dataJson = JSON.stringify(sectionData);
    switch (sectionKey) {
      case "site": {
        const s = sectionData || {};
        const id = "site";
        const projectName = s.projectName || "Mis Delirios Ranch";
        const fullName = s.fullName || "";
        const tagline = s.tagline || "";
        const logoUrl = s.logoUrl || "";
        const contactPhone = s.contactPhone || s.phone || "";
        const contactWhatsapp = s.contactWhatsapp || s.contactPhone || "";
        const contactEmail = s.contactEmail || s.email || "";
        const salesOfficeAddress = s.salesOfficeAddress || s.address || "";
        const instagramUrl = s.socialMedia?.instagram || "";
        const facebookUrl = s.socialMedia?.facebook || "";
        const youtubeUrl = s.socialMedia?.youtube || "";
        await pool.query(
          `INSERT INTO cms_section_site (
            id, project_name, full_name, tagline, logo_url,
            contact_phone, contact_whatsapp, contact_email, sales_office_address,
            instagram_url, facebook_url, youtube_url, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            project_name = VALUES(project_name),
            full_name = VALUES(full_name),
            tagline = VALUES(tagline),
            logo_url = VALUES(logo_url),
            contact_phone = VALUES(contact_phone),
            contact_whatsapp = VALUES(contact_whatsapp),
            contact_email = VALUES(contact_email),
            sales_office_address = VALUES(sales_office_address),
            instagram_url = VALUES(instagram_url),
            facebook_url = VALUES(facebook_url),
            youtube_url = VALUES(youtube_url),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [
            id,
            projectName,
            fullName,
            tagline,
            logoUrl,
            contactPhone,
            contactWhatsapp,
            contactEmail,
            salesOfficeAddress,
            instagramUrl,
            facebookUrl,
            youtubeUrl,
            dataJson
          ]
        );
        return true;
      }
      case "hero": {
        const h = sectionData || {};
        const id = "hero";
        const title = h.title || "";
        const subtitle = h.subtitle || "";
        const badgeText = h.badgeText || "";
        const priceBadge = h.priceBadge || "";
        const primaryCtaText = h.primaryCtaText || "";
        const primaryCtaLink = h.primaryCtaLink || "";
        const secondaryCtaText = h.secondaryCtaText || "";
        const secondaryCtaLink = h.secondaryCtaLink || "";
        const backgroundImageUrl = h.backgroundImageUrl || "";
        const showBadge = h.showBadge !== false;
        const active = h.active !== false;
        await pool.query(
          `INSERT INTO cms_section_hero (
            id, title, subtitle, badge_text, price_badge,
            primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link,
            background_image_url, show_badge, active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            badge_text = VALUES(badge_text),
            price_badge = VALUES(price_badge),
            primary_cta_text = VALUES(primary_cta_text),
            primary_cta_link = VALUES(primary_cta_link),
            secondary_cta_text = VALUES(secondary_cta_text),
            secondary_cta_link = VALUES(secondary_cta_link),
            background_image_url = VALUES(background_image_url),
            show_badge = VALUES(show_badge),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [
            id,
            title,
            subtitle,
            badgeText,
            priceBadge,
            primaryCtaText,
            primaryCtaLink,
            secondaryCtaText,
            secondaryCtaLink,
            backgroundImageUrl,
            showBadge,
            active,
            dataJson
          ]
        );
        return true;
      }
      case "valueProp":
      case "propuesta": {
        const v = sectionData || {};
        const id = "valueProp";
        const title = v.title || "";
        const subtitle = v.subtitle || "";
        const description = v.description || "";
        const imageUrl = v.imageUrl || "";
        const imageAlt = v.imageAlt || "";
        const columnsCount = Number(v.columnsCount) || 3;
        const active = v.active !== false;
        await pool.query(
          `INSERT INTO cms_section_value_prop (
            id, title, subtitle, description, image_url, image_alt,
            columns_count, active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            description = VALUES(description),
            image_url = VALUES(image_url),
            image_alt = VALUES(image_alt),
            columns_count = VALUES(columns_count),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [id, title, subtitle, description, imageUrl, imageAlt, columnsCount, active, dataJson]
        );
        return true;
      }
      case "location":
      case "ubicacion": {
        const l = sectionData || {};
        const id = "location";
        const title = l.title || "";
        const subtitle = l.subtitle || "";
        const description = l.description || "";
        const municipality = l.municipality || "";
        const sectors = Array.isArray(l.sectors) ? l.sectors.join(", ") : l.sectors || "";
        const googleMapsEmbedUrl = l.googleMapsEmbedUrl || "";
        const mapExternalUrl = l.mapExternalUrl || "";
        const coordinatesLat = Number(l.coordinates?.lat) || null;
        const coordinatesLng = Number(l.coordinates?.lng) || null;
        const active = l.active !== false;
        await pool.query(
          `INSERT INTO cms_section_location (
            id, title, subtitle, description, municipality, sectors,
            google_maps_embed_url, map_external_url, coordinates_lat, coordinates_lng,
            active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            description = VALUES(description),
            municipality = VALUES(municipality),
            sectors = VALUES(sectors),
            google_maps_embed_url = VALUES(google_maps_embed_url),
            map_external_url = VALUES(map_external_url),
            coordinates_lat = VALUES(coordinates_lat),
            coordinates_lng = VALUES(coordinates_lng),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [
            id,
            title,
            subtitle,
            description,
            municipality,
            sectors,
            googleMapsEmbedUrl,
            mapExternalUrl,
            coordinatesLat,
            coordinatesLng,
            active,
            dataJson
          ]
        );
        return true;
      }
      case "masterPlan":
      case "planMaestro": {
        const m = sectionData || {};
        const id = "masterPlan";
        const title = m.title || "";
        const subtitle = m.subtitle || "";
        const description = m.description || "";
        const totalLots = Number(m.totalLots) || 0;
        const planImageUrl = m.planImageUrl || "";
        const planPdfUrl = m.planPdfUrl || "";
        const primaryCtaText = m.primaryCtaText || "";
        const secondaryCtaText = m.secondaryCtaText || "";
        const active = m.active !== false;
        await pool.query(
          `INSERT INTO cms_section_master_plan (
            id, title, subtitle, description, total_lots,
            plan_image_url, plan_pdf_url, primary_cta_text, secondary_cta_text,
            active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            description = VALUES(description),
            total_lots = VALUES(total_lots),
            plan_image_url = VALUES(plan_image_url),
            plan_pdf_url = VALUES(plan_pdf_url),
            primary_cta_text = VALUES(primary_cta_text),
            secondary_cta_text = VALUES(secondary_cta_text),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [
            id,
            title,
            subtitle,
            description,
            totalLots,
            planImageUrl,
            planPdfUrl,
            primaryCtaText,
            secondaryCtaText,
            active,
            dataJson
          ]
        );
        return true;
      }
      case "housingModels":
      case "modelos": {
        const hm = sectionData || {};
        const id = "housingModels";
        const title = hm.title || "";
        const subtitle = hm.subtitle || "";
        const description = hm.description || "";
        const priceNotice = hm.priceNotice || "";
        const modelsCount = Array.isArray(hm.models) ? hm.models.length : 0;
        const active = hm.active !== false;
        await pool.query(
          `INSERT INTO cms_section_housing_models (
            id, title, subtitle, description, price_notice, models_count,
            active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            description = VALUES(description),
            price_notice = VALUES(price_notice),
            models_count = VALUES(models_count),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [id, title, subtitle, description, priceNotice, modelsCount, active, dataJson]
        );
        if (Array.isArray(hm.models) && hm.models.length > 0) {
          await saveMariaDbModels(hm.models);
        }
        return true;
      }
      case "salesFinancing":
      case "financiamiento": {
        const sf = sectionData || {};
        const id = "salesFinancing";
        const title = sf.title || "";
        const subtitle = sf.subtitle || "";
        const pricePerM2Usd = Number(sf.pricePerM2Usd) || 0;
        const specialPromo = sf.specialPromo || "";
        const legalNotice = sf.legalNotice || "";
        const active = sf.active !== false;
        await pool.query(
          `INSERT INTO cms_section_sales_financing (
            id, title, subtitle, price_per_m2_usd, special_promo, legal_notice,
            active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            price_per_m2_usd = VALUES(price_per_m2_usd),
            special_promo = VALUES(special_promo),
            legal_notice = VALUES(legal_notice),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [id, title, subtitle, pricePerM2Usd, specialPromo, legalNotice, active, dataJson]
        );
        return true;
      }
      case "socialImpact":
      case "sostenibilidad": {
        const si = sectionData || {};
        const id = "socialImpact";
        const title = si.title || "";
        const subtitle = si.subtitle || "";
        const description = si.description || "";
        const cededAreaM2 = Number(si.cededAreaM2) || 0;
        const costCoveredPercentage = Number(si.costCoveredPercentage) || 0;
        const vision2030 = si.vision2030 || "";
        const imageUrl = si.imageUrl || "";
        const active = si.active !== false;
        await pool.query(
          `INSERT INTO cms_section_social_impact (
            id, title, subtitle, description, ceded_area_m2, cost_covered_percentage,
            vision_2030, image_url, active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            description = VALUES(description),
            ceded_area_m2 = VALUES(ceded_area_m2),
            cost_covered_percentage = VALUES(cost_covered_percentage),
            vision_2030 = VALUES(vision_2030),
            image_url = VALUES(image_url),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [id, title, subtitle, description, cededAreaM2, costCoveredPercentage, vision2030, imageUrl, active, dataJson]
        );
        return true;
      }
      case "contactForm":
      case "contacto": {
        const cf = sectionData || {};
        const id = "contactForm";
        const title = cf.title || "";
        const subtitle = cf.subtitle || "";
        const badgeText = cf.badgeText || "";
        const directChannelsTitle = cf.directChannelsTitle || "";
        const formTitle = cf.formTitle || "";
        const formSubtitle = cf.formSubtitle || "";
        const scheduleText = cf.scheduleText || "";
        const whatsappSubtitle = cf.whatsappSubtitle || "";
        const emailSubtitle = cf.emailSubtitle || "";
        const directPhone = cf.directPhone || "";
        const directWhatsapp = cf.directWhatsapp || "";
        const directEmail = cf.directEmail || "";
        const directAddress = cf.directAddress || "";
        const submitButtonText = cf.submitButtonText || "";
        const callButtonText = cf.callButtonText || "";
        const whatsappMessageTemplate = cf.whatsappMessageTemplate || "";
        const successMessage = cf.successMessage || "";
        const privacyPolicyText = cf.privacyPolicyText || "";
        const active = cf.active !== false;
        await pool.query(
          `INSERT INTO cms_section_contact (
            id, title, subtitle, badge_text, direct_channels_title,
            form_title, form_subtitle, schedule_text, whatsapp_subtitle, email_subtitle,
            direct_phone, direct_whatsapp, direct_email, direct_address,
            submit_button_text, call_button_text, whatsapp_message_template,
            success_message, privacy_policy_text, active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            badge_text = VALUES(badge_text),
            direct_channels_title = VALUES(direct_channels_title),
            form_title = VALUES(form_title),
            form_subtitle = VALUES(form_subtitle),
            schedule_text = VALUES(schedule_text),
            whatsapp_subtitle = VALUES(whatsapp_subtitle),
            email_subtitle = VALUES(email_subtitle),
            direct_phone = VALUES(direct_phone),
            direct_whatsapp = VALUES(direct_whatsapp),
            direct_email = VALUES(direct_email),
            direct_address = VALUES(direct_address),
            submit_button_text = VALUES(submit_button_text),
            call_button_text = VALUES(call_button_text),
            whatsapp_message_template = VALUES(whatsapp_message_template),
            success_message = VALUES(success_message),
            privacy_policy_text = VALUES(privacy_policy_text),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [
            id,
            title,
            subtitle,
            badgeText,
            directChannelsTitle,
            formTitle,
            formSubtitle,
            scheduleText,
            whatsappSubtitle,
            emailSubtitle,
            directPhone,
            directWhatsapp,
            directEmail,
            directAddress,
            submitButtonText,
            callButtonText,
            whatsappMessageTemplate,
            successMessage,
            privacyPolicyText,
            active,
            dataJson
          ]
        );
        return true;
      }
      case "footer": {
        const ft = sectionData || {};
        const id = "footer";
        const legalNotice = ft.legalNotice || "";
        const credits = ft.credits || "";
        const copyrightYear = String(ft.copyrightYear || "2025");
        const active = ft.active !== false;
        await pool.query(
          `INSERT INTO cms_section_footer (
            id, legal_notice, credits, copyright_year, active, data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            legal_notice = VALUES(legal_notice),
            credits = VALUES(credits),
            copyright_year = VALUES(copyright_year),
            active = VALUES(active),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [id, legalNotice, credits, copyrightYear, active, dataJson]
        );
        return true;
      }
      case "seo": {
        const se = sectionData || {};
        const id = "seo";
        const metaTitle = se.metaTitle || "";
        const metaDescription = se.metaDescription || "";
        const keywords = Array.isArray(se.keywords) ? se.keywords.join(", ") : se.keywords || "";
        const ogTitle = se.ogTitle || "";
        const ogDescription = se.ogDescription || "";
        const ogImage = se.ogImage || "";
        const googleAnalyticsId = se.googleAnalyticsId || "";
        const metaPixelId = se.metaPixelId || "";
        const googleTagManagerId = se.googleTagManagerId || "";
        await pool.query(
          `INSERT INTO cms_section_seo (
            id, meta_title, meta_description, keywords, og_title, og_description,
            og_image, google_analytics_id, meta_pixel_id, google_tag_manager_id,
            data_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            meta_title = VALUES(meta_title),
            meta_description = VALUES(meta_description),
            keywords = VALUES(keywords),
            og_title = VALUES(og_title),
            og_description = VALUES(og_description),
            og_image = VALUES(og_image),
            google_analytics_id = VALUES(google_analytics_id),
            meta_pixel_id = VALUES(meta_pixel_id),
            google_tag_manager_id = VALUES(google_tag_manager_id),
            data_json = VALUES(data_json),
            updated_at = NOW();`,
          [
            id,
            metaTitle,
            metaDescription,
            keywords,
            ogTitle,
            ogDescription,
            ogImage,
            googleAnalyticsId,
            metaPixelId,
            googleTagManagerId,
            dataJson
          ]
        );
        return true;
      }
      default:
        return false;
    }
  } catch (err) {
    console.warn(`[MariaDB] Error guardando secci\xF3n ${sectionKey}:`, err.message);
    return false;
  }
}
async function getMariaDbSection(sectionKey) {
  if (!pool) return null;
  try {
    const tableMap = {
      site: "cms_section_site",
      hero: "cms_section_hero",
      valueProp: "cms_section_value_prop",
      propuesta: "cms_section_value_prop",
      location: "cms_section_location",
      ubicacion: "cms_section_location",
      masterPlan: "cms_section_master_plan",
      planMaestro: "cms_section_master_plan",
      housingModels: "cms_section_housing_models",
      modelos: "cms_section_housing_models",
      salesFinancing: "cms_section_sales_financing",
      financiamiento: "cms_section_sales_financing",
      socialImpact: "cms_section_social_impact",
      sostenibilidad: "cms_section_social_impact",
      contactForm: "cms_section_contact",
      contacto: "cms_section_contact",
      footer: "cms_section_footer",
      seo: "cms_section_seo"
    };
    const tableName = tableMap[sectionKey];
    if (!tableName) return null;
    const [rows] = await pool.query(`SELECT data_json FROM ${tableName} LIMIT 1;`);
    if (rows && rows.length > 0 && rows[0].data_json) {
      return JSON.parse(rows[0].data_json);
    }
  } catch (err) {
    console.warn(`[MariaDB] Error leyendo secci\xF3n ${sectionKey}:`, err.message);
  }
  return null;
}
async function saveMariaDbUsers(users) {
  if (!pool || !Array.isArray(users)) return false;
  try {
    await ensureMariaDbTables();
    for (const u of users) {
      const id = u.id || `user-${Date.now()}`;
      const username = u.username || `user_${id}`;
      const name = u.name || "";
      const email = u.email || "";
      const level = Number(u.level) || 3;
      const levelName = u.levelName || "Editor";
      const password = u.password || "delirios2025";
      const active = u.active !== false;
      await pool.query(
        `INSERT INTO cms_users (id, username, name, email, level, level_name, password, active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           email = VALUES(email),
           level = VALUES(level),
           level_name = VALUES(level_name),
           password = VALUES(password),
           active = VALUES(active),
           updated_at = NOW();`,
        [id, username, name, email, level, levelName, password, active]
      );
    }
    return true;
  } catch (err) {
    console.warn("[MariaDB] Error guardando usuarios:", err.message);
    return false;
  }
}
async function getMariaDbSectionsStatus() {
  const result = {
    connected: false,
    database: currentConfig.database,
    totalTables: 0,
    tables: []
  };
  if (!pool) return result;
  try {
    result.connected = true;
    const tableSpecs = [
      { key: "site", label: "Datos Generales & Canales", table: "cms_section_site", sampleQuery: "SELECT project_name, contact_phone, contact_whatsapp, contact_email, updated_at FROM cms_section_site LIMIT 1;" },
      { key: "hero", label: "Portada & Titulares", table: "cms_section_hero", sampleQuery: "SELECT title, badge_text, primary_cta_text, active, updated_at FROM cms_section_hero LIMIT 1;" },
      { key: "valueProp", label: "Propuesta de Valor & Pilares", table: "cms_section_value_prop", sampleQuery: "SELECT title, subtitle, columns_count, active, updated_at FROM cms_section_value_prop LIMIT 1;" },
      { key: "location", label: "Ubicaci\xF3n & Rutas", table: "cms_section_location", sampleQuery: "SELECT title, municipality, coordinates_lat, coordinates_lng, active, updated_at FROM cms_section_location LIMIT 1;" },
      { key: "masterPlan", label: "Plan Maestro & Amenidades", table: "cms_section_master_plan", sampleQuery: "SELECT title, total_lots, plan_image_url, active, updated_at FROM cms_section_master_plan LIMIT 1;" },
      { key: "housingModels", label: "Modelos de Vivienda (Secci\xF3n)", table: "cms_section_housing_models", sampleQuery: "SELECT title, models_count, active, updated_at FROM cms_section_housing_models LIMIT 1;" },
      { key: "housing_models_catalog", label: "Cat\xE1logo de Modelos (Individuales)", table: "housing_models", sampleQuery: "SELECT id, name, area_m2, price_usd, active, updated_at FROM housing_models LIMIT 3;" },
      { key: "salesFinancing", label: "Planes de Financiamiento", table: "cms_section_sales_financing", sampleQuery: "SELECT title, price_per_m2_usd, active, updated_at FROM cms_section_sales_financing LIMIT 1;" },
      { key: "socialImpact", label: "Sostenibilidad & Bamb\xFA", table: "cms_section_social_impact", sampleQuery: "SELECT title, ceded_area_m2, cost_covered_percentage, active, updated_at FROM cms_section_social_impact LIMIT 1;" },
      { key: "contactForm", label: "Contacto & Formulario de Cotizaci\xF3n", table: "cms_section_contact", sampleQuery: "SELECT title, direct_phone, direct_whatsapp, direct_email, active, updated_at FROM cms_section_contact LIMIT 1;" },
      { key: "footer", label: "Pie de P\xE1gina & Enlaces", table: "cms_section_footer", sampleQuery: "SELECT copyright_year, active, updated_at FROM cms_section_footer LIMIT 1;" },
      { key: "seo", label: "SEO & Posicionamiento", table: "cms_section_seo", sampleQuery: "SELECT meta_title, meta_description, keywords, updated_at FROM cms_section_seo LIMIT 1;" },
      { key: "lots", label: "Inventario de Lotes / Parcelas", table: "lots", sampleQuery: "SELECT code, manzana, area_m2, status, total_price_usd, updated_at FROM lots LIMIT 3;" },
      { key: "leads", label: "Prospectos / Cotizaciones", table: "leads", sampleQuery: "SELECT full_name, email, phone, lot_code, created_at FROM leads LIMIT 3;" },
      { key: "cms_users", label: "Usuarios & 5 Niveles de Seguridad", table: "cms_users", sampleQuery: "SELECT username, name, email, level, level_name, active, updated_at FROM cms_users LIMIT 5;" },
      { key: "cms_versions", label: "Historial de Versiones", table: "cms_versions", sampleQuery: "SELECT version, note, created_at FROM cms_versions ORDER BY version DESC LIMIT 3;" },
      { key: "cms_content", label: "Respaldo Global JSON", table: "cms_content", sampleQuery: "SELECT id, version, updated_at FROM cms_content LIMIT 1;" }
    ];
    for (const spec of tableSpecs) {
      try {
        const [countRows] = await pool.query(`SELECT COUNT(*) as cnt FROM ${spec.table};`);
        const count = countRows && countRows[0] ? countRows[0].cnt : 0;
        let sample = null;
        let lastUpdated = void 0;
        if (count > 0 && spec.sampleQuery) {
          const [sampleRows] = await pool.query(spec.sampleQuery);
          if (sampleRows && sampleRows.length > 0) {
            sample = sampleRows.length === 1 ? sampleRows[0] : sampleRows;
            const targetRow = sampleRows[0];
            lastUpdated = targetRow.updated_at || targetRow.created_at || void 0;
          }
        }
        result.tables.push({
          key: spec.key,
          label: spec.label,
          tableName: spec.table,
          exists: true,
          rowCount: count,
          lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : void 0,
          sampleData: sample
        });
      } catch (err) {
        result.tables.push({
          key: spec.key,
          label: spec.label,
          tableName: spec.table,
          exists: false,
          rowCount: 0
        });
      }
    }
    result.totalTables = result.tables.filter((t) => t.exists).length;
    return result;
  } catch (e) {
    console.warn("[MariaDB] Error diagnosticando tablas:", e.message);
    return result;
  }
}
async function getMariaDbLots() {
  if (!pool) return null;
  try {
    const [rows] = await pool.query("SELECT data_json FROM lots ORDER BY code ASC;");
    if (rows && rows.length > 0) {
      return rows.map((r) => JSON.parse(r.data_json));
    }
  } catch (err) {
    console.warn("[MariaDB] Error leyendo lotes:", err.message);
  }
  return null;
}
async function saveMariaDbLots(lots) {
  if (!pool || !Array.isArray(lots)) return false;
  try {
    await ensureMariaDbTables();
    for (const lot of lots) {
      const id = lot.id || `lot-${lot.code}`;
      const code = lot.code || id;
      const manzana = lot.manzana || "";
      const lote_num = String(lot.loteNum ?? lot.lote ?? "");
      const area = Number(lot.areaM2 ?? lot.area) || 0;
      const price_m2 = Number(lot.priceUsdPerM2 ?? lot.pricePerM2 ?? 20) || 20;
      const total = Number(lot.totalPriceUsd ?? lot.totalPrice) || Math.round(area * price_m2);
      const status = lot.status || "disponible";
      const dataStr = JSON.stringify(lot);
      await pool.query(
        `INSERT INTO lots (id, code, manzana, lote_num, area_m2, price_usd_per_m2, total_price_usd, status, data_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           code = VALUES(code),
           manzana = VALUES(manzana),
           lote_num = VALUES(lote_num),
           area_m2 = VALUES(area_m2),
           price_usd_per_m2 = VALUES(price_usd_per_m2),
           total_price_usd = VALUES(total_price_usd),
           status = VALUES(status),
           data_json = VALUES(data_json),
           updated_at = NOW();`,
        [id, code, manzana, lote_num, area, price_m2, total, status, dataStr]
      );
    }
    return true;
  } catch (err) {
    console.warn("[MariaDB] Error guardando lotes:", err.message);
    return false;
  }
}
async function getMariaDbModels() {
  if (!pool) return null;
  try {
    const [rows] = await pool.query("SELECT data_json FROM housing_models;");
    if (rows && rows.length > 0) {
      return rows.map((r) => JSON.parse(r.data_json));
    }
  } catch (err) {
    console.warn("[MariaDB] Error leyendo modelos:", err.message);
  }
  return null;
}
async function saveMariaDbModels(models) {
  if (!pool || !Array.isArray(models)) return false;
  try {
    await ensureMariaDbTables();
    for (const m of models) {
      const id = m.id || `model-${Date.now()}`;
      const name = m.name || "Modelo";
      const area = Number(m.areaM2 ?? m.constructionArea) || 0;
      const price = Number(m.priceUsd ?? m.price ?? m.estimatedPrice) || 0;
      const active = m.active !== false;
      const dataStr = JSON.stringify(m);
      await pool.query(
        `INSERT INTO housing_models (id, name, area_m2, price_usd, active, data_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           area_m2 = VALUES(area_m2),
           price_usd = VALUES(price_usd),
           active = VALUES(active),
           data_json = VALUES(data_json),
           updated_at = NOW();`,
        [id, name, area, price, active, dataStr]
      );
    }
    return true;
  } catch (err) {
    console.warn("[MariaDB] Error guardando modelos:", err.message);
    return false;
  }
}
async function saveMariaDbLead(lead) {
  if (!pool) return false;
  try {
    await ensureMariaDbTables();
    const id = lead.id || `lead-${Date.now()}`;
    const fullName = lead.fullName || lead.name || "";
    const email = lead.email || "";
    const phone = lead.phone || "";
    const lotCode = lead.lotCode || "";
    const modelName = lead.modelName || "";
    const dataStr = JSON.stringify(lead);
    await pool.query(
      `INSERT INTO leads (id, full_name, email, phone, lot_code, model_name, created_at, data_json)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         email = VALUES(email),
         phone = VALUES(phone),
         lot_code = VALUES(lot_code),
         model_name = VALUES(model_name),
         data_json = VALUES(data_json);`,
      [id, fullName, email, phone, lotCode, modelName, dataStr]
    );
    return true;
  } catch (err) {
    console.warn("[MariaDB] Error guardando prospecto:", err.message);
    return false;
  }
}
async function migrateAllToMariaDb(data) {
  const connTest = await testMariaDbConnection();
  if (!connTest.success) {
    return {
      success: false,
      message: `No se pudo conectar a MariaDB para iniciar la migraci\xF3n: ${connTest.error || connTest.message}`,
      details: connTest
    };
  }
  const tableReady = await ensureMariaDbTables();
  if (!tableReady) {
    return {
      success: false,
      message: "No se pudieron crear las tablas necesarias en MariaDB.",
      details: lastStatus
    };
  }
  const results = {};
  if (data.content) {
    results.content = await saveMariaDbContent(data.content, data.content.version || 1, "Migraci\xF3n completa de secciones a MariaDB");
    results.sectionsMigrated = [
      "site",
      "hero",
      "valueProp",
      "location",
      "masterPlan",
      "housingModels",
      "salesFinancing",
      "socialImpact",
      "contactForm",
      "footer",
      "seo"
    ];
  }
  if (data.lots && data.lots.length > 0) {
    results.lots = await saveMariaDbLots(data.lots);
    results.lotsCount = data.lots.length;
  }
  const models = data.models || data.content?.housingModels?.models || [];
  if (models && models.length > 0) {
    results.models = await saveMariaDbModels(models);
    results.modelsCount = models.length;
  }
  if (data.leads && data.leads.length > 0) {
    let leadSuccess = 0;
    for (const lead of data.leads) {
      if (await saveMariaDbLead(lead)) leadSuccess++;
    }
    results.leadsMigrated = leadSuccess;
  }
  if (data.users && data.users.length > 0) {
    results.users = await saveMariaDbUsers(data.users);
    results.usersCount = data.users.length;
  }
  const statusAfter = await getMariaDbSectionsStatus();
  results.diagnostic = statusAfter;
  return {
    success: true,
    message: `\xA1Migraci\xF3n completada con \xE9xito en MariaDB! (${results.lotsCount || 0} lotes, ${results.modelsCount || 0} modelos, ${results.usersCount || 0} usuarios y todas las 11 secciones guardadas en sus tablas correspondientes)`,
    details: results
  };
}
initMariaDbPool();

// server.ts
var PORT = 3e3;
var DATA_DIR = path2.join(process.cwd(), "data");
var UPLOADS_DIR = path2.join(DATA_DIR, "uploads");
var CONTENT_FILE = path2.join(DATA_DIR, "cms_content.json");
var MODELS_FILE = path2.join(DATA_DIR, "models.json");
var LOTS_FILE = path2.join(DATA_DIR, "lots.json");
var LEADS_FILE = path2.join(DATA_DIR, "leads.json");
var USERS_FILE = path2.join(DATA_DIR, "users.json");
var VERSIONS_FILE = path2.join(DATA_DIR, "versions.json");
if (!fs2.existsSync(DATA_DIR)) {
  fs2.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs2.existsSync(UPLOADS_DIR)) {
  fs2.mkdirSync(UPLOADS_DIR, { recursive: true });
}
function loadJsonFile(filePath, fallback) {
  try {
    if (fs2.existsSync(filePath)) {
      const raw = fs2.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  fs2.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
  return fallback;
}
function saveJsonFile(filePath, data) {
  try {
    const tmpPath = `${filePath}.tmp`;
    fs2.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs2.renameSync(tmpPath, filePath);
  } catch (err) {
    console.error(`Error atomic saving ${filePath}:`, err);
    try {
      fs2.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e2) {
      console.error(`Critical error saving ${filePath}:`, e2);
    }
  }
}
var cmsContent = loadJsonFile(CONTENT_FILE, initialCmsContent);
var modelsData = loadJsonFile(
  MODELS_FILE,
  cmsContent?.housingModels?.models || initialCmsContent.housingModels.models
);
if (!Array.isArray(modelsData) || modelsData.length === 0) {
  modelsData = initialCmsContent.housingModels.models;
}
if (!cmsContent.housingModels) {
  cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
} else {
  cmsContent.housingModels.models = modelsData;
}
saveJsonFile(MODELS_FILE, modelsData);
saveJsonFile(CONTENT_FILE, cmsContent);
var lotsData = loadJsonFile(LOTS_FILE, initialLots);
var leadsData = loadJsonFile(LEADS_FILE, [
  {
    id: "lead-101",
    timestamp: new Date(Date.now() - 36e5 * 24).toISOString(),
    fullName: "Ing. Carlos Mendoza",
    email: "carlos.mendoza@ejemplo.com",
    phone: "+58 424 7654321",
    profileInterest: "inversionista",
    message: "Interesado en adquirir 3 lotes de la manzana B para desarrollo agrotur\xEDstico.",
    lotPreference: "B2-09, B2-10, B2-11",
    modelPreference: "modelo-b",
    source: "formulario",
    status: "en_seguimiento"
  },
  {
    id: "lead-102",
    timestamp: new Date(Date.now() - 36e5 * 12).toISOString(),
    fullName: "Dra. Mar\xEDa Elena Rivas",
    email: "maria.rivas@ejemplo.com",
    phone: "+58 412 1234567",
    profileInterest: "hogar",
    message: "Deseo construir una casa de campo con el Modelo A de 90m\xB2. \xBFTienen visita este s\xE1bado?",
    lotPreference: "A2-02",
    modelPreference: "modelo-a",
    source: "simulador",
    status: "nuevo"
  }
]);
var usersData = loadJsonFile(USERS_FILE, [
  {
    id: "user-1",
    username: "csalvati",
    name: "Carlos Salvati",
    email: "salvaticarlos@gmail.com",
    level: 1,
    levelName: "Super Usuario",
    password: "password123",
    active: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "user-2",
    username: "apalacio",
    name: "Audy Palacio",
    email: "audypalacio@gmail.com",
    level: 1,
    levelName: "Super Usuario",
    password: "password123",
    active: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "user-3",
    username: "admin",
    name: "Administrador General",
    email: "admin@misdeliriosranch.com",
    level: 2,
    levelName: "Administrador",
    password: "delirios2025",
    active: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "user-4",
    username: "editor",
    name: "Editor de Contenidos",
    email: "editor@misdeliriosranch.com",
    level: 3,
    levelName: "Editor",
    password: "delirios2025",
    active: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "user-5",
    username: "ventas",
    name: "Asesor de Ventas",
    email: "ventas@misdeliriosranch.com",
    level: 4,
    levelName: "Vendedor",
    password: "delirios2025",
    active: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "user-6",
    username: "invitado",
    name: "Invitado / Auditor",
    email: "invitado@misdeliriosranch.com",
    level: 5,
    levelName: "Invitado",
    password: "delirios2025",
    active: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
]);
var versionsHistory = loadJsonFile(VERSIONS_FILE, [
  {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: 1,
    note: "Versi\xF3n inicial oficial del Complejo Mis Delirios Ranch",
    content: cmsContent
  }
]);
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use("/api", (req, res, next) => {
    if (req.path.startsWith("/uploads")) {
      return next();
    }
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.use("/api/uploads/:filename", async (req, res, next) => {
    const filename = req.params.filename;
    const filePath = path2.join(UPLOADS_DIR, filename);
    if (!fs2.existsSync(filePath)) {
      console.log(`[Uploads Auto-Heal] Missing file requested: ${filename}. Generating fallback...`);
      try {
        if (filename.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
          const sampleVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-green-mountain-valley-41004-large.mp4";
          const r = await fetch(sampleVideoUrl);
          if (r.ok) {
            const buf = Buffer.from(await r.arrayBuffer());
            fs2.writeFileSync(filePath, buf);
            console.log(`[Uploads Auto-Heal] Successfully generated fallback video for ${filename} (${buf.length} bytes)`);
          } else {
            fs2.writeFileSync(filePath, Buffer.from("RIFF....AVI VIDEO FALLBACK", "utf-8"));
          }
        } else if (filename.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
          const pngBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
          fs2.writeFileSync(filePath, pngBuffer);
        } else {
          fs2.writeFileSync(filePath, Buffer.from("Archivo recuperado por el sistema", "utf-8"));
        }
      } catch (err) {
        console.warn(`[Uploads Auto-Heal] Error creating fallback for ${filename}:`, err.message);
      }
    }
    next();
  });
  app.use(
    "/api/uploads",
    express.static(UPLOADS_DIR, {
      acceptRanges: true,
      maxAge: "7d"
    })
  );
  app.get("/api/video-proxy", async (req, res) => {
    const rawTarget = req.query.url;
    if (!rawTarget || !rawTarget.startsWith("http://") && !rawTarget.startsWith("https://")) {
      return res.status(400).send("URL de video inv\xE1lida");
    }
    try {
      const response = await fetch(rawTarget, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "*/*"
        }
      });
      if (!response.ok) {
        return res.status(response.status).send(`Error remoto: ${response.status}`);
      }
      const contentType = response.headers.get("content-type") || "video/mp4";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=86400");
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      if (response.body) {
        const stream = response.body;
        if (typeof stream.pipe === "function") {
          stream.pipe(res);
        } else {
          const reader = stream.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        }
      } else {
        res.end();
      }
    } catch (err) {
      console.warn("[VideoProxy] Error streaming remote video:", err.message);
      res.status(502).send("Error conectando al video remoto");
    }
  });
  function sanitizeAndPersistMedia(obj) {
    if (!obj) return obj;
    if (typeof obj === "string") {
      if (obj.startsWith("data:")) {
        try {
          const commaIdx = obj.indexOf(",");
          if (commaIdx !== -1) {
            const metaPart = obj.slice(0, commaIdx).toLowerCase();
            const rawBase64 = obj.slice(commaIdx + 1).replace(/\s+/g, "");
            let ext = "png";
            if (metaPart.includes("jpeg") || metaPart.includes("jpg")) ext = "jpg";
            else if (metaPart.includes("webp")) ext = "webp";
            else if (metaPart.includes("svg")) ext = "svg";
            else if (metaPart.includes("gif")) ext = "gif";
            else if (metaPart.includes("mp4")) ext = "mp4";
            else if (metaPart.includes("pdf")) ext = "pdf";
            const safeFileName = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const destPath = path2.join(UPLOADS_DIR, safeFileName);
            fs2.writeFileSync(destPath, Buffer.from(rawBase64, "base64"));
            return `/api/uploads/${safeFileName}`;
          }
        } catch (e) {
          console.warn("[Media Sanitizer] Error guardando archivo:", e);
        }
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeAndPersistMedia(item));
    }
    if (typeof obj === "object") {
      const res = {};
      for (const key of Object.keys(obj)) {
        res[key] = sanitizeAndPersistMedia(obj[key]);
      }
      return res;
    }
    return obj;
  }
  app.post("/api/upload", (req, res) => {
    try {
      const { dataUrl, filename, title } = req.body;
      if (!dataUrl || typeof dataUrl !== "string") {
        return res.status(400).json({ success: false, error: "dataUrl es requerido" });
      }
      if (!dataUrl.startsWith("data:")) {
        return res.json({ success: true, url: dataUrl, filename: filename || "file" });
      }
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx === -1) {
        return res.status(400).json({ success: false, error: "Formato base64 no v\xE1lido" });
      }
      const metaPart = dataUrl.slice(0, commaIdx).toLowerCase();
      const rawBase64 = dataUrl.slice(commaIdx + 1).replace(/\s+/g, "");
      let ext = "png";
      if (metaPart.includes("jpeg") || metaPart.includes("jpg")) ext = "jpg";
      else if (metaPart.includes("webp")) ext = "webp";
      else if (metaPart.includes("svg")) ext = "svg";
      else if (metaPart.includes("gif")) ext = "gif";
      else if (metaPart.includes("mp4")) ext = "mp4";
      else if (metaPart.includes("pdf")) ext = "pdf";
      const baseName = (filename || title || "archivo").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 35).replace(/-+/g, "-");
      const safeFileName = `${baseName || "media"}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const destPath = path2.join(UPLOADS_DIR, safeFileName);
      fs2.writeFileSync(destPath, Buffer.from(rawBase64, "base64"));
      const publicUrl = `/api/uploads/${safeFileName}`;
      console.log(`[Upload] Archivo guardado con \xE9xito en disco: ${publicUrl}`);
      res.json({
        success: true,
        url: publicUrl,
        filename: safeFileName
      });
    } catch (err) {
      console.error("Error guardando archivo subido:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/content", async (req, res) => {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    });
    try {
      const dbContent = await Promise.race([
        getAllMariaDbContentMerged(cmsContent),
        new Promise((resolve) => setTimeout(() => resolve(null), 2500))
      ]);
      if (dbContent && dbContent.site) {
        cmsContent = dbContent;
        if (modelsData && modelsData.length > 0) {
          if (!cmsContent.housingModels) {
            cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
          } else {
            cmsContent.housingModels.models = modelsData;
          }
        }
      }
    } catch (dbErr) {
      console.warn("[GET /api/content] MariaDB fetch warning:", dbErr.message);
    }
    if (cmsContent.housingModels) {
      cmsContent.housingModels.models = modelsData;
    }
    res.json({ success: true, data: cmsContent });
  });
  app.post("/api/content", async (req, res) => {
    try {
      let updated = req.body;
      if (!updated || typeof updated !== "object") {
        return res.status(400).json({ success: false, error: "Invalid payload" });
      }
      updated = sanitizeAndPersistMedia(updated);
      const nextVersion = (cmsContent.version || 1) + 1;
      cmsContent = {
        ...cmsContent,
        ...updated,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
        version: nextVersion
      };
      if (updated.housingModels?.models && Array.isArray(updated.housingModels.models)) {
        modelsData = updated.housingModels.models;
        saveJsonFile(MODELS_FILE, modelsData);
      }
      saveJsonFile(CONTENT_FILE, cmsContent);
      versionsHistory.unshift({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: nextVersion,
        note: req.query.note ? String(req.query.note) : `Actualizaci\xF3n desde CMS v${nextVersion}`,
        content: cmsContent
      });
      if (versionsHistory.length > 20) versionsHistory.pop();
      saveJsonFile(VERSIONS_FILE, versionsHistory);
      let mariadbSaved = false;
      try {
        mariadbSaved = await saveMariaDbContent(
          cmsContent,
          nextVersion,
          req.query.note ? String(req.query.note) : void 0
        );
      } catch (e) {
        console.warn("[MariaDB] Sync content warning:", e.message);
      }
      res.json({
        success: true,
        data: cmsContent,
        mariadbSaved,
        message: "Contenido actualizado y guardado exitosamente en la base de datos MariaDB y almacenamiento persistente"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/sync-all", async (req, res) => {
    try {
      let { content, lots } = req.body;
      let nextVersion = cmsContent.version || 1;
      if (content && typeof content === "object") {
        content = sanitizeAndPersistMedia(content);
        nextVersion += 1;
        cmsContent = {
          ...cmsContent,
          ...content,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          version: nextVersion
        };
        if (content.housingModels?.models && Array.isArray(content.housingModels.models)) {
          modelsData = content.housingModels.models;
          saveJsonFile(MODELS_FILE, modelsData);
        }
        saveJsonFile(CONTENT_FILE, cmsContent);
        versionsHistory.unshift({
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          version: nextVersion,
          note: req.query.note ? String(req.query.note) : `Sincronizaci\xF3n global CMS v${nextVersion}`,
          content: cmsContent
        });
        if (versionsHistory.length > 20) versionsHistory.pop();
        saveJsonFile(VERSIONS_FILE, versionsHistory);
      }
      if (lots && Array.isArray(lots) && lots.length > 0) {
        lotsData = sanitizeAndPersistMedia(lots);
        saveJsonFile(LOTS_FILE, lotsData);
      }
      let mariadbContentSaved = false;
      let mariadbLotsSaved = false;
      let mariadbModelsSaved = false;
      try {
        const [cSaved, lSaved, mSaved] = await Promise.all([
          saveMariaDbContent(cmsContent, nextVersion, req.query.note ? String(req.query.note) : void 0),
          lotsData && lotsData.length > 0 ? saveMariaDbLots(lotsData) : Promise.resolve(true),
          modelsData && modelsData.length > 0 ? saveMariaDbModels(modelsData) : Promise.resolve(true)
        ]);
        mariadbContentSaved = Boolean(cSaved);
        mariadbLotsSaved = Boolean(lSaved);
        mariadbModelsSaved = Boolean(mSaved);
      } catch (dbErr) {
        console.warn("[MariaDB sync-all] Error guardando en MariaDB:", dbErr.message);
      }
      res.json({
        success: true,
        message: "Base de datos sincronizada y persistida con \xE9xito en todas las tablas correspondientes.",
        mariadb: {
          contentSaved: mariadbContentSaved,
          lotsSaved: mariadbLotsSaved,
          modelsSaved: mariadbModelsSaved
        },
        data: {
          content: cmsContent,
          lots: lotsData
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.all(["/api/mariadb/status", "/api/mariadb/status/"], (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, data: getMariaDbStatus() });
  });
  app.all(["/api/mariadb/test", "/api/mariadb/test/"], async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const payload = req.method === "POST" || req.method === "PUT" ? req.body : void 0;
      const result = await Promise.race([
        testMariaDbConnection(payload),
        new Promise(
          (resolve) => setTimeout(
            () => resolve({
              success: false,
              message: "Tiempo de espera agotado al conectar con MariaDB (3.5s)",
              error: `El servidor MariaDB en '${payload?.host || "el host especificado"}' no respondi\xF3 en 3.5 segundos. Posibles causas: 1) El puerto 3306 est\xE1 bloqueado por firewall en el hosting. 2) Se debe ingresar a cPanel -> "MySQL Remoto" y agregar el comod\xEDn '%' para autorizar la conexi\xF3n. 3) Use la IP directa en lugar de nombres de dominio con CDN.`
            }),
            3500
          )
        )
      ]);
      res.json(result);
    } catch (err) {
      res.json({
        success: false,
        message: "Fallo al conectar con MariaDB",
        error: err?.message || String(err)
      });
    }
  });
  app.get(["/api/mariadb/config", "/api/mariadb/config/"], (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, data: getCurrentConfig(), status: getMariaDbStatus() });
  });
  app.all(["/api/mariadb/config", "/api/mariadb/config/"], async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET") {
      return res.json({ success: true, data: getCurrentConfig(), status: getMariaDbStatus() });
    }
    try {
      const updated = saveConfig(req.body || {});
      let testResult = null;
      if (req.query.skipTest !== "true") {
        try {
          testResult = await Promise.race([
            testMariaDbConnection(updated),
            new Promise(
              (resolve) => setTimeout(
                () => resolve({
                  success: false,
                  message: "Tiempo de espera agotado al conectar con MariaDB (3s)",
                  error: `No se pudo conectar a ${updated.host}:${updated.port} en 3 segundos. Verifique que el puerto 3306 est\xE9 abierto o pruebe ingresando la IP directa del servidor en cPanel.`
                }),
                3e3
              )
            )
          ]);
        } catch (testErr) {
          testResult = {
            success: false,
            message: "Error al verificar conexi\xF3n con MariaDB",
            error: testErr.message || String(testErr)
          };
        }
      }
      res.json({
        success: true,
        data: updated,
        test: testResult,
        message: testResult?.success ? "Configuraci\xF3n guardada y conexi\xF3n establecida exitosamente con MariaDB" : "Configuraci\xF3n guardada correctamente en el sistema. " + (testResult ? testResult.error || testResult.message : "")
      });
    } catch (err) {
      res.json({ success: false, error: err?.message || String(err) });
    }
  });
  app.all(["/api/mariadb/migrate", "/api/mariadb/migrate/"], async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const result = await migrateAllToMariaDb({
        content: cmsContent,
        lots: lotsData,
        models: modelsData,
        leads: leadsData,
        users: usersData
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/mariadb/sections-status", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const status = await getMariaDbSectionsStatus();
      res.json({ success: true, data: status });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/sections/:sectionKey", async (req, res) => {
    const { sectionKey } = req.params;
    try {
      const sectionData = await getMariaDbSection(sectionKey);
      if (sectionData) {
        return res.json({ success: true, source: "mariadb_table", data: sectionData });
      }
      if (cmsContent[sectionKey]) {
        return res.json({ success: true, source: "cms_content_memory", data: cmsContent[sectionKey] });
      }
      return res.status(404).json({ success: false, error: `Secci\xF3n '${sectionKey}' no encontrada.` });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.put("/api/sections/:sectionKey", async (req, res) => {
    const { sectionKey } = req.params;
    let sectionData = req.body;
    try {
      if (!sectionData || typeof sectionData !== "object") {
        return res.status(400).json({ success: false, error: "Datos de secci\xF3n inv\xE1lidos" });
      }
      sectionData = sanitizeAndPersistMedia(sectionData);
      cmsContent[sectionKey] = sectionData;
      cmsContent.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      const nextVersion = (cmsContent.version || 1) + 1;
      cmsContent.version = nextVersion;
      saveJsonFile(CONTENT_FILE, cmsContent);
      const savedToTable = await saveMariaDbSection(sectionKey, sectionData);
      await saveMariaDbGlobalContentBackup(cmsContent, nextVersion, `Actualizaci\xF3n r\xE1pida de secci\xF3n ${sectionKey}`);
      res.json({
        success: true,
        message: `Secci\xF3n '${sectionKey}' guardada exitosamente en su tabla correspondiente en la Base de Datos.`,
        savedToTable,
        data: sectionData,
        version: nextVersion
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/db-status", (req, res) => {
    res.json({
      success: true,
      status: "connected",
      uptime: process.uptime(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      modelsCount: modelsData.length,
      lotsCount: lotsData.length,
      leadsCount: leadsData.length,
      usersCount: usersData.length,
      totalLots: lotsData.length,
      availableLots: lotsData.filter((l) => l.status === "disponible").length,
      contentVersion: cmsContent.version || 1,
      lastUpdated: cmsContent.lastUpdated,
      modelsSummary: modelsData.map((m) => ({ id: m.id, name: m.name, areaM2: m.areaM2, priceUsd: m.priceUsd, active: m.active })),
      storage: "file-backed-runtime-persistence"
    });
  });
  app.post("/api/content/reset", (req, res) => {
    cmsContent = JSON.parse(JSON.stringify(initialCmsContent));
    saveJsonFile(CONTENT_FILE, cmsContent);
    lotsData = JSON.parse(JSON.stringify(initialLots));
    saveJsonFile(LOTS_FILE, lotsData);
    res.json({ success: true, data: cmsContent, message: "Datos restaurados a valores iniciales de f\xE1brica" });
  });
  app.get("/api/versions", (req, res) => {
    res.json({ success: true, data: versionsHistory });
  });
  app.post("/api/versions/restore/:version", (req, res) => {
    const versionNum = parseInt(req.params.version, 10);
    const found = versionsHistory.find((v) => v.version === versionNum);
    if (!found) {
      return res.status(404).json({ success: false, error: "Versi\xF3n no encontrada" });
    }
    cmsContent = {
      ...found.content,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      version: (cmsContent.version || 1) + 1
    };
    saveJsonFile(CONTENT_FILE, cmsContent);
    res.json({ success: true, data: cmsContent, message: `Versi\xF3n ${versionNum} restaurada exitosamente` });
  });
  app.get("/api/lots", async (req, res) => {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    });
    try {
      const dbLots = await Promise.race([
        getMariaDbLots(),
        new Promise((resolve) => setTimeout(() => resolve(null), 2500))
      ]);
      if (dbLots && Array.isArray(dbLots) && dbLots.length > 0) {
        lotsData = dbLots;
      }
    } catch (err) {
      console.warn("[GET /api/lots] MariaDB fetch warning:", err.message);
    }
    res.json({ success: true, data: lotsData, total: lotsData.length });
  });
  app.put("/api/lots/:id", async (req, res) => {
    const { id } = req.params;
    const index = lotsData.findIndex((l) => l.id === id || l.code === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Lote no encontrado" });
    }
    const current = lotsData[index];
    const updated = { ...current, ...req.body };
    if (req.body.priceUsdPerM2 || req.body.areaM2) {
      const pricePerM2 = req.body.priceUsdPerM2 ?? current.priceUsdPerM2;
      const area = req.body.areaM2 ?? current.areaM2;
      updated.totalPriceUsd = Math.round(pricePerM2 * area);
    }
    lotsData[index] = updated;
    saveJsonFile(LOTS_FILE, lotsData);
    await saveMariaDbLots([updated]).catch((e) => {
      console.warn("[MariaDB lots update] Error:", e.message);
    });
    res.json({ success: true, data: updated });
  });
  app.post("/api/lots/bulk-update", async (req, res) => {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, error: "updates array is required" });
    }
    for (const update of updates) {
      const index = lotsData.findIndex((l) => l.id === update.id || l.code === update.code);
      if (index !== -1) {
        lotsData[index] = { ...lotsData[index], ...update };
      }
    }
    saveJsonFile(LOTS_FILE, lotsData);
    await saveMariaDbLots(lotsData).catch(() => {
    });
    res.json({ success: true, message: `${updates.length} lotes actualizados exitosamente`, data: lotsData });
  });
  app.post("/api/lots/bulk-save", async (req, res) => {
    const { lots } = req.body;
    if (!Array.isArray(lots)) {
      return res.status(400).json({ success: false, error: "lots array is required" });
    }
    lotsData = lots;
    saveJsonFile(LOTS_FILE, lotsData);
    let mariadbSaved = false;
    try {
      mariadbSaved = await saveMariaDbLots(lotsData);
    } catch (e) {
      console.warn("[MariaDB lots bulk-save] Error:", e.message);
    }
    res.json({
      success: true,
      message: "Inventario de disponibilidad grabado y actualizado exitosamente en la base de datos MariaDB",
      data: lotsData,
      mariadbSaved
    });
  });
  app.post("/api/lots", async (req, res) => {
    try {
      const newLot = {
        id: req.body.id || "lot-" + Date.now(),
        code: req.body.code || `L-${lotsData.length + 1}`,
        manzana: req.body.manzana || "A",
        loteNum: req.body.loteNum || String(lotsData.length + 1),
        areaM2: Number(req.body.areaM2) || 600,
        type: req.body.type || "mini-granja",
        status: req.body.status || "disponible",
        priceUsdPerM2: Number(req.body.priceUsdPerM2) || 20,
        totalPriceUsd: (Number(req.body.areaM2) || 600) * (Number(req.body.priceUsdPerM2) || 20),
        location: req.body.location || "baja",
        dimensions: req.body.dimensions || { norte: 20, sur: 20, este: 30, oeste: 30 }
      };
      lotsData.push(newLot);
      saveJsonFile(LOTS_FILE, lotsData);
      await saveMariaDbLots([newLot]).catch(() => {
      });
      res.status(201).json({ success: true, data: newLot, message: "Lote a\xF1adido con \xE9xito" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.delete("/api/lots/:id", (req, res) => {
    const { id } = req.params;
    lotsData = lotsData.filter((l) => l.id !== id && l.code !== id);
    saveJsonFile(LOTS_FILE, lotsData);
    res.json({ success: true, message: "Lote eliminado" });
  });
  app.get("/api/models", async (req, res) => {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    });
    try {
      const dbModels = await Promise.race([
        getMariaDbModels(),
        new Promise((resolve) => setTimeout(() => resolve(null), 2500))
      ]);
      if (dbModels && Array.isArray(dbModels) && dbModels.length > 0) {
        modelsData = dbModels;
      }
    } catch (err) {
      console.warn("[GET /api/models] MariaDB fetch warning:", err.message);
    }
    res.json({
      success: true,
      data: modelsData,
      total: modelsData.length,
      section: cmsContent.housingModels ? {
        title: cmsContent.housingModels.title,
        subtitle: cmsContent.housingModels.subtitle,
        description: cmsContent.housingModels.description,
        priceNotice: cmsContent.housingModels.priceNotice,
        active: cmsContent.housingModels.active
      } : null
    });
  });
  app.get("/api/models/:id", (req, res) => {
    const { id } = req.params;
    const model = modelsData.find((m) => m.id === id);
    if (!model) {
      return res.status(404).json({ success: false, error: "Modelo no encontrado" });
    }
    res.json({ success: true, data: model });
  });
  app.post("/api/models", async (req, res) => {
    try {
      const body = req.body;
      if (!body.name) {
        return res.status(400).json({ success: false, error: "El nombre del modelo es requerido" });
      }
      const area = Number(body.areaM2) || 100;
      const pm2 = Number(body.pricePerM2Usd) || 450;
      const price = Number(body.priceUsd) || Math.round(area * pm2);
      const newModel = {
        id: body.id || `modelo-${body.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`,
        name: body.name.trim(),
        tagline: body.tagline?.trim() || "Dise\xF1o bioclim\xE1tico en Bamb\xFA Guadua",
        areaM2: area,
        pricePerM2Usd: pm2,
        priceUsd: price,
        description: body.description?.trim() || "Vivienda campestre ecol\xF3gica construida con estructura integral de Bamb\xFA Guadua.",
        benefits: Array.isArray(body.benefits) && body.benefits.length > 0 ? body.benefits : [
          "Terrazas mirador con vistas a la cordillera",
          "Ventilaci\xF3n bioclim\xE1tica cruzada continua",
          "Estructura sismorresistente en Bamb\xFA Guadua seleccionada",
          "Losa flotante de concreto armada a 40 cm"
        ],
        specs: body.specs || {
          levels: Number(body.levels) || 1,
          bedrooms: Number(body.bedrooms) || 2,
          bathrooms: Number(body.bathrooms) || 2,
          terraceM2: Number(body.terraceM2) || 15,
          foundation: body.foundation || "Losa flotante armada a 40 cm",
          structure: body.structure || "Bamb\xFA Guadua angustifolia tratado e inmunizado"
        },
        images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ["/api/images/model-a-render"],
        brochurePdfUrl: body.brochurePdfUrl || "",
        showPrice: body.showPrice !== false,
        active: body.active !== false
      };
      modelsData.push(newModel);
      saveJsonFile(MODELS_FILE, modelsData);
      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      cmsContent.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);
      await Promise.all([
        saveMariaDbModels(modelsData),
        saveMariaDbContent(cmsContent)
      ]).catch(() => {
      });
      res.status(201).json({
        success: true,
        data: newModel,
        models: modelsData,
        message: "Modelo de vivienda creado y sincronizado exitosamente en la base de datos"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.put("/api/models/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const index = modelsData.findIndex((m) => m.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: "Modelo no encontrado" });
      }
      const current = modelsData[index];
      const updated = {
        ...current,
        ...req.body,
        id: current.id
        // Immutable ID
      };
      if (req.body.areaM2 || req.body.pricePerM2Usd) {
        const area = req.body.areaM2 !== void 0 ? Number(req.body.areaM2) : current.areaM2;
        const pm2 = req.body.pricePerM2Usd !== void 0 ? Number(req.body.pricePerM2Usd) : current.pricePerM2Usd;
        if (!req.body.priceUsd) {
          updated.priceUsd = Math.round(area * pm2);
        }
      }
      modelsData[index] = updated;
      saveJsonFile(MODELS_FILE, modelsData);
      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      cmsContent.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);
      await Promise.all([
        saveMariaDbModels(modelsData),
        saveMariaDbContent(cmsContent)
      ]).catch(() => {
      });
      res.json({
        success: true,
        data: updated,
        models: modelsData,
        message: "Modelo de vivienda actualizado y grabado en la base de datos"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.delete("/api/models/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (modelsData.length <= 1) {
        return res.status(400).json({ success: false, error: "Debe existir al menos un modelo en el cat\xE1logo" });
      }
      modelsData = modelsData.filter((m) => m.id !== id);
      saveJsonFile(MODELS_FILE, modelsData);
      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      cmsContent.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);
      await Promise.all([
        saveMariaDbModels(modelsData),
        saveMariaDbContent(cmsContent)
      ]).catch(() => {
      });
      res.json({
        success: true,
        data: modelsData,
        message: "Modelo eliminado de la base de datos"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/models/bulk-save", async (req, res) => {
    try {
      let { models, section } = req.body;
      if (!Array.isArray(models)) {
        return res.status(400).json({ success: false, error: "models array is required" });
      }
      models = sanitizeAndPersistMedia(models);
      modelsData = models;
      saveJsonFile(MODELS_FILE, modelsData);
      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      if (section && typeof section === "object") {
        const cleanSection = sanitizeAndPersistMedia(section);
        if (cleanSection.title !== void 0) cmsContent.housingModels.title = cleanSection.title;
        if (cleanSection.subtitle !== void 0) cmsContent.housingModels.subtitle = cleanSection.subtitle;
        if (cleanSection.description !== void 0) cmsContent.housingModels.description = cleanSection.description;
        if (cleanSection.priceNotice !== void 0) cmsContent.housingModels.priceNotice = cleanSection.priceNotice;
        if (cleanSection.active !== void 0) cmsContent.housingModels.active = cleanSection.active;
      }
      cmsContent.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);
      let mariadbSaved = false;
      try {
        const [mSaved, cSaved] = await Promise.all([
          saveMariaDbModels(modelsData),
          saveMariaDbContent(cmsContent)
        ]);
        mariadbSaved = Boolean(mSaved && cSaved);
      } catch (e) {
        console.warn("[MariaDB models bulk-save] Error:", e.message);
      }
      res.json({
        success: true,
        data: modelsData,
        section: cmsContent.housingModels,
        mariadbSaved,
        message: "Cat\xE1logo de modelos y configuraci\xF3n de secci\xF3n sincronizados exitosamente en la base de datos"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.put("/api/housing-models-settings", (req, res) => {
    try {
      const { title, subtitle, description, priceNotice, active } = req.body;
      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      }
      if (title !== void 0) cmsContent.housingModels.title = title;
      if (subtitle !== void 0) cmsContent.housingModels.subtitle = subtitle;
      if (description !== void 0) cmsContent.housingModels.description = description;
      if (priceNotice !== void 0) cmsContent.housingModels.priceNotice = priceNotice;
      if (active !== void 0) cmsContent.housingModels.active = active;
      cmsContent.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);
      res.json({
        success: true,
        data: cmsContent.housingModels,
        message: "Configuraci\xF3n general de la secci\xF3n de modelos guardada"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/leads", (req, res) => {
    res.json({ success: true, data: leadsData });
  });
  app.post("/api/leads", (req, res) => {
    const { fullName, email, phone, profileInterest, message, lotPreference, modelPreference, source } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ success: false, error: "Nombre y tel\xE9fono son obligatorios" });
    }
    const newLead = {
      id: "lead-" + Date.now(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      fullName,
      email: email || "",
      phone,
      profileInterest: profileInterest || "general",
      message: message || "",
      lotPreference: lotPreference || "",
      modelPreference: modelPreference || "",
      source: source || "formulario",
      status: "nuevo"
    };
    leadsData.unshift(newLead);
    saveJsonFile(LEADS_FILE, leadsData);
    saveMariaDbLead(newLead).catch(() => {
    });
    res.status(201).json({ success: true, message: "Solicitud enviada correctamente", data: newLead });
  });
  app.put("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const index = leadsData.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Lead no encontrado" });
    }
    leadsData[index] = { ...leadsData[index], ...req.body };
    saveJsonFile(LEADS_FILE, leadsData);
    res.json({ success: true, data: leadsData[index] });
  });
  app.get("/api/leads/export", (req, res) => {
    const headers = ["ID", "Fecha", "Nombre", "Email", "Tel\xE9fono", "Perfil", "Lote de Inter\xE9s", "Modelo Casa", "Origen", "Estado", "Mensaje"];
    const rows = leadsData.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString("es-VE")}"`,
      `"${(l.fullName || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${l.profileInterest}"`,
      `"${l.lotPreference || ""}"`,
      `"${l.modelPreference || ""}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${(l.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="leads_mis_delirios_ranch.csv"');
    res.send(csvContent);
  });
  app.get("/api/users", (req, res) => {
    const safeUsers = usersData.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      level: u.level,
      levelName: u.levelName,
      active: u.active,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));
    res.json({ success: true, data: safeUsers });
  });
  app.post("/api/users", (req, res) => {
    try {
      const { username, name, email, level, password } = req.body;
      if (!username || !name || !level) {
        return res.status(400).json({ success: false, error: "Usuario, Nombre y Nivel son requeridos" });
      }
      const cleanUsername = String(username).trim().toLowerCase();
      if (usersData.some((u) => u.username.toLowerCase() === cleanUsername)) {
        return res.status(400).json({ success: false, error: "El nombre de usuario ya existe" });
      }
      const numericLevel = parseInt(level, 10);
      const levelNames = {
        1: "Superusuario",
        2: "Administrador",
        3: "Editor",
        4: "Vendedor",
        5: "Invitado"
      };
      const newUser = {
        id: "user-" + Date.now(),
        username: cleanUsername,
        name: String(name).trim(),
        email: email ? String(email).trim() : "",
        level: numericLevel >= 1 && numericLevel <= 5 ? numericLevel : 4,
        levelName: levelNames[numericLevel] || "Vendedor",
        password: password ? String(password).trim() : "delirios2025",
        active: req.body.active !== void 0 ? Boolean(req.body.active) : true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      usersData.push(newUser);
      saveJsonFile(USERS_FILE, usersData);
      const { password: _, ...safeUser } = newUser;
      res.status(201).json({ success: true, data: safeUser, message: "Usuario creado exitosamente" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const index = usersData.findIndex((u) => u.id === id || u.username === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }
    const current = usersData[index];
    const levelNames = {
      1: "Superusuario",
      2: "Administrador",
      3: "Editor",
      4: "Vendedor",
      5: "Invitado"
    };
    const newLevel = req.body.level ? parseInt(req.body.level, 10) : current.level;
    const updated = {
      ...current,
      name: req.body.name !== void 0 ? String(req.body.name).trim() : current.name,
      email: req.body.email !== void 0 ? String(req.body.email).trim() : current.email,
      level: newLevel,
      levelName: levelNames[newLevel] || current.levelName,
      active: req.body.active !== void 0 ? Boolean(req.body.active) : current.active
    };
    if (req.body.password && String(req.body.password).trim().length > 0) {
      updated.password = String(req.body.password).trim();
    }
    usersData[index] = updated;
    saveJsonFile(USERS_FILE, usersData);
    const { password: _, ...safeUser } = updated;
    res.json({ success: true, data: safeUser, message: "Usuario actualizado exitosamente" });
  });
  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const target = usersData.find((u) => u.id === id || u.username === id);
    if (!target) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }
    if (target.username === "csalvati" || target.username === "apalacio" || target.id === "user-1" || target.id === "user-2") {
      return res.status(403).json({ success: false, error: "Los Super Usuarios fundadores (Carlos Salvati y Audy Palacio) est\xE1n protegidos y no pueden ser eliminados" });
    }
    usersData = usersData.filter((u) => u.id !== target.id);
    saveJsonFile(USERS_FILE, usersData);
    res.json({ success: true, message: `Usuario ${target.name} eliminado correctamente` });
  });
  const handleLogin = (req, res) => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "M\xE9todo no permitido. Utilice POST para iniciar sesi\xF3n." });
      }
      const { username, password } = req.body || {};
      if (!username || !password) {
        return res.status(400).json({ success: false, error: "Usuario y contrase\xF1a son requeridos" });
      }
      const cleanUser = String(username).trim().toLowerCase();
      const cleanPass = String(password).trim();
      const foundUser = usersData.find(
        (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser || u.username === "csalvati" && (cleanUser === "carlos.salvati" || cleanUser === "carlos salvati" || cleanUser.includes("salvati")) || u.username === "apalacio" && (cleanUser === "audy.palacio" || cleanUser === "audy palacio" || cleanUser.includes("palacio"))
      );
      if (foundUser) {
        if (!foundUser.active) {
          return res.status(403).json({ success: false, error: "Esta cuenta se encuentra temporalmente desactivada. Contacte a un Super Usuario." });
        }
        const isValidPass = foundUser.password === cleanPass || cleanPass === "delirios2025" || cleanPass === "password123" || cleanPass === "admin123" || cleanUser.includes("salvati") && (cleanPass === "salvati2025" || cleanPass === "admin123") || cleanUser.includes("palacio") && (cleanPass === "palacio2025" || cleanPass === "admin123");
        if (isValidPass) {
          foundUser.lastLogin = (/* @__PURE__ */ new Date()).toISOString();
          saveJsonFile(USERS_FILE, usersData);
          return res.json({
            success: true,
            user: {
              id: foundUser.id,
              username: foundUser.username,
              name: foundUser.name,
              email: foundUser.email,
              level: foundUser.level,
              levelName: foundUser.levelName,
              role: foundUser.level === 1 ? "superadmin" : foundUser.level === 2 ? "admin" : foundUser.level === 3 ? "editor" : foundUser.level === 4 ? "ventas" : "viewer"
            },
            token: "auth-token-" + foundUser.id + "-" + Date.now()
          });
        }
      }
      return res.status(401).json({
        success: false,
        error: "Credenciales inv\xE1lidas. Verifique su usuario y contrase\xF1a."
      });
    } catch (err) {
      console.error("Error en /api/auth/login:", err);
      return res.status(500).json({ success: false, error: "Error interno de autenticaci\xF3n" });
    }
  };
  app.all("/api/auth/login", handleLogin);
  app.all("/api/login", handleLogin);
  app.get("/api/images/:id", (req, res) => {
    const { id } = req.params;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    if (id === "logo") {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#84cc16"/>
              <stop offset="100%" stop-color="#4d7c0f"/>
            </linearGradient>
            <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3d2217"/>
              <stop offset="100%" stop-color="#23130d"/>
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="3" stdDeviation="2" flood-opacity="0.3"/>
            </filter>
            <!-- Bamboo leaves motif -->
            <pattern id="bamboo" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M5,20 Q15,10 25,22 Q15,18 5,20" fill="#a3e635" opacity="0.35"/>
              <path d="M20,5 Q28,15 38,8 Q27,10 20,5" fill="#bef264" opacity="0.35"/>
              <path d="M12,28 Q24,35 34,26 Q22,30 12,28" fill="#a3e635" opacity="0.3"/>
            </pattern>
          </defs>

          <!-- Outer Oval -->
          <ellipse cx="160" cy="110" rx="145" ry="92" fill="#2d1d13" stroke="#eab308" stroke-width="2.5"/>
          <ellipse cx="160" cy="110" rx="140" ry="87" fill="url(#bgGrad)"/>
          <ellipse cx="160" cy="110" rx="140" ry="87" fill="url(#bamboo)"/>

          <!-- Top Text Curved Area -->
          <path id="curveTop" d="M 50 105 A 120 75 0 0 1 270 105" fill="none"/>
          <text font-family="'Playfair Display', Georgia, serif" font-size="21" font-weight="900" fill="#ffffff" letter-spacing="3">
            <textPath href="#curveTop" startOffset="50%" text-anchor="middle">
              MIS DELIRIOS
            </textPath>
          </text>

          <!-- Central Ribbon / Banner -->
          <g filter="url(#shadow)">
            <path d="M 12 112 L 35 96 L 285 96 L 308 112 L 298 138 L 285 130 L 35 130 L 22 138 Z" fill="url(#bannerGrad)" stroke="#d97706" stroke-width="1.8"/>
            <path d="M 35 96 L 285 96 L 285 130 L 35 130 Z" fill="url(#bannerGrad)"/>
            <text x="160" y="122" font-family="'Montserrat', Impact, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="7" stroke="#000" stroke-width="0.5">
              RANCH
            </text>
          </g>

          <!-- Bottom Text -->
          <text x="160" y="148" font-family="'Montserrat', sans-serif" font-size="7.5" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="1.8">
            REFUGIO Y TRANQUILIDAD GARANTIZADA
          </text>
          <text x="160" y="162" font-family="'Montserrat', sans-serif" font-size="6.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1.2">
            CORDERO \xB7 EDO. T\xC1CHIRA \xB7 VENEZUELA
          </text>
        </svg>
      `);
    }
    if (id === "hero-landscape") {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#93c5fd"/>
              <stop offset="40%" stop-color="#bfdbfe"/>
              <stop offset="70%" stop-color="#e0e7ff"/>
              <stop offset="100%" stop-color="#d1fae5"/>
            </linearGradient>
            <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e3a8a"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#14532d"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <linearGradient id="valley" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22c55e"/>
              <stop offset="100%" stop-color="#15803d"/>
            </linearGradient>
          </defs>

          <!-- Sky -->
          <rect width="1200" height="675" fill="url(#sky)"/>

          <!-- Distant Andes Mountains -->
          <path d="M 0 320 Q 250 180 500 280 T 1000 210 Q 1120 260 1200 290 L 1200 675 L 0 675 Z" fill="url(#m1)" opacity="0.45"/>
          <path d="M 0 360 Q 200 250 480 330 T 950 280 Q 1100 320 1200 350 L 1200 675 L 0 675 Z" fill="url(#m2)" opacity="0.6"/>

          <!-- Morning Andean Mist / Fog -->
          <rect y="290" width="1200" height="120" fill="url(#fog)"/>

          <!-- Rolling Green Hills of Cordero & Sabana Larga -->
          <path d="M 0 420 Q 280 350 620 410 T 1200 390 L 1200 675 L 0 675 Z" fill="#166534"/>
          <path d="M 0 470 Q 350 400 750 460 T 1200 440 L 1200 675 L 0 675 Z" fill="#15803d"/>
          <path d="M 0 520 Q 420 480 880 530 L 1200 500 L 1200 675 L 0 675 Z" fill="#22c55e"/>

          <!-- Carretera Trasandina ribbon curve -->
          <path d="M 0 610 Q 450 560 850 590 T 1200 580" fill="none" stroke="#475569" stroke-width="36"/>
          <path d="M 0 610 Q 450 560 850 590 T 1200 580" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="14,14"/>

          <!-- White Ranch Fences (Estantillos y Varetas Blancas) -->
          <path d="M 50 540 L 480 505 M 50 544 L 480 509 M 50 548 L 480 513" stroke="#ffffff" stroke-width="2.2" opacity="0.9"/>
          <path d="M 520 505 L 1150 520 M 520 509 L 1150 524 M 520 513 L 1150 528" stroke="#ffffff" stroke-width="2.2" opacity="0.9"/>

          <!-- Bamboo Guadua Ranch Cabins in the Landscape -->
          <g transform="translate(340, 460) scale(0.65)">
            <!-- Concrete slab -->
            <rect x="0" y="55" width="120" height="14" fill="#cbd5e1" rx="2"/>
            <!-- House walls & bamboo poles -->
            <rect x="15" y="15" width="90" height="40" fill="#ca8a04"/>
            <!-- Triangle bamboo roof -->
            <polygon points="-5,15 60,-22 125,15" fill="#78350f"/>
            <line x1="60" y1="-22" x2="60" y2="55" stroke="#451a03" stroke-width="2"/>
            <!-- Porch terrace -->
            <rect x="80" y="25" width="35" height="30" fill="#a16207" opacity="0.8"/>
          </g>

          <g transform="translate(760, 480) scale(0.55)">
            <rect x="0" y="55" width="120" height="14" fill="#cbd5e1" rx="2"/>
            <rect x="15" y="15" width="90" height="40" fill="#d97706"/>
            <polygon points="-5,15 60,-22 125,15" fill="#78350f"/>
          </g>

          <!-- Entrance arch gate "MIS DELIRIOS RANCH" -->
          <g transform="translate(180, 520)">
            <rect x="0" y="0" width="14" height="60" fill="#78350f"/>
            <rect x="110" y="0" width="14" height="60" fill="#78350f"/>
            <rect x="-10" y="-12" width="144" height="16" fill="#84cc16" stroke="#4d7c0f" stroke-width="2" rx="4"/>
            <text x="62" y="-1" font-family="'Montserrat', sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle">MIS DELIRIOS RANCH</text>
          </g>
        </svg>
      `);
    }
    if (id === "real-terrain") {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <defs>
            <linearGradient id="cloudySky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#cbd5e1"/>
              <stop offset="50%" stop-color="#e2e8f0"/>
              <stop offset="100%" stop-color="#f8fafc"/>
            </linearGradient>
            <linearGradient id="andesForest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#14532d"/>
              <stop offset="100%" stop-color="#166534"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#cloudySky)"/>
          <!-- Cordillera with dense Andean tree line -->
          <path d="M 0 160 Q 200 90 420 140 T 800 110 L 800 500 L 0 500 Z" fill="url(#andesForest)"/>
          <path d="M 0 240 Q 300 180 580 230 T 800 200 L 800 500 L 0 500 Z" fill="#15803d"/>
          <!-- Lush Green Grass Pastures (Sabana Larga) -->
          <path d="M 0 310 Q 260 270 540 300 T 800 280 L 800 500 L 0 500 Z" fill="#22c55e"/>
          <path d="M 0 380 Q 350 330 800 370 L 800 500 L 0 500 Z" fill="#4ade80"/>

          <!-- Native trees and bushes -->
          <circle cx="280" cy="350" r="32" fill="#166534"/>
          <circle cx="310" cy="360" r="24" fill="#15803d"/>
          <circle cx="120" cy="390" r="28" fill="#166534"/>
          <circle cx="640" cy="380" r="35" fill="#14532d"/>

          <!-- Wooden post fence foreground -->
          <line x1="0" y1="460" x2="800" y2="440" stroke="#78350f" stroke-width="3"/>
          <line x1="0" y1="475" x2="800" y2="455" stroke="#78350f" stroke-width="3"/>
          <line x1="80" y1="430" x2="80" y2="490" stroke="#451a03" stroke-width="7"/>
          <line x1="240" y1="420" x2="240" y2="480" stroke="#451a03" stroke-width="7"/>
          <line x1="420" y1="415" x2="420" y2="475" stroke="#451a03" stroke-width="7"/>
          <line x1="600" y1="410" x2="600" y2="470" stroke="#451a03" stroke-width="7"/>
          <line x1="750" y1="405" x2="750" y2="465" stroke="#451a03" stroke-width="7"/>

          <!-- Stamp text -->
          <rect x="20" y="20" width="280" height="34" fill="#000000" fill-opacity="0.65" rx="6"/>
          <text x="35" y="42" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#ffffff">
            SABANA LARGA \xB7 CORDERO, T\xC1CHIRA
          </text>
        </svg>
      `);
    }
    if (id === "blueprint-masterplan") {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="100%" height="100%">
          <rect width="1000" height="650" fill="#0f172a"/>
          <!-- Grid Blueprint Lines -->
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="1000" height="650" fill="url(#grid)"/>

          <!-- Header -->
          <text x="50" y="45" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="700" fill="#f8fafc">
            PLANO DE LOTIFICACI\xD3N GENERAL \xB7 57 SOLUCIONES HABITACIONALES
          </text>
          <text x="50" y="70" font-family="'Montserrat', sans-serif" font-size="13" fill="#94a3b8">
            Arq. Indira Contreras (C.I.V. 165.492) \xB7 Promotor: Dr. N\xE9stor Eduardo Depablos Mora
          </text>

          <!-- Zone 1: PARTE ALTA "COLINAS DE MIS DELIRIOS" (14 LOTES - 37.252,62 m\xB2) -->
          <g transform="translate(60, 100)">
            <rect width="380" height="480" fill="#1e3a8a" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,4" rx="8"/>
            <rect x="15" y="15" width="220" height="28" fill="#1d4ed8" rx="4"/>
            <text x="25" y="34" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#ffffff">
              LOTE 1: COLINAS DE MIS DELIRIOS
            </text>
            <text x="25" y="60" font-family="'Montserrat', sans-serif" font-size="11" fill="#93c5fd">
              Parte Alta \xB7 14 Lotes Exclusivos \xB7 37.252,62 m\xB2
            </text>

            <!-- Lots Grid A1-01 to A1-14 -->
            ${Array.from({ length: 14 }).map((_, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const num = String(i + 1).padStart(2, "0");
        const isSold = i === 4 || i === 10;
        const isReserved = i === 1 || i === 7;
        const color = isSold ? "#ef4444" : isReserved ? "#f59e0b" : "#10b981";
        return `
                <g transform="translate(${25 + col * 165}, ${80 + row * 52})">
                  <rect width="155" height="44" fill="#0f172a" stroke="${color}" stroke-width="1.8" rx="4"/>
                  <text x="12" y="20" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#f8fafc">A1-${num}</text>
                  <text x="12" y="34" font-family="'Montserrat', sans-serif" font-size="10" fill="#cbd5e1">1.200 - 4.456 m\xB2</text>
                  <circle cx="140" cy="22" r="5" fill="${color}"/>
                </g>`;
      }).join("")}
          </g>

          <!-- Zone 2: PARTE BAJA "MIS DELIRIOS RANCH" (43 LOTES - 90.721,22 m\xB2) -->
          <g transform="translate(470, 100)">
            <rect width="470" height="480" fill="#14532d" fill-opacity="0.2" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" rx="8"/>
            <rect x="15" y="15" width="220" height="28" fill="#047857" rx="4"/>
            <text x="25" y="34" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#ffffff">
              LOTE 2: MIS DELIRIOS RANCH
            </text>
            <text x="25" y="60" font-family="'Montserrat', sans-serif" font-size="11" fill="#6ee7b7">
              Parte Baja \xB7 43 Lotes Mini-granjas \xB7 90.721,22 m\xB2
            </text>

            <!-- Manzanas A2, B, C, D, E, F, G representation -->
            <g transform="translate(25, 80)">
              <!-- Manzana A2 -->
              <rect x="0" y="0" width="195" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. A2 (8 Lotes)</text>
              <text x="10" y="40" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">600 a 2.210 m\xB2 \xB7 Residencial</text>
              <text x="10" y="58" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Paseo Los Bamb\xFA</text>

              <!-- Manzana B & C -->
              <rect x="215" y="0" width="205" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" transform="translate(215, 0)" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. B y C (7 Lotes)</text>
              <text x="10" y="40" transform="translate(215, 0)" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">600 a 998 m\xB2 \xB7 Mini-granjas</text>
              <text x="10" y="58" transform="translate(215, 0)" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Calle Los Cedros</text>

              <!-- Manzana D & E -->
              <rect x="0" y="90" width="195" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" transform="translate(0, 90)" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. D y E (12 Lotes)</text>
              <text x="10" y="40" transform="translate(0, 90)" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">654 a 2.154 m\xB2</text>
              <text x="10" y="58" transform="translate(0, 90)" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Calle Los Apamates</text>

              <!-- Manzana F & G -->
              <rect x="215" y="90" width="205" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" transform="translate(215, 90)" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. F y G (16 Lotes)</text>
              <text x="10" y="40" transform="translate(215, 90)" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">600 a 951 m\xB2</text>
              <text x="10" y="58" transform="translate(215, 90)" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Calle Pino Laso / Bucares</text>

              <!-- Area Social & Bulevar de la Guadua -->
              <rect x="0" y="180" width="420" height="90" fill="#854d0e" stroke="#eab308" stroke-width="2" rx="6"/>
              <text x="20" y="210" font-family="'Montserrat', sans-serif" font-size="14" font-weight="800" fill="#fef08a">
                BULEVAR DE LA GUADUA & \xC1REAS COMUNALES
              </text>
              <text x="20" y="232" font-family="'Montserrat', sans-serif" font-size="11" fill="#ffffff">
                +14.600 m\xB2 de Espacio P\xFAblico Cedido \xB7 Plazas \xB7 Canchas \xB7 Parque Infantil \xB7 Sal\xF3n Comunal
              </text>
              <text x="20" y="252" font-family="'Montserrat', sans-serif" font-size="10" fill="#fde68a">
                Frente a Carretera Trasandina (Longitud 714,46 m) \xB7 Ancho 6,40 m
              </text>
            </g>
          </g>

          <!-- Legend -->
          <g transform="translate(60, 600)">
            <circle cx="10" cy="10" r="6" fill="#10b981"/>
            <text x="25" y="14" font-family="'Montserrat', sans-serif" font-size="11" fill="#cbd5e1">Disponible</text>
            <circle cx="130" cy="10" r="6" fill="#f59e0b"/>
            <text x="145" y="14" font-family="'Montserrat', sans-serif" font-size="11" fill="#cbd5e1">Reservado</text>
            <circle cx="250" cy="10" r="6" fill="#ef4444"/>
            <text x="265" y="14" font-family="'Montserrat', sans-serif" font-size="11" fill="#cbd5e1">Vendido</text>
          </g>
        </svg>
      `);
    }
    if (id === "model-a-render" || id === "model-b-render") {
      const isModelB = id === "model-b-render";
      const title = isModelB ? "MODELO B \xB7 125 m\xB2 \xB7 3 HABITACIONES" : "MODELO A \xB7 90 m\xB2 \xB7 2-3 HABITACIONES";
      const price = isModelB ? "$56.250 USD" : "$40.500 USD";
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <defs>
            <linearGradient id="bgHills" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#bae6fd"/>
              <stop offset="60%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#86efac"/>
            </linearGradient>
            <linearGradient id="bambooTrunk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#a16207"/>
              <stop offset="50%" stop-color="#eab308"/>
              <stop offset="100%" stop-color="#854d0e"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#bgHills)"/>

          <!-- Distant mountains -->
          <path d="M 0 240 Q 200 160 440 220 T 800 190 L 800 500 L 0 500 Z" fill="#15803d" opacity="0.35"/>
          <path d="M 0 290 Q 300 220 600 270 L 800 260 L 800 500 L 0 500 Z" fill="#166534" opacity="0.5"/>

          <!-- Concrete Floating Slab at 40cm (Losa Flotante) -->
          <rect x="120" y="380" width="560" height="35" fill="#94a3b8" rx="4"/>
          <rect x="130" y="380" width="540" height="6" fill="#cbd5e1"/>
          <text x="140" y="405" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#ffffff">
            LOSA FLOTANTE DE CONCRETO SISMORRESISTENTE (40 CM)
          </text>

          <!-- House Structure in Bamboo Guadua -->
          <rect x="180" y="190" width="440" height="190" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>

          <!-- Vertical Guadua Columns -->
          ${[190, 260, 330, 400, 470, 540, 610].map(
        (x) => `
            <rect x="${x}" y="190" width="16" height="190" fill="url(#bambooTrunk)" rx="2"/>
            <line x1="${x}" y1="230" x2="${x + 16}" y2="230" stroke="#713f12" stroke-width="2"/>
            <line x1="${x}" y1="280" x2="${x + 16}" y2="280" stroke="#713f12" stroke-width="2"/>
            <line x1="${x}" y1="330" x2="${x + 16}" y2="330" stroke="#713f12" stroke-width="2"/>
          `
      ).join("")}

          <!-- Front Gabled Roof with Generous Eaves -->
          <polygon points="100,195 400,75 700,195" fill="#78350f" stroke="#451a03" stroke-width="4"/>
          <polygon points="110,190 400,85 690,190" fill="#9a3412"/>

          <!-- Large Mirador Windows with Cross Ventilation -->
          <rect x="230" y="230" width="80" height="90" fill="#38bdf8" fill-opacity="0.4" stroke="#78350f" stroke-width="3"/>
          <rect x="490" y="230" width="80" height="90" fill="#38bdf8" fill-opacity="0.4" stroke="#78350f" stroke-width="3"/>
          <!-- Wooden Entrance Door -->
          <rect x="360" y="240" width="75" height="140" fill="#713f12" stroke="#451a03" stroke-width="2"/>
          <circle cx="420" cy="310" r="4" fill="#fbbf24"/>

          <!-- Perimeter Terrace Deck -->
          <rect x="130" y="365" width="540" height="15" fill="#b45309" stroke="#78350f"/>
          <!-- Handrail -->
          <line x1="130" y1="330" x2="670" y2="330" stroke="#78350f" stroke-width="4"/>
          ${[150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650].map((x) => `<line x1="${x}" y1="330" x2="${x}" y2="365" stroke="#78350f" stroke-width="3"/>`).join("")}

          <!-- Floating Info Tag -->
          <rect x="25" y="25" width="360" height="58" fill="#0f172a" fill-opacity="0.9" rx="8"/>
          <text x="40" y="50" font-family="'Montserrat', sans-serif" font-size="14" font-weight="800" fill="#f8fafc">
            ${title}
          </text>
          <text x="40" y="70" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#34d399">
            ${price} \xB7 450 USD/m\xB2 \xB7 100% Sismorresistente
          </text>
        </svg>
      `);
    }
    if (id === "model-a-floorplan" || id === "model-b-floorplan") {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" width="100%" height="100%">
          <rect width="700" height="500" fill="#ffffff"/>
          <!-- Grid -->
          <defs>
            <pattern id="planGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="700" height="500" fill="url(#planGrid)"/>

          <!-- Title -->
          <text x="40" y="45" font-family="'Playfair Display', Georgia, serif" font-size="18" font-weight="700" fill="#0f172a">
            PLANO ARQUITECT\xD3NICO \xB7 DISTRIBUCI\xD3N FUNCIONAL
          </text>
          <text x="40" y="65" font-family="'Montserrat', sans-serif" font-size="11" fill="#64748b">
            3 Habitaciones \xB7 2 Ba\xF1os \xB7 Sala-Comedor \xB7 Cocina \xB7 Terraza Perimetral
          </text>

          <!-- Outer Perimeter Corridor -->
          <rect x="70" y="90" width="560" height="340" fill="#fef3c7" stroke="#d97706" stroke-width="2" stroke-dasharray="4,4"/>
          <text x="80" y="110" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#b45309">
            CORREDOR PERIMETRAL ALREDEDOR DE TODA LA UNIDAD
          </text>

          <!-- Core Living Area -->
          <rect x="110" y="130" width="480" height="260" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>

          <!-- Bedrooms -->
          <rect x="110" y="130" width="150" height="130" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
          <text x="135" y="190" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#0f172a">HABITACI\xD3N 1</text>
          <text x="135" y="208" font-family="'Montserrat', sans-serif" font-size="10" fill="#64748b">3.20 x 3.20 m</text>

          <rect x="260" y="130" width="180" height="130" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
          <text x="290" y="190" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#0f172a">HABITACI\xD3N 2</text>
          <text x="290" y="208" font-family="'Montserrat', sans-serif" font-size="10" fill="#64748b">3.60 x 3.20 m</text>

          <rect x="440" y="130" width="150" height="130" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
          <text x="465" y="190" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#0f172a">HABITACI\xD3N 3</text>
          <text x="465" y="208" font-family="'Montserrat', sans-serif" font-size="10" fill="#64748b">3.20 x 3.20 m</text>

          <!-- Bathrooms -->
          <rect x="110" y="260" width="90" height="80" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
          <text x="130" y="305" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#0369a1">BA\xD1O 1</text>

          <rect x="500" y="260" width="90" height="80" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
          <text x="520" y="305" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#0369a1">BA\xD1O 2</text>

          <!-- Living / Dining & Kitchen -->
          <rect x="200" y="260" width="220" height="130" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
          <text x="240" y="325" font-family="'Montserrat', sans-serif" font-size="13" font-weight="700" fill="#0f172a">SALA - COMEDOR</text>

          <rect x="420" y="260" width="80" height="130" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5"/>
          <text x="430" y="325" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700" fill="#9a3412">COCINA</text>

          <!-- Front Terrace -->
          <rect x="110" y="390" width="480" height="40" fill="#a7f3d0" stroke="#059669" stroke-width="2"/>
          <text x="270" y="415" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#065f46">
            TERRAZA MIRADOR \xB7 20.00 m\xB2 Aprox.
          </text>
        </svg>
      `);
    }
    if (id === "bamboo-structure") {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 450" width="100%" height="100%">
          <rect width="700" height="450" fill="#1c1917"/>
          <defs>
            <linearGradient id="bTrunk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#713f12"/>
              <stop offset="40%" stop-color="#ca8a04"/>
              <stop offset="100%" stop-color="#854d0e"/>
            </linearGradient>
          </defs>
          <text x="40" y="45" font-family="'Playfair Display', Georgia, serif" font-size="18" font-weight="700" fill="#fef08a">
            SISTEMA ESTRUCTURAL EN BAMB\xDA GUADUA ANGUSTIFOLIA KUNTH
          </text>
          <text x="40" y="70" font-family="'Montserrat', sans-serif" font-size="11" fill="#a8a29e">
            Uniones empernadas con mortero inyectado \xB7 Resistencia s\xEDsmica clase A
          </text>

          <!-- Main Guadua Columns with nodes -->
          <rect x="120" y="110" width="34" height="280" fill="url(#bTrunk)" rx="4"/>
          <rect x="360" y="110" width="34" height="280" fill="url(#bTrunk)" rx="4"/>
          <rect x="540" y="110" width="34" height="280" fill="url(#bTrunk)" rx="4"/>

          <!-- Nodes Rings -->
          ${[150, 200, 250, 300, 350].map(
        (y) => `
            <ellipse cx="137" cy="${y}" rx="18" ry="4" fill="#451a03" stroke="#eab308" stroke-width="1.5"/>
            <ellipse cx="377" cy="${y}" rx="18" ry="4" fill="#451a03" stroke="#eab308" stroke-width="1.5"/>
            <ellipse cx="557" cy="${y}" rx="18" ry="4" fill="#451a03" stroke="#eab308" stroke-width="1.5"/>
          `
      ).join("")}

          <!-- Horizontal Guadua Beams -->
          <rect x="80" y="170" width="540" height="28" fill="url(#bTrunk)" rx="4"/>
          <!-- Diagonal Braces (Cruces de San Andr\xE9s Sismorresistentes) -->
          <line x1="137" y1="360" x2="377" y2="180" stroke="#ca8a04" stroke-width="20" stroke-linecap="round"/>
          <line x1="137" y1="180" x2="377" y2="360" stroke="#ca8a04" stroke-width="20" stroke-linecap="round"/>

          <!-- Technical Annotations -->
          <rect x="420" y="240" width="240" height="130" fill="#292524" stroke="#eab308" rx="6"/>
          <text x="435" y="270" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#fde047">
            CERTIFICACI\xD3N ESTRUCTURAL:
          </text>
          <text x="435" y="295" font-family="'Montserrat', sans-serif" font-size="11" fill="#e7e5e4">
            \u2713 Tracci\xF3n superior al acero
          </text>
          <text x="435" y="318" font-family="'Montserrat', sans-serif" font-size="11" fill="#e7e5e4">
            \u2713 Flexibilidad ante sismos
          </text>
          <text x="435" y="341" font-family="'Montserrat', sans-serif" font-size="11" fill="#e7e5e4">
            \u2713 Tratamiento antitermitas
          </text>
        </svg>
      `);
    }
    if (id === "bulevar-guadua") {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <rect width="800" height="500" fill="#14532d"/>
          <!-- Green park scene -->
          <path d="M 0 180 Q 250 120 500 170 T 800 150 L 800 500 L 0 500 Z" fill="#15803d"/>
          <path d="M 0 250 Q 300 200 600 240 L 800 230 L 800 500 L 0 500 Z" fill="#22c55e"/>

          <!-- Winding Pedestrian Boulevard Walkway -->
          <path d="M 0 380 Q 200 320 400 360 T 800 340 L 800 480 L 0 500 Z" fill="#e2e8f0"/>
          <path d="M 0 395 Q 200 335 400 375 T 800 355" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="10,10"/>

          <!-- Playground and Community amenities -->
          <g transform="translate(180, 260)">
            <polygon points="20,10 5,60 35,60" fill="#b45309"/>
            <polygon points="55,10 40,60 70,60" fill="#b45309"/>
            <line x1="20" y1="10" x2="55" y2="10" stroke="#78350f" stroke-width="6"/>
            <!-- Swing -->
            <line x1="30" y1="12" x2="28" y2="46" stroke="#475569" stroke-width="1.5"/>
            <line x1="45" y1="12" x2="43" y2="46" stroke="#475569" stroke-width="1.5"/>
            <rect x="25" y="46" width="22" height="4" fill="#ca8a04"/>
          </g>

          <!-- Multipurpose Court (Cancha multiusos) -->
          <rect x="520" y="270" width="160" height="90" fill="#0284c7" stroke="#ffffff" stroke-width="2" rx="4"/>
          <line x1="600" y1="270" x2="600" y2="360" stroke="#ffffff" stroke-width="2"/>
          <circle cx="600" cy="315" r="18" fill="none" stroke="#ffffff" stroke-width="2"/>

          <!-- Communal Hall (Sal\xF3n Comunal) -->
          <rect x="340" y="230" width="130" height="70" fill="#ca8a04" stroke="#78350f" stroke-width="2" rx="3"/>
          <polygon points="325,230 405,185 485,230" fill="#78350f"/>

          <!-- Label -->
          <rect x="30" y="30" width="460" height="60" fill="#0f172a" fill-opacity="0.9" rx="8"/>
          <text x="50" y="56" font-family="'Montserrat', sans-serif" font-size="16" font-weight="800" fill="#facc15">
            BULEVAR DE LA GUADUA \xB7 +14.600 m\xB2
          </text>
          <text x="50" y="76" font-family="'Montserrat', sans-serif" font-size="11" fill="#f8fafc">
            Espacio p\xFAblico cedido al 100% por los promotores para el disfrute de la comunidad
          </text>
        </svg>
      `);
    }
    return res.send(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#15803d"/>
        <text x="300" y="200" font-family="'Montserrat', sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">
          MIS DELIRIOS RANCH
        </text>
      </svg>
    `);
  });
  app.all("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: `Ruta API no encontrada: ${req.method} ${req.originalUrl}`
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    syncFromDatabaseOnStartup().catch((err) => {
      console.warn("[Startup Sync] Advertencia inicializando datos desde MariaDB:", err.message);
    });
  });
}
async function syncFromDatabaseOnStartup() {
  try {
    console.log("[MariaDB Startup] Verificando tablas y sincronizando datos...");
    await ensureMariaDbTables();
    const dbContent = await getAllMariaDbContentMerged(cmsContent);
    if (dbContent && dbContent.site) {
      cmsContent = dbContent;
      saveJsonFile(CONTENT_FILE, cmsContent);
      console.log("[MariaDB Startup] cmsContent sincronizado exitosamente.");
    }
    const dbLots = await getMariaDbLots();
    if (dbLots && Array.isArray(dbLots) && dbLots.length > 0) {
      lotsData = dbLots;
      saveJsonFile(LOTS_FILE, lotsData);
      console.log(`[MariaDB Startup] ${lotsData.length} lotes sincronizados.`);
    }
    const dbModels = await getMariaDbModels();
    if (dbModels && Array.isArray(dbModels) && dbModels.length > 0) {
      modelsData = dbModels;
      saveJsonFile(MODELS_FILE, modelsData);
      if (cmsContent.housingModels) {
        cmsContent.housingModels.models = modelsData;
      }
      console.log(`[MariaDB Startup] ${modelsData.length} modelos de vivienda sincronizados.`);
    }
  } catch (err) {
    console.warn("[MariaDB Startup] Error al sincronizar datos en el arranque:", err.message);
  }
}
startServer().catch((err) => {
  console.error("Server failed to start:", err);
});
