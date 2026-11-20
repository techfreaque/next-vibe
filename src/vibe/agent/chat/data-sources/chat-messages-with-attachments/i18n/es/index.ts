import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Mensajes de chat con archivos adjuntos",
    titleShort: "Archivos adjuntos",
    description: "Mensajes con archivos adjuntos por intervalo",
    fields: {
      resolution: { label: "Resolución", description: "Intervalo de cálculo" },
      range: { label: "Período", description: "Período que se va a consultar" },
      lookback: {
        label: "Historial adicional",
        description: "Intervalos adicionales antes del inicio del período",
      },
      result: {
        label: "Mensajes con archivos adjuntos",
        description: "Serie temporal resultante",
      },
      meta: {
        label: "Metadatos",
        description: "Metadatos de ejecución del nodo",
      },
    },
    success: {
      title: "Cálculo completado: Mensajes de chat con archivos adjuntos",
      description:
        "Serie temporal devuelta: Mensajes de chat con archivos adjuntos",
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
