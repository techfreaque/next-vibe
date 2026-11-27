import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "Inactivo",
  running: "En ejecución",
  completed: "Completado",
  interrupted: "Interrumpido",
  failed: "Fallido",
  "read-only": "Solo lectura",
  "workspace-write": "Escritura en el espacio de trabajo",
  "danger-full-access": "Acceso completo",
  codingAgent: {
    tags: {
      tasks: "Tareas",
    },
    run: {
      post: {
        title: "Ejecutar agente de programación",
        titleShort: "Agente de programación",
        dynamicTitle: "Agente de programación: {{prompt}}",
        description:
          "Ejecuta una tarea con Claude Code, OpenCode, Codex o Antigravity. Indica un nombre para guardar y retomar conversaciones con dirección en vivo, o activa interactiveMode=true para abrir una terminal.",
        fields: {
          name: {
            label: "Nombre del agente",
            description:
              "Nombre persistente opcional (entre 1 y 40 letras, números, guiones o guiones bajos). Reutilizar el nombre retoma la conversación.",
          },
          prompt: {
            label: "Tarea",
            description:
              "La tarea o pregunta para el agente de programación. Incluye rutas de archivos, contexto y verificaciones esperadas.",
          },
          promptFile: {
            label: "Archivo de tarea",
            description:
              "Ruta de un archivo con el brief relativa al directorio actual. Alternativa al texto directo.",
          },
          provider: {
            label: "Proveedor",
            description:
              "CLI a usar: claude-code, open-code, codex o antigravity. Por defecto codex para nuevos agentes con nombre y claude-code para ejecuciones sin nombre.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "Modelo",
            description:
              "Identificador de modelo del proveedor. Déjalo vacío para usar el valor por defecto (Antigravity usa Gemini 4 Neon High; Codex usa gpt-6.2-sol).",
          },
          effort: {
            label: "Esfuerzo de razonamiento",
            description:
              "Nivel de razonamiento para Codex o Antigravity (p. ej. low, medium, high).",
          },
          sandbox: {
            label: "Entorno aislado de Codex",
            description:
              "Aislamiento de archivos para Codex (read-only, workspace-write o danger-full-access).",
          },
          cwd: {
            label: "Directorio de trabajo",
            description:
              "Directorio donde trabaja el agente. Por defecto el directorio actual.",
          },
          fresh: {
            label: "Empezar de cero",
            description:
              "Inicia una conversación nueva en lugar de retomar el hilo guardado para este nombre.",
          },
          taskTitle: {
            label: "Título de la tarea",
            description:
              "Título corto para archivar esta tarea. Se genera a partir del prompt si se omite.",
          },
          interactiveMode: {
            label: "Modo interactivo",
            description:
              "false (POR DEFECTO): se ejecuta sin interfaz y devuelve la salida. true: abre una ventana de terminal en vivo y entrega el resultado al terminar.",
          },
          output: {
            label: "Salida",
            description:
              "Respuesta final o stdout combinado del agente. Vacío si la tarea continúa en segundo plano.",
          },
          durationMs: {
            label: "Duración (ms)",
            description: "Tiempo total de ejecución del proceso.",
          },
          threadId: {
            label: "ID de conversación",
            description:
              "Identificador guardado del hilo o sesión para retomar un agente con nombre.",
          },
          status: {
            label: "Estado",
            description: "Resultado del turno del agente persistente.",
          },
          taskId: {
            label: "ID de tarea",
            description:
              "En modo interactivo: ID de seguimiento de la tarea. El resultado llega automáticamente.",
          },
          hint: {
            label: "Indicación",
            description:
              "Indicación para la IA sobre cómo se entregará el resultado.",
          },
        },
        errors: {
          validation: {
            title: "Error de validación",
            description:
              "Parámetros no válidos. Revisa el nombre, la tarea y las opciones.",
          },
          unauthorized: {
            title: "No autorizado",
            description:
              "Inicio de sesión requerido. Se necesita rol de administrador o sesión CLI.",
          },
          internal: {
            title: "Ejecución fallida",
            description:
              "El proceso del agente no pudo iniciarse o falló de forma inesperada.",
          },
          binaryMissing: {
            title:
              "{{bin}} no está instalado en esta instancia. Instálalo o elige otro proveedor.",
            description:
              "No se encontró el binario CLI del agente en el PATH de este servidor.",
          },
          internalExitCode: {
            title: "Ejecución fallida (código {{exitCode}})",
            description:
              "El proceso del agente terminó con un código de salida distinto de cero.",
          },
          forbidden: {
            title: "Acceso denegado",
            description:
              "Permisos insuficientes. Revisa los permisos del proveedor.",
          },
          notFound: {
            title: "No encontrado",
            description:
              "No se encontró el agente, el archivo de tarea o el directorio de trabajo.",
          },
          vibeCoderRedirect: {
            title: "Usa ai-run con vibe-coder en su lugar",
            description:
              "El agente de programación está configurado como vibe-coder. Usa la herramienta ai-run con la skill vibe-coder.",
          },
          network: {
            title: "Error de red",
            description:
              "El proveedor o el agente no está disponible en este momento.",
          },
          unknown: {
            title: "Error desconocido",
            description: "Ocurrió un error inesperado durante la ejecución.",
          },
          unsaved: {
            title: "Cambios sin guardar",
            description: "Se detectó un conflicto con cambios sin guardar.",
          },
          conflict: {
            title: "Conflicto",
            description:
              "Otra sesión ya está activa con este nombre o la conversación guardada usa otro proveedor.",
          },
          detail: "La operación del agente falló: {{detail}}",
        },
        backButton: {
          label: "Atrás",
        },
        submitButton: {
          label: "Ejecutar",
          loadingText: "Ejecutando...",
        },
        success: {
          title: "Agente completado",
          description:
            "El agente terminó correctamente. Si la salida está vacía, el resultado llegará al hilo.",
        },
        widget: {
          runningBatch: "Ejecutando...",
          runningInteractive: "Abriendo sesión interactiva en terminal...",
          escalated:
            "En ejecución en segundo plano. El resultado llegará al terminar.",
          taskIdLabel: "ID de tarea",
          outputLabel: "Salida",
          interactiveSessionLaunched:
            "Sesión interactiva iniciada en terminal.",
          copyOutput: "Copiar",
          copied: "¡Copiado!",
          interactive: "Interactivo",
          emptyPromptHint:
            "Escribe una tarea abajo para ejecutar el agente de programación",
          agentNamePlaceholder: "Nombre del agente (opcional)",
        },
      },
    },
    say: {
      post: {
        title: "Dirigir agente de programación",
        titleShort: "Dirigir agente",
        description:
          "Envía un mensaje durante el turno a un agente Codex o Antigravity activo. Cuando termine el turno, usa el mismo nombre en coding-agent para continuar.",
        success: {
          title: "Mensaje entregado",
          description: "Mensaje enviado al agente en ejecución.",
        },
        fields: {
          message: {
            label: "Mensaje",
            description: "Instrucción para inyectar en el turno activo.",
          },
          messageFile: {
            label: "Archivo del mensaje",
            description:
              "Ruta de un archivo con el mensaje, relativa al directorio actual.",
          },
          delivered: {
            label: "Entregado",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "Interrumpir agente de programación",
        titleShort: "Interrumpir agente",
        description:
          "Detiene el turno actual de un agente Codex o Antigravity. Reutiliza su nombre más tarde para retomar la conversación.",
        success: {
          title: "Interrupción solicitada",
          description: "Señal de interrupción procesada para el agente.",
        },
        fields: {
          interrupted: {
            label: "Interrupción enviada",
          },
          noInterrupt: {
            label: "Sin turno activo",
          },
        },
      },
    },
    list: {
      post: {
        title: "Listar agentes de programación",
        titleShort: "Listar agentes",
        description:
          "Lista los agentes activos y guardados. Indica un nombre para ver su estado, registro reciente y última respuesta.",
        success: {
          title: "Agentes cargados",
          description: "Lista de agentes activos y guardados disponible.",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "Agentes",
          },
          noAgents: {
            label: "Todavía no hay agentes persistentes.",
          },
          lines: {
            label: "Líneas del registro",
            description:
              "Número de últimas líneas del registro a incluir al consultar un agente.",
          },
          tail: {
            label: "Entradas recientes",
          },
          emptyTail: {
            label: "El registro está vacío.",
          },
          lastMessage: {
            label: "Última respuesta",
          },
          lastError: {
            label: "Último error",
          },
          startedAt: {
            label: "Inicio",
          },
          finishedAt: {
            label: "Fin",
          },
        },
      },
    },
  },
};
