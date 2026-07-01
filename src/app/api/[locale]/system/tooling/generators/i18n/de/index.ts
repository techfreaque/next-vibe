import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatoren",
  clientRoutesIndex: {
    category: "Generatoren",

    post: {
      title: "Client-Routen-Index generieren",
      description: "Client-Routen-Index-Datei automatisch generieren",
      container: {
        title: "Client-Routen-Index-Generator",
      },
      fields: {
        outputFile: {
          label: "Ausgabedatei",
          description: "Pfad zur Ausgabedatei",
        },
        dryRun: {
          label: "Probelauf",
          description: "Vorschau der Änderungen ohne Datei zu schreiben",
        },
        success: {
          title: "Erfolg",
        },
        message: {
          title: "Nachricht",
        },
        routesFound: {
          title: "Gefundene Routen",
        },
        duration: {
          title: "Dauer (ms)",
        },
      },
      errors: {
        validation: {
          title: "Ungültige Eingabe",
          description:
            "Bitte überprüfen Sie Ihre Konfiguration und versuchen Sie es erneut",
        },
        network: {
          title: "Verbindungsfehler",
          description:
            "Index konnte nicht generiert werden. Bitte versuchen Sie es erneut",
        },
        unauthorized: {
          title: "Anmeldung erforderlich",
          description:
            "Bitte melden Sie sich an, um diesen Generator zu verwenden",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description:
            "Sie haben keine Berechtigung, diesen Generator zu verwenden",
        },
        notFound: {
          title: "Routen nicht gefunden",
          description:
            "Die zu generierenden Routen konnten nicht gefunden werden",
        },
        server: {
          title: "Generierung fehlgeschlagen",
          description:
            "Der Index konnte nicht generiert werden. Bitte versuchen Sie es erneut",
        },
        unknown: {
          title: "Unerwarteter Fehler",
          description:
            "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
        },
        conflict: {
          title: "Dateikonflikt",
          description:
            "Die Index-Datei hat Konflikte. Bitte lösen Sie diese zuerst",
        },
      },
      success: {
        title: "Index generiert",
        description: "Client-Routen-Index wurde erfolgreich generiert",
      },
    },
  },
  emailTemplates: {
    category: "Generatoren",

    post: {
      title: "E-Mail-Vorlagen generieren",
      description: "E-Mail-Vorlagen-Registry mit Lazy Loading generieren",
      container: {
        title: "E-Mail-Vorlagen-Generator-Konfiguration",
      },
      success: {
        title: "Generierung abgeschlossen",
        description: "E-Mail-Vorlagen erfolgreich generiert",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to generated registry file",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Result Message",
        },
        templatesFound: {
          title: "Templates Found",
        },
        duration: {
          title: "Generation Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige E-Mail-Vorlagen-Generator-Parameter",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler während der Vorlagengenerierung",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie sind nicht berechtigt, Vorlagen zu generieren",
        },
        forbidden: {
          title: "Verboten",
          description: "Vorlagengenerierung ist verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Vorlagenverzeichnis nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "E-Mail-Vorlagen konnten nicht generiert werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist während der Generierung aufgetreten",
        },
      },
    },
    success: {
      generated: "Email template registry generated successfully",
    },
  },
  endpoint: {
    category: "Generatoren",

    post: {
      title: "Endpoint Generator",
      description: "Generate endpoint.ts with dynamic imports",
      container: {
        title: "Endpoint Generator Configuration",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to the output endpoint.ts file",
          title: "Output File",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
          title: "Dry Run",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        endpointsFound: {
          title: "Endpoints Found",
        },
        duration: {
          title: "Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Endpoint generator completed successfully",
        generated: "Endpoint file generated successfully",
      },
    },
  },
  env: {
    category: "Generatoren",

    post: {
      title: "Umgebungs-Generator",
      description: "Generiert konsolidierte Umgebungskonfigurationsdateien",
      form: {
        title: "Umgebungskonfiguration",
        description: "Konfigurieren Sie die Parameter der Umgebungsgenerierung",
      },
      fields: {
        outputDir: {
          label: "Ausgabeverzeichnis",
          description: "Verzeichnis zum Schreiben der generierten Dateien",
        },
        verbose: {
          label: "Ausführlich",
          description: "Zeige detaillierte Ausgabe",
        },
        dryRun: {
          label: "Testlauf",
          description: "Vorschau ohne Dateien zu schreiben",
        },
        success: {
          label: "Erfolg",
        },
        message: {
          label: "Nachricht",
        },
        serverEnvFiles: {
          label: "Server-Env-Dateien",
        },
        clientEnvFiles: {
          label: "Client-Env-Dateien",
        },
        duration: {
          label: "Dauer",
        },
        outputPaths: {
          label: "Ausgabepfade",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Env-Dateiexporte erkannt",
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
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Umgebungsdateien erfolgreich generiert",
      },
    },
    tags: {
      env: "Umgebung",
    },
    error: {
      validation_failed: "Env-Datei-Validierung fehlgeschlagen",
      generation_failed: "Env-Generierung fehlgeschlagen",
      noValidFiles: "Keine gültigen Umgebungsdateien gefunden",
    },
    success: {
      generated: "Umgebungsdateien erfolgreich generiert",
    },
  },
  generateAll: {
    category: "Generatoren",

    post: {
      title: "Alle generieren",
      description: "Alle Code-Generatoren ausführen",
      container: {
        title: "Konfiguration für Alle generieren",
        description: "Generierungsparameter konfigurieren",
      },
      fields: {
        rootDir: {
          label: "Stammverzeichnis",
          description: "Stammverzeichnis für die Generierung",
        },
        outputDir: {
          label: "Ausgabeverzeichnis",
          description: "Ausgabeverzeichnis für generierte Dateien",
        },
        verbose: {
          label: "Ausführliche Ausgabe",
          description: "Ausführliche Protokollierung aktivieren",
        },
        skipEndpoints: {
          label: "Endpunkte überspringen",
          description: "Endpunktgenerierung überspringen",
        },
        skipSeeds: {
          label: "Seeds überspringen",
          description: "Seed-Generierung überspringen",
        },
        skipTaskIndex: {
          label: "Task-Index überspringen",
          description: "Task-Index-Generierung überspringen",
        },
        enableTrpc: {
          label: "tRPC aktivieren",
          description: "tRPC-Router generieren (opt-in)",
        },
        skipTanstack: {
          label: "TanStack überspringen",
          description: "TanStack-Routen-Generierung überspringen",
        },
        force: {
          label: "Erzwingen",
          description: "Cache ignorieren und alle Generatoren neu ausführen",
        },
        success: {
          title: "Erfolg",
        },
        generationCompleted: {
          title: "Generierung abgeschlossen",
        },
        output: {
          title: "Ausgabe",
        },
        generationStats: {
          title: "Generierungsstatistiken",
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
          description: "Interner Serverfehler",
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
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        internal: {
          title: "Interner Fehler",
          description: "Interner Serverfehler aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
  },
  generateTrpcRouter: {
    category: "Generatoren",

    title: "tRPC-Router generieren",
    description: "tRPC-Router aus API-Endpunkten generieren",
    tag: "tRPC",
    container: {
      title: "tRPC-Router-Generierung",
      description: "tRPC-Router-Konfiguration generieren",
    },
    fields: {
      apiDir: {
        title: "API-Verzeichnis",
        description: "Verzeichnis mit API-Route-Dateien",
      },
      outputFile: {
        title: "Ausgabedatei",
        description: "Pfad zur generierten tRPC-Router-Datei",
      },
      includeWarnings: {
        title: "Warnungen einbeziehen",
        description: "Warnmeldungen in der Ausgabe einbeziehen",
      },
      excludePatterns: {
        title: "Ausschlussmuster",
        description:
          "Muster, die von der tRPC-Router-Generierung ausgeschlossen werden sollen",
      },
      success: {
        title: "Erfolg",
      },
      generationCompleted: {
        title: "Generierung abgeschlossen",
      },
      output: {
        title: "Ausgabe",
      },
      generationStats: {
        title: "Generierungsstatistik",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter für die tRPC-Router-Generierung",
      },
      internal: {
        title: "Interner Fehler",
        description: "Fehler bei der tRPC-Router-Generierung",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Keine Berechtigung zum Generieren des tRPC-Routers",
      },
    },
    success: {
      title: "tRPC-Router generiert",
      description: "tRPC-Router wurde erfolgreich generiert",
    },
    validation: {
      title: "TRPC-Validierung",
      description: "Validieren Sie die TRPC-Integration über Routendateien",
      category: "Generatoren",
      tags: {
        trpc: "tRPC",
        validation: "Validierung",
      },
      operations: {
        validateIntegration: "Integration validieren",
        validateRouteFile: "Routendatei validieren",
        generateReport: "Bericht generieren",
        fixRoutes: "Routen reparieren",
        checkRouterExists: "Router existiert prüfen",
      },
      severity: {
        error: "Fehler",
        warning: "Warnung",
        info: "Info",
      },
      fields: {
        operation: {
          label: "Operation",
          description: "Validierungsoperation auswählen",
          placeholder: "Operation wählen",
        },
        filePath: {
          label: "Dateipfad",
          description: "Spezifischer Routendateipfad zur Validierung",
          placeholder: "Dateipfad eingeben",
        },
        options: {
          label: "Optionen",
          description: "Validierungsoptionen",
          placeholder: "Optionen eingeben",
        },
      },
      response: {
        operation: {
          label: "Operation",
        },
        success: {
          label: "Erfolg",
        },
        result: {
          label: "Ergebnis",
        },
      },
      success: {
        title: "TRPC-Validierung erfolgreich",
        description: "TRPC-Validierung erfolgreich abgeschlossen",
      },
      errors: {
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "TRPC-Validierung fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie sind nicht berechtigt, diese Aktion auszuführen",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, diese Aktion auszuführen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Die angeforderte Ressource wurde nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Serverfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist aufgetreten",
        },
        executionFailed: {
          title: "Ausführung fehlgeschlagen",
          description: "TRPC-Validierungsvorgang fehlgeschlagen",
        },
      },
    },
    trpcValidator: {
      apiDirectoryNotFound:
        "API-Verzeichnis nicht gefunden: {{resolvedApiDir}}",
      foundRouteFiles: "{{count}} Route-Dateien zur Validierung gefunden",
      validationComplete: "Validierung abgeschlossen: {{status}}",
      passed: "BESTANDEN",
      failed: "FEHLGESCHLAGEN",
      errorsSummary: "Fehler: {{errorCount}}, Warnungen: {{warningCount}}",
      validationFailed: "Validierung fehlgeschlagen: {{message}}",
      definitionImportFrom: "./definition",
      definitionImportFromTs: "./definition.ts",
      enhancedApiHandlerCall: "enhancedApiHandler(",
      exportConstTrpc: "export const trpc",
      routerNotFound:
        "tRPC-Router-Datei nicht gefunden. Führen Sie 'vibe generate-trpc' aus, um sie zu erstellen.",
      routeHasDefinitionNoHandler:
        "Route hat Definition, verwendet aber nicht enhancedApiHandler",
      routeHasHandlerNoTrpc:
        "Route verwendet enhancedApiHandler, aber tRPC-Export fehlt",
      routeMissingNextExports:
        "Route fehlt Next.js-Exporte (benötigt für React Native-Unterstützung)",
      apiHandlerOld: "apiHandler(",
      routeUsesOldHandler:
        "Route verwendet noch alten apiHandler, sollte zu enhancedApiHandler migriert werden",
      autoFixNotImplemented:
        "Automatische Korrektur noch nicht implementiert. Führen Sie das Migrationsskript manuell aus.",
      failedToReadRoute: "Fehler beim Lesen der Route-Datei: {{message}}",
      reportTitle: "# tRPC-Integrations-Validierungsbericht",
      reportStatus: "**Status:** {{status}}",
      reportStatusPassed: "✅ BESTANDEN",
      reportStatusFailed: "❌ FEHLGESCHLAGEN",
      reportRouteFiles: "**Route-Dateien:** {{count}}",
      reportErrors: "**Fehler:** {{count}}",
      reportWarnings: "**Warnungen:** {{count}}",
      errorsSection: "## Fehler",
      warningsSection: "## Warnungen",
      routeFileDetails: "## Route-Dateidetails",
      definitionField: "- Definition: {{status}}",
      enhancedHandlerField: "- Enhanced Handler: {{status}}",
      trpcExportField: "- tRPC Export: {{status}}",
      nextExportField: "- Next.js Export: {{status}}",
      errorsList: "**Fehler:**",
      warningsList: "**Warnungen:**",
      checkmark: "✅",
      crossmark: "❌",
      warningIcon: "⚠️",
      directoriesSkip: {
        trpc: "trpc",
        generated: "generated",
        nodeModules: "node_modules",
      },
      routeFileName: "route.ts",
    },
  },
  routeHandlers: {
    category: "Generatoren",

    post: {
      title: "Route Handlers Generator",
      description: "Generate route-handlers.ts with dynamic imports",
      container: {
        title: "Route Handlers Generator Configuration",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to the output route-handlers.ts file",
          title: "Output File",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
          title: "Dry Run",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        routesFound: {
          title: "Routes Found",
        },
        duration: {
          title: "Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Route handlers generator completed successfully",
        generated: "Route handlers file generated successfully",
      },
    },
  },
  seeds: {
    category: "Generatoren",

    post: {
      title: "Titel",
      description: "Endpunkt-Beschreibung",
      form: {
        title: "Konfiguration",
        description: "Parameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Antwortdaten",
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
          description: "Interner Serverfehler",
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
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
        generated: "Seeds erfolgreich generiert",
      },
    },
    error: {
      generation_failed: "Seeds-Generierung fehlgeschlagen",
    },
    success: {
      generated: "Seeds erfolgreich generiert",
    },
  },
  taskIndex: {
    category: "Generatoren",

    post: {
      title: "Task-Index generieren",
      description: "Task-Index-Dateien generieren",
      container: {
        title: "Task-Index-Generierung",
        description: "Parameter für Task-Index-Generierung konfigurieren",
      },
      fields: {
        outputDir: {
          label: "Ausgabeverzeichnis",
          description: "Verzeichnis für generierte Task-Index-Dateien",
        },
        verbose: {
          label: "Ausführliche Ausgabe",
          description: "Ausführliche Protokollierung aktivieren",
        },
        duration: {
          title: "Dauer",
        },
        success: {
          title: "Erfolg",
        },
        message: {
          title: "Nachricht",
        },
        tasksFound: {
          title: "Gefundene Tasks",
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
          description: "Interner Serverfehler",
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
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        internal: {
          title: "Interner Fehler",
          description: "Interner Serverfehler aufgetreten",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Es gibt nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
  },
};
