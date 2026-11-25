import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    kind: {
      paid: "Pagados (paquetes + suscripciones)",
      packs: "Paquetes pagados",
      subscriptions: "Créditos de suscripción",
      gifted: "Regalados (admin)",
    },
  },
  post: {
    titleShort: "Créditos emitidos",
    title: "Créditos emitidos (pagados, regalados)",
    description:
      "Créditos añadidos a las carteras por intervalo, en créditos (no dinero): paquetes pagados y créditos de suscripción de pagos reales, o créditos regalados por un admin (testers, creadores, compensaciones).",
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
      kind: {
        label: "Tipo",
        description:
          "Qué contar: paquetes pagados + suscripciones, solo paquetes, solo suscripciones o créditos regalados por un admin",
      },
      result: {
        label: "Créditos emitidos",
        description: "Serie de tiempo de producción",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución de nodos" },
    },
    success: {
      title: "Créditos adquiridos calculados",
      description: "Créditos Serie comprada devuelto",
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
