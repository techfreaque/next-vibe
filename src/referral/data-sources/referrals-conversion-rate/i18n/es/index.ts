import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Tasa de conversión de referencia",
    titleShort: "Tasa de conversión",
    description:
      "Porcentaje de primeras visitas medidas que generaron una inscripción atribuida",
    fields: {
      resolution: { label: "Resolución", description: "Plazo de cálculo" },
      range: {
        label: "Rango",
        description: "Rango de tiempo para la consulta",
      },
      lookback: {
        label: "Mira atrás.",
        description: "Barras extra antes de empezar el rango",
      },
      result: {
        label: "Tasa de conversión",
        description:
          "Inscripciones como porcentaje de primeras visitas, por fecha de visita",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Tasa de conversión calculada",
      description: "Vuelta la tasa de conversión de referencia",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "La consulta falló.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Cuenta o sesión no encontradas",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Solicitud de red falló",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar los cambios primero",
      },
    },
  },
};
