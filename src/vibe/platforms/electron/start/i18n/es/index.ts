import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronStart: "Electron Start",
  },
  post: {
    title: "Start Electron App",
    titleShort: "Comienzo Electron",
    description:
      "Compile main/preload y lanzar la ventana de escritorio de Electron (modo Dev - sin embalaje)",
    form: {
      title: "Configuración de inicio de electrones",
      description: "Configure cómo comienza la aplicación Electron",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta inicial",
    },
    fields: {
      port: {
        title: "Port",
        description:
          "Puerto el servidor vibe se ejecuta en (por defecto: 3000)",
      },
      vibeStart: {
        title: "Run vibe start",
        description:
          "Vibo desgastado comienza en el fondo antes de abrir la ventana",
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
        compileFailed: "Compilación de electrones falló: {{error}}",
        startFailed: "Electron start failed: {{error}}",
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
      description: "Electron app started",
    },
  },
};
