import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Total de llamadas a herramientas en el chat",
    titleShort: "Llamadas a herramientas",
    description:
      "Número total de mensajes con llamadas a herramientas por intervalo",
    fields: {
      resolution: { label: "Resolución", description: "Intervalo de cálculo" },
      range: { label: "Período", description: "Período que se va a consultar" },
      lookback: {
        label: "Historial adicional",
        description: "Intervalos adicionales antes del inicio del período",
      },
      result: {
        label: "Llamadas a herramientas",
        description: "Serie temporal resultante",
      },
      meta: {
        label: "Metadatos",
        description: "Metadatos de ejecución del nodo",
      },
    },
    success: {
      title: "Cálculo completado: Llamadas a herramientas",
      description: "Serie temporal devuelta: Llamadas a herramientas",
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
