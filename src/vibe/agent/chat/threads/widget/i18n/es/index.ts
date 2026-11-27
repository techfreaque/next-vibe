import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "Nuevo chat",
    delete: "Eliminar",
    cancel: "Cancelar",
    settings: "Configuración",
    close: "Cerrar",
    toggleSidebar: "Mostrar u ocultar la barra lateral",
    noChatsFound: "No se encontraron chats",
  },
  actions: {
    rename: "Cambiar nombre",
    unpin: "Dejar de fijar",
    pin: "Fijar arriba",
    unarchive: "Desarchivar",
    archive: "Archivar",
    manageSharing: "Gestionar el acceso",
    moveToFolder: "Mover a una carpeta",
    unfiled: "Quitar de la carpeta",
  },
  folderList: {
    managePermissions: "Gestionar permisos",
    today: "Hoy",
    lastWeek: "Últimos 7 días",
    lastMonth: "Últimos 30 días",
    older: "Más antiguos",
  },
  threadList: {
    deleteDialog: {
      title: "Eliminar conversación",
      description:
        "¿Quieres eliminar «{{title}}»? Se borrarán todos los mensajes de la conversación de forma permanente.",
    },
  },
  suggestedPrompts: {
    title: "¿En qué puedo ayudarte?",
    privateTitle: "Tu asistente de IA privado",
    privateDescription:
      "Guarda las conversaciones en tu cuenta y consúltalas desde cualquiera de tus dispositivos.",
    sharedTitle: "Colabora con la IA",
    sharedDescription:
      "Crea conversaciones y compártelas con tu equipo mediante enlaces seguros.",
    publicTitle: "Participa en el foro público de IA",
    publicDescription:
      "Cualquiera puede ver las conversaciones públicas. Comparte tus ideas y participa en el diálogo.",
    incognitoTitle: "Chat anónimo con IA",
    incognitoDescription:
      "Los chats se quedan en tu navegador, fuera de tu cuenta y sin sincronizarse.",
    backgroundTitle: "Tus agentes de IA están trabajando",
    backgroundDescription:
      "Aquí los agentes autónomos y los agentes delegados trabajan mientras tú te ocupas de otras cosas. Los resultados aparecen automáticamente.",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "Iniciar sesión",
      signup: "Registrarse",
      logout: "Cerrar sesión",
      footer: {
        account: "Cuenta",
        expandAccount: "Expandir la sección de cuenta",
        collapseAccount: "Contraer la sección de cuenta",
      },
    },
    credits: {
      label: "Créditos",
      credit: "{{count}} crédito",
      credits: "{{count}} créditos",
    },
    navigation: {
      subscription: "Suscripción y créditos",
      partnerDashboard: "Panel de socios",
      apiKeys: "Claves API",
      referral: "Programa de referidos",
      settings: "Perfil y configuración",
      leadMagnet: "Recurso para captar contactos",
      help: "Comentarios y soporte",
      about: "Acerca de",
      websiteBlog: "Historias",
      newsletter: "Boletín: {{freeCreditsMax}} créditos gratis al mes",
      admin: "Panel de administración",
    },
    confirmations: {
      deleteMessage: "¿Quieres eliminar este mensaje?",
    },
    signInGate: {
      title: "Inicia sesión para abrir esta conversación",
      description:
        "Esta conversación está en una carpeta privada o compartida. Inicia sesión con una cuenta que tenga acceso.",
      signIn: "Iniciar sesión",
      signUp: "Crear una cuenta gratis",
      incognito: "Iniciar un chat privado",
    },
  },
};
