import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Habilidades AI",
  tags: {
    moderation: "Moderación",
  },
  get: {
    title: "Habilidades reportadas",
    titleShort: "Skills denunciadas",
    description:
      "Habilidades de lista con informes, ordenados por número de informe",
    fields: {
      minReports: {
        label: "Min Reports",
        description: "El informe mínimo cuenta para incluir (por defecto: 1)",
      },
      limit: {
        label: "Limitación",
        description: "Número máximo de habilidades para regresar",
      },
      offset: {
        label: "Offset",
        description: "Número de habilidades para saltar para la paginación",
      },
    },
    response: {
      skills: {
        id: { content: "ID de la habilidad" },
        name: { content: "Nombre" },
        ownerAuthorId: { content: "Propietario ID" },
        status: { content: "Situación" },
        reportCount: { content: "Informes" },
        voteCount: { content: "Votos" },
        trustLevel: { content: "Nivel de confianza" },
        publishedAt: { content: "Publicado en" },
        updatedAt: { content: "Actualizado en" },
      },
      totalCount: { content: "Total" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      network: { title: "Error de red", description: "La conexión falló" },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso de los administradores necesario",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "No se han encontrado habilidades",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to load reported skills",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Habilidades cargadas",
      description: "Destrezas reportadas recuperadas con éxito",
    },
    empty: "No hay habilidades reportadas - la comunidad se ve saludable!",
    action: {
      moderate: "Moderado",
    },
    backButton: {
      label: "Atrás",
    },
  },
  patch: {
    title: "Habilidad moderada",
    titleShort: "Habilidad moderada",
    description: "Ocultar una habilidad reportada o aclarar sus informes",
    fields: {
      id: {
        label: "ID de la habilidad",
        description: "ID de la habilidad a moderado",
      },
      action: {
        label: "Medida",
        description:
          "escondite = estado establecido en UNLISTED, claro = informe de reajuste cuenta a 0",
      },
    },
    response: {
      id: { content: "ID de la habilidad" },
      status: { content: "Estado nuevo" },
      reportCount: { content: "Cuenta del informe" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      network: { title: "Error de red", description: "La conexión falló" },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso de los administradores necesario",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      notFound: {
        title: "No encontrado",
        description: "Habilidad no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to moderate skill",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Habilidad Moderada",
      description: "Medidas aplicadas con éxito",
    },
  },
};
