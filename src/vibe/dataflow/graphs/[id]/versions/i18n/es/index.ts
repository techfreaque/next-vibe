import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Historia de la versión Gráfico",
    titleShort: "Versiones de Gráficos",
    description:
      "Obtenga la cadena de versión para un gráfico (corredor a pie a través de parentVersionId)",
    fields: {
      id: { label: "Gráfico ID", description: "UUID del gráfico" },
      versions: {
        label: "Versiones",
        description:
          "Lista ordenada de versiones del antepasado (antiguo primero)",
        id: { label: "Versión ID", description: "UUID de la versión" },
        name: {
          label: "Nombre",
          description: "Nombre del gráfico en esta versión",
        },
        createdAt: {
          label: "Creado en",
          description: "Cuando se creó esta versión",
        },
        isActive: {
          label: "Activa",
          description: "Ya sea que esta es la versión activa",
        },
      },
    },
    success: {
      title: "Historia de la versión cargada",
      description: "cadena de versión recuperada con éxito",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No se puede acceder a este gráfico",
      },
      server: {
        title: "Error del servidor",
        description: "No se puede cargar la historia de la versión",
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
