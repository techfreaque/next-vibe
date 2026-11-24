import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    status: {
      allowed: "Usage commercial autorisé",
      restricted: "Usage commercial restreint",
      unclear: "Usage commercial incertain",
    },
    reason: {
      openLicense: "Licence ouverte qui autorise l'usage commercial.",
      providerTerms:
        "Les conditions du fournisseur autorisent l'usage commercial des résultats.",
      nonCommercialLicense:
        "La licence du modèle n'autorise qu'un usage non commercial.",
      separateLicense:
        "L'usage commercial exige une licence distincte du créateur du modèle.",
      useLimits:
        "Le fournisseur exclut certains usages commerciaux, comme le cinéma, la télévision, les jeux vidéo et la revente.",
      communityLicense:
        "Licence communautaire avec des restrictions d'usage supplémentaires. L'usage commercial n'est pas confirmé.",
      hostPersonalUse:
        "Les conditions de l'hébergeur ne couvrent que l'usage personnel.",
      vendorApproval:
        "Le créateur du modèle n'accorde l'usage commercial que sur demande.",
      termsUnconfirmed:
        "Nous n'avons pas encore pu confirmer les conditions du fournisseur.",
    },
  },
  label: "Usage commercial",
  checkLicense: "Vérifiez la licence du modèle pour votre usage.",
  termsLink: "Comment fonctionnent les droits sur les contenus IA",
};
