import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Seguimiento de contactos",
  tags: {
    tracking: "Seguimiento",
    engagement: "Engagement",
  },
  post: {
    title: "Grabación de contacto",
    titleShort: "Seguimiento",
    description: "Grabar un nuevo evento de compromiso para una pista",
    form: {
      title: "Formulario de interacción del contacto",
      description: "Detalles del compromiso de la pista de grabación",
    },
    leadId: {
      label: "ID del contacto",
      description: "Unico identificador para el contacto",
      placeholder: "Ingresa el ID del contacto",
      helpText: "UUID del contacto para rastrear el compromiso para",
    },
    engagementType: {
      label: "Tipo de compromiso",
      description: "Tipo de evento de compromiso",
      placeholder: "Seleccione el tipo de compromiso",
      helpText: "El tipo de interacción o compromiso",
    },
    campaignId: {
      label: "Campaign ID",
      description: "identificador de la campaña asociada",
      placeholder: "Ingrese la campaña ID",
      helpText: "Campaña opcional que este compromiso es parte de",
    },
    metadata: {
      label: "Metadatos",
      description: "Metadatos de compromiso adicionales",
      placeholder: "Ingrese metadatos como JSON",
      helpText: "Datos personalizados sobre este compromiso",
    },
    userId: {
      label: "Usuario ID",
      description: "identificador de usuario asociado",
      placeholder: "Introduzca el usuario ID",
      helpText:
        "Usuario opcional ID si el contacto está asociado con un usuario",
    },
    response: {
      id: "Participación ID",
      leadId: "ID del contacto",
      engagementType: "Tipo de compromiso",
      campaignId: "Campaign ID",
      metadata: "Metadatos",
      timestamp: "Timestamp",
      ipAddress: "Dirección de IP",
      userAgent: "Agente de usuario",
      createdAt: "Creado en",
      leadCreated: "Contacto creado",
      relationshipEstablished: "Relación establecida",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Participación grabada",
      description: "Contrato de contacto registrado con éxito",
    },
  },
  get: {
    title: "Pista de contacto Haga clic",
    titleShort: "Pista",
    description: "Rastrear el clic del contacto y redirigir al objetivo URL",
    form: {
      title: "Parámetros de seguimiento",
      description: "Parámetros para el seguimiento de clics y redirigir",
    },
    id: {
      label: "ID del contacto",
      description: "Unico identificador para el contacto",
      placeholder: "Ingresa el ID del contacto",
      helpText: "UUID del contacto para seguir clic para",
    },
    stage: {
      label: "Etapa de campaña",
      description: "Etapa de campaña de correo electrónico",
      placeholder: "Seleccionar la etapa de campaña",
      helpText: "Etapa de campaña opcional este clic es parte de",
    },
    source: {
      label: "Origen del contacto",
      description: "Fuente de la dirección",
      placeholder: "Seleccione la fuente principal",
      helpText: "Fuente en la que el contacto se originó",
    },
    url: {
      label: "Objetivo URL",
      description: "URL para redirigir a después de rastrear",
      placeholder: "Ingrese el objetivo URL",
      helpText: "El destino URL para la redirección",
    },
    ref: {
      label: "Referencia ID",
      description: "Identificador de referencia para el seguimiento",
      placeholder: "Ingrese referencia ID",
      helpText:
        "Referencia opcional ID para el contexto de seguimiento adicional",
    },
    sig: {
      label: "Firma de enlace",
      description: "Probar un destino externo vino de un enlace que generamos",
    },
    response: {
      success: "Operación completada",
      redirectUrl: "Redirect URL",
      leadId: "ID del contacto",
      campaignId: "Campaign ID",
      engagementRecorded: "Participación grabada",
      leadStatusUpdated: "Estado del contacto actualizado",
      isLoggedIn: "Está Logged In",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Haz clic en Tracked",
      description: "Pulso de guía rastreado con éxito",
    },
  },
  widget: {
    post: {
      headerTitle: "Grabación de registros",
      viewStatsTitle: "View Lead Statistics",
      statsButton: "Stats",
      loading: "Grabando compromiso...",
      successTitle: "Participación grabada",
      successSubtitle: "seguimiento con éxito",
      event: "Evento",
      labels: {
        engagementId: "Participación ID",
        type: "Tipo",
        leadId: "ID del contacto",
        campaignId: "Campaign ID",
        ipAddress: "Dirección de IP",
        recordedAt: "Grabado en",
        leadCreated: "Contacto creado",
        leadCreatedYes: "Sí (nueva pista)",
        leadCreatedNo: "No (existe)",
        relationshipEst: "Relación.",
        relationshipYes: "Sí.",
        relationshipNo: "No.",
        metadata: "Metadatos",
      },
      nextSteps: "Siguientes pasos:",
      viewLeadButton: "Ver contacto",
      leadStatsButton: "Estadísticas de contactos",
      emptyTitle: "Seguimiento de un evento de compromiso",
      emptyDescription:
        "Rellene el siguiente formulario y envíe para grabar un nuevo evento de compromiso para una pista",
      viewLeadStatsButton: "Ver los puntos principales",
    },
    get: {
      headerTitle: "Seguimiento de clics",
      viewStatsTitle: "View Lead Statistics",
      statsButton: "Stats",
      loading: "Procesando el seguimiento de clics...",
      successTitle: "Haz clic en Tracked",
      successSubtitle: "Participación registrada y redirigir URL listo",
      failTitle: "Rastreo fallado",
      failSubtitle: "No podía grabar el evento de clics",
      labels: {
        engagementLabel: "Engagement",
        recorded: "Grabado",
        notRecorded: "No se registró",
        leadStatusLabel: "Estado del contacto",
        updated: "Actualizado",
        unchanged: "Sin cambios",
        userLabel: "Usuario",
        loggedIn: "Logged in",
        anonymous: "Anónimo",
        leadId: "ID del contacto",
        campaignId: "Campaign ID",
        redirectUrl: "Redirect URL",
      },
      nextSteps: "Siguientes pasos:",
      openUrlButton: "Open URL",
      viewLeadButton: "Ver contacto",
      leadStatsButton: "Estadísticas de contactos",
      emptyTitle: "Seguimiento de un evento Click",
      emptyDescription:
        "Introduzca los parámetros de seguimiento a continuación para grabar un clic y recuperar el URL redireccionado",
      viewLeadStatsButton: "Ver los puntos principales",
    },
  },
  enums: {
    engagementLevel: {
      high: "Alto",
      medium: "Mediana",
      low: "Baja",
      none: "Ninguno",
    },
    engagementTypes: {
      emailOpen: "Correo electrónico abierto",
      emailClick: "Correo electrónico",
      websiteVisit: "Visita del sitio web",
      formSubmit: "Formulario presentado",
      leadAttribution: "Atribución del contacto",
    },
    emailCampaignStage: {
      notStarted: "No empezó",
      initial: "Inicial",
      followup1: "Seguimiento 1",
      followup2: "Seguimiento 2",
      followup3: "Seguimiento 3",
      nurture: "Nutrición",
      reactivation: "Reactivación",
    },
    leadSource: {
      website: "Sitio web",
      socialMedia: "Social Media",
      emailCampaign: "Campaña de correo electrónico",
      referral: "Referidos",
      csvImport: "Importación CSV",
    },
  },
  error: {
    default: "Se produjo un error al procesar el compromiso",
  },
};
