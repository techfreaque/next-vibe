import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Inicio",
  },
  breadcrumb: "Ayuda",
  meta: {
    contact: {
      title: "Centro de ayuda: FAQ, guías y soporte | {{appName}}",
      description:
        "Respuestas sobre créditos, pagos, privacidad, modelos sin censura y API. Guías para todo {{appName}} y soporte directo por correo y Discord.",
      category: "Soporte",
      imageAlt: "Centro de ayuda de {{appName}}",
      keywords:
        "ayuda {{appName}}, FAQ {{appName}}, soporte chat IA, ayuda IA sin censura, créditos IA, acceso API IA",
      ogTitle: "Centro de ayuda de {{appName}}",
      ogDescription:
        "Créditos, pagos, privacidad, modelos sin censura y acceso a la API: todo respondido.",
      twitterTitle: "Centro de ayuda de {{appName}}",
      twitterDescription: "Respuestas, guías y soporte directo.",
    },
  },
  pages: {
    help: {
      title: "¿Cómo podemos ayudarte?",
      subtitle:
        "Primero, respuestas rápidas. Guías para profundizar. Una persona cuando la necesites.",
      topics: {
        title: "Encuentra tu camino",
        models: {
          title: "Modelos",
          body: "Compara {{modelCount}} modelos de chat por precio, contexto y nivel de censura.",
        },
        uncensored: {
          title: "Chat de IA sin censura",
          body: "Qué modelos responden sin los filtros de siempre y cómo empezar.",
        },
        skills: {
          title: "Skills",
          body: "Especialistas y personajes listos para usar. O crea el tuyo.",
        },
        studio: {
          title: "Media Studio",
          body: "Imágenes, vídeo, música, voz y transcripción en un solo lugar.",
        },
        pricing: {
          title: "Planes y créditos",
          body: "Qué incluye un plan, cómo funcionan los créditos y cómo recargar.",
        },
        api: {
          title: "Documentación de la API",
          body: "Endpoints compatibles con OpenAI y Anthropic, con ejemplos para copiar.",
        },
        selfHost: {
          title: "Autoalojamiento",
          body: "Ejecuta tu propia instancia desde el código abierto.",
        },
      },
      info: {
        title: "¿Sigues atascado? Escríbenos",
        intro:
          "Envía un mensaje abajo o contáctanos directamente. Leemos cada solicitud.",
        supportEmail: "Correo de soporte",
        discord: "Discord",
        discordUrl: "Únete a nuestra comunidad de Discord",
      },
      guides: {
        title: "Guías populares",
      },
      faq: {
        title: "Preguntas frecuentes",
        more: "Leer más",
        questions: {
          q1: {
            question: "¿Qué es {{appName}}?",
            answer:
              "{{appName}} es una plataforma de chat con IA con {{modelCount}} modelos: populares, abiertos y sin censura. Tú eliges el modelo y con él cuánto filtro quieres. Además: skills, carpetas, generación de medios y una API.",
          },
          q2: {
            question: "¿Qué métodos de pago aceptáis?",
            answer:
              "Tarjeta, PayPal, Apple Pay y Google Pay mediante Stripe. Criptomonedas (Bitcoin, Ethereum y monedas estables) mediante NOWPayments. Los planes empiezan en {{subscriptionPrice}} al mes. Con una suscripción puedes recargar con paquetes de créditos.",
          },
          q3: {
            question: "¿Cómo funciona el sistema de créditos?",
            answer:
              "Cada uso consume créditos. Puedes empezar con los gratis. Créditos mensuales por plan: {{subscriptionPrice}} por {{subscriptionCredits}}, {{plusPrice}} por {{plusCredits}}, {{proPrice}} por {{proCredits}}, {{ultraPrice}} por {{ultraCredits}}. Si tienes una suscripción, puedes recargar con paquetes de {{packPrice}} por {{packCredits}} créditos. Los créditos de los paquetes nunca vencen y sirven para los {{modelCount}} modelos de IA.",
          },
          q4: {
            question: "¿Mis datos son privados y seguros?",
            answer:
              "Las carpetas privadas solo las ves tú. El modo incógnito mantiene el historial del chat fuera de nuestros servidores, aunque los archivos multimedia generados sí se guardan allí. Desde Ajustes puedes exportar todos tus datos o eliminar tu cuenta y los datos personales vinculados. Nunca vendemos tus datos.",
          },
          q5: {
            question: "¿Puedo probarlo sin cuenta?",
            answer:
              "Sí. Los invitados reciben hasta {{freeCreditsGuest}} créditos gratis al mes. Una cuenta gratuita y verificada lo sube a {{freeCreditsSignedIn}}, y una suscripción confirmada al boletín a {{freeCreditsMax}}.",
          },
          q6: {
            question:
              "¿Qué diferencia hay entre modelos abliterados y sin censura?",
            answer:
              "Los modelos abliterados son modelos populares a los que se les ha quitado el reflejo de negarse, así que responden en lugar de esquivar. Uncensored LM es distinto: está entrenado con libros y documentos prohibidos en el internet convencional, y el resultado es un modelo con opiniones políticas a contracorriente.",
          },
          q7: {
            question: "¿Cómo consigo acceso a la API?",
            answer:
              "Las claves API se desbloquean con tu primera compra, un plan o un paquete de créditos. Los créditos gratis no desbloquean la API. Después creas una clave en tu cuenta y apuntas cualquier cliente de OpenAI o Anthropic a nuestra URL base.",
          },
          q8: {
            question: "¿Puedo ejecutar {{appName}} en mi propio servidor?",
            answer:
              "Sí. El código es abierto. Clona el repositorio, ejecuta bun i y vibe dev, y termina la configuración en el navegador. Puedes conectar tu instancia a tu cuenta de {{appName}}.",
          },
        },
      },
    },
  },
};
