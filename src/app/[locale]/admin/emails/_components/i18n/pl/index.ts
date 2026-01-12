import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    overview: "Przegląd",
    campaigns: "Lista e-maili",
    imap: "Serwer IMAP",
    smtp: "Konta SMTP",
    smtpDescription: "Zarządzaj kontami e-mail SMTP i konfiguracjami",
    templates: "Szablony e-mail",
  },
  admin: {
    title: "Zarządzanie pocztą e-mail",
    description:
      "Monitoruj kampanie e-mailowe, śledź wydajność i analizuj zaangażowanie",
    stats: {
      title: "Statystyki e-mail",
    },
  },
};
