import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Recurso para captar contactos",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "Operación completada",
      failed: "Failed",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "Email (via plataforma)",
    },
  },
  config: {
    title: "Lead Magnet Config",
    description:
      "Configure su integración de correo electrónico de imán principal",
    form: {
      title: "Configuración de Magneto de plomo",
      description:
        "Conecte su plataforma de correo electrónico para capturar los cables de su página de habilidad",
      provider: {
        label: "Plataforma de Email",
        description: "¿Qué plataforma de email marketing utiliza?",
      },
      listId: {
        label: "Lista / Grupo ID",
        description:
          "El ID de la lista o segmento para añadir leads a (opcional)",
      },
      headline: {
        label: "Título del formulario",
        description:
          "El titular mostrado por encima del formulario de captura de plomo",
        placeholder: "Consigue mi paquete de emergencia AI gratis",
      },
      buttonText: {
        label: "Texto de Button",
        description: "El texto en el botón de envío",
        placeholder: "Obtener acceso →",
      },
      isActive: {
        label: "Activa",
        description:
          "Habilitar o desactivar el formulario del imán del plomo en su página de habilidad",
      },
      credentials: {
        label: "API Credenciales",
        description:
          "Su plataforma de correo electrónico API credenciales (encriptadas en tiendas)",
      },
    },
    success: {
      saved: "Contorno de imán de plomo guardado",
      deleted: "Cierre del imán de plomo eliminado",
    },
  },
  capture: {
    title: "Únete a la lista",
    description: "Suscríbete y consigue acceso",
    form: {
      title: "Obtener acceso",
      description: "Introduzca sus datos para obtener acceso",
      firstName: {
        label: "Nombre",
        description: "Tu nombre de pila",
      },
      email: {
        label: "Dirección de correo electrónico",
        description: "Su dirección de correo electrónico",
      },
      skillId: {
        label: "ID de la habilidad",
        description: "Referencia de la capacidad interna",
      },
    },
    success: {
      submitted: "¡Estás dentro! Revisa tu buzón de entrada.",
    },
  },
  errors: {
    providerError: "Error del proveedor de correo electrónico",
  },
  providers: {
    shared: {
      connectionSettings: "Ajustes de conexión",
      listId: {
        label: "Lista / Grupo ID",
        description: "El ID de la lista o segmento para añadir leads a",
        placeholder: "e.g. abc123",
      },
      headline: {
        label: "Título del formulario",
        description:
          "El titular mostrado arriba del formulario de captura de plomo en su página de habilidad",
        placeholder: "Consigue mi paquete de emergencia AI gratis",
      },
      buttonText: {
        label: "Texto de Button",
        description: "El texto en el botón de envío",
        placeholder: "Obtener acceso →",
      },
      isActive: {
        label: "Activa",
        description:
          "Hable el formulario de captura de plomo en su página de habilidad",
      },
      secretKeepExisting: "Deja en blanco para mantener tu llave existente",
      saveTitle: "Guardar Config",
      saveDescription:
        "Conecta tu plataforma de correo electrónico para capturar los leads",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "Config Guardado",
        description:
          "Su plataforma de correo electrónico está conectada. Los plomos fluirán.",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Por favor, compruebe su entrada",
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
          description: "No se encontró el recurso",
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
      response: {
        provider: "Proveedor",
        isActive: "Activa",
        headline: "Título",
        buttonText: "Texto de Button",
        listId: "Lista ID",
      },
    },
    klaviyo: {
      title: "Conecta Klaviyo",
      titleShort: "Klaviyo",
      description:
        "Conecte su cuenta de Klaviyo para capturar los cables de su página de habilidad",
      klaviyoApiKey: {
        label: "Klaviyo API Key",
        description: "Tu llave privada Klaviyo API",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "Conectar GetResponse",
      titleShort: "GetResponse",
      description:
        "Conecte su cuenta de GetResponse para capturar los cables de su página de habilidad",
      getresponseApiKey: {
        label: "Clave de GetResponse API",
        description:
          "Su tecla GetResponse API desde la configuración de la cuenta",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Conectar Emarsys",
      titleShort: "Emarsys",
      description:
        "Conecte su cuenta de Emarsys para capturar los cables de su página de habilidad",
      emarsysUserName: {
        label: "Nombre de usuario",
        description: "Su nombre de usuario Emarsys API",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "API Key",
        description: "Tu llave secreta de Emarsys API",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "Subdominio",
        description:
          "Su subdominio Emarsys API (por ejemplo, suite.emarsys.net)",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Conectar Acumbamail",
      titleShort: "Acumbamail",
      description:
        "Conecte su cuenta de Acumbamail para capturar los cables de su página de habilidad",
      acumbamailApiKey: {
        label: "API Key",
        description: "Su clave de Acumbamail API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "Connect CleverReach",
      titleShort: "CleverReach",
      description:
        "Conecte su cuenta de CleverReach para capturar los cables de su página de habilidad",
      cleverreachClientId: {
        label: "Cliente ID",
        description: "Su cliente CleverReach OAuth ID",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "Secreto del cliente",
        description: "Su cliente CleverReach OAuth secreto",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "Grupo / Lista ID",
        description: "El ID del grupo CleverReach para agregar contactos",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "DOI Form ID (opcional)",
        description:
          "Formulario ID para doble opción. Deja en blanco para saltar DOI.",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "Fuente (opcional)",
        description: "Etiquetas fuente de contacto para el seguimiento",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Connectif",
      titleShort: "Connectif",
      description:
        "Conecta tu cuenta Connectif para capturar los cables de tu página de habilidad",
      connectifApiKey: {
        label: "API Key",
        description: "Su llave de Connectif API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "Conectar datosSiguiente",
      titleShort: "DataNext",
      description:
        "Conectar su cuenta de datosSiguiente para capturar los cables de su página de habilidad",
      datanextApiKey: {
        label: "API Key",
        description: "Sus datosPróxima tecla API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "API Secret",
        description: "Sus datosSiguiente secreto de API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "Formulario ID",
        description:
          "Los datosSiguiente formulario ID para el formulario opt-in",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "Campaign ID",
        description: "La campaña ID para asociar a los líderes",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Conectar Edrone",
      titleShort: "Edrone",
      description:
        "Conecta tu cuenta de Edrone para capturar los cables de tu página de habilidad",
      edroneAppId: {
        label: "App ID",
        description: "Su aplicación Edrone ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "Connect ExpertSender",
      titleShort: "ExpertSender",
      description:
        "Conecte su cuenta de ExpertSender para capturar los cables de su página de habilidad",
      expertSenderApiDomain: {
        label: "API Domain",
        description: "Su dominio ExpertSender API",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "API Key",
        description: "Su llave de ExpertSender API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "Conectar el material fresco",
      titleShort: "FreshMail",
      description:
        "Conecte su cuenta de FreshMail para capturar los cables de su página de habilidad",
      freshmailApiKey: {
        label: "API Key",
        description: "Tu llave API de material fresco",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "API Secret",
        description: "Tu secreto de FreshMail API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "Lista Hash",
        description: "El hash de la lista de suscriptores para añadir leads a",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "Connect MailUp",
      titleShort: "MailUp",
      description:
        "Conecta tu cuenta de MailUp para capturar los cables de tu página de habilidad",
      mailupClientId: {
        label: "Cliente ID",
        description: "Su correo OAuth cliente ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "Secreto del cliente",
        description: "Tu cliente MailUp OAuth secreto",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "Nombre de usuario",
        description: "Su cuenta de MailUp nombre de usuario",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "Contraseña",
        description: "Su contraseña de cuenta MailUp",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "Lista ID",
        description: "El numérico ID de la lista para suscribir contactos",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Conectar Mapp",
      titleShort: "Mapp",
      description:
        "Conecta tu cuenta Mapp para capturar los cables de tu página de habilidad",
      mappUsername: {
        label: "Nombre de usuario",
        description: "Su nombre de usuario Mapp API",
        placeholder: "nombre de usuario",
      },
      mappPassword: {
        label: "Contraseña",
        description: "Su contraseña Mapp API",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "Dominio",
        description: "Su dominio Mapp API",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Conecta Sailthru",
      titleShort: "Sailthru",
      description:
        "Conecta tu cuenta de Sailthru para capturar los cables de tu página de habilidad",
      sailthruApiKey: {
        label: "API Key",
        description: "Tu llave de Sailthru API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "API Secret",
        description: "Tu secreto de Sailthru API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "Nombre de la lista",
        description: "El nombre de la lista Sailthru para suscribir contactos",
        placeholder: "Mis suscriptores",
      },
    },
    salesmanago: {
      title: "Conectar SALESmanago",
      titleShort: "SALESmanago",
      description:
        "Conecte su cuenta de SALESmanago para capturar los cables de su página de habilidad",
      salesManagoClientId: {
        label: "Cliente ID",
        description: "Su cliente SALESmanago ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "API Key",
        description: "Tu llave SALESmanago API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "SHA",
        description: "Su Hach SALESmanago SHA para autenticación",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "Dominio",
        description: "Su dominio SALESmanago API",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "Propietarios",
        description:
          "El correo electrónico propietario de su cuenta SALESmanago",
        placeholder: "owner@example.com",
      },
    },
    shopify: {
      title: "Connect Shopify",
      titleShort: "Shopify",
      description:
        "Conecta tu tienda Shopify para capturar los cables de tu página de habilidad",
      shopifyDomain: {
        label: "Store Dominio",
        description: "Su dominio de tienda",
        placeholder: "mystore.myshopify.com",
      },
      shopifyAccessToken: {
        label: "Acceso Token",
        description: "Su Shopify Admin API acceso token",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Connect Spotler",
      titleShort: "Spotler",
      description:
        "Conecta tu cuenta de Spotler para capturar leads desde tu página de habilidad",
      spotlerConsumerKey: {
        label: "Consumer Key",
        description: "Su llave de consumo de Spotler API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "Consumer Secret",
        description: "Su secreto de consumidor de Spotler API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "Conéctate.",
      titleShort: "YouLead",
      description:
        "Conecta tu cuenta YouLead para capturar los cables de tu página de habilidad",
      youLeadAppId: {
        label: "App ID",
        description: "Su aplicación YouLead ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "Cliente ID",
        description: "Su cliente YouLead ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "App Secret Key",
        description: "Tu clave secreta de aplicación YouLead",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Connect Adobe Campaign",
      titleShort: "Adobe Campaign",
      description:
        "Conecta tu cuenta de Adobe Campaign para capturar leads desde tu página de habilidad",
      adobeCampaignOrganizationId: {
        label: "Organization ID",
        description: "Su Adobe IMS Organización ID",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "Cliente ID",
        description: "Su cliente de Adobe Campaign API ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "Secreto del cliente",
        description: "Su cliente de Adobe Campaign API secreto",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "API Key",
        description: "Tu clave de Adobe Campaign API",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "Lista ID",
        description:
          "La lista de perfil de Adobe Campaign ID para añadir pistas",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "Notificar por correo electrónico de plataforma",
      titleShort: "Platform Email",
      description:
        "Obtenga una notificación de correo electrónico cada vez que alguien se inscribe a través de su imán principal",
      notifyEmail: {
        label: "Correo electrónico de notificación",
        description: "Dónde enviar notificaciones de plomo",
        placeholder: "you@example.com",
      },
      notifyEmailName: {
        label: "Tu nombre",
        description: "Nombre mostrado en el correo electrónico de notificación",
        placeholder: "Jane.",
      },
    },
    googleSheets: {
      title: "Conectar las hojas de Google",
      titleShort: "Google Sheets",
      description:
        "Apéntate una fila a tu hoja de cálculo Google cada vez que aparece una pista",
      saveTitle: "Guardar configuración de hojas de Google",
      connect: {
        label: "Conecte la cuenta Google",
      },
      connected: {
        description: "Su cuenta Google está conectada",
      },
      spreadsheetId: {
        label: "Hoja de cálculo",
        description:
          "Seleccione la hoja de cálculo donde se añadirán los cables",
        placeholder: "Seleccione una hoja de cálculo...",
      },
      sheetTab: {
        label: "Tapa de hoja (opcional)",
        description:
          "El nombre de la ficha dentro de la hoja de cálculo. Deja en blanco para usar la primera pestaña.",
        placeholder: "Por ejemplo. Plomo",
      },
      widget: {
        connectTitle: "Conectar las hojas de Google",
        connectDescription:
          "Inicie sesión con Google para agregar automáticamente cada nuevo plomo como fila en su hoja de cálculo.",
        redirectNote:
          "Será redireccionado a Google para otorgar acceso a hojas de cálculo.",
        reconnect: "Reconectar",
        loading: "Carga de hojas de cálculo...",
        noSheets: "No hay hojas de cálculo encontradas",
        refresh: "Lista de referencia",
        selectRequired: "Por favor, seleccione una hoja de cálculo",
        saveFailed: "Falló para salvar. Por favor, inténtalo de nuevo.",
        saving: "Salvando...",
      },
    },
  },
};
