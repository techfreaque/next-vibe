import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "Video",
    vision: "Visión",
    ai: "IA",
  },
  post: {
    title: "Describe Video",
    titleShort: "Describe Video",
    dynamicTitle: "Describe: {{filename}}",
    description:
      "Describir el contenido de un vídeo usando un modelo de visión AI",
    fileUrl: {
      label: "Video URL",
      description: "URL del vídeo para describir",
    },
    context: {
      label: "Contexto",
      description: "Contexto opcional para guiar la descripción",
      placeholder: "Describir este video enfocado en...",
    },
    submitButton: {
      label: "Describe Video",
      loadingText: "Describiendo...",
    },
    response: {
      text: "Descripción",
      model: "Modelo utilizado",
      creditCost: "Créditos utilizados",
    },
    errors: {
      validation_failed: {
        title: "Error de validación",
        description: "Por favor, proporcione un vídeo válido URL",
      },
      network_error: {
        title: "Error de red",
        description: "No conectado al servicio de visión",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Por favor, inicie sesión para usar esta característica",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para usar esta característica",
      },
      not_found: {
        title: "No encontrado",
        description: "El video no fue encontrado",
      },
      server_error: {
        title: "Error del servidor",
        description:
          "Un error inesperado ocurrió durante la descripción de vídeo",
      },
      unknown_error: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved_changes: {
        title: "Cambios sin guardar",
        description: "Por favor, guarde sus cambios antes de describir",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
      noVisionModel: "No se configura ningún modelo de visión de vídeo",
      descriptionFailed: "Failed to describe the video: {{error}}",
      insufficientCredits:
        "Créditos insuficientes. Saldo: {{balance}}, mínimo requerido: {{minimum}}.",
      balanceCheckFailed: "Fallado para comprobar su saldo de crédito",
      creditsFailed: "Fallado para deducir créditos",
    },
    success: {
      title: "Video Descrito",
      description: "El vídeo ha sido descrito con éxito",
    },
  },
};
