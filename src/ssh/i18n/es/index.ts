import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "Contraseña",
      privateKey: "Clave privada (PEM)",
      keyAgent: "SSH Agent",
      local: "Máquina local",
    },
    clusterRole: {
      none: "No hay función de agrupación",
      controlPlane: "Plano de control",
      worker: "Worker",
      storage: "Almacenamiento",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin",
    },
  },

  errors: {
    localModeOnly: {
      title: "Modo local",
      description: "Esta función solo está disponible en LOCAL_MODE",
    },
    adminOnly: {
      title: "Admin Only",
      description:
        "Sólo los administradores pueden acceder a las características de la máquina",
    },
    connectionNotFound: "Conexión no encontrada",
    sessionNotFound: "Período de sesiones no encontrado",
    fileNotFound: "Archivo no encontrado",
    directoryNotFound: "Directorio no encontrado",
    permissionDenied: "Permiso denegado",
    sshSecretKeyNotSet:
      "JWT_SECRET_KEY env var no se establece. Agregue un valor hex de 32 bytes para habilitar el modo SSH.",
    encryptionFailed: "Fallo de cifrado - JWT_SECRET_KEY puede ser inválido",
    noRowReturned: "No hay fila devuelta de la inserción",
    notImplemented: {
      test: "SSH backend not yet implemented. Aún no se pueden probar conexiones remotas.",
      local:
        "SSH backend not yet implemented. Deja connectionId vacío para correr localmente.",
      fileList:
        "SSH backend aún no se ha implementado para el listado de archivos",
      fileRead: "SSH backend aún no implementado para la lectura de archivos",
      fileWrite:
        "SSH backend aún no implementado para la escritura de archivos",
      session:
        "Sesiones SSH PTY aún no se han aplicado. Utilice ssh_exec_POST para comandos remotos.",
    },
    fingerprintMismatch:
      "La huella dactilar ha cambiado. Posible ataque MITM. Use acknowledgeNewFingerprint =true para proceder.",
    noDefaultConnection:
      "No se configura la conexión SSH predeterminada. Crear una conexión y establecerla como predeterminado.",
    sshConnectionFailed: "La conexión SSH falló",
    sshAuthFailed: "La autenticación SSH falló",
    connectTimeout: "Conexion timed out",
    invalidWorkingDir:
      "Directorio de trabajo inválido: debe ser el camino absoluto sin segmentos '.",
    invalidPath: "Camino inválido: debe ser absoluto sin segmentos '.",
    parentDirNotFound:
      "Directorio de parientes no encontrado. Establecer createDirs =verdad para crearlo.",
    commandTimedOut: "El comando timed out",
    cannotDeleteCurrentUser: "No se puede borrar el usuario del proceso actual",
    cannotDeleteSystemUser:
      "No se puede eliminar los usuarios del sistema (uid  ⁇  1000)",
    userNotFound: "Usuario no encontrado",
    userAlreadyExists: "El usuario ya existe",
    invalidUsername:
      "Nombre de usuario inválido: debe ser minúscula alfanumérico + hifeno, comenzando por una carta",
  },

  session: {
    read: {
      get: {
        title: "Read SSH Session Output",
        description: "Lea la salida amortiguada de una sesión SSH activa",
        fields: {
          sessionId: {
            label: "Período de sesiones ID",
            description: "ID de la sesión de SSH para leer desde",
          },
          waitMs: {
            label: "Espera (ms)",
            description: "Milliseconds para esperar la salida",
          },
          maxBytes: {
            label: "Max Bytes",
            description: "Máximo bytes para leer",
          },
        },
        response: {
          output: { title: "Producto" },
          eof: { title: "EOF" },
          status: { title: "Situación" },
        },
        success: {
          title: "Resultado del período de sesiones",
          description: "Producto del período de sesiones leído con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de lectura inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Falta para leer el producto del período de sesiones",
          },
          notFound: {
            title: "Sesión no encontrada",
            description: "Sesión SSH no encontrada",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    close: {
      post: {
        title: "Sesión SSH",
        description: "Cerrar una sesión de SSH activa",
        fields: {
          sessionId: {
            label: "Período de sesiones ID",
            description: "ID de la sesión de SSH para cerrar",
          },
        },
        response: {
          ok: { title: "Operación completada" },
        },
        success: {
          title: "Período cerrado",
          description: "Sesión SSH cerrada con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de cierre de sesión inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Fallado en el período de sesiones cercano",
          },
          notFound: {
            title: "Sesión no encontrada",
            description: "Sesión SSH no encontrada",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    write: {
      post: {
        title: "Escribir a SSH Sesión",
        description: "Escribe tu opinión sobre una sesión activa de SSH",
        fields: {
          sessionId: {
            label: "Período de sesiones ID",
            description: "ID de la sesión de SSH para escribir a",
          },
          input: {
            label: "Input",
            description:
              "Texto del documento para enviar al período de sesiones",
          },
          raw: {
            label: "Raw",
            description: "Enviar entrada como bytes crudos sin nueva línea",
          },
        },
        response: {
          ok: { title: "Operación completada" },
        },
        success: {
          title: "Input sent",
          description: "Entrada escrita al período de sesiones con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de escritura inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Falló en escribir al período de sesiones",
          },
          notFound: {
            title: "Sesión no encontrada",
            description: "Sesión SSH no encontrada",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    open: {
      post: {
        title: "Sesión abierta SSH",
        description: "Abrir una sesión terminal interactiva SSH",
        fields: {
          connectionId: {
            label: "Conexión ID",
            description: "ID de la conexión SSH al uso",
          },
          name: {
            label: "Nombre del período de sesiones",
            description: "Nombre facultativo del período de sesiones",
          },
          cols: {
            label: "Columnas",
            description: "Ancho terminal en columnas",
          },
          rows: {
            label: "Rows",
            description: "Altura terminal en filas",
          },
        },
        disconnected: "Desconectado",
        response: {
          sessionId: { title: "Período de sesiones ID" },
          status: { title: "Situación" },
          shell: { title: "Shell" },
        },
        success: {
          title: "Período de sesiones abierto",
          description: "Sesión de SSH se abrió con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros del período de sesiones inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Failed to open session",
          },
          notFound: {
            title: "Conexión no encontrada",
            description: "Conexión SSH no encontrada",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
  },

  terminal: {
    get: {
      title: "SSH Terminal",
      description: "widget terminal SSH interactivo",
      response: {
        ok: { title: "Terminales" },
      },
      success: {
        title: "Terminal listo",
        description: "El terminal SSH está listo",
      },
      errors: {
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        server: {
          title: "Error del servidor",
          description: "Error de terminal",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Se detectaron cambios no observados",
        },
        notFound: {
          title: "No encontrado",
          description: "No se encontró el recurso",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
        validation: {
          title: "Error de validación",
          description: "Falló la validación",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "Lea el archivo remoto",
        description: "Lea el contenido de un archivo vía SSH",
        fields: {
          connectionId: {
            label: "Conexión ID",
            description: "Conexión SSH al uso",
            placeholder: "uuid",
          },
          path: {
            label: "Sendero de archivo",
            description: "Camino absoluto al archivo",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "Max Bytes",
            description: "Máximo bytes para leer",
            placeholder: "102400",
          },
          offset: {
            label: "Offset",
            description: "offset para empezar a leer desde",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "Contenido" },
          size: { title: "Tamaño" },
          truncated: { title: "Truncado" },
          encoding: { title: "Codificación" },
        },
        success: {
          title: "Archivo leído",
          description: "Contenido del archivo recuperado con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de lectura inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Fallado para leer el archivo",
          },
          notFound: {
            title: "El archivo no se encontró",
            description: "Archivo o conexión no encontradas",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    list: {
      get: {
        title: "Lista de archivos remotos",
        description: "Lista de archivos en un directorio remoto vía SSH",
        fields: {
          connectionId: {
            label: "Conexión ID",
            description: "Conexión SSH al uso",
            placeholder: "uuid",
          },
          path: {
            label: "Directorio de caminos",
            description: "Camino absoluto al directorio",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "Entradas" },
          currentPath: { title: "Sendero actual" },
        },
        success: {
          title: "Directorio listado",
          description: "Contenido del directorio recuperado con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de lista inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Failed to list directory",
          },
          notFound: {
            title: "No encontrado",
            description: "Directorio o conexión no encontrada",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    write: {
      post: {
        title: "Escriba el archivo remoto",
        description: "Escriba contenido a un archivo vía SSH",
        fields: {
          connectionId: {
            label: "Conexión ID",
            description: "Conexión SSH al uso",
            placeholder: "uuid",
          },
          path: {
            label: "Sendero de archivo",
            description: "Camino absoluto para escribir",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "Contenido",
            description: "Contenido para escribir al archivo",
            placeholder: "contenidos de archivo",
          },
          createDirs: {
            label: "Crear Dirs",
            description: "Crear directorios padres si no existen",
          },
        },
        response: {
          ok: { title: "Operación completada" },
          bytesWritten: { title: "Bytes Escrito por" },
        },
        success: {
          title: "Archivo escrito",
          description: "Archivo escrito con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de escritura de archivos inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Failed to write file",
          },
          notFound: {
            title: "No encontrado",
            description: "Camino o conexión no encontradas",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "Lista de Usuarios Linux",
          description:
            "Lista usuarios de Linux en un servidor remoto a través de SSH",
          response: {
            users: { title: "Usuarios" },
          },
          success: {
            title: "Usuarios listados",
            description: "Usuarios de Linux recuperados con éxito",
          },
          errors: {
            validation: {
              title: "Error de validación",
              description: "Falló la validación",
            },
            unauthorized: {
              title: "Se requiere autenticación",
              description: "Inicia sesión para continuar",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "Acceso denegado",
            },
            server: {
              title: "Error del servidor",
              description: "Failed to list users",
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
              description: "Se detectaron cambios no observados",
            },
            conflict: {
              title: "Conflicto",
              description: "Se produjo un conflicto",
            },
            network: {
              title: "Error de red",
              description: "Ocurrió un error de red",
            },
          },
        },
      },
      username: {
        delete: {
          title: "Eliminar el usuario de Linux",
          description:
            "Eliminar un usuario de Linux desde un servidor remoto a través de SSH",
          fields: {
            removeHome: {
              label: "Retire el hogar",
              description:
                "También eliminar el directorio de inicio del usuario",
            },
          },
          response: {
            ok: { title: "Operación completada" },
          },
          success: {
            title: "Usuario eliminado",
            description: "Usuario de Linux eliminado con éxito",
          },
          errors: {
            validation: {
              title: "Error de validación",
              description: "Falló la validación",
            },
            unauthorized: {
              title: "Se requiere autenticación",
              description: "Inicia sesión para continuar",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "Acceso denegado",
            },
            server: {
              title: "Error del servidor",
              description: "Fallado para borrar usuario",
            },
            notFound: {
              title: "Usuario No encontrado",
              description: "Usuario Linux no encontrado",
            },
            unknown: {
              title: "Error desconocido",
              description: "Ocurrió un error inesperado",
            },
            unsavedChanges: {
              title: "Cambios sin guardar",
              description: "Se detectaron cambios no observados",
            },
            conflict: {
              title: "Conflicto",
              description: "Se produjo un conflicto",
            },
            network: {
              title: "Error de red",
              description: "Ocurrió un error de red",
            },
          },
        },
      },
      create: {
        post: {
          title: "Crear usuario de Linux",
          description:
            "Crear un usuario Linux en un servidor remoto a través de SSH",
          fields: {
            username: {
              label: "Nombre de usuario",
              description: "Nombre de usuario para la nueva cuenta",
              placeholder: "deploy",
            },
            groups: {
              label: "Grupos",
              description: "Grupos adicionales para añadir al usuario",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "Shell",
              description: "Concha de inicio de sesión para el usuario",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "Inicio Directorio",
              description: "Camino del directorio principal",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Sudo Access",
              description: "Acceso de Grant sudo al usuario",
            },
          },
          response: {
            ok: { title: "Operación completada" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "Inicio Directorio" },
            shell: { title: "Shell" },
          },
          success: {
            title: "Usuario creado",
            description: "Usuario Linux creado con éxito",
          },
          errors: {
            validation: {
              title: "Error de validación",
              description: "Falló la validación",
            },
            unauthorized: {
              title: "Se requiere autenticación",
              description: "Inicia sesión para continuar",
            },
            forbidden: {
              title: "Acceso denegado",
              description: "Acceso denegado",
            },
            server: {
              title: "Error del servidor",
              description: "Failed to create user",
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
              description: "Se detectaron cambios no observados",
            },
            conflict: {
              title: "Conflicto",
              description: "Se produjo un conflicto",
            },
            network: {
              title: "Error de red",
              description: "Ocurrió un error de red",
            },
          },
        },
      },
    },
  },

  exec: {
    post: {
      title: "Ejecute el comando SSH",
      description: "Ejecute un comando en un servidor remoto a través de SSH",
      fields: {
        connectionId: {
          label: "Conexión ID",
          description: "Conexión SSH al uso",
          placeholder: "uuid",
        },
        command: {
          label: "Comando",
          description: "Comando para ejecutar",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "Working Directory",
          description: "Directorio de trabajo para el comando",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "Hora de salida (ms)",
          description: "Tiempo de salida del comando en milisegundos",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Stdout" },
        stderr: { title: "Stderr" },
        exitCode: { title: "Código de salida" },
        status: { title: "Situación" },
        durationMs: { title: "Duración ms)" },
        backend: { title: "Backend" },
        truncated: { title: "Truncado" },
      },
      success: {
        title: "Comando ejecutado",
        description: "Mando ejecutado con éxito",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Parámetros de comando inválidos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
        server: {
          title: "Error del servidor",
          description: "La ejecución del comando falló",
        },
        notFound: {
          title: "Conexión no encontrada",
          description: "Conexión SSH no encontrada",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Se detectaron cambios no observados",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
        network: {
          title: "Error de red",
          description: "Ocurrió un error de red",
        },
      },
    },
  },

  connections: {
    id: {
      get: {
        title: "Obtener conexión SSH",
        description: "Obtener detalles de una conexión SSH",
        response: {
          id: { title: "ID" },
          label: { title: "Label" },
          host: { title: "Host" },
          port: { title: "Port" },
          username: { title: "Nombre de usuario" },
          authType: { title: "Tipo de Auth" },
          isDefault: { title: "Es Default" },
          fingerprint: { title: "Huella" },
          notes: { title: "Notas" },
          createdAt: { title: "Creado en" },
        },
        success: {
          title: "Conexión encontrada",
          description: "Conexión SSH recuperada con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Falló la validación",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Fallado para conseguir conexión",
          },
          notFound: {
            title: "Conexión no encontrada",
            description: "Conexión SSH no encontrada",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    list: {
      get: {
        title: "Lista de conexiones SSH",
        description: "Listar todas las conexiones SSH",
        response: {
          connections: { title: "Conexiones" },
        },
        success: {
          title: "Conexión listada",
          description: "SSH conexiones recuperadas con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Falló la validación",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
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
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    create: {
      post: {
        title: "Crear conexión SSH",
        description: "Crear una nueva conexión SSH",
        fields: {
          label: {
            label: "Label",
            description: "Nombre amistoso para la conexión",
            placeholder: "prod-web-01",
          },
          host: {
            label: "Host",
            description: "SSH servidor hostname o IP",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "Port",
            description: "Puerto servidor SSH",
            placeholder: "22",
          },
          username: {
            label: "Nombre de usuario",
            description: "Nombre de usuario SSH",
            placeholder: "deploy",
          },
          authType: {
            label: "Tipo de Auth",
            description: "Método de autenticación",
          },
          secret: {
            label: "Secret",
            description: "Contraseña o clave privada",
          },
          passphrase: {
            label: "Passphrase",
            description: "Frases de clave privada (si procede)",
          },
          isDefault: {
            label: "Predeterminado",
            description: "Establecer como conexión predeterminada",
          },
          clusterRole: {
            label: "Función del grupo de expertos",
            description: "Función de este servidor en el clúster k8s",
          },
          notes: {
            label: "Notas",
            description: "Notas opcionales sobre esta conexión",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "Conexión creada",
          description: "Conexión SSH creada con éxito",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de conexión inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Failed to create connection",
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
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
    test: {
      post: {
        title: "Prueba SSH Connection",
        description: "Prueba una conexión SSH",
        fields: {
          connectionId: {
            label: "Conexión ID",
            description: "ID de la conexión SSH para probar",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "Reconocimiento de la huella dactilar",
            description: "Reconocimiento de la nueva huella de host",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "Operación completada" },
          latencyMs: { title: "Latency (ms)" },
          fingerprint: { title: "Huella" },
          fingerprintChanged: { title: "Cambio de huella dactilar" },
        },
        success: {
          title: "Conexión exitosa",
          description: "Prueba de conexión SSH aprobada",
        },
        errors: {
          validation: {
            title: "Error de validación",
            description: "Parámetros de prueba inválidos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description: "Inicia sesión para continuar",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado",
          },
          server: {
            title: "Error del servidor",
            description: "Prueba de conexión falló",
          },
          notFound: {
            title: "Conexión no encontrada",
            description: "Conexión SSH no encontrada",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado",
          },
          unsavedChanges: {
            title: "Cambios sin guardar",
            description: "Se detectaron cambios no observados",
          },
          conflict: {
            title: "Conflicto",
            description: "Se produjo un conflicto",
          },
          network: {
            title: "Error de red",
            description: "Ocurrió un error de red",
          },
        },
      },
    },
  },
};
