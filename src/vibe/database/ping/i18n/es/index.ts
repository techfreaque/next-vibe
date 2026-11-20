import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operaciones de base de datos",
  tag: "base de datos",
  post: {
    title: "Base de datos",
    titleShort: "DB Ping",
    description: "Comprobar la conectividad de bases de datos y la salud",
    form: {
      title: "Configuración de Ping",
      description: "Configurar parámetros de configuración de la base de datos",
    },
    response: {
      title: "Respuesta",
      description: "Datos sobre la respuesta a las preguntas",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description:
          "Autenticación necesaria para acceder a las operaciones de la base de datos",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud de ping inválidos",
      },
      server: {
        title: "Error del servidor",
        description:
          "Error del servidor interno ocurrió mientras se pintó la base de datos",
      },
      unknown: {
        title: "Error desconocido",
        description:
          "Se produjo un error desconocido durante el archivo de bases de datos",
      },
      network: {
        title: "Error de red",
        description:
          "Se produjo un error de red al conectarse a la base de datos",
        detail: "Falló el ping de base: {{error}}",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso prohibido - insuficientes permisos",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos de base no encontrados",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos ocurrido durante la operación",
      },
    },
    success: {
      title: "Base de datos Ping Successful",
      description: "Conexión exitosa a la base de datos",
    },
  },
  fields: {
    silent: {
      title: "Modo silencioso",
      description: "Correr ping sin mensajes de salida",
    },
    keepConnectionOpen: {
      title: "Mantener la conexión abierta",
      description: "Mantenga la conexión de base abierta después del ping",
    },
    success: {
      title: "Situación de éxito",
      content: "Operación completada",
    },
    isAccessible: {
      title: "Base de datos accesible",
      content: "Accesible",
    },
    output: {
      title: "Mensaje de salida",
      content: "Producto",
    },
    connectionInfo: {
      title: "Información de conexión",
      totalConnections: {
        content: "Total Connections",
      },
      idleConnections: {
        content: "Idle Connections",
      },
      waitingClients: {
        content: "Clientes que esperan",
      },
    },
  },
  status: {
    success: "Operación completada",
    failed: "Failed",
    timeout: "Hora de salir",
    error: "Error",
  },
  connectionType: {
    primary: "Primaria",
    replica: "Replicar",
    cache: "Cache",
  },
};
