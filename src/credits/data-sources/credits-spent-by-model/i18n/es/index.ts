import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    group: {
      uncensoredAi: "Uncensored.ai (Uncensored LM)",
      zai: "Z.AI (GLM)",
      moonshot: "Moonshot (Kimi)",
      deepseek: "DeepSeek",
      venice: "Venice",
      xai: "xAI (Grok)",
      anthropic: "Anthropic (Claude)",
      openai: "OpenAI (GPT)",
      google: "Google (Gemini)",
      otherChat: "Otros modelos de chat",
      image: "Generación de imágenes",
      video: "Generación de vídeo",
      music: "Generación de música",
      voice: "Voz (TTS + STT)",
      tools: "Herramientas (búsqueda, lectura, memoria)",
      unattributed: "Sin atribuir",
    },
  },
  post: {
    titleShort: "Gasto por modelo",
    title: "Créditos gastados por familia de modelos",
    description:
      "Créditos gastados por intervalo en un grupo: modelos de chat por creador (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini, otros), imagen, vídeo, música, voz, herramientas. Todos los usuarios incluidos, los grupos suman el gasto total. En créditos.",
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
      group: {
        label: "Grupo",
        description:
          "Familia de modelos (chat por creador) o grupo de medios / herramientas",
      },
      result: {
        label: "Créditos gastados",
        description: "Serie de tiempo de producción",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Serie calculada",
      description: "Serie temporal devuelta",
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
