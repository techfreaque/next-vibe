import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Docker Operations",
  titleShort: "Docker DB",
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
      title: "La ejecución falló: {{error}}",
      description: "Docker falló la ejecución del comando",
    },
    composeDownFailed: {
      title: "Se compontó fallado: {{error}}",
      description: "Docker La operación de cierre falló",
    },
    composeUpFailed: {
      title: "Composición falló: {{error}}",
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
};
