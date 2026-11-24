import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a Character.AI para rol (2026)",
    category: "Rol con IA",
    description:
      "Compara alternativas a Character.AI para rol, ficción y compañía virtual, como Janitor AI, SpicyChat, DreamGen, SillyTavern y {{appName}}.",
    imageAlt: "Alternativas a Character.AI para rol y compañía virtual",
    keywords:
      "alternativas a Character AI, Character AI sin filtros, rol con IA, Janitor AI, SillyTavern",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Rol con IA",
    readTime: "9 min de lectura",
    title: "Alternativas a Character.AI para rol",
    subtitle:
      "Encuentra personajes listos para una escena, un compañero con memoria o un modelo que puedas elegir. Precios verificados el {{date}}.",
  },
  intro: {
    lead: "Con Janitor AI puedes elegir un personaje y empezar. SillyTavern te deja configurar todo por tu cuenta. Kindroid o Nomi encajan si buscas un compañero que se acuerde de ti.",
    p2: "Desarrollamos {{appName}} y lo presentamos primero por la elección de modelos y la importación de personajes. Los precios de los demás servicios están en dólares estadounidenses y salen de páginas oficiales o fichas del editor consultadas el {{date}}.",
  },
  characterAi: { title: "Qué ofrece Character.AI hoy" },
  switch: {
    title: "Por qué algunas personas buscan una alternativa",
    intro: "En las conversaciones públicas aparecen tres motivos distintos.",
    reasons: {
      filtering: {
        body: "Escenas interrumpidas. En su actualización a la comunidad de agosto de 2025, Character.AI reconoció que los usuarios se quejaban de que el filtro se interponía con demasiada frecuencia.",
        source: "Actualización de Character.AI en Reddit",
      },
      continuity: {
        body: "Pérdida del hilo. Una persona buscaba mejor memoria, diálogos creíbles y espacio para escribir sus propias intervenciones en escenas pausadas.",
        source: "Debate sobre rol y memoria en Reddit",
      },
      oldSite: {
        body: "El cierre del sitio antiguo. En un debate sobre quién se quedaba y quién se iba, una persona contó que la retirada del sitio la llevó a cambiar de servicio por completo.",
        source: "Debate sobre dejar Character.AI en Reddit",
      },
    },
  },
  criteria: {
    title: "Qué revisar antes de cambiar",
    intro:
      "Prueba la misma escena en dos aplicaciones. Vuelve al día siguiente y pregunta por un detalle del principio.",
    filter:
      "Comprueba qué temas permite el modelo y si la plataforma exige verificar la edad.",
    memory:
      "Fíjate si recupera detalles de escenas anteriores con recuerdos guardados, resúmenes o fichas del mundo.",
    price:
      "Cuenta los mensajes o créditos que usa tu modelo favorito, incluidos los reintentos.",
    privacy: "Averigua dónde queda el historial y quién procesa tus mensajes.",
    characters:
      "Elige si quieres un elenco listo, fichas de personaje editables o un compañero fijo.",
  },
  table: {
    title: "Character.AI y sus alternativas en una tabla",
  },
  us: {
    title: "1. {{appName}}: trae un personaje y elige su modelo",
    intro:
      "Inicia una escena en el navegador o crea un personaje recurrente como habilidad.",
    models:
      "Entre los {{modelCount}} modelos de chat hay {{uncensored}} sin censura, {{mainstream}} de uso general y {{open}} abiertos. Cambia de modelo en plena escena.",
    characters:
      "La habilidad de rol ayuda al modelo a mantenerse en el personaje. Explora las habilidades publicadas o crea las tuyas con el editor o el Creador de Habilidades.",
    consent:
      "Para usar los modelos sin censura, confirma una sola vez que tienes al menos 18 años y aceptas respuestas sin filtros.",
    import:
      "Importa un personaje desde un enlace público de Character.AI o Talkie. La copia acredita a su creador.",
    privacy:
      "El chat de incógnito funciona sin cuenta. El historial queda en tu navegador y el proveedor del modelo recibe cada mensaje para responder.",
    price:
      "{{guestCredits}} créditos al mes como invitado o {{freeCredits}} con una cuenta gratuita. Suscripciones desde {{subPrice}} al mes. El uso de los modelos consume créditos.",
    weak: "Character.AI y Janitor AI tienen catálogos más amplios para descubrir personajes. Si haces sesiones largas a menudo, una tarifa plana puede ser más fácil de presupuestar.",
    skillsLink: "Explorar habilidades integradas y de la comunidad",
    roleplayLink: "Abrir la habilidad de rol",
    creatorLink: "Crear un personaje con el Creador de Habilidades",
  },
  list: {
    title: "Nueve alternativas en detalle",
    intro:
      "Elige según tu forma de jugar. Consulta las fuentes al pie de cada opción.",
    heading: "{{number}}. {{name}}: {{bestFor}}",
    filter: "Reglas de contenido.",
    price: "Precio.",
    pro: "Punto fuerte.",
    con: "Límite.",
    versusLink: "{{appName}} frente a {{name}}",
  },
  options: {
    characterAi: {
      summary:
        "Character.AI aloja personajes públicos y personalizados para rol escrito, con voces y llamadas. El chat estándar sigue siendo gratuito e ilimitado para los usuarios habilitados.",
      pricing:
        "Chat estándar gratis. Las opciones en Estados Unidos son {{plans}}. Lite da algunas funciones premium y conserva los anuncios. Plus incluye todo el sistema de memoria y elimina los anuncios.",
      filter:
        "El contenido pornográfico está prohibido. El chat abierto con personajes es para mayores de 18 años.",
      privacy: "Ajuste para el entrenamiento de modelos",
      pro: "Un catálogo amplio de personajes de fandom, con voces y llamadas integradas.",
      con: "Los planes de pago añaden funciones y mantienen las reglas sobre contenido explícito.",
    },
    janitorAi: {
      bestFor: "personajes de la comunidad",
      summary:
        "Millones de personajes de la comunidad, perfiles de rol editables y conexión opcional a modelos externos.",
      pricing:
        "Chats estándar ilimitados. La App Store de Estados Unidos muestra {{plans}}.",
      filter:
        "Los personajes Limitless pueden tratar temas para adultos. La aplicación móvil empieza en modo restringido.",
      privacy: "Los proxies externos pueden recibir mensajes",
      pro: "Un catálogo amplio y chat estándar gratuito sin tope. Janitor+ multiplica el contexto por cinco e incluye prioridad y nuevas versiones de respuestas con modelos premium.",
      con: "El contexto gratis ronda los 9 000 tokens. Configurar un proxy externo puede llevar tiempo y tener un costo adicional.",
    },
    sillyTavern: {
      bestFor: "control local",
      summary:
        "Interfaz gratuita de código abierto para modelos locales o alojados. Admite fichas de personaje, fichas del mundo y ajustes de instrucciones.",
      pricing:
        "El programa es gratis. Un modelo local usa tu equipo. Las API alojadas se cobran por separado.",
      filter: "El filtrado depende del modelo y del servicio que lo ejecuta.",
      privacy: "Historial local. Las API alojadas reciben tus mensajes.",
      pro: "Controlas las fichas, el contexto y el modelo. Puedes ejecutar todo en tu equipo.",
      con: "Tú instalas y mantienes la interfaz y aportas el modelo. Los modelos locales requieren un equipo adecuado.",
    },
    chub: {
      bestFor: "fichas del mundo e historias con varias ramas",
      summary:
        "Catálogo de fichas e interfaz alojada con notas que se activan mediante palabras clave, varios personajes por chat y un árbol de conversaciones.",
      pricing:
        "Chub describe créditos de prueba ocasionales. La suscripción a los modelos de Chub cuesta {{plans}}. Los modelos externos tienen sus propias tarifas.",
      filter:
        "Chub describe sus modelos como no censurados. Los proveedores externos aplican sus propias reglas.",
      privacy:
        "Los chats compartidos pueden aparecer en público. Las API externas reciben mensajes.",
      pro: "Explora ramas de una escena, agrega notas del mundo y exporta a JSONL para SillyTavern o a texto plano.",
      con: "Para usarlo con frecuencia toca suscribirse o configurar un modelo. Los créditos de prueba son limitados y ocasionales.",
      free: "Créditos de prueba ocasionales",
    },
    crushOn: {
      bestFor: "rol para adultos listo para empezar",
      summary:
        "Personajes de la comunidad, escenas grupales, voces y cambio de modelo sin aportar una clave API.",
      pricing:
        "Chats ilimitados en los modelos gratuitos y 100 créditos al mes para modelos Pro. Los planes mensuales son {{plans}}.",
      filter:
        "Admite rol para adultos. Los modelos avanzados tienen sus propios límites de acceso y de créditos.",
      privacy:
        "La política consultada deja sin aclarar el acceso de los creadores",
      pro: "Entra en una escena grupal con un personaje del catálogo y cambia de modelo durante el chat.",
      con: "Pro y Ultra tienen condiciones distintas. Una suscripción conserva límites en algunos modelos.",
    },
    spicyChat: {
      bestFor: "personajes adultos y perfiles de rol",
      summary:
        "Plataforma alojada de rol para adultos, con personajes comunitarios, varios perfiles de usuario y herramientas de memoria en los planes de pago.",
      pricing:
        "Contexto gratis de 4 096 tokens. Las opciones anuales en Estados Unidos son {{plans}}. Consulta los planes mensuales en el sitio.",
      filter: "Admite rol para adultos y modera los personajes públicos.",
      privacy: "Servicio alojado. El chat actual aporta el contexto.",
      pro: "Los planes de pago permiten saltar la cola y editar recuerdos. Los superiores añaden memoria semántica e imágenes en la conversación.",
      con: "La opción gratis tiene anuncios y colas. La lectura en voz alta y los ajustes de generación requieren el plan superior.",
    },
    kindroid: {
      bestFor: "un compañero con llamadas en vivo",
      summary:
        "Crea un compañero con historia, memoria persistente, selfies y llamadas de voz o video.",
      pricing:
        "Prueba única de 50 mensajes, o 15 en algunas regiones. La App Store de Estados Unidos muestra {{plans}}. En la web puede costar menos.",
      filter:
        "Para adultos. Kindroid declara que actúa sobre la cuenta ante riesgos graves en el mundo real.",
      privacy: "Cifrado en reposo y en tránsito",
      pro: "Llamadas, mensajes espontáneos, chats grupales y selfies con un compañero que puedes volver a encontrar.",
      con: "Cuando se acaba la prueba o la suscripción, la cuenta queda en modo de lectura. La memoria adicional cuesta más.",
      free: "Prueba única de mensajes",
    },
    nomi: {
      bestFor: "un compañero con mensajes gratis a diario",
      summary:
        "Servicio de compañía con memoria a largo plazo, selfies, chats grupales y voz en planes de pago.",
      pricing:
        "50 mensajes diarios gratis. El plan Standard ofrece varios períodos ({{plans}}).",
      filter:
        "Para adultos. Nomi presenta el texto como no filtrado. Las imágenes tienen otros límites.",
      privacy: "Nomi afirma que no vende ni alquila datos personales",
      pro: "Conserva al mismo compañero a lo largo del tiempo o reúne a varios en un grupo.",
      con: "El chat gratuito tiene tope diario. La voz requiere una suscripción.",
    },
    venice: {
      bestFor: "chats privados con personajes y creación visual",
      summary:
        "Venice combina personajes, chat general de IA, generación de imágenes y varios modelos.",
      pricing:
        "Los modelos básicos gratis permiten 10 solicitudes de texto y 15 de imagen al día. {{plans}}. Crear personajes propios requiere Pro.",
      filter:
        "El filtro para adultos viene activo. Los usuarios de Pro que cumplan los requisitos pueden apagarlo.",
      privacy: "El historial queda en el dispositivo por defecto",
      pro: "Personajes, chat e imágenes en una aplicación. Los planes de pago ofrecen respaldo cifrado opcional.",
      con: "Las conversaciones gratuitas tienen un límite. Los modelos premium y parte de las funciones multimedia gastan créditos.",
    },
    nanoGpt: {
      bestFor: "elegir el modelo y pagar por uso",
      summary:
        "Chat web y API con modelos de texto y multimedia. Usa un ajuste predefinido o trae tus instrucciones de personaje.",
      pricing:
        "Un modelo web gratuito. Primer depósito desde 0,10 USD con criptomonedas o 1 USD con tarjeta. {{plans}}. PRO cubre una selección de modelos abiertos.",
      filter:
        "Para adultos. Las restricciones dependen del modelo y su proveedor.",
      privacy:
        "Historial local por defecto. Las políticas varían según el proveedor.",
      pro: "Paga solo lo que usas. La API también funciona con interfaces como SillyTavern.",
      con: "Tú preparas el personaje o la interfaz. La mayoría de los modelos consumen tu saldo.",
    },
  },
  import: {
    title: "Llévate un personaje de Character.AI",
    intro:
      "Inicia una historia nueva con los datos que su creador hizo públicos.",
    steps: {
      account: {
        title: "Inicia sesión",
        body: "Una cuenta gratuita te permite editar al personaje después de importarlo.",
      },
      create: {
        title: "Abre el editor de personajes",
        body: "En la sección de habilidades, crea una personalizada y selecciona la opción de importar desde un enlace.",
      },
      paste: {
        title: "Pega el enlace público",
        body: "Usa un enlace de Character.AI o Talkie. Se copian los campos visibles, como nombre, avatar, saludo y descripción. También se puede copiar la definición si es pública.",
      },
      model: {
        title: "Elige el modelo",
        body: "Empieza una conversación con tu copia y cambia de modelo dentro del mismo hilo cuando quieras.",
      },
    },
    callout:
      "La copia acredita a su creador y enlaza el original. Las conversaciones anteriores quedan en el otro servicio.",
  },
  privacy: {
    title: "A dónde van tus mensajes",
    intro: "Así funciona el modo incógnito de {{appName}}.",
    incognito:
      "El historial se queda en el navegador. Si borras los datos locales, se borra la conversación.",
    transit:
      "Nuestro servicio envía cada mensaje al proveedor que aloja el modelo. Registramos el consumo de créditos para la facturación.",
    callout:
      "Si quieres que todo funcione en tu equipo, usa SillyTavern con un modelo local.",
  },
  stay: {
    title: "Cuándo quedarte con Character.AI",
    intro:
      "Character.AI sigue siendo una buena opción para conversaciones moderadas con personajes que ya conoces.",
    library:
      "Ya tienes tus personajes favoritos y usas las llamadas integradas.",
    flat: "Usas sobre todo el chat estándar y te importan más los mensajes gratis sin límite que elegir el modelo.",
    callout:
      "Vale la pena quedarte si sus herramientas y reglas encajan con las historias que escribes.",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor alternativa a Character.AI?",
      a: "Janitor AI destaca por su catálogo. SillyTavern da control local y fichas del mundo. Kindroid y Nomi ofrecen compañía persistente. Con {{appName}} puedes importar un personaje público y cambiar de modelo.",
    },
    free: {
      q: "¿Hay una alternativa gratis a Character.AI?",
      a: "Janitor AI ofrece chats estándar ilimitados. Nomi incluye 50 mensajes diarios. SillyTavern es gratis y necesita un modelo aparte. {{appName}} da {{guestCredits}} créditos al mes como invitado o {{freeCredits}} con una cuenta gratuita.",
    },
    import: {
      q: "¿Puedo trasladar mis personajes y conversaciones de Character.AI?",
      a: "Con una cuenta gratis, {{appName}} puede importar los campos disponibles en un enlace público de Character.AI o Talkie. Las definiciones privadas y las conversaciones anteriores quedan en el servicio original.",
    },
    nsfw: {
      q: "¿Qué alternativas permiten rol escrito para adultos?",
      a: "Janitor AI con Limitless, CrushOn y SpicyChat lo permiten dentro de sus propias reglas. En SillyTavern depende del modelo y su proveedor. {{appName}} habilita modelos sin censura tras confirmar que tienes 18 años o más.",
    },
    private: {
      q: "¿Qué alternativa a Character.AI funciona en local?",
      a: "SillyTavern puede usar un modelo local y guardar los chats en tu equipo. Venice y el modo incógnito de {{appName}} conservan el historial en el dispositivo, mientras el proveedor alojado procesa los mensajes.",
    },
    account: {
      q: "¿Puedo probar {{appName}} sin cuenta?",
      a: "Sí. Usa tus créditos de invitado en el chat de incógnito. Inicia sesión para importar personajes o sincronizar tus chats guardados.",
    },
    memory: {
      q: "¿Qué alternativas van bien para escenas largas?",
      a: "Las fichas del mundo de Chub y SillyTavern aportan detalles cuando hacen falta. Kindroid y Nomi se enfocan en la memoria del compañero. Antes de pagar, vuelve a una escena inicial y comprueba qué recuerda el modelo.",
    },
    roleplayLink: "Rol con IA sin filtros",
    kindsLink: "En qué se diferencian los modelos sin censura",
  },
  partners: {
    body: "¿Tienes una comunidad de rol? El programa de afiliados de {{appName}} paga el {{referralPercent}} % de cada pago que refieras.",
    link: "Ver el programa de afiliados",
  },
  cta: {
    title: "Elige un modelo y abre una escena",
    subtitle:
      "Empieza como invitado con {{guestCredits}} créditos gratuitos al mes.",
    start: "Empezar una escena de rol",
    skills: "Explorar habilidades",
  },
};
