import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Home",
  },
  meta: {
    contact: {
      title: "Contacto &amp; Soporte - {{appName}}",
      description:
        "Obtener ayuda con {{appName}} - plataforma de chat AI sin censura. Contacta con nuestro equipo de apoyo para la asistencia.",
      category: "Support",
      imageAlt: "{{appName}} Support",
      keywords: "contacto, soporte, ayuda, {{appName}}, chat de ai, asistencia",
      ogTitle: "Contacto {{appName}} Support",
      ogDescription: "Consigue ayuda con tu experiencia de chat AI sin censura",
      twitterTitle: "Contacto {{appName}}",
      twitterDescription: "Llegar a nuestro equipo de apoyo",
    },
  },
  pages: {
    help: {
      title: "¿Cómo podemos ayudarle?",
      subtitle:
        "Obtener soporte para su experiencia de chat AI sin censura o encontrar respuestas a preguntas comunes",
      info: {
        title: "Información de contacto",
        supportEmail: "Soporte Email",
        discord: "Discord",
        discordUrl: "Únase a nuestra comunidad Discord",
      },
      faq: {
        title: "Preguntas frecuentes",
        questions: {
          q1: {
            question: "¿Qué es {{appName}}?",
            answer:
              "{{appName}} es una plataforma de chat AI sin censura con acceso a los modelos {{modelCount}} AI. Combinamos conversaciones AI honestas con funciones avanzadas como gestión de carpetas, caracteres personalizados y soporte multimodelo.",
          },
          q2: {
            question: "¿Qué métodos de pago aceptas?",
            answer:
              "Tarjeta, PayPal, Apple Pay y Google Pay mediante Stripe. Criptomonedas (Bitcoin, Ethereum y monedas estables) mediante NOWPayments. Los planes empiezan en {{subscriptionPrice}} al mes. Con una suscripción puedes recargar con paquetes de créditos.",
          },
          q3: {
            question: "¿Cómo funciona el sistema de crédito?",
            answer:
              "Cada uso consume créditos. Puedes empezar con los gratis. Créditos mensuales por plan: {{subscriptionPrice}} por {{subscriptionCredits}}, {{plusPrice}} por {{plusCredits}}, {{proPrice}} por {{proCredits}}, {{ultraPrice}} por {{ultraCredits}}. Si tienes una suscripción, puedes recargar con paquetes de {{packPrice}} por {{packCredits}} créditos. Los créditos de los paquetes nunca vencen y sirven para los {{modelCount}} modelos de IA.",
          },
          q4: {
            question: "¿Mis datos son privados y seguros?",
            answer:
              "¡Sí! Las carpetas privadas sólo son visibles para usted, el modo incognito mantiene los chats fuera de nuestros servidores (los medios generados se almacenan temporalmente por razones técnicas), y puede exportar todos sus datos o eliminar su cuenta (y los datos personales atados a ella) desde Ajustes. Tus conversaciones son tuyas - nunca vendemos tus datos. La encriptación de extremo a extremo está llegando pronto.",
          },
        },
      },
    },
  },
};
