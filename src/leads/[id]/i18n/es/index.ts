import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
  tags: {
    leads: "Contactos",
    management: "Gestión",
  },

  get: {
    title: "Ver los detalles del contacto",
    titleShort: "Detalles del contacto",
    description: "Recuperar información detallada sobre un contacto específico",
    backButton: {
      label: "Volver a los contactos",
    },
    editButton: {
      label: "Editar contacto",
    },
    deleteButton: {
      label: "Eliminar contacto",
    },
    id: {
      label: "ID del contacto",
      description: "Unico identificador para el contacto",
    },
    form: {
      title: "Solicitud de datos del contacto",
      description:
        "Solicitar parámetros para recuperar la información de contacto",
    },
    response: {
      title: "Información del contacto",
      description: "Detalles completos del contacto e historia",
      basicInfo: {
        title: "Información básica",
        description:
          "Identificación básica de los principales jefes y situación",
      },
      id: {
        content: "ID del contacto",
      },
      email: {
        content: "Dirección de correo electrónico",
      },
      businessName: {
        content: "Nombre del negocio",
      },
      contactName: {
        content: "Nombre de contacto",
      },
      status: {
        content: "Estado del contacto",
      },
      contactDetails: {
        title: "Datos de contacto",
        description: "Información de contacto y preferencias",
      },
      phone: {
        content: "Número de teléfono",
      },
      website: {
        content: "Sitio web URL",
      },
      country: {
        content: "País",
      },
      language: {
        content: "Idioma",
      },
      campaignTracking: {
        title: "Seguimiento de campañas",
        description:
          "Campaña de correo electrónico e información de seguimiento",
      },
      source: {
        content: "Origen del contacto",
      },
      currentCampaignStage: {
        content: "Estadio de campaña actual",
      },
      emailJourneyVariant: {
        content: "Variedad de viaje por correo electrónico",
      },
      emailsSent: {
        content: "Emails Sent",
      },
      lastEmailSentAt: {
        content: "Último mensaje enviado",
      },
      engagement: {
        title: "Metrices de compromiso",
        description: "Datos de compromiso e interacción por correo electrónico",
      },
      emailsOpened: {
        content: "Correos electrónicos abiertos",
      },
      emailsClicked: {
        content: "Emails Clicked",
      },
      lastEngagementAt: {
        content: "Último compromiso",
      },
      unsubscribedAt: {
        content: "Suscritas en",
      },
      conversion: {
        title: "Seguimiento de la conversión",
        description: "Conversión de contacto y seguimiento de hitos",
      },
      convertedUserId: {
        content: "Usuario convertido ID",
      },
      convertedAt: {
        content: "Convertirse en",
      },
      signedUpAt: {
        content: "Se registró en",
      },
      subscriptionConfirmedAt: {
        content: "Suscripción confirmada a",
      },
      metadata: {
        title: "Información adicional",
        description: "Notas y metadatos",
        content: "Metadatos",
      },
      notes: {
        content: "Notas",
      },
      createdAt: {
        content: "Creado en",
      },
      updatedAt: {
        content: "Actualizado en",
      },
      identity: {
        title: "Dispositivo &quot; identidad &quot;",
        description:
          "Seguimiento de la identidad y la información del dispositivo",
      },
      ipAddress: {
        content: "Dirección de IP",
      },
      userAgent: {
        content: "Agente de usuario",
      },
      deviceType: {
        content: "Tipo de dispositivo",
      },
      browser: {
        content: "Navegador",
      },
      os: {
        content: "Sistema operativo",
      },
      referralCode: {
        content: "Código de referido",
      },
      lifecycle: {
        title: "Lifecycle",
        description: "Horarios adicionales del ciclo de vida",
      },
      bouncedAt: {
        content: "Bounced At",
      },
      invalidAt: {
        content: "Inválido",
      },
      campaignStartedAt: {
        content: "Campaña iniciada",
      },
      linkedLeads: {
        title: "Líderes vinculados",
        description: "Contactos identificados como la misma persona",
        linkedLeadId: {
          content: "Linked Lead ID",
        },
        linkReason: {
          content: "Razón de enlace",
        },
        linkedAt: {
          content: "Enlaces a",
        },
        email: {
          content: "Correo electrónico",
        },
        businessName: {
          content: "Nombre del negocio",
        },
        status: {
          content: "Situación",
        },
        ipAddress: {
          content: "Dirección de IP",
        },
        userAgent: {
          content: "Agente de usuario",
        },
        createdAt: {
          content: "Creado en",
        },
      },
      linkedUsers: {
        title: "Cuentas de usuario vinculadas",
        description: "Cuentas de usuario asociadas a este contacto",
        userId: {
          content: "Usuario ID",
        },
        linkReason: {
          content: "Razón de enlace",
        },
        linkedAt: {
          content: "Enlaces a",
        },
        email: {
          content: "Correo electrónico",
        },
        publicName: {
          content: "Nombre de pantalla",
        },
      },
      referralHistory: {
        title: "Historial de referencia",
        description:
          "Códigos de referencia este contacto clicado antes de registrarse",
        code: {
          content: "Código de referido",
        },
        ownerUserId: {
          content: "Code Owner",
        },
        clickedAt: {
          content: "Seguido en",
        },
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El contacto ID proporcionado es inválido",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Autenticación necesaria para acceder a los detalles del contacto",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para ver esta pista.",
      },
      notFound: {
        title: "No se encontró el contacto",
        description: "No se encontró ninguna pista con el ID proporcionado",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al recuperar detalles del contacto",
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
        title: "Conflicto de datos",
        description: "Los datos principales han sido modificados",
      },
    },
    success: {
      title: "Operación completada",
      description: "Principales detalles recuperados con éxito",
    },
  },
  patch: {
    title: "Actualización Lead",
    titleShort: "Editar contacto",
    description: "Actualizar la información y el estado del contacto",
    backButton: {
      label: "Volver al contacto",
    },
    deleteButton: {
      label: "Eliminar contacto",
    },
    submitButton: {
      label: "Actualización Lead",
      loadingText: "Actualizando a Lead...",
    },
    id: {
      label: "ID del contacto",
      description: "Unico identificador para el contacto a la actualización",
    },
    form: {
      title: "Actualización Lead",
      description: "Modificar la información de contacto",
    },
    updates: {
      title: "Actualizaciones de contactos",
      description: "Campos para actualizar",
    },
    basicInfo: {
      title: "Información básica",
      description: "Información actualizada sobre el contacto básico",
    },
    email: {
      label: "Dirección de correo electrónico",
      description: "Dirección de correo electrónico de Lead",
      placeholder: "email@example.com",
    },
    businessName: {
      label: "Nombre del negocio",
      description: "Nombre del negocio",
      placeholder: "Acme Corporation",
    },
    contactName: {
      label: "Nombre de contacto",
      description: "Persona de contacto principal",
      placeholder: "John Doe",
    },
    status: {
      label: "Estado del contacto",
      description: "Situación actual de la dirección",
      placeholder: "Seleccione el estado",
    },
    contactDetails: {
      title: "Datos de contacto",
      description: "Información de contacto actualizada",
    },
    phone: {
      label: "Número de teléfono",
      description: "Número de teléfono",
      placeholder: "+1234567890",
    },
    website: {
      label: "Sitio web",
      description: "Sitio web de negocios URL",
      placeholder: "https://example.com",
    },
    country: {
      label: "País",
      description: "País de negocios",
      placeholder: "Seleccionar país",
    },
    language: {
      label: "Idioma",
      description: "Idioma preferido",
      placeholder: "Seleccionar idioma",
    },
    campaignManagement: {
      title: "Gestión de campañas",
      description: "Gestionar la configuración de campaña",
    },
    source: {
      label: "Origen del contacto",
      description: "Origen del contacto",
      placeholder: "Seleccionar fuente",
    },
    currentCampaignStage: {
      label: "Etapa de campaña",
      description: "Etapa actual de la campaña de email",
      placeholder: "Seleccionar etapa",
    },
    additionalDetails: {
      title: "Detalles adicionales",
      description: "Notas y metadatos",
    },
    notes: {
      label: "Notas",
      description: "Notas internas sobre el contacto",
      placeholder: "Añadir notas aquí",
    },
    metadata: {
      label: "Metadatos",
      description: "Metadatos adicionales (JSON)",
      placeholder: '{"key": "value"}',
    },
    convertedUserId: {
      label: "Usuario convertido ID",
      description: "ID de la cuenta de usuario convertido",
      placeholder: "Usuario ID",
    },
    subscriptionConfirmedAt: {
      label: "Suscripción confirmada a",
      description: "Fecha en que se confirmó la suscripción",
      placeholder: "Selecciona una fecha",
    },
    response: {
      title: "Lead actualizado",
      description: "Información actualizada sobre el contacto",
      basicInfo: {
        title: "Información básica",
        description: "Información actualizada sobre el contacto básico",
      },
      id: {
        content: "ID del contacto",
      },
      email: {
        content: "Dirección de correo electrónico",
      },
      businessName: {
        content: "Nombre del negocio",
      },
      contactName: {
        content: "Nombre de contacto",
      },
      status: {
        content: "Estado del contacto",
      },
      contactDetails: {
        title: "Datos de contacto",
        description: "Información actualizada de contacto",
      },
      phone: {
        content: "Número de teléfono",
      },
      website: {
        content: "Sitio web URL",
      },
      country: {
        content: "País",
      },
      language: {
        content: "Idioma",
      },
      campaignTracking: {
        title: "Seguimiento de campañas",
        description: "Información actualizada sobre la campaña",
      },
      source: {
        content: "Origen del contacto",
      },
      currentCampaignStage: {
        content: "Estadio de campaña actual",
      },
      emailJourneyVariant: {
        content: "Variedad de viaje por correo electrónico",
      },
      emailsSent: {
        content: "Emails Sent",
      },
      lastEmailSentAt: {
        content: "Último mensaje enviado",
      },
      engagement: {
        title: "Metrices de compromiso",
        description: "Datos de compromiso por correo electrónico",
      },
      emailsOpened: {
        content: "Correos electrónicos abiertos",
      },
      emailsClicked: {
        content: "Emails Clicked",
      },
      lastEngagementAt: {
        content: "Último compromiso",
      },
      unsubscribedAt: {
        content: "Suscritas en",
      },
      conversion: {
        title: "Seguimiento de la conversión",
        description: "Seguimiento de los hitos de conversión",
      },
      convertedUserId: {
        content: "Usuario convertido ID",
      },
      convertedAt: {
        content: "Convertirse en",
      },
      signedUpAt: {
        content: "Se registró en",
      },
      subscriptionConfirmedAt: {
        content: "Suscripción confirmada a",
      },
      metadata: {
        title: "Información adicional",
        description: "Notas y metadatos",
        content: "Metadatos",
      },
      notes: {
        content: "Notas",
      },
      createdAt: {
        content: "Creado en",
      },
      updatedAt: {
        content: "Actualizado en",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Los datos proporcionados son inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para actualizar los cables",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para actualizar esta pista.",
      },
      notFound: {
        title: "No se encontró el contacto",
        description: "No se encontró ninguna pista con el ID proporcionado",
      },
      conflict: {
        title: "Actualización de conflictos",
        description: "El contacto fue modificado por otro usuario",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al actualizar el contacto",
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
    },
    success: {
      title: "Operación completada",
      description: "Contacto actualizado",
    },
  },
  post: {
    title: "[id]",
    description: "[id] endpoint",
    form: {
      title: "[id] Configuración",
      description: "Configurar los parámetros [id]",
    },
    response: {
      title: "Respuesta",
      description: "[id] response data",
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
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
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
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
  enums: {
    leadStatus: {
      new: "Nuevo",
      pending: "Pendiente",
      campaignRunning: "Campaign Running",
      websiteUser: "Sitio web Usuario",
      newsletterSubscriber: "Newsletter Suscríbase",
      inContact: "En contacto",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Suscripción confirmada",
      unsubscribed: "Suscripción cancelada",
      bounced: "Bounced",
      invalid: "Inválidos",
    },
    leadSource: {
      website: "Sitio web",
      referral: "Referidos",
      socialMedia: "Social Media",
      emailCampaign: "Campaña de correo electrónico",
      csvImport: "Importación CSV",
      api: "API",
      manual: "Manual",
      other: "Otro",
    },
    emailCampaignStage: {
      notStarted: "No empezó",
      initial: "Contacto inicial",
      followup1: "Seguimiento 1",
      followup2: "Seguimiento 2",
      followup3: "Seguimiento 3",
      nurture: "Nutrición",
      reactivation: "Reactivación",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
    },
  },
  journey: {
    reviewUnavailable:
      "No se pueden cargar Wallet, consent and journey records.",
    title: "Recorrido del prospecto",
    subtitle: "Primero más antiguo · actividad reciente y hitos registrados",
    unavailable: "Las pruebas de viaje no se pueden cargar",
    campaign: "Cohetes de campaña",
    emailScheduled: "Siguiente email programado",
    campaignRunning: "Campaña en marcha",
    noQueue: "No hay email programado",
    openQueue: "Abrir cola del prospecto",
    openAccount: "Cuenta abierta",
    openLead: "Abrir ficha del prospecto",
    attributionOnly:
      "Los enlaces de atribución son pistas para revisar. Un IP compartido o una visita de seguimiento puede implicar a más de una persona.",
    recordedAccountLink: "Vínculo de cuenta registrado",
    recordedConversion: "Cuenta registrada en conversión",
    attributedAccount: "Cuenta registrada en la atribución al crecimiento",
    previewIpMatches: "Vista previa IP que coincide con las pistas",
    wallets: "Registros de Wallet",
    noWallets: "No hay registros de cartera encontrados",
    thisLeadWallet: "Billetera de este prospecto",
    accountWallet: "Cartera de cuentas",
    relatedLeadWallet: "Billetera del prospecto relacionado",
    newsletterConsent: "Registros de consentimiento del boletín",
    noNewsletter: "No hay registros de newsletters vinculados",
    consentRecorded: "Consentimiento registrado",
    consentAbsent: "No se ha registrado ningún consentimiento",
    confirmedOn: "Confirmado {{date}}",
    confirmationMissing: "Fecha de confirmación desaparecida",
    guestConsent: "Consentimiento de los huéspedes para modelos no censurados",
    consentVersion: "Versión consentente {{version}}",
    leadReference: "ID del lead {{id}}",
    accountReference: "ID de la cuenta {{id}}",
    leadSource: "Origen del lead · {{source}}",
    guestConsentOn:
      "Consentimiento para modelos sin censura registrado el {{date}}",
    guestConsentMissing: "No consta consentimiento para modelos sin censura",
    consentVersionMissing: "Falta la versión del consentimiento",
    firstTouch: "Primera visita · {{touch}}",
    lastTouch: "Última visita atribuida · {{touch}}",
    attributionMissing: "No consta atribución de captación",
    linkEvidenceUnavailable:
      "Datos de consentimiento y atribución no disponibles",
    optedOutOn: "Baja registrada el {{date}}",
    optOutDateMissing: "No consta la fecha de baja",
    events: {
      created: "Prospecto creado",
      campaignStarted: "Campaña iniciada",
      emailSent: "Correo electrónico de campaña enviado",
      emailBounced: "Correo electrónico de campaña rebotado",
      bounced: "Prospecto marcado con correo rechazado",
      unsubscribed: "Prospecto dado de baja",
      invalid: "Prospecto marcado como no válido",
      signup: "Cuenta registrada",
      converted: "Conversión grabada",
      subscriptionConfirmed: "Suscripción confirmada",
      firstTouch: "Primera visita registrada",
      lastTouch: "Conexión atribuida más reciente",
      firstChat: "Primera charla",
      firstPayment: "Primera conversión pagada",
      leadLink: "Prospecto relacionado vinculado",
      accountLink: "Enlace con la cuenta registrado",
      referral: "Código de referencia utilizado",
      interaction: "Interacción registrada",
      newsletterSubscribed: "Registro de noticias grabado",
      newsletterConfirmed: "Correo electrónico confirmado",
      newsletterUnsubscribed: "Boletín no subscrito",
    },
    evidence: {
      ipMatch: "Partido IP compartido",
      trackPage: "Visita de seguimiento y cookie de visitante",
      referral: "Enlace de referencia",
      manual: "Enlace manual",
      test: "Enlace de prueba",
      login: "Vinculado en el login",
      signup: "Vinculado al registro",
      merge: "Enlace histórico de fusión",
    },
  },
  widget: {
    loading: "Cargando contacto...",
    notFound: "No se encontró el contacto.",
    back: "Atrás",
    leadFallbackTitle: "Prospecto",
    edit: "Editar",
    delete: "Eliminar",
    converted: "Conversión",
    quickActions: "Medidas rápidas",
    editLead: "Editar contacto",
    sendTestEmail: "Enviar prueba de email",
    viewInSearch: "View in Search",
    userProfile: "Perfil de usuario",
    userDetail: "Detalle de usuario",
    creditHistory: "Historial de créditos",
    campaignFunnel: "Embudo de campaña",
    sourceLabel: "Fuente:",
    lastEmailLabel: "Último correo electrónico:",
    campaignPerformance: "Ejecución de la campaña",
    emailsSent: "Emails Sent",
    opened: "Abierto",
    clicked: "Seguido",
    openRate: "Tasa abierta",
    clickRate: "Tasa de clic",
    clickToOpenRate: "Tasa de clic a abrir",
    contactDetails: "Datos de contacto",
    country: "País",
    language: "Idioma",
    engagement: "Engagement",
    emailsOpened: "Correos electrónicos abiertos",
    emailsClicked: "Emails Clicked",
    lastEngagement: "Último compromiso",
    unsubscribed: "Suscripción cancelada",
    conversion: "Conversión",
    signedUp: "Signed Up",
    convertedAt: "Convertirse en",
    subscriptionConfirmed: "Suscripción confirmada",
    convertedUserId: "Usuario convertido ID",
    activeSubscriberSince: "Suscriptor activo desde",
    viewUserProfile: "Ver perfil de usuario",
    viewUserDetail: "Ver detalle de usuario",
    notesAndMetadata: "Notas &quot; Metadatos &quot;",
    notes: "Notas",
    metadata: "Metadatos",
    created: "Creado",
    lastUpdated: "Última actualización",
    daysOld: "días",
    lastEngaged: "Último compromiso",
    ago: "hace mucho tiempo.",
    variant: "Variante:",
    copyEmail: "correo electrónico",
    copyId: "ID",
    copyPhone: "teléfono",
    copyUserId: "usuario ID",
    stageNotStarted: "No empezó",
    stageInitial: "Inicial",
    stageFollowup1: "Seguimiento 1",
    stageFollowup2: "Seguimiento 2",
    stageFollowup3: "Seguimiento 3",
    stageNurture: "Nutrición",
    stageReactivation: "Reactivación",
    tabOverview: "Sinopsis",
    tabDetails: "Detalles",
    tabIdentity: "Identidad",
    tabBasic: "Básica",
    tabCampaign: "Campaña",
    tabAdvanced: "Avances",
    deviceIdentity: "Dispositivo &quot; identidad &quot;",
    ipAddress: "Dirección de IP",
    userAgent: "Agente de usuario",
    deviceType: "Tipo de dispositivo",
    browser: "Navegador",
    os: "Sistema operativo",
    referralCode: "Código de referido",
    lifecycleTimestamps: "Lifecycle",
    bouncedAt: "Bounced At",
    invalidAt: "Inválido",
    campaignStartedAt: "Campaña iniciada",
    linkedLeadsSection: "Líderes vinculados",
    linkedLeadsEmpty: "No hay cables conectados",
    linkedUsersSection: "Cuentas de usuario vinculadas",
    linkedUsersEmpty: "No hay cuentas de usuario vinculadas",
    linkReason: "Razón de enlace:",
    linkedAt: "Vinculado a:",
    copyIp: "IP",
    copyLinkedLeadId: "ID del contacto",
    copyUserId2: "usuario ID",
    selectLead: "Select Lead",
  },
  delete: {
    title: "Eliminar contacto",
    titleShort: "Eliminar contacto",
    description: "Elimina un contacto del sistema",
    container: {
      title: "Eliminar contacto",
      description:
        "¿Estás seguro de que quieres eliminar permanentemente esta pista?",
    },
    backButton: {
      label: "Volver al contacto",
    },
    submitButton: {
      label: "Eliminar contacto",
      loadingText: "Eliminando a Lead...",
    },
    actions: {
      delete: "Eliminar contacto",
      deleting: "Eliminando a Lead...",
    },
    id: {
      label: "ID del contacto",
      description: "Identificador único para el contacto para eliminar",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El contacto ID proporcionado es inválido",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para eliminar los cables",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para eliminar esta pista",
      },
      notFound: {
        title: "No se encontró el contacto",
        description: "No se encontró ninguna pista con el ID proporcionado",
      },
      conflict: {
        title: "Suprímase el conflicto",
        description:
          "El contacto no puede suprimirse debido a las dependencias existentes",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al eliminar el contacto",
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
    },
    success: {
      title: "Contacto eliminado",
      description: "El contacto se ha eliminado con éxito",
    },
  },
  countries: {
    ...regionalCountryNames("es"),
    global: "Global",
    de: "Alemania",
    pl: "Polonia",
    fr: "Francia",
    us: "Estados Unidos",
  },
  languages: {
    it: "Italiano",
    es: "Español",
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
};
