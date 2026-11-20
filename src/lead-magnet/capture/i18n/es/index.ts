import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "Suscribirse &quot; Obtener acceso &quot;",
    titleShort: "Suscribirme",
    description:
      "Presenta tus datos para unirte a la lista del creador y obtener acceso a esta habilidad",
    groups: {
      main: {
        title: "Obtener acceso",
        description: "Introduzca sus datos a continuación",
      },
    },
    fields: {
      skillId: {
        label: "Habilidad",
        description: "La habilidad de la que estás subscribiendo",
      },
      firstName: {
        label: "Nombre",
        description: "Tu nombre de pila",
        placeholder: "Por ejemplo. Alex",
      },
      email: {
        label: "Dirección de correo electrónico",
        description: "Su dirección de correo electrónico",
        placeholder: "you@example.com",
      },
    },
    response: {
      captured: "Suscrito",
      nextStep: "Siguiente paso",
      signupUrl: "Sign-up URL",
    },
    success: {
      title: "¡Estás dentro!",
      description:
        "Compruebe su bandeja de entrada - y registrarse para empezar a utilizar la habilidad",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe su entrada",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Se requiere autenticación",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "Habilidad no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar",
      },
      internal: {
        title: "Error del servidor",
        description: "Se produjo un error interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
  },
  form: {
    headline: "Quédate en el bucle.",
    namePlaceholder: "Tu nombre de pila",
    emailPlaceholder: "Su correo electrónico",
    send: "Suscribirme",
    sending: "...",
    doneHeading: "Hecho.",
    doneSub: "Estás en la lista.",
    finePrint: "No hay spam. Suscribete en cualquier momento.",
    error: "Algo salió mal. Inténtalo de nuevo.",
  },
};
