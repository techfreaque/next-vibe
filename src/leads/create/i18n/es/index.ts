import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
  tags: {
    leads: "Contactos",
    create: "Crear",
  },

  enums: {
    leadSource: {
      website: "Sitio web",
      socialMedia: "Social Media",
      emailCampaign: "Campaña de correo electrónico",
      referral: "Referidos",
      csvImport: "Importación CSV",
    },
  },
  widget: {
    headerLeadCreated: "Contacto creado",
    headerCreateLead: "Crear contacto",
    subheaderFillDetails: "Rellene los detalles a continuación",
    fallbackLeadName: "Prospecto",
    buttonCopyId: "Copiar ID",
    buttonViewLead: "Ver contacto",
    buttonEditLead: "Editar contacto",
    buttonBackToList: "Volver a la lista",
  },
  post: {
    title: "Crear contacto",
    titleShort: "Nuevo contacto",
    description: "Crear una nueva pista en el sistema",
    backButton: {
      label: "Regreso a los contactos",
    },
    submitButton: {
      label: "Crear contacto",
      loadingText: "Creando contacto...",
    },
    form: {
      title: "Nuevo formulario de arrendamiento",
      description:
        "Ingrese la información principal para crear un nuevo contacto",
    },
    validation: {
      country: "Elige un país.",
      language: "Elige un idioma.",
      source: "Indica de dónde viene este lead.",
    },
    contactInfo: {
      title: "Información de contacto",
      description: "Detalles de contacto primarios para el contacto",
    },
    email: {
      label: "Dirección de correo electrónico",
      description:
        "Dirección de correo electrónico primaria para la comunicación",
      placeholder: "john@example.com",
    },
    businessName: {
      label: "Nombre del negocio",
      description: "Nombre de la empresa o empresa",
      placeholder: "Ejemplo Corp",
    },
    phone: {
      label: "Número de teléfono",
      description: "Número de teléfono de contacto con código de país",
      placeholder: "+1234567890",
    },
    website: {
      label: "Sitio web",
      description: "Sitio web de la empresa URL",
      placeholder: "https://example.com",
    },
    locationPreferences: {
      title: "Lugar &quot; Preferencias",
      description: "Preferencias geográficas y lingüísticas",
    },
    country: {
      label: "País",
      description: "Localización comercial o mercado de destino",
      placeholder: "Seleccione un país",
    },
    language: {
      label: "Idioma",
      description: "Idioma de comunicación preferido",
      placeholder: "Seleccione un idioma",
    },
    leadDetails: {
      title: "Detalles del contacto",
      description: "Información adicional sobre el contacto",
    },
    source: {
      label: "Origen del contacto",
      description: "Cómo se adquirió el contacto",
      placeholder: "Seleccionar fuente",
    },
    notes: {
      label: "Notas",
      description: "Notas o comentarios adicionales",
      placeholder: "Ingrese cualquier información adicional...",
    },
    response: {
      title: "Created Lead",
      description: "Detalles del nuevo contacto creado",
      summary: {
        title: "Resumen",
        id: "ID del contacto",
        businessName: "Nombre del negocio",
        email: "Dirección de correo electrónico",
        status: "Estado del contacto",
      },
      contactDetails: {
        title: "Datos de contacto",
        phone: "Número de teléfono",
        website: "Sitio web URL",
        country: "País",
        language: "Idioma",
      },
      trackingInfo: {
        title: "Seguimiento de la información",
        source: "Origen del contacto",
        emailsSent: "Cuenta de correo electrónico",
        currentCampaignStage: "Etapa de campaña",
      },
      metadata: {
        title: "Metadatos",
        notes: "Notas",
        createdAt: "Fecha de creación",
        updatedAt: "Última actualización",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para crear leads",
      },
      validation: {
        title: "Error de validación",
        description: "Información de contacto inválida",
      },
      server: {
        title: "Error del servidor",
        description:
          "Error del servidor interno se produjo al crear el contacto",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido al crear el contacto",
      },
      network: {
        title: "Error de red",
        description: "Se produjo error de red al crear el contacto",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso prohibido para la creación de contacto",
      },
      notFound: {
        title: "No encontrado",
        description:
          "Recursos necesarios no encontrados para la creación de contacto",
      },
      conflict: {
        title: "Conflicto",
        description: "El contacto ya existe o se produjo un conflicto de datos",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar en la forma de contacto",
      },
    },
    success: {
      title: "Contacto creado",
      description: "contacto creado con éxito",
    },
  },
  email: {
    welcome: {
      subject: "Bienvenido a {{companyName}}",
      title: "Bienvenido a {{companyName}}, {{businessName}}!",
      preview: "Bienvenida. Así es como empezar.",
      greeting:
        "Bienvenido a {{companyName}}, {{businessName}}! Me alegro de tenerte.",
      defaultName: "allí.",
      introduction:
        "Gracias por su interés. Tus detalles nos alcanzaron, y una persona real los leyó.",
      nextSteps: {
        title: "¿Qué pasa después?",
        step1Number: "1.",
        step1:
          "Empieza a charlar de inmediato. Sin configuración, sin tarjeta.",
        step2Number: "2.",
        step2:
          "¿Preguntas? Responder a este correo electrónico. Un humano lo lee.",
        step3Number: "3.",
        step3: "Respondemos tan pronto como podamos.",
      },
      cta: {
        getStarted: "Empieza a chatear",
      },
      support:
        "¿Tiene preguntas? Responder a este correo electrónico o contactar con nosotros en {{supportEmail}}",
      error: {
        noEmail:
          "No se puede enviar correo electrónico de bienvenida - no email proporcionado",
      },
    },
    admin: {
      newLead: {
        subject: "Nuevo contacto: {{businessName}}",
        title: "Nuevo Lead Creado",
        preview: "Nuevo contacto de {{businessName}} requiere seguimiento",
        message:
          "Se ha creado una nueva pista en el sistema de {{businessName}} y requiere su atención.",
        leadDetails: "Detalles del contacto",
        businessName: "Nombre del negocio",
        email: "Correo electrónico",
        phone: "Teléfono",
        website: "Sitio web",
        source: "Fuente",
        status: "Situación",
        notes: "Notas",
        notProvided: "No se proporcionó",
        viewLead: "Ver detalles del contacto",
        viewAllLeads: "Ver todos los contactos",
        error: {
          noData:
            "No se puede enviar notificación de administración - no se proporcionan datos de contacto",
        },
        defaultName: "Nuevo contacto",
      },
    },
    error: {
      general: {
        internal_server_error: "Se produjo un error de servidor interno",
      },
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
    sk: "Eslovaco",
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
};
