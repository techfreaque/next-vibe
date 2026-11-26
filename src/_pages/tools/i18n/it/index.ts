import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Strumenti AI",
  backToChat: "Torna a Chat",
  description:
    "Gestire quali strumenti sono disponibili per l'utilizzo di AI. Strumenti Pin per includerli sempre in contesto.",
  openFullPage: "Aprire la pagina completa",
  modal: {
    title: "Strumenti AI",
    description:
      "Gestire quali strumenti sono disponibili per l'utilizzo di AI. Strumenti Pin per includerli sempre in contesto.",
  },
  widget: {
    tools: "Strumenti",
    overrideForSlot: "Impostazioni degli strumenti di override per questa slot",
    inheritedDefaults:
      "Attualmente utilizzando i default ereditati. Attivare la personalizzazione.",
    customToolsConfigured:
      "Strumenti personalizzati configurati per questa slot.",
    deselectAll: "Deseletti tutti",
    selectAll: "Seleziona tutto",
    reset: "Ripristino",
    pinnedToContext: "incentrata sul contesto",
    requiresConfirmation: "richiede conferma",
    loadingTools: "Strumenti di caricamento...",
  },
  loadError: {
    title: "Impossibile caricare l’area admin",
    message:
      "Non è stato possibile verificare la sessione. Ricarica la pagina; se il problema continua, accedi di nuovo.",
    reload: "Ricarica",
    signIn: "Accedi",
  },
};
