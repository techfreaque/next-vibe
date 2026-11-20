import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Gráfico de la cometa",
    titleShort: "Gráfico de la cometa",
    description: "Activar manualmente la ejecución de gráficos a pedido",
    fields: {
      id: { label: "Gráfico ID", description: "UUID del gráfico" },
      rangeFrom: { label: "Desde", description: "Rango de inicio (fecha ISO)" },
      rangeTo: { label: "A", description: "Fin de rango (fecha ISO)" },
    },
    response: {
      nodeCount: "Números ejecutados",
      errorCount: "Errores",
    },
    widget: {
      nodesExecuted: "Números ejecutados",
      errors: "Errores",
      errorDetails: "Detalles del error",
      nodeLabel: "Node",
    },
    success: {
      title: "Gráfico ejecutado",
      description: "Gráfico corrió con éxito",
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
        description: "La ejecución de los Gráficos falló",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros inválidos",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Gráfico no encontrado",
      },
      conflict: { title: "Conflicto", description: "Conflicto de recursos" },
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
