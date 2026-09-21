export interface ProjectMediaItem {
  id: string;
  title: string;
  category: 'render_3d' | 'blueprint' | 'landscape' | 'technical' | 'video';
  categoryLabel: string;
  url: string;
  thumbnailUrl: string;
  description: string;
  mediaType: 'image' | 'video';
  tags: string[];
}

export const PROJECT_MEDIA_LIBRARY: ProjectMediaItem[] = [
  // --- RENDERS 3D ARQUITECTÓNICOS ---
  {
    id: 'lib-render-model-a',
    title: 'Render Fachada 3D · Modelo A (90 m²)',
    category: 'render_3d',
    categoryLabel: 'Render 3D',
    url: '/api/images/model-a-render',
    thumbnailUrl: '/api/images/model-a-render',
    description: 'Cabaña Andina de 90 m² en Bambú Guadua con losa flotante de concreto a 40 cm.',
    mediaType: 'image',
    tags: ['modelo a', 'cabaña', 'fachada', 'bambú', 'render', 'guadua'],
  },
  {
    id: 'lib-render-model-b',
    title: 'Render Fachada 3D · Modelo B (125 m²)',
    category: 'render_3d',
    categoryLabel: 'Render 3D',
    url: '/api/images/model-b-render',
    thumbnailUrl: '/api/images/model-b-render',
    description: 'Villa Campestre de 125 m² con corredor perimetral de 360° y terraza techada de 20 m².',
    mediaType: 'image',
    tags: ['modelo b', 'villa', 'fachada', 'render', 'terraza', 'bambú'],
  },
  {
    id: 'lib-render-bamboo-structure',
    title: 'Render Estructural · Bioconstrucción Guadua',
    category: 'technical',
    categoryLabel: 'Detalle Técnico',
    url: '/api/images/bamboo-structure',
    thumbnailUrl: '/api/images/bamboo-structure',
    description: 'Esquema isométrico de columnas dobles de Guadua, pernos de anclaje y losa flotante.',
    mediaType: 'image',
    tags: ['estructura', 'bambú', 'sismorresistente', 'losa', 'corte'],
  },

  // --- PLANOS ARQUITECTÓNICOS & MASTER PLAN ---
  {
    id: 'lib-blueprint-masterplan',
    title: 'Plano General de Lotificación (57 Lotes)',
    category: 'blueprint',
    categoryLabel: 'Plano Oficial',
    url: '/api/images/blueprint-masterplan',
    thumbnailUrl: '/api/images/blueprint-masterplan',
    description: 'Plano general aprobado por Arq. Indira Contreras (C.I.V. 165.492) con los 57 lotes y vialidad.',
    mediaType: 'image',
    tags: ['master plan', 'plano', 'lotes', 'lotificación', 'general', 'sectores'],
  },
  {
    id: 'lib-blueprint-model-a',
    title: 'Plano de Distribución · Modelo A (90 m²)',
    category: 'blueprint',
    categoryLabel: 'Plano Arquitectónico',
    url: '/api/images/model-a-floorplan',
    thumbnailUrl: '/api/images/model-a-floorplan',
    description: 'Planta acotada con 2-3 habitaciones, 2 baños, sala-comedor, cocina y terraza mirador.',
    mediaType: 'image',
    tags: ['plano', 'modelo a', 'distribución', 'plantas', 'acotado'],
  },
  {
    id: 'lib-blueprint-model-b',
    title: 'Plano de Distribución · Modelo B (125 m²)',
    category: 'blueprint',
    categoryLabel: 'Plano Arquitectónico',
    url: '/api/images/model-b-floorplan',
    thumbnailUrl: '/api/images/model-b-floorplan',
    description: 'Planta acotada con 3 habitaciones, 2 baños, sala doble altura y corredor perimetral.',
    mediaType: 'image',
    tags: ['plano', 'modelo b', 'distribución', 'plantas', 'acotado', 'amplio'],
  },
  {
    id: 'lib-blueprint-bulevar',
    title: 'Plano de Áreas Comunales · Bulevar de la Guadua',
    category: 'blueprint',
    categoryLabel: 'Plano Urbano',
    url: '/api/images/bulevar-guadua',
    thumbnailUrl: '/api/images/bulevar-guadua',
    description: '+14.600 m² de equipamiento comunal con frente de 714 m sobre Carretera Trasandina.',
    mediaType: 'image',
    tags: ['bulevar', 'parque', 'social', 'áreas comunes', 'plano'],
  },

  // --- PAISAJES, TERRENO REAL & IDENTIDAD ---
  {
    id: 'lib-landscape-hero',
    title: 'Render Paisaje Portada · Mis Delirios Ranch',
    category: 'landscape',
    categoryLabel: 'Paisaje & Portada',
    url: '/api/images/hero-landscape',
    thumbnailUrl: '/api/images/hero-landscape',
    description: 'Panorámica de los Andes tachirenses, neblina matutina y acceso vial al complejo.',
    mediaType: 'image',
    tags: ['paisaje', 'portada', 'hero', 'montaña', 'andes', 'sabana larga'],
  },
  {
    id: 'lib-terrain-real',
    title: 'Fotografía Paisaje · Sabana Larga, Cordero',
    category: 'landscape',
    categoryLabel: 'Terreno Real',
    url: '/api/images/real-terrain',
    thumbnailUrl: '/api/images/real-terrain',
    description: 'Topografía suave andina, pastizales verdes y clima templado constante a 1.250 msnm.',
    mediaType: 'image',
    tags: ['terreno', 'real', 'sabana larga', 'cordero', 'táchira', 'pastos'],
  },
  {
    id: 'lib-logo-official',
    title: 'Logotipo Oficial · Mis Delirios Ranch',
    category: 'technical',
    categoryLabel: 'Identidad Visual',
    url: '/api/images/logo',
    thumbnailUrl: '/api/images/logo',
    description: 'Óvalo verde andino con ramas de bambú, listón de madera y tipografía oficial.',
    mediaType: 'image',
    tags: ['logo', 'marca', 'emblema', 'oficial'],
  },

  // --- VIDEOS RENDER 3D Y VUELOS ---
  {
    id: 'lib-video-render-3d',
    title: 'Video Render 3D · Recorrido Arquitectónico Completo',
    category: 'video',
    categoryLabel: 'Video Render 3D',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
    thumbnailUrl: '/api/images/model-a-render',
    description: 'Paseo virtual interactivo por el complejo, vialidades internas y áreas sociales.',
    mediaType: 'video',
    tags: ['video', 'render 3d', 'recorrido', 'virtual', 'walkthrough'],
  },
  {
    id: 'lib-video-drone-flight',
    title: 'Video Render · Vuelo de Dron sobre Terreno Real',
    category: 'video',
    categoryLabel: 'Video Dron',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
    thumbnailUrl: '/api/images/real-terrain',
    description: 'Sobrevolando la topografía suave de Sabana Larga con render de las cabañas.',
    mediaType: 'video',
    tags: ['video', 'dron', 'vuelo', 'aéreo', 'terreno'],
  },
  {
    id: 'lib-video-bamboo-construction',
    title: 'Video Animación · Estructura de Guadua Sismorresistente',
    category: 'video',
    categoryLabel: 'Animación 3D',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
    thumbnailUrl: '/api/images/bamboo-structure',
    description: 'Secuencia constructiva de losa armada de 40 cm y pórticos sismorresistentes.',
    mediaType: 'video',
    tags: ['video', 'construcción', 'bambú', 'sismo', 'ingeniería'],
  },
];
