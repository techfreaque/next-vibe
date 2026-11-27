import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Instalar {{appName}}",
    description:
      "Progreso de la instalación local y configuración opcional de un repositorio privado en GitHub.",
  },
  enums: {
    stepStatus: {
      done: "Listo",
      inProgress: "En curso",
      pending: "Pendiente",
      skipped: "Omitido",
      error: "Requiere atención",
    },
    action: {
      refresh: "Volver a comprobar",
      githubAuthStart: "Iniciar sesión en GitHub",
      githubAuthCheck: "Comprobar sesión de GitHub",
      githubCreatePrivateRepo: "Crear repositorio privado",
      githubSkip: "Omitir GitHub",
      githubReset: "Configurar GitHub",
    },
    checkoutMode: {
      cloned: "Clon limpio",
      existing: "Copia existente conservada",
      unknown: "Copia local",
    },
  },
  get: {
    title: "Estado del instalador",
    titleShort: "Instalador",
    description:
      "Revisa el progreso de la instalación local, el estado de la carpeta y la configuración opcional de GitHub.",
    tags: {
      installer: "Instalador",
    },
    success: {
      title: "Estado cargado",
      description: "Se obtuvo el estado local de la instalación.",
    },
    response: {
      installDir: { title: "Carpeta de instalación" },
      os: { title: "Sistema operativo" },
      arch: { title: "Arquitectura" },
      checkoutMode: { title: "Modo de copia" },
      branch: { title: "Rama Git" },
      originUrl: { title: "Remoto origin" },
      upstreamUrl: { title: "Remoto upstream" },
      port: { title: "Puerto local" },
      stateFilePath: { title: "Archivo de estado" },
      updatedAt: { title: "Última actualización" },
      lastError: { title: "Último error" },
      steps: { title: "Pasos de instalación" },
      github: { title: "Estado de GitHub" },
      setup: { title: "Estado del asistente" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud de estado no válida.",
      },
      unauthorized: {
        title: "No autorizado",
        description: "Se requiere autenticación.",
      },
      forbidden: {
        title: "Solo local",
        description:
          "El instalador solo está disponible en una instancia local durante el primer arranque.",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el estado del instalador.",
      },
      network: {
        title: "Error de red",
        description: "Falló la solicitud de red.",
      },
      server: {
        title: "Error del servidor",
        description: "No se pudo leer el estado local de la instalación.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado.",
      },
      unsavedChanges: {
        title: "Conflicto",
        description: "El estado cambió durante la lectura.",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto en el estado del instalador.",
      },
    },
  },
  post: {
    title: "Ejecutar acción del instalador",
    titleShort: "Acción instalador",
    description:
      "Actualiza las comprobaciones locales o gestiona el repositorio privado en GitHub.",
    tags: {
      installer: "Instalador",
    },
    request: {
      action: {
        label: "Acción",
        description: "Acción del instalador a ejecutar.",
      },
      repoName: {
        label: "Nombre del repositorio privado",
        description: "Nombre del repositorio en tu cuenta de GitHub.",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "Resultado" },
    },
    success: {
      title: "Acción completada",
      description: "La acción del instalador finalizó correctamente.",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Acción o nombre de repositorio no válido.",
      },
      unauthorized: {
        title: "No autorizado",
        description: "Se requiere autenticación.",
      },
      forbidden: {
        title: "Solo local",
        description:
          "Las acciones del instalador solo están disponibles en local.",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró una herramienta local necesaria.",
      },
      network: {
        title: "Error de red",
        description:
          "No se pudo contactar con GitHub. Revisa tu conexión e inténtalo de nuevo.",
      },
      server: {
        title: "Error del servidor",
        description: "Falló la acción del instalador.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado.",
      },
      unsavedChanges: {
        title: "Conflicto",
        description: "El estado cambió durante la acción.",
      },
      conflict: {
        title: "El repositorio ya existe",
        description: "Conflicto con un repositorio de GitHub.",
      },
    },
  },
  errors: {
    localOnly:
      "El instalador solo está disponible en una instancia local durante el primer arranque.",
    invalidRepoName:
      "Usa letras, números, puntos, guiones o guiones bajos (máximo 100 caracteres).",
    ghNotInstalled:
      "GitHub CLI (gh) no está instalado en este equipo. Usa los pasos manuales abajo u omite este paso.",
    ghAuthStartFailed:
      "No se pudo iniciar el acceso por dispositivo de GitHub. Ejecuta 'gh auth login --web' en tu terminal o sigue los pasos manuales.",
    ghNotSignedIn: "Inicia sesión en GitHub primero y vuelve a intentarlo.",
    ghCreateFailed:
      "No se pudo crear ni subir el código al repositorio privado de GitHub. Revisa tus permisos e inténtalo de nuevo.",
  },
  actions: {
    refreshed: "Comprobaciones del entorno actualizadas.",
    githubAuthPending:
      "Introduce el código de un solo uso en GitHub y luego pulsa Comprobar sesión.",
    githubAuthReady: "Sesión iniciada en GitHub como {{username}}.",
    githubAuthWaiting:
      "Esperando a que completes el inicio de sesión de GitHub en tu navegador.",
    githubRepoCreated: "Repositorio privado conectado y sincronizado.",
    githubSkipped:
      "Configuración de GitHub omitida. Puedes conectar un repositorio más adelante.",
    githubReset: "Configuración de GitHub reabierta.",
  },
  widget: {
    progressOf: "{{done}} de {{total}} pasos listos",
    title: "Tu instalación local está lista.",
    titleIncomplete: "Completa tu instalación local",
    subtitle:
      "next-vibe ya funciona en tu equipo. Si quieres, conecta un repositorio privado en GitHub y después pasa al asistente de configuración.",
    subtitleIncomplete:
      "Revisa los pasos de abajo, corrige cualquier elemento marcado y continúa al asistente de configuración.",
    checkoutLabel: "Carpeta",
    stateFileLabel: "Archivo de estado",
    recheck: "Volver a comprobar",
    rechecking: "Comprobando...",
    copy: "Copiar",
    copied: "Copiado",
    steps: {
      git: {
        title: "Git",
        missingDetail: "No se encontró Git en PATH.",
        missingRecovery:
          "Instala git, abre una nueva terminal y ejecuta el instalador de nuevo.",
      },
      bun: {
        title: "Entorno Bun",
        missingDetail: "No se encontró Bun en PATH.",
        missingRecovery:
          "Instala Bun desde https://bun.sh y ejecuta el instalador de nuevo.",
      },
      clone: {
        title: "Copia de next-vibe",
        clonedDetail: "Clonado en {{dir}}",
        existingDetail: "Copia existente conservada en {{dir}}",
        unknownDetail: "Ejecutándose desde {{dir}}",
      },
      dependencies: {
        title: "Dependencias y CLI",
        readyDetail: "Paquetes instalados y CLI de vibe listo.",
        missingDetail: "node_modules está incompleto.",
        missingRecovery:
          "Ejecuta 'bun install' dentro de tu carpeta de proyecto.",
      },
      github: {
        title: "Repositorio privado en GitHub",
        optionalTag: "Opcional",
        connectedDetail: "Origin apunta a {{url}}",
        skippedDetail:
          "Omitido por ahora. Seguirás recibiendo actualizaciones desde next-vibe.",
        pendingDetail: "Opcional. Mantén tu propia copia privada en GitHub.",
      },
      server: {
        title: "Servidor local",
        readyDetail: "Escuchando en http://localhost:{{port}}",
      },
    },
    githubCard: {
      title: "Repositorio privado en GitHub",
      badge: "Opcional",
      body: "Crea tu propio repositorio privado para mantener tus cambios en privado en GitHub mientras conservas upstream conectado a next-vibe.",
      connectedTitle: "Repositorio privado conectado",
      connectedOpen: "Abrir en GitHub",
      skippedNotice:
        "Configuración de GitHub omitida. Puedes conectar un repositorio privado cuando quieras.",
      reopenButton: "Configurar GitHub",
      skipButton: "Omitir por ahora",
      signedInAs: "Sesión iniciada en GitHub como {{username}}",
      repoNameLabel: "Nombre del repositorio privado",
      repoNameHelp:
        "Se crea como repositorio privado en tu cuenta de GitHub. Upstream sigue enlazado a next-vibe.",
      createButton: "Crear repositorio privado",
      creatingButton: "Creando y subiendo...",
      signInButton: "Iniciar sesión en GitHub",
      startingSignIn: "Iniciando sesión...",
      deviceTitle: "Aprueba el acceso en GitHub",
      deviceBody:
        "Copia el código de un solo uso, abre la página de dispositivo de GitHub y aprueba el acceso. Esta página no guarda tokens.",
      deviceOpenLink: "Abrir página de dispositivo de GitHub",
      deviceCheckButton: "Ya inicié sesión, comprobar de nuevo",
      manualTitle: "Configuración manual (sin GitHub CLI)",
      manualBody:
        "GitHub CLI (gh) no está instalado. Crea un repositorio privado vacío en GitHub y ejecuta estos tres comandos en la carpeta del proyecto.",
      manualNewRepoLink: "Crear un repositorio privado en GitHub",
      manualShowCommands: "Mostrar comandos git",
      manualHideCommands: "Ocultar comandos git",
    },
    handover: {
      continueToSetup: "Continuar al asistente de configuración",
      openApp: "Abrir aplicación",
      hint: "Siguiente paso: crea tu acceso de administrador y conecta tu cuenta de unbottled.ai o tus claves API.",
      completeHint:
        "La configuración inicial ya está completa en esta instancia.",
    },
  },
};
