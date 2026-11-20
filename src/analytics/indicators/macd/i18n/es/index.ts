import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "MACD",
    titleShort: "MACD",
    description:
      "Moving Media Convergence Divergence - indicador del impulso que sigue la tendencia",
    fields: {
      source: { label: "Fuente", description: "Serie de tiempo de entrada" },
      resolution: { label: "Resolución", description: "Plazo de cálculo" },
      range: { label: "Rango", description: "Rango de tiempo para calcular" },
      lookback: {
        label: "Mira atrás.",
        description:
          "Barras extra antes de empezar el rango para calentamiento",
      },
      fastPeriod: {
        label: "Período rápido",
        description: "Período EMA rápido (1–100)",
      },
      slowPeriod: {
        label: "Período lento",
        description: "Período EMA lento (1–200)",
      },
      signalPeriod: {
        label: "Período de señalización",
        description: "Plazo de señal EMA (1–50)",
      },
      macd: { label: "MACD", description: "MACD line (fast EMA − slow EMA)" },
      signal: {
        label: "Signal",
        description: "Línea de señalización (EMA de la línea MACD)",
      },
      histogram: {
        label: "Histograma",
        description: "Histograma (MACD – señal)",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "MACD computed",
      description: "MACD, señal y serie de histograma devuelto",
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
        description: "La computación MACD falló",
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
