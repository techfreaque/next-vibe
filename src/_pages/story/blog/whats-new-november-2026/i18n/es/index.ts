import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Lo nuevo: seis meses en una página - {{appName}}",
    description:
      "Parar significa parar. La voz funciona en iPhone. Tu AI corre a través de tus máquinas. El auto hospedaje no necesita Docker. Y un robot de prueba cerró ocho agujeros de seguridad. Todo desde mayo.",
    category: "Actualización de productos",
    imageAlt: "{{appName}} - Noviembre 2026 actualización del producto",
    keywords:
      "{{appName}}, actualización de productos, Hermes, Thea, PGlite, self-host, discurso a texto, E2E pruebas, seguridad",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Actualización de productos",
    readTime: "6 min leer",
    title:
      "Seis meses de novedades: más rápido, más seguro y en cualquier equipo.",
    subtitle:
      "Parar significa parar. La voz funciona en iPhone. Tu AI te sigue a través de máquinas. El auto hospedaje no necesita Docker. Y un robot de prueba cerró ocho agujeros de seguridad.",
  },
  intro: {
    lead: "Nuestra última actualización fue en mayo. Desde entonces, derribamos la base de códigos a los sementales, la reconstruimos más plana y pasamos meses arreglando lo que la gente real golpeó en la producción.",
    p1: "No hay lista de 200 puntos de bala. Esto es lo que realmente sentirás - agrupado por donde lo sientes.",
  },
  chat: {
    title: "Chat que obedece",
    intro:
      "Las pequeñas cosas que hicieron charlar se sienten lentas o obstinadas.",
    stop: {
      title: "Parar significa parar",
      body: "Hit stop y tokens dejan de aparecer en ese instante - no esperando que el servidor desgarre. Parar ahora también llega a chats incógnitos y conectados, donde solía hacer nada.",
    },
    input: {
      title: "Tamaño de entrada a su modelo",
      body: "La caja del mensaje sabe cuánto espacio ha dejado el modelo seleccionado en este hilo, en lugar de un límite plano para cada modelo.",
    },
    reasoning: {
      title: "Los modelos mantienen su tren de pensamiento",
      body: "Los bloques de resonancia se envían de nuevo al modelo en el siguiente turno en lugar de ser despojado - por lo que los modelos de pensamiento construyen sobre lo que ya han trabajado.",
    },
    queue: {
      title: "Escribe mientras funciona",
      body: "Envíe mensajes mientras el AI es de media respuesta - que colan en orden. La herramienta larga funciona compacta su contexto medio corriente en lugar de golpear la pared.",
    },
  },
  voice: {
    title: "Voz que funciona en todas partes",
    intro: "El discurso a texto obtuvo la atención que necesitaba.",
    ios: {
      title: "iPhone y iPad fijos",
      body: "Safari en iOS suspendió el motor de audio, así que la dictador murió silenciosamente. Ahora se reanuda adecuadamente.",
    },
    long: {
      title: "Recorda mientras quieras.",
      body: "Las grabaciones se dividen en pedazos, por lo que la dictación ya no es caducidad por una carga.",
    },
    windows: {
      title: "Windows fijo",
      body: "Una carrera de correcciones hizo trabajo de discurso a texto en los escritorios de Windows.",
    },
  },
  agents: {
    title: "Su AI, a través de sus máquinas",
    intro:
      "Thea corre en la nube. Hermes funciona en tu computadora. Ahora realmente trabajan juntos.",
    twoWay: {
      title: "Hilos remotos de dos vías",
      body: "Coloque un hilo de la nube a su máquina o espalda, en ambas direcciones. Si el otro lado no tiene llave API, tu lado se cae y lo ejecuta localmente.",
      link: "Cómo habla Hermes y Thea",
    },
    coding: {
      title: "Un agente de codificación que puedes ver",
      body: "Thea puede iniciar un agente de codificación interactivo en su máquina - una ventana de consola real que se puede ver - rastreado como una tarea, con el resultado reportado atrás.",
      link: "Conoce al agente de codificación",
    },
    tools: {
      title: "Herramientas de arrastre",
      body: "Mejor automatización del navegador con emulación de dispositivos, herramientas de escritorio en Windows y herramientas SSH para cada cliente - no sólo los administradores.",
    },
  },
  selfHost: {
    title: "El auto hospedaje es fácil.",
    intro:
      "Ejecutar su propia instancia solía significar Docker y una cadena de herramientas C++. Ya no.",
    pglite: {
      title: "No necesita Docker",
      body: "Punto DATABASE_URL en un archivo y el servidor se ejecuta en un Postgres embebido (PGlite). Las migraciones y las semillas sólo funcionan.",
    },
    windows: {
      title: "Windows es de primera clase",
      body: "Meses de Windows corrige: caminos, bloqueos de archivos, visualización de usuarios, funciones de base de datos. Clone, instala, corre.",
    },
    native: {
      title: "No se requiere ningún compilador",
      body: "El hashing de contraseña se movió a los binarios preconstruidos - no node-gyp, sin herramientas de construcción. El mismo algoritmo, los hashes existentes siguen siendo válidos.",
    },
    revive: {
      title: "Vuelve por su cuenta.",
      body: "El servidor de producción se reinicia después de un accidente, y una base de datos reiniciar ya no puede llevar la aplicación con él.",
    },
  },
  security: {
    title: "Más seguro por defecto",
    intro: "El trabajo de seguridad que nunca verás - cuál es el punto.",
    e2e: {
      title: "Un robot prueba cada página",
      body: "60 suites de extremo a extremo ahora conducen las páginas reales en un navegador real. Encontraron y cerramos ocho agujeros de seguridad, desde una red abierta a los archivos privados grabados públicamente.",
      link: "Lea lo que encontró",
    },
    patches: {
      title: "Imagen de la base empotrada",
      body: "Nuestro contenedor tira los últimos parches de seguridad alpino, incluyendo la fijación para CVE-2026 -111497.",
    },
    toolCalls: {
      title: "Menos llamadas de herramientas rotas",
      body: "Cuando un modelo envía la herramienta malformada JSON, se repara en lugar de fallar todo el turno.",
    },
  },
  cta: {
    title: "Míralo por ti mismo.",
    subtitle:
      "Cada cambio arriba es en vivo en {{appName}} hoy - y en el código de código de código abierto si usted ejecuta su propio.",
    chat: "Empieza a chatear",
    selfHost: "Auto hospedarlo",
  },
};
