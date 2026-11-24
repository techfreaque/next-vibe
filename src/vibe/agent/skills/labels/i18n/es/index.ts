import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    category: {
      companion: "Compañeros",
      assistant: "Assistants",
      coding: "Programación",
      creative: "Creativo",
      writing: "Escribir",
      analysis: "Análisis",
      roleplay: "Juego de rol",
      education: "Educación",
      controversial: "Controversial",
      background: "Antecedentes",
      custom: "Personalizado",
    },
    source: {
      all: "Todos",
      builtIn: "Incorporación",
      my: "Mina",
      community: "Comunidad",
    },
    ownershipType: {
      system: "Capacidad incorporada",
      user: "Creado por usted",
      public: "De la comunidad",
    },
    voice: {
      male: "Voz masculina",
      female: "Voz femenina",
    },
    mode: {
      auto: "Automático",
      manual: "Manual",
    },
    selectionType: {
      skillBased: "Basado en la habilidad",
      manual: "Modelo específico",
      filters: "Criterios de filtro",
    },
    intelligence: {
      quick: "Rápido",
      smart: "Smart y Cheap",
      brilliant: "Brillante",
    },
    price: {
      cheap: "barato",
      standard: "Estándar",
      premium: "Premium",
    },
    content: {
      mainstream: "Convencional",
      open: "Abierto",
      uncensored: "Sin censura",
    },
    skillType: {
      persona: "Persona",
      specialist: "Especialista",
      toolBundle: "Herramienta Bundle",
    },
    skillStatus: {
      draft: "Proyecto",
      published: "Publicado",
      unlisted: "No incluidos en la lista",
    },
    trustLevel: {
      community: "Comunidad",
      verified: "Verificado",
    },
    voteDirection: {
      up: "Subtítulos",
      down: "Downvote",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Inteligencia",
      price: "Precio",
      content: "Contenido",
    },
    sortDirection: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
  },
};
