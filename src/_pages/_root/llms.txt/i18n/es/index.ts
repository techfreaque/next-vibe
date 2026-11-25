import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  summary:
    "{{appName}} es una plataforma de chat AI con modelos de chat {{modelCount}} de laboratorios {{providerCount}}: estándar, abierto y sin censura. Elige el nivel de filtro por chat. Paga por uso con créditos. Fuente abierta y auto-hostable.",
  intro:
    "Chat, imagen, vídeo, música, voz y modelos de transcripción en un saldo de crédito. Uselos en el navegador, desde la línea de comandos, como un MCP o a través de un servidor OpenAI y Anthropic compatibles API. Construido en next-vibe, un marco de código abierto TypeScript donde una definición de punto final se convierte en la web UI, el comando CLI, la herramienta AI y la herramienta MCP.",
  facts: {
    heading: "Principales hechos",
    models:
      "Modelos: Modelos de chat {{modelCount}} ({{mainstream}} mainstream, {{open}} open, {{uncensored}} uncensored) de laboratorios {{providerCount}}, más modelos de imagen {{mediaCount}}, video, música, discurso y transcripción.",
    free: "Créditos gratis cada mes: {{guest}} sin cuenta, {{signedIn}} con una cuenta gratuita, {{max}} con una cuenta gratuita y una suscripción confirmada al boletín informativo. No se necesita tarjeta.",
    paid: "Planes de pago: {{plans}}. Todos los planes se pueden facturar por año al precio de 11 meses (Starter: {{subYearPrice}} al año). Los suscriptores pueden recargar con un paquete de {{packCredits}} créditos por un pago único de {{packPrice}}. Los créditos del paquete nunca vencen.",
    planItem: "{{name}} {{price}} al mes para créditos {{credits}}",
    credit:
      "1 crédito = {{creditValue}}. Cada página modelo enumera su precio por mensaje.",
    api: "API : Finalizaciones de chat OpenAI, Respuestas OpenAI y formatos de mensajes Anthropic en una base URL ({{apiBaseUrl}}). Las mismas llamadas claves {{mediaCount}} media modelos a través de OpenAI -format endpoints: /v1/images/generaciones, /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions, /v1/audio/translations, /v1/videos, /v1/music (video y música ejecutan trabajos async). Necesita una cuenta pagada: cualquier plan, desde {{subPrice}} al mes. Cuentas gratuitas consiguen HTTP 402.",
    uncensored:
      "Tier sin censura: dos tipos de modelos. Los modelos abliterados son los modelos principales cambiados por lo que dejan de hacer preguntas. Los modelos realmente no censurados como UncensoredLM son entrenados en libros y documentos prohibidos de Internet, lo que les da opiniones políticas contrarias. El tier no censurado necesita una confirmación de 18+ de una sola vez.",
    openSource:
      "Fuente abierta: el código de aplicación está licenciado en MIT, el núcleo marco next-vibe es GPL-3.0. Código fuente: {{repoUrl}}",
    referral:
      "Programa de referencia: comisión recurrente {{direct}} % en pagos referidos, además de una piscina {{upline}} % compartida a través de los niveles fijos de {{levels}}. Pagado como créditos o BTC / USDC, pago mínimo {{minPayout}}.",
    languages:
      "Idiomas del sitio: inglés ({{en}}), alemán ({{de}}), polaco ({{pl}}), francés ({{fr}}), italiano ({{it}}), español ({{es}}) y eslovaco ({{sk}}).",
  },
  pages: {
    heading: "Páginas principales",
    models: "Modelos",
    modelsDesc:
      "cada modelo con precio por mensaje, ventana contextual, comparaciones de nivel de contenido y cabeza a cabeza",
    pricing: "Precios",
    pricingDesc: "créditos gratis, los cuatro planes y los paquetes de recarga",
    api: "API docs",
    apiDesc:
      "base URL, autenticación, chat y puntos finales medios, muestras de código",
    blog: "Blog",
    blogDesc: "guías, comparaciones de modelos y notas de construcción",
    partners: "Asociados",
    partnersDesc: "programa para creadores, boletines y directorios",
    earn: "Programa de referencia",
    earnDesc: "cómo funciona la comisión y los pagos",
    selfHost: "Self-host",
    selfHostDesc: "ejecutar su propia instancia en su propio hardware",
    framework: "Marco next-vibe",
    frameworkDesc: "la pila de código abierto detrás de {{appName}}",
    refusalIndex: "Índice de referencia",
    refusalIndexDesc:
      "las mismas preguntas a cada modelo, cada semana: quién responde, quién se encarga, quién se niega",
    skills: "Skills",
    skillsDesc:
      "especialistas y personajes listos, cada uno con su propio impulso, modelo y herramientas",
    help: "Ayuda",
    helpDesc: "FAQ y contacto",
  },
  compare: {
    heading: "Comparaciones",
  },
  blog: {
    heading: "Blogs",
  },
  optional: {
    heading: "Facultativo",
    full: "Versión completa",
    fullDesc: "este archivo además de la lista completa del modelo",
    sitemap: "Mapa del sitio",
    sitemapDesc: "cada página pública en cada idioma",
    about: "Sobre nosotros",
    privacy: "Política de privacidad",
    terms: "Términos de servicio",
    imprint: "Imprint",
  },
  full: {
    chatHeading: "Modelos de chat",
    chatIntro:
      "Modelos de chat actuales. Precio por mensaje es para una sesión normal de chat (tokens de entrada {{inputTokens}}, tokens de salida {{outputTokens}}) en el proveedor más barato.",
    chatLine:
      "{{lab}}, {{tier}}, {{context}} tokens context, acerca de créditos {{credits}} por mensaje",
    legacyHeading: "Modelos de chat más antiguos, todavía disponibles",
    legacySuccessor: "sustituido por {{successor}}",
    mediaHeading: "Modelos de medios",
    mediaLine: "{{lab}}, {{type}}",
    mediaTypes: {
      image: "generación de imágenes",
      video: "generación de vídeo",
      audio: "generación de música",
      tts: "texto a discurso",
      stt: "discurso a texto",
    },
  },
};
