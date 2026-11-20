import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Executor de liberación",

  errors: {
    configNotLoaded:
      "Configuración no cargada. Por favor, cargue la configuración primero.",
    configFileNotFound: "Archivo de confianza no encontrado: {{path}}",
    configFileNotFoundInParents:
      "Archivo Config ' {{filename}}' no se encuentra en el directorio actual o en cualquier directorio de padres",
    invalidConfigFormat:
      "Formato de configuración inválido. Asegurar que el config exporte un objeto predeterminado con una propiedad de 'paquetes'.",
    errorLoadingConfig: "Configuración de carga de errores:",
  },

  releaseExecutor: {
    processing: "\n ⁇  Procesamiento: {{directory}}",
    executing: "Ejecución: {{command}}",
    completed: "Escuché con éxito: {{directory}}",
    failed: "❌ Failed to process {{directory}}",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",

    state: {
      continuing: "Continuando desde el estado anterior...",
      noState: "No se encontró ningún estado existente, empezando...",
      allCompleted: "¡Todos los objetivos han sido procesados con éxito!",
    },

    prompts: {
      retryFailed: "¿Retry {{count}} falló objetivos?",
      targetAction: "¿Qué te gustaría hacer con {{directory}}?",
      processTarget: "Procesar este objetivo",
      skipTarget: "Skip this target",
      abortOperation: "Abortar toda la operación",
      continueAfterFailure: "¿Continúe con los objetivos restantes?",
    },

    actions: {
      skipped: " ⁇ د Skipped: {{directory}}",
      aborted: "Operación abortada por el usuario",
      stopped: "La operación se detuvo debido al fracaso",
      continuing: "Continuando con los objetivos restantes...",
    },

    summary: {
      title: "\n ⁇  Resumen final:",
      allSuccess: "¡Todas las metas procesadas con éxito!",
      failedTargets:
        "Los objetivos de rigión {{count}} fracasaron. Usar --continuar para volver a entrar.",
    },

    forceUpdate: {
      starting:
        " ⁇  Actualización de fuerzas depende de todos los objetivos...",
      updating: "\n ⁇  Actualización: {{directory}}",
      updated: "✅ Actualizado: {{directory}}",
      failed: "❌ Failed to update {{directory}}",
      completed:
        "Actualización de la Fuerza completada para todos los objetivos!",
    },

    forceRelease: {
      starting:
        " ⁇  Fuerza de liberación de todos los objetivos con la versión {{versionBump}} parachoques...",
    },

    weeklyUpdate: {
      starting: " ⁇  Comenzando el proceso de actualización semanal...",
      targetBranch: "Rama de destino: {{branchName}}",
      creatingBranch: " ⁇  Creando rama de actualización...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages: "Actualizar todas las dependencias de paquetes...",
      runningSnyk: " ⁇  Corriendo el monitoreo de seguridad Snyk...",
      noChanges: " ⁇  No se detectan cambios, se comen y se crea PR",
      committing: " ⁇  Cometiendo cambios...",
      pushing: " ⁇  rama de empuje...",
      gitPush: "git push origin {{branchName}}",
      creatingPR: " ⁇  Crear / actualizar la solicitud de tirante...",
      completed: "¡Actualización semanal completada con éxito!",
      failed: "❌ Actualización semanal falló:",
    },

    snyk: {
      noCredentials:
        "No se encontraron credenciales de Наленного Snyk, saltando el monitoreo de seguridad",
      monitoring: " ⁇  Monitorización {{packageName}}...",
      failed:
        "El monitoreo de Наликованиторенных falló para {{packageFile}}, continuando...",
    },

    github: {
      noToken: "Гле GITHUB_TOKEN no se encuentra, saltando la creación de PR",
      prFailed: "La creación de rigión PR falló, continuando...",
      prError: "Error de creación PR:",
      prSuccess: "✅ PR creado / actualizado con éxito",
    },

    git: {
      findCommand:
        'find. -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },

  cloneMissing: {
    checking: " ⁇  Comprobando para los depósitos desaparecidos...",
    failedToClone: "❌ Failed to clone {{repoPath}}",
    noMissing: "No hay depósitos perdidos encontrados",
    success: "Repositorios {{count}} clonados con éxito",
    failed: "❌ Failed to clone {{count}} repositories:",
    failedRepo: "  - {{repo}}",
  },

  updateAll: {
    updating: " ⁇  Actualizando todos los repositorios...",
    failedClone:
      "NOVEDAD Sin clonar {{repoPath}}, continuando con otros repositorios...",
    failedUpdate:
      "NOVEDAD se desvaneció para actualizar {{repoPath}}, continuando con otros repositorios...",
    clonedSuccess: "Con éxito clonado {{count}} perdido repositorios.",
    updatedSuccess:
      "Conseguir actualizado con éxito los repositorios existentes {{count}}.",
    cloneFailed: "❌ Failed to clone {{count}} repositories:",
    updateFailed: "❌ Failed to update {{count}} repositories:",
    failedRepo: "   - {{repo}}",
  },
};
