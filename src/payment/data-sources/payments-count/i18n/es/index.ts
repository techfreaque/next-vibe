import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "Pagos cobrados",
    titleShort: "Cobrados",
    description:
      "Pagos cobrados por periodo: paquetes, nuevas suscripciones y renovaciones. Exitosos o reembolsados después, sin cuentas admin.",
    fields: {
      resolution: {
        label: "Resolución",
        description: "Plazo de cálculo",
      },
      range: {
        label: "Rango",
        description: "Rango de tiempo para la consulta",
      },
      lookback: {
        label: "Mira atrás.",
        description: "Barras extra antes de empezar el rango",
      },
      result: {
        label: "Pagos cobrados",
        description: "Serie de tiempo de producción",
      },
      meta: {
        label: "Meta",
        description: "Metadatos de ejecución de nodos",
      },
    },
    success: {
      title: "Pagos cobrados calculados",
      description: "Serie de pagos cobrados devuelta",
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
      conflict: {
        title: "Conflicto",
        description: "Conflicto",
      },
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
