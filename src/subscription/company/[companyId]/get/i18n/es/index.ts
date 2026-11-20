import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Suscripción",
    company: "Company",
    get: "¡Vamos!",
  },
  get: {
    title: "Suscripción de la empresa",
    titleShort: "Company Sub",
    description: "Obtener la suscripción activa para una empresa",
    companyId: {
      label: "Company ID",
      description: "La empresa cuya suscripción para recuperar",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Inválido ID",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para ver las suscripciones de la empresa",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene acceso a la suscripción de esta empresa",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos",
      },
      server: {
        title: "Error del servidor",
        description: "Algo salió mal. inténtalo de nuevo",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: {
        title: "Error de red",
        description: "Revise su conexión e inténtelo de nuevo",
      },
      notFound: {
        title: "No se ha encontrado ninguna subscripción",
        description: "Esta empresa no tiene suscripción",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Suscripción cargada",
      description: "Suscripción de la empresa recuperada",
    },
  },
};
