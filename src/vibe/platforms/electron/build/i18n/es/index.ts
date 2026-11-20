import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronBuild: "Electron Build",
  },
  post: {
    title: "Construir la aplicación electron",
    titleShort: "Construir electrones",
    description:
      "Compilar principal / precarga con bun, ejecutar vibe construir, luego paquete con electron-builder",
    form: {
      title: "Configuración de construcción de electrones",
      description: "Configurar los parámetros de construcción de electrones",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta",
    },
    fields: {
      viBuild: {
        title: "Run vibe build",
        description:
          "Run vibe build (Next.js + migraciones) antes de empaquetar",
      },
      generate: {
        title: "Generar puntos finales",
        description: "Índice regenerado de punto final antes de construir",
      },
      platform: {
        title: "Plataforma de destino",
        description: "Que plataforma para empaquetar",
        options: {
          current: "OS actual",
          linux: "Linux",
          mac: "macOS",
          win: "Ventanas",
          all: "Todas las plataformas",
        },
      },
      success: {
        title: "Operación completada",
      },
      output: {
        title: "Producto",
      },
      duration: {
        title: "Duración ms)",
      },
      errors: {
        title: "Errores",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
        viBuildFailed: "vibe build failed: {{error}}",
        compileFailed: "Compilación de electrones falló: {{error}}",
        builderFailed: "electron-builder falló: {{error}}",
        buildFailed: "Electron build failed: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Operación completada",
      description: "Aplicación electron construida con éxito",
    },
  },
};
