import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vykonávanie vydaní",

  errors: {
    configNotLoaded: "Najprv načítajte konfiguráciu.",
    configFileNotFound: "Konfiguračný súbor {{path}} sa nenašiel.",
    configFileNotFoundInParents:
      "Súbor „{{filename}}“ sa nenašiel v aktuálnom ani v žiadnom nadradenom priečinku",
    invalidConfigFormat:
      "Neplatný formát konfigurácie. Konfigurácia musí predvolene exportovať objekt s vlastnosťou packages.",
    errorLoadingConfig: "Chyba pri načítavaní konfigurácie:",
  },

  releaseExecutor: {
    processing: "\n🚀 Spracovanie: {{directory}}",
    executing: "Spustenie: {{command}}",
    completed: "✅ Úspešne dokončené: {{directory}}",
    failed: "❌ Nepodarilo sa spracovať {{directory}}",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",

    state: {
      continuing: "Pokračuje sa z predchádzajúceho stavu…",
      noState: "Uložený stav sa nenašiel. Začína sa odznova…",
      allCompleted: "Všetky ciele boli úspešne spracované!",
    },

    prompts: {
      retryFailed: "Zopakovať neúspešné ciele? Počet: {{count}}",
      targetAction: "Akú akciu chcete vykonať pre {{directory}}?",
      processTarget: "Spracovať tento cieľ",
      skipTarget: "Preskočiť tento cieľ",
      abortOperation: "Zrušiť celú operáciu",
      continueAfterFailure: "Pokračovať so zostávajúcimi cieľmi?",
    },

    actions: {
      skipped: "⏭️  Preskočené: {{directory}}",
      aborted: "Operácia prerušená používateľom",
      stopped: "Operácia zastavená z dôvodu zlyhania",
      continuing: "Pokračuje sa so zostávajúcimi cieľmi…",
    },

    summary: {
      title: "\n📊 Záverečný súhrn:",
      allSuccess: "🎉 Všetky ciele úspešne spracované!",
      failedTargets:
        "⚠️  Počet neúspešných cieľov: {{count}}. Zopakujte ich pomocou --continue.",
    },

    forceUpdate: {
      starting: "🔄 Vynucuje sa aktualizácia závislostí pre všetky ciele…",
      updating: "\n📦 Aktualizuje sa: {{directory}}",
      updated: "✅ Aktualizované: {{directory}}",
      failed: "❌ Nepodarilo sa aktualizovať {{directory}}",
      completed: "🎉 Vynútená aktualizácia všetkých cieľov je dokončená",
    },

    forceRelease: {
      starting:
        "🚀 Vynútené vydanie všetkých cieľov so zvýšením verzie {{versionBump}}…",
    },

    weeklyUpdate: {
      starting: "📅 Spúšťa sa týždenná aktualizácia…",
      targetBranch: "Cieľová vetva: {{branchName}}",
      creatingBranch: "🌿 Vytváram vetvu aktualizácie...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages: "🔄 Aktualizujú sa všetky závislosti balíkov…",
      runningSnyk: "🔍 Spúšťam bezpečnostné monitorovanie Snyka...",
      noChanges: "📝 Bez zmien. Commit ani pull request sa nevytvoria.",
      committing: "💾 Zmeny sa ukladajú do commitu…",
      pushing: "📤 Vetva sa odosiela…",
      gitPush: "git push origin {{branchName}}",
      creatingPR: "📝 Pull request sa vytvára alebo aktualizuje…",
      completed: "🎉 Týždenná aktualizácia úspešne dokončená!",
      failed: "❌ Týždenná aktualizácia zlyhala:",
    },

    snyk: {
      noCredentials:
        "⚠️  Prihlasovacie údaje pre Snyk chýbajú. Monitorovanie zabezpečenia sa preskočí.",
      monitoring: "🔍 Prebieha monitorovanie balíka {{packageName}}…",
      failed:
        "⚠️  Monitorovanie Snyk pre {{packageFile}} zlyhalo. Pokračuje sa…",
    },

    github: {
      noToken: "⚠️  Chýba GITHUB_TOKEN. Pull request sa nevytvorí.",
      prFailed: "⚠️  Vytvorenie pull requestu zlyhalo. Pokračuje sa…",
      prError: "Chyba pri vytváraní PR:",
      prSuccess: "✅ Pull request bol vytvorený alebo aktualizovaný",
    },

    git: {
      findCommand:
        'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },

  cloneMissing: {
    checking: "🔍 Hľadajú sa chýbajúce repozitáre…",
    failedToClone: "❌ Nepodarilo sa naklonovať {{repoPath}}",
    noMissing: "✅ Žiadne repozitáre nechýbajú",
    success: "✅ Počet úspešne naklonovaných repozitárov: {{count}}",
    failed: "❌ Počet repozitárov, ktoré sa nepodarilo naklonovať: {{count}}",
    failedRepo: "  - {{repo}}",
  },

  updateAll: {
    updating: "🔄 Aktualizujú sa všetky repozitáre…",
    failedClone:
      "⚠️  Repozitár {{repoPath}} sa nepodarilo naklonovať. Pokračuje sa s ostatnými…",
    failedUpdate:
      "⚠️  Repozitár {{repoPath}} sa nepodarilo aktualizovať. Pokračuje sa s ostatnými…",
    clonedSuccess: "✅ Chýbajúce repozitáre boli naklonované ({{count}}).",
    updatedSuccess: "✅ Existujúce repozitáre boli aktualizované ({{count}}).",
    cloneFailed:
      "❌ Počet repozitárov, ktoré sa nepodarilo naklonovať: {{count}}",
    updateFailed:
      "❌ Počet repozitárov, ktoré sa nepodarilo aktualizovať: {{count}}",
    failedRepo: "   - {{repo}}",
  },
};
