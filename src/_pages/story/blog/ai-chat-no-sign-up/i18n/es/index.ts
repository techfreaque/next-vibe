import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Chat IA sin registro: sin email, sin cuenta | {{appName}}",
    description:
      "Chat IA sin registro y sin cuenta en {{appName}}: créditos gratis cada mes, modelos desde los convencionales hasta los sin censura, historial de incógnito guardado en tu navegador. Qué significa anónimo aquí y qué no.",
    category: "Guía",
    imageAlt: "Un chat de IA que empieza sin formulario de registro",
    keywords:
      "chat IA sin registro, IA sin cuenta, chat IA anónimo, chat IA sin iniciar sesión, chat IA gratis sin registro, IA gratis sin registrarse, chat IA privado, chat IA sin censura sin registro, chat IA de incógnito, chatbot sin email, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía",
    readTime: "6 min de lectura",
    title: "Chat IA sin registro. Sin email. Sin número de teléfono.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, {{modelCount}} modelos de chat, un historial de incógnito que se queda en tu navegador. Y una lista honesta de lo que el anonimato no cubre.",
  },
  intro: {
    lead: "Quieres hacer una sola pregunta. El chatbot te pide primero tu email, una contraseña, un número de teléfono y un clic en el aviso de cookies. Cuando por fin entras, ya se te olvidó la pregunta.",
    p2: "En {{appName}} abres un chat y escribes. Sin formulario. Esta guía muestra qué obtienes sin cuenta, qué significa de verdad anónimo aquí y cuándo vale la pena una cuenta gratuita.",
  },
  guest: {
    title: "Qué obtienes sin cuenta",
    intro:
      "Sin registro no significa una demo. Es el producto de verdad, con cupo.",
    credits:
      "{{guestCredits}} créditos gratis cada mes, sin cuenta, sin tarjeta. El cupo se renueva cada mes.",
    models:
      "Los {{modelCount}} modelos de chat de {{labCount}} laboratorios: convencionales, abiertos y sin censura, en un solo selector de modelos.",
    uncensored:
      "También los {{uncensored}} modelos sin censura, tras una confirmación 18+ única.",
    media:
      "Generación de imágenes, vídeo, música y voz con los mismos créditos: {{imageModels}} modelos de imagen, {{videoModels}} modelos de vídeo.",
    mediaLink: "Crea imágenes, vídeo y música",
  },
  starters: {
    title: "Los modelos más baratos para empezar",
    intro:
      "Los dos modelos de texto más baratos de cada categoría, sacados de nuestro registro. Barato no significa flojo: son los que hacen rendir más {{guestCredits}} créditos.",
    footnote:
      "Por mensaje significa un intercambio de referencia en la ruta más barata. Con {{cheapestModel}}, {{guestCredits}} créditos de invitado dan para unos {{guestMessages}} mensajes cortos. Los chats largos y las respuestas largas cuestan más.",
  },
  table: {
    model: "Modelo",
    context: "Contexto",
    price: "Por mensaje",
    chat: "Pruébalo",
    chatLink: "Chatea con {{model}}",
  },
  anonymous: {
    title: "Qué significa anónimo aquí, y qué no",
    intro:
      "Privado no es invisible. Esta es la versión honesta, sin prometer nada que no diga nuestra política de privacidad.",
    yesTitle: "Lo que se queda contigo",
    noEmail:
      "Sin nombre, sin email, sin número de teléfono. No necesitamos ninguno para responderte.",
    incognito:
      "Los chats de incógnito se guardan en tu navegador, no en nuestros servidores. Borra los datos del navegador y el historial desaparece.",
    trackers:
      "Sin rastreadores de terceros, sin píxeles publicitarios, sin fingerprinting. Una sola cookie propia le dice a nuestro servidor con qué navegador está hablando.",
    noTitle: "Quién ve tu mensaje de todos modos",
    provider:
      "El proveedor de IA: cada mensaje pasa por nuestro servidor hasta la empresa que ejecuta el modelo, que ve el prompt para poder responderlo. Toda IA alojada funciona así.",
    media:
      "Los archivos generados: las imágenes, el audio y el vídeo creados sin cuenta se guardan en nuestros servidores para que puedas verlos y descargarlos, y se borran automáticamente a los 4 meses si nunca te registras.",
    network:
      "La red: como cualquier web, nuestro servidor ve la conexión que abre tu navegador. Una VPN oculta tu dirección también ante nosotros.",
    callout:
      "¿Necesitas un prompt que nunca salga de tu equipo? Ningún chat alojado puede prometerlo. Ejecuta un modelo en local o alójalo tú mismo.",
    policyLink: "Leer la política de privacidad",
  },
  steps: {
    title: "De cero a una respuesta en menos de un minuto",
    intro: "Cuatro pasos. Ninguno es un formulario.",
    open: {
      title: "Abre un chat de incógnito",
      body: "Un clic desde cualquier página. Ninguna pantalla de cuenta por delante.",
    },
    pick: {
      title: "Elige un modelo",
      body: "Empieza por uno barato y cambia cuando quieras. El chat conserva su historial al cambiar de modelo.",
    },
    confirm: {
      title: "Confirma que tienes 18+ si vas sin censura",
      body: "Los modelos sin censura piden una sola vez una confirmación 18+ y aceptar los términos. Los modelos convencionales y abiertos no piden nada.",
    },
    ask: {
      title: "Pregunta",
      body: "{{guestCredits}} créditos al mes. Cuando se acaben, espera al mes siguiente o crea una cuenta gratuita.",
    },
  },
  account: {
    title: "Cuándo vale la pena una cuenta gratuita",
    intro: "Nunca obligatoria. A veces útil.",
    credits:
      "Hasta {{freeCredits}} créditos gratis al mes con un email verificado, en lugar de {{guestCredits}}.",
    sync: "Chats guardados en tus carpetas privadas, en cada dispositivo donde inicies sesión.",
    control:
      "Exporta todos tus datos en JSON o elimina tu cuenta desde Ajustes. La eliminación borra tus datos personales.",
    plans:
      "Planes desde {{subPrice}} al mes cuando los créditos gratis no alcanzan.",
  },
  stricter: {
    title: "¿Necesitas más privacidad?",
    intro: "Elige la configuración que se ajuste al riesgo.",
    selfHost: "Aloja {{appName}} tú mismo: tu servidor, tus logs, tus reglas",
    local: "Ejecuta un modelo sin censura en local, o en línea sin GPU",
    venice: "Alternativas a Venice AI, comparadas en privacidad",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "¿Hay un chat de IA sin registro?",
      a: "Sí. En {{appName}} abres un chat y escribes, sin cuenta y sin email. Los invitados reciben {{guestCredits}} créditos gratis al mes para los {{modelCount}} modelos de chat.",
    },
    anonymous: {
      q: "¿Un chat de IA sin cuenta es realmente anónimo?",
      a: "Anónimo ante nosotros en el sentido de que nunca preguntamos quién eres y el historial de incógnito se queda en tu navegador. No invisible: el proveedor de IA ve cada prompt para responderlo, y nuestro servidor ve tu conexión como cualquier web.",
    },
    free: {
      q: "¿Es gratis?",
      a: "{{guestCredits}} créditos al mes son gratis sin cuenta, hasta {{freeCredits}} con una cuenta gratuita verificada. Cuánto rinden depende del modelo: el más barato, {{cheapestModel}}, cuesta {{cheapestPrice}} por mensaje.",
    },
    uncensored: {
      q: "¿Puedo usar IA sin censura sin registrarme?",
      a: "Sí. Los {{uncensored}} modelos sin censura funcionan sin cuenta tras una confirmación 18+ única.",
    },
    saved: {
      q: "¿Se guardan mis chats?",
      a: "Los chats de incógnito se guardan solo en tu navegador, así que puedes volver a ellos en el mismo dispositivo. Borra los datos del navegador y desaparecen. Con una cuenta también puedes guardar chats en carpetas privadas que se sincronizan entre dispositivos.",
    },
    runOut: {
      q: "¿Qué pasa cuando se acaban mis créditos gratis?",
      a: "Espera al cupo del mes siguiente, o crea una cuenta gratuita y verifica tu email para tener hasta {{freeCredits}} créditos al mes. Los créditos que ya gastaste como invitado ese mes cuentan para ese total.",
    },
    chatLink: "Chat de IA sin censura en tu navegador",
    chatgptLink: "Una alternativa a ChatGPT con modelos sin censura",
  },
  cta: {
    title: "Sin formulario. Solo pregunta.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, todos los modelos, de incógnito por defecto.",
    start: "Empieza un chat de incógnito",
    models: "Compara todos los modelos",
  },
};
