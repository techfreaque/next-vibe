import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  capture: {
    title: "Marco interactivo de captura",
    titleShort: "Marco de captura",
    description:
      "Lea el marco actual emitido desde una sesión interactiva de vibe en funcionamiento",
    form: {
      fields: {
        pid: {
          label: "Período de sesiones PID",
          description:
            "PID de la sesión interactiva. Auto-detectado cuando omitido.",
        },
      },
    },
    response: {
      fields: {
        content: "Índice",
        logs: "Registros de errores",
        pid: "Período de sesiones PID",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No Período de sesiones",
        description: "No se ha encontrado ninguna sesión interactiva activa",
        noSession:
          "No hay sesión interactiva. Comience uno con: vibe <alias> -i --agent-control",
        deadSession: "La sesión PID {{pid}} ya no está funcionando.",
        frameNotFound:
          "Todavía no se ha presentado un marco para la sesión {{pid}}. Dale un momento y vuelve a entrar.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      conflict: {
        title: "Conflicto",
        description: "Período de sesiones de conflicto",
      },
    },
    success: {
      title: "Frame Captured",
      description: "Marco actual recuperado con éxito",
    },
  },
  sendKeys: {
    title: "Enviar claves a sesión interactiva",
    titleShort: "Enviar claves",
    description:
      "Inyecte pulsaciones en una sesión interactiva de vibración y devuelve el marco actualizado",
    form: {
      fields: {
        keys: {
          label: "Claves",
          description:
            "Clave para enviar: Entrar, Tab, Escape, Up, Down, Left, Right, Backspace, Space o texto literal",
        },
        pid: {
          label: "Período de sesiones PID",
          description:
            "PID de la sesión interactiva. Auto-detectado cuando omitido.",
        },
        waitMs: {
          label: "Espera (ms)",
          description:
            "Milliseconds para esperar después de inyectar llaves antes de leer el marco. Por defecto 500.",
        },
      },
    },
    response: {
      fields: {
        content: "Índice",
        logs: "Registros de errores",
        pid: "Período de sesiones PID",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No Período de sesiones",
        description: "No se ha encontrado ninguna sesión interactiva activa",
        noSession:
          "No hay sesión interactiva. Comience uno con: vibe <alias> -i --agent-control",
        deadSession: "La sesión PID {{pid}} ya no está funcionando.",
        keysNotFound:
          "Sesión {{pid}} no está aceptando claves todavía. Dale un momento y vuelve a entrar.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      conflict: {
        title: "Conflicto",
        description: "Período de sesiones de conflicto",
      },
    },
    success: {
      title: "Llaves enviadas",
      description: "Keystrokes enviado y fotograma actualizado",
    },
  },
};
