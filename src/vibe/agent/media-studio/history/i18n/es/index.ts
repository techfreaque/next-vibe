import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    studio: "Media Studio",
    history: "Historial",
  },
  get: {
    title: "Tus creaciones",
    titleShort: "Creaciones",
    description:
      "Imágenes, vídeos, música, voces y transcripciones creadas en el Studio, en el chat o con la API. Lo más reciente primero.",
    fields: {
      kind: {
        label: "Tipo",
        description:
          "image, video, music, speech o transcribe. Déjalo vacío para verlo todo.",
      },
    },
    response: {
      items: "Creaciones",
      id: "ID",
      kind: "Tipo",
      title: "Prompt",
      createdAt: "Creado",
      status: "Estado",
      url: "Archivo",
      transcript: "Transcripción",
      credits: "Créditos",
      model: "Modelo",
      settings: "Ajustes",
      source: "Creado en",
      threadId: "Chat",
      rootFolderId: "Carpeta",
    },
    success: {
      title: "Historial cargado",
      description: "Aquí están tus creaciones.",
    },
    errors: {
      validation: {
        title: "Filtro no válido",
        description: "Revisa el tipo y la página y vuelve a intentarlo.",
      },
      unauthorized: {
        title: "Sin sesión",
        description: "Inicia sesión para ver tus creaciones.",
      },
      forbidden: {
        title: "Sin acceso",
        description: "Solo puedes ver tus propias creaciones.",
      },
      notFound: {
        title: "Nada por aquí",
        description: "Ninguna creación coincide con este filtro.",
      },
      server: {
        title: "Historial no disponible",
        description:
          "No se pudo cargar tu historial. Inténtalo de nuevo en un momento.",
      },
      network: {
        title: "Conexión perdida",
        description: "Revisa tu conexión y vuelve a intentarlo.",
      },
      unknown: {
        title: "Algo salió mal",
        description: "No se pudo cargar tu historial. Inténtalo de nuevo.",
      },
      conflict: {
        title: "El historial cambió",
        description: "Recarga para ver los últimos resultados.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guarda o descarta tus cambios primero.",
      },
    },
  },
  widget: {
    title: "Tus creaciones",
    titles: {
      image: "Tus imágenes",
      video: "Tus vídeos",
      music: "Tus pistas",
      speech: "Tus locuciones",
      transcribe: "Tus transcripciones",
    },
    count: "{{count}} en total",
    error: "No se pudo cargar tu historial.",
    retry: "Actualizar",
    emptyTitle: "Aún no has creado nada",
    emptyHint: "Cada resultado llega aquí, listo para descargar.",
    emptyKindHint: "Tu primer resultado aparece aquí en cuanto esté listo.",
    runAgain: "Repetir",
    download: "Descargar",
    copyPrompt: "Copiar prompt",
    copied: "Copiado",
    copyFailed: "Copia bloqueada",
    openInChat: "Abrir en el chat",
    continueInChat: "Seguir en el chat",
    chatPrompt: "Esto es lo que he creado: {{url}}\n\nPrompt: {{prompt}}",
    open: "Abrir a tamaño completo",
    credits: "{{amount}} créditos",
    source: {
      studio: "desde el Studio",
      chat: "desde el chat",
      api: "por API",
    },
    status: {
      queued: "En cola",
      running: "Generando",
      saving: "Guardando archivo",
      completed: "Listo",
      failed: "Falló",
    },
    pendingHint: "El vídeo y la música pueden tardar unos minutos.",
    kinds: {
      image: "Imagen",
      video: "Vídeo",
      music: "Música",
      speech: "Voz",
      transcribe: "Transcripción",
    },
  },
};
