import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Mensajes de chat de la IA",
    titleShort: "Mensajes de la IA",
    description:
      "Número de mensajes del asistente de IA por intervalo. Solo chats humanos: sin hilos de agentes en segundo plano, copias remotas ni cuentas admin; los chats de incógnito nunca se guardan.",
    fields: {
      resolution: { label: "Resolución", description: "Intervalo de cálculo" },
      range: { label: "Período", description: "Período que se va a consultar" },
      lookback: {
        label: "Historial adicional",
        description: "Intervalos adicionales antes del inicio del período",
      },
      result: {
        label: "Mensajes de la IA",
        description: "Serie temporal resultante",
      },
      meta: {
        label: "Metadatos",
        description: "Metadatos de ejecución del nodo",
      },
    },
    success: {
      title: "Cálculo completado: Mensajes de la IA",
      description: "Serie temporal devuelta: Mensajes de la IA",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se requieren permisos de administrador",
      },
      server: { title: "Error del servidor", description: "Falló la consulta" },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: { title: "No encontrado", description: "No encontrado" },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Falló la solicitud de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guarda los cambios primero",
      },
    },
  },
};
