import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Usuarios",
  tags: {
    user: "Usuario",
    view: "Vista"
  },
  get: {
    title: "Detalles del usuario",
    titleShort: "Usuario",
    description: "Una cuenta finaliza: ingresos por vida, billetera de crédito, suscripción, pagos, atribución, derivaciones, actividad y errores. Editar, otorgar créditos, cambiar roles o prohibir desde aquí.",
    userId: {
      label: "Usuario ID"
    }
  },
  errors: {
    validation: {
      title: "Usuario inválido ID",
      description: "Pase un usuario válido UUID"
    },
    network: {
      title: "Error de red",
      description: "No podía llegar al servidor"
    },
    unauthorized: {
      title: "Inicia sesión para continuar",
      description: "Inicie sesión para ver detalles del usuario"
    },
    forbidden: {
      title: "Admins only",
      description: "Necesitas el papel de administrador para ver a este usuario"
    },
    notFound: {
      title: "Usuario no encontrado",
      description: "Ningún usuario con este ID"
    },
    serverError: {
      title: "No se puede cargar el usuario",
      description: "El servidor no pudo cargar a este usuario"
    },
    unknown: {
      title: "Error inesperado",
      description: "Algo salió mal cargando a este usuario"
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar"
    },
    conflict: {
      title: "Conflicto de datos",
      description: "El usuario cambió. Refrescos y reingresos"
    }
  },
  success: {
    title: "Usuario cargado",
    description: "Datos de usuario cargados"
  },
  status: {
    active: "Activa",
    banned: "Banned",
    inactive: "Inactivo",
    verified: "Verificado",
    unverified: "Unverified"
  },
  fields: {
    userId: "Usuario ID",
    roles: "Funciones",
    locale: "Locale",
    twoFactor: "Dos factores auth",
    enabled: "Activados",
    disabled: "Desactivados",
    marketing: "Correo electrónico de marketing",
    optedIn: "Optado en",
    optedOut: "Optado.",
    created: "Inscribirse",
    lastUpdated: "Perfil actualizado",
    banReason: "Razón de la prohibición"
  },
  text: {
    lastSeen: "Última vista",
    payments: "{{ok}} pagó, {{failed}} falló",
    actions: "Acciones: vibe user-update --id= {{id}} ANTERIVISO VENDIDOS-ROLE-add --id= {{id}} --role= <role> TEN VENDO DE REMOVISIÓN DE USUARIO --id= {{id}} --role= <role>"
  },
  kpi: {
    paid: "Hora de la vida pagada",
    paidHint: "{{count}} pagos exitosos, USD",
    refunded: "Reembolsos",
    credits: "Saldo acreedor",
    creditsHint: "+ {{free}} créditos gratis",
    spent: "Créditos gastados",
    spentHint: "sobre {{usd}} de uso",
    lastSeen: "Última vista",
    joined: "Joined {{date}}"
  },
  payment: {
    subscription: "Suscripción",
    status: "Situación",
    interval: "Facturación",
    renews: "Renovaciones",
    endsOn: "Finales en",
    firstPayment: "Primer pago",
    lastPayment: "Último pago",
    stripeCustomerId: "cliente de Stripe",
    none: "Sin suscripción",
    noSubscriptionButPaid: "Sin suscripción. Créditos comprados valen {{amount}}."
  },
  credits: {
    subscription: "Créditos suplementarios",
    permanent: "Créditos adquiridos",
    bonus: "Créditos de bonificación",
    free: "Créditos gratis",
    expires: "Expires {{date}}",
    purchased: "Créditos comprados",
    earnedTotal: "Créditos obtenidos (referenciales)",
    spentTotal: "Créditos gastados (todas las carteras)"
  },
  attribution: {
    title: "De donde vinieron",
    firstChannel: "Primer canal",
    utm: "Fuente UTM / medio / campaña",
    refCode: "Código de referido",
    referrerHost: "Referrer",
    landingPath: "Página de aterrizaje",
    lastChannel: "Último canal",
    firstTouch: "Primera visita",
    firstChat: "Primera charla",
    firstPaid: "Primer pago",
    none: "No hay datos de seguimiento para este usuario."
  },
  referrals: {
    referredBy: "Referido por",
    viaCode: "Code {{code}}",
    signups: "Signups referred",
    paying: "Remisiones de pago",
    activeCodes: "Códigos activos",
    earnings: "Ingresos de referencia",
    referredUsers: "Usuarios a los que se refieren",
    noneReferred: "Nadie se ha inscrito a través de este usuario todavía."
  },
  chat: {
    threads: "Conversaciones",
    threadsHint: "{{active}} activo, {{archived}} archivado",
    userMessages: "Mensajes enviados",
    aiMessages: "Respuestas de AI",
    incognitoNote: "Los chats Incognito nunca se almacenan. El gasto de crédito es la señal de uso real."
  },
  engagement: {
    favorites: "Favoritos",
    skills: "Habilidades aduaneras",
    skillsHint: "{{count}} habilidades personalizadas"
  },
  billing: {
    paymentsTitle: "Transacciones de procesadores recientes",
    subscriptionsTitle: "Historial de suscripción",
    succeeded: "Pagos exitosos",
    ofAttempts: "de {{count}} intentos",
    failedPending: "Failed / pending",
    noPayments: "No hay intentos de pago todavía",
    date: "Fecha",
    amount: "Importe",
    status: "Estado",
    kind: "Tipo",
    provider: "Proveedor",
    started: "Fecha de inicio",
    periodEnd: "Fin del período",
    cancels: "cancelaciones al final del período"
  },
  modelUsage: {
    title: "Pasar por modelo",
    model: "Modelo",
    spent: "Créditos",
    messages: "Llamadas"
  },
  errorsTab: {
    title: "Errores que involucran a este usuario",
    none: "No hay errores registrados que mencionar a este usuario.",
    resolved: "Resolved",
    open: "Abierto",
    openMonitor: "Monitor de error abierto"
  },
  widget: {
    loading: "Cargando usuario...",
    never: "Nunca.",
    actions: {
      edit: "Editar",
      addCredits: "Créditos de las subvenciones",
      delete: "Eliminar el usuario",
      copyUserId: "Copiar usuario ID"
    }
  },
  ban: {
    banUser: "Ban",
    unbanUser: "Unban"
  },
  roles: {
    add: "Añádase el papel",
    remove: "Eliminar el papel"
  },
  tabs: {
    overview: "Sinopsis",
    billing: "Facturación",
    credits: "Historia del crédito",
    referrals: "Remisiones",
    activity: "Actividad",
    connections: "Líderes vinculados",
    favorites: "Favoritos",
    skills: "Skills"
  },
  sections: {
    subscription: "Suscripción",
    credits: "Cartera de crédito",
    profile: "Perfil",
    recentActivity: "Última actividad",
    chatActivity: "Chat"
  },
  newsletter: {
    status: "Boletín",
    subscribed: "Suscrito",
    notSubscribed: "No está suscrito"
  },
  activity: {
    lastCreditUsage: "Último gasto credito",
    lastLogin: "Último login",
    activeSessions: "Sesiones activas",
    lastMessage: "Último mensaje",
    lastThread: "Última conversación iniciada",
    lastPayment: "Último pago"
  },
  connections: {
    leadsTitle: "Líderes vinculados",
    usersTitle: "Usuarios que comparten una pista",
    noLeads: "No hay cables conectados",
    noUsers: "No hay otros usuarios que compartan estas pistas",
    viewLead: "Ver el contacto",
    viewUser: "Ver usuario"
  }
};
