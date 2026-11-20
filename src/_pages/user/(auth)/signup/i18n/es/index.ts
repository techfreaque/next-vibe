import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    failedToLoadBrowserIdentity:
      "No se pudo cargar la identidad del navegador. Actualiza la página.",
  },
  meta: {
    title: "Regístrate en {{appName}}",
    description:
      "Crea tu cuenta en {{appName}} y empieza a desarrollar tus propias aplicaciones.",
    category: "Autenticación",
    imageAlt: "Registro en {{appName}}",
    keywords: "registro, registrarse, crear cuenta, {{appName}}",
    ogTitle: "Regístrate en {{appName}}",
    ogDescription:
      "Únete a {{appName}} y empieza a desarrollar tus aplicaciones hoy mismo.",
    twitterTitle: "Regístrate en {{appName}}",
    twitterDescription:
      "Crea tu cuenta y empieza a desarrollar con {{appName}}.",
  },
  post: {
    title: "Registro",
    description: "Endpoint de registro",
    form: {
      title: "Configuración del registro",
      description: "Configura los parámetros de registro",
    },
    response: {
      title: "Respuesta",
      description: "Datos devueltos por el registro",
    },
    errors: {
      unauthorized: {
        title: "Sin autorización",
        description: "Debes autenticarte",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error interno en el servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para acceder",
      },
      notFound: {
        title: "Recurso no encontrado",
        description: "El recurso solicitado no existe",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto de datos",
      },
    },
    success: {
      title: "Operación exitosa",
      description: "Operación completada",
    },
  },
};
