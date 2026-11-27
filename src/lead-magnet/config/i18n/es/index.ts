import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    tag: "lead-magnet-config",
    title: "Su lista de correo electrónico",
    titleShort: "LM Config",
    description: "Vea su configuración del imán de plomo actual",
    response: {
      exists: "Config existe",
      config: "Config",
    },
    success: {
      title: "Config Retrieved",
      description: "Su configuración de imán principal se recuperó con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Los datos de solicitud son inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso.",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay ningún confidente encontrado",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
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
  widget: {
    delete: "Desconexión",
    confirmDelete: {
      title: "¿Desconectar {{provider}}?",
      description:
        "Al desconectar, se detienen las nuevas suscripciones y se borra el historial de esta página. Los contactos ya enviados permanecen en el proveedor.",
      cancel: "Mantenga la conexión",
      proceed: "Desconexión",
    },
    back: "Atrás",
    loading: "Cargando…",
    pitch: {
      headline: "Convertir visitantes en suscriptores",
      body: "Cuando alguien ve su página de habilidad o perfil creador, ellos ven un campo de suscripción. Entran en su correo electrónico - que aterriza directamente en su lista. Sin aplicaciones adicionales, sin intermediarios, sin cuota mensual para captura básica.",
      step1: "Alguien visita tu página de habilidad o perfil creador",
      step2: "Presentan el formulario de suscripción",
      step3:
        "Correo electrónico aterriza en su lista - en su plataforma de elección",
    },
    noConfig:
      "Conecta una plataforma de correo electrónico para empezar a recoger suscriptores de tus páginas de habilidad y perfil creador.",
    active: "Activa",
    inactive: "Inactivo",
    choosePlatform: "Plataforma de correo electrónico",
    switchPlatform: "Plataforma de conmutación",
    selectPlaceholder: "Escoge una plataforma...",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "Email (via plataforma)",
    },
    capturedLeads: "Líderes capturados",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "Desconectar la plataforma de correo electrónico",
    titleShort: "Desconexión",
    description:
      "Retire la configuración del imán principal y deje de capturar los cables",
    response: {
      deleted: "Desconectado",
    },
    success: {
      title: "Desconectado",
      description: "Su plataforma de correo electrónico ha sido desconectada",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Los datos de solicitud son inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso.",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay ningún config encontrado para eliminar",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
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
};
