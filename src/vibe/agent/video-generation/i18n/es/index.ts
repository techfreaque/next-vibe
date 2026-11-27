import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "Video",
    generation: "Generación",
    ai: "IA",
  },
  post: {
    title: "Generar vídeo",
    titleShort: "Generar vídeo",
    dynamicTitle: "Video: {{prompt}}",
    description:
      "Generar un vídeo de un mensaje de texto. Utilice la herramienta de modelos (modelType =video) para ver todos los modelos de vídeo con sus capacidades: supportedDurations (longitudes de clip válidas en segundos), supportedAspectRatios, supportedFrameImages (first_frame / last_frame = soporte de imagen a vídeo). Pase frameReferences para dirigir el vídeo: el papel 'primero' marca el marco de apertura y el rol 'último' marca el marco de cierre, tanto MUST sea URLs de imagen (sólo en modelos con soporte last_frame); el papel 'referencia' (o ningún papel) alimenta una imagen guía, audio o activo de vídeo. Pase negativePrompt en modelos que lo soportan. Devuelve videoUrl.",
    form: {
      title: "Generación de video",
      description: "Ingrese un impulso para generar un vídeo",
    },
    prompt: {
      label: "Prompt",
      description: "Describir el vídeo que desea generar",
      placeholder:
        "Un tiro cinematográfico de un lago de montaña al atardecer...",
    },
    model: {
      label: "Modelo",
      description:
        "Modelo de vídeo id. Deja en blanco por defecto del usuario. Utilice la herramienta de modelos (modelType =video) para navegar por los modelos y sus capacidades.",
    },
    duration: {
      label: "Duración",
      description: "Longitud del clip de vídeo generado",
      short: "Corto (~5s)",
      medium: "Medio (~10s)",
      long: "Largo (~15s)",
    },
    aspectRatio: {
      label: "Aspect Ratio",
      description: "Coeficiente de vídeo de salida",
    },
    resolution: {
      label: "Resolución",
      description: "Resolución de vídeo de salida",
    },
    frameReferences: {
      label: "Referencias del marco",
      description:
        "Activos de referencia que dirigen el vídeo. Cada entrada es { url, role }. role 'first' pins el marco de apertura exacto y el papel 'último' marca el marco de cierre exacto (necesidades) last_frame apoyo). marcos de lista son IMAGES ONLYAsí que ambos MUST ser URL de la imagen. el papel 'referencia' (o ningún papel) es un activo guía que puede ser una imagen, audio o vídeo URL; su tipo es auto-detectado de la URL (.mp4/.webm/.mov como vídeo, archivos de audio como audio, todo lo demás como imagen). Una imagen de primera o referencia cambia el servidor al modelo más barato de imagen cuando sea necesario.",
      placeholder: "https://example.com/first-frame.jpg",
    },
    negativePrompt: {
      label: "Prompt negativo",
      description:
        "Qué excluir del vídeo. Sólo enviado a modelos que aceptan negative_prompt o negativePrompt. ignorado de otra manera.",
      placeholder: "borroso, de baja calidad, distorsionado...",
    },

    download: "Descargar",
    generatingNote: "Generación de vídeo puede tardar 1-3 minutos",
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      text: "Generar vídeo",
      label: "Generar vídeo",
      loadingText: "Generando...",
    },
    response: {
      videoUrl: "Generado en vídeo URL",
      creditCost: "Créditos utilizados",
      durationSeconds: "Duración en segundos",
      jobId: "Async job ID",
    },
    errors: {
      referenceNotImage:
        "El enlace de {{host}} abre una página web, no un archivo de imagen. Usa un enlace directo a la imagen (clic derecho, copiar dirección de la imagen) o sube la imagen.",
      referenceUnreachable:
        "El enlace de imagen de {{host}} no carga (HTTP {{status}}). Revisa el enlace o sube la imagen. No se te ha cobrado nada.",
      modelDiscontinued:
        "Su proveedor retiró {{model}} y ya no genera. Elige otro modelo de vídeo. No se te ha cobrado nada.",
      referenceStagingFailed:
        "El proveedor de vídeo no pudo recibir la imagen de entrada. Inténtalo de nuevo o elige otro modelo de vídeo. No se te ha cobrado nada.",
      referenceUnavailable:
        "La imagen de entrada no está disponible. Fue borrado, o pertenece a un chat que no puede abrir. Utilice una imagen de este chat o subirla de nuevo.",
      validation_failed: {
        title: "Error de validación",
        description: "Por favor, compruebe el aviso y la configuración",
      },
      network_error: {
        title: "Error de red",
        description: "Failed to connect to video generation service",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Por favor, ingrese para generar vídeos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para usar esta característica",
      },
      not_found: {
        title: "No encontrado",
        description: "No se encontró el modelo solicitado",
      },
      server_error: {
        title: "Error del servidor",
        description:
          "Un error inesperado ocurrió durante la generación de video",
      },
      unknown_error: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved_changes: {
        title: "Cambios sin guardar",
        description: "Por favor, guarde sus cambios antes de generar",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió durante la generación de vídeo",
      },
      notAVideoModel:
        "El modelo seleccionado no admite la generación de vídeo. Por favor, seleccione un modelo de vídeo.",
      notConfigured:
        "{{label}} no está configurado. Añadir {{envKey}} a tu archivo.env. Obtener su llave en {{url}}",
      providerUnsupported: "{{label}} no está soportado todavía",
      modelUnavailable:
        "Este modelo no está disponible temporalmente. Escoge otro modelo.",
      insufficientCredits:
        "Créditos insuficientes. Saldo: {{balance}}, mínimo requerido: {{minimum}}.",
      balanceCheckFailed: "Fallado para comprobar su saldo de crédito",
      unsupportedDuration:
        "El modelo {{model}} no soporta la duración {{duration}}. Duración soportada: {{supported}}",
      unsupportedAspectRatio:
        "Modelo {{model}} no soporta relación de aspecto {{aspectRatio}}. Coeficientes compatibles: {{supported}}",
      unsupportedResolution:
        "El modelo {{model}} no admite la resolución {{resolution}}. Resoluciones apoyadas: {{supported}}",
      generationFailed: "La generación de vídeo falló: {{error}}",
      providerError: "Error del proveedor de vídeo: {{error}}",
      noVideoUrl: "No se devolvió ningún vídeo URL del proveedor",
      generationFailedUnknown:
        "La generación de vídeo falló y el proveedor no dio ninguna razón",
      providerErrorUnknown:
        "El proveedor de vídeo falló sin un mensaje de error",
      nonJsonResponse:
        "El proveedor de vídeo devolvió una respuesta no JSON (HTTP {{status}}): {{body}}",
      providerHttpError:
        "proveedor de vídeo devuelto HTTP {{status}} : {{body}}",
      jobFailedStatus: "Trabajo de vídeo terminado con el estado: {{status}}",
      requestAborted: "La generación de vídeo fue abortada",
      requestTimedOut: "Tiempo de espera para la generación de vídeo",
      contentRejected:
        "Refusado por el filtro de contenido del proveedor de vídeo: {{error}}. Esto es un rechazo, no un outage. Rephrase el aviso o seleccione un modelo menos filtrado. No te acusaron.",
      providerOutage:
        "El proveedor de vídeo está descargado o sobrecargado ahora mismo: {{error}}. Esto es una salida, no una negativa. Inténtalo de nuevo en un minuto o elige otro modelo. No te acusaron.",
      consentRequired:
        "El proveedor de vídeo quiere una confirmación de consentimiento para las caras reales en la entrada: {{error}}. Use una imagen sin la cara de una persona real, o elija otro modelo de vídeo. No te acusaron.",
      storageFailed:
        "El vídeo se generó pero no se pudo guardar. No te acusaron. Inténtalo de nuevo.",
      creditsFailed:
        "Fallado para deducir créditos para la generación de vídeo",
      imageRequiredForModel:
        "{{model}} anima una imagen. Añade una imagen inicial y vuelve a generar.",
      inputMediaRequired:
        "Este modelo requiere una imagen de entrada URL. Pruebe un enlace de imagen para animarlo.",
      imageInputUnsupported:
        "El modelo de vídeo {{model}} rechazó la imagen de entrada - es probable que no apoye la imagen a vídeo. Retry generate_video WITHOUT el parámetro modelo (el modelo predeterminado anima imágenes), o suelte la imagen.",
      noImageCapableModel:
        "Ningún modelo de vídeo aquí toma una imagen de referencia. Suelte la imagen para generar desde el impulso solo.",
    },
    success: {
      title: "Video Generado",
      description: "Su vídeo se ha generado con éxito",
    },
  },
};
