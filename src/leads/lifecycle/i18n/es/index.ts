import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Ciclo de vida",
  enums: {
    journey: {
      firstChat: "Inscribirse, nunca charlar",
      outOfCredits: "Créditos gratis utilizados",
      whatsNew: "Silencio durante 7 días",
      winBack: "Silencio durante 30 días",
      newsletterInvite: "Newsletter, sin cuenta",
    },
    enrollmentStatus: {
      active: "Activa",
      completed: "Completada",
      exited: "Salida",
    },
    exitReason: {
      goalMet: "Objetivo cumplido",
      unsubscribed: "Suscripción cancelada",
      suppressed: "Bloqueado",
      ineligible: "Ya no es elegible",
      sendFailed: "Envío fallido",
    },
    sendStatus: {
      pending: "Pendiente",
      sent: "Enviado",
    },
    template: {
      firstChatPrompts: "Primer chat: tres mensajes de inicio",
      outOfCredits: "Créditos: planes",
      whatsNew: "¿Qué hay de nuevo?",
      winBack: "Win-back: último correo electrónico",
      inviteSignup: "Invitar: crear una cuenta",
      inviteReminder: "Invitar: recordatorio",
    },
  },
  errors: {
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Acceso de los administradores necesario",
    },
    forbidden: { title: "Acceso denegado", description: "No hay permiso" },
    server: {
      title: "Error del servidor",
      description: "La operación del ciclo de vida falló",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    validation: {
      title: "Entrada inválida",
      description: "Revise los valores e inténtelo de nuevo",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Cuenta o sesión no encontradas",
    },
    conflict: { title: "Conflicto", description: "Conflicto" },
    network: { title: "Error de red", description: "Error de red" },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Cambios sin guardar",
    },
  },
  emails: {
    greeting: "Hola:",
    greetingNamed: "Hola, {{name}}:",
    signoff: "Max",
    signature: "unbottled.ai",
    senderName: "Max de unbottled.ai",
    unsubscribeText: "Darse de baja:",
    firstChatPrompts: {
      subject: "Tres primeros mensajes, listos para pegar",
      preview:
        "Uno sin censura, uno mainstream, una imagen. Elige uno y envía.",
      intro:
        "Tu cuenta está lista y el chat sigue vacío. Aquí tienes tres mensajes para empezar. Copia uno, pégalo, envía.",
      uncensoredTitle: "Pregunta sin sermones",
      uncensoredPrompt:
        '"Escribe una novela negra donde gana el villano. Sin final feliz, sin moraleja." Elige uno de los {{uncensoredCount}} modelos sin censura. Confirmas una sola vez que tienes 18 años o más.',
      mainstreamTitle: "Compara a los grandes",
      mainstreamPrompt:
        '"Planea un fin de semana barato en Lisboa. Dónde comer, qué evitar." Pregúntale primero a GPT. Luego cambia a Claude o Gemini en el mismo hilo y compara.',
      mediaTitle: "Crea una imagen, un vídeo o una canción",
      mediaPrompt:
        '"Un zorro con bufanda roja en una calle nevada de Tokio, de noche, foto analógica." Un prompt, una imagen. Los vídeos cortos y la música funcionan igual.',
      body: "Tu cuenta gratuita recibe {{freeCreditsSignedIn}} créditos cada mes, {{freeCreditsMax}} con el boletín activado. Sin tarjeta.",
      cta: "Envía tu primer mensaje",
      ps: "P. D.: ¿No sabes por dónde empezar? Responde a este correo. Leemos las respuestas.",
    },
    outOfCredits: {
      subject: "Se acabaron tus créditos gratis de este mes",
      preview:
        "Vuelven el día 1. O sigue ya, con planes desde {{subscriptionPrice}} al mes.",
      intro:
        "Has gastado todos los créditos gratis de este mes. Vuelven el día 1. ¿No quieres esperar? Elige un plan. Precios claros.",
      starterTitle: "Starter: {{subscriptionPrice}}/mes",
      starterBody:
        "{{subscriptionCredits}} créditos cada mes. Cancela cuando quieras. Ideal si chateas casi a diario.",
      moreTitle: "¿Necesitas más? Tres planes más grandes",
      moreBody:
        "Plus: {{plusCredits}} créditos por {{plusPrice}}. Pro: {{proCredits}} por {{proPrice}}. Ultra: {{ultraCredits}} por {{ultraPrice}}. Cualquier plan admite paquetes de recarga que nunca caducan.",
      body: "Paga con tarjeta, PayPal o cripto. Los mismos modelos, los mismos ajustes de filtro.",
      cta: "{{subscriptionCredits}} créditos por {{subscriptionPrice}}",
      ps: "P. D.: Esperar al día 1 también vale. Tus hilos siguen donde están.",
    },
    whatsNew: {
      subject: "Lo que ha cambiado mientras no estabas",
      preview:
        "{{modelCount}} modelos, vídeo y música en el chat, seis idiomas.",
      intro: "Tu último chat fue hace más de una semana. Esto es lo nuevo.",
      modelsTitle: "{{modelCount}} modelos de chat",
      modelsBody:
        "{{mainstreamCount}} mainstream, {{openCount}} abiertos, {{uncensoredCount}} sin censura. Cambia entre ellos en mitad del hilo.",
      mediaTitle: "Imágenes, vídeo y música",
      mediaBody:
        "Escribe un prompt en el chat. Recibes una imagen, un clip corto o una canción.",
      languagesTitle: "Seis idiomas",
      languagesBody:
        "Toda la app funciona en español, inglés, alemán, polaco, francés e italiano.",
      body: "Tus hilos siguen justo donde los dejaste.",
      cta: "Ver todos los modelos",
      ps: "P. D.: ¿Conoces a alguien a quien le serviría? Tu enlace de referido te paga el {{referralPercent}}% de todo lo que gaste, cada mes.",
    },
    winBack: {
      subject: "Un último correo de nuestra parte",
      preview: "Tu cuenta, tus hilos y tus créditos gratis siguen aquí.",
      intro:
        "Tu último chat fue hace más de un mes. Este es el último recordatorio que te mandamos.",
      body: "Tu cuenta, tus hilos y tus créditos gratis mensuales siguen ahí. Hay más modelos que la última vez, y el filtro lo sigues decidiendo tú.",
      cta: "Sigue donde lo dejaste",
      ps: "P. D.: ¿Qué te frenó? Responde y cuéntanoslo. Leemos todas las respuestas.",
    },
    inviteSignup: {
      subject: "Lees el boletín. Ahora prueba la app.",
      preview:
        "Cuenta gratuita, hasta {{freeCreditsMax}} créditos al mes. Sin tarjeta.",
      intro:
        "Recibes nuestro boletín. La app está a un paso: {{modelCount}} modelos, y el filtro lo decides tú.",
      guestTitle: "Sin cuenta: {{freeCreditsGuest}} créditos al mes",
      guestBody: "Suficiente para probar unos cuantos modelos.",
      accountTitle: "Cuenta gratuita: {{freeCreditsSignedIn}} créditos al mes",
      accountBody: "Tus hilos guardados, en todos tus dispositivos.",
      newsletterTitle: "Cuenta + boletín: {{freeCreditsMax}} créditos al mes",
      newsletterBody:
        "Mantén el boletín activado en tu cuenta y el extra es tuyo.",
      body: "Sin tarjeta. Los créditos gratis se activan en cuanto confirmas tu correo.",
      cta: "Crear mi cuenta gratuita",
    },
    inviteReminder: {
      subject: "Último recordatorio: tu cuenta gratuita",
      preview:
        "{{freeCreditsMax}} créditos al mes en lugar de {{freeCreditsGuest}}. Sin tarjeta.",
      intro:
        "Último recordatorio. Una cuenta gratuita con el boletín activado recibe {{freeCreditsMax}} créditos cada mes. Sin cuenta: {{freeCreditsGuest}}.",
      body: "Te lleva un minuto. Sin tarjeta.",
      cta: "Crear mi cuenta gratuita",
      ps: "P. D.: No habrá más recordatorios después de este. El boletín sigue llegando como siempre.",
    },
  },
  emailTemplates: {
    category: "Viajes de ciclo de vida",
    preview: {
      name: {
        label: "Nombre",
        description: "Saludando el nombre. Vacío = saludo genérico.",
      },
    },
    firstChatPrompts: {
      name: "Ciclo de vida: primer chat",
      description:
        "48 h después de la inscripción, cuenta verificada, no hay chat todavía. Tres impulsos concretos.",
    },
    outOfCredits: {
      name: "Ciclo de vida: sin créditos",
      description:
        "Créditos gratis para el mes utilizado, nunca pagados. Precios del plan.",
    },
    whatsNew: {
      name: "Ciclo de vida: lo nuevo",
      description:
        "7 días sin charla. Modelos, medios de comunicación, idiomas.",
    },
    winBack: {
      name: "Ciclo de vida: recuperación",
      description: "30 días sin charla. Último correo electrónico de viaje.",
    },
    inviteSignup: {
      name: "Ciclo de vida: invitación al boletín",
      description:
        "Suscriptor de newsletter confirmado sin cuenta, 48 h después de confirmar.",
    },
    inviteReminder: {
      name: "Ciclo de vida: invitar recordatorio",
      description:
        "Una semana después de la invitación, todavía no hay cuenta.",
    },
  },
  run: {
    post: {
      title: "Campañas automatizadas por correo",
      titleShort: "Ejecutar ciclo de vida",
      description:
        "Incorpora a los contactos que cumplen los requisitos y envía los correos programados. El interruptor de emergencia detiene ambas acciones.",
      container: {
        title: "Ejecutar ciclo de vida",
        description:
          "Apúntate y envía. Respeta el interruptor de matar y la tapa de frecuencia.",
      },
      fields: {
        dryRun: {
          label: "Simulación",
          description: "No hagas nada, sólo reporta",
        },
      },
      response: {
        paused: "Pausa",
        enrolled: "Inscritos",
        sent: "Enviados",
        exited: "Salidos",
        deferred: "Diferido",
        failed: "Fallidos",
      },
      success: {
        title: "Ciclo de vida terminado",
        description: "Se procesaron los pasos de viaje necesarios",
      },
    },
  },
  settings: {
    post: {
      title: "Ajustes del ciclo de vida",
      titleShort: "Ajustes del ciclo de vida",
      description:
        "Interruptor de matar, gorra de frecuencia, enviar el modo de ruido y consentimiento para los correos electrónicos del ciclo de vida.",
      container: {
        title: "Ajustes del ciclo de vida",
        description: "Deja un campo vacío para mantener su valor actual.",
      },
      fields: {
        paused: {
          label: "Pausa todo el ciclo de vida enviando",
          description: "En = nada se inscribe o envía",
        },
        minHoursBetweenEmails: {
          label: "Horas mínimas entre correos",
          description:
            "Cap de frecuencia por contacto, a través del ciclo de vida y campañas",
        },
        maxSendsPerRun: {
          label: "Correos electrónicos máximos por carrera",
          description: "Posibilidad de cada carrera programada",
        },
        autoEnrollWindowDays: {
          label: "Ventana de auto-enrollo (días)",
          description:
            "La carrera programada sólo inscribe contactos cuyo gatillo es este reciente. Los contactos más antiguos pasan por el backfill.",
        },
        requireUserMarketingConsent: {
          label: "Requiere el consentimiento de marketing para los usuarios",
          description:
            "En = los usuarios registrados necesitan el consentimiento de marketing o un boletín confirmado opt-in",
        },
      },
      response: {
        paused: "Pausa",
        minHoursBetweenEmails: "Horas mínimas entre correos",
        maxSendsPerRun: "Correos electrónicos máximos por carrera",
        autoEnrollWindowDays: "Ventana de auto-enrollo (días)",
        requireUserMarketingConsent:
          "Consentimiento de comercialización requerido",
      },
      success: {
        title: "Ajustes guardados",
        description: "La configuración del ciclo de vida está en vigor",
      },
    },
  },
  backfill: {
    post: {
      title: "Relleno retroactivo del ciclo de vida",
      titleShort: "Relleno",
      description:
        "Previsualizar, luego inscribir los contactos existentes elegibles en el viaje correcto. Empieza en el paso 0, se extiende por una ventana de envío.",
      container: {
        title: "Rellenar los contactos existentes",
        description:
          "Correr seco es el predeterminado. No se envía nada mientras se detiene.",
      },
      fields: {
        dryRun: {
          label: "Simulación",
          description: "Cuenta sólo. Apaga para inscribirte.",
        },
        spreadHours: {
          label: "Se propagan (horas)",
          description: "Ventana los primeros emails se distribuyen a través de",
        },
      },
      response: {
        dryRunResult: "Simulación",
        segments: "Segmentos",
        journey: "Viaje",
        eligible: "Elegibles",
        alreadyEnrolled: "Ya estoy matriculado.",
        enrolled: "Inscritos",
        autoEligible: "Correspondencia programada se inscribirá",
        heldSuppressed: "Celebración: no subscrita / rebotada",
        heldPaid: "Celebración: ya pagado",
        heldNoConsent: "Celebrada: no consentimiento en la comercialización",
        heldUnverified: "Celebración: email noverificado",
        heldPendingNewsletter: "Celebración: boletín no confirmado",
        heldInactiveAccount: "Soldado: prohibido / inactivo",
        heldNothingDue: "Celebración: nada debido (activo, tiene créditos)",
      },
      success: {
        title: "Reparación terminada",
        description: "Los recuentos de segmento están en la respuesta",
      },
    },
  },
  overview: {
    get: {
      title: "Viajes de ciclo de vida",
      titleShort: "Ciclo de vida",
      description:
        "Viajes, inscripciones, envíos y conversiones. Matar el interruptor y el relleno.",
      response: {
        paused: "Pausa",
        minHoursBetweenEmails: "Horas mínimas entre correos",
        maxSendsPerRun: "Correos electrónicos máximos por carrera",
        autoEnrollWindowDays: "Ventana de auto-enrollo (días)",
        requireUserMarketingConsent:
          "Consentimiento de comercialización requerido",
        journeys: "Secuencias",
        steps: "Pasos",
        enrolled: "Inscritos",
        active: "Activa",
        completed: "Completado",
        exited: "Salidos",
        converted: "Conversión",
        unsubscribed: "Suscripción cancelada",
        sent: "Enviados",
        sent24h: "Enviados (24 h)",
        attributedPaid: "Pagado después de la inscripción",
      },
      success: {
        title: "Ciclo de vida cargado",
        description: "El viaje cuenta cargado",
      },
    },
  },
  widget: {
    title: "Viajes de ciclo de vida",
    refresh: "Actualizar",
    pausedTitle: "Pausa",
    pausedBody: "Nada está inscrito o enviado.",
    liveTitle: "Vivir",
    liveBody: "Los correos electrónicos deben salir en cada carrera.",
    pause: "Pausa todo",
    resume: "Resumir el envío",
    settings: "Configuración",
    backfill: "Relleno",
    capLine: "Cap: 1 email por {{hours}} h. Max {{max}} por huida.",
    consentOn: "Los usuarios necesitan consentimiento de marketing.",
    consentOff: "Los usuarios no necesitan consentimiento de marketing.",
    noJourneys: "No hay viajes.",
    stepsLine: "Pasos {{steps}}",
    enrolled: "Inscritos",
    active: "Activa",
    sent: "Enviados",
    sent24h: "Enviados (24 h)",
    converted: "Conversión",
    paid: "Pagado después",
    unsubscribed: "Bajas",
  },
};
