import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Obtenga referencia de contacto actual",
  titleShort: "Remisión de contacto",
  description:
    "Devuelve el código de referencia vinculado al contacto actual, si hay",
  tag: "Referidos",
  response: {
    referralCode: "Código de referido",
    referralLabel: "Label de referencia",
    subscriptionBonusCredits: "Créditos de bonificación con su primer plan",
  },
  errors: {
    validation: {
      title: "Error de validación",
      description: "Solicitud inválida",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicia sesión para continuar",
    },
    forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    conflict: { title: "Conflicto", description: "Conflicto de datos" },
    serverError: {
      title: "Error del servidor",
      description: "Error del servidor interno",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    network: { title: "Error de red", description: "Ocurrió un error de red" },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
  },
  success: {
    title: "Código de referencia",
    description: "Código de referencia de contacto actual con éxito",
  },
};
