import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Avisos de errores",
    titleShort: "Registros de advertencia",
    description:
      "Entradas de registro de nivel de alerta por cubo de resolución",
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
        label: "Entradas de advertencia",
        description: "Serie de tiempo de producción",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Registros de errores Advertencias calculadas",
      description: "Errores de la serie Advertencias devueltos",
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
