import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam:
      "Desapareciendo el parámetro URL {{paramName}} para endpoint {{endpoint}}",
    urlConstructionFailed: "La construcción URL falló: {{error}}",
    validationFailed: "Fallo de validación: {{error}}",
    htmlResponseReceived:
      "Respuesta de HTML recibida en lugar de JSON de {{url}} (status {{status}}). Compruebe que el servidor API está funcionando y el punto final existe.",
    networkError: "Error de red ocurrido: {{error}}",
    failedToLoadPage: "Failed to load page",
  },
  generate: {
    post: {
      title: "Generar índices de exposición",
      titleShort: "Índices de exposición",
      description:
        "Generar envolturas de compatibilidad Expo Router para páginas Next.js",
      response: {
        fields: {
          success: "Operación completada",
          created: "Archivos creados",
          skipped: "Archivos pasados",
          errors: "Errores",
          message: "Mensaje",
        },
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de solicitud no válidos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Usted no está autorizado para realizar esta acción",
        },
        server: {
          title: "Error del servidor",
          description: "Se produjo un error al generar índices",
        },
        network: {
          title: "Error de red",
          description: "Se produjo un error de red",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para realizar esta acción",
        },
        notFound: {
          title: "No encontrado",
          description: "Directorio de fuentes no encontrado",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error desconocido",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
      },
      success: {
        title: "Operación completada",
        description:
          "Archivos {{created}} generados, archivos {{skipped}} saltados, errores {{errors}}",
      },
    },
  },
};
