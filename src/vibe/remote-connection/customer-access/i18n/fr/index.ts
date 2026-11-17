import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  denied: {
    notPaid:
      "Connecter votre propre instance demande un compte payant. N'importe quel pack de crédits ou abonnement le débloque.",
    noConnection:
      "Aucune connexion active pour ce compte. Connectez d'abord votre instance, puis réessayez.",
    connectionLimit:
      "Limite atteinte : {{max}} instances par compte. Déconnectez-en une pour en ajouter une autre.",
    rateLimited:
      "Trop de requêtes depuis votre instance. Réessayez dans {{seconds}} s.",
    invalidUrl:
      "L'URL de l'instance doit être une origine simple, comme https://mon-serveur.example.com, sans chemin ni paramètres.",
  },
};
