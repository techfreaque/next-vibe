import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "IndexNow-Übermittlung",
    titleShort: "IndexNow",
    description:
      "Meldet Bing, Yandex, Seznam, Naver und Yep jede neue oder geänderte Sitemap-URL. Nur in Produktion, bereits gemeldete URLs werden übersprungen.",
    tag: "SEO",
    container: {
      title: "IndexNow-Lauf",
      description: "Was an die Suchmaschinen ging",
    },
    fields: {
      force: {
        label: "Alles neu melden",
        description:
          "Jede Sitemap-URL erneut senden, nicht nur neue oder geänderte.",
      },
      dryRun: {
        label: "Probelauf",
        description: "Offene URLs zählen, ohne sie zu senden.",
      },
    },
    response: {
      status: "Status",
      host: "Host",
      totalUrls: "Sitemap-URLs",
      pendingUrls: "Offene URLs",
      submittedUrls: "Gemeldete URLs",
      requests: "Gesendete Anfragen",
    },
    errors: {
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melde dich als Admin an, um URLs zu übermitteln.",
      },
      forbidden: {
        title: "Nur für Admins",
        description: "Nur Admins können URLs an IndexNow senden.",
      },
      server: {
        title: "Übermittlung fehlgeschlagen",
        description:
          "IndexNow hat abgelehnt oder die Sitemap ließ sich nicht erstellen. Server-Log prüfen.",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Beim Übermitteln der URLs ist etwas schiefgelaufen.",
      },
      validation: {
        title: "Ungültige Eingabe",
        description: "Prüfe die Optionen.",
      },
      network: {
        title: "IndexNow nicht erreichbar",
        description:
          "Die IndexNow-API hat nicht geantwortet. Der nächste Lauf sendet die offenen URLs erneut.",
      },
    },
    success: { title: "Fertig", description: "IndexNow-Lauf abgeschlossen." },
  },
  enums: {
    status: {
      submitted: "Gemeldet",
      unchanged: "Nichts Neues",
      dryRun: "Probelauf",
      notProduction: "Übersprungen (keine Produktion)",
    },
  },
  task: {
    description:
      "Stündlich: meldet neue oder geänderte Sitemap-URLs per IndexNow (Bing, Yandex und Partner).",
  },
};
