import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Mensajes de chat de usuarios",
    titleShort: "Mensajes de usuarios",
    description: "Número de mensajes enviados por usuarios por intervalo",
    fields: {
      resolution: { label: "Resolución", description: "Intervalo de cálculo" },
      range: { label: "Período", description: "Período que se va a consultar" },
      lookback: {
        label: "Historial adicional",
        description: "Intervalos adicionales antes del inicio del período",
      },
      result: {
        label: "Mensajes de usuarios",
        description: "Serie temporal resultante",
      },
      meta: {
        label: "Metadatos",
        description: "Metadatos de ejecución del nodo",
      },
    },
    success: {
      title: "Cálculo completado: Mensajes de usuarios",
      description: "Serie temporal devuelta: Mensajes de usuarios",
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
