import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Executor Wydań",
  errors: {
    configNotLoaded:
      "Konfiguracja nie została załadowana. Proszę najpierw załadować konfigurację.",
    configFileNotFound: "Nie znaleziono pliku konfiguracyjnego: {{path}}",
    configFileNotFoundInParents:
      "Plik konfiguracyjny '{{filename}}' nie został znaleziony w bieżącym katalogu ani w katalogach nadrzędnych",
    invalidConfigFormat:
      "Nieprawidłowy format konfiguracji. Upewnij się, że konfiguracja eksportuje domyślny obiekt z właściwością 'packages'.",
    errorLoadingConfig: "Błąd ładowania konfiguracji:",
  },
  releaseExecutor: {
    processing: "Przetwarzanie: {{directory}}",
    executing: "Wykonywanie: {{command}}",
    completed: "Pomyślnie ukończono: {{directory}}",
    failed: "Nie udało się przetworzyć {{directory}}",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",

    state: {
      continuing: "Kontynuowanie poprzedniego stanu...",
      noState: "Nie znaleziono poprzedniego stanu, rozpoczynam od początku...",
      allCompleted: "Wszystkie cele zostały pomyślnie przetworzone!",
    },

    prompts: {
      retryFailed: "Ponowić {{count}} nieudane cele?",
      targetAction: "Co chcesz zrobić z {{directory}}?",
      processTarget: "Przetwórz ten cel",
      skipTarget: "Pomiń ten cel",
      abortOperation: "Przerwij całą operację",
      continueAfterFailure: "Kontynuować z pozostałymi celami?",
    },

    actions: {
      skipped: "Pominięto: {{directory}}",
      aborted: "Operacja przerwana przez użytkownika",
      stopped: "Operacja zatrzymana z powodu błędu",
      continuing: "Kontynuowanie z pozostałymi celami...",
    },

    summary: {
      title: "Podsumowanie końcowe:",
      allSuccess: "Wszystkie cele przetworzone pomyślnie!",
      failedTargets:
        "{{count}} celów nie powiodło się. Użyj --continue, aby ponowić.",
    },

    forceUpdate: {
      starting: "Wymuszanie aktualizacji zależności dla wszystkich celów...",
      updating: "Aktualizowanie: {{directory}}",
      updated: "Zaktualizowano: {{directory}}",
      failed: "Nie udało się zaktualizować {{directory}}",
      completed: "Wymuszona aktualizacja dla wszystkich celów ukończona!",
    },

    forceRelease: {
      starting:
        "Wymuszanie wydania wszystkich celów z {{versionBump}} zwiększeniem wersji...",
    },

    weeklyUpdate: {
      starting: "Rozpoczynanie tygodniowego procesu aktualizacji...",
      targetBranch: "Docelowa gałąź: {{branchName}}",
      creatingBranch: "Tworzenie gałęzi aktualizacji...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages: "Aktualizowanie wszystkich zależności pakietów...",
      runningSnyk: "Uruchamianie monitorowania bezpieczeństwa Snyk...",
      noChanges: "Nie wykryto zmian, pomijam commit i tworzenie PR",
      committing: "Tworzenie commitu...",
      pushing: "Wypychanie gałęzi...",
      gitPush: "git push origin {{branchName}}",
      creatingPR: "Tworzenie/aktualizowanie pull requesta...",
      completed: "Tygodniowa aktualizacja ukończona pomyślnie!",
      failed: "Tygodniowa aktualizacja nie powiodła się:",
    },

    snyk: {
      noCredentials:
        "Nie znaleziono danych uwierzytelniających Snyk, pomijam monitorowanie bezpieczeństwa",
      monitoring: "Monitorowanie {{packageName}}...",
      failed:
        "Monitorowanie Snyk nie powiodło się dla {{packageFile}}, kontynuuję...",
    },

    github: {
      noToken: "Nie znaleziono GITHUB_TOKEN, pomijam tworzenie PR",
      prFailed: "Tworzenie PR nie powiodło się, kontynuuję...",
      prError: "Błąd tworzenia PR:",
      prSuccess: "PR utworzony/zaktualizowany pomyślnie",
    },

    git: {
      findCommand:
        'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },

  cloneMissing: {
    checking: "🔍 Checking for missing repositories...",
    failedToClone: "❌ Failed to clone {{repoPath}}",
    noMissing: "✅ No missing repositories found",
    success: "✅ Successfully cloned {{count}} repositories",
    failed: "❌ Failed to clone {{count}} repositories:",
    failedRepo: "  - {{repo}}",
  },

  updateAll: {
    updating: "🔄 Updating all repositories...",
    failedClone:
      "⚠️  Failed to clone {{repoPath}}, continuing with other repositories...",
    failedUpdate:
      "⚠️  Failed to update {{repoPath}}, continuing with other repositories...",
    clonedSuccess: "✅ Successfully cloned {{count}} missing repositories.",
    updatedSuccess: "✅ Successfully updated {{count}} existing repositories.",
    cloneFailed: "❌ Failed to clone {{count}} repositories:",
    updateFailed: "❌ Failed to update {{count}} repositories:",
    failedRepo: "   - {{repo}}",
  },
};
