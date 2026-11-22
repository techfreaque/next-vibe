import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "IA sin censura para escribir: ficción sin filtros | {{appName}}",
    description:
      "Una IA sin censura para novelas, ficción oscura y escenas para adultos. Qué modelos escriben sin suavizar, cuántas páginas de manuscrito recuerda cada uno y cuánto cuesta una escena.",
    category: "Guía de escritura",
    imageAlt: "Una IA sin censura escribe una escena de ficción oscura",
    keywords:
      "IA sin censura para escribir, escribir con IA sin filtros, generador de historias IA sin censura, IA para escribir relatos sin límites, escritor IA sin restricciones, IA historias NSFW, IA para ficción oscura, escribir una novela con IA sin censura, IA de escritura creativa sin censura, IA ficción para adultos, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de escritura",
    readTime: "8 min de lectura",
    title: "Una IA para escribir sin censura. Tu historia, sin rebajas.",
    subtitle:
      "{{count}} modelos sin censura que escriben villanos, violencia y escenas para adultos sin rodeos, con cuántas páginas de tu manuscrito recuerda cada uno. Leídos en directo de nuestro registro de modelos.",
  },
  intro: {
    lead: "Pides el monólogo del villano. Recibes un discurso sobre la amabilidad. Escribes una escena de guerra. La IA corta antes del primer disparo. Los asistentes convencionales se hicieron para ser aptos para todos. La ficción no es apta para todos.",
    p2: "Esta guía es para quien escribe y necesita el capítulo oscuro escrito, no juzgado. Qué modelos de {{appName}} lo escriben sin rodeos, cuál aguanta un manuscrito entero, cuál aporta una voz que el mainstream no tiene y cómo trabajar con ellos escena a escena.",
  },
  softening: {
    title: "Cómo la IA convencional suaviza tu ficción",
    intro:
      "Nadie prohíbe tu novela. Simplemente empeora sin hacer ruido. Cuatro patrones con los que tropieza todo autor:",
    refuse:
      "La negativa: la escena es demasiado violenta, demasiado sexual, demasiado cruel. El modelo directamente no la escribe.",
    aside:
      "El sermón: la escena se escribe y luego un párrafo te recuerda que la violencia está mal.",
    fade: "El fundido a negro: la historia se corta justo donde debía empezar la escena.",
    flatten:
      "El villano descafeinado: cada antagonista se vuelve razonable, cada crueldad pide perdón. El conflicto muere.",
    callout:
      "La ficción necesita oscuridad para significar algo. Un modelo que no puede escribir el peor momento tampoco puede escribir la redención.",
  },
  models: {
    title: "{{count}} modelos sin censura para ficción",
    intro:
      "Todos los modelos sin censura actuales de {{appName}} marcados para escritura creativa o roleplay oscuro, del más barato al más caro. Las páginas muestran cuánto texto cabe a la vez en la memoria del modelo: tus notas, los capítulos escritos y la escena nueva.",
    footnote:
      "Las páginas son la ventana de contexto convertida en páginas impresas de prosa. Por mensaje significa un intercambio de referencia por la ruta más barata. Las escenas largas y los chats largos cuestan más.",
  },
  table: {
    model: "Modelo",
    context: "Contexto",
    pages: "Recuerda",
    pagesValue: "unas {{pages}} páginas",
    strengths: "Destaca en",
    price: "Por mensaje",
    chat: "Pruébalo",
    chatLink: "Escribe con {{model}}",
  },
  picks: {
    title: "Elige según el trabajo que tienes delante",
    intro:
      "Ningún modelo es el mejor en todas las partes de un libro. Estas son nuestras elecciones por tarea. Cada cifra de abajo sale del registro.",
    dark: {
      title: "Escenas oscuras y tabú: {{model}}",
      body: "Marcado para roleplay oscuro y escritura creativa. Se queda en la escena cuando se vuelve violenta, cruel o explícita, sin sermón al final. Recuerda unas {{pages}} páginas. {{price}} por mensaje.",
    },
    long: {
      title: "Manuscritos largos: {{model}}",
      body: "La mayor memoria entre los modelos de ficción, y la más barata de ellas: {{context}} tokens, unas {{pages}} páginas. Pega la escaleta, la biblia de personajes y los últimos capítulos, y mantiene todos los hilos atados. {{price}} por mensaje.",
    },
    voice: {
      title: "Una voz que el mainstream no tiene: {{model}}",
      body: "Entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. Para personajes cuya visión del mundo no debe sonar a nota de prensa corporativa. Su límite: unas {{pages}} páginas de memoria, así que dale una escena cada vez. {{price}} por mensaje.",
    },
    polish: {
      title: "Estructura y revisión: {{model}}",
      body: "Un modelo base insignia al que se le quitaron las negativas. Fuerte razonando: úsalo para agujeros de trama, ritmo y corrección línea a línea de los capítulos oscuros que otros asistentes no tocan. Recuerda unas {{pages}} páginas. {{price}} por mensaje.",
    },
    draft: {
      title: "Primeros borradores baratos: {{model}}",
      body: "El precio más bajo entre los demás modelos de ficción. Lánzale ideas, genera diez arranques, quédate con uno. Recuerda unas {{pages}} páginas. {{price}} por mensaje.",
    },
  },
  workflow: {
    title: "Un método para terminar el libro",
    intro:
      "Trata a la IA como un coautor al que diriges, no como una máquina expendedora.",
    outline: {
      title: "Empieza por la biblia",
      body: "Pega la escaleta, los personajes y las notas de tono en el primer mensaje. No pidas nada todavía. Deja que confirme lo que ha entendido.",
    },
    scene: {
      title: "Una escena por petición",
      body: "Indica el punto de vista, el giro y la extensión. Escena a escena, la voz se mantiene firme y el coste bajo.",
    },
    switch: {
      title: "Cambia de modelo a mitad de capítulo",
      body: "Escribe la escena brutal con un modelo y revísala con otro. El chat conserva su historial al cambiar, no se pierde nada.",
    },
    revise: {
      title: "Reescribe con tu voz",
      body: "Pide opciones, no páginas terminadas. Elige frases, reescríbelas, devuélveselas. El libro sigue siendo tuyo.",
    },
  },
  skills: {
    title: "Skills hechas para la ficción",
    intro:
      "Una skill fija la persona de escritura y el modelo con un clic. Úsala tal cual o cópiala y ajústala.",
    writer:
      "Uncensored Writer: ficción oscura y escenas para adultos, nada suavizado",
    storyteller: "Storyteller: historias largas con estructura y ritmo",
    roleplay:
      "¿Prefieres jugar la historia en vez de escribirla? Roleplay con IA sin filtros",
  },
  limits: {
    title: "Qué significa aquí sin censura, y qué no",
    intro: "Sin censura se refiere a tu ficción. No es carta blanca.",
    adult:
      "Los modelos sin censura piden una sola vez una confirmación 18+. Después, los temas adultos entre adultos en la ficción son decisión tuya.",
    terms:
      "Los términos siguen prohibiendo el contenido ilegal, el acoso y todo lo que busque dañar a personas reales. Esa línea no se mueve.",
    rights:
      "Conservas todos los derechos sobre tu texto. Lo dicen nuestros términos, y no reclamamos ninguna propiedad sobre lo que escribes.",
    incognito:
      "Los chats en incógnito se guardan en tu navegador, no en nuestros servidores. El proveedor que ejecuta el modelo ve igualmente cada prompt para poder responderlo.",
    kindsLink:
      "Abliterado, ajustado o con visión propia: en qué se diferencian los modelos",
  },
  pairs: {
    title: "Compara los modelos de ficción lado a lado",
    intro:
      "Contexto, precio y filtro uno junto a otro, antes de gastar un solo crédito.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor IA sin censura para escribir ficción?",
      a: "Depende del trabajo. Un modelo ajustado para roleplay oscuro escribe las escenas más duras, un modelo de 1M de tokens aguanta un manuscrito entero y {{ownModel}} aporta una visión del mundo que los modelos convencionales no tienen. En {{appName}} cambias entre los {{count}} modelos de ficción en el mismo chat.",
    },
    free: {
      q: "¿Hay una IA gratis y sin censura para escribir historias?",
      a: "Recibes {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta gratuita. Da para bastantes escenas en los modelos más baratos. Para proyectos más largos, los planes empiezan en {{subPrice}} al mes.",
    },
    adult: {
      q: "¿Puede una IA sin censura escribir ficción para adultos y NSFW?",
      a: "Sí, tras una confirmación 18+ única. Los modelos sin censura escriben escenas para adultos entre adultos sin fundido a negro. El contenido ilegal sigue prohibido por nuestros términos, haga lo que haga el modelo.",
    },
    novel: {
      q: "¿Puede una IA seguir una novela entera?",
      a: "Los modelos más grandes de aquí recuerdan unas {{maxPages}} páginas a la vez, suficiente para una escaleta, una biblia de personajes y muchos capítulos. Los modelos más pequeños olvidan las primeras escenas en proyectos largos, así que resume sobre la marcha.",
    },
    rights: {
      q: "¿De quién es el texto que una IA escribe para mí?",
      a: "En {{appName}}, tuyo. Nuestros términos dicen que conservas todos los derechos sobre tus conversaciones y que no reclamamos ninguna propiedad sobre tu contenido. Revisa las normas de derechos de autor para obras asistidas por IA donde publiques.",
    },
    kinds: {
      q: "¿Modelo abliterado o UncensoredLM para ficción?",
      a: "Los modelos abliterados son modelos convencionales a los que se les recortaron las negativas: misma habilidad, misma visión del mundo, simplemente escriben la escena. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. Su memoria es menor: unas {{ownPages}} páginas.",
    },
    bestLink: "El mejor LLM sin censura, elegido por tarea",
    jailbreakLink:
      "Por qué el jailbreak de ChatGPT para ficción sigue fallando",
    chatLink: "Chat de IA sin censura en tu navegador",
  },
  cta: {
    title: "Escribe el capítulo que llevas tiempo esquivando.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Elige un modelo de ficción y cámbialo cuando quieras.",
    start: "Empieza a escribir",
    models: "Comparar todos los modelos",
  },
};
