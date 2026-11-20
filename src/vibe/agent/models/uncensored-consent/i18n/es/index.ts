import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    consent: "Consentimiento",
  },

  get: {
    title: "Consentimiento para usar modelos sin censura",
    titleShort: "Consentimiento para uso sin censura",
    description:
      "Muestra si la persona titular de la cuenta o invitada confirmó que tiene al menos 18 años y acepta respuestas sin filtros. Los modelos sin censura permanecen bloqueados hasta que se confirme.",
    response: {
      consented: "Confirmado",
      consentedAt: "Fecha de confirmación",
      version: "Versión del consentimiento",
    },
    success: {
      title: "Estado del consentimiento cargado",
      description:
        "Estado actual del consentimiento para usar modelos sin censura",
    },
  },

  post: {
    title: "Desbloquear modelos sin censura",
    titleShort: "Desbloquear modelos",
    description:
      "Confirma una sola vez que tienes al menos 18 años y aceptas que los modelos sin censura puedan generar contenido ofensivo, falso, peligroso, ilegal o malicioso sin aplicar filtros. Solo una persona puede dar su propio consentimiento.",
    fields: {
      confirm: {
        label: "Tengo al menos 18 años y acepto",
        description:
          "Establece el valor en true para confirmar que tienes al menos 18 años, aceptas respuestas sin filtros y te haces responsable de cómo las usas.",
      },
    },
    success: {
      title: "Modelos sin censura desbloqueados",
      description: "Guardamos tu confirmación. No te la volveremos a pedir.",
    },
  },

  delete: {
    title: "Retirar el consentimiento para usar modelos sin censura",
    titleShort: "Retirar el consentimiento",
    description:
      "Retira el consentimiento para usar modelos sin censura. Los modelos quedan bloqueados hasta que vuelvas a confirmar.",
    success: {
      title: "Consentimiento retirado",
      description: "Los modelos sin censura volvieron a bloquearse.",
    },
  },

  errors: {
    validation: {
      title: "Falta la confirmación",
      description:
        "Para continuar, confirma que tienes al menos 18 años y acepta las condiciones.",
    },
    unauthorized: {
      title: "Operación no permitida",
      description: "No puedes cambiar este consentimiento.",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Esta acción no está disponible aquí.",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "No se encontró ninguna cuenta ni sesión de invitado.",
    },
    server: {
      title: "Error del servidor",
      description: "No se pudo guardar tu elección. Inténtalo de nuevo.",
    },
    network: {
      title: "Error de red",
      description: "No hay conexión con el servidor. Revisa tu conexión.",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo salió mal. Inténtalo de nuevo.",
    },
    conflict: {
      title: "Conflicto",
      description:
        "El consentimiento cambió en otra pestaña. Recarga la página.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Confirma o cancela primero.",
    },
    noIdentity:
      "No hay ninguna cuenta ni sesión de invitado. Recarga la página e inténtalo de nuevo.",
    saveFailed: "No se pudo guardar tu elección. Inténtalo de nuevo.",
  },

  gate: {
    required:
      "{{model}} es un modelo sin censura. Confirma una sola vez que tienes al menos 18 años y aceptas que los modelos sin censura puedan generar contenido ofensivo, falso, peligroso, ilegal o malicioso sin filtros. La confirmación la da una persona en el chat o con el comando: vibe uncensored-consent-agree --confirm=true",
    apiRequired:
      "{{model}} es un modelo sin censura. En esta cuenta todavía falta confirmar la mayoría de edad y la aceptación de respuestas sin filtros. Marca la casilla de modelos sin censura en la página de claves API y vuelve a intentarlo.",
  },

  dialog: {
    eyebrow: "Modelos sin censura",
    title: "Solo para mayores de edad. Sin filtros.",
    stance:
      "Tú decides qué leer. Por eso te pedimos que confirmes una sola vez y te mostramos todas las respuestas sin aplicar filtros.",
    modelLine: "Este chat usa {{model}}.",
    pointAge: "Tengo al menos 18 años.",
    pointContent:
      "Los modelos sin censura pueden generar contenido ofensivo, falso, peligroso, ilegal o malicioso.",
    pointNoFilter:
      "Las respuestas llegan sin filtros del modelo ni de la plataforma.",
    pointResponsible: "Me hago responsable de cómo uso las respuestas.",
    agree: "Tengo al menos 18 años y acepto",
    agreeing: "Guardando…",
    pickAnother: "Elegir otro modelo",
    close: "Cerrar",
    footnote:
      "Solo te pedimos confirmación una vez. Puedes retirarla cuando quieras en la configuración.",
    saveFailed: "No se pudo guardar. Inténtalo de nuevo.",
  },

  widget: {
    title: "Modelos sin censura",
    statusOn: "Desbloqueados",
    statusOff: "Bloqueados",
    since: "Confirmado el {{date}}",
    onBody:
      "Confirmaste que tienes al menos 18 años y aceptas respuestas sin filtros. Los modelos sin censura responden sin aplicar filtros.",
    offBody:
      "Para desbloquear los modelos sin censura, confirma que tienes al menos 18 años y acepta las respuestas sin filtros.",
    outdatedBody:
      "El texto del consentimiento cambió. Vuelve a confirmar para seguir usando los modelos sin censura.",
    withdraw: "Retirar el consentimiento",
    withdrawing: "Retirando el consentimiento…",
    unlock: "Desbloquear modelos sin censura",
    guestNote:
      "Guardamos tu elección en este navegador. Cuando te registres, la vincularemos a tu cuenta.",
    loading: "Cargando consentimiento…",
    back: "Volver",
    menuLabel: "Modelos sin censura",
    menuOn: "Activados",
    menuOff: "Desactivados",
  },
};
