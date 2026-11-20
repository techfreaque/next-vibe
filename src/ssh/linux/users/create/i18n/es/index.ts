import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "No login shell",
    },
  },

  errors: {
    localModeOnly: {
      title: "Modo local",
    },
    invalidUsername:
      "Nombre de usuario inválido: debe comenzar con una carta, luego minúsculas letras, dígitos o hyphens (max 32 chars)",
    userAlreadyExists: "Un usuario con ese nombre de usuario ya existe",
    connectionNotFound: "Conexión SSH no encontrada",
    encryptionFailed: "Fallo de cifrado - JWT_SECRET_KEY puede ser inválido",
    connectTimeout: "Conexion timed out",
    sshAuthFailed: "La autenticación SSH falló",
    sshConnectionFailed: "La conexión SSH falló",
    sudoAuthFailed:
      "La autenticación de sudo falló - contraseña incorrecta o privilegios insuficientes de sudo",
    permissionDenied:
      "Permiso denegado: proporcionar su contraseña de sudo para crear usuarios OS",
    fingerprintMismatch:
      "La huella dactilar ha cambiado. Posible ataque MITM. Reconocimiento de proceder.",
  },

  post: {
    title: "Crear usuario de Linux",
    titleShort: "Crear usuario",
    description:
      "Cree una nueva cuenta de usuario OS. Corre al usuario en el host de destino. Admin solamente.",
    fields: {
      connectionId: {
        label: "SSH Connection",
        description:
          "Que servidor para crear el usuario en. Deje vacío para usar la conexión predeterminada o el modo local.",
        placeholder: "Seleccione una conexión...",
      },
      username: {
        label: "Nombre de usuario",
        description:
          "Debe comenzar con una carta, luego minúsculas letras, dígitos o hisofens. Max 32 caracteres.",
        placeholder: "alice",
      },
      groups: {
        label: "Grupos adicionales",
        description:
          "Grupos adicionales opcionales para añadir al usuario a (separados por el sistema). Ejemplo: docker, www-data.",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Login Shell",
        description:
          "La concha que se abre cuando este usuario inicia sesión interactiva.",
      },
      homeDir: {
        label: "Inicio Directorio",
        description:
          "Sendero para el directorio de inicio del usuario. Defaults to /home/ <username> if left empty.",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Grant Sudo Access",
        description:
          "Añadir el usuario al grupo sudo para que puedan ejecutar comandos como root. Usa con precaución.",
      },
      sudoPassword: {
        label: "Sudo Password",
        description:
          "Su contraseña de sudo para ejecutar useradd con privilegios elevados. Deje vacío si sudo sin contraseña está configurado.",
        placeholder: "Ingrese la contraseña de sudo...",
      },
    },
    response: {
      ok: { title: "Operación completada" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "Inicio Directorio" },
      shell: { title: "Shell" },
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
        description: "El modo local no está habilitado en este servidor",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para crear la cuenta de usuario",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión SSH no encontrada",
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
        title: "Nombre de usuario Ya existe",
        description:
          "Un usuario con este nombre de usuario ya existe en el servidor",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      timeout: { title: "Hora de salir", description: "Solicitud cedida" },
    },
    success: {
      title: "Usuario Creado",
      description: "Cuenta de usuario OS creada con éxito",
    },
    submitButton: {
      text: "Crear usuario",
      loadingText: "Creando...",
    },
  },
  widget: {
    title: "Crear usuario de Linux",
    createButton: "Crear usuario",
    creating: "Creando...",
    sudoWarning:
      "La concesión de acceso a sudo da privilegios a nivel de usuario. Sólo haz esto si confías en este usuario completamente.",
  },
};
