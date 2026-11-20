import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Suscripción",
    company: "Company",
    list: "Lista",
  },
  get: {
    title: "Suscripciones de la empresa",
    titleShort: "Company Subs",
    description: "Listar todas las suscripciones para una empresa",
    companyId: {
      label: "Company ID",
      description: "La empresa cuya suscripción a la lista",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Inválido ID",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión en la lista de suscripciones de la empresa",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Usted no tiene acceso a las suscripciones de esta empresa",
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
        title: "Company Not Found",
        description: "Esta compañía no existe",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Suscripciones cargadas",
      description: "Suscripciones de la empresa recuperadas",
    },
  },
};
