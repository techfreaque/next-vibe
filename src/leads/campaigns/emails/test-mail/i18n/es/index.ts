import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
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
  enums: {
    campaignType: {
      leadCampaign: "Campaña de captación de contactos",
      newsletter: "Boletín",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      transactional: "Transaccional",
      notification: "Notificación",
      system: "Sistema",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      newsletterMay2026: "Boletín May 2026",
      newsletterNov2026: "Boletín de noviembre 2026",
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
      socialMedia: "Social Media",
      emailCampaign: "Campaña de correo electrónico",
      referral: "Referidos",
      csvImport: "Importación CSV",
    },
  },
  tags: {
    campaigns: "Campañas",
    leads: "Contactos",
  },
  post: {
    title: "Test Mail",
    titleShort: "Test Email",
    description:
      "Enviar correo electrónico de prueba con datos de contacto personalizados",
    form: {
      title: "Configuración de correo de prueba",
      description:
        "Configurar parámetros de correo de prueba y datos de contacto",
    },
    campaignType: {
      label: "Tipo de campaña",
      description: "Tipo de campaña de correo electrónico",
      placeholder: "Introduzca el tipo de campaña",
    },
    emailJourneyVariant: {
      label: "Variedad de viaje por correo electrónico",
      description:
        "Variante de prueba A/B para el viaje por correo electrónico",
      placeholder: "Seleccione la variante de viaje",
    },
    emailCampaignStage: {
      label: "Correo electrónico Campaña Stage",
      description: "Etapa actual en la campaña de correo electrónico",
      placeholder: "Seleccionar la etapa de campaña",
    },
    testEmail: {
      label: "Test Email Address",
      description:
        "Dirección de correo electrónico para enviar correo de prueba",
      placeholder: "test@example.com",
    },
    leadData: {
      title: "Datos principales",
      description: "Información principal para la reproducción de plantillas",
      businessName: {
        label: "Nombre del negocio",
        description: "Nombre del negocio",
        placeholder: "Acme Corporation",
      },
      contactName: {
        label: "Nombre de contacto",
        description: "Nombre de la persona contacto",
        placeholder: "John Doe",
      },
      website: {
        label: "Sitio web",
        description: "Sitio web de la empresa URL",
        placeholder: "https://example.com",
      },
      country: {
        label: "País",
        description: "Código del país",
        placeholder: "GLOBAL",
      },
      language: {
        label: "Idioma",
        description: "Código de idioma preferido",
        placeholder: "en inglés",
      },
      status: {
        label: "Situación",
        description: "Situación principal",
        placeholder: "NEW",
      },
      source: {
        label: "Fuente",
        description: "Fuente principal",
        placeholder: "WEBSITE",
      },
      notes: {
        label: "Notas",
        description: "Notas adicionales sobre el contacto",
        placeholder: "Ingrese cualquier nota adicional",
      },
    },
    response: {
      title: "Test Email Resultado",
      description: "Resultado del envío de correo electrónico de prueba",
      success: {
        content: "Operación completada",
      },
      messageId: {
        content: "Mensaje ID",
      },
      testEmail: {
        content: "Test Email",
      },
      subject: {
        content: "Asunto",
      },
      sentAt: {
        content: "Enviado",
      },
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
        detail: "Prueba de envío fallado: {{error}}",
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
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
      templateNotFound: {
        title:
          "No plantilla para {{emailJourneyVariant}} / {{emailCampaignStage}}",
        description:
          "Plantilla de correo electrónico no encontrada para parámetros especificados",
      },
      sendingFailed: {
        title: "Enviar a {{recipient}} falló ({{subject}}): {{error}}",
        description: "Fallado para enviar el correo electrónico de prueba",
      },
    },
    success: {
      title: "Operación completada",
      description: "E-mail de prueba enviado con éxito",
    },
    selectionCriteria: "Criterios de selección SMTP",
    widget: {
      title: "Enviar prueba de email",
      send: "Enviar prueba de email",
      sending: "Enviando…",
      successMessage: "E-mail de prueba enviado con éxito",
      sentTo: "Enviado a: ",
      subject: "Asunto: ",
      sentAt: "Enviada a: ",
      campaignConfig: "Campaign Config",
      sendAnother: "Enviar otro",
    },
  },
};
