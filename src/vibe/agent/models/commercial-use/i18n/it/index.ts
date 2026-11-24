import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    status: {
      allowed: "Uso commerciale consentito",
      restricted: "Uso commerciale limitato",
      unclear: "Uso commerciale non chiarito",
    },
    reason: {
      openLicense: "Licenza aperta che consente l'uso commerciale.",
      providerTerms:
        "Le condizioni del fornitore consentono l'uso commerciale dei risultati.",
      nonCommercialLicense:
        "La licenza del modello consente solo l'uso non commerciale.",
      separateLicense:
        "L'uso commerciale richiede una licenza separata del creatore del modello.",
      useLimits:
        "Il fornitore esclude alcuni usi commerciali, come cinema, TV, videogiochi e rivendita.",
      communityLicense:
        "Licenza community con ulteriori limiti d'uso. L'uso commerciale non è confermato.",
      hostPersonalUse:
        "Le condizioni del fornitore di hosting coprono solo l'uso personale.",
      vendorApproval:
        "Il creatore del modello concede l'uso commerciale solo su richiesta.",
      termsUnconfirmed:
        "Non abbiamo ancora potuto verificare le condizioni del fornitore.",
    },
  },
  label: "Uso commerciale",
  checkLicense: "Verifica la licenza del modello per il tuo utilizzo.",
  termsLink: "Come funzionano i diritti sui contenuti IA",
};
