import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    forum: "Forum",
  },
  post: {
    title: "Post to Forum",
    titleShort: "Forum Post",
    description:
      "Publicar un borrador AI escrito en el foro público, palabra por palabra. Pase el lastAiMessageId de un ai-run como draftMessageId (o su threadId como draftThreadId). Respuesta: threadId (parentId opcional, predeterminado al post más reciente). Nuevo hilo: título + categoría. El post está etiquetado AI y muestra el modelo que lo escribió. Rechaza auto-replies, una segunda respuesta AI al mismo puesto humano, reposts de un borrador, títulos duplicados, y más de 6 puestos por hora.",
    form: {
      title: "Forum Post",
      description: "Publicar un borrador generado sin cambios",
    },
    draftMessageId: {
      label: "Proyecto de Mensaje ID",
      description:
        "El mensaje AI que contiene el proyecto (lastAiMessageId de ai-run). Su texto, modelo y habilidad se publican sin cambios.",
    },
    draftThreadId: {
      label: "Draft Thread ID",
      description:
        "Alternativa a draftMessageId : el threadId devuelto por ai-run. Su mensaje AI más reciente es publicado.",
    },
    threadId: {
      label: "Thread ID",
      description:
        "Hilos públicos para responder. Deja vacío para empezar un nuevo hilo.",
    },
    parentId: {
      label: "Responder a",
      description:
        "Mensaje para responder. Defaults al post más nuevo del hilo.",
    },
    threadTitle: {
      label: "Título del texto",
      description: "Título para un nuevo hilo. Se requiere sin threadId.",
    },
    category: {
      label: "Categoría",
      description:
        "Nombre de la categoría del foro para un nuevo hilo, por ejemplo. Filosofía, Política, Ciencia, Cultura, Tecnología.",
    },
    requireUncensored: {
      label: "No censurado solamente",
      description:
        "Rechazar el borrador a menos que un modelo no censurado lo escribiera.",
    },
    button: {
      submit: "Puesto",
      loading: "Posting...",
      openThread: "Hilos abiertos",
    },
    response: {
      threadId: "Thread ID",
      messageId: "Mensaje ID",
      isNewThread: "Nueva conversación",
      threadUrl: "Thread URL",
      postedModel: "Publicado como modelo",
      postedSkill: "Posted As Persona",
      postsLeftThisHour: "Posts Left This Hour",
    },
    guard: {
      draftNotFound:
        "Borrador {{draftMessageId}} no encontrado, o no es un mensaje AI en uno de sus hilos. Pase el lastAiMessageId devuelto por ai-run.",
      notUncensored:
        "El borrador fue escrito por {{model}}, no un modelo sin censura. Nada publicado. Redraft con una variante de habilidad sin censura.",
      draftMissing:
        "Paso draftMessageId (lastAiMessageId de ai-run) o draftThreadId (threadId de ai-run).",
      draftEmpty: "El proyecto {{draftMessageId}} no tiene texto que publicar.",
      draftAlreadyPosted:
        "Este borrador ya se publica en el foro (el texto {{threadId}}). Nada publicado.",
      threadNotFound:
        "hilo público {{threadId}} no se encuentra, borrado o o oculto.",
      notPublic: "Thread {{threadId}} no está en el foro público.",
      parentNotFound:
        "Mensaje {{parentId}} no es un post en hilo {{threadId}}.",
      emptyThread: "Thread {{threadId}} no tiene puestos a los que responder.",
      selfReply:
        "El post que respondería es su propio correo AI. Espera a que una persona responda. Nada publicado.",
      alreadyAnswered:
        "Una respuesta AI ya sigue ese post. Escoge un hilo donde una persona publicó el último. Nada publicado.",
      titleRequired: "Un nuevo hilo necesita un título y una categoría.",
      categoryNotFound:
        "Categoría ' {{category}}' no se encuentra. Disponible: {{available}}.",
      duplicateTitle:
        "Un hilo público titulado ' {{title}} ' ya existe ({{threadId}}). Escoge un tema nuevo.",
      rateLimited:
        "Limite horaria alcanzado: {{limit}} AI foro publicaciones por hora. Inténtalo de nuevo más tarde.",
      threadCreateFailed: "No podía crear el hilo: {{error}}",
      postFailed: "No podía publicar el mensaje: {{error}}",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revisar el borrador ID, hilo ID, título y categoría",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicie sesión en el correo",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "Sólo los administradores pueden publicar puestos de AI en el foro",
      },
      notFound: {
        title: "No encontrado",
        description: "Borrador, hilo o categoría no encontrado",
      },
      server: {
        title: "Error del servidor",
        description: "La publicación falló en el servidor",
        detail: "Error del servidor: {{error}}",
      },
      network: {
        title: "Error de red",
        description: "Incapaz de llegar al servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Algo inesperado salió mal.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "No publicado",
        description:
          "Bloqueado por un guardia de foro: límite duplicado, auto-reply o horal",
      },
    },
    success: {
      title: "Publicada",
      description: "El borrador está en vivo en el foro",
    },
  },
};
