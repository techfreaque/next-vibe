import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    dateRangePreset: {
      today: "Heute",
      yesterday: "Gestern",
      last7Days: "Letzte 7 Tage",
      last30Days: "Letzte 30 Tage",
      last90Days: "Letzte 90 Tage",
      thisWeek: "Diese Woche",
      lastWeek: "Letzte Woche",
      thisMonth: "Dieser Monat",
      lastMonth: "Letzter Monat",
      thisQuarter: "Dieses Quartal",
      lastQuarter: "Letztes Quartal",
      thisYear: "Dieses Jahr",
      lastYear: "Letztes Jahr",
      custom: "Benutzerdefiniert",
    },
    timePeriod: {
      hour: "Stunde",
      day: "Tag",
      week: "Woche",
      month: "Monat",
      quarter: "Quartal",
      year: "Jahr",
    },
    chartDataField: {
      count: "Gesamtanzahl",
      completed: "Abgeschlossen",
      cancelled: "Storniert",
      noShow: "Nicht erschienen",
    },
    chartType: {
      line: "Liniendiagramm",
      bar: "Balkendiagramm",
      area: "Flächendiagramm",
      pie: "Kreisdiagramm",
      donut: "Ringdiagramm",
    },
  },
  get: {
    title: "Beratungsstatistiken",
    description: "Umfassende Beratungsanalyse und Berichte anzeigen",
    container: {
      title: "Statistik-Dashboard",
      description:
        "Beratungsdaten mit erweiterten Filter- und Visualisierungsoptionen analysieren",
    },

    // Request field translations
    dateRangePreset: {
      label: "Datumsbereich-Voreinstellung",
      description: "Wählen Sie einen vordefinierten Datumsbereich zum Filtern",
      placeholder: "Datumsbereich-Voreinstellung wählen",
    },
    status: {
      label: "Beratungsstatus",
      description: "Nach Beratungsstatus filtern",
      placeholder: "Status-Filter wählen",
    },
    outcome: {
      label: "Beratungsergebnis",
      description: "Nach Beratungsergebnis filtern",
      placeholder: "Ergebnis-Filter wählen",
    },
    consultationType: {
      label: "Beratungstyp",
      description: "Nach Beratungstyp filtern",
      placeholder: "Beratungstyp wählen",
    },
    timePeriod: {
      label: "Zeitraum",
      description: "Zeitraum für die Datengruppierung wählen",
      placeholder: "Zeitraum wählen",
    },
    chartType: {
      label: "Diagrammtyp",
      description: "Visualisierungsdiagrammtyp wählen",
      placeholder: "Diagrammtyp wählen",
    },
    userId: {
      label: "Benutzer-ID",
      description: "Nach spezifischer Benutzer-ID filtern",
      placeholder: "Benutzer-ID eingeben",
    },
    leadId: {
      label: "Lead-ID",
      description: "Nach spezifischer Lead-ID filtern",
      placeholder: "Lead-ID eingeben",
    },
    hasUserId: {
      label: "Hat Benutzer-ID",
      description: "Beratungen filtern, die einen zugehörigen Benutzer haben",
    },
    hasLeadId: {
      label: "Hat Lead-ID",
      description: "Beratungen filtern, die einen zugehörigen Lead haben",
    },
    groupBy: {
      label: "Gruppieren nach",
      description: "Statistiken nach Feld gruppieren",
      placeholder: "Gruppierungsfeld wählen",
      options: {
        status: "Status",
        outcome: "Ergebnis",
        type: "Typ",
        consultant: "Berater",
        date: "Datum",
      },
    },

    // Response field translations
    response: {
      title: "Statistik-Antwort",
      description: "Beratungsstatistik-Antwortdaten",
      totalConsultations: {
        title: "Gesamtberatungen",
        description: "Gesamtzahl der Beratungen",
      },
      scheduledConsultations: {
        title: "Geplante Beratungen",
        description: "Anzahl geplanter Beratungen",
      },
      completedConsultations: {
        title: "Abgeschlossene Beratungen",
        description: "Anzahl abgeschlossener Beratungen",
      },
      cancelledConsultations: {
        title: "Stornierte Beratungen",
        description: "Anzahl stornierter Beratungen",
      },
      noShowConsultations: {
        title: "Nicht erschienene Beratungen",
        description: "Anzahl nicht erschienener Beratungen",
      },
      rescheduledConsultations: {
        title: "Umgeplante Beratungen",
        description: "Anzahl umgeplanter Beratungen",
      },
      pendingConsultations: {
        title: "Ausstehende Beratungen",
        description: "Anzahl ausstehender Beratungen",
      },
      totalRevenue: {
        title: "Gesamtumsatz",
        description: "Gesamtumsatzbetrag",
      },
      averageRevenue: {
        title: "Durchschnittsumsatz",
        description: "Durchschnittlicher Umsatz pro Beratung",
      },
      averageDuration: {
        title: "Durchschnittsdauer",
        description: "Durchschnittliche Beratungsdauer",
      },
      completionRate: {
        title: "Abschlussrate",
        description: "Beratungsabschlussrate in Prozent",
      },
      cancellationRate: {
        title: "Stornierungsrate",
        description: "Beratungsstornierungsrate in Prozent",
      },
      noShowRate: {
        title: "Nicht-Erscheinen-Rate",
        description: "Nicht-Erscheinen-Rate in Prozent",
      },
      rescheduleRate: {
        title: "Umplanungsrate",
        description: "Umplanungsrate in Prozent",
      },

      consultationsByStatus: {
        title: "Beratungen nach Status",
        description: "Aufschlüsselung der Beratungen nach Status",
        item: "Status-Aufschlüsselungselement",
        status: "Statuswert",
        count: "Anzahl für diesen Status",
        percentage: "Prozentsatz für diesen Status",
      },
      consultationsByType: {
        title: "Beratungen nach Typ",
        description: "Aufschlüsselung der Beratungen nach Typ",
        item: "Typ-Aufschlüsselungselement",
        type: "Typwert",
        count: "Anzahl für diesen Typ",
        percentage: "Prozentsatz für diesen Typ",
      },
      consultationsByDuration: {
        title: "Beratungen nach Dauer",
        description: "Aufschlüsselung der Beratungen nach Dauer",
        item: "Dauer-Aufschlüsselungselement",
        durationRange: "Dauerbereich",
        count: "Anzahl für diesen Dauerbereich",
        percentage: "Prozentsatz für diesen Dauerbereich",
      },
      consultationsByTimeSlot: {
        title: "Beratungen nach Zeitfenster",
        description: "Aufschlüsselung der Beratungen nach Zeitfenster",
        item: "Zeitslot-Aufschlüsselungselement",
        timeSlot: "Zeitslot-Wert",
        count: "Anzahl für diesen Zeitslot",
        percentage: "Prozentsatz für diesen Zeitslot",
      },
      consultationsByConsultant: {
        title: "Beratungen nach Berater",
        description: "Aufschlüsselung der Beratungen nach Berater",
        item: "Berater-Aufschlüsselungselement",
        consultantId: "Berater-ID",
        consultantName: "Beratername",
        count: "Anzahl für diesen Berater",
        percentage: "Prozentsatz für diesen Berater",
      },
      historicalData: {
        title: "Historische Daten",
        description: "Historische Beratungsdaten über Zeit",
        item: "Historischer Datenpunkt",
        date: "Datum für diesen Datenpunkt",
        count: "Gesamtanzahl für dieses Datum",
        completed: "Abgeschlossene Anzahl für dieses Datum",
        cancelled: "Stornierte Anzahl für dieses Datum",
        noShow: "Nicht-Erscheinen-Anzahl für dieses Datum",
      },
      groupedStats: {
        title: "Gruppierte Statistiken",
        description: "Gruppierte Beratungsstatistiken",
        item: "Gruppiertes Statistikelement",
        groupKey: "Gruppenschlüssel-Identifikator",
        groupValue: "Gruppenwert",
        count: "Anzahl für diese Gruppe",
        percentage: "Prozentsatz für diese Gruppe",
      },
    },

    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Nicht gespeicherte Änderungen erkannt",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Statistiken erfolgreich abgerufen",
    },
  },
};
