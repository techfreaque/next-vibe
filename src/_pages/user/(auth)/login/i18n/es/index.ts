import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Inicia sesión en {{appName}}",
    description: "Inicia sesión en tu cuenta de {{appName}}",
    category: "Autenticación",
    imageAlt: "Inicio de sesión",
    keywords: "inicio de sesión, entrar, cuenta, {{appName}}",
    ogTitle: "Inicia sesión en {{appName}}",
    ogDescription: "Accede a tu cuenta de {{appName}}",
    twitterTitle: "Inicia sesión en {{appName}}",
    twitterDescription: "Accede a tu cuenta y a tus conversaciones",
  },
  errors: {
    failedToLoadBrowserIdentity:
      "No se pudo cargar la identidad del navegador. Actualiza la página.",
  },
};
