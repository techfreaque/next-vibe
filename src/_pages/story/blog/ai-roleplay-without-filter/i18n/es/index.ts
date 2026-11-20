import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Juego de rol con IA sin filtros: alternativa a Character.AI",
    description:
      "Juego de roles AI sin filtrar en modelos no censurados. Las escenas oscuras permanecen oscuras, los personajes se quedan en carácter. Memoria, privacidad, precio por respuesta. Libre de empezar, sin cuenta.",
    category: "Guía",
    imageAlt: "{{appName}} : Juego de roles AI sin filtro",
    keywords:
      "AI juego de roles sin filtro, Caracter AI alternativa, carácter AI alternativa sin filtro, sin censura AI juego de roles, sin filtrar AI chat, NSFW AI juego de roles, juego de roles oscuro AI, AI no hay restricciones, AI carácter chat sin censura, UncensoredLM, Venice Juego de roles, Artemis 31B, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Guía",
    readTime: "8 min leer",
    title: "Juego de rol con IA sin filtros. Tú decides adónde va la historia.",
    subtitle:
      "En {{appName}} tienes {{uncensoredCount}} modelos de rol sin censura junto a los convencionales, con un solo saldo. Descubre cuál se mantiene en personaje, cuál recuerda toda la campaña y cuánto cuesta cada respuesta.",
  },
  intro: {
    lead: "La escena estaba construyendo. Entonces tu personaje salió de la historia para decirte que no puede continuar. Un villano que de repente se disculpa. Una escena de terror que se convierte en un aviso de seguridad. Un romance que se desvanece a negro cada vez. Sobre el personaje. AI y la mayoría de los chatbots, el filtro escribe la última línea, no tú.",
    p2: "Esta guía muestra cómo se ve el juego de roles AI sin filtrar en {{appName}} : {{modelCount}} modelos de juego de roles lado a lado, que se ajusta a ficción oscura, campañas largas o un presupuesto ajustado, cómo funciona la memoria, cómo configurar un personaje en dos minutos, y lo que cuesta por respuesta.",
  },
  exists: {
    title: "¿Hay un personaje. AI sin filtro?",
    p1: "No del personaje.AI. Corre un filtro de contenido para cada usuario, sin configuración para apagarlo y sin tier pagado que lo elimina. Los avisos de Jailbreak son una pelea que sigues perdiendo.",
    p2: "La verdadera alternativa es un modelo diferente. {{appName}} ejecuta modelos sin censura construidos para la ficción: no rechazos, no hay aficionados morales, ningún personaje quebrando para sermonearte. Escoge el modelo por mensaje, y puedes cambiar el escenario medio.",
    consent:
      "Los modelos sin censura son para adultos. La primera vez que usas uno, confirmas que tienes 18 años o más. Una vez. Entonces decides lo que tu historia contiene, no una corporación.",
  },
  levels: {
    title: 'Lo que "sin filtro" significa en el juego de roles',
    intro: "Cada modelo lleva uno de los tres niveles de contenido.",
    mainstream:
      "Mainstream: Claude, GPT, Gemini. Gran escritor, filtros estrictos. La violencia se suaviza, la intimidad se desvanece a los temas negros y oscuros consiguen una descargo.",
    open: "Abierto: Kimi, MiniMax, DeepSeek, GLM. Filtros de luz. Las escenas más maduras funcionan, las más oscuras se tonifican.",
    uncensored:
      "Sin censura: sin filtro. Explícito, violento, tabú: la escena se reproduce como escrita.",
    twoKinds:
      "Uncensored viene en dos tipos. La mayoría de los modelos no censurados son modelos dominantes con las renegaciones cortadas, por abliteración o una descensura fina-tune. Dejan de decir que no, pero mantienen la visión del mundo de su modelo base, por lo que una escena oscura todavía puede derivar en algún lugar tamer. {{ownName}} es el otro tipo: entrenado en libros y documentos prohibidos en Internet corriente. Su propia visión del mundo, nada que anula la historia de vuelta a tierra segura.",
  },
  table: {
    title: "Los modelos de juego de roles, lado a lado",
    intro:
      "Vive de nuestro registro modelo. La memoria es la ventana contextual: cuánto de la historia que el modelo lee antes de cada respuesta. 1 crédito = {{creditValue}}.",
    colModel: "Modelo",
    colFilter: "Nivel de filtro",
    colMemory: "Memoria",
    colImages: "Leer imágenes",
    colPrice: "Precio por respuesta",
    memory: "fichas {{context}}, sobre páginas {{pages}}",
    yes: "Sí.",
    no: "No.",
    credits: "{{credits}} créditos",
    footnote:
      "Precio por respuesta supone una escena larga: un gran pedazo de historia, una respuesta completa. Los intercambios cortos cuestan menos. Los precios incluyen nuestro marcador y vienen del proveedor más barato para cada modelo.",
  },
  models: {
    uncensoredLm: "Oscuro y tabú, su propia cosmovisión",
    artemis: "Juegos de rol fino, larga memoria, barato",
    veniceRoleplay: "Afinado para sostener la voz de un personaje",
    deepseekFlash: "Parcelas inteligentes, gran memoria",
    glmFlash: "Rápido y barato, lee imágenes",
    venice: "Barato todoterreno",
    minimaxFlash: "Más barato, filtro abierto",
    kimi: "Personajes ricos, filtro ligero",
    sonnet: "Top prose, filtro de corriente",
  },
  picks: {
    title: "¿Cuál modelo para qué historia",
    intro: "Empieza de la escena que quieres escribir.",
    dark: {
      title: "Oscura, tabú y explícita",
      body: "{{ownName}} conduce aquí: no hay escenas ablandadas, sin dejar de lado moral repentino. Su límite es la memoria: {{ownContext}} tokens, sobre páginas {{ownPages}}, por lo que las campañas largas pierden sus primeros capítulos. Artemis es una finura de juego de roles que escribe escenas grampáticas y explícitas rectas, con mucho más memoria.",
    },
    long: {
      title: "Campañas largas",
      body: "Cuando la historia funcione durante semanas. Estos mantienen las escenas tempranas al alcance. DeepSeek V4.1 Flash Uncensored añade un verdadero razonamiento para las parcelas con partes móviles. {{roleplayName}} mantiene la voz de un personaje a través de los tokens {{roleplayContext}}.",
    },
    cheap: {
      title: "barato, para el volumen",
      body: "chats diarios con un compañero, escenas rápidas, montones de rollos. {{cheapestName}} es la respuesta más barata aquí, en un filtro abierto. Los otros dos no son censurados.",
    },
    filtered: {
      title: "Personajes ricos, filtro está bien",
      body: "El drama lento, la intriga política, un misterio con pistas que se suman. Los escritores más fuertes mantienen sus filtros, así que suavizan los ritmos más oscuros. Úsalos cuando la historia no necesite ir allí.",
    },
    compareLink: "Comparar {{a}} con {{b}}",
  },
  memory: {
    title: "¿El AI recuerda mi personaje?",
    intro: "Dos tipos de memoria. Ambos importan el juego de roles.",
    p1: "La ventana contextual es la memoria a corto plazo: todo lo que el modelo relee antes de que responda. {{longestName}} tiene fichas {{longestContext}}, sobre páginas {{longestPages}} de historia. {{ownName}} mantiene {{ownContext}}, sobre páginas {{ownPages}}. Cuando un hilo sale por la ventana, las escenas más antiguas salen. Pin los elementos esenciales (nombres, relaciones, reglas de tu mundo) en la descripción del personaje para que nunca caigan.",
    p2: "La memoria a largo plazo es separada: hechos que el AI ahorra sobre ti y recuerda en nuevos hilos. Necesita una cuenta gratuita y la carpeta privada. Incognito chats nunca guarda recuerdos.",
  },
  setup: {
    title: "Configurar un personaje en dos minutos",
    intro:
      "Comience con una habilidad comunitaria, importar un personaje público de un Personaje. AI o Talkie link, o crear su propio con los siguientes pasos.",
    steps: {
      skill: {
        title: "Abrir la habilidad de Roleplay",
        body: "Le dice al modelo que permanezca en el personaje, mantenga la voz consistente, nunca controle su carácter y salte las advertencias de contenido.",
      },
      variant: {
        title: "Escoge una variante",
        body: "{{uncensored}} no censurado para escenas oscuras y tabú. Carreras creativas {{creative}}, el más barato. Profundidad corre {{deep}} para vidas internas ricas a través de campañas largas.",
      },
      character: {
        title: "Describir el personaje y la escena",
        body: "Nombre, personalidad, cómo hablan, lo que quieren, donde empieza la historia. Diga si escribe en primera o tercera persona. Entonces haz tu primer movimiento.",
      },
      switch: {
        title: "Modelos de conmutación de media escena",
        body: "¿Un modelo se niega o se va plana? Escoge otro y envía el siguiente mensaje. El hilo mantiene su historia y el nuevo modelo lee todo.",
      },
      art: {
        title: "Agregar arte de carácter",
        body: "Pide un retrato en la misma charla. El generador de imagen se ejecuta en el mismo saldo, modelos de imagen sin censura incluidos.",
      },
    },
    skillLink: "Abrir la habilidad de Roleplay",
    imageLink: "Compare los generadores de imagen no censurados",
  },
  privacy: {
    title: "¿Mi juego de roles es privado?",
    intro: "Depende de la carpeta. Esto es exactamente lo que pasa.",
    incognito:
      "chats Incognito en vivo en el almacenamiento local de su navegador, no en nuestros servidores. Despejen los datos del navegador y se han ido.",
    transit:
      "Cada mensaje pasa a través de nuestro servidor al proveedor modelo que escribe la respuesta. Cada AI hospedado funciona de esa manera. El uso de crédito se registra para facturación.",
    private:
      "Los chats privados se guardan en el servidor y sólo se pueden ver en su cuenta, en cualquier dispositivo que inicie sesión.",
    callout:
      "Versión corta: incognito mantiene su historia fuera de nuestros servidores. No lo oculta del modelo que escribe las respuestas.",
  },
  pricing: {
    title: "¿Qué costos de juego de roles no filtrados",
    intro: "Créditos por respuesta. Un saldo para cada modelo.",
    perReply:
      "Cada respuesta cuesta créditos basados en el modelo y la longitud de la escena. La tabla muestra una escena larga. 1 crédito = {{creditValue}}.",
    cheapest:
      "Respuesta más barata: {{cheapestName}} at {{cheapestPrice}}, about {{cheapestPerUnit}} replies per {{unit}}. Los más baratos sin censura: {{uncensoredName}} en {{uncensoredPrice}}, acerca de {{uncensoredPerUnit}} respuestas por {{unit}}.",
    free: "Gratis: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account. Suficiente para una larga primera campaña en un modelo barato.",
    sub: "Planes mensuales: cuatro tamaños, comenzando en créditos {{subCredits}} para {{subPrice}}.",
    pack: "Paquetes para recargar los créditos de tu suscripción. {{packCredits}} créditos por {{packPrice}}. Nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
    link: "Ver planes y paquetes de crédito",
  },
  characterAi: {
    title: "Cuando el personaje. AI es la mejor elección",
    intro: "A veces. Aquí es cuando.",
    library:
      "Ya sigues a los creadores o tienes historias en curso sobre el personaje. AI y quieres recoger donde te fuiste.",
    flatRate:
      "Quieres una tarifa plana y nunca quieres pensar en el costo por respuesta. Los créditos se miden, y las escenas largas de los modelos premium se suman.",
    wantFilter:
      "Quieres el filtro. Para un usuario más joven o un dispositivo familiar compartido, una aplicación bloqueada encaja mejor.",
    callout:
      "Sin filtrar significa que no hay red de seguridad. Lo que escribes y publicas es sobre ti, y la ley donde vives sigue vigente.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "¿Hay un chat de rol AI sin filtro?",
      a: "Sí. {{appName}} ejecuta modelos sin censura construidos para ficción: {{ownName}}, Artemis, Venice Role Play y más. Sin rehusiones, sin conferencias, sin ruptura de carácter. Una confirmación de 18+ de una sola vez los desbloquea.",
    },
    free: {
      q: "¿Es gratis el juego de roles AI sin filtrar?",
      a: "Puede comenzar gratis: {{guestCredits}} créditos al mes sin cuenta, {{freeCredits}} con una cuenta gratuita. Una respuesta sobre {{uncensoredName}} cuesta sobre créditos {{uncensoredCredits}} en una escena larga. Después de eso: un plan, desde {{subPrice}} al mes.",
    },
    nsfw: {
      q: "¿Puedo hacer el juego de roles NSFW?",
      a: "Sí, en los modelos sin censura, como un adulto que lo confirmó una vez. La ficción entre adultos es asunto tuyo. El contenido sexual de menores es ilegal y se mantiene ilegal.",
    },
    memory: {
      q: "¿Cuánto tiempo puede un juego de roles correr antes de que el AI se olvide?",
      a: "Hasta fichas {{longestContext}} en {{longestName}}, sobre páginas {{longestPages}}. {{ownName}} tiene sobre las páginas de {{ownPages}}. Poner los elementos esenciales en la descripción de caracteres para que permanezcan en la memoria.",
    },
    private: {
      q: "¿Alguien puede leer mi juego de roles?",
      a: "Los chats Incognito permanecen en su navegador. Los chats privados son visibles sólo a su cuenta. Los mensajes siguen transmitiendo al proveedor modelo que escribe la respuesta.",
    },
    account: {
      q: "¿Necesito una cuenta?",
      a: "No. Incognito roleplay funciona sin uno. Necesitas una cuenta gratuita para la memoria a largo plazo y para chats guardados a través de dispositivos.",
    },
    guideLink: "Lea la guía de cada modelo sin censura",
    chatgptLink: "Una alternativa ChatGPT sin filtros",
  },
  partners: {
    body: "Ejecutar una comunidad de juegos de rol, un Discord o un canal sobre caracteres AI? El programa socio {{appName}} paga una parte recurrente de cada pago que se refiere.",
    link: "Ver el programa de socios",
  },
  cta: {
    title: "Escoge un personaje. Escribe la escena.",
    subtitle:
      "Créditos gratis {{guestCredits}} al mes, sin cuenta necesaria. Sin censura, abierta o incorporada: cambie en cualquier momento.",
    start: "Iniciar un juego de roles",
    models: "Compare todos los modelos",
  },
};
