import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operaciones de base de datos",

  dockerOperations: {
    title: "Docker Operations",
    description: "Ejecutar comandos Docker y gestionar contenedores",
    category: "Docker",
    tags: {
      docker: "Docker",
      utils: "Utilidades",
      dockeroperations: "Docker Operations",
    },
    container: {
      title: "Docker Operations",
      description: "Ejecute comandos Docker con el manejo correcto de errores",
    },
    fields: {
      command: {
        label: "Comando Docker",
        description: "El comando Docker para ejecutar",
        placeholder: "docker ps",
      },
      options: {
        label: "Opciones de ejecución",
        description: "Opciones de configuración para la ejecución del comando",
        placeholder: "Configurar opciones de tiempo y registro",
      },
    },
    response: {
      success: {
        label: "El éxito del comando",
      },
      output: {
        label: "Comando de salida",
      },
      error: {
        label: "Detalles del error",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de comando inválidos Docker",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para operaciones Docker",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Autorizaciones insuficientes para operaciones Docker",
      },
      internal: {
        title: "Error Docker",
        description: "Docker falló la ejecución del comando",
      },
      timeout: {
        title: "Hora de comandos",
        description: "El comando Docker superó el límite de tiempo",
      },
      executionFailed: {
        title: "Ejecución fallada",
        description: "Docker falló la ejecución del comando",
      },
      composeDownFailed: {
        title: "Compongamos que se desvanecieron",
        description: "Docker La operación de cierre falló",
      },
      composeUpFailed: {
        title: "Conformar a Failed",
        description: "Docker La operación de compostura falló",
      },
    },
    success: {
      title: "Docker Command Successful",
      description: "comando Docker ejecutado con éxito",
    },
    messages: {
      executingCommand: "Ejecución del comando Docker: {command}",
      timeoutError:
        "El comando Docker se ha programado después de ms {timeout}: {command}",
      commandFailed: "El comando Docker falló con el código {code} : {command}",
      executionFailed: "Fallado para ejecutar el comando Docker: {command}",
      commandError: "error de comando Docker: {error}",
    },
  },
  title: "Base de datos Utils",
  titleShort: "DB Utils",
  description: "Funciones de utilidad para las operaciones de bases de datos",
  tag: "utiles",
  includeDetails: {
    title: "Incluir detalles",
    description: "Incluir información detallada en la respuesta",
  },
  checkConnections: {
    title: "Control de conexiones",
    description: "Compruebe el estado de conexión de la base de datos",
  },
  status: {
    title: "Situación de salud",
  },
  timestamp: {
    title: "Timestamp",
  },
  connections: {
    title: "Estado de conexión",
    primary: "Conexión primaria",
    replica: "Replicar la conexión",
  },
  details: {
    title: "Datos de base",
    version: "Version",
    uptime: "Horas de actualización (segundos)",
    activeConnections: "Conexiones activos",
    maxConnections: "Max Connections",
  },
  errors: {
    health_check_failed: "El cheque de salud de base falló: {{error}}",
    connection_failed: "La conexión de base falló: {{error}}",
    stats_failed: "Failed to retrieve database statistics: {{error}}",
    docker_check_failed: "El cheque de disponibilidad Docker falló: {{error}}",
    reset_failed: "Operación de reajuste de bases de datos falló",
    manage_failed: "La operación de gestión de bases de datos falló",
    reset_operation_failed: "La operación de reasentamiento falló",
    validation: {
      title: "Error de validación",
      description: "Parámetros de utilidad de base de datos inválidos",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description:
        "Autenticación necesaria para los servicios de base de datos",
    },
    internal: {
      title: "Error interno",
      description: "La operación de utilidad de base de datos falló",
    },
  },
  success: {
    title: "Base de datos Utilidades",
    description:
      "Operaciones de utilidad de base de datos terminadas con éxito",
  },
  docker: {
    executing_command: "Ejecución del comando Docker: {{command}}",
    command_timeout:
      "El comando Docker se ha programado después de ms {{timeout}}: {{command}}",
    command_failed:
      "El comando Docker falló con el código {{code}} : {{command}}",
    execution_failed: "Fallado para ejecutar el comando Docker: {{command}}",
    command_error: "error de comando Docker: {{error}}",
    stopping_containers: "Parar contenedores Docker...",
    starting_containers: "Comenzando contenedores Docker...",
  },
};
