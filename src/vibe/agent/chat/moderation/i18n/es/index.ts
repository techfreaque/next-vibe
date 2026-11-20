import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Moderación",
  },
  get: {
    title: "Contenido notificado",
    titleShort: "Moderation Queue",
    description:
      "Reported and hidden public-feed posts and shared threads, most urgent first",
    fields: {
      minReports: {
        label: "Min Reports",
        description: "Informes mínimos abiertos para incluir (por defecto: 1)",
      },
      limit: {
        label: "Limitación",
        description: "Número máximo de hilos para regresar",
      },
      offset: {
        label: "Offset",
        description: "Número de hilos a saltar para paginación",
      },
    },
    response: {
      threads: {
        id: { content: "Thread ID" },
        title: { content: "Título" },
        rootFolderId: { content: "Folder" },
        authorId: { content: "Autor ID" },
        authorName: { content: "Autor" },
        authorBanned: { content: "Autores prohibidos" },
        moderationStatus: { content: "Situación" },
        reportCount: { content: "Informes" },
        reasons: { content: "Razones" },
        latestNote: { content: "Última nota" },
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
        description: "No se encontró la conversación",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para cargar la cola de moderación",
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
      title: "Carga de cola",
      description: "Contenido reportado recuperado con éxito",
    },
    note: "“{{note}}”",
    empty: "Nada reportado. La comunidad se ve sana.",
    status: {
      visible: "Visible",
      underReview: "En examen",
      removed: "Retirado",
      authorBanned: "Autores prohibidos",
    },
    reasons: {
      spam: "Spam",
      illegal: "Ilegal",
      abuse: "Abuso",
      csamFlag: "Seguridad infantil",
      other: "Otro",
    },
    action: {
      dismiss: "Sueldo",
      remove: "Retirar",
      banAuthor: "Remove + ban autor",
    },
    backButton: {
      label: "Atrás",
    },
  },
  patch: {
    title: "Contenido moderado",
    titleShort: "Moderado",
    description:
      "Desestimar los informes y restaurar un hilo, eliminarlo o retirarlo y prohibir a su autor",
    fields: {
      id: {
        label: "Thread ID",
        description: "ID del hilo a moderado",
      },
      action: {
        label: "Medida",
        description:
          "desestimación = recuperación y informes claros, eliminar = ocultar permanentemente, prohibir = eliminar y prohibir el autor",
      },
    },
    actions: {
      dismiss: "Informes de desestimación (restoreo)",
      remove: "Eliminar el contenido",
      banAuthor: "Eliminar y prohibir el autor",
    },
    response: {
      patchId: { content: "Thread ID" },
      patchStatus: { content: "Estado nuevo" },
      patchReportCount: { content: "Cuenta del informe" },
      authorBanned: { content: "Autores prohibidos" },
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
        description: "No se encontró la conversación",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to moderate the thread",
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
      noAuthor: {
        title: "No registrado autor",
        description:
          "Este hilo fue publicado por un invitado, así que no hay cuenta para prohibir",
      },
    },
    success: {
      title: "Contenido Moderado",
      description: "Medidas aplicadas con éxito",
    },
  },
};
