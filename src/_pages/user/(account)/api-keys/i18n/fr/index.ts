import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Clés API",
  metaTitle: "Clés API - {{appName}}",
  description:
    "Une clé, {{modelCount}} modèles. Formats OpenAI et Anthropic, facturé sur vos crédits.",
  unauthenticated: {
    title: "Connectez-vous pour gérer vos clés API",
    subtitle:
      "Les clés sont liées à votre compte. Connectez-vous, choisissez une offre à partir de {{subPrice}} par mois, et votre première clé est prête en quelques secondes.",
    point1:
      "{{modelCount}} modèles derrière un seul endpoint compatible OpenAI",
    point2:
      "Fonctionne dans Claude Code, Codex, OpenCode, Cline et tout SDK OpenAI",
    point3: "Même prix que le chat. Pas de facture API à part.",
    logIn: "Se connecter",
    signUp: "Créer un compte",
    docs: "Lire d'abord la doc de l'API",
  },
};
