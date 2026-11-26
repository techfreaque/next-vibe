import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  executeTool: {
    post: {
      title: "Ejecutar la herramienta",
      titleShort: "Ejecutar la herramienta",
      dynamicTitle: "Ejecutar: {{toolName}}",
      description:
        "Ejecute cualquier punto final registrado por nombre. Pase el nombre de la herramienta y sus parámetros de entrada. La ruta de destino impone su propia autenticación - este punto final es un operador universal para MCP, agentes AI y automatización.",
      container: {
        title: "Ejecución de la herramienta",
        description: "Nombre de ruta y parámetros de entrada",
      },
      fields: {
        toolName: {
          label: "Nombre de la herramienta",
          description:
            "El nombre de la herramienta registrada o alias a ejecutar (por ejemplo, ' vibe_agent_skills_GET'). Utilice la herramienta de ayuda para descubrir las herramientas disponibles.",
          placeholder: "vibe_agent_skills_GET",
        },
        input: {
          label: "Input",
          description:
            "Parámetros de entrada para la herramienta como objeto JSON. Los params de ruta URL (por ejemplo id) se extraen automáticamente de este objeto.",
        },
        instanceId: {
          label: "Instance ID",
          description:
            'Opcional instancia remota ID. Cuando se establece, crea una tarea asinc en la instancia remota en lugar de ejecutar localmente. Resultado será { taskId, estado: "pendiendo"}.',
        },
        callbackMode: {
          label: "Modo de llamada",
          description:
            '"esperar": ejecutar sincrónicamente, el resultado de retorno inline (default). "Desprender": fuego y olvido, devuelve {taskId} inmediatamente - utilizar await-task más tarde si es necesario. "wakeUp": fuego-y-olvidado, el resultado se inyecta automáticamente en el hilo cuando está listo - hacer NOT "Llama a espera-tarea."endLoop": ejecutar normalmente y devolver el resultado, pero detener el bucle de herramientas después de este lote - ninguna herramienta más llama este turno (llamadas de hermanos paralelos en el mismo lote todavía corren). "aprobar": requieren confirmación del usuario antes de ejecutar.',
        },
      },
      response: {
        result:
          "Los datos de resultados devueltos por la ruta de destino. Al fracaso este campo está ausente - la respuesta en sí será un error.",
        resultLabel: "Resultado",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "toolName o parámetros de entrada son inválidos",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Autenticación requerida para llamar a este punto final",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        toolDeniedHere: {
          title:
            "{{toolName}} no está disponible en este hilo. Llame las herramientas en su lista de herramientas directamente.",
        },
        emptyInput: {
          title:
            '{{error}} Su llamada no tenía el campo input. Ponga los argumentos de {{toolName}} dentro de input: {"toolName": "{{toolName}}", "input": { ... }}.',
        },
        notFound: {
          title: "Herramienta no encontrada",
          description:
            "Ninguna herramienta registrada coincide con el toolName dado",
          // `title` is the definition's declared NOT_FOUND label and renders
          // param-free there, so the tool name gets its own key.
          detail:
            'Herramienta " {{toolName}}" no encontrada. No vuelva a iniciar esta llamada. compruebe las herramientas disponibles con ayuda de herramientas.',
        },
        remoteFailed: {
          title: "Herramienta remota falló: {{message}}",
          description: "La instancia remota rechazó o fracasó la llamada",
          detail: 'Herramienta remota " {{toolName}}" falló: {{message}}',
        },
        resultChannelLost: {
          detail:
            'No hay ningún servidor local en {{hubUrl}} para recibir el resultado de "{{toolName}}" desde {{instanceId}} ({{detail}}). Inícialo primero (`vibe dev`, o `vibe --hermes dev` para Hermes) y vuelve a intentarlo.',
        },
        server: {
          title: "Error de ejecución",
          description: "La ruta de destino encontró un error del servidor",
        },
        network: {
          title: "Error de red",
          description: "Error de red durante la ejecución de herramientas",
        },
        unknown: {
          // `title` is a declared errorTypes label and renders param-free, so
          // the cause lives in `detail` instead.
          title: "Error desconocido",
          description: "Un error inesperado ocurrió durante la ejecución",
          detail: "Error desconocido durante la ejecución: {{error}}",
        },
      },
      success: {
        title: "Instrumento ejecutado",
        description: "La herramienta se ejecutó con éxito",
      },
      widget: {
        enterToolName:
          "Introduzca un nombre de herramienta para cargar su forma.",
        resolving: "Resolver el punto final...",
        unknownTool: "Herramienta desconocida: {{toolName}}",
      },
      actions: {
        confirm: "Confirmar",
        cancel: "Cancelar",
      },
    },
  },
  dismissTask: {
    post: {
      title: "Dismiss Task",
      titleShort: "Sueldo",
      description:
        "Cancela un avivamiento wakeUp pendiente. La herramienta sigue funcionando en el fondo, pero el hilo desbloquea inmediatamente. El resultado se descarta silenciosamente cuando la herramienta se completa.",
      errors: {
        validation: {
          title: "Error de validación",
          description: "callId es necesario",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Acceso denegado",
        },
        notFound: {
          title: "No encontrado",
          description: "No hay ninguna llamada pendiente para este callId",
        },
        server: {
          title: "Error del servidor",
          description: "No ha podido desestimar la llamada pendiente",
        },
        network: {
          title: "Error de red",
          description: "Error de red al despedir la tarea",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
      },
      success: {
        title: "Tareas desestimadas",
        description:
          "El pan se desbloqueó. La herramienta continúa en el fondo.",
      },
    },
  },
  cancelTool: {
    post: {
      title: "Cancelar la llamada de herramienta",
      titleShort: "Cancelar herramienta",
      description:
        "Interrumpe una sola llamada de herramienta en vuelo por su callId mientras sigue funcionando. La llamada detiene y devuelve un error como resultado; el turno y cualquier tipo de llamadas de herramientas paralelas siguen funcionando.",
      errors: {
        validation: {
          title: "Error de validación",
          description: "callId es necesario",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
        notFound: {
          title: "No encontrado",
          description: "No hay llamada en vuelo para este callId",
        },
        server: {
          title: "Error del servidor",
          description: "Fallado para cancelar la llamada de la herramienta",
        },
        network: {
          title: "Error de red",
          description: "Error de red al cancelar",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
      },
      success: {
        title: "Llamada de herramienta cancelada",
        description:
          "Se interrumpió la llamada de la herramienta de ejecución.",
      },
    },
  },
  detachCall: {
    post: {
      title: "Detach Tool llamada",
      titleShort: "Detach Call",
      description:
        "Actualizar una llamada de herramienta que sigue funcionando para desprender por su callId : sigue funcionando en el fondo, su resultado es descartado, y el giro está desbloqueado ahora. Utilice el currículum-cuando se hace en lugar si necesita el resultado.",
      errors: {
        validation: {
          title: "Error de validación",
          description: "callId es necesario",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
        notFound: {
          title: "No encontrado",
          description: "No hay llamada en vuelo para este callId",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to detach the tool call",
        },
        network: {
          title: "Error de red",
          description: "Error de red mientras se separa",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
      },
      success: {
        title: "Herramienta llamada desprendido",
        description:
          "La llamada continúa en el fondo; su resultado es descartado.",
      },
    },
  },
  resumeWhenDone: {
    post: {
      title: "Mover herramienta llamada a la base",
      titleShort: "Herramienta de fondo",
      description:
        "Deje que una llamada de herramienta todavía funcionando termine en el fondo por su callId. El giro termina y el hilo revive con el resultado cuando el trabajo se completa.",
      errors: {
        validation: {
          title: "Error de validación",
          description: "callId es necesario",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Inicia sesión para continuar",
        },
        forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
        notFound: {
          title: "No encontrado",
          description: "No hay llamada en vuelo para este callId",
        },
        server: {
          title: "Error del servidor",
          description: "Failed to background the tool call",
        },
        network: {
          title: "Error de red",
          description: "Error de red mientras se basa",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
      },
      success: {
        title: "Herramienta llamada Antecedentes",
        description: "La llamada continúa en el fondo.",
      },
    },
  },
  tools: {
    // Translations moved to system/help/get - see system/help/i18n/en/index.ts
    get: {
      title: "Ayuda de herramienta - Descubra las herramientas disponibles",
      description:
        "Busque y descubra todas las herramientas AI disponibles para usted. Utilice la consulta para buscar por nombre, descripción o alias. Utilice la categoría para filtrar por categoría de herramientas. Devuelve nombres de herramientas, descripciones, alias y metadatos.",
      category: "Herramientas AI",
      tags: {
        tools: "herramientas",
      },
    },
  },
  executor: {
    errors: {
      toolNotFound: "Herramienta no encontrada: {{toolName}}",
      parameterValidationFailed: "Validación del parámetro falló: {{errors}}",
      executionFailed: "La ejecución de la herramienta falló",
    },
  },
  factory: {
    errors: {
      executionFailed: "La ejecución de la herramienta falló",
    },
    descriptions: {
      noParametersRequired: "No se requieren parámetros para este punto final",
    },
  },
  converter: {
    constants: {
      examplePrefix: "\n\nEjemplo: ",
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
      space: " ",
      endpointForPrefix: "Endpoint for ",
      hiddenPlaceholder: "[hidden]",
    },
  },
  discovery: {
    constants: {
      underscore: "_",
      dollarOne: "$1",
      dollarTwo: "$2",
    },
  },
  registry: {
    errors: {
      initializationFailed:
        "No se ha logrado la inicialización del registro de herramientas",
    },
  },
};
