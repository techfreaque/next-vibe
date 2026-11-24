import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  breadcrumbs: { home: "Inicio" },
  meta: {
    defaultTitle: "unbottled.ai: Chat de AI sin censura",
    category: "AI Chat Platform",
    description:
      "Experimente conversaciones AI verdaderamente sin censura con modelos {{modelCount}}. Sin filtros, sin restricciones, solo honesta AI.",
    imageAlt: "unbottled.ai: Plataforma de Chat de AI sin censura",
    keywords:
      "AI sin censura, AI chat, GPT-4, Claude, Gemini, AI modelos, sin filtros, conversaciones AI honestas, AI",
  },
  structuredData: {
    app: {
      description:
        "AI chat con modelos {{modelCount}} de laboratorios {{providerCount}}: estándar, abierto y sin censura. Elige el nivel de filtro por chat. Paga por uso con créditos. Fuente abierta y auto-hostable.",
      freeOffer:
        "{{guest}} créditos gratis por mes sin cuenta, {{signedIn}} con una cuenta gratuita, {{max}} con una cuenta gratuita y el boletín informativo. No se necesita tarjeta.",
      yearlyName: "Suscripción anual",
      yearlyDescription:
        "Créditos {{subCredits}} por mes, facturado anualmente",
    },
    pricing: {
      name: "Planes y créditos {{appName}}",
      description:
        "Créditos gratis cada mes, cuatro planes mensuales y paquetes para recargar. Un solo saldo para {{modelCount}} modelos de chat y para los modelos de imágenes, video, música y voz.",
    },
    organization: {
      types: {
        organization: "Organización",
        contactPoint: "ContactPoint",
      },
      contactPoint: {
        contactType: "Servicio al Cliente",
      },
    },
  },
  constants: {
    languages: {
      it: "Italiano",
      es: "Español",
      en: "Inglés",
      de: "Alemán",
      pl: "Polaco",
      fr: "Francés",
    },
  },
};
