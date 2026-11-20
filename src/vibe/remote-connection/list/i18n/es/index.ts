import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  get: {
    title: "Conexiones remotas",
    titleShort: "Conexiones",
    description: "Listar todas las conexiones remotas para su cuenta",
    fields: {
      activeOnly: {
        label: "Activo solamente",
        description: "Sólo devolver conexiones activas",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Usted debe estar conectado para ver las conexiones",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso.",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to list connections",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay conexiones encontradas",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
    },
    success: {
      title: "Conexiones",
      description: "Conexións remotas recuperadas",
    },
  },
  widget: {
    loading: "Cargando conexiones…",
    refresh: "Actualizar conexiones",
    back: "Atrás",
    socketSince: "WebSocket abierto desde",
    transportLabel: "Transport",
    viewConnection: "Abrir la conexión {{instance}}",
    pickConnection: "Elegir",
    title: "Conexiones remotas",
    addButton: "Agregar conexión",
    emptyState:
      "No hay instancias vinculadas. Vincula una para compartir los datos y las herramientas que elijas.",
    emptyStateCloud: "Aún no hay ningún caso vinculado.",
    connectedBadge: "Conectado",
    registeredBadge: "Registrado",
    selfBadge: "Mi cuenta",
    lastSynced: "Último intercambio de sincronización",
    never: "Nunca.",
    connectButton: "Link Local Instance",
    connectButtonLocal: "Conectarse a Cloud",
    incomingBadge: "Entrando",
    inactiveBadge: "Inactivo",
    inferenceProviderBadge: "Inferencia",
    transportBadge: "{{out}} · en {{in}}",
    transport: {
      unknown: "Desconocida",
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    instanceId: "Instance ID",
    remoteUrl: "Remoto URL",
    viewButton: "Vista",
    editButton: "Editar",
    deleteButton: "Desconexión",
    // ── Health status labels ───────────────────────────────────────────────────
    health: {
      socketOpen: "WebSocket abierto",
      noSyncRecorded: "No hay sincronizaciones registradas",
      syncRecorded: "Sincronización registrada",
      tunnelOpen: "Tunel abierto",
      bridgeActive: "Conectado",
      tunnelWarning: "Conexión de túnel",
      bridgeWarning: "Sincronización",
      tunnelLost: "Tunnel lost",
      bridgeFailed: "La conexión falló",
      disconnected: "Desconectado",
      reauthRequired: "Inscripción necesaria",
      incomingActive: "Activa",
    },
    // ── Reconnect button labels ────────────────────────────────────────────────
    reconnectButton: {
      reauth: "Inicie sesión de nuevo",
      reconnect: "Reconectar",
      retry: "Retrocedimiento",
      resync: "Re-sync",
    },
    // Cloud marketing panel
    cloud: {
      heroTitle: "Trae tu propio ejemplo.",
      heroSubtitle:
        "Ejecute next-vibe en su propio hardware y enlace a esta cuenta. Tus charlas, recuerdos y habilidades te siguen. Tus herramientas funcionan en tu máquina.",
      stepsTitle: "Conectar en tres pasos",
      step1Title: "Instalar next-vibe",
      step1Body:
        "Fuente abierta. Se ejecuta en un portátil, un servidor de casa o un VPS.",
      step2Title: "Víndelo desde tu instancia",
      step2Body:
        "En su caso, abra la suscripción, luego Cloud Sync, luego Conectarse a Cloud. Introduzca {{appUrl}} y el login de esta cuenta. En un terminal en esa máquina:",
      step2Command: "vibe remote-connect -i",
      step3Title: "Escoge qué sincronizaciones",
      step3Body:
        "Memorias, documentos, habilidades, favoritos, chats. Un interruptor cada uno, cambió en cualquier momento de su instancia.",
      githubCta: "Ver en GitHub",
      quickstartCta: "Inicio rápido",
      trustTitle: "Qué puede hacer una instancia vinculada",
      trust1:
        "Actúa como tú. Lee y escribe sus propios chats, recuerdos y habilidades. Nada de cualquier otra cuenta.",
      trust2:
        "Las herramientas de Admin permanecen cerradas. Su instancia obtiene exactamente los derechos que tiene su cuenta.",
      trust3:
        "AI ejecuta que envía aquí factura sus créditos a la tarifa normal: costo del proveedor más 30%.",
      trust4:
        "Hasta las instancias de {{max}}. Desconectar uno debajo y su enlace se detiene inmediatamente.",
      paidTitle: "Cuentas pagadas solamente",
      paidBody:
        "Vincular su propia instancia necesita una cuenta pagada. Cualquier paquete de crédito o suscripción lo desbloquea.",
      paidCta: "Desbloquearlo",
      alreadyHaveLocal: "Sus instancias vinculadas",
      alreadyHaveLocalSub:
        "Cada uno actúa como esta cuenta. Abre uno para comprobar su estado o desconectarlo.",
    },
    // Local panel
    local: {
      cloudTitle: "Conectarse a Cloud",
      cloudSubtitle:
        "Vincula esta instancia con una en la nube para sincronizar los datos seleccionados y ejecutar herramientas locales desde la nube.",
      benefit1: "Memorias sincron bidirectionalmente, automáticamente",
      benefit2: "Cloud AI descubre y ejecuta sus herramientas locales",
      benefit3: "Tareas de delegados desde la nube a esta máquina",
      noConnectionsYet: "Nada vinculado aún",
      connectionsTitle: "Conexiones vinculadas",
    },
    // Self-identity
    selfIdentity: {
      title: "Su instalación ID",
      description:
        "Otras instancias ven este servidor como este ID. Debe ser único en todas las instancias conectadas.",
    },
    // Sync settings (admin only)
    syncSettings: {
      title: "Auto-Sync",
      description:
        "Sincronizar tareas y recuerdos con todas las instancias conectadas cada minuto",
      enabledBadge: "Activa",
      disabledBadge: "Inactivo",
      toggleLabel: "Toggle auto-sinc",
    },
  },
};
