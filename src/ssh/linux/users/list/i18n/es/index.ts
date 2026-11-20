import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Modo local",
    },
    connectionNotFound: "Conexión no encontrada",
    encryptionFailed: "Fallo de cifrado - JWT_SECRET_KEY puede ser inválido",
    connectTimeout: "Conexion timed out",
    sshAuthFailed: "La autenticación SSH falló",
    sshConnectionFailed: "La conexión SSH falló",
    fingerprintMismatch:
      "La huella dactilar ha cambiado. Posible ataque MITM. Use acknowledgeNewFingerprint =true para proceder.",
  },

  get: {
    title: "Lista de Usuarios Linux",
    titleShort: "Usuarios de Linux",
    description: "Lista de cuentas de usuario OS en el host (uid √= 1000)",
    fields: {
      connectionId: {
        label: "Conexión",
        description: "Conexión SSH a uso (dejar vacío para local)",
        placeholder: "uuid",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso de los administradores necesario",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "LOCAL_MODE requerido",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to list users",
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
    response: {
      users: { title: "Usuarios" },
    },
    success: {
      title: "Usuarios Listados",
      description: "Los usuarios de OS recuperados",
    },
  },
  widget: {
    title: "Usuarios de Linux",
    createButton: "Crear usuario",
    lockButton: "Cerradura",
    unlockButton: "Desbloquear",
    deleteButton: "Eliminar",
    usernameCol: "Nombre de usuario",
    uidCol: "UID",
    homeDirCol: "Home",
    shellCol: "Shell",
    groupsCol: "Grupos",
    statusCol: "Situación",
    locked: "Bloqueados",
    active: "Activa",
    localModeOnly: "Solo disponible en LOCAL_MODE",
    noUsers: "No se encontraron usuarios",
    confirmDelete:
      "Eliminar el usuario {username}? Esto no puede ser deshecho.",
  },
};
