import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de servidores",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Reconstrucción &quot; Reini &quot;",
    titleShort: "Rebuild",
    description:
      "Recompilar la aplicación y hot-restart el servidor running Next.js. Ejecuta 6 pasos en secuencia: 1) generación de códigos, 2) verificación vibe (código de calidad), 3) Next.js construcción de producción, 4) migración de bases de datos, 5) visualización de bases de datos, 6) hot-restart a través SIGUSR1. El control de vibración bloquea la construcción si hay errores - use 'vibe check' o la herramienta de verificación MCP para ver detalles. WARNING : La respuesta HTTP puede ser cortada porque el servidor se reinicia antes de que la respuesta termine.",
    form: {
      title: "Reconstrucción &quot; Reini &quot;",
      description: "Reconstruir la aplicación y reiniciar el servidor",
    },
    fields: {
      framework: {
        title: "Framework",
        description: "Marco objetivo para la construcción y el reiniciamiento",
      },
      webpack: {
        title: "Webpack",
        description:
          "Utilice la webpack en lugar de Turbopack (predeterminado: verdadero)",
      },
      success: {
        title: "Resultado",
      },
      errors: {
        title: "Errores",
      },
      duration: {
        title: "Duración",
      },
      steps: {
        title: "Pasos",
      },
    },
    steps: {
      codegen: "Generación de códigos",
      vibeCheck: "Vibe check",
      nextBuild: "Next.js construir",
      migrate: "Migraciones",
      seed: "Seeding",
      restart: "Restart",
      codegenFailed: "La generación del código falló: {{error}}",
      vibeCheckFailed:
        "Control de vibración: errores {{errors}}, avisos {{warnings}}. Use 'vibe check' o la herramienta de verificación MCP para ver detalles.",
      vibeCheckError: "Error de comprobación Vibe: {{error}}",
      buildFailed: "Next.js build failed: {{error}}",
      buildOom:
        "Next.js construyen asesinados por el OS (de memoria similar) - señal: {{signal}}",
      buildExitCode: "Next.js construir salió con código {{code}}",
      migrationFailed: "La migración falló: {{error}}",
      seedingFailed: "Fallo de la búsqueda: {{error}}",
      restartFailed: "El reinicio del servidor falló: {{error}}",
      unknownError: "error desconocido",
      noPidFile:
        "No.vibe-pid archivo encontrado - es vibe empezar a funcionar?",
      invalidPid: "PID inválido en.vibe-pid: {{pid}}",
      processNotRunning: "Proceso {{pid}} no está funcionando",
      signalFailed: "Failed to send SIGUSR1: {{error}}",
    },
    errors: {
      validation: {
        title: "Validación fallida",
        description: "Parámetros de reconstrucción inválidos proporcionados",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red fracasó durante la reconstrucción",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para reconstruir la aplicación",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para reconstruir la aplicación",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos no encontrados",
      },
      server: {
        title: "Error del servidor",
        description:
          "Se produjo un error de servidor interno durante la reconstrucción",
        buildFailed: "Error de construcción: {{error}}",
        migrationsFailed: "Las migraciones fallaron: {{error}}",
        rebuildFailed: "Recompild falló: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Un error desconocido ocurrió durante la reconstrucción",
      },
      conflict: {
        title: "Conflicto",
        description: "Ya está en marcha una reconstrucción.",
      },
    },
    success: {
      title: "Rebuild Complete",
      description: "Aplicación reconstruida y servidor reiniciado con éxito",
    },
    widget: {
      rebuildComplete: "Comprobación completa",
      rebuildFailed: "Rebuild falló",
      errors: "Errores:",
      runRebuild: "Corre Rebuild",
      runAgain: "Corre otra vez.",
      skipped: "saltando",
    },
  },
};
