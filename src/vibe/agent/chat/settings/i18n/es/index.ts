// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../../models/i18n/es";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    settings: "Configuración",
  },
  voices: {
    MALE: "Voz masculina",
    FEMALE: "Voz femenina",
  },
  enums: {
    viewMode: {
      linear: "Lineal",
      threaded: "Por ramas",
      flat: "Plana",
      debug: "Depuración",
    },
    provider: {
      AUTO: "Automático",
      BRAVE: "Brave",
      KAGI: "Kagi",
    },
  },
  get: {
    title: "Configuración",
    titleShort: "Configuración del chat",
    description: "Consulta la configuración y las preferencias del chat.",
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para acceder a la configuración",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para acceder a este recurso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la configuración",
      },
      server: {
        title: "Error del servidor",
        description: "No se pudo cargar la configuración",
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
        title: "Conflicto",
        description: "La solicitud entra en conflicto con el estado actual",
      },
    },
    success: {
      title: "Operación completada",
      description: "Configuración cargada",
    },
  },
  post: {
    title: "Guardar configuración",
    titleShort: "Guardar configuración",
    description: "Actualiza la configuración y las preferencias del chat.",
    container: {
      title: "Configuración del chat",
    },
    selectedModel: {
      label: "Modelo seleccionado",
    },
    selectedSkill: {
      label: "Habilidad seleccionada",
    },
    activeFavoriteId: {
      label: "Favorito activo",
    },
    ttsAutoplay: {
      label: "Reproducción automática de voz",
    },
    viewMode: {
      label: "Modo de visualización",
    },
    contextMemory: {
      title: "Límite de memoria de la conversación",
      description:
        "Cuánto de la conversación conserva la IA antes de empezar a resumirla.",
      costNote: "Menos memoria, menor costo",
      costExplain:
        "Hasta cierto punto, reducir la memoria baja el costo por mensaje.",
      tooltipTitle: "Cuánto de la conversación conserva la IA",
      tooltipBody:
        "Cuando la conversación supera el límite, resumimos los mensajes más antiguos. La IA mantiene el hilo con menos tokens y tú pagas menos.",
      tooltipModelCap: "El modelo actual admite hasta {cap} tokens.",
      default: "predeterminado",
      tokens: "tokens",
      modelMax: "límite del modelo",
      resetToDefault: "Restablecer valor predeterminado ({value})",
      cheaper: "menor costo",
      moreMemory: "más memoria",
      barCheap: "Menor costo · menos memoria",
      barBalanced: "Equilibrio entre costo y memoria",
      barRich: "Más memoria · mayor costo",
      barMax: "Memoria máxima · costo más alto",
      tools: "Herramientas",
      toolsInherited: "heredadas",
    },
    searchProvider: {
      label: "Motor de búsqueda",
      description:
        "Elige tu motor de búsqueda preferido. El modo automático usa Brave si está configurado y Kagi en los demás casos.",
    },
    codingAgent: {
      label: "Agente de programación",
      description:
        "Elige qué CLI se inicia cuando la IA llama a la herramienta de programación. Solo los administradores pueden cambiarla.",
      options: {
        claudeCode: "Claude Code (predeterminado)",
        openCode: "OpenCode",
        nextVibeCoder: "Next Vibe Coder",
      },
    },
    dreaming: {
      title: "Dreaming",
      description:
        "Mientras duermes, la IA pone orden. Consolida recuerdos, organiza documentos y destaca lo importante.",
      toggle: {
        label: "Activar Dreaming",
      },
      schedule: {
        label: "Horario",
        options: {
          nightlyAt2: "Cada noche a las 2:00 a. m.",
          weekdaysAt2: "A las 2:00 a. m. de lunes a viernes",
          weekdaysAt8: "A las 8:00 a. m. de lunes a viernes",
          every6h: "Cada 6 horas",
          every12h: "Cada 12 horas",
        },
      },
      favoriteId: {
        label: "Favorito",
        defaultOption: "Predeterminado (Thea)",
      },
      prompt: {
        label: "Instrucciones de la sesión",
        placeholder:
          "¿En qué debe centrarse Thea en esta sesión? Déjalo vacío para usar las instrucciones predeterminadas.",
        defaultPrompt:
          "Inicia tu sesión de Dreaming. Reorganiza y consolida el cortex: recuerdos, documentos y conversaciones. Deja todo más ordenado.",
      },
      lastRun: "Última ejecución:",
      neverRun: "Sin ejecuciones",
      folderLink: "Abrir carpeta Dreams",
      sessionCost:
        "Por sesión: máximo {{steps}} pasos. Se detiene al superar {{cap}} créditos.",
      runNow: "Ejecutar ahora",
    },
    autopilot: {
      title: "Autopilot",
      description:
        "La IA trabaja mientras estás fuera. Retoma los siguientes pasos, avanza los proyectos y atiende las tareas pendientes.",
      toggle: {
        label: "Activar Autopilot",
      },
      schedule: {
        label: "Horario",
        options: {
          nightlyAt2: "Cada noche a las 2:00 a. m.",
          weekdaysAt2: "A las 2:00 a. m. de lunes a viernes",
          weekdaysAt8: "A las 8:00 a. m. de lunes a viernes",
          every6h: "Cada 6 horas",
          every12h: "Cada 12 horas",
        },
      },
      favoriteId: {
        label: "Favorito",
        defaultOption: "Predeterminado (Thea)",
      },
      prompt: {
        label: "Instrucciones de la sesión",
        placeholder:
          "¿En qué debe centrarse Hermes en esta sesión? Déjalo vacío para usar las instrucciones predeterminadas.",
        defaultPrompt:
          "Inicia tu sesión de Autopilot. Retoma los proyectos activos desde donde quedaron, avanza los siguientes pasos y atiende las tareas pendientes.",
      },
      lastRun: "Última ejecución:",
      neverRun: "Sin ejecuciones",
      folderLink: "Abrir carpeta Autopilot",
      sessionCost:
        "Por sesión: máximo {{steps}} pasos. Se detiene al superar {{cap}} créditos.",
      runNow: "Ejecutar ahora",
    },
    mama: {
      title: "Supervisión de la plataforma",
      description:
        "Thea supervisa la instancia de producción: revisa su estado, avanza funcionalidades, gestiona el marketing y envía novedades. Todos los administradores comparten una sola configuración.",
      toggle: {
        label: "Activar modo Mama",
      },
      schedule: {
        label: "Horario",
        options: {
          every4h: "Cada 4 horas",
          every6h: "Cada 6 horas",
          every12h: "Cada 12 horas",
          daily: "Todos los días a medianoche",
        },
      },
      prompt: {
        label: "Instrucciones de la sesión",
        placeholder:
          "¿En qué debe centrarse Thea? Déjalo vacío para usar las instrucciones predeterminadas.",
        defaultPrompt:
          "Inicia tu sesión de Mama. Revisa el estado de la plataforma y los registros de errores, avanza las funciones pendientes y redacta los anuncios necesarios. Deja un resumen en /documents/mama/log/.",
      },
      lastRun: "Última ejecución:",
      neverRun: "Sin ejecuciones",
      runNow: "Ejecutar ahora",
    },
    webPinnedTools: {
      label: "Herramientas fijadas en la barra lateral web",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Configuración no válida",
      },
      network: {
        title: "Error de red",
        description: "No se pudo guardar la configuración",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para actualizar la configuración",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para actualizar la configuración",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la configuración",
      },
      server: {
        title: "Error del servidor",
        description: "No se pudo guardar la configuración",
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
        title: "Conflicto",
        description: "Hay un conflicto en la configuración",
      },
    },
    success: {
      title: "Configuración guardada",
      description: "Guardamos tu configuración",
    },
  },
  patch: {
    chatModel: {
      label: "Modelo del chat",
      placeholder: "Predeterminado del sistema",
    },
  },
  models: { names: modelTranslations.names },
};
