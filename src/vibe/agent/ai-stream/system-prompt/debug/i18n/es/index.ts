import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "System Prompt Debug",
    titleShort: "Debug Prompt",
    description:
      "Muestra el sistema exacto que el AI se pone en un contexto dado. carpeta, habilidad, hilo, mensaje.",
    status: {
      loading: "Edificio...",
      done: "Listo",
    },
    tags: {
      debug: "Depuración",
    },
    fields: {
      rootFolderId: {
        label: "Root Folder",
        description:
          "Contexto de carpeta para simular (privado, público, incógnito, cron, compartido, remoto)",
        placeholder: "private",
        options: {
          private: "Privadas",
          shared: "Compartida",
          public: "Público",
          incognito: "Incognito",
          background: "Antecedentes",
          remote: "Remoto",
        },
      },
      userRole: {
        label: "Función del usuario",
        description:
          "Función de usuario simulada: público TEN cliente TENIDO admin",
        placeholder: "admin",
      },
      userMessage: {
        label: "Mensaje de usuario",
        description:
          "Mensaje de usuario simulado para la búsqueda de cortex embedding",
        placeholder: "¿Qué discutimos la última vez?",
      },
      threadId: {
        label: "Thread ID",
        description: "hilo opcional ID para contexto",
        placeholder: "uuid or leave blank",
      },
      userId: {
        label: "Usuario ID",
        description:
          "Usuario opcional ID para cargar datos de corteza para (defaults to self)",
        placeholder: "uuid or leave blank",
      },
      skillId: {
        label: "ID de la habilidad",
        description: "Capacidad opcional ID para inyectar en el sistema",
        placeholder: "habilidad uuid o dejar en blanco",
      },
      subFolderId: {
        label: "Subcarpeta ID",
        description: "Subcarpeta opcional UUID",
        placeholder: "uuid or leave blank",
      },
      imageGenModelSelection: {
        label: "Imagen Gen Selección",
        description:
          "Selección de modelos gen de imagen del favorito activo UI (dejar en blanco para utilizar el predeterminado del usuario)",
        placeholder: "dejar en blanco por defecto del usuario",
      },
      musicGenModelSelection: {
        label: "Music Gen Selection",
        description:
          "Selección del modelo de género musical de la UI activa favorita (dejar en blanco para utilizar el predeterminado del usuario)",
        placeholder: "dejar en blanco por defecto del usuario",
      },
      videoGenModelSelection: {
        label: "Selección de Video Gen",
        description:
          "Selección del modelo de género de vídeo de la UI activa favorita (dejar en blanco para utilizar el predeterminado del usuario)",
        placeholder: "dejar en blanco por defecto del usuario",
      },
    },
    response: {
      systemPrompt: { text: "Prompt del sistema" },
      trailingSystemMessage: { text: "Trailing Context" },
      charCount: { text: "Skills" },
      tokenEstimate: { text: "~Tokens" },
      cortexDiagnostics: { text: "Diagnósticos de Embedding Cortex" },
      messageContextLines: { text: "Líneas de Contexto Mensaje" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Comprueba tus params",
      },
      network: {
        title: "Sin conexión",
        description: "No puede llegar al servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión primero",
      },
      forbidden: {
        title: "Admin Only",
        description: "Requiere acceso de administración",
      },
      notFound: {
        title: "No encontrado",
        description: "Usuario o recurso no encontrado",
      },
      threadNotFound: {
        title: "El pan no se encuentra o no visible para usted",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para construir el impulso",
      },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "No salvos",
        description: "Guardar o descartar primero",
      },
      conflict: { title: "Conflicto", description: "Estado conflictivo" },
    },
    widget: {
      emptyTitle: "Escoge un contexto",
      emptyMessage:
        "Elija una carpeta, opcionalmente un mensaje, y luego construya el aviso.",
      chars: "Características",
      tokens: "~Tokens",
      cortexFailed:
        "Falló la incrustación de Cortex. ningún error de API o de proveedor.",
      cortexNoNodes:
        "Incrustación generada, pero no hay ganglios cortezales todavía tienen incrustaciones.",
      cortexPassing: "{{passing}} de los partidos de {{total}} pasan el umbral",
      noTrailing: "No hay contexto de seguimiento para esta solicitud.",
    },
    success: {
      title: "Prompt Built",
      description: "Inmediación del sistema con éxito",
    },
  },
};
