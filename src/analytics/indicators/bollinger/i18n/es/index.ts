import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Bandas Bollinger",
    titleShort: "Bollinger",
    description:
      "Bandas de Bollinger - superior, medio (SMA), y banda inferior usando la desviación estándar",
    fields: {
      source: { label: "Fuente", description: "Serie de tiempo de entrada" },
      resolution: { label: "Resolución", description: "Plazo de cálculo" },
      range: { label: "Rango", description: "Rango de tiempo para calcular" },
      lookback: {
        label: "Mira atrás.",
        description:
          "Barras extra antes de empezar el rango para calentamiento",
      },
      period: {
        label: "Período",
        description: "Número de períodos (2 a 200)",
      },
      stdDev: {
        label: "Multiplicador de Dev Std",
        description: "Multiplicador de desviación estándar (0.1–5)",
      },
      upper: {
        label: "Banda superior",
        description: "Serie de tiempo de banda superior",
      },
      middle: {
        label: "Banda media",
        description: "Serie de tiempo de banda media (SMA)",
      },
      lower: {
        label: "Banda baja",
        description: "Serie de tiempo de Banda Bollinger inferior",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Bandas Bollinger computed",
      description: "Serie de banda superior, media y inferior",
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
        description: "Bollinger Bands computation falló",
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
