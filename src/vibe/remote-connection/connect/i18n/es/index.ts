import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  widget: {
    signInDescription: "Inicia sesión para conectarse a una cuenta remota.",
    adminOnlyDescription:
      "Crear conexiones externas requiere acceso de administración. Si usted estaba conectado por una instancia remota, sus conexiones son visibles arriba.",
    benefit1:
      "Las memorias se sincronizan automáticamente - todo lo que enseña el AI aquí lleva a cabo",
    benefit2:
      "Acceso a los modelos y herramientas AI de la nube desde su instancia local",
    benefit3: "Context viaja con usted a través de dispositivos",
    adminBenefit1: "Memorias sincron bidirectionalmente, automáticamente",
    adminBenefit2:
      "Cloud AI descubre y ejecuta sus herramientas locales (SSH, archivos, ejecución de código)",
    adminBenefit3:
      "Tareas de delegados desde la nube a esta máquina - Claude Code ejecuta localmente",
    adminBenefit4:
      "Capacidades instantáneas enviados cada sincronización - Thea siempre sabe lo que puede hacer este caso",
  },
  post: {
    title: "Conectarse a la cuenta remota",
    titleShort: "Conexión remota",
    description:
      "Conecta tu cuenta a una instancia remota para sincronizar recuerdos y utilizar herramientas AI desde cualquier lugar",
    remoteUrl: {
      label: "Remoto URL",
      description:
        "La dirección web de su cuenta remota (por ejemplo, https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Por favor, introduzca el URL remoto",
        invalid:
          "Por favor, introduzca un URL válido (por ejemplo, https://unbottled.ai)",
      },
    },
    email: {
      label: "Correo electrónico",
      description: "Su dirección de correo electrónico en la instancia remota",
      placeholder: "you@example.com",
      validation: {
        required: "Por favor, introduzca su correo electrónico",
        invalid:
          "Por favor, introduzca una dirección de correo electrónico válida",
      },
    },
    password: {
      label: "Contraseña",
      description: "Su contraseña en la instancia remota",
      placeholder: "••••••••",
      validation: {
        required: "Por favor, introduzca su contraseña",
      },
    },
    token: {
      label: "Token",
      description:
        "JWT token desde la instancia remota (se establece automáticamente)",
      validation: {
        required: "Iniciar sesión en la instancia remota",
      },
    },
    leadId: {
      label: "ID del contacto",
      description:
        "Lead ID desde la instancia remota (se establece automáticamente)",
    },
    isInferenceProvider: {
      label: "Usar como proveedor de información",
      description:
        "Deja que esta conexión ejecute los flujos AI: la instancia remota maneja el bucle AI sobre el canal de WS inverso.",
    },
    syncScope: {
      label: "Sincronización",
      description: "Que datos se sincronizan sobre esta conexión.",
    },
    credentialWarning:
      "Sus credenciales van directamente desde su navegador al servidor remoto. Sin embargo, el token almacenado aquí otorga al operador de este servidor acceso completo a su cuenta remota - pueden hacer cualquier cosa que pueda hacer allí. Sólo conecta en servidores con los que confías completamente.",
    actions: {
      submit: "Conectar",
      submitting: "Conectando...",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe sus datos e inténtelo de nuevo",
      },
      network: {
        title: "Conexión fallida",
        description:
          "No podía llegar al servidor remoto. Revise el URL e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No pudimos iniciar sesión",
        description:
          "Correo electrónico incorrecto o contraseña para la cuenta remota",
      },
      forbidden: {
        title: "Conexións remotas no aceptadas",
        description:
          "El servidor remoto no está configurado para aceptar conexiones entrantes. Asegúrate de conectarte a una instancia de nube (por ejemplo, unbottled.ai), no a otra instalación local.",
      },
      notFound: {
        title: "No encontrado",
        description: "No podía encontrar el servidor remoto en ese URL",
      },
      server: {
        title: "Error de servidor remoto",
        description: "El servidor remoto encontró un error",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Ya conectado",
        description:
          "Usted ya está conectado a una instancia remota con esta instancia ID",
      },
      instanceIdConflict: {
        title: "Instance ID Ya registrado",
        description:
          "Una instancia con este ID ya está registrada en el control remoto. Elija una instancia diferente ID.",
      },
      noLeadId: {
        title: "Error de conexión",
        description: "No podía establecer una sesión con el servidor remoto",
      },
      invalidUrl: {
        title: "Inválido remoto URL",
        description:
          "El URL remoto debe apuntar a un servidor público, no a una dirección local o privada",
      },
    },
    success: {
      title: "¡Conectado!",
      description: "Su cuenta ahora está conectada a la instancia remota",
    },
  },
};
