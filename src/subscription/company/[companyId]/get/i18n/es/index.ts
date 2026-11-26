import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Suscripción",
    company: "Company",
    get: "¡Vamos!",
  },
  view: {
    empty: "No hay suscripción",
    emptyHelp: "Tu cuenta no tiene ninguna suscripción.",
    status: "Estado",
    interval: "Frecuencia de facturación",
    periodStart: "Inicio del periodo actual",
    periodEnd: "Fin del periodo actual",
    unavailable: "Sin registrar",
    provider: "Proveedor de pagos",
    cancellation: "Cancelación",
    endOfPeriod: "Al final del periodo",
    scheduled: "Cancelación programada",
    canceled: "Fecha de cancelación",
    ended: "Fecha de finalización",
    open: "Abrir detalles de la suscripción",
    list: "Volver a las suscripciones",
  },
  get: {
    title: "Suscripción del titular",
    titleShort: "Suscripción del titular",
    description: "Consulta la suscripción personal del titular de la empresa.",
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
