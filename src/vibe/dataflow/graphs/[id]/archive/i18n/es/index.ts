import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Gráfico de archivos",
    titleShort: "Gráfico de archivos",
    description: "Soft-delite un gráfico (desactivar y marcar como archivado)",
    fields: {
      id: { label: "Gráfico ID", description: "UUID del gráfico al archivo" },
    },
    response: {
      archivedId: "Gráfico archivado ID",
    },
    widget: {
      confirmDescription:
        "Esto desactivará el gráfico y lo marcará como archivado. Ya no funcionará según lo previsto. Esto se puede deshacer.",
      archivedIdLabel: "Archivado ID :",
      backToList: "Volver a los gráficos",
    },
    success: {
      title: "Archivo de Gráficos",
      description: "Graph ha sido archivado con éxito",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No se pueden archivar gráficos del sistema",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to archive graph",
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
