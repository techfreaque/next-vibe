import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Analítica",
  tags: {
    performance: "Rendimiento",
    seo: "SEO",
  },

  enums: {
    metric: {
      lcp: "Largest Contentful Paint",
      inp: "Interaction to Next Paint",
      cls: "Cumulative Layout Shift",
      ttfb: "Time to First Byte",
      fcp: "First Contentful Paint",
    },
    rating: {
      good: "Bueno",
      needsImprovement: "Mejorable",
      poor: "Malo",
    },
    device: {
      mobile: "Móvil",
      desktop: "Escritorio",
    },
    pageType: {
      storyHome: "Inicio",
      storyPage: "Página story",
      blogIndex: "Índice del blog",
      blogPost: "Artículo del blog",
      storyCompare: "Página comparativa",
      models: "Lista de modelos",
      modelDetail: "Página de modelo",
      modelCompare: "Modelo contra modelo",
      modelChangelog: "Cambios de modelos",
      skill: "Página de skill",
      skills: "Lista de skills",
      docs: "Documentación",
      help: "Ayuda",
      pricing: "Precios",
      create: "Creación de medios",
      threads: "Chat",
      account: "Cuenta",
      tools: "Herramientas",
      other: "Otros",
    },
  },

  fields: {
    metric: "Métrica",
    value: "Valor",
    rating: "Valoración",
    navigationType: "Tipo de navegación",
    path: "Ruta de la página",
    device: "Dispositivo",
    metrics: "Mediciones",
    days: "Días",
    pageType: "Tipo de página",
    samples: "Mediciones",
    p75: "p75",
    goodShare: "Bueno",
    poorShare: "Malo",
  },

  post: {
    title: "Enviar Web Vitals",
    titleShort: "Enviar vitals",
    description:
      "Guarda los Core Web Vitals reales (LCP, INP, CLS, TTFB, FCP) de una visita a la página.",
    recorded: "Guardado",
    success: {
      title: "Vitals guardados",
      description: "Las mediciones se han guardado.",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "Core Web Vitals de visitantes reales por tipo de página: p75 y proporción de visitas buenas y malas.",
    empty: "Aún no hay mediciones en este periodo.",
    since: "Desde",
    total: "Mediciones",
    targets:
      "Objetivos en p75: LCP por debajo de 2,5 s, INP por debajo de 200 ms, CLS por debajo de 0,1.",
    success: {
      title: "Web Vitals cargados",
      description: "Mediciones de visitantes reales por tipo de página.",
    },
  },

  errors: {
    validation: {
      title: "Mediciones no válidas",
      description: "Revise los valores enviados.",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor.",
    },
    unauthorized: {
      title: "Inicio de sesión necesario",
      description: "Inicie sesión para ver el informe.",
    },
    forbidden: {
      title: "Sin acceso",
      description: "Solo para administradores.",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró nada.",
    },
    server: {
      title: "Error del servidor",
      description: "No se pudieron procesar las mediciones.",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió algo inesperado.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guarde o descarte primero sus cambios.",
    },
    conflict: {
      title: "Conflicto",
      description: "Los datos cambiaron mientras tanto.",
    },
  },
};
