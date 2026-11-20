import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Contraseña",
      privateKey: "Clave privada (PEM)",
      keyAgent: "SSH Agent",
      local: "Máquina local",
    },
  },

  get: {
    title: "Conexiones",
    titleShort: "Conexiones",
    description:
      "Todas las máquinas a las que se puede conectar con. shell local, servidores SSH, y casos remotos",
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso de los administradores necesario",
      },
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Failed to list connections",
      },
      notFound: {
        title: "No encontrado",
        description: "Cuenta o sesión no encontradas",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: { title: "Cambios sin guardar" },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      timeout: { title: "Hora de salir", description: "Solicitud cedida" },
    },
    success: {
      title: "Conexiones",
      description: "Todas las conexiones de la máquina recuperadas",
    },
    response: {
      connections: {
        title: "Conexiones",
      },
    },
  },
  widget: {
    title: "Conexiones",
    back: "Atrás",
    addSsh: "Añadir SSH",
    connectRemote: "Conexión remota",
    openTerminal: "Terminal",
    viewRemote: "Detalles",
    defaultBadge: "Predeterminado",
    localType: "Local",
    sshType: "SSH",
    remoteType: "Remoto",
    healthHealthy: "Conectado",
    healthWarning: "Despacio.",
    healthCritical: "Inalcanzable",
    healthDisconnected: "Sin conexión",
    noConnections: "No hay máquinas configuradas",
    noConnectionsHint:
      "Agregue una conexión SSH o conecte una instancia remota para comenzar.",
    emptyState:
      "Todavía no hay conexiones. Añadir uno para conectarse a máquinas remotas.",
  },
};
