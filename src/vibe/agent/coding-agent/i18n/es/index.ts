import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  codingAgent: {
    tags: {
      tasks: "Tareas",
    },
    run: {
      post: {
        title: "Corre Agente de Codificación",
        titleShort: "Agente de programación",
        dynamicTitle: "Agente de codificación: {{prompt}}",
        description:
          "Ejecute una tarea de agente de codificación. Modo de lote (DEFAULT): funciona sin cabeza y devuelve la salida. Modo interactivo: abre una sesión terminal en vivo - resultado se entrega automáticamente cuando termina la sesión.",
        fields: {
          prompt: {
            label: "Prompt",
            description:
              "La tarea o pregunta para enviar al agente de codificación. Sea específico - incluir las trayectorias de archivo, el contexto y el formato de salida esperado.",
          },
          provider: {
            label: "Proveedor",
            description:
              "Que agente de codificación CLI para usar. claude-code utiliza el Claude CLI ; código abierto utiliza el OpenCode CLI.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
            },
          },
          model: {
            label: "Modelo",
            description:
              "Modelo a utilizar. Para el código Claude: modelo ID (por ejemplo, claude-sonnet-4-6). Para OpenCode: proveedor/modelo (por ejemplo, antropía/claude-sonnet-4-6). Deja vacío por defecto.",
          },
          taskTitle: {
            label: "Título de la tarea",
            description:
              "Título corto para archivar esta tarea (p. ej. 'Insecto de inicio de sesión Fix'). Auto-generado desde el impulso si omitido.",
          },
          interactiveMode: {
            label: "Modo interactivo",
            description:
              "falso (DEFAULT): se ejecuta sin cabeza y devuelve toda la salida cuando se hace. verdadero: abre una ventana terminal para una sesión en vivo - resultado se entrega automáticamente cuando la sesión termina.",
          },
          output: {
            label: "Producto",
            description:
              "Estiércol combinado del proceso del agente de codificación. Empty when task was escalated to background execution (result injected via wakeUp).",
          },
          durationMs: {
            label: "Duración ms)",
            description: "Tiempo total de la pared corrió el proceso.",
          },
          taskId: {
            label: "Task ID",
            description:
              "Para modo interactivo: la tarea de seguimiento ID. El resultado se entrega automáticamente. Para el modo de lote: no está presente (resultar devuelto en línea).",
          },
          hint: {
            label: "Hint",
            description:
              "Orientación para el AI sobre cómo se entregará el resultado.",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description:
              "Parámetros de solicitud inválidos - check prompt y campos",
          },
          unauthorized: {
            title: "Se requiere autenticación",
            description:
              "Autenticación requerida - función de administración necesaria",
          },
          internal: {
            title: "Ejecución fallada",
            description:
              "El proceso del agente de codificación no comenzó o se estrelló inesperadamente",
          },
          binaryMissing: {
            title:
              "{{bin}} no está instalado en este caso - instalarlo o elegir otro agente de codificación",
            description:
              "El agente de codificación CLI binario no se encontró en el PATH de este servidor",
          },
          internalExitCode: {
            title: "Ejecución fallida (exit {{exitCode}})",
            description:
              "Proceso de agente de codificación salió con un código de salida no cero",
          },
          forbidden: {
            title: "Acceso denegado",
            description: "Acceso denegado - insuficientes permisos",
          },
          notFound: {
            title: "No encontrado",
            description: "Directorio de recursos o de trabajo no encontrado",
          },
          vibeCoderRedirect: {
            title: "Usar ai-run con vibe-coder en su lugar",
            description:
              "El agente de codificación está listo para el vibe-coder. Utilice la herramienta de ai-run con la habilidad de vibe-coder.",
          },
          network: {
            title: "Error de red",
            description: "Error de red comunicando con agente de codificación",
          },
          unknown: {
            title: "Error desconocido",
            description: "Un error inesperado ocurrió durante la ejecución",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Cambios no salvos detectados",
          },
          conflict: {
            title: "Conflicto",
            description:
              "Conflicto de ejecución - otra sesión puede estar en marcha",
          },
        },
        backButton: {
          label: "Atrás",
        },
        submitButton: {
          label: "Enviar",
          loadingText: "Enviando...",
        },
        success: {
          title: "Agente de Coding completado",
          description:
            "El proceso del agente de codificación terminó con éxito. Si la salida está vacía, el resultado llegará a través de la inyección de hilo.",
        },
        widget: {
          runningBatch: "Corriendo...",
          runningInteractive: "Lanzamiento de sesión terminal interactiva...",
          escalated:
            "Correr en segundo plano - resultado será inyectado cuando esté completo.",
          taskIdLabel: "Task ID",
          outputLabel: "Producto",
          interactiveSessionLaunched: "Sesión interactiva lanzada en terminal.",
          copyOutput: "Copiar",
          copied: "¡Copiado!",
          interactive: "Interactivo",
          emptyPromptHint:
            "Ingrese un mensaje a continuación para ejecutar el agente de codificación",
        },
      },
    },
  },
};
