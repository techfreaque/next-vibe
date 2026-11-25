import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Ejecuciones fallidas de cron",
    titleShort: "Cron fallidas",
    description:
      "Ejecuciones de cron fallidas, con error o agotadas por intervalo",
    fields: {
      resolution: { label: "Resolución", description: "Intervalo de cálculo" },
      range: { label: "Período", description: "Período que se va a consultar" },
      lookback: {
        label: "Historial adicional",
        description: "Intervalos adicionales antes del inicio del período",
      },
      result: {
        label: "Ejecuciones fallidas",
        description: "Serie temporal resultante",
      },
      meta: {
        label: "Metadatos",
        description: "Metadatos de ejecución del nodo",
      },
    },
    success: {
      title: "Cálculo completado: Ejecuciones fallidas de cron",
      description: "Serie temporal devuelta: Ejecuciones fallidas de cron",
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
