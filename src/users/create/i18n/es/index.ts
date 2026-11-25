import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",
  tags: {
    create: "Crear",
    admin: "Administrador",
  },
  post: {
    title: "Crear usuario",
    titleShort: "Crear usuario",
    description: "Crear una nueva cuenta de usuario",
    form: {
      title: "Formulario de creación de usuario",
      description: "Rellene los detalles para crear un nuevo usuario",
    },
    email: {
      label: "Dirección de correo electrónico",
      description:
        "Dirección de correo electrónico del usuario para iniciar sesión y comunicación",
    },
    password: {
      label: "Contraseña",
      description: "contraseña segura para la cuenta de usuario",
    },
    privateName: {
      label: "Nombre privado",
      description:
        "Nombre legal completo del usuario (visible solamente a los administradores)",
    },
    publicName: {
      label: "Nombre público",
      description:
        "Nombre de visualización del usuario (visible para todos los usuarios)",
    },
    firstName: {
      label: "Nombre",
      description: "Nombre del usuario",
    },
    lastName: {
      label: "Apellido",
      description: "Nombre del usuario",
    },
    company: {
      label: "Company",
      description: "Empresa u organización del usuario",
    },
    phone: {
      label: "Número de teléfono",
      description: "Número de teléfono de contacto del usuario",
    },
    preferredContactMethod: {
      label: "Método de contacto preferido",
      description: "Cómo el usuario prefiere ser contactado",
    },
    roles: {
      label: "Roles de usuario",
      description: "Asignar funciones al usuario",
    },
    imageUrl: {
      label: "Imagen de perfil URL",
      description: "URL a la imagen del perfil del usuario",
    },
    bio: {
      label: "Biografía",
      description: "Breve descripción sobre el usuario",
    },
    website: {
      label: "Sitio web",
      description: "Sitio web personal o de empresa",
    },
    jobTitle: {
      label: "Título de trabajo",
      description: "Título de trabajo o posición del usuario",
    },
    emailVerified: {
      label: "Email Verificado",
      description: "Si el correo electrónico del usuario es verificado",
    },
    isActive: {
      label: "Situación activa",
      description: "Ya sea que la cuenta de usuario esté activa",
    },
    leadId: {
      label: "ID del contacto",
      description: "identificador de contacto asociado",
    },
    country: {
      label: "País",
      description: "País de residencia del usuario",
    },
    language: {
      label: "Idioma",
      description: "Idioma preferido del usuario",
    },
    response: {
      title: "Usuario Creado",
      description: "Detalles del usuario recién creado",
      id: {
        content: "Usuario ID",
      },
      leadId: {
        content: "ID del prospecto asociado",
      },
      country: {
        label: "País",
        description: "País de residencia del usuario",
      },
      language: {
        label: "Idioma",
        description: "Idioma preferido del usuario",
      },
      email: {
        content: "Dirección de correo electrónico",
      },
      privateName: {
        content: "Nombre privado",
      },
      publicName: {
        content: "Nombre público",
      },
      firstName: {
        content: "Nombre",
      },
      lastName: {
        content: "Apellido",
      },
      company: {
        content: "Company",
      },
      phone: {
        content: "Número de teléfono",
      },
      preferredContactMethod: {
        content: "Método de contacto preferido",
      },
      imageUrl: {
        content: "Imagen del perfil",
      },
      bio: {
        content: "Biografía",
      },
      website: {
        content: "Sitio web",
      },
      jobTitle: {
        content: "Título de trabajo",
      },
      emailVerified: {
        content: "Email Verificado",
      },
      isActive: {
        content: "Situación activa",
      },
      stripeCustomerId: {
        content: "Stripe Cliente ID",
      },
      userRoles: {
        content: "Roles de usuario",
        id: {
          content: "Función ID",
        },
        role: {
          content: "Función",
        },
      },
      createdAt: {
        content: "Creado en",
      },
      updatedAt: {
        content: "Actualizado en",
      },
    },
    errors: {
      unauthorized: {
        title: "Acceso no autorizado",
        description: "Debes estar conectado para crear usuarios",
      },
      validation: {
        title: "Validación fallida",
        description:
          "Por favor, compruebe los datos del formulario e inténtelo de nuevo",
      },
      server: {
        title: "Error del servidor",
        description: "Incapaz de crear usuario debido al error del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado al crear usuario",
      },
      network: {
        title: "Error de red",
        description: "La conexión de red falló durante la creación del usuario",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "No tienes permiso para crear usuarios",
      },
      notFound: {
        title: "Recursos no encontrados",
        description:
          "Recursos necesarios no encontrados para la creación del usuario",
      },
      conflict: {
        title: "Ya existe el usuario",
        description: "Un usuario con este email ya existe",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar que se perderán",
      },
      internal: {
        title: "Error interno: {{details}}",
        description: "Se produjo un error interno al crear el usuario",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "SMS Bienvenido Failed",
          description: "Failed to send welcome SMS to the user",
        },
        verification_failed: {
          title: "SMS Verification Failed",
          description: "Fallado para enviar verificación SMS al usuario",
        },
      },
    },
    success: {
      title: "Usuario Creado con éxito",
      description: "La nueva cuenta de usuario ha sido creada",
      message: {
        content: "Usuario creado con éxito",
      },
      created: {
        content: "Creado",
      },
    },
  },
  widget: {
    headerCreated: "Usuario Creado",
    headerCreate: "Crear usuario",
    headerSubtitle: "Crear una nueva cuenta de cliente o usuario administrador",
    activeBadge: "Activa",
    verifiedBadge: "Verificado",
    copiedTooltip: "Copiado",
    copyUserIdTooltip: "Copiar usuario ID",
    copyIdButton: "Copiar ID",
    copiedButton: "Copiado",
    viewUserButton: "Ver Usuario",
    fullProfileButton: "Perfil completo",
    creditHistoryButton: "Historial de créditos",
    createAnotherButton: "Crear otro usuario",
    createdPrefix: "Creado",
  },
  email: {
    users: {
      welcome: {
        greeting: "¡Bienvenido a nuestra plataforma, {{firstName}}!",
        preview: "Su cuenta ha sido creada con éxito",
        subject: "Bienvenido a {{companyName}} - Su cuenta está lista!",
        introduction:
          "Hola {{firstName}}, ¡estamos emocionados de tenerte a bordo! Su cuenta ha sido creada con éxito y ahora puede acceder a todas nuestras características.",
        accountDetails: "Detalles de la cuenta",
        email: "Correo electrónico",
        name: "Nombre",
        publicName: "Nombre de pantalla",
        company: "Company",
        phone: "Teléfono",
        nextSteps: "Siguientes pasos",
        loginButton: "Inicie sesión en su cuenta",
        support:
          "Si tiene alguna pregunta, nuestro equipo de apoyo está aquí para ayudar. ¡Contáctanos en cualquier momento!",
      },
      admin: {
        newUser: "Nuevo usuario creado",
        preview: "Se ha creado un nuevo usuario {{firstName}} {{lastName}}",
        subject: "Nueva cuenta de usuario creada - {{firstName}} {{lastName}}",
        notification:
          "Se ha creado una nueva cuenta de usuario en el sistema. Aquí están los detalles:",
        userDetails: "Detalles del usuario",
        viewUser: "Ver perfil de usuario",
      },
      errors: {
        missing_data:
          "Faltan datos de usuario requeridos para la plantilla de correo electrónico",
      },
      error: {
        general: {
          internal_server_error: "Se produjo un error de servidor interno",
        },
      },
      labels: {
        id: "ID:",
        email: "Correo electrónico:",
        name: "Nombre:",
        privateName: "Nombre completo:",
        publicName: "Nombre de la pantalla:",
        company: "Compañía:",
        created: "Creado:",
        leadId: "ID de prospecto:",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "¡Bienvenido {{firstName}}! Su cuenta ha sido creada con éxito. Visitanos en {{appUrl}}",
    },
    verification: {
      message:
        "{{firstName}}, su código de verificación es: {{code}}. Introduzca el código dentro de 10 minutos.",
    },
    errors: {
      welcome_failed: {
        title: "SMS Bienvenido Failed",
        description: "Failed to send welcome SMS to the user",
      },
      verification_failed: {
        title: "SMS Verification Failed",
        description: "Fallado para enviar verificación SMS al usuario",
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
  enums: {
    userRole: {
      public: "Público",
      customer: "Cliente",
      partnerAdmin: "Administrador del socio",
      partnerEmployee: "Empleado del socio",
      admin: "Administrador",
      cliOff: "CLI desactivada",
      cliAuthBypass: "CLI sin autenticación",
      aiToolOff: "Herramienta de IA desactivada",
      webOff: "Web desactivada",
      mcpOff: "MCP desactivado",
      mcpVisible: "Visible en MCP",
      productionOff: "Desactivado en producción",
      skillOff: "Habilidad desactivada",
    },
  },
};
