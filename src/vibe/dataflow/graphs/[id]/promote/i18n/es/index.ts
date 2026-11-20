import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Promover el sistema",
    titleShort: "Fomentar el Gráfico",
    description:
      "Promover un gráfico de administración a propiedad del sistema (sólo, compartido)",
    fields: {
      id: { label: "Gráfico ID", description: "UUID del gráfico" },
    },
    response: {
      promotedId: "Gráfico ID",
    },
    widget: {
      confirmDescription:
        "Promover este gráfico hará que sea propiedad del sistema y compartido con todos los usuarios. La versión actual del sistema para este slug será desactivada. Esto se puede revertir promoviendo una versión diferente.",
      promotedIdLabel: "ID promovido:",
      viewButton: "Vista",
    },
    success: {
      title: "Gráfico promovido",
      description: "Gráfico promovido al sistema con éxito",
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
        description: "Failed to promote graph",
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
