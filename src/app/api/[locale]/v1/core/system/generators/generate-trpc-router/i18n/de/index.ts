export const translations = {
  trpcValidator: {
    apiDirectoryNotFound: "API-Verzeichnis nicht gefunden: {{resolvedApiDir}}",
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
};
