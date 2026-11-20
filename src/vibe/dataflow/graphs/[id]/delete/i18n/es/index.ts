import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "Borrar Gráfico",
    titleShort: "Borrar Gráfico",
    description: "Eliminar permanentemente un gráfico. Se fue para siempre.",
    fields: {
      id: {
        label: "Gráfico ID",
        description: "UUID del gráfico para eliminar",
      },
    },
    response: {
      deletedId: "Gráfico Suprimido ID",
    },
    widget: {
      confirmDescription:
        "Permanente. El gráfico y su confidente son borrados. no deshacer. Sólo funciona cuando el gráfico no contiene datos; de lo contrario, archivarlo.",
      deletedIdLabel: "ID suprimido:",
      backToList: "Volver a los gráficos",
    },
    success: {
      title: "Gráfico eliminado",
      description: "El gráfico fue eliminado permanentemente",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No puedes borrar este gráfico.",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to delete graph",
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
      conflict: {
        title: "Tiene datos",
        description:
          "Graph tiene puntos de datos. archivarlo en lugar de borrar",
      },
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
