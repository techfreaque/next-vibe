import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Herramientas AI",
  tags: {
    skills: "habilidades",
  },
  post: {
    title: "Reportar habilidad",
    titleShort: "Reportar habilidad",
    description:
      "Informe una habilidad comunitaria para moderar. Idempotent - un informe por usuario por habilidad.",
    dynamicTitle: "Informe: {{name}}",
    reason: {
      label: "Razón",
      description: "¿Por qué estás reportando esta habilidad?",
      placeholder: "Describir el tema...",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, proporcione una razón",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para reportar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No puedes reportar esta habilidad.",
      },
      notFound: {
        title: "No encontrado",
        description: "Habilidad no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al presentar su informe",
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
        description: "Ya has reportado esta habilidad.",
      },
    },
    success: {
      title: "Informe presentado",
      description: "Gracias por ayudar a mantener la comunidad segura",
    },
    response: {
      reported: { content: "Reported" },
      reportCount: { content: "Cuenta del informe" },
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
