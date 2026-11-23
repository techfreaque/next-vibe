import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Ingresa tu correo",
  page: {
    eyebrow: "El boletín {{appName}}",
    title: "Un correo electrónico al mes. Sólo lo que cambió.",
    description:
      "Nuevos modelos, nuevas características, impulsos que funcionan mensualmente.",
    subtitle: "Nuevos modelos, nuevas características, impulsan ese trabajo.",
    heroDescription:
      "Nuevos modelos el día que aterrizan, características que valen la pena saber, configuraciones que realmente obtienen resultados. Una vez al mes. Descríbete en un clic.",
    invalidEmail: {
      title: "Correo electrónico inválido",
      description:
        "Esa dirección no se ve bien. Compruébalo e inténtalo de nuevo.",
    },
    emailProvided: {
      title: "Administrar su suscripción",
      description:
        "Cambia la configuración de tu newsletter o descríbete en cualquier momento.",
    },
    unsubscribeText: "¿Quieres salir?",
    unsubscribeLink: "Suscríbete aquí",
    privacyNote: "No hay spam. No compartir tu dirección. Nunca.",
    cta: {
      title: "Consigue el próximo número.",
      description: "Un correo electrónico al mes. Cero relleno.",
      subscribeButton: "Suscribirme",
    },
    benefits: {
      title: "Qué aterriza en su buzón de entrada",
      subtitle: "Cuatro cosas. Nada más.",
      benefit1: {
        title: "Nuevos modelos, primero",
        description:
          "Cada modelo que añadimos: en lo que es bueno, en lo que cuesta, cuando elegirlo.",
      },
      benefit2: {
        title: "Características que se envían",
        description: "Lo que cambió, por qué importa, cómo utilizarlo hoy.",
      },
      benefit3: {
        title: "Pronóstico que funciona",
        description:
          "Configuraciones y habilidades reales que obtienen resultados: copiarlos, recortarlos, enviar.",
      },
      benefit4: {
        title: "Ofertas sólo de suscriptor",
        description:
          "Descuentos y acceso anticipado ante cualquier otra persona.",
      },
    },
    frequency: {
      title: "Mensual. Eso es.",
      description:
        "Un correo electrónico por mes. Descríbete en cualquier momento: un clic, sin preguntas.",
    },
  },
  subscription: {
    unsubscribe: {
      title: "Cancelar suscripción",
      confirmButton: "Confirmar cancelación",
      success: "Cancelaste tu suscripción",
      error: "No pudimos cancelar tu suscripción",
    },
  },
  unsubscribe: {
    page: {
      title: "Suscríbete del boletín informativo",
      description: "Sentimos verte ir.",
      subtitle: "Gestiona tu suscripción al boletín",
      emailProvided: {
        title: "Confirmar cancelación",
        description:
          "¿Está seguro de que quiere darse de baja de nuestro boletín?",
      },
      unsubscribeButton: "Cancelar suscripción",
      subscribeText: "¿Cambiaste de opinión?",
      subscribeLink: "Volver a suscribirme",
      info: {
        title: "Lo que sucede después",
        description: "Esto es lo que necesitas saber sobre el dessubscribir:",
        immediate: {
          title: "Efecto inmediato",
          description: "Dejarás de recibir el boletín de inmediato.",
        },
        resubscribe: {
          title: "Fácil de suscribir",
          description: "Si cambias de opinión, puedes volver a suscribirte.",
        },
      },
      alternatives: {
        title: "Antes de que te vayas",
        description: "Considerar estas alternativas:",
        subscribe: "Ajuste la frecuencia de correo electrónico en lugar",
        contact: "Contacta con nosotros con comentarios",
      },
    },
  },
};
