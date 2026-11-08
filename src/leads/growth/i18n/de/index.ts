import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Wachstum",
  tags: {
    vibeSense: "vibe-sense",
    growth: "wachstum",
    campaigns: "kampagnen",
    spend: "ausgaben",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "Erstbesuch",
      chat: "Erste Chatnachricht",
      signup: "Registrierung",
      newsletter: "Newsletter bestätigt",
      paid: "Erste Zahlung",
      retained: "Verlängerung im zweiten Monat",
    },
    attributionTouch: {
      first: "Erstkontakt",
      last: "Letztkontakt",
    },
    channelType: {
      all: "Alle Kanäle",
      campaign: "Kampagne (UTM)",
      referral: "Empfehlungscode",
      organic: "Organischer Verweis",
      direct: "Direkt",
    },
    paidKind: {
      subscription: "Abo",
      pack: "Credit-Paket",
    },
  },
  links: {
    get: {
      title: "Kampagnenlinks",
      titleShort: "Kampagnenlinks",
      description:
        "Getaggte Links pro Marketingkanal – mit Besuchen, Registrierungen und zahlenden Nutzern je Link.",
      response: {
        links: "Links",
      },
      widget: {
        title: "Kampagnenlinks",
        subtitle: "Jeden Kanaltest taggen. Gemessen wird, wer zahlt.",
        create: "Neuer Link",
        refresh: "Aktualisieren",
        loading: "Links werden geladen…",
        empty: {
          title: "Noch keine Kampagnenlinks",
          hint: "Ein Link pro Kanaltest. Jeder Besuch, jede Registrierung, jede Zahlung landet hier.",
          cta: "Ersten Link anlegen",
        },
        visits: "Besuche",
        signups: "Registrierungen",
        paid: "Zahlend",
        funnel:
          "{{visits}} Besuche → {{signups}} Registrierungen → {{paid}} zahlend",
        paidRate: "{{rate}} der Besuche zahlen",
        refCode: "Ref {{code}}",
        landsOn: "Ziel: {{path}}",
        copy: "Link kopieren",
        copied: "Kopiert",
        spend: "Kanalausgaben",
      },
    },
    post: {
      title: "Kampagnenlink anlegen",
      titleShort: "Neuer Link",
      description:
        "UTM-getaggten Link für einen Kanal bauen – optional an einen Empfehlungscode gebunden.",
      fields: {
        name: {
          label: "Name",
          description: "Interner Name, z. B. 'Reddit r/LocalLLaMA Launch-Post'",
          placeholder: "Reddit Launch-Post",
        },
        channel: {
          label: "Quelle (utm_source)",
          description: "Woher der Traffic kommt: reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "Medium (utm_medium)",
          description: "Art des Traffics: social, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "Kampagne (utm_campaign)",
          description: "Der Test, zu dem dieser Link gehört",
          placeholder: "launch-nov",
        },
        content: {
          label: "Inhalt (utm_content)",
          description: "Optional. Welches Motiv oder welche Platzierung",
          placeholder: "top-kommentar",
        },
        term: {
          label: "Begriff (utm_term)",
          description: "Optional. Bezahltes Keyword",
          placeholder: "unzensierte ki",
        },
        destinationPath: {
          label: "Zielpfad",
          description:
            "Pfad auf dieser Seite, den der Link öffnet, z. B. / oder /de-DE/story",
          placeholder: "/",
        },
        refCode: {
          label: "Empfehlungscode",
          description:
            "Optional. Leitet über /track, damit auch der Empfehlungscode gutgeschrieben wird",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "Link-ID",
        url: "Kampagnen-URL",
      },
      widget: {
        back: "Zurück",
        hint: "Gleicher Kanal, immer gleiche Quelle. Ausgaben und Kosten pro zahlendem Nutzer gruppieren nach Quelle.",
        created: "Link steht. Genau diese URL teilen:",
        copy: "Link kopieren",
        copied: "Kopiert",
      },
    },
  },
  spend: {
    get: {
      title: "Kanalausgaben",
      titleShort: "Kanalausgaben",
      description:
        "Ausgaben pro Kanal und Zeitraum – mit Registrierungen, zahlenden Nutzern und Kosten pro zahlendem Nutzer.",
      response: {
        rows: "Ausgabeneinträge",
      },
      widget: {
        title: "Kanalausgaben",
        subtitle:
          "Was jeder Kanal kostet – und was dich ein zahlender Nutzer kostet.",
        add: "Ausgabe erfassen",
        refresh: "Aktualisieren",
        loading: "Ausgaben werden geladen…",
        empty: {
          title: "Keine Ausgaben erfasst",
          hint: "Trag ein, was ein Kanaltest gekostet hat. Die Kosten pro zahlendem Nutzer erscheinen, sobald jemand zahlt.",
          cta: "Erste Ausgabe erfassen",
        },
        period: "{{from}} – {{to}}",
        signups: "Registrierungen",
        paid: "Zahlende Nutzer",
        costPerPaid: "Kosten / Zahler",
        costPerSignup: "Kosten / Registrierung",
        none: "—",
        attribution:
          "Nutzer zählen für den Kanal, der sie zuerst gebracht hat (Erstkontakt), innerhalb des Zeitraums.",
      },
    },
    post: {
      title: "Kanalausgabe erfassen",
      titleShort: "Ausgabe erfassen",
      description:
        "Kosten eines Kanals für einen Zeitraum erfassen. Gleicher Kanal und Startdatum überschreibt den Eintrag.",
      fields: {
        channel: {
          label: "Kanal",
          description:
            "utm_source des Kanals oder ref:CODE für einen Empfehlungspartner",
          placeholder: "reddit",
        },
        periodStart: {
          label: "Von",
          description: "Erster Tag des Zeitraums",
        },
        periodEnd: {
          label: "Bis",
          description: "Letzter Tag des Zeitraums",
        },
        amount: {
          label: "Betrag",
          description: "Gesamtausgaben im Zeitraum",
        },
        currency: {
          label: "Währung",
          description: "Währung des Betrags",
        },
        note: {
          label: "Notiz",
          description: "Optional. Wofür das Geld ging",
          placeholder: "2 beworbene Posts",
        },
      },
      response: {
        id: "Eintrags-ID",
      },
      widget: {
        back: "Zurück",
        hint: "Exakt den Quellnamen der Kampagnenlinks verwenden – sonst kann der Graph Ausgaben keinen Nutzern zuordnen.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Auflösung", description: "Bucket-Größe" },
      range: { label: "Zeitraum", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Zusätzliche Balken vor Zeitraumbeginn",
      },
      meta: { label: "Meta", description: "Ausführungsmetadaten des Knotens" },
      touch: {
        label: "Attribution",
        description: "Nach Erst- oder Letztkontakt gruppieren",
      },
      channelType: {
        label: "Kanaltyp",
        description: "Kampagne, Empfehlung, organisch, direkt – oder alle",
      },
      channel: {
        label: "Kanal",
        description:
          "Exakter Kanalschlüssel: utm_source, ref:CODE, Verweis-Host oder direct. Leer = alle",
      },
      currency: {
        label: "Währung",
        description: "Nur Ausgaben in dieser Währung werden summiert",
      },
    },
    funnelStep: {
      post: {
        title: "Funnel-Schritt",
        titleShort: "Funnel-Schritt",
        description:
          "Journeys pro Bucket, die einen Funnel-Schritt erreichen – nach Kanal filterbar",
        fields: {
          step: {
            label: "Schritt",
            description:
              "Funnel-Schritt: Besuch, Chat, Registrierung, Newsletter, Zahlung, Verlängerung",
          },
          result: {
            label: "Journeys",
            description: "Anzahl pro Bucket",
          },
        },
      },
    },
    channelSpend: {
      post: {
        title: "Kanalausgaben",
        titleShort: "Kanalausgaben",
        description:
          "Erfasste Marketingausgaben pro Bucket, gleichmäßig über den Zeitraum verteilt",
        fields: {
          result: { label: "Ausgaben", description: "Ausgaben pro Bucket" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Markierte Felder prüfen",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Als Admin anmelden",
    },
    forbidden: {
      title: "Nur für Admins",
      description: "Wachstumswerkzeuge brauchen die Admin-Rolle",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Diesen Eintrag gibt es nicht",
    },
    conflict: {
      title: "Konflikt",
      description: "Eintrag wurde zwischenzeitlich geändert – neu laden",
    },
    server: {
      title: "Serverfehler",
      description: "Anfrage konnte nicht abgeschlossen werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist fehlgeschlagen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Änderungen zuerst speichern oder verwerfen",
    },
    invalidRefCode: "Empfehlungscode {{code}} existiert nicht oder ist inaktiv",
    invalidPeriod: "Das Enddatum muss am oder nach dem Startdatum liegen",
    invalidDestination:
      "Der Zielpfad muss mit / beginnen und auf dieser Seite bleiben",
  },
  success: {
    title: "Erledigt",
    description: "Gespeichert",
  },
};
