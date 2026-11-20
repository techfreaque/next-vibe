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

  errors: {
    sshSecretKeyNotSet:
      "JWT_SECRET_KEY env var no se establece. Agregue un valor hex de 32 bytes para habilitar el modo SSH.",
    encryptionFailed: "Fallo de cifrado - JWT_SECRET_KEY puede ser inválido",
    noRowReturned: "No hay fila devuelta de la inserción",
  },

  post: {
    title: "Crear conexión SSH",
    titleShort: "Crear conexión",
    description:
      "Guarda una nueva conexión SSH. Las credenciales están encriptadas en reposo usando AES-256 - GCM.",
    fields: {
      label: {
        label: "Label",
        description: "Un nombre amistoso para identificar esta conexión",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Nombre de host / IP",
        description: "El nombre de host del servidor SSH o la dirección IP",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "Port",
        description: "Puerto servidor SSH (predeterminado: 22)",
        placeholder: "22",
      },
      username: {
        label: "Nombre de usuario",
        description: "El usuario de SSH para autenticar como",
        placeholder: "deploy",
      },
      authType: {
        label: "Método de autenticación",
        description:
          "Cómo autenticar. Contraseña: inicio de sesión de contraseña simple. Clave privada: archivo de tecla PEM. SSH Agent: use the system SSH agent (SSH_AUTH_SOCK).",
      },
      secret: {
        label: "Contraseña / Clave privada",
        description:
          "Para Password auth: la contraseña. Para la clave privada: pegar la tecla PEM completa (----- BEGIN... KEY-----). Deja vacío para el agente SSH.",
        placeholder: "",
      },
      passphrase: {
        label: "Key Passphrase",
        description:
          "Si su llave privada está protegida por contraseña, ingrese aquí. Deja vacío si la llave no está encriptada.",
        placeholder: "",
      },
      isDefault: {
        label: "Establecer como conexión predeterminada",
        description:
          "Utilice esta conexión de forma predeterminada para las sesiones AI, el terminal y los comandos exec cuando no se especifica ninguna conexión.",
      },
      notes: {
        label: "Notas",
        description: "Notas internas opcionales sobre esta conexión",
        placeholder: "VPS detrás de NAT, el anfitrión de salto requerido",
      },
    },
    response: {
      id: { title: "Conexión ID" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise los campos del formulario e inténtelo de nuevo",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso de los administradores necesario",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para crear conexiones",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para salvar la conexión",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
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
        title: "Label ya existe",
        description: "Una conexión con esta etiqueta ya existe",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      timeout: { title: "Hora de salir", description: "Solicitud cedida" },
    },
    success: {
      title: "Conexión guardada",
      description: "Conexión SSH guardada con éxito",
    },
    submitButton: {
      text: "Guardar conexión",
      loadingText: "Salvando...",
    },
  },
  widget: {
    title: "Nueva conexión SSH",
    createButton: "Guardar conexión",
    creating: "Salvando...",
    testFirst: "Pruebe la conexión antes de guardar",
  },
};
