import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    clusterRole: {
      none: "Ninguno",
      controlPlane: "Plano de control",
      worker: "Worker",
      storage: "Almacenamiento",
    },
    authType: {
      password: "Contraseña",
      privateKey: "Clave privada (PEM)",
      keyAgent: "SSH Agent",
      local: "Máquina local",
    },
  },

  errors: {
    connectionNotFound: "Conexión no encontrada",
    encryptionFailed: "Fallo de cifrado - JWT_SECRET_KEY puede ser inválido",
  },

  get: {
    title: "SSH Connection",
    titleShort: "SSH Connection",
    description: "Ver detalles de conexión SSH",
    fields: {
      id: { label: "Conexión ID", description: "La conexión a la vista" },
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
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Fallado a la conexión de carga",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión no encontrada",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
    },
    response: {
      label: { title: "Label" },
      host: { title: "Host" },
      port: { title: "Port" },
      username: { title: "Nombre de usuario" },
      authType: { title: "Tipo de Auth" },
      isDefault: { title: "Predeterminado" },
      fingerprint: { title: "Huella" },
      notes: { title: "Notas" },
      createdAt: { title: "Creado en" },
    },
    success: {
      title: "Conexión cargada",
      description: "Datos de conexión recuperados",
    },
  },
  patch: {
    title: "Actualización SSH Connection",
    titleShort: "Actualización de conexión",
    description: "Actualizar los ajustes de conexión SSH",
    fields: {
      id: {
        label: "Conexión ID",
        description: "La conexión a la actualización",
      },
      label: {
        label: "Label",
        description: "Nombre de visualización para esta conexión",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "Nombre de host o dirección IP",
        placeholder: "1.2.3.4",
      },
      port: { label: "Port", description: "Puerto SSH", placeholder: "22" },
      username: {
        label: "Nombre de usuario",
        description: "Usuario de inicio de sesión SSH",
        placeholder: "deploy",
      },
      authType: {
        label: "Tipo de Auth",
        description: "Método de autenticación",
      },
      secret: {
        label: "Contraseña / Clave privada",
        description: "Deja vacío para mantener el secreto existente",
      },
      passphrase: {
        label: "Key Passphrase",
        description:
          "Deja vacío para mantener la contraseña existente o aclararla",
      },
      isDefault: {
        label: "Establecer como Default",
        description:
          "Utilice esta conexión por defecto para las sesiones terminales",
      },
      clusterRole: {
        label: "Función del grupo de expertos",
        description:
          "Función de este servidor en el clúster k8s (plano de control, trabajador, almacenamiento o ninguno)",
      },
      notes: {
        label: "Notas",
        description: "Notas opcionales sobre esta conexión",
      },
    },
    response: {
      updatedAt: { title: "Actualizado en" },
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
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Fallado para actualizar la conexión",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión no encontrada",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
    },
    success: {
      title: "Actualización de conexión",
      description: "Conexión actualizada con éxito",
    },
  },
  delete: {
    title: "Eliminar la conexión SSH",
    titleShort: "Eliminar la conexión",
    description: "Eliminar una conexión SSH",
    fields: {
      id: { label: "Conexión ID", description: "La conexión para eliminar" },
    },
    response: {
      deleted: { title: "Suprimidos" },
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
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Fallado para eliminar la conexión",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión no encontrada",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
    },
    success: {
      title: "Conexión suprimida",
      description: "Conexión eliminada con éxito",
    },
  },
  widget: {
    title: "Detalles de conexión",
    host: "Host",
    user: "Usuario",
    auth: "Auth",
    notes: "Notas",
    saveButton: "Guardar cambios",
    deleteButton: "Eliminar la conexión",
    testButton: "Test Connection",
    confirmDelete: "Eliminar esta conexión? Esto no puede ser deshecho.",
    mountsSection: "Directores montados",
    manageMounts: "Manage Mounts",
  },
};
