import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Importación de datos",
  tags: {
    leads: "Contactos",
    management: "Gestión",
  },

  post: {
    title: "Dejar de importar trabajo",
    titleShort: "Detener la importación",
    description: "Dejar un trabajo de importación en funcionamiento",
    jobId: {
      label: "Job ID",
      description:
        "Unico identificador para el trabajo de importación para detener",
    },
    form: {
      title: "Dejar de importar trabajo",
      description: "Parar el trabajo de importación en funcionamiento",
    },
    response: {
      title: "Stop Result",
      description: "Resultado de la operación de parada",
      success: {
        content: "Situación de éxito",
      },
      message: {
        content: "Alto Mensaje",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El trabajo proporcionado ID es inválido",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para detener el empleo",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para detener este trabajo.",
      },
      notFound: {
        title: "Job no se encontró",
        description:
          "No hay trabajo de importación encontrado con el ID proporcionado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al detener el trabajo",
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
        title: "Alto conflicto",
        description:
          "No puede detener el trabajo que no está procesando actualmente",
      },
    },
    success: {
      title: "Operación completada",
      description: "Trabajo de importación detenido con éxito",
    },
  },
  widget: {
    title: "Dejar de importar trabajo",
    successMessage: "Job se detuvo con éxito",
  },
};
