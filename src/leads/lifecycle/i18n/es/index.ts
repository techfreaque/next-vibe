import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Ciclo de vida",
  enums: {
    journey: {
      firstChat: "Inscribirse, nunca charlar",
      outOfCredits: "Créditos gratis utilizados",
      whatsNew: "Silencio durante 7 días",
      winBack: "Silencio durante 30 días",
      customerCheckin: "Suscripción activa: feedback",
      lapsedWinback: "Pagó antes, 14 días sin actividad",
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
      firstChatSkills: "Primer chat: empieza un skill",
      outOfCredits: "Créditos: planes",
      whatsNew: "¿Qué hay de nuevo?",
      winBack: "Win-back: último correo electrónico",
      paymentFailed: "Pago fallido",
      customerLikes: "Cliente: qué funciona",
      customerBuildNext: "Cliente: qué construir",
      lapsedWinback: "Excliente: por qué paró",
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
    signoff: "El equipo de unbottled.ai",
    senderName: "unbottled.ai",
    unsubscribeText: "Darse de baja:",
    ctaLine: "{{text}}: {{url}}",
    footerAccount:
      "Recibes este correo porque tienes una cuenta en unbottled.ai.",
    footerAccountLink: "Dejar de recibir estos correos",
    footerBilling: "Este es un aviso de pago sobre tu suscripción.",
    newModels: {
      one: "modelo nuevo",
      few: "modelos nuevos",
      many: "modelos nuevos",
      other: "modelos nuevos",
    },
    tier: {
      mainstream: "Mainstream",
      open: "Código abierto",
      uncensored: "Sin censura",
    },
    firstChatPrompts: {
      subject: "Tres primeros mensajes. Copia, pega, envía.",
      preview:
        "Una pregunta que las IA filtradas esquivan, un duelo de modelos y una imagen.",
      intro:
        "Tu cuenta está lista y tu chat sigue vacío. Elige uno de estos, pégalo y envíalo.",
      uncensoredTitle: "1. Pregunta lo que las IA filtradas esquivan",
      uncensoredPrompt:
        "«Defiende en un debate la postura que normalmente te negarías a defender. Con todo, sin advertencias.» Usa uno de los {{uncensoredCount}} modelos sin censura. Confirmas una sola vez que tienes 18 años o más.",
      mainstreamTitle: "2. Pon a competir a los grandes",
      mainstreamPrompt:
        "«Planea un fin de semana barato en Lisboa. Dónde comer, qué evitar.» Pregúntale a GPT. Luego cambia a Claude o Gemini en el mismo hilo y compara.",
      mediaTitle: "3. Crea una imagen",
      mediaPrompt:
        "«Un zorro con bufanda roja en una calle nevada de Tokio de noche, foto analógica.» Un prompt, una imagen.",
      body: "Tus créditos gratis ya están en tu cuenta. Sin tarjeta.",
      cta: "Abrir mi chat",
      ps: "P. D. ¿Te has atascado? Responde a este correo. Contestamos todas las respuestas.",
    },
    firstChatSkills: {
      subject: "¿No sabes qué escribir? Elige un skill.",
      preview:
        "Personajes y especialistas con voz, modelo y herramientas propios.",
      intro:
        "Un chat en blanco intimida. Un skill le da una tarea antes de que escribas una palabra.",
      characterTitle: "Personajes",
      characterBody:
        "Acompañantes, compañeros de rol, críticos mordaces. Cada uno tiene su propia voz y no la suelta.",
      specialistTitle: "Especialistas",
      specialistBody:
        "Un programador, un editor, un investigador. Cada uno trae sus propias instrucciones, su modelo y sus herramientas.",
      body: "Elige uno y salúdalo.",
      cta: "Elegir un skill",
    },
    outOfCredits: {
      subject: "Casi sin créditos gratis. Se recargan el {{resetDate}}.",
      preview: "No se pierde nada. Tus hilos y ajustes se quedan como están.",
      intro:
        "Has gastado casi todos los créditos gratis de este mes. Se recargan el {{resetDate}}.",
      cta: "Ver mis créditos",
      plansLink: "Ver los planes",
    },
    paymentFailed: {
      subject: "No se pudo cobrar tu suscripción",
      preview:
        "Tu plan sigue activo hasta el {{graceDate}}. Actualiza tu método de pago para conservarlo.",
      intro: "No hemos podido cobrar el último pago de tu suscripción.",
      body: "Tu plan sigue activo hasta el {{graceDate}}. Actualiza antes tu método de pago para conservarlo. ¿Tu banco retuvo el cobro hasta que lo apruebes (habitual con tarjetas indias)? Apruébalo desde la página de tu cuenta. También puedes recargar con un paquete de créditos único o pagar con cripto.",
      cta: "Actualizar método de pago",
      ps: "P. D. ¿Ya lo has arreglado? Entonces ignora este correo.",
    },
    customerLikes: {
      subject: "Una semana dentro. ¿Qué funciona y qué no?",
      preview:
        "Dos preguntas. Basta una línea. El feedback útil te da {{feedbackCredits}} créditos.",
      intro: "Llevas una semana con tu plan. Gracias. Dos preguntas:",
      likeTitle: "¿Qué te gusta?",
      likeBody:
        "El modelo, la función, el momento en que todo encajó. Dinos qué mantener.",
      missingTitle: "¿Qué falta o qué falla?",
      missingBody: "Un error, un ajuste confuso, cualquier cosa que te frenó.",
      body: "Responde a una de las dos preguntas en una línea. El feedback útil te da {{feedbackCredits}} créditos.",
      cta: "Enviar feedback",
    },
    customerBuildNext: {
      subject: "¿Qué construimos ahora?",
      preview: "Tienes voz en lo que construimos después.",
      intro: "Llevas más de un mes apoyándonos. Gracias.",
      body: "Una pregunta: si pudiéramos construir una sola cosa para ti, ¿cuál sería? Un modelo, una función, un arreglo. Responde en una línea. El feedback útil te da {{feedbackCredits}} créditos.",
      cta: "Enviar mi idea",
    },
    lapsedWinback: {
      subject: "¿Qué podríamos haber hecho mejor?",
      preview:
        "Una línea basta. El feedback útil te da {{feedbackCredits}} créditos.",
      intro:
        "Ya pagaste por unbottled.ai y hace tiempo que no vuelves. Si algo te echó para atrás, queremos saberlo.",
      body: "Responde y cuéntanoslo en una línea: el precio, un modelo que falta, un error, lo que sea. El feedback útil te da {{feedbackCredits}} créditos.",
      cta: "Enviar feedback",
      newsPs:
        "P. D. Desde tu última visita hemos añadido {{newModelCount}} {{newModelsPhrase}}, entre ellos {{modelList}}.",
      newsPsAll: "P. D. Desde tu última visita hemos añadido {{modelList}}.",
    },
    whatsNew: {
      subject: "{{newModelCount}} {{newModelsPhrase}} desde tu última visita",
      subjectOne: "Nuevo desde tu última visita: {{newModelName}}",
      preview:
        "Llegaron después de tu última visita. Ya están en tu selector de modelos.",
      intro:
        "Desde tu última visita hemos añadido {{newModelCount}} {{newModelsPhrase}}. Los más recientes:",
      introOne: "Desde tu última visita hemos añadido un modelo:",
      body: "Abre cualquier hilo y cambia de modelo. Tu historial se queda.",
      bodyMore:
        "Y {{moreCount}} más. Abre cualquier hilo y cambia de modelo a mitad de la conversación.",
      cta: "Abrir mis chats",
      introAll:
        "Desde tu última visita hemos añadido {{newModelCount}} {{newModelsPhrase}}:",
    },
    whatsNewQuiet: {
      subject: "Pregunta a un modelo, luego a otro",
      preview: "Cambia de modelo en el mismo chat y compara.",
      intro: "Prueba esto: haz la misma pregunta a dos modelos.",
      compareTitle: "Cambio de modelo",
      compareBody:
        "Pregunta a un modelo, cambia a otro en el mismo hilo y compara las respuestas.",
      body: "Tus hilos están donde los dejaste.",
      cta: "Abrir mis chats",
    },
    winBack: {
      subject: "¿Qué faltó?",
      preview: "¿Qué faltó? Con una línea basta.",
      intro:
        "Tu último chat fue hace más de un mes. Una pregunta: ¿qué faltó? Responde, con una línea basta. Leemos cada respuesta y arreglamos lo que podemos.",
      body: "Tu cuenta y tus hilos siguen ahí, y tus créditos gratis se siguen recargando cada mes.",
      cta: "Cuéntanos qué faltó",
      newsPs:
        "P. D. Desde tu última visita hemos añadido {{newModelCount}} {{newModelsPhrase}}, entre ellos {{modelList}}.",
      newsPsAll: "P. D. Desde tu última visita hemos añadido {{modelList}}.",
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
      name: "Lifecycle: primer chat",
      description:
        "Servicio. 24 h tras el registro, cuenta verificada, sin chat todavía. Tres primeros mensajes listos para pegar.",
    },
    firstChatSkills: {
      name: "Lifecycle: primer chat, skills",
      description:
        "Servicio. Día 5, aún sin chat. Los skills le dan una tarea al chat.",
    },
    outOfCredits: {
      name: "Lifecycle: sin créditos",
      description:
        "Servicio. Créditos gratis del mes agotados, nunca pagó. Fecha de recarga y planes.",
    },
    paymentFailed: {
      name: "Lifecycle: pago fallido",
      description:
        "Transaccional. Suscripción vencida: un correo por cobro fallido, plan activo hasta el fin del periodo de gracia.",
    },
    customerLikes: {
      name: "Lifecycle: consulta al cliente",
      description:
        "Servicio. Suscripción activa, 7 días de plan. Solo pide feedback, se responde por correo, créditos por feedback como promete el pie.",
    },
    customerBuildNext: {
      name: "Lifecycle: qué construir",
      description:
        "Servicio. Suscripción activa, unas 5 semanas. Pregunta qué construir después.",
    },
    lapsedWinback: {
      name: "Lifecycle: exclientes",
      description:
        "Marketing. Pagó antes, sin plan activo, 14 días sin actividad. Pregunta el motivo, lista modelos nuevos.",
    },
    whatsNew: {
      name: "Lifecycle: novedades",
      description:
        "Marketing. 7 días sin chat. Modelos añadidos desde el último chat.",
    },
    winBack: {
      name: "Lifecycle: recuperación",
      description:
        "Marketing. 30 días sin chat. Último correo del recorrido, pregunta qué faltó.",
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
