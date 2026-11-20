import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Moderación",
  },
  post: {
    title: "Informe contenido",
    titleShort: "Informe",
    description:
      "Reporte un post público o un hilo compartido. Los informes de suficientes personas lo ocultan hasta que un administrador lo revise.",
    reason: {
      label: "Razón",
      description: "¿Qué tiene de malo este contenido?",
    },
    note: {
      label: "Detalles",
      description: "Opcional. Añadir contexto para el revisor.",
      placeholder: "¿Qué debería saber el revisor?",
    },
    reasons: {
      spam: "Spam",
      illegal: "Contenido ilegal",
      abuse: "Abuso o acoso",
      csamFlag: "Protección de los niños",
      other: "Otro",
    },
    messageId: {
      label: "Mensaje ID",
      description: "Mensaje específico que se está reportando (opcional)",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Escoge una razón",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no puede informar de este contenido",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no puede informar de su propio contenido",
      },
      notFound: {
        title: "No encontrado",
        description: "Este contenido ha desaparecido o no está disponible",
      },
      server: {
        title: "Error del servidor",
        description: "Su informe no puede ser presentado",
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
        title: "Ya reportado",
        description: "Ya reportaste este contenido.",
      },
      rateLimited: {
        title: "Demasiados informes",
        description:
          "Estás reportando demasiado rápido. Inténtalo de nuevo más tarde.",
      },
    },
    success: {
      title: "Informe presentado",
      description: "Gracias. Revisamos todos los informes.",
    },
    response: {
      reported: { content: "Reported" },
      reportCount: { content: "Cuenta del informe" },
      hidden: { content: "Oculto" },
    },
    backButton: {
      label: "Atrás",
    },
    button: {
      submit: "Informe presentado",
      loading: "Enviando...",
    },
  },
};
