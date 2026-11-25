import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    stage: {
      leads: "Todos los leads",
      humans: "Leads humanos",
      firstChats: "Chatearon",
      signups: "Registrados",
      emailConfirmed: "Email confirmado",
      payers: "Pagaron",
    },
  },
  post: {
    title: "Etapa del embudo de leads",
    titleShort: "Etapa del embudo",
    description:
      "Leads creados por periodo y cuántos llegaron a una etapa del embudo. Bots excluidos tras la primera etapa.",
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
      stage: {
        label: "Etapa",
        description: "Qué etapa del embudo contar",
      },
      result: {
        label: "Recuento de etapa",
        description: "Serie temporal de salida",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Datos de etapa del embudo",
      description: "Serie de la etapa devuelta",
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
