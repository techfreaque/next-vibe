import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    image: "Imagen",
    vision: "Visión",
    ai: "IA",
  },
  post: {
    title: "Describir imagen",
    titleShort: "Describir imagen",
    dynamicTitle: "Describe: {{filename}}",
    description:
      "Describir el contenido de una imagen usando un modelo AI de visión",
    fileUrl: {
      label: "Imagen URL",
      description: "URL de la imagen para describir",
    },
    context: {
      label: "Contexto",
      description: "Contexto opcional para guiar la descripción",
      placeholder: "Describir esta imagen centrándose en...",
    },
    submitButton: {
      label: "Describir imagen",
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
        description: "Proporcione una imagen válida URL",
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
        description: "La imagen no fue encontrada",
      },
      server_error: {
        title: "Error del servidor",
        description:
          "Un error inesperado ocurrió durante la descripción de la imagen",
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
      noVisionModel: "No se configura ningún modelo de visión de imagen",
      descriptionFailed: "Fallado para describir la imagen: {{error}}",
      insufficientCredits:
        "Créditos insuficientes. Saldo: {{balance}}, mínimo requerido: {{minimum}}.",
      balanceCheckFailed: "Fallado para comprobar su saldo de crédito",
      creditsFailed: "Fallado para deducir créditos",
    },
    success: {
      title: "Imagen descrita",
      description: "La imagen ha sido descrita con éxito",
    },
  },
};
