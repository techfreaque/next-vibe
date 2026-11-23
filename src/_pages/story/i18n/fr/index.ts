import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Chat IA sans censure : {{modelCount}} modèles, essai gratuit | {{appName}}",
    category: "Plateforme de chat IA",
    description:
      "{{modelCount}} modèles d'IA dans un seul chat, dont {{uncensoredCount}} non censurés ou abliterated. Dans le navigateur, jusqu'à {{credits}} crédits offerts aux invités. Sans inscription. Le filtre, c'est vous.",
    imageAlt: "{{appName}}, la plateforme de chat IA non censurée",
    keywords:
      "IA sans censure, IA non censurée, chat IA sans filtre, modèles abliterated, chatbot IA, modèles d'IA",
  },
  common: {
    error: {
      title: "Erreur",
      message: "Une erreur s'est produite",
    },
  },
};
