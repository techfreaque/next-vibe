import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  snapshot: "Dati al {{date}}",
  reviewErrors: "Controlli gli errori",
  reviewTasks: "Controlli le attività non riuscite",
  reviewConnections: "Controlli le connessioni",
  title: "Panoramica operativa",
  description:
    "Controlla gli errori aperti, le attività non riuscite e le istanze connesse.",
  errors: "Classi di errori aperte",
  tasks: "Attività non riuscite",
  connections: "Connessioni con problemi",
  errorAlert: "Classi di errori aperte, avvisi esclusi ({{count}})",
  taskAlert: "Attività pianificate non riuscite ({{count}})",
  connectionAlert: "Connessioni da verificare ({{count}})",
  attention: "Da verificare",
  clear: "Questi controlli non segnalano problemi aperti.",
  unavailable: "Alcuni controlli non sono disponibili.",
  recent: "Attività recente",
  loading: "Caricamento dello stato del sistema",
  retry: "Riprova",
};
