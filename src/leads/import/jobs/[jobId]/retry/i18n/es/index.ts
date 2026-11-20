import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Importación de datos",
  tags: {
    leads: "Contactos",
    management: "Gestión",
  },

  post: {
    title: "Retry Import Job",
    titleShort: "Importación de la entrada",
    description: "Retratar un trabajo de importación fallido",
    jobId: {
      label: "Job ID",
      description:
        "Unico identificador para el trabajo de importación para reingresar",
    },
    form: {
      title: "Retry Import Job",
      description: "Regresar el trabajo de importación fallido",
    },
    response: {
      title: "Resultado de la entrada",
      description: "Resultado de la operación de reingreso",
      success: {
        content: "Situación de éxito",
      },
      message: {
        content: "Mensaje de entrada",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El trabajo proporcionado ID es inválido",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para reintentar empleos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para reintentar este trabajo",
      },
      notFound: {
        title: "Job no se encontró",
        description:
          "No hay trabajo de importación encontrado con el ID proporcionado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al reintentar el trabajo",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de conectarse al servidor",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto de retretes",
        description:
          "No se puede reintentar trabajo que actualmente está procesando",
      },
    },
    success: {
      title: "Operación completada",
      description: "Trabajo de importación retrigado con éxito",
    },
  },
  widget: {
    title: "Retry Import Job",
    successMessage: "Retromisión de empleo iniciada con éxito",
  },
};
