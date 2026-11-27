import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a SillyTavern: rol con IA sin instalar nada (2026)",
    description:
      "SillyTavern es gratis, pero pide Node.js, un motor de modelos y no se instala en iPhone. Compara {{appName}}, RisuAI, Agnaistic, KoboldCpp, Janitor AI y más.",
    category: "Comparativa",
    imageAlt: "Alternativas a SillyTavern, alojadas y locales, comparadas",
    keywords:
      "alternativas a SillyTavern, alternativa a SillyTavern, apps como SillyTavern, SillyTavern para iPhone, SillyTavern online, SillyTavern sin instalar, RisuAI vs SillyTavern, KoboldCpp, Agnaistic, interfaz de rol con IA, SillyTavern alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "9 min de lectura",
    title: "Alternativas a SillyTavern sin configuración",
    subtitle:
      "{{count}} alternativas y {{appName}}, desde otras interfaces de código abierto hasta chats alojados. Comprobadas en sus propias páginas el {{date}}.",
  },
  intro: {
    lead: "SillyTavern es la navaja suiza del rol con IA. Gratis, de código abierto, configurable hasta el infinito. También pide Node.js, un motor de modelos, un archivo de configuración y, en el móvil, Termux.",
    p2: "A algunos les encanta. Otros solo quieren escribir. Aquí van las alternativas, desde clones de código abierto con las mismas fichas hasta apps alojadas sin nada que instalar, comprobadas el {{date}}.",
  },
  subject: {
    title: "SillyTavern hoy",
    intro:
      "La versión 1.19.1 salió el 19 de noviembre de 2026. Lo que dice la propia documentación del proyecto.",
    plans:
      "Precio: gratis y de código abierto (AGPL-3.0). Los desarrolladores no ofrecen ningún servicio alojado, así que pagas la API de modelos que conectes, o nada con un modelo local.",
    filter:
      "Filtro: no tiene uno propio. Lo que se permite lo decide el modelo o el proveedor conectado.",
    privacy:
      "Privacidad: los chats viven en la carpeta de datos de tu propia instalación. Todo lo que envías a una API en la nube sigue la política de ese proveedor.",
    extra:
      "Instalación: Node.js 20 o superior, Git y luego un motor. En Android funciona con Termux, en iPhone no se puede instalar. El acceso remoto exige una lista blanca o contraseña, y la documentación desaconseja exponerlo a internet.",
  },
  why: {
    title: "Por qué la gente busca otra opción",
    intro: "Las mismas cuatro quejas, con las palabras del propio proyecto.",
    setup:
      "Configurar el motor. Los motores locales pueden ser complejos y el equipo no les da soporte.",
    mobile:
      "Móvil. Android necesita Termux y puede cerrar el servidor en segundo plano. En iPhone no hay forma de instalarlo.",
    security:
      "La seguridad corre de tu cuenta. La versión 1.19.1 corrigió scripts que se ejecutaban desde fichas de personaje y chats importados.",
    cost: "Pagar dos veces. Un alojamiento gestionado cobra solo por alojar, y la API del modelo va aparte.",
  },
  criteria: {
    title: "Qué comprobar antes de cambiar",
    intro: "Cinco preguntas ordenan las opciones.",
    one: "Instalación: navegador, app de escritorio o un servidor que gestionas y actualizas tú.",
    two: "Fichas: ¿importa fichas PNG o JSON y lorebooks de SillyTavern y Chub?",
    three: "Modelos: tu propia clave API, ejecución local o modelos incluidos.",
    four: "Funciones: chats de grupo, lorebooks, generación de imágenes y voz.",
    five: "Coste: software gratis más tarifas de API, tarifa plana o pago por mensaje.",
  },
  table: {
    title: "Todas, lado a lado",
  },
  us: {
    title: "{{appName}}: sin instalar, con los modelos incluidos",
    intro:
      "Abre un navegador en cualquier dispositivo, iPhone incluido. {{modelCount}} modelos ya están conectados, así que no hay clave API que pegar.",
    models:
      "Modelos: {{uncensored}} sin censura junto a {{mainstream}} convencionales y {{open}} abiertos. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, con el resultado de un modelo con opiniones políticas contrarias.",
    fit: "Personajes: la habilidad de rol o tu propio personaje como habilidad. La memoria conserva datos entre chats, y {{imageModels}} modelos de imagen ilustran una escena en el mismo hilo.",
    privacy:
      "Privacidad: los chats de incógnito se quedan en el almacenamiento local de tu navegador, sin cuenta.",
    price:
      "Precio: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta, {{maxCredits}} con el boletín. Planes: {{planList}}. Un solo saldo para todos los modelos.",
    api: "API: endpoints compatibles con OpenAI y Anthropic, así que puedes seguir conectando SillyTavern a nuestros modelos. Cualquier compra la desbloquea.",
    weak: "Dónde gana SillyTavern: control total sobre prompts, presets y extensiones, chats de grupo, lorebooks e importación de fichas. Lo nuestro también es de código abierto, pero es una plataforma, no un kit de herramientas de rol.",
    ownLink: "Ver {{ownModel}}",
    skillLink: "Abre la habilidad de rol",
  },
  list: {
    title: "Las alternativas documentadas, una a una",
    intro:
      "Las plataformas con perfil completo en nuestros datos de comparación, comprobadas en sus propias páginas. Las interfaces de código abierto están en la tabla de arriba.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelos:",
    filter: "Filtro:",
    price: "Precio:",
    priceValue: "Plan gratis: {{free}}. De pago: {{plans}}.",
    pro: "Lo mejor:",
    con: "La pega:",
    forWho: "Elígela si:",
    versusLink: "{{appName}} vs {{name}}: comparación completa",
    visit: "Visitar {{name}}",
  },
  stay: {
    title: "Cuándo SillyTavern sigue siendo la opción correcta",
    intro: "Para muchos usuarios avanzados, lo es.",
    one: "Ejecutas modelos en local y no quieres que nada salga de tu equipo.",
    two: "Vives entre extensiones, presets, reglas regex y chats de grupo.",
    three:
      "Ya tienes claves API y quieres una sola interfaz para todas. La nuestra puede ser una de esas claves.",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor alternativa a SillyTavern?",
      a: "El clon más cercano: RisuAI, de código abierto, con lorebooks, chats de grupo y versión web. Local y sencillo: KoboldCpp o LM Studio. Biblioteca de personajes alojada: Janitor AI o Chub. Nada que instalar y modelos incluidos: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratis a SillyTavern?",
      a: "RisuAI, Agnaistic, KoboldCpp y Talemate son software gratuito. El modelo lo sigues pagando, salvo que lo ejecutes en tu propio hardware. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta, {{maxCredits}} con el boletín, modelos incluidos.",
    },
    filter: {
      q: "¿Qué alternativas permiten rol sin censura?",
      a: "Las interfaces heredan las normas del modelo, así que elige un modelo sin censura. En local, KoboldCpp o LM Studio ejecutan modelos abliterated. En la nube, {{appName}} ofrece {{uncensored}} modelos sin censura tras una confirmación 18+ única. Janitor AI y Chub permiten rol adulto según sus propias normas.",
    },
    privacy: {
      q: "¿Una alternativa alojada es tan privada como SillyTavern?",
      a: "No del todo. Un modelo local lo mantiene todo en tu equipo. Un modelo alojado siempre ve el prompt al que responde. El modo incógnito de {{appName}} guarda el historial en tu navegador en lugar de en un servidor.",
    },
    move: {
      q: "¿Puedo usar SillyTavern en iPhone?",
      a: "No directamente. Lo alojas en un PC o servidor y lo abres en Safari, lo que implica configurar el acceso remoto. Una app web como {{appName}} o Janitor AI funciona en iPhone sin ese paso.",
    },
  },
  cta: {
    title: "Sáltate la configuración. Quédate con la historia.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta y sin clave API.",
    start: "Empieza una partida de rol",
    chat: "Abre un chat de incógnito",
  },
};
