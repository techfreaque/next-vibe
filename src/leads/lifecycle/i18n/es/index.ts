import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lifecycle",
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
      completed: "Completado",
      exited: "Exited",
    },
    exitReason: {
      goalMet: "Objetivo conocido",
      unsubscribed: "Suscripción cancelada",
      suppressed: "Suppressed",
      ineligible: "Ya no es elegible",
      sendFailed: "Enviar falló",
    },
    sendStatus: {
      pending: "Pendiente",
      sent: "Sent",
    },
    template: {
      firstChatPrompts: "Primer chat: tres avisos",
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
    greeting: "Hola.",
    greetingNamed: "Hola, {{name}}:",
    signoff: "Máximo",
    signature: "unbottled.ai",
    senderName: "Max de unbottled.ai",
    unsubscribeText: "Suscribe:",
    firstChatPrompts: {
      subject: "Tres primeros mensajes, listos para pegar",
      preview:
        "Una imagen sin censura, una corriente principal. Escoge uno, manda.",
      intro:
        "Su cuenta está lista y el chat todavía está vacío. Aquí hay tres mensajes para empezar. Copia uno, pegalo, envía.",
      uncensoredTitle: "Pregunta sin la conferencia",
      uncensoredPrompt:
        '"Escribe una historia de crimen oscuro donde gana el villano. Sin final feliz, sin moral." Escoge uno de los modelos sin censura {{uncensoredCount}}. Usted confirma una vez que usted tiene 18 años o más.',
      mainstreamTitle: "Pongan los nombres de lado a lado",
      mainstreamPrompt:
        '"Planea un fin de semana barato en Lisboa. Donde comer, qué saltar." Pregúntele a GPT primero. Luego, cambie a Claude o Gemini en el mismo hilo y compare.',
      mediaTitle: "Hacer una imagen, un vídeo o una canción",
      mediaPrompt:
        '"Un zorro en una bufanda roja en una calle de Tokio nevada por la noche, foto de cine." Un impulso, una imagen. Los videos cortos y la música funcionan de la misma manera.',
      body: "Su cuenta gratuita recibe créditos {{freeCreditsSignedIn}} cada mes, {{freeCreditsMax}} con el boletín informativo. Sin tarjeta.",
      cta: "Envia tu primer mensaje",
      ps: "P.S. ¿No está seguro de dónde empezar? Responder a este correo electrónico. Leímos respuestas.",
    },
    outOfCredits: {
      subject: "Los créditos gratis de este mes se utilizan",
      preview:
        "Vuelven en la primera. O seguir adelante, planes de {{subscriptionPrice}} al mes.",
      intro:
        "Usaste todos los créditos gratis de este mes. Vuelven en la primera. ¿No quieres esperar? Escoge un plan. Precios bajos.",
      starterTitle: "Inicio: {{subscriptionPrice}} /mes",
      starterBody:
        "{{subscriptionCredits}} acredita cada mes. Cancela en cualquier momento. Es compatible con si hablas la mayoría de los días.",
      moreTitle: "¿Necesitas más? Tres planes más grandes",
      moreBody:
        "Además: créditos {{plusCredits}} para {{plusPrice}}. Pro: {{proCredits}} para {{proPrice}}. Ultra: {{ultraCredits}} para {{ultraPrice}}. Cada plan puede añadir paquetes de arriba arriba arriba que nunca caducan.",
      body: "Paga por tarjeta, PayPal o cripto. Los mismos modelos, la misma configuración de filtros.",
      cta: "Obtener créditos {{subscriptionCredits}} para {{subscriptionPrice}}",
      ps: "P.S. Esperar la primera también está bien. Tus hilos se quedan donde están.",
    },
    whatsNew: {
      subject: "¿Qué cambió mientras estabas fuera?",
      preview: "Modelos {{modelCount}}, video y música en chat, y francés.",
      intro: "Tu última charla fue hace una semana. Esto es lo nuevo.",
      modelsTitle: "Modelos de chat {{modelCount}}",
      modelsBody:
        "{{mainstreamCount}} mainstream, {{openCount}} open, {{uncensoredCount}} sin censura. Intercambia entre ellos.",
      mediaTitle: "Imágenes, vídeo y música",
      mediaBody:
        "Escribe un aviso en el chat. Retrocede una foto, un corto clip o una pista.",
      languagesTitle: "Ahora en francés",
      languagesBody:
        "Toda la aplicación se ejecuta en inglés, alemán, polaco y francés.",
      body: "Tus hilos están justo donde los dejaste.",
      cta: "Examine todos los modelos",
      ps: "P.S. ¿Conoces a alguien que usaría esto? Su enlace de referencia le paga {{referralPercent}} % de todo lo que gastan, cada mes.",
    },
    winBack: {
      subject: "Un último correo electrónico de nosotros",
      preview: "Su cuenta, hilos y créditos gratis todavía están aquí.",
      intro:
        "Tu última charla fue hace un mes. Este es el último lodo que obtienes de nosotros.",
      body: "Su cuenta, sus hilos y sus créditos gratis mensuales están todos todavía allí. Más modelos que la última vez, y el filtro sigue siendo suyo para establecer.",
      cta: "Recógete donde te fuiste",
      ps: "P.S. ¿Qué te ha quitado? Responde y dinos. Leímos todas las respuestas.",
    },
    inviteSignup: {
      subject: "Leíste el boletín. Ahora usa la aplicación.",
      preview:
        "Cuenta gratuita, hasta créditos {{freeCreditsMax}} al mes. Sin tarjeta.",
      intro:
        "Recibe nuestro boletín. La aplicación está a un paso de distancia: los modelos {{modelCount}}, y usted establece el filtro.",
      guestTitle: "Sin cuenta: créditos {{freeCreditsGuest}} al mes",
      guestBody: "Suficiente para probar algunos modelos.",
      accountTitle: "Cuenta gratuita: créditos {{freeCreditsSignedIn}} al mes",
      accountBody: "Tus hilos guardados, en cada dispositivo.",
      newsletterTitle:
        "Cuenta + newsletter: créditos {{freeCreditsMax}} al mes",
      newsletterBody: "Mantenga el boletín en su cuenta y el bono es suyo.",
      body: "Sin tarjeta. Los créditos gratuitos se activan una vez que confirme su correo electrónico.",
      cta: "Crear mi cuenta gratuita",
    },
    inviteReminder: {
      subject: "Último recordatorio: tu cuenta gratuita",
      preview:
        "{{freeCreditsMax}} acredita un mes en lugar de {{freeCreditsGuest}}. Sin tarjeta.",
      intro:
        "Último recordatorio. Una cuenta gratuita con el boletín de noticias recibe créditos {{freeCreditsMax}} cada mes. Sin uno: {{freeCreditsGuest}}.",
      body: "Toma un minuto. Sin tarjeta.",
      cta: "Crear mi cuenta gratuita",
      ps: "P.S. No más recordatorios después de éste. El boletín sigue viniendo como siempre.",
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
      name: "Lifecycle: out of credits",
      description:
        "Créditos gratis para el mes utilizado, nunca pagados. Precios del plan.",
    },
    whatsNew: {
      name: "Ciclo de vida: lo nuevo",
      description:
        "7 días sin charla. Modelos, medios de comunicación, idiomas.",
    },
    winBack: {
      name: "Lifecycle: win-back",
      description: "30 días sin charla. Último correo electrónico de viaje.",
    },
    inviteSignup: {
      name: "Lifecycle: newsletter invite",
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
      title: "Ejecutar Viajes de ciclo de vida",
      titleShort: "Ejecutar ciclo de vida",
      description:
        "Inscribir contactos recién elegibles y enviar correos electrónicos de viaje debido. No hace nada mientras el interruptor de la muerte está encendido.",
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
        sent: "Sent",
        exited: "Exited",
        deferred: "Diferido",
        failed: "Failed",
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
          label: "Min hours between emails",
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
        minHoursBetweenEmails: "Min hours between emails",
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
      title: "Lifecycle Backfill",
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
        eligible: "Eligible",
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
      titleShort: "Lifecycle",
      description:
        "Viajes, inscripciones, envíos y conversiones. Matar el interruptor y el relleno.",
      response: {
        paused: "Pausa",
        minHoursBetweenEmails: "Min hours between emails",
        maxSendsPerRun: "Correos electrónicos máximos por carrera",
        autoEnrollWindowDays: "Ventana de auto-enrollo (días)",
        requireUserMarketingConsent:
          "Consentimiento de comercialización requerido",
        journeys: "Secuencias",
        steps: "Pasos",
        enrolled: "Inscritos",
        active: "Activa",
        completed: "Completado",
        exited: "Exited",
        converted: "Conversión",
        unsubscribed: "Suscripción cancelada",
        sent: "Sent",
        sent24h: "Sent (24h)",
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
    sent: "Sent",
    sent24h: "Sent (24h)",
    converted: "Conversión",
    paid: "Pagado después",
    unsubscribed: "Unsub",
  },
};
