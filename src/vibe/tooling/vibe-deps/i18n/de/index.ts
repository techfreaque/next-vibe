import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "All-in-one-Abhängigkeitsanalyse. Bildet den Import-Graphen der gesamten Codebasis ab und erzwingt Paketgrenzen. --mode=files / categories / unused für Import-Graph und toten Code. --mode=boundaries zeigt jeden Import eines Pakets in App-Code (die Verschiebungen vor der Extraktion). --mode=layers meldet illegale Paketrichtung. --mode=shared-candidates rankt App-Primitive, von denen die Pakete bereits abhängen. --mode=importers --focus=X schlüsselt die Importeure einer Datei nach Paket auf.",
  category: "Entwicklungstools",
  tag: "analyse",

  mode: {
    report: "Bericht",
    files: "Dateien",
    categories: "Kategorien",
    unused: "Ungenutzt",
    boundaries: "Grenzen",
    layers: "Schichten",
    sharedCandidates: "Geteilte Kandidaten",
    importers: "Importeure",
    needsMove: "Zu verschieben",
    unusedSymbols: "Ungenutzte Symbole",
    crossDomain: "Domänenübergreifend",
    pageViolations: "Seitenverstöße",
  },

  container: {
    title: "Abhängigkeitsanalyse",
    description: "Umfang und Modus der Abhängigkeitsprüfung konfigurieren",
  },

  fields: {
    focus: {
      label: "Fokus-Pfad",
      description:
        "Auf eine bestimmte Datei oder ein Verzeichnis einschränken (z. B. 'agent/ai-stream' oder 'user'). Leer lassen für die gesamte Codebasis.",
      placeholder: "z. B. agent/ai-stream oder user",
    },
    mode: {
      label: "Modus",
      description:
        "files: Datei-Importgraph. categories: Zusammengefasst nach Top-Level-Verzeichnis. unused: Dateien ohne Importeure. boundaries: Paket-Importe in App-Code. layers: illegale Paketrichtung. shared-candidates: App-Primitive, von denen Pakete abhängen. importers: Importeure einer Datei nach Paket (braucht --focus).",
    },
    package: {
      label: "Paket",
      description:
        "boundaries/layers auf ein einzelnes deklariertes Paket einschränken (z. B. vibe-ui, vibe-unified-ui). Leer lassen für alle Pakete.",
      placeholder: "z. B. vibe-unified-ui",
    },
    depth: {
      label: "Tiefe",
      description:
        "Wie viele Ebenen transitiver Abhängigkeiten einbezogen werden (Standard: 1, nur direkte). 0 = unbegrenzt.",
    },
    limit: {
      label: "Limit",
      description: "Maximale Anzahl zurückgegebener Einträge (Standard: 100).",
    },
  },

  response: {
    success: "Abhängigkeitsanalyse abgeschlossen",
    entries: {
      title: "Abhängigkeitseinträge",
      emptyState: {
        description: "Keine Dateien für den angegebenen Filter gefunden.",
      },
      importedBy: "importiert von",
    },
    summary: {
      title: "Zusammenfassung",
      totalFiles: "Gesamtzahl geprüfter Dateien",
      totalEdges: "Gesamtzahl Import-Kanten",
      unusedCount: "Ungenutzte Exports",
    },
    boundaries: {
      title: "Paketgrenzen",
      cleanState: "Keine Grenzverletzungen. Pakete sind in sich geschlossen.",
      legendTitle: "Legende",
      legendOut: "out-of-package (Paket greift in App-Code)",
      legendCross: "cross-package (illegale Abhängigkeit)",
      legendReverse: "reverse-direction (untere Schicht importiert obere)",
      legendHot: "heißes Ziel (10+ Importeure — stärkster Sog in den Core)",
      colTarget: "Ziel",
      colCount: "Nutzungen",
      colKind: "Art",
      packageHeader: "Paket",
      violationsAcross: "Verletzungen über",
      packagesWord: "Pakete",
    },
    layers: {
      title: "Schichtrichtung",
      cleanState: "Richtung ist sauber. Keine illegalen Paket-Importe.",
      edge: "importiert",
    },
    sharedCandidates: {
      title: "Geteilte Kandidaten",
      description:
        "App-Code-Dateien, die von Paketen importiert werden, nach Paket-Importeur-Anzahl. Hoch = in vibe-core ziehen.",
      colCount: "Paket-Nutzungen",
      colPath: "Pfad",
      emptyState: "Keine App-Dateien werden von Paket-Code importiert.",
    },
    importers: {
      title: "Importeure nach Paket",
      colCount: "Nutzungen",
      colGroup: "Paket / Kategorie",
    },
    needsMove: {
      title: "Verschiebeliste",
      description:
        "Dateien noch nicht an ihrer endgültigen Position, nach Zielbereich gruppiert. Bereits platzierte (Whitelist) bleiben still. Von oben nach unten lesen — das ist die Verschiebereihenfolge.",
      colTarget: "→ Bereich",
      colPath: "Datei",
      emptyState: "Alles im Umfang ist platziert. Nichts zu verschieben.",
      relocate: "Umzug",
      reorganize: "Reorg",
    },
    unusedSymbols: {
      title: "Ungenutzte öffentliche Oberfläche",
      description:
        "Tote Exports, ungenutzte statische Methoden und Dateien ohne Importeure. Regex-basierte Signale zur Prüfung — konservativ (dynamische Nutzung kann fehlen).",
      colKind: "Art",
      colSymbol: "Symbol",
      colPath: "Datei",
      emptyState: "Keine ungenutzte öffentliche Oberfläche im Umfang.",
      wholeFile: "(ganze Datei — keine Importeure)",
    },
    pageViolations: {
      title: "Seitenarchitektur-Verstöße",
      description:
        "page.tsx-Dateien, die mehr als Repository/Definition/i18n/page-client importieren. Seiten müssen dünne SSR-Hüllen sein — Geschäftslogik, UI, Enums und DB-Zugriff gehören in repository.ts oder page-client.tsx.",
      colCount: "Verstöße",
      colPath: "Seite",
      emptyState: "Alle page.tsx-Dateien respektieren die Architekturgrenze.",
    },
    crossDomain: {
      title: "Domänenübergreifende Kandidaten",
      description:
        "Importe, die eine Domänengrenze überschreiten und KEIN erlaubtes Framework-Primitiv sind. Jeder ist ein Kandidat zur Beförderung in vibe (engine/core) oder zum Entkoppeln. Meist-erreichte zuerst. Erlaubte Primitiv-Kanten werden separat gezählt, nicht versteckt.",
      colCount: "Nutzungen",
      colTarget: "angefordertes Ziel",
      emptyState:
        "Keine ungeprüften domänenübergreifenden Kanten. Alles Überschreitende ist erlaubt.",
      allowedTally: "erlaubte Primitiv-Kanten (nicht gelistet)",
    },
    violations: {
      title: "Verletzungen",
      outOfPackage: "Aus Paket heraus",
      crossPackage: "Paketübergreifend",
      reverseDirection: "Falsche Richtung",
      total: "Gesamt",
    },
  },

  errors: {
    validation: {
      title: "Ungültige Parameter",
      description: "Die Abhängigkeitsanalyse-Parameter sind ungültig",
    },
    internal: {
      title: "Interner Fehler",
      description:
        "Bei der Abhängigkeitsanalyse ist ein interner Fehler aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, die Abhängigkeitsanalyse auszuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf die Abhängigkeitsanalyse ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Der angegebene Fokus-Pfad wurde nicht gefunden",
    },
    focusNotFound: "Keine Datei passt zum Fokus-Pfad {{focus}}",
    server: {
      title: "Serverfehler",
      description: "Serverfehler während der Abhängigkeitsanalyse aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Abhängigkeitsanalyse aufgetreten",
    },
    unsaved: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Während der Abhängigkeitsanalyse ist ein Konflikt aufgetreten",
    },
  },

  success: {
    title: "Analyse abgeschlossen",
    description: "Abhängigkeitsanalyse erfolgreich abgeschlossen",
  },
};
