import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",

  enums: {
    level: {
      error: "Error",
      warn: "Advertencia",
    },
  },

  post: {
    title: "Informe de error del cliente",
    titleShort: "Error de registro",
    description:
      "Persistir un error del lado del cliente o advertencia al registro de errores",
    tags: {
      monitoring: "Monitoreo",
    },
    fields: {
      level: {
        label: "Nivel",
        description: "Nivel de registro: error o aviso",
      },
      message: {
        label: "Mensaje",
        description: "Mensaje de error",
        placeholder: "Algo salió mal",
      },
      metadata: {
        label: "Metadatos",
        description: "Marco estructurado adicional",
      },
    },
    response: {
      ok: {
        title: "Aceptado",
      },
    },
    success: {
      title: "Logged",
      description: "El error del cliente persiste",
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
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado en el registro de errores persistente",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        titleChanges: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
  },
};
