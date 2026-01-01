import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    overview: "Übersicht",
    campaigns: "E-Mail-Liste",
    imap: "IMAP-Server",
    smtp: "SMTP-Konten",
    smtpDescription: "SMTP-E-Mail-Konten und -Konfigurationen verwalten",
    templates: "E-Mail-Vorlagen",
  },
  admin: {
    title: "E-Mail-Verwaltung",
    description:
      "Überwachen Sie E-Mail-Kampagnen, verfolgen Sie die Leistung und analysieren Sie das Engagement",
    stats: {
      title: "E-Mail-Statistiken",
    },
  },
};
