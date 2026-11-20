import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  widget: {
    loading: "Cargando conexión…",
    title: "Conexión remota",
    signInDescription: "Inicie sesión para configurar su conexión remota",
    back: "Atrás",
    // ── Status section ─────────────────────────────────────────────────────
    statusSection: "Situación",
    connected: {
      title: "Conectado",
      badge: "Activa",
      connectedTo: "Remoto URL",
      transport: "Transportes (extraídos)",
      remoteTransport: "Su transporte",
      remoteInstance: "Casos remotos",
      capabilities: "Versión de capacidades",
      lastSynced: "Último intercambio de sincronización",
      wsConnected: "Conectado desde",
      refresh: "Actualizar",
      transportReverseWs: "WS inverso (túnel)",
      transportDirectHttp: "Directo HTTP",
    },
    notConnected: {
      title: "No conectado",
      description:
        "Conéctese a una cuenta de nube (por ejemplo unbottled.ai) para sincronizar los recuerdos y llamar las herramientas AI desde su terminal, desde cualquier lugar.",
      benefit1:
        "Las memorias se sincronizan automáticamente entre este dispositivo y tu cuenta de nube",
      benefit2: "Ejecutar herramientas AI desde la línea de comandos con",
      benefit2Code: "vibe --remote",
      benefit3: "Estancia local y en la nube en sincronización",
    },
    // ── Behavior section ───────────────────────────────────────────────────
    behaviorSection: "Comportamiento",
    // ── Sync section ───────────────────────────────────────────────────────
    syncSection: "Sync &amp; Access",
    syncScope: {
      memories: "Memorias",
      documents: "Documentos",
      skills: "Skills",
      favorites: "Favoritos",
      threads: "Conversaciones",
    },
    // ── Cross-references ───────────────────────────────────────────────────
    cortexSection: "Cortex",
    cortexDescription:
      "Consulte el sistema de archivos compartido para esta conexión.",
    cortexLink: "Open Cortex",
    sshSection: "SSH &amp; Terminal",
    sshDescription:
      "Configuraciones SSH y sesiones terminales a través de esta conexión.",
    sshLink: "Open SSH connections",
    // ── Connection state banner ────────────────────────────────────────────
    state: {
      noSyncRecorded: "No hay sincronizaciones registradas",
      syncRecorded: "Sincronización registrada",
      tunnelActive: "WebSocket abierto",
      bridgeActive: "Conectado",
      degraded: "Conexión degradada",
      connectionLost: "Conexión perdida",
      inactive: "Inactivo",
      connectedSince: "Desde entonces",
      initialSync: "Sincronizado",
    },
    // ── Actions ────────────────────────────────────────────────────────────
    reauthButton: "Re-authenticate",
    renameButton: "Cambiar nombre",
    editButton: "Editar",
    reconnectButton: "Reconectar",
    disconnectButton: "Desconexión",
    disconnectConfirmTitle: "¿Desconectar este caso?",
    disconnectConfirmDescription:
      "La conexión se eliminará. Puedes reconectarte en cualquier momento.",
    disconnectConfirmCancel: "Cancelar",
    disconnectConfirmProceed: "Desconexión",
    // ── Edit section titles ────────────────────────────────────────────────
    edit: {
      identitySection: "Nombre",
      reauthSection: "Re-authenticate",
      transportSection: "Transport",
      behaviorSection: "Comportamiento",
    },
  },
  get: {
    title: "Estado de conexión remota",
    titleShort: "Conexión",
    description:
      "Estado completo y configuración para una conexión remota específica",
    instanceId: {
      label: "Instance ID",
      description: "La instancia de conexión a la vista",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Debes estar conectado para ver tu conexión remota",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para ver esto.",
      },
      notFound: {
        title: "No conectado",
        description: "No hay conexión remota encontrada para este caso",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al recuperar su conexión",
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
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
    success: {
      title: "Conexion Retrieved",
      description: "Estado de conexión remota recuperado con éxito",
    },
  },
  patch: {
    title: "Actualización de conexión remota",
    titleShort: "Actualización de conexión",
    description:
      "Renombrar, reacondicionar o configurar los ajustes de transporte y sincronización",
    // ── Rename ──────────────────────────────────────────────────────────────
    newInstanceId: {
      label: "Nombre nuevo",
      description:
        "Renombrar esta conexión. Actualiza la etiqueta local y sincroniza al mando a distancia.",
    },
    // ── Reauth ──────────────────────────────────────────────────────────────
    email: {
      label: "Correo electrónico",
      description: "Su correo electrónico de cuenta en la instancia remota",
    },
    password: {
      label: "Contraseña",
      description: "Su contraseña de cuenta en la instancia remota",
    },
    // ── Transport ────────────────────────────────────────────────────────────
    transportMode: {
      label: "Modo de transporte",
      description:
        "Cómo se comunica esta conexión. reversa-ws: persistente WS (opens inmediatamente en guardar). direct-http: directo HTTP llama.",
      options: {
        reverseWs: "Inverso WS",
        directHttp: "Directo HTTP",
      },
    },
    remoteTransportMode: {
      label: "Su modo de transporte",
      description:
        "Cómo el par llega a este lado. reversa-ws: tenemos un conector outbound para recibir sus envíos. direct-http: ellos POST nuestro puente.",
    },
    // ── Behavior ────────────────────────────────────────────────────────────
    isInferenceProvider: {
      label: "Proveedor de referencia",
      description:
        "Permitir que esta conexión sirva a la inferencia AI. instancia remota ejecuta el bucle LLM sobre la inversa- WS.",
    },
    forceSystemProvider: {
      label: "Proveedor del Sistema de Fuerza",
      description:
        "Anulación de la memoria: ruta ALL AI se transmite a través de esta conexión, superando costos y reglas de enrutamiento por usuario. Una conexión a la vez.",
    },
    threadMirrorMode: {
      label: "Espejo de pan",
      description:
        "Si los hilos se sincronizan entre esta instancia y la conectada. 'ambos' espejos hilos en ambas direcciones; 'off' guarda cada hilo donde fue creado.",
      options: {
        both: "Espejo ambas direcciones",
        off: "Sin espejos",
      },
    },
    loopLocation: {
      label: "Localización del bucle",
      description:
        "Cuando un hilo remoto funciona el bucle AI. 'target' lo ejecuta en la instancia conectada (por defecto); 'caller' mantiene el bucle aquí mientras que las herramientas todavía se ejecutan remotamente.",
      options: {
        target: "En la instancia conectada",
        caller: "En este caso",
      },
    },
    // ── Sync scope ──────────────────────────────────────────────────────────
    syncScope: {
      label: "Sincronización",
      description:
        "Que proveedores de datos sincronizan sobre esta conexión: recuerdos, documentos, habilidades, favoritos, hilos.",
      memories: "Memorias",
      documents: "Documentos",
      skills: "Skills",
      favorites: "Favoritos",
      threads: "Conversaciones",
    },
    reconnectNow: {
      label: "Reconectar ahora",
      description:
        "Cierre y vuelva a abrir la conexión, disparando sincronización de conexión.",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      network: { title: "Error de red", description: "No conectado" },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Función de administrador necesaria para este campo",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para actualizar la conexión",
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
    },
    success: {
      title: "Actualización de conexión",
      description: "Ajustes guardados con éxito",
    },
  },
  delete: {
    title: "Desconexión",
    titleShort: "Desconexión",
    description: "Eliminar esta conexión remota y cerrar el canal WebSocket",
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      network: { title: "Error de red", description: "No conectado" },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso.",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to disconnect",
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
    },
    success: {
      title: "Desconectado",
      description: "Conexión remota eliminada con éxito",
    },
  },
};
