import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Herramienta de liberación",
  titleShort: "Herramienta de liberación",
  description:
    "Administrar versiones de paquetes con parachoques de versión, etiquetado git, e integración CI / CD",
  category: "Herramienta de liberación",
  tags: {
    release: "Release",
  },
  enums: {
    versionIncrement: {
      patch: "Patch",
      minor: "Menores",
      major: "Major",
      prepatch: "Prepatch",
      preminor: "Pre-minor",
      premajor: "Pre-major",
      prerelease: "Prerrelease",
    },
    packageManager: {
      bun: "Bun",
      npm: "NPM",
      yarn: "Yarn",
      pnpm: "PNPM",
      deno: "Deno",
    },
    webhookType: {
      slack: "Slack",
      discord: "Discord",
      teams: "Microsoft Teams",
      custom: "Personalizado",
    },
    npmAccess: {
      public: "Público",
      restricted: "Restricted",
    },
    changelogPreset: {
      "conventional-commits": "Conventional Commits",
      angular: "Angular",
      atom: "Atom",
      eslint: "ESLint",
      ember: "Ember",
    },
  },
  form: {
    title: "Configuración de lanzamiento",
    description: "Configurar opciones de liberación para tus paquetes",
  },
  fields: {
    configPath: {
      title: "Sendero de Config",
      description:
        "Path to release.config.ts file (default: release.config.ts)",
    },
    ci: {
      title: "Modo CI",
      description:
        "Correr en modo CI (sin avisos interactivos, utiliza ciReleaseCommand)",
    },
    forceUpdate: {
      title: "Dependencias de actualización de la Fuerza",
      description:
        "Actualización de la fuerza todas las dependencias sin incitar (esquítese todos los demás pasos)",
    },
    dryRun: {
      title: "Dry Run",
      description: "Simular la liberación sin hacer ningún cambio",
    },
    skipLint: {
      title: "Skip Lint",
      description: "Salteando el escalón",
    },
    skipTypecheck: {
      title: "Tipo de comprobación",
      description: "Paso de comprobación del tipo TypeScript",
    },
    skipBuild: {
      title: "Skip Build",
      description: "Saltear el paso de construcción",
    },
    skipTests: {
      title: "Pruebas de Skip",
      description: "Paso de ejecución del test",
    },
    skipSnyk: {
      title: "Skip Snyk",
      description: "Skip Snyk vulnerability escaneado",
    },
    skipPublish: {
      title: "Skip Publish",
      description: "Saltar publicación a npm/registry",
    },
    skipChangelog: {
      title: "Skip Changelog",
      description: "Skip changelog generation",
    },
    prereleaseId: {
      title: "ID",
      description:
        "Identificador de prerrelease (alpha, beta, rc) para el parachoque de la versión",
    },
    versionIncrement: {
      title: "Version Increment",
      description:
        "Tipo de aumento de la versión (patch, minor, major) - sólo utilizado en modo local",
    },
    targetPackage: {
      title: "Paquete de objetivos",
      description:
        "Directorio específico de paquetes (opcional, predeterminado a todos los paquetes)",
    },
    inlineConfig: {
      title: "Inline Config",
      description:
        "Proporcionar configuración de la versión en línea en lugar de usar el archivo config",
    },
    skipGitTag: {
      title: "Evitar la etiqueta",
      description: "Saltar la creación de etiqueta git durante el lanzamiento",
    },
    skipGitPush: {
      title: "Saltar Git Push",
      description: "Saltar empujando al repositorio remoto",
    },
    verbose: {
      title: "Verbose",
      description: "Activar la tala de verbosa para la salida detallada",
    },
    skipInstall: {
      title: "Skip Install",
      description: "Paso de instalación de dependencia",
    },
    skipClean: {
      title: "Skip Clean",
      description: "Saltar paso limpio antes de construir",
    },
    commitMessage: {
      title: "Mensaje",
      description:
        // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
        "Mensaje de compromiso personalizado para tope de versión (apoyo ${version} marcador de posición)",
    },
    notifyWebhook: {
      title: "Notificación Webhook",
      description:
        "Webhook URL para enviar notificaciones de liberación a (Slack, Discord, Equipos, o personalizado)",
    },
    configObject: {
      title: "Objeto de configuración",
      description: "Configuración de configuración de lanzamiento",
    },
    packageManager: {
      title: "Package Manager",
      description:
        "Gestor de paquetes para usar para versiones (bun, npm, hilo, pnpm, deno)",
    },
    globalVersion: {
      title: "Versión global",
      description:
        "Establecer una versión global para todos los paquetes en monorepo",
    },
    parallel: {
      title: "Ejecución paralela",
      description: "Permitir el procesamiento paralelo de paquetes",
    },
    maxParallelJobs: {
      title: "Max Parallel Jobs",
      description: "Número máximo de trabajos paralelos para ejecutar",
    },
    continueOnError: {
      title: "Continuar con el error",
      description: "Continuar procesando paquetes restantes si uno falla",
    },
    verifyGitStatus: {
      title: "Verificar el estado de Git",
      description: "Verificar el estado de git antes de la liberación",
    },
    requireCleanWorkingDir: {
      title: "Consultar Directorio de Trabajos Limpios",
      description:
        "Consultar directorio de trabajo limpio antes de la liberación",
    },
    verifyLockfile: {
      title: "Verificar Lockfile",
      description:
        "Verificar la integridad del archivo de bloqueo antes de la liberación",
    },
    branch: {
      title: "Configuración de rama",
      description: "Configuración de configuración de ramas Git",
    },
    branchMain: {
      title: "Subdivisión Principal",
      description: "Nombre de la rama principal/producción",
    },
    branchDevelop: {
      title: "Subdivisión de Desarrollo",
      description: "Nombre de la rama de desarrollo",
    },
    allowNonMain: {
      title: "Permitir las versiones no principales",
      description:
        "Permitir las liberaciones de ramas distintas de las principales",
    },
    protectedBranches: {
      title: "Subdivisións protegidos",
      description: "Lista de nombres protegidos de ramas",
    },
    notifications: {
      title: "Notificaciones",
      description: "Configuración de notificación para eventos de lanzamiento",
    },
    notificationsEnabled: {
      title: "Notificaciones habilitadas",
      description: "Permitir notificaciones de liberación",
    },
    webhookUrl: {
      title: "Webhook URL",
      description: "URL para notificaciones webhook",
    },
    webhookType: {
      title: "Tipo Webhook",
      description: "Tipo de webhook (Slack, Discord, Teams, Custom)",
    },
    onSuccess: {
      title: "Notificar sobre el éxito",
      description: "Enviar notificación de éxito",
    },
    onFailure: {
      title: "Notificar sobre el fracaso",
      description: "Enviar notificación sobre liberación fallida",
    },
    messageTemplate: {
      title: "Plantilla del mensaje",
      description: "Plantilla de mensajes personalizados para notificaciones",
    },
    includeTimings: {
      title: "Incluir las fechas",
      description:
        "Incluir la información sobre el calendario de las notificaciones",
    },
    retry: {
      title: "Configuración de reingreso",
      description: "Ajustes de reingreso para operaciones fallidas",
    },
    maxAttempts: {
      title: "Max Attempts",
      description: "Número máximo de intentos de reingreso",
    },
    delayMs: {
      title: "Retry Delay",
      description: "Retraso inicial entre las retries en milisegundos",
    },
    backoffMultiplier: {
      title: "Multiplicador de backoff",
      description: "Multiplicador para el retroceso exponencial",
    },
    maxDelayMs: {
      title: "Max Delay",
      description: "Retraso máximo entre las entradas en milisegundos",
    },
    rollback: {
      title: "Configuración de rodillos",
      description: "Ajustes automáticos de revolvimiento en fallo",
    },
    rollbackEnabled: {
      title: "Enable Rollback",
      description: "Activar el retroceso automático en el fallo",
    },
    rollbackGit: {
      title: "Rollback Git Changes",
      description: "Rollback git commits and tags on failure",
    },
    rollbackVersion: {
      title: "Cambios en la versión de Rollback",
      description: "Cambios de la versión de Rollback en el fallo",
    },
    packages: {
      title: "Paquetes",
      description: "Lista de paquetes para la liberación",
    },
    package: {
      title: "Configuración del paquete",
    },
    directory: {
      title: "Directorio",
    },
    name: {
      title: "Nombre",
    },
    updateDeps: {
      title: "Dependencias de actualización",
      description: "Actualizar las dependencias en paquetes dependientes",
    },
    clean: {
      title: "Mando limpio",
      description: "Comando o script para limpiar el paquete",
    },
    lint: {
      title: "Comando Lint",
      description: "Comando o script para el paquete lint",
    },
    typecheck: {
      title: "Control de comandos",
      description: "Comando o script para escribir el paquete de verificación",
    },
    build: {
      title: "Mando de construcción",
      description: "Comando o script para construir el paquete",
    },
    test: {
      title: "Comando de prueba",
      description: "Comando o script para probar el paquete",
    },
    snyk: {
      title: "Snyk Scan",
      description: "Activar el análisis de seguridad Snyk",
    },
    install: {
      title: "Instalar el Comando",
      description: "Comando o script para instalar dependencias",
    },
    release: {
      title: "Configuración de lanzamiento",
    },
    releaseVersion: {
      title: "Versión de lanzamiento",
    },
    tagPrefix: {
      title: "Prefijo de la etiqueta",
    },
    tagSuffix: {
      title: "Tag Suffix",
    },
    ciReleaseCommand: {
      title: "Comando de liberación CI",
      description: "Comando para ejecutar en el modo CI para liberar",
    },
    ciCommand: {
      title: "Comando",
      description: "array de comandos para ejecutar",
    },
    ciEnvMapping: {
      title: "Environment Mapping",
      description: "Cartografías variables ambientales para CI",
    },
    gitOps: {
      title: "Git Operations",
    },
    skipTag: {
      title: "Tag",
    },
    skipPush: {
      title: "Empujar",
    },
    skipCommit: {
      title: "Skip",
    },
    signCommit: {
      title: "Firme",
    },
    signTag: {
      title: "Signatura",
    },
    remote: {
      title: "Remote",
    },
    npm: {
      title: "Configuración NPM",
    },
    npmEnabled: {
      title: "Activar la publicación NPM",
    },
    npmRegistry: {
      title: "Registro de NPM",
    },
    npmTag: {
      title: "NPM Tag",
    },
    npmAccess: {
      title: "NPM Access",
    },
    otpEnvVar: {
      title: "OTP Environment Variable",
    },
    provenance: {
      title: "Provenance",
    },
    ignoreScripts: {
      title: "Ignorar scripts",
    },
    npmDryRun: {
      title: "NPM Dry Run",
    },
    jsr: {
      title: "Configuración JSR",
    },
    jsrEnabled: {
      title: "Activar la publicación JSR",
    },
    allowSlowTypes: {
      title: "Permitir tipos de flujo",
    },
    allowDirty: {
      title: "Permitir Dirty",
    },
    jsrDryRun: {
      title: "JSR Dry Run",
    },
    changelog: {
      title: "Configuración de cambios",
    },
    changelogEnabled: {
      title: "Enable Changelog",
    },
    changelogFile: {
      title: "Cambio de archivo",
    },
    changelogHeader: {
      title: "Changelog Header",
    },
    compareUrlFormat: {
      title: "Compare URL Format",
    },
    commitUrlFormat: {
      title: "Commit URL Format",
    },
    includeBody: {
      title: "Incluido el cuerpo",
    },
    changelogPreset: {
      title: "Cambio Preset",
    },
    gitRelease: {
      title: "Configuración de lanzamiento de Git",
    },
    gitReleaseEnabled: {
      title: "Activar la liberación de Git",
    },
    releaseTitle: {
      title: "Título de publicación",
    },
    generateNotes: {
      title: "Generar notas",
    },
    releaseBody: {
      title: "Cuerpo de liberación",
    },
    draft: {
      title: "Proyecto",
    },
    prerelease: {
      title: "Prerrelease",
    },
    discussionCategory: {
      title: "Categoría de debate",
    },
    target: {
      title: "Meta",
    },
    assets: {
      title: "Assets",
      description: "Liberar activos para subir",
    },
    foldersToZip: {
      title: "Carpetas a Zip",
      description: "Carpetas a la cremallera para la liberación",
    },
    versionBumper: {
      title: "Versión Bumper",
      description:
        "Configuración de búsqueda de versiones para archivos no-package.json",
    },
    hooks: {
      title: "Ganchos de ciclo de vida",
      description: "Comandos para correr en diferentes etapas",
    },
    preInstall: {
      title: "Pre-Install Hook",
    },
    postInstall: {
      title: "Pos-Install Hook",
    },
    preClean: {
      title: "Pre-Clean Hook",
    },
    postClean: {
      title: "Pos-Clean Hook",
    },
    preLint: {
      title: "Pre-Lint Hook",
    },
    postLint: {
      title: "Colgante post-lugar",
    },
    preTypecheck: {
      title: "Pre-Typecheck Hook",
    },
    postTypecheck: {
      title: "Cierre de tipo post",
    },
    preBuild: {
      title: "Pre-Build Hook",
    },
    postBuild: {
      title: "Colgante de post-construcción",
    },
    preTest: {
      title: "Pre-Test Hook",
    },
    postTest: {
      title: "Pos-Test Hook",
    },
    prePublish: {
      title: "Gancho pre-Publicado",
    },
    postPublish: {
      title: "Garfio post-Publicado",
    },
    preRelease: {
      title: "Pre-Release Hook",
    },
    postRelease: {
      title: "Colgante posterior a la liberación",
    },
    globalHooks: {
      title: "Global Hooks",
      description:
        "Ganchos mundiales de ciclo de vida para todo el proceso de liberación",
    },
  },
  response: {
    status: "Situación",
    success: "Estado de la liberación",
    output: "Registro de lanzamiento",
    duration: "Duración",
    packages: "Paquetes",
    packagesProcessed: "Paquetes procesados",
    ciEnvironment: "CI Environment",
    errors: "Errores",
    warnings: "Advertencias",
    gitInfo: "Información de Git",
    published: "Paquetes publicados",
    publishedPackages: "Paquetes publicados",
    timings: "Ejecución",
    rollbackPerformed: "Rollback Performed",
    notificationsSent: "Notificaciones",
  },
  table: {
    name: "Paquete",
    directory: "Directorio",
    version: "Version",
    tag: "Tag",
    status: "Situación",
    message: "Mensaje",
    registry: "Secretaría",
    url: "URL",
  },
  errors: {
    validation: {
      title: "Error de validación",
      description: "Configuración de liberación inválida",
    },
    notFound: {
      title: "No encontrado",
      description: "Archivo de Config o paquete no encontrado",
    },
    server: {
      title: "Error del servidor",
      description: "Se produjo un error durante el proceso de liberación",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    network: {
      title: "Error de red",
      description: "Error de red durante el proceso de liberación",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "No autorizado para realizar la liberación",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Acceso denegado para la operación de liberación",
    },
    conflict: {
      title: "Conflicto",
      description:
        "Conflicto de liberación detectado (la etiqueta ya puede existir)",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Hay cambios sin salvar que deben ser cometidos primero",
    },
    packageNotFound:
      "Paquete ' {{targetPackage}}' no se encuentra en la configuración",
    gitOperationFailed: "La operación de Git falló: {{error}}",
    gitAddFailed: "Git add failed: {{error}}",
    gitTagFailed: "Git tag ' {{tag}}' falló: {{error}}",
    gitPushFailed: "Git push to ' {{remote}}' falló: {{error}}",
    gitPushTagFailed:
      "Git push tag ' {{tag}}' a ' {{remote}}' falló: {{error}}",
  },
  success: {
    title: "Lanzamiento completo",
    description: "Proceso de liberación completado con éxito",
  },
  config: {
    fileNotFound: "Archivo de confianza no encontrado: {{path}}",
    invalidFormat:
      "Formato de configuración inválido. Asegurar que el config exporte un objeto predeterminado con una matriz de 'paquetes'. Compruebe los docs para más información.",
    errorLoading: "Configuración de carga de error: {{error}}",
  },
  packageJson: {
    notFound: "Package.json no se encuentra: {{path}}",
    invalidFormat: "Formato inválido.json: {{path}}",
    errorReading: "Paquete de lectura de errores.json: {{error}}",
    errorUpdatingDeps:
      "Dependencias de actualización de errores para {{directory}} : {{error}}",
    errorUpdatingVersion:
      "Versión de paquete de actualización de errores para {{directory}} : {{error}}",
  },
  scripts: {
    invalidPackageJson: "Formato inválido.json en {{path}}",
    testsFailed: "Las pruebas fallaron en {{path}} : {{error}}",
    lintFailed: "Fracasado fallado en {{path}} : {{output}}",
    typecheckFailed: "Tipo de comprobación falló en {{path}} : {{error}}",
    buildFailed: "Construir falló en {{path}} : {{error}}",
    packageJsonNotFound: "Package.json no se encuentra en {{path}}",
  },
  snyk: {
    cliNotFound: "Snyk CLI no se encuentra. Instalar con: npm instalar -g snyk",
    testFailed:
      "Prueba de vulnerabilidad Snyk falló para {{packageName}} : {{error}}",
    tokenRequired:
      "variable de entorno SNYK_TOKEN requerida para {{packageName}}",
    orgKeyRequired:
      "variable de entorno SNYK_ORG_KEY requerida para {{packageName}}",
    monitorFailed: "Monitor Snyk falló para {{packageName}} : {{error}}",
  },
  git: {
    tagCreated: "Git tag ' {{tag}}' creado con éxito",
    tagExists: "Git tag ' {{tag}} ' ya existe",
    pushSuccess: "Cambios empujados a distancia",
    noCommits: "No hay nuevos compromisos desde la etiqueta ' {{lastTag}}'",
    uncommittedChanges: "Se detectaron cambios no comprometidos",
    notOnMain: "No en la rama ' {{main}}' (actual: {{currentBranch}})",
    commitFailed: "Fallado para cometer cambios",
    tagFailed: "Failed to create tag",
    pushFailed: "Failed to push to remote",
  },
  version: {
    bumped: "Versión parada de {{from}} a {{to}} ({{increment}})",
    fileUpdated: "Versión actualizada en {{file}} a {{newVersion}}",
    invalidFormat: "Formato de versión inválido: {{version}}",
  },
  ci: {
    commandRunning: "Ejecución de comando CI para {{package}} : {{command}}",
    commandSuccess: "Comando de liberación CI completado para {{package}}",
    commandFailed:
      "El comando de liberación CI falló para {{package}} : {{error}}",
    commandRequired:
      "El modo CI requiere configuración ciReleaseCommand para {{package}}",
    envVarMissing:
      "Variable de entorno requerido ' {{variable}} ' no se establece para {{package}}",
  },
  zip: {
    starting: "Carpetas de cierre...",
    complete:
      "{{input}} con cremallera exitosamente a {{output}} (bytes {{bytes}})",
    failed: "Failed to zip {{input}} : {{error}}",
    noFolders: "No hay carpetas para iniciar la configuración",
    inputNotFound: "Carpeta de entrada {{input}} no existe",
  },
  dryRun: {
    prefix: "[DRY RUN]",
    wouldExecute: "Se ejecutaría: {{action}}",
  },
  release: {
    starting: "El proceso de liberación inicial...",
    ciMode: "Ejecutando la liberación en el modo CI...",
    localMode: "Ejecutando la liberación en el modo local...",
    forceUpdate: "Las dependencias de actualización de fuerzas...",
    complete: "Proceso de liberación completado",
    failed: "El proceso de liberación falló",
    processingPackage: "Paquete de procesamiento: {{name}}",
    packageSkipped: "Paquete ' {{name}}' saltado: {{reason}}",
    packageComplete: "Paquete ' {{name}}' completado",
    packageFailed: "Paquete ' {{name}}' falló: {{error}}",
    firstRelease:
      "No hay etiquetas anteriores encontradas. Esta será la primera versión.",
  },
  qualityChecks: {
    linting: "Forro de ejecución para {{package}}...",
    lintPassed: "Pasó el linaje para {{package}}",
    lintFailed: "Fracaso de Linting para {{package}}",
    typeChecking: "Control de tipo de ejecución para {{package}}...",
    typeCheckPassed: "Tipo de cheque aprobado para {{package}}",
    typeCheckFailed: "Error de comprobación de tipo {{package}}",
    building: "Edificio {{package}}...",
    buildPassed: "Construido aprobado para {{package}}",
    buildFailed: "Construir falló para {{package}}",
    testing: "Pruebas de ejecución para {{package}}...",
    testsPassed: "Pruebas pasadas para {{package}}",
    testsFailed: "Las pruebas fallaron para {{package}}",
    snykTesting: "Prueba de Snyk para {{package}}...",
    snykTestPassed: "Prueba Snyk aprobada para {{package}}",
    snykTestFailed: "Prueba de Snyk falló para {{package}}",
    snykMonitoring: "Monitor de Snyk para {{package}}...",
    snykMonitorPassed: "Monitor Snyk completado para {{package}}",
    snykMonitorFailed: "El monitor Snyk falló para {{package}}",
  },
  dependencies: {
    updating: "Actualización de las dependencias para {{directory}}...",
    updated: "Dependencias actualizadas para {{directory}}",
    failed: "Actualización de dependencia falló para {{directory}} : {{error}}",
    skipped: "Actualizaciones de dependencia de saltar para {{directory}}",
    dedupeFailed:
      "Failed to deduplicate dependencies for {{directory}} : {{error}}",
  },
  security: {
    auditFailed: "La auditoría de seguridad falló en {{directory}} : {{error}}",
  },
  hooks: {
    running: "Gancho {{hook}} para {{package}}...",
    completed: "Hook {{hook}} completado para {{package}}",
    failed: "Comando de gancho ' {{command}}' falló: {{error}}",
    skipped: "Gancho de {{hook}} (continueOnError)",
  },
  npm: {
    publishing: "Publishing {{package}} a npm...",
    published: "Publicado exitosamente {{package}} @ {{version}} a npm",
    publishFailed: "Failed to publish {{package}} to npm: {{error}}",
    registry: "Uso del registro de npm: {{registry}}",
    dryRun: "[ DRY RUN ] publicaría {{package}} @ {{version}} a npm",
  },
  changelog: {
    generating: "Generando el cambio de {{package}}...",
    generated: "Cambio generado para {{package}}",
    failed: "Failed to generate changelog for {{directory}} : {{error}}",
    noChanges: "No hay cambios para añadir a cambio de {{package}}",
  },
  branch: {
    checking: "Estado de la rama de verificación...",
    notAllowed:
      "Las versiones de la rama ' {{branch}}' no se permiten (principio: {{main}})",
    isProtected: "Rama ' {{branch}}' está protegida",
  },
  gitRelease: {
    creating: "Creando la liberación de GitHub para {{tag}}...",
    created: "GitHub lanzado con éxito: {{url}}",
    failed: "Failed to create GitHub release: {{error}}",
    ghNotFound: "GitHub CLI (gh) no se encuentra - saltar GitHub liberación",
    notGitHub: "GitHub sólo admite repositorios GitHub",
  },
  validation: {
    branchNotAllowed:
      "La liberación de la rama ' {{branch}}' no está permitida",
    dirtyWorkingDir: "El directorio de trabajo tiene cambios no comprometidos",
    passed: "Todas las validaciones aprobadas",
  },
  summary: {
    header: "Resumen",
    successCount: "Paquetes {{count}} lanzados con éxito",
    skipCount: "Paquetes {{count}} saltados",
    failCount: "Los paquetes {{count}} fallaron",
  },
  jsr: {
    publishing: "Publishing {{package}} to JSR...",
    published: "Publicada exitosamente {{package}} a JSR",
    failed: "Failed to publish {{package}} to JSR : {{error}}",
  },
  gitlab: {
    creating: "Creando la liberación de GitLab para {{tag}}...",
    created: "GitLab versión creada con éxito: {{url}}",
    failed: "Failed to create GitLab release: {{error}}",
    glabNotFound:
      "GitLab CLI (glab) no se encuentra - saltando la liberación de GitLab",
  },
  lockfile: {
    checking: "Comprobando la integridad del archivo de bloqueo...",
    valid: "Lockfile es válido",
    invalid: "El control de integridad de Lockfile falló: {{error}}",
    missing:
      "No se encontró ningún archivo de bloqueo (expectado: {{expected}})",
  },
  notifications: {
    sending: "Envío de notificación...",
    sent: "Notificación enviada con éxito",
    failed: "Fallado para enviar notificación: {{error}}",
    disabled: "Notificaciones desactivadas",
  },
  retry: {
    attempt:
      "Intente reiniciar {{attempt}} de {{maxAttempts}} para {{operation}}",
    failed: "Todos los intentos de reingreso fallaron en {{operation}}",
    success:
      "La operación {{operation}} tuvo éxito después de la reingresación",
  },
  rollback: {
    starting: "Comenzando revolver...",
    complete: "Rollback completed",
    failed: "Rollback falló: {{error}}",
    git: "Rodando cambios de git...",
    version: "Cambios en la versión trasera...",
  },
  timings: {
    report: "Desglose de las fechas",
    validation: "Validación",
    install: "Instala",
    clean: "Limpio",
    lint: "Lint",
    typecheck: "Tipo",
    build: "Compilación",
    test: "Prueba",
    publish: "Publish",
    changelog: "Changelog",
    gitOperations: "Git Operations",
  },
  widget: {
    runRelease: "Ejecutar la liberación",
    runAgain: "Corre otra vez.",
    complete: "Lanzamiento completo",
    failed: "La liberación falló",
    published: "Publicado",
    errors: "Errores",
    bullet: "•",
    warning: "⚠",
  },
};
