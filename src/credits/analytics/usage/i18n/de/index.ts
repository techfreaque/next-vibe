import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Credit-Verbrauch",
    titleShort: "Verbrauch",
    description:
      "Credit-Ausgaben im Zeitverlauf: Konten vs. Gäste, Gratis- vs. Paket-Credits, nach Modell, Funktion und Anbieter, mit Anbieterkosten, Marge und Top-Nutzern.",
    tags: {
      usage: "Credit-Verbrauch",
      margin: "Marge",
    },
    fields: {
      actor: {
        label: "Nutzer",
        description: "Konten, Gäste (ohne Konto) oder beide",
      },
      creditKind: {
        label: "Credits",
        description: "Monatliches Gratiskontingent, Paket-Credits oder beide",
      },
      model: {
        label: "Modell",
        description: "Nur Ausgaben für diese Modell-ID",
      },
      feature: {
        label: "Funktion",
        description:
          "Nur Ausgaben für diese Funktion (Chat, Generate Image, ...)",
      },
      provider: {
        label: "Upstream-Anbieter",
        description: "Nur Ausgaben, die dieser Upstream-Anbieter bedient hat",
      },
      includeInternal: {
        label: "Admin-Konten einbeziehen",
        description: "Ausgaben von Admin-Konten mitzählen",
      },
    },
    response: {
      window: "Zeitraum",
      appliedFilters: "Aktive Filter",
      kpis: "Kennzahlen",
      spendByActor: "Ausgaben nach Nutzer",
      spendByKind: "Ausgaben nach Credit-Art",
      costVsSpend: "Ausgabenwert vs. Anbieterkosten",
      byModel: "Nach Modell",
      byFeature: "Nach Funktion",
      byProvider: "Nach Upstream-Anbieter",
      topSpenders: "Top-Nutzer",
    },
    errors: {
      validation: {
        title: "Ungültige Filter",
        description: "Zeitraum und Filter prüfen, dann erneut versuchen.",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Als Admin anmelden, um den Credit-Verbrauch zu sehen.",
      },
      forbidden: {
        title: "Nur für Admins",
        description: "Nur Admins sehen den Credit-Verbrauch.",
      },
      notFound: {
        title: "Nichts gefunden",
        description: "Keine Verbrauchsdaten zu dieser Anfrage.",
      },
      server: {
        title: "Bericht fehlgeschlagen",
        description:
          "Der Verbrauchsbericht konnte nicht erstellt werden. Erneut versuchen.",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Beim Laden des Berichts ist etwas schiefgelaufen.",
      },
      network: {
        title: "Verbindungsfehler",
        description: "Der Server ist nicht erreichbar.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Filteränderungen erst anwenden oder verwerfen.",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Die Daten haben sich beim Laden geändert. Bericht neu laden.",
      },
    },
    success: {
      title: "Bericht bereit",
      description: "Credit-Verbrauch geladen",
    },
  },
  widget: {
    extra: {
      nothingRecorded: "Nichts erfasst",
      paidShareHint2:
        "Gekaufte Pakete und Abos, am Verbrauch mit bekannter Finanzierung; {{missing}} ohne Herkunft",
      costedPct: "Kosten erfasst %",
      paidShare: "Bezahlt-Anteil",
      paidShareHint:
        "Verbrauch aus gekauften Paketen und Abos; Gesamtwert {{value}}",
      freeCostHint3:
        "Anbieterkosten von {{credits}} Gratis-Credits; Kosten erfasst für {{coverage}} des Verbrauchs",
      fundGrants: "Gutschriften",
      boughtPct: "Gekauft %",
      subPct: "Abo %",
      grantsPct: "Gutschr. %",
      unknownPct: "Herkunft fehlt %",
      fundingChart: "Verbrauch nach Finanzierung",
      fundingNote:
        "Gratis-Kontingent und der Pakettyp, aus dem jede Abbuchung kam. Herkunft unbekannt = Paket aufgebraucht und gelöscht.",
      fundAllowance: "Gratis-Kontingent",
      fundPurchased: "Gekauft",
      fundSubscription: "Abo",
      fundBonus: "Bonus-Gutschriften",
      fundEarned: "Empfehlungsprämien",
      fundUnknown: "Herkunft fehlt",
      change: "vs. vorher",
      paidPct: "Bezahlt %",
      topModel: "meist {{model}}",
      spendersHint: "von {{count}} Nutzern",
      accountTag: "Konto",
      freeCostHint2:
        "Anbieterkosten der Gratis-Nutzung; Kosten erfasst für {{coverage}} des Verbrauchs",
      notLoaded: "Bericht nicht geladen. Zum erneuten Versuch aktualisieren.",
      freeCost: "Kosten der Gratis-Nutzung",
      freeCostHint:
        "Anbieterkosten der Gratis-Kontingent-Nutzung, soweit erfasst",
      markup: "Rohgewinn (erfasst)",
      markupPct: "Marge",
      markupPctHint:
        "Nach Anbieterkosten verbleibend, zum Listenwert (0,01 $/Credit), kein Cash",
      kindNote2:
        "Paket-Credits umfassen Käufe, Abos und Admin-Gutschriften; welche verbraucht wurden, wird nicht erfasst.",
      modelNotRecorded: "Modell nicht erfasst",
      costedSpend: "Verbrauch mit erfassten Kosten",
      costChart: "Verbrauch mit erfassten Kosten vs. Anbieterkosten",
      marginHint2: "Auf {{value}} Verbrauch mit erfassten Kosten",
      marginHint:
        "{{value}} des Verbrauchswerts haben Kostendaten; Marge = dieser Wert minus Anbieterkosten",
      guestPct: "Gäste %",
      freePct: "Gratis %",
      noCost: "keine Kostendaten",
    },
    kpi: {
      creditsSpent: "Verbrauchte Credits",
      spendUsd: "Ausgabenwert",
      guestShare: "Gästeanteil",
      freeShare: "Gratisanteil",
      upstreamCostUsd: "Anbieterkosten",
      marginUsd: "Bruttomarge",
      marginPct: "Marge",
      activeSpenders: "Aktive Nutzer",
    },
    hint: {
      spendUsd: "Listenwert zu $0.01 pro Credit, kein Geldeingang",
      guestShare: "Von Besuchern ohne Konto verbraucht",
      freeShare: "Aus dem monatlichen Gratiskontingent bezahlt",
      upstreamCostUsd: "Erfasst bei {{coverage}} der Ausgaben",
      marginUsd: "Wert minus Anbieterkosten, nur Zeilen mit Kostendaten",
      marginPct: "Vom Ausgabenwert mit Kostendaten",
      activeSpenders: "Konten und Gäste mit Ausgaben",
    },
    chart: {
      actor: "Ausgaben: Konten vs. Gäste",
      kind: "Ausgaben: Gratiskontingent vs. Paket-Credits",
      kindNote: "Paket-Credits umfassen Käufe, Abos und Admin-Gutschriften.",
      cost: "Ausgabenwert vs. Anbieterkosten",
      costNote: "Anbieterkosten gibt es nur, wo die Abbuchung sie erfasst hat.",
    },
    series: {
      users: "Konten",
      guests: "Gäste",
      free: "Gratiskontingent",
      pack: "Paket-Credits",
      spendUsd: "Ausgabenwert",
      upstreamCostUsd: "Anbieterkosten",
    },
    breakdown: {
      model: "Modell",
      feature: "Funktion",
      provider: "Anbieter",
      spender: "Nutzer",
      byModel: "Nach Modell",
      byFeature: "Nach Funktion",
      byProvider: "Nach Upstream-Anbieter",
      topSpenders: "Top-Nutzer",
      topSpendersHint: "Zeile anklicken, um Konto oder Gast zu öffnen.",
      drillHint: "Zeile anklicken, um den Bericht zu filtern.",
    },
    column: {
      credits: "Credits",
      usd: "Wert",
      costUsd: "Kosten",
      marginPct: "Marge",
      spenders: "Nutzer",
      guestShare: "Gäste",
      freeShare: "Gratis",
      transactions: "Abbuchungen",
    },
    label: {
      noModel: "Tools und Medien",
      noFeature: "Nicht erfasst",
      noProvider: "Nicht erfasst",
      chat: "Chat",
      guest: "Gast {{id}}",
      guestTag: "Gast",
      lastActivity: "zuletzt {{date}}",
    },
    filter: {
      actor: "Nutzer",
      creditKind: "Credits",
      model: "Modell",
      feature: "Funktion",
      provider: "Anbieter",
      internal: "Inkl. Admins",
    },
    empty: "Keine Credit-Ausgaben in diesem Zeitraum.",
    includeInternal: "Admins einbeziehen",
  },
  enums: {
    actor: {
      all: "Alle",
      users: "Konten",
      guests: "Gäste",
    },
    creditKind: {
      all: "Alle Credits",
      free: "Gratis",
      pack: "Alle Pakete",
      purchased: "Gekauft",
      subscription: "Abo",
      grants: "Gutschriften",
    },
  },
};
