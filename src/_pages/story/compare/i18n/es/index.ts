import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Comparación",
    breadcrumb: "Plataformas de IA sin censura",
    backToBlog: "Volver al blog",
    backToHub: "Todas las plataformas de IA sin censura",
    updated: "Última actualización: {{date}}",
    versusImageAlt: "{{appName}} y {{name}}, a comparación",
    kinds: {
      uncensoredChat: "Chat sin censura",
      aggregator: "App multimodelo y API",
      router: "Enrutador de API",
      roleplay: "Rol con personajes",
      frontend: "Interfaz de rol autohospedada",
      companion: "Compañía virtual con IA",
      filteredChat: "Chat con personajes y filtros",
      local: "Modelos en tu equipo",
    },
    period: {
      month: "{{plan}}: {{price}} al mes",
      quarter: "{{plan}}: {{price}} cada 3 meses",
      year: "{{plan}}: {{price}} al año",
      once: "{{plan}}: pago único de {{price}}",
    },
    free: {
      yes: "Sí",
      no: "No",
      local: "Gratis en tu propio equipo",
    },
    paid: {
      from: "Desde {{price}}",
      payg: "Pago por uso",
      none: "Sin plan de pago",
    },
    availability: {
      yes: "Sí",
      no: "No",
      partial: "Limitada",
    },
    media: {
      image: "Imágenes",
      video: "Video",
      voice: "Voz",
      partial: "{{name}} (complementos)",
      none: "Solo texto",
    },
    openSource: {
      yes: "Código abierto",
      yesSelfHost: "Código abierto, con alojamiento propio",
      closedLocal: "Código cerrado, se ejecuta en tu equipo",
      partial: "Solo la versión anterior de escritorio",
      no: "No",
    },
    sourceKinds: {
      home: "Sitio de {{name}}",
      pricing: "Precios de {{name}}",
      features: "Funciones de {{name}}",
      models: "Lista de modelos de {{name}}",
      privacy: "Política de privacidad de {{name}}",
      terms: "Condiciones del servicio de {{name}}",
      guidelines: "Normas de la comunidad de {{name}}",
      api: "Documentación de la API de {{name}}",
      docs: "Documentación de {{name}}",
      help: "Centro de ayuda de {{name}}",
      repo: "Código fuente de {{name}}",
      blog: "Artículo del blog de {{name}}",
      appStore: "Ficha de {{name}} en la tienda de aplicaciones",
      paper: "Artículo de investigación de {{name}}",
    },
    table: {
      platform: "Plataforma",
      kind: "Tipo",
      free: "Plan gratis",
      paid: "De pago",
      filter: "Filtros y consentimiento",
      privacy: "Privacidad",
      api: "API",
      media: "Imágenes, video y voz",
      open: "Código abierto",
      usLink: "Ver planes",
      versusLink: "Comparación completa",
    },
    versus: {
      shortTitle: "Lo esencial",
      tableTitle: "{{appName}} frente a {{name}}",
      tableIntro:
        "Consultamos las fuentes oficiales de {{name}} el {{date}}. Los datos de {{appName}} se actualizan en tiempo real desde nuestra configuración.",
      tableFootnote:
        "{{name}} publica sus precios de lista en dólares de EE. UU. Aquí ves lo que pagarías por nuestros planes. Los planes cambian. Consulta las fuentes antes de comprar.",
      colAspect: "",
      rows: {
        price: "Precio",
        free: "Plan gratis",
        models: "Modelos",
        filter: "Filtros y consentimiento",
        privacy: "Privacidad",
        api: "API",
        media: "Imágenes, video y voz",
        open: "Código abierto",
        forWho: "Para quién",
      },
      priceCell: "{{plans}}. {{note}}",
      apiCell: "{{short}}. {{text}}",
      themTitle: "{{name}}: puntos fuertes y límites",
      usTitle: "{{appName}}: puntos fuertes y límites",
      wins: "En qué destaca {{name}}",
      short: "Los límites de {{name}}",
      chooseTitle: "¿Cuál elegir?",
      chooseThem: "Elige {{name}} si",
      chooseUs: "Elige {{appName}} si",
      faqTitle: "Preguntas frecuentes",
      sourcesTitle: "Fuentes",
      sourcesIntro:
        "Consultamos estas fuentes de {{name}} el {{date}}. Si ves un dato desactualizado, avísanos y lo corregimos.",
      ourSources:
        "Nuestros precios salen de la configuración con la que calculamos los cobros. Compruébalos aquí.",
      modelsLink: "Todos los modelos de {{appName}} con precios actualizados",
      pricingLink: "Planes y paquetes de créditos",
      privacyLink: "Nuestra política de privacidad",
      modelTitle: "{{model}} en {{appName}}",
      modelIntro:
        "Puedes elegir el modelo propio de {{name}} en el selector. En su ficha encontrarás el precio por mensaje, el límite de contexto y el ID para la API.",
      modelPageLink: "{{model}}: precio, contexto y API",
      modelCompareLink: "{{model}} vs {{other}}: cara a cara",
      moreTitle: "Más comparaciones",
      ctaSubtitle:
        "{{guestCredits}} créditos gratis al mes. Sin cuenta ni tarjeta. Cambia de modelo en cada mensaje: convencional, abierto o sin censura.",
      ctaTry: "Abrir un chat en incógnito",
      ctaModels: "Ver todos los modelos",
    },
  },
  us: {
    kind: "Un chat con modelos convencionales, abiertos y sin censura",
    free: "Sí. {{guestCredits}} créditos al mes sin cuenta y {{freeCredits}} con cuenta.",
    paid: "Desde {{subPrice}} al mes",
    filterShort:
      "Tú eliges el filtro en cada chat. Para usar los modelos sin censura, confirma una sola vez que tienes 18 años o más.",
    privacyShort:
      "Los chats en incógnito se quedan en el navegador. Los privados se guardan en tu cuenta.",
    apiShort: "API compatible con OpenAI y Anthropic tras una compra",
    mediaShort: "Imágenes, video, música y voz",
    openShort: "Código abierto, con alojamiento propio",
    price:
      "Planes mensuales: {{planList}}. Con un plan activo puedes recargar {{packCredits}} créditos por {{packPrice}}. Los créditos comprados no caducan. Paga con tarjeta, PayPal o criptomonedas.",
    models:
      "{{modelCount}} modelos de chat de {{labCount}} laboratorios: {{mainstream}} convencionales, {{open}} abiertos y {{uncensored}} sin censura. A {{refusalsRemoved}} modelos convencionales o abiertos se les quitaron los rechazos. {{ownModel}} tiene una visión propia: se entrenó con libros y documentos vetados en los grandes sitios de internet.",
    filter:
      "Elige un modelo convencional, abierto o sin censura en cada mensaje. Para desbloquear los modelos sin censura, confirma una sola vez que tienes 18 años o más. No añadimos filtros. Los modelos convencionales conservan los de sus proveedores.",
    privacy:
      "Los chats en incógnito se guardan en el navegador y funcionan sin cuenta. Los privados se guardan en tu cuenta. Los archivos generados se guardan en nuestros servidores. Enviamos cada mensaje al proveedor que lo responde.",
    api: "API /v1 compatible con OpenAI y Anthropic para chat, imágenes, video y voz. Se activa al contratar un plan (desde {{apiSubPrice}} al mes) o al comprar créditos. Las cuentas gratis reciben HTTP 402.",
    media:
      "Usa {{imageModels}} modelos de imagen, {{videoModels}} de video, {{musicModels}} de música y {{voiceModels}} de voz desde cualquier chat, con el mismo saldo.",
    open: "Todo el código está en GitHub. Puedes alojar la plataforma en tu propio equipo.",
    forWho:
      "Para quien quiere elegir el filtro y usar modelos convencionales, abiertos y sin censura, con imágenes, video y voz en el mismo chat y con el mismo saldo.",
  },
  links: {
    hub: "Las mejores plataformas de IA sin censura, comparadas",
    hubDesc:
      "Precios, filtros, privacidad y API de Venice.ai, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT y modelos locales, con fuentes.",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Comparativa de plataformas de IA sin censura",
    sectionIntro:
      "Precios, filtros y privacidad de Venice.ai, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT y más, según sus fuentes oficiales.",
  },
  platforms: {
    venice: {
      what: "App de IA centrada en la privacidad con un gran catálogo de modelos, fine-tunes propios sin censura, generación de imagen, video, voz y música, una API compatible con OpenAI y una capa de tokens cripto (VVV y DIEM).",
      pricingNote:
        "Gratis: 10 consultas de texto y 15 de imagen al día, solo modelos base. 100 créditos = 1 USD. Pro Plus y Max incluyen gasto de API. El video, la música y los modelos más avanzados consumen créditos aparte. USDC sirve para los créditos y la cripto para los periodos Pro más largos.",
      models:
        "Su catálogo de API lista 145 modelos de texto, 52 de imagen, 160 de video, 11 de voz y 19 de música. Sin censura: sus fine-tunes propios Venice Uncensored 1.2 y Venice Role Play Uncensored, más versiones abliteradas de GLM, DeepSeek, Gemma y Qwen.",
      filterShort:
        "Filtro de contenido adulto activo por defecto. Pro permite desactivarlo.",
      filter:
        "El filtro adulto viene activado. Con Pro puedes quitarlo en los ajustes. Entre los 13 y los 17 años, las condiciones exigen permiso parental y mantener el filtro activado.",
      privacyShort: "El historial se queda en tu dispositivo por defecto",
      privacy:
        "Venice guarda por defecto el historial de chat en tu dispositivo. Dice que su modo Private se basa en la confianza y, en el modo Anonymized, te avisa de que des por hecho que el proveedor del modelo guarda tu contenido. Algunos modelos se ejecutan en enclaves de hardware (a través de NEAR AI Cloud y Phala) o con cifrado de extremo a extremo.",
      apiShort: "",
      api: "API compatible con OpenAI con un endpoint Responses, cobrada por token en créditos en USD. Sin API nativa de Anthropic Messages: su guía de Claude Code usa un proxy de traducción local. Con x402 pagas por solicitud desde un monedero USDC, sin cuenta.",
      forWho:
        "Para quien busca chat y generación sin censura con el historial en su dispositivo. También para desarrolladores y usuarios de criptomonedas.",
      pro1: "Fine-tunes propios sin censura y versiones abliteradas, con precios de API bajos por token.",
      pro2: "El historial se queda en tu dispositivo por defecto.",
      con1: "El plan gratis se limita a 10 consultas de texto al día con modelos básicos.",
      con2: "Para desactivar el filtro adulto necesitas Pro. El video, la música y los modelos prémium consumen créditos.",
    },
    uncensoredAi: {
      what: "Chat sin censura con un solo modelo, un foro de la comunidad y un archivo de documentos. En la web, iOS y Android.",
      pricingNote:
        "Gratis: un límite diario, 3 respuestas por defecto. Los precios de Pro se mantienen de por vida. Tarjetas, Cash App, Apple Pay y Bitcoin. Los créditos de API se venden aparte: 0,05 USD por solicitud, desde 5 USD.",
      models:
        "Un solo modelo: UncensoredAI v1.2, con 32K tokens de contexto. Se entrenó con libros y documentos vetados en los grandes sitios de internet. Sus posturas políticas se apartan de las mayoritarias.",
      filterShort: "No detalla filtros. Solo para mayores de 18 años.",
      filter:
        "Se presenta como una plataforma sin restricciones. Sus condiciones exigen tener al menos 18 años y prohíben el contenido dirigido a dañar, acosar o poner a alguien en peligro.",
      privacyShort: "Nunca se venden, solo texto al modelo, según sus páginas",
      privacy:
        "Sus páginas dicen que tus datos nunca se venden, alquilan ni intercambian, y que las solicitudes a la IA llevan solo tu texto, nunca tu nombre ni tu correo. Los mensajes entre usuarios van cifrados de extremo a extremo. No publica ningún plazo de retención.",
      apiShort: "",
      api: "Cuerpo de solicitud al estilo OpenAI en un endpoint propio, cobrado por solicitud a 0,05 USD. Streaming, herramientas y formato Anthropic no están documentados.",
      forWho:
        "Para quien busca respuestas directas y puntos de vista distintos sobre asuntos polémicos.",
      pro1: "Cuota fija con precio garantizado de por vida.",
      pro2: "Datos que nunca se venden, alquilan ni intercambian, según dice.",
      con1: "Un solo modelo y 32K tokens de contexto. Sin generación de imágenes, video ni música.",
      con2: "Solo 3 respuestas gratis al día. La voz, las carpetas y los archivos requieren Pro.",
    },
    nanoGpt: {
      what: "Chat web y API de pago por uso para texto, imágenes, video y audio. Puedes contratar un plan para modelos abiertos.",
      pricingNote:
        "Primer depósito: 0,10 USD en cripto (Bitcoin, Monero y otras) o 1 USD con tarjeta, y luego 5 USD en depósitos con tarjeta. La web tiene un modelo gratis. PRO (costaba 8 USD hasta mayo de 2026) cubre 60M de tokens de entrada a la semana, con salida gratis en los modelos de texto abiertos incluidos. Claude, GPT, Gemini y Grok salen de tu saldo.",
      models:
        "La API pública de modelos devolvió 610 entradas, 54 de ellas fine-tunes abliterated, uncensored, Heretic, derestricted o similares. Entre los ejemplos, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Qwen 3.8 27B Uncensored y versiones abliteradas de Kimi K3.1 Pro. Sin modelo propio.",
      filterShort:
        "Admite contenido adulto con límites. A partir de los 18 años.",
      filter:
        "Debes tener al menos 18 años y la edad legal para firmar un contrato donde vives. Prohíbe el material de abuso sexual infantil y el contenido íntimo o sexualmente explícito de personas identificables sin su consentimiento, incluidos los deepfakes. Cada proveedor puede aplicar sus propias reglas.",
      privacyShort: "El historial se queda en tu navegador por defecto",
      privacy:
        "El historial se queda por defecto en tu navegador. NanoGPT dice que no registra ni conserva prompts ni respuestas durante la inferencia normal. El registro de la API es opcional, de 1 a 30 días. El Private Mode envía las solicitudes a un enclave cifrado por un 5 % extra. En noviembre de 2026 NanoGPT informó de exposiciones de prompts en varios proveedores upstream y eliminó esas rutas.",
      apiShort: "",
      api: "OpenAI chat completions, Responses y Anthropic Messages con una sola clave, más imágenes y video. Pago por solicitud sin cuenta con Lightning (L402). Los pagos x402 se eliminaron el 2026-11-20.",
      forWho:
        "Para quien quiere pagar solo por lo que usa, acceder a un catálogo amplio o recargar con criptomonedas.",
      pro1: "Catálogo enorme, casi todo a precio de lista, y recargas desde 0,10 USD.",
      pro2: "El modelo gratis de la web funciona sin cuenta. El historial se queda en el navegador por defecto.",
      con1: "Gratis solo hay un modelo de chat en la web.",
      con2: "La privacidad depende del proveedor elegido.",
    },
    openRouter: {
      what: "Una API para acceder con una sola clave a cientos de modelos de distintos proveedores. Pagas por token con créditos prepagados.",
      pricingNote:
        "Sin suscripción y sin margen sobre la inferencia: precios de los proveedores más una comisión del 5,5 % al comprar créditos con tarjeta, 5 % con cripto. Trae tus propias claves de proveedor gratis hasta 25.000 USD al mes. Modelos gratis: 50 solicitudes al día, 1.000 tras comprar 10 USD en créditos.",
      models:
        "477 modelos, 11 gratis. Las opciones sin censura son escasas: 17 encajan con rol o sin censura por nombre o descripción, como Venice Uncensored (Dolphin Mistral 24B), Hermes 4 405B, Magnum y Euryale. Ni un solo ID de modelo dice abliterated o uncensored.",
      filterShort: "Se aplican las reglas del proveedor de cada modelo",
      filter:
        "Sus términos exigen ser mayor de 18. OpenRouter revisa las entradas en busca de CSAM y malware conocidos. No hay una regla aparte sobre contenido sexual: se aplican los términos de cada modelo, así que los rechazos dependen del modelo y de su proveedor.",
      privacyShort: "Sin registro de prompts por defecto, enrutamiento ZDR",
      privacy:
        "OpenRouter dice que no registra prompts ni respuestas salvo que lo actives, y el registro opcional da un 1 % de descuento. Puedes bloquear a los proveedores que entrenan con tus datos y enrutar solo a endpoints de retención cero de datos, por cuenta o por solicitud.",
      apiShort: "",
      api: "OpenAI chat completions y Responses API con streaming y herramientas. Ese es el producto.",
      forWho:
        "Para desarrolladores que quieren usar muchos modelos con una clave y cambiar de proveedor si uno falla.",
      pro1: "Catálogo enorme a precios del proveedor, sin margen sobre la inferencia.",
      pro2: "Enrutamiento de retención cero de datos y claves propias gratis.",
      con1: "Pocos modelos sin censura, ninguno abliterado.",
      con2: "Está pensado para integrarlo en tu propia interfaz.",
    },
    freedomGpt: {
      what: "App de IA todo en uno en web, iPhone y Android: modelos convencionales junto a opciones sin censura, con generación de imagen y video. También tiene una API y una app de escritorio de código abierto más antigua para modelos sin conexión.",
      pricingNote:
        "Empiezas sin tarjeta ni cuenta. Pro incluye 2.200 créditos al mes. FreedomGPT estima 10 créditos por una respuesta premium, 25 por una imagen y 400 por un video de 5 segundos. Quien se registra con Google, Apple o X recibe 100 créditos de bonificación.",
      models:
        "Presume de más de 400 modelos en una suscripción: ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama y más. Promete opciones sin censura, pero no nombra ninguna. Su API usa por defecto un modelo llamado Liberty.",
      filterShort: "Solo uso legal y ético",
      filter:
        "Sus términos permiten el uso solo para fines legales y éticos y no detallan nada más. No indica una edad mínima.",
      privacyShort: "Sin expectativa de privacidad, según su política",
      privacy:
        "La página de inicio dice que no des por hecho el anonimato ni la retención cero. La política de privacidad dice que FreedomGPT puede recopilar y guardar cualquier información que facilites, que los usuarios no tienen ninguna expectativa de privacidad y que los mensajes van a proveedores de IA solo para generar respuestas. No publica ningún plazo de retención.",
      apiShort: "",
      api: "API en chat.freedomgpt.com/api/v1 con endpoints de chat, imagen, llamadas telefónicas y video. Las respuestas llegan en el formato propio de FreedomGPT, no en el esquema de OpenAI. No publica precios por token.",
      forWho:
        "Quien quiere una sola suscripción para muchos modelos, con opciones sin censura.",
      pro1: "Puedes empezar gratis sin cuenta ni tarjeta.",
      pro2: "Genera imágenes y video en la misma app.",
      con1: "Sus modelos sin censura no tienen nombre, y los términos añaden una regla ética por encima de la ley.",
      con2: "La app de escritorio de código abierto no se actualiza desde junio de 2024.",
    },
    gabAi: {
      what: "La plataforma de Gab reúne 214 modelos, incluido Arya. Tiene modo agente, genera imágenes, video y música y ofrece apps de escritorio. Defiende una postura cristiana y conservadora.",
      pricingNote:
        "Gratis: 250 créditos tras verificar el correo. Los paquetes de créditos van de 10 USD por 700 créditos a 250 USD por 31.250 y nunca caducan. Los puestos Business cuestan 20 o 99 USD. El pago pasa por Whop.",
      models:
        "214 modelos con una sola cuenta: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi y más. Arya es el modelo propio de Gab, diseñado en torno a valores cristianos y conservadores.",
      filterShort: "Libertad de expresión con límites al contenido sexual",
      filter:
        "Exige tener al menos 18 años. Sus condiciones prohíben el contenido obsceno, sexualmente explícito o pornográfico. Puede usar sistemas automáticos para revisar el contenido.",
      privacyShort: "Guarda los chats y puede usarlos para mejorar sus modelos",
      privacy:
        "Gab guarda tus prompts, respuestas e historial durante el tiempo que considere necesario y menciona la mejora de sus modelos entre sus fines. Las solicitudes llegan a los proveedores de modelos a través de las cuentas propias de Gab; su política dice que eso no hace anónima una solicitud.",
      apiShort: "",
      api: "Chat completions con el SDK de OpenAI en gab.ai/v1, con ejemplos de formato Responses y Anthropic Messages y una pasarela para Claude Code. Exige un plan Plus.",
      forWho:
        "Para quien busca una plataforma de IA cristiana y conservadora, fuera de las grandes tecnológicas.",
      pro1: "Catálogo amplio, modo agente y apps de escritorio.",
      pro2: "Los créditos comprados no caducan.",
      con1: "Prohíbe el contenido sexual explícito, también en la ficción.",
      con2: "Guarda tus mensajes y puede usarlos para mejorar modelos.",
    },
    janitorAi: {
      what: "Plataforma de rol con millones de bots creados por la comunidad. Incluye JLLM gratis y permite conectar otro modelo mediante un proxy de API.",
      pricingNote:
        "La App Store de EE. UU. muestra janitor+ a 12,99 USD al mes o 99 USD al año. El centro de ayuda confirma chats gratis ilimitados con los modelos estándar y unos 9.000 tokens de contexto. janitor+ multiplica por cinco el contexto, da prioridad y añade regeneraciones al mes con modelos prémium.",
      models:
        "JLLM es su modelo gratis. No publica en qué modelo se basa. Puedes conectar uno externo mediante un proxy. Su guía usa OpenRouter como ejemplo.",
      filterShort:
        "Bots para adultos con etiqueta. Basta declarar que tienes 18 años o más.",
      filter:
        "Para mayores de 18 años por declaración. Los bots Limited excluyen el contenido sexual. Los Limitless lo admiten. La app móvil arranca en Safe Mode hasta que habilitas el contenido adulto en la web. Prohíbe el contenido sexual con menores, la violencia sexual, el gore, la zoofilia y el discurso de odio.",
      privacyShort:
        "Guarda los chats y los puede usar en investigación y desarrollo",
      privacy:
        "Guarda los chats como contenido de usuario. Su política contempla usarlos para investigar y mejorar sus sistemas de IA. Si conectas un modelo mediante un proxy, su proveedor también recibe tus mensajes y aplica su propia política.",
      apiShort: "Puedes usar tu propia clave",
      api: "Puedes conectar una API externa mediante un proxy con tu clave. Janitor AI carece de API pública.",
      forWho:
        "Para quien juega rol y busca una biblioteca grande de personajes gratuitos.",
      pro1: "Chat gratis sin límite con millones de bots de la comunidad.",
      pro2: "Conecta el modelo que quieras mediante un proxy.",
      con1: "Con unos 9.000 tokens de contexto gratis, una historia larga puede perder las primeras escenas.",
      con2: "Solo texto. Sin generación de imágenes, video ni voz.",
    },
    sillyTavern: {
      what: "Interfaz de chat gratuita y de código abierto (AGPL-3.0) que instalas tú. Tiene fichas de personajes, libros de trasfondo y extensiones. Tú conectas el modelo.",
      pricingNote:
        "La app es gratis. Pagas la API que conectes. Si ejecutas el modelo en tu equipo, no pagas por mensaje.",
      models:
        "SillyTavern no incluye modelos. Conecta motores locales como KoboldCpp, llama.cpp, Ollama y Oobabooga TextGeneration WebUI, o API en la nube como OpenAI, Anthropic y OpenRouter.",
      filterShort: "Los límites dependen del modelo que conectes",
      filter:
        "SillyTavern no añade filtros. Se aplican los límites del modelo o del proveedor que conectes.",
      privacyShort: "Los chats se guardan en tu equipo",
      privacy:
        "SillyTavern guarda los chats en la carpeta de datos de la instalación local. Si conectas una API o extensión en la nube, los datos que le envíes se rigen por su política.",
      apiShort: "Se conecta a otras API",
      api: "Interfaz de chat que usa la API que configures.",
      forWho:
        "Para quien quiere controlar instrucciones y personajes y puede dedicar tiempo a configurarlos.",
      pro1: "Control sobre el motor, las instrucciones y las extensiones.",
      pro2: "Gratis y de código abierto. Si usas una API externa, salen de tu equipo los datos que le envíes.",
      con1: "Tú instalas y mantienes la app (Node.js 20 o superior), conectas el modelo, y en iPhone no se puede instalar.",
      con2: "El propio proyecto advierte que lleva tiempo aprender a usarla.",
    },
    characterAi: {
      what: "Plataforma de chat con más de 10 millones de personajes. Usa sus propios modelos y aplica reglas de contenido estrictas.",
      pricingNote:
        "Gratis: mensajes ilimitados con anuncios. c.ai lite reduce los anuncios y da un cupo diario de mensajes prémium. c.ai+ quita los anuncios y ofrece chats prémium sin límite y todas las funciones de memoria. Los precios varían por país.",
      models:
        "Character.AI ofrece sus propios estilos de chat. PipSqueak 3 y ShortSqueak son gratis. DeepSqueak y LongSqueak son prémium. No admite claves de modelos externos.",
      filterShort: "Tiene filtros y prohíbe la pornografía",
      filter:
        "Sus condiciones prohíben la pornografía y el centro de ayuda dice que no la admitirá. Comprueba la edad con Persona. Los menores de 18 años solo tienen acceso al modo de lectura.",
      privacyShort:
        "Puede usar los chats para entrenar modelos y personalizar anuncios",
      privacy:
        "Character.AI puede usar tus chats para entrenar modelos. El centro de ayuda explica cómo excluir los chats nuevos si estás en el EEE o el Reino Unido.",
      apiShort: "",
      api: "Sin API pública para desarrolladores.",
      forWho:
        "Para quien busca entretenimiento con personajes y prefiere un chat con filtros.",
      pro1: "Muchísimos personajes y mensajes gratis sin límite.",
      pro2: "c.ai lite tiene un precio más bajo. Permite llamadas de voz con personajes.",
      con1: "El filtro suaviza o rechaza algunas escenas oscuras y bloquea el contenido sexual explícito.",
      con2: "Puede usar tus datos para entrenar modelos y personalizar anuncios. Solo admite sus propios modelos.",
    },
    kindroid: {
      what: "Crea un compañero o una pareja virtual con memoria a largo plazo, llamadas de voz y video, selfis y chats de grupo.",
      pricingNote:
        "Prueba inicial de 50 mensajes, o 15 en algunas regiones. Después, la cuenta pasa a modo de lectura. La prueba aparte de 3 días exige un medio de pago y se convierte en suscripción si no la cancelas. Ultra y MAX se pagan aparte cada mes. Precios de la App Store de EE. UU.",
      models:
        "Ember se usa en la prueba inicial y el periodo de prueba. Los suscriptores pueden elegir Polaris y otros modelos propios, como Reverie. Kindroid también tiene modelos para selfis.",
      filterShort:
        "IA sin filtro de conversación, con reglas de seguridad para la cuenta",
      filter:
        "Kindroid dice que no filtra las respuestas, pero revisa los mensajes en busca de riesgos graves, como daño inminente a uno mismo o a otras personas. Para acreditar que tienes 18 años o más, puedes pagar la suscripción o usar Yoti.",
      privacyShort:
        "Cifrado en reposo y en tránsito, sin cifrado de extremo a extremo",
      privacy:
        "Cifra los chats al transmitirlos y almacenarlos. Sus sistemas procesan el contenido y lo revisan con controles automáticos. Kindroid declara que no vende tus datos.",
      apiShort: "API personal para tus compañeros virtuales",
      api: "Las claves personales permiten hablar con tus Kindroids.",
      forWho:
        "Para adultos que quieren un compañero virtual a largo plazo, con voz, video y fotos.",
      pro1: "Memoria, selfis, voz y videollamadas en la misma app.",
      pro2: "Conversaciones para adultos con pocos límites.",
      con1: "Cuando se acaba la prueba inicial, necesitas activar la prueba de 3 días o suscribirte para seguir chateando.",
      con2: "Para ampliar la memoria con Ultra o MAX, pagas un extra sobre el plan base.",
    },
    nomi: {
      what: "Compañero virtual con memoria a largo plazo, selfis, voz, chats de grupo y generación de video a partir de imágenes.",
      pricingNote:
        "Gratis: 50 mensajes al día. Standard añade mensajes ilimitados y voz. Precios de la App Store de EE. UU. El antiguo plan Launch fue una oferta puntual de la beta.",
      models:
        "Modelos propios, como Cambrian 6 y Solstice. No admite claves de modelos externos.",
      filterShort:
        "Texto sin filtros. Las imágenes tienen un filtro de desnudos.",
      filter:
        "Su web dice que no impone filtros arbitrarios en las conversaciones. Filtra los desnudos en imágenes por exigencias de las tiendas de apps y los servicios de pago. Para mayores de 18 años.",
      privacyShort:
        "No vende datos. El borrado de la cuenta tiene excepciones.",
      privacy:
        "Nomi dice que no vende ni alquila tus datos personales. Suele borrarlos unos 28 días después de que cierres tu cuenta. Hay excepciones para archivos de entrenamiento, comunicaciones y requisitos legales. Los datos de entrenamiento que conserva dejan de estar asociados a ti.",
      apiShort: "API personal para tus compañeros virtuales",
      api: "API REST para hablar con tus Nomis.",
      forWho:
        "Para quien quiere un compañero virtual que recuerde lo hablado con el tiempo.",
      pro1: "Memoria pensada para relaciones a largo plazo.",
      pro2: "Tiene plan gratis y declara que no vende tus datos.",
      con1: "Las imágenes tienen un filtro de desnudos.",
      con2: "La voz requiere suscripción. El plan gratis admite 50 mensajes al día.",
    },
    crushOn: {
      what: "Chat de rol para adultos con un ajuste llamado Unfiltered. Usa créditos para acceder a modelos de otros proveedores.",
      pricingNote:
        "Gratis: chats ilimitados con modelos gratis en cola y 100 créditos al mes para modelos Pro, sin modelos Ultra. Los planes de pago van de 2.000 a 125.000 créditos al mes, y el pago anual sale más barato. El chat ilimitado con modelos Pro es un Chat Package aparte.",
      models:
        "Los modelos y el límite de contexto dependen del plan. La lista pública de modelos de CrushOn.AI incluye Claude Opus 4.7 y 5.5, Claude Sonnet 4.6 y GLM 5.1 a 5.3 como opciones Ultra.",
      filterShort: "La opción Unfiltered se habilita tras verificar la edad",
      filter:
        "Para activar Unfiltered y acceder al texto adulto, verifica tu edad con una selfi o un documento mediante Didit o AgeGo, o paga 0,99 USD. Las reglas prohíben imágenes sexuales explícitas, imágenes realistas de personas reales, menores y personajes menores representados como adultos.",
      privacyShort: "Puede usar los chats para entrenar sus modelos",
      privacy:
        "Su política permite usar el contenido de los chats para entrenar modelos sin vincularlo a usuarios concretos. Su web SFW afirma lo contrario. Usa cookies para volver a mostrarte anuncios.",
      apiShort: "",
      api: "Sin API pública para desarrolladores.",
      forWho:
        "Para adultos que quieren empezar a rolear con personajes sin configurar nada.",
      pro1: "Rol para adultos en una app lista para usar, con acceso gratis.",
      pro2: "CrushOn.AI dice que no ve tu foto ni tu documento al verificar la edad.",
      con1: "Seis niveles de créditos, hasta 199,99 USD al mes. Cuesta prever cuánto gastarás.",
      con2: "El historial gratis se borra tras 7 días sin actividad. Puede usar tus chats para entrenar modelos.",
    },
    ollama: {
      what: "Herramienta con licencia MIT para ejecutar modelos abiertos en tu equipo. Tiene una API local y app de chat oficial para macOS y Windows. También ofrece modelos de pago en la nube.",
      pricingNote:
        "Ejecutar modelos en tu equipo es gratis y no tiene límite de uso. Los planes de pago cubren los modelos en la nube.",
      models:
        "Su biblioteca incluye Dolphin 3 y variantes de la comunidad con los rechazos eliminados, como Qwen 3.8 abliterated. Ollama no revisa los modelos subidos por la comunidad.",
      filterShort: "Depende del modelo que cargues",
      filter:
        "En local, los límites dependen del modelo que cargues. Las versiones ablacionadas de la comunidad buscan reducir los rechazos. El servicio en la nube tiene sus propias condiciones.",
      privacyShort: "En local, tus mensajes se quedan en tu equipo",
      privacy:
        "Ollama dice que no ve mensajes ni respuestas cuando trabajas en local. Puedes desactivar la nube. Su política dice que procesa temporalmente los mensajes y respuestas en la nube y no los usa para entrenar. Recopila algunos metadatos.",
      apiShort: "",
      api: "API local compatible con OpenAI en localhost:11434. También hay una API para los modelos en la nube.",
      forWho:
        "Para desarrolladores y usuarios con un equipo capaz de ejecutar modelos locales. Puedes añadir una interfaz de chat.",
      pro1: "En local, tus datos se quedan en tu equipo y no pagas por mensaje.",
      pro2: "Catálogo amplio y API local compatible con OpenAI.",
      con1: "Tu equipo marca el límite. Un modelo de 70B puede ocupar 43 GB antes de contar el contexto.",
      con2: "La app de chat oficial está disponible en macOS y Windows. En Linux puedes usar la terminal, la API u otra interfaz.",
    },
    lmStudio: {
      what: "App de escritorio para descargar y ejecutar modelos locales en GGUF y MLX. Incluye un servidor de API local.",
      pricingNote:
        "Los modelos locales son gratis para uso personal y laboral. Bionic+ y Pro añaden procesamiento en la nube, búsqueda web y más dispositivos. El plan gratis incluye transcripción sin conexión y LM Link para hasta cinco dispositivos.",
      models:
        "Ejecuta modelos GGUF o MLX de Hugging Face, como Dolphin y variantes de la comunidad con menos rechazos. El catálogo en la nube incluye Kimi K3.1 Pro, DeepSeek V4 Pro y GLM-5.3.",
      filterShort: "Depende del modelo que cargues",
      filter:
        "En local, LM Studio no añade filtros. Los límites dependen del modelo que cargues.",
      privacyShort: "Los modelos locales se ejecutan en tu dispositivo",
      privacy:
        "Los modelos locales se ejecutan en tu dispositivo. LM Studio afirma que sus servicios alojados no retienen datos.",
      apiShort: "",
      api: "Servidor compatible con OpenAI en localhost:1234.",
      forWho:
        "Para quien quiere ejecutar modelos locales sin usar la terminal, en un Mac con Apple Silicon, Windows o Linux.",
      pro1: "Una forma sencilla de ejecutar modelos sin censura en tu equipo.",
      pro2: "Gratis también para uso comercial.",
      con1: "App de código cerrado. No admite Mac con procesador Intel.",
      con2: "El tamaño de los modelos que puedes usar depende de tu equipo.",
    },
  },
  hub: {
    meta: {
      title: "Las mejores plataformas de IA sin censura de 2026",
      category: "Comparación",
      description:
        "{{count}} plataformas de IA sin censura comparadas: Venice.ai, NanoGPT, Janitor AI, FreedomGPT, Kindroid, modelos locales. Precios, filtros, privacidad, API.",
      imageAlt: "Plataformas AI sin censura comparadas lado a lado",
      keywords:
        "IA sin censura, chat sin filtros, alternativa a Venice.ai, NanoGPT, alternativa a Janitor AI, alternativa a Character.AI, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn.AI, SillyTavern, Ollama, LM Studio, modelos sin censura, chat NSFW, {{appName}}",
    },
    hero: {
      category: "Comparación",
      readTime: "14 min leer",
      title: "Las mejores plataformas de IA sin censura de 2026",
      subtitle:
        "{{count}} plataformas, más la nuestra. Cuánto cuesta cada una, qué filtra, qué hace con tus chats y para quién sirve. Todo con fuentes.",
    },
    intro: {
      lead: "Casi todas las plataformas de IA sin censura prometen libertad y privacidad. Algunas prohíben el contenido adulto. Otras entrenan modelos con tus chats. Una incluso te vende un token. ¿Qué dicen sus condiciones?",
      p2: "Consultamos precios, políticas y documentación oficial. La revisión más reciente fue el {{date}}. Cada ficha indica su fecha y sus fuentes.",
      disclosure:
        "{{appName}} también aparece en la comparativa. Compramos acceso a modelos de Venice.ai, uncensored.ai, NanoGPT, FreedomGPT, Gab AI y OpenRouter. Indicamos cuáles usamos y cuántos hay. Tú decides con los datos y las fuentes.",
    },
    picks: {
      title: "Qué plataforma elegir según lo que necesites",
      intro: "Empieza por lo que más te importa.",
      oneApp: {
        title: "Todo en un chat: {{appName}}",
        body: "{{modelCount}} modelos, {{uncensored}} sin censura, junto a Claude, GPT y Gemini. Imágenes, video, música y voz con el mismo saldo. Cambia de modelo en cada mensaje.",
      },
      ownWorldview: {
        title: "Un punto de vista propio: el modelo de uncensored.ai",
        body: "A muchos modelos sin censura simplemente se les quitaron los rechazos. uncensored.ai ofrece un modelo con posturas propias. En {{appName}} lo encontrarás como {{ownModel}}.",
      },
      privacy: {
        title: "Historial en el navegador: Venice.ai o NanoGPT",
        body: "Ambos guardan el historial en tu dispositivo por defecto. El modelo gratis de NanoGPT funciona sin cuenta en la web. En {{appName}}, el historial de incógnito se guarda en el navegador.",
      },
      roleplay: {
        title: "Rol con personajes: Janitor AI o SillyTavern",
        body: "Janitor AI tiene una gran biblioteca de bots gratuitos. Elige SillyTavern si quieres control total y puedes configurarlo por tu cuenta.",
      },
      companions: {
        title: "Compañía a largo plazo: Kindroid o Nomi",
        body: "Ambos tienen memoria, selfis y llamadas de voz. Kindroid ofrece una prueba. Nomi tiene plan gratis y filtra los desnudos en imágenes.",
      },
      developers: {
        title: "API con modelos sin censura: NanoGPT, Venice.ai u OpenRouter",
        body: "NanoGPT y Venice tienen muchos modelos sin censura a precios bajos por token. OpenRouter tiene el catálogo más amplio, pero ningún modelo abliterado.",
      },
      local: {
        title: "Modelos en tu equipo: Ollama o LM Studio",
        body: "Ejecuta modelos con los rechazos eliminados en tu equipo. Los datos se quedan ahí y no pagas por mensaje. La calidad depende de tu hardware.",
      },
      filtered: {
        title: "Chat con filtros: Character.AI",
        body: "Chat de personajes con filtros y verificación de edad. Los menores solo tienen acceso al modo de lectura.",
      },
    },
    table: {
      title: "Las {{count}} plataformas y {{appName}}, lado a lado",
      intro:
        "En el móvil, desliza hacia los lados. La revisión más reciente fue el {{date}}. Cada ficha indica su fecha. Nuestros datos salen de la configuración actual.",
      footnote:
        "Indicamos precios de lista de EE. UU. Para Kindroid, Nomi y janitor+ usamos la App Store de EE. UU. Los impuestos, precios regionales y ofertas varían. «Limitada» puede indicar una API personal, una clave externa propia o un complemento.",
    },
    kinds: {
      title: "Cuatro formas de filtrar las respuestas",
      intro:
        "Antes de elegir una plataforma, mira qué modelo usa y quién controla sus filtros.",
      abliterated:
        "Ablación: se elimina de los pesos de un modelo convencional o abierto la dirección asociada a los rechazos. Los investigadores redujeron los rechazos con ese ajuste, manteniendo gran parte del comportamiento original.",
      finetuned:
        "Ajuste fino sin censura: modelos como Dolphin y Venice Uncensored se vuelven a entrenar con datos elegidos para reducir los rechazos.",
      ownWorldview:
        "Punto de vista propio: {{ownModel}} se entrenó con libros y documentos vetados en los grandes sitios de internet. Ofrece posturas poco habituales en los modelos convencionales.",
      filtered:
        "Con filtros: apps como Character.AI y modelos convencionales aplican reglas de seguridad. Los modelos convencionales suelen conservar las reglas de sus proveedores incluso en plataformas sin censura.",
      tradeoff:
        "El estudio sobre la ablación observó una caída de calidad en todas sus pruebas. El entrenamiento adicional recuperó parte de esa calidad. Los modelos sin censura suelen ser más pequeños que los modelos de punta.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Las plataformas, una por una",
      intro:
        "Qué ofrece cada plataforma, cuánto cuesta y qué filtra. La revisión más reciente fue el {{date}}. Cada ficha tiene su fecha y sus fuentes.",
      price: "Precio: {{plans}}. {{note}}",
      models: "Modelos: {{text}}",
      filter: "Filtro y consentimiento: {{text}}",
      privacy: "Privacidad: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Imágenes, video y voz: {{text}}",
      open: "Fuente abierta: {{text}}",
      forWho: "Construido para: {{text}}",
      strengths: "Fuerza",
      limits: "Límites",
      sources: "Fuentes consultadas el {{date}}",
    },
    upstream:
      "{{appName}} usa la API de {{name}} para {{models}} modelos, {{uncensored}} sin censura. Algunos ejemplos: {{examples}}. Los modelos son los mismos. El chat y el cobro son nuestros.",
    us: {
      title: "Qué ofrece {{appName}}",
      intro:
        "Reunimos modelos de distintos proveedores en un solo chat. Tú eliges qué modelo y qué filtros usar.",
      models:
        "{{modelCount}} modelos de chat de {{labCount}} laboratorios: {{mainstream}} convencionales, {{open}} abiertos y {{uncensored}} sin censura. En un mismo chat puedes pasar de Claude a un modelo con los rechazos eliminados.",
      upstream:
        "Estos proveedores nos sirven modelos: Venice.ai ({{veniceModels}}), NanoGPT ({{nanoGptModels}}), uncensored.ai ({{uncensoredAiModels}}), FreedomGPT ({{freedomGptModels}}) y Gab AI ({{gabAiModels}}).",
      consent:
        "Para activar los modelos sin censura, confirma una vez que tienes 18 años o más. No les añadimos filtros.",
      privacy:
        "Los chats en incógnito se guardan en el navegador y funcionan sin cuenta. Los privados se sincronizan con tu cuenta. Enviamos cada mensaje al proveedor que lo responde.",
      pricing:
        "{{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta. Planes mensuales: {{planList}}. Puedes recargar un plan activo con créditos que no caducan. Paga con tarjeta, PayPal o criptomonedas.",
      api: "API compatible con OpenAI y Anthropic para chat, imágenes, video y voz. Se activa al contratar un plan (desde {{apiSubPrice}}) o comprar créditos.",
      media:
        "{{imageModels}} modelos de imagen, {{videoModels}} de video, {{musicModels}} de música y {{voiceModels}} de voz con el mismo saldo.",
      open: "Toda la plataforma es de código abierto. Puedes alojarla en tu propio equipo.",
      weakTitle: "Cuándo te conviene otra plataforma",
      weak1:
        "Sumamos un {{markup}} % al costo del proveedor. Si solo usas los modelos de Venice.ai o NanoGPT, pagarles directamente sale más barato.",
      weak2:
        "Janitor AI y Character.AI tienen millones de bots de la comunidad. Nuestra biblioteca es más pequeña. Puedes importar personajes desde enlaces de Character.AI y Talkie.",
      weak3:
        "Para selfis y videollamadas con un compañero virtual, mira Kindroid o Nomi.",
      weak4:
        "Si priorizas la privacidad, ejecuta un modelo en tu propio equipo.",
      modelsLink: "Ver los {{modelCount}} modelos y sus precios actuales",
      pricingLink: "Planes y créditos gratuitos",
      guideLink: "Guía de modelos sin censura y cuándo usar cada uno",
      apiLink: "API de LLM sin censura: todas las opciones, comparadas",
    },
    versus: {
      title: "Comparaciones cara a cara",
      intro:
        "{{versusCount}} comparativas con puntos fuertes, límites y cuándo elegir cada plataforma.",
    },
    method: {
      title: "Cómo hicimos la comparación",
      intro: "Cómo hicimos la revisión. La más reciente fue el {{date}}.",
      sources:
        "Consultamos fuentes oficiales: precios, condiciones, políticas de privacidad, centros de ayuda, documentación de API y catálogos de modelos.",
      prices:
        "Indicamos precios de lista en dólares de EE. UU. Cuando el precio exige iniciar sesión, usamos la ficha oficial de la tienda de apps y lo indicamos.",
      noScores:
        "Cada plataforma sirve para algo distinto. La elección depende de lo que quieras hacer.",
      us: "Nuestros precios, modelos y créditos gratuitos salen de la configuración que aplica los cobros.",
      bias: "Competimos con varias plataformas de esta página y también les compramos acceso a modelos. Indicamos cuáles y cuándo te conviene usarlas directamente.",
      changes:
        "Los planes y las políticas cambian. Cada ficha enlaza las fuentes para que puedas comprobarlas antes de comprar.",
      corrections:
        "¿Ves un precio desactualizado o un dato incorrecto? Envíanos el enlace a la fuente y lo corregimos.",
      correctionsLink: "Contacta con nosotros",
    },
    faq: {
      title: "FAQ",
      best: {
        q: "¿Cuál es la mejor IA sin censura?",
        a: "Para varios modelos y generación en un chat, {{appName}}. Para guardar el historial en tu equipo, Venice.ai o NanoGPT. Para rol, Janitor AI o SillyTavern. Para compañía, Kindroid o Nomi. Para ejecutar modelos en local, Ollama o LM Studio.",
      },
      free: {
        q: "¿Hay IA sin censura gratis?",
        a: "Sí, con límites. Venice.ai da 10 consultas de texto al día y uncensored.ai, 3 respuestas. Janitor AI da chat ilimitado con su modelo. CrushOn.AI da 100 créditos al mes y {{appName}}, {{guestCredits}} sin cuenta. Los modelos locales con Ollama o LM Studio no tienen costo por mensaje.",
      },
      private: {
        q: "¿Cuál es la IA sin censura más privada?",
        a: "En local, el contenido del chat se queda en tu equipo. Venice.ai y NanoGPT guardan el historial en tu dispositivo por defecto. El modelo gratis de NanoGPT funciona sin cuenta. En {{appName}}, el historial de incógnito se queda en el navegador. Los servicios en la nube envían la solicitud al modelo que responde.",
      },
      difference: {
        q: "¿Qué es la ablación en un modelo sin censura?",
        a: "La ablación elimina de los pesos del modelo la dirección asociada a los rechazos. Otros modelos, como Dolphin, buscan reducirlos con un entrenamiento adicional. {{ownModel}} se entrenó con libros y documentos vetados en los grandes sitios de internet y expresa posturas propias.",
      },
      veniceVs: {
        q: "¿Venice.ai es realmente una IA sin censura?",
        a: "Venice.ai ofrece modelos sin censura y activa por defecto el filtro de adultos. Pro permite desactivarlo. Claude, GPT y Gemini conservan los filtros de sus proveedores.",
      },
      characterAi: {
        q: "¿Hay una versión de Character.AI sin filtros?",
        a: "Character.AI prohíbe la pornografía. Para rol adulto puedes usar bots Limitless en Janitor AI, la opción Unfiltered de CrushOn.AI, Kindroid, o un modelo sin censura en SillyTavern o {{appName}}.",
      },
      gabAi: {
        q: "¿Gab AI es una IA sin censura?",
        a: "Arya, el modelo propio de Gab AI, se centra en política, cultura y fe desde una postura conservadora. Sus condiciones prohíben el contenido sexual explícito. {{appName}} ofrece Arya junto a modelos sin censura que permiten ficción para adultos.",
      },
      uncensoredAi: {
        q: "¿Qué diferencia a uncensored.ai de otras IA sin censura?",
        a: "A muchos modelos sin censura se les quitaron los rechazos. El de uncensored.ai se entrenó con libros y documentos vetados en los grandes sitios de internet y expresa posturas políticas poco convencionales. En {{appName}} se llama {{ownModel}}.",
      },
      openRouter: {
        q: "¿OpenRouter tiene modelos sin censura?",
        a: "Unos pocos: 17 de sus 477 modelos encajan con rol o sin censura, como Venice Uncensored, Hermes 4 405B y Magnum, y ninguno es abliterado. Para más variedad sin censura en una sola API, NanoGPT, Venice y {{appName}} tienen muchos más.",
      },
      local: {
        q: "¿Puedo ejecutar un AI sin censura en mi propio ordenador?",
        a: "Sí. Carga Dolphin o un modelo ablacionado en Ollama o LM Studio. Un modelo de 8B puede ocupar unos 5 GB. Uno de 70B puede exigir más de 40 GB de memoria.",
      },
      legal: {
        q: "¿Es legal usar un AI sin censura?",
        a: "Lo que generas y publicas está sujeto a la ley de tu país. Las plataformas alojadas también tienen sus propias condiciones de uso.",
      },
    },
    cta: {
      title: "Prueba con tus propias preguntas",
      subtitle:
        "{{guestCredits}} créditos gratis al mes, sin cuenta. Haz esa pregunta que otro modelo rechazó y compara las respuestas.",
      try: "Abrir un chat en incógnito",
      models: "Ver todos los modelos",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "{{appName}} vs Venice.ai: comparativa de 2026",
        description:
          "{{appName}} vs Venice.ai: precios, modelos sin censura, filtro adulto, privacidad y API. Somos clientes de Venice.ai y explicamos cuándo conviene cada una.",
        keywords:
          "alternativa a Venice.ai, Venice.ai vs, precios de Venice.ai, Venice Pro, Venice Uncensored, filtro de Venice.ai, API de Venice.ai, VVV DIEM, chat sin censura, {{appName}} vs Venice.ai",
      },
      hero: {
        title: "{{appName}} vs Venice.ai",
        subtitle:
          "Dos plataformas de IA sin censura. Una compra acceso a modelos de la otra. Comparamos precios, filtros, privacidad y API.",
        readTime: "7 min leer",
      },
      intro: {
        lead: "Venice.ai es conocida por mantener el historial en tu equipo y por sus modelos sin censura. Usamos su API para varios de nuestros modelos. ¿Cuándo te conviene ir directo a Venice.ai y cuándo usar esos modelos en {{appName}}?",
        p2: "El {{date}} consultamos los precios, la política de privacidad y la documentación de Venice.ai. Nuestros datos salen de nuestra configuración actual.",
      },
      relation:
        "Somos clientes de Venice.ai: usamos su API para {{veniceModels}} modelos, de los cuales {{veniceUncensored}} son sin censura. Algunos ejemplos: {{veniceExamples}}.",
      verdict:
        "Elige Venice.ai para acceder a todo su catálogo, guardar el historial en tu equipo y pagar menos por token en sus modelos. Pro permite quitar el filtro adulto. Elige {{appName}} para combinar esos modelos con Claude, GPT, el modelo de uncensored.ai y variantes de GLM y DeepSeek sin rechazos, en un chat. Basta confirmar una vez que tienes 18 años o más.",
      themPros: {
        a: "Su catálogo de API lista 145 modelos de texto, 52 de imagen, 160 de video, 11 de voz y 19 de música.",
        b: "El historial se queda en tu dispositivo por defecto.",
        c: "La forma más barata de llamar a los modelos propios de Venice: sin margen de intermediarios, y con x402 pagas por solicitud desde un monedero USDC sin cuenta.",
      },
      themCons: {
        a: "Gratis: 10 consultas de texto al día con modelos básicos.",
        b: "El filtro adulto se activa por defecto. Pro permite desactivarlo.",
        c: "Sin API nativa de Anthropic Messages: su guía de Claude Code usa un proxy de traducción local.",
      },
      usPros: {
        a: "En el mismo selector: modelos sin censura de Venice.ai, NanoGPT, uncensored.ai, FreedomGPT y Gab AI.",
        b: "Basta confirmar una vez que tienes 18 años o más para desbloquear todos los modelos sin censura, incluso en el plan gratis.",
        c: "{{guestCredits}} créditos gratis al mes sin cuenta. Todo el código es abierto.",
      },
      usCons: {
        a: "Los mismos modelos de Venice.ai cuestan más aquí. Sumamos un {{markup}} % al precio del proveedor.",
        b: "Nuestro catálogo total es más pequeño.",
        c: "Guardamos los chats privados para sincronizarlos. El historial de incógnito se queda en el navegador. Venice.ai guarda el historial localmente por defecto y ofrece copias cifradas en sus planes de pago.",
      },
      chooseThem: {
        a: "Quieres un catálogo amplio de modelos sin censura de un solo proveedor.",
        b: "Tienes VVV o DIEM, o quieres pagar por solicitud desde un monedero USDC.",
        c: "Usas la API de Venice.ai y quieres la mejor tarifa por token para sus modelos.",
      },
      chooseUs: {
        a: "Quieres modelos que Venice.ai no ofrece, como {{ownModel}}, en el mismo chat.",
        b: "Quieres usar modelos sin censura desde el plan gratis.",
        c: "Quieres código abierto, alojamiento propio y un saldo para chat, imágenes, video y música.",
      },
      both: "Usa Venice.ai para acceder a su catálogo completo. En {{appName}} puedes comparar sus respuestas con las de otros modelos sin censura en el mismo chat.",
      switch: {
        title: "Pasar de Venice.ai a nuestro chat",
        body: "Encontrarás Venice Uncensored y otros modelos de Venice.ai con sus nombres originales. Abre un chat en incógnito y elige uno. Si quieres continuar un chat anterior, pega el contexto en el primer mensaje.",
      },
      faq: {
        q1: {
          q: "¿{{appName}} es lo mismo que Venice.ai?",
          a: "Son plataformas independientes. Somos de código abierto y usamos modelos de Venice.ai, NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter y los grandes laboratorios.",
        },
        q2: {
          q: "¿Venice.ai es gratis?",
          a: "Las cuentas gratis tienen 10 consultas de texto y 15 de imagen al día con modelos base. Pro es el plan de entrada y permite a los adultos desactivar el Mature Filter. Pro Plus y Max añaden créditos para video, música y llamadas a la API.",
        },
        q3: {
          q: "¿Venice.ai es más barato que {{appName}}?",
          a: "Sí, para sus propios modelos. Sumamos un {{markup}} % al costo del proveedor. Aquí puedes combinar modelos de distintos proveedores con el mismo saldo.",
        },
        q4: {
          q: "¿Qué plataforma protege más la privacidad, Venice.ai o {{appName}}?",
          a: "Venice.ai guarda el historial en tu equipo por defecto y ofrece copias cifradas en planes de pago. {{appName}} guarda el historial de incógnito en el navegador y los chats privados para sincronizarlos. Ambas plataformas envían los mensajes al modelo que te responde.",
        },
      },
      cta: { title: "Prueba los modelos de Venice.ai junto a los demás" },
    },
    characterAi: {
      meta: {
        title: "Alternativa a Character.AI sin filtros: {{appName}} vs C.AI",
        description:
          "{{appName}} vs Character.AI. Comparamos filtros, verificación de edad, modelos, privacidad y precio. Cuándo elegir cada plataforma.",
        keywords:
          "alternativa a Character.AI, Character.AI sin filtros, filtros de Character.AI, precio de c.ai+, Character.AI NSFW, verificación de edad en Character.AI, rol sin censura, {{appName}} vs Character.AI",
      },
      hero: {
        title: "{{appName}} vs Character.AI: una alternativa sin filtros",
        subtitle:
          "Dos formas de chatear con personajes. Qué permite cada plataforma, cuánto cuesta y dónde acaban tus chats.",
        readTime: "7 min leer",
      },
      intro: {
        lead: "Character.AI tiene una biblioteca enorme de personajes. Su filtro puede cortar una escena en pleno diálogo. Su centro de ayuda dice que la pornografía queda fuera. Si ese límite te impide contar tu historia, busca una plataforma que permita rol adulto.",
        p2: "Consultamos los planes, el centro de ayuda y la política de privacidad de Character.AI el {{date}}. Nuestros datos salen de nuestra configuración actual.",
      },
      relation:
        "No tenemos relación comercial con Character.AI. Puedes importar un personaje como habilidad en {{appName}} pegando su enlace de Character.AI.",
      verdict:
        "Elige Character.AI para divertirte sin contenido adulto con millones de personajes ya hechos, gratis y sin límite, o si eres menor de 18. Elige {{appName}} si el filtro te rompe la historia una y otra vez: modelos de rol sin censura tras una única confirmación de mayoría de edad, modelo a elegir en cada mensaje y sin píxeles publicitarios ni rastreadores de terceros.",
      themPros: {
        a: "Millones de personajes de la comunidad listos para chatear.",
        b: "Mensajes gratis sin límite y planes de pago económicos.",
        c: "Llamadas de voz con los personajes.",
      },
      themCons: {
        a: "Bloquea el contenido sexual explícito y puede suavizar escenas oscuras.",
        b: "Los chats pueden usarse para entrenamiento. El centro de ayuda explica cómo excluir el contenido nuevo en el EEE y el Reino Unido.",
        c: "Solo ofrece sus propios modelos y no admite claves externas.",
      },
      usPros: {
        a: "{{uncensored}} modelos sin censura, incluidos varios para rol. La escena puede seguir adonde la lleves.",
        b: "Cambia de modelo en cada mensaje. Usa uno de rol para la escena y uno avanzado para planearla.",
        c: "Los chats de incógnito se quedan en tu navegador. Sin píxeles publicitarios ni rastreadores de terceros.",
      },
      usCons: {
        a: "Menos personajes listos para usar. Puedes escribir los tuyos o importarlos.",
        b: "Los mensajes consumen créditos. El uso gratis tiene límite.",
        c: "Sin llamadas de voz con los personajes.",
      },
      chooseThem: {
        a: "Quieres filtros y una biblioteca grande de personajes.",
        b: "Para un menor, basta el modo de lectura.",
        c: "Quieres mensajes gratis sin límite.",
      },
      chooseUs: {
        a: "El filtro interrumpe tus escenas de rol.",
        b: "Quieres elegir el modelo en cada mensaje.",
        c: "Quieres un chat sin píxeles publicitarios ni rastreadores de terceros.",
      },
      both: "Puedes seguir usando Character.AI para conversar e importar aquí los personajes de las historias que requieren un modelo para adultos.",
      switch: {
        title: "Importar un personaje de Character.AI",
        body: "Copia el enlace del personaje y pégalo en el importador de habilidades de {{appName}}. Se importan el nombre, el saludo y la definición si el creador los hizo públicos. Elige un modelo de rol sin censura y sigue la historia.",
      },
      faq: {
        q1: {
          q: "¿Character.AI permite contenido NSFW?",
          a: "Su centro de ayuda dice que la pornografía infringe sus condiciones y no estará permitida.",
        },
        q2: {
          q: "¿Character.AI comprueba la edad?",
          a: "Sí. Verifica la edad con Persona. Los menores de 18 años solo acceden al modo de lectura.",
        },
        q3: {
          q: "¿{{appName}} es una alternativa a Character.AI sin filtros?",
          a: "Sí, para adultos. Confirma una vez que tienes 18 años o más para acceder a modelos sin censura, incluidos varios de rol. Los modelos convencionales conservan los filtros de sus proveedores.",
        },
        q4: {
          q: "¿Puedo importar mis personajes de Character.AI?",
          a: "Sí. Pega el enlace en el importador de habilidades. Se importa la información que el creador hizo pública en Character.AI.",
        },
      },
      cta: { title: "Sigue la historia sin filtros" },
    },
    janitorAi: {
      meta: {
        title: "Alternativa a Janitor AI: {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI. JLLM y {{modelCount}} modelos, límites de contexto, reglas de contenido adulto, proxies, privacidad y precios.",
        keywords:
          "alternativa a Janitor AI, Janitor AI vs, JanitorAI, precio de janitor+, JLLM, proxy de Janitor AI, OpenRouter, contexto de Janitor AI, rol sin censura, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "Una gran comunidad de rol y un chat con varios modelos sin censura. Comparamos modelos, memoria, reglas y precios.",
        readTime: "6 min leer",
      },
      intro: {
        lead: "Janitor AI reúne millones de bots de la comunidad y ofrece un modelo gratis. Las historias largas ponen a prueba su contexto de unos 9.000 tokens. Para usar modelos externos puedes configurar un proxy con tu propia clave.",
        p2: "Consultamos la página de janitor+, el centro de ayuda y las políticas el {{date}}. Nuestros datos salen de nuestra configuración actual.",
      },
      relation:
        "No tenemos relación comercial con Janitor AI. Su oferta gira en torno a la biblioteca de personajes. La nuestra, en torno a la selección de modelos.",
      verdict:
        "Elige Janitor AI por su biblioteca de bots y sus chats ilimitados con JLLM. Elige {{appName}} para usar modelos sin censura con contexto largo, sin configurar un proxy, y generar imágenes, video y voz en el mismo chat.",
      themPros: {
        a: "Millones de bots de la comunidad. Los de rol adulto se etiquetan como Limitless.",
        b: "Chat gratis e ilimitado con su modelo.",
        c: "Conecta tu modelo mediante un proxy, incluido OpenRouter.",
      },
      themCons: {
        a: "Unos 9.000 tokens de contexto gratis. Puedes perder las primeras escenas de una historia larga.",
        b: "janitor+ incluye un cupo mensual en modelos prémium. Para conectar tu propio modelo necesitas una clave de API y un proxy.",
        c: "Solo texto. La app móvil arranca en Safe Mode.",
      },
      usPros: {
        a: "{{modelCount}} modelos, {{uncensored}} sin censura. Elige uno sin configurar claves ni proxies.",
        b: "Modelos sin censura con contexto largo para campañas que duran semanas.",
        c: "Imágenes, video, música y voz en el mismo chat y con el mismo saldo.",
      },
      usCons: {
        a: "Una biblioteca de personajes mucho más pequeña.",
        b: "{{guestCredits}} créditos gratis al mes. Después necesitas un plan.",
        c: "No tenemos un listado público de bots de la comunidad.",
      },
      chooseThem: {
        a: "Quieres explorar miles de bots listos para chatear.",
        b: "Quieres chatear sin límite y te basta el modelo gratis.",
        c: "Ya tienes un proxy con tu clave y te funciona bien.",
      },
      chooseUs: {
        a: "Tus historias largas necesitan un modelo sin censura con más contexto.",
        b: "Quieres cambiar de modelo a mitad de escena sin tocar un proxy.",
        c: "Quieres crear imágenes o voces para tus personajes en el mismo chat.",
      },
      both: "Descubre personajes en Janitor AI y juega las campañas largas en {{appName}}.",
      switch: {
        title: "Pasar de Janitor AI a nuestro chat",
        body: "Crea una habilidad en {{appName}} con la personalidad, la situación y el saludo del personaje. Elige un modelo de rol sin censura. Puedes probar una escena en incógnito sin abrir una cuenta.",
      },
      faq: {
        q1: {
          q: "¿Janitor AI es gratis?",
          a: "Sí. Ofrece chats ilimitados con su modelo y unos 9.000 tokens de contexto. janitor+ añade memoria, prioridad y modelos.",
        },
        q2: {
          q: "¿Janitor AI permite contenido adulto?",
          a: "Sí. En la web, los adultos pueden usar bots etiquetados como Limitless. La app móvil arranca en Safe Mode hasta que habilitas el contenido adulto en la web.",
        },
        q3: {
          q: "¿Necesito un proxy para usar {{appName}}?",
          a: "Elige el modelo en el selector. Cada mensaje consume créditos y puedes enviarlo sin clave de API.",
        },
        q4: {
          q: "¿Cuál tiene más memoria para historias largas?",
          a: "Janitor AI indica unos 9.000 tokens de contexto gratis y cinco veces más con janitor+. En {{appName}}, el contexto depende del modelo que elijas.",
        },
      },
      cta: {
        title: "Juega tu próxima campaña con un modelo de contexto largo",
      },
    },
    nanoGpt: {
      meta: {
        title: "{{appName}} vs NanoGPT: comparativa de 2026",
        description:
          "{{appName}} vs NanoGPT: pago por uso o planes, modelos sin censura, privacidad y API. Somos clientes de NanoGPT y explicamos cuándo conviene usarlo directo.",
        keywords:
          "alternativa a NanoGPT, NanoGPT vs, precio de NanoGPT, NanoGPT PRO, NanoGPT sin censura, API de modelos ablacionados, IA de pago por uso, API sin censura, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Dos plataformas con varios modelos sin censura y una API. Una prioriza el pago por uso y la otra, los planes.",
        readTime: "6 min leer",
      },
      intro: {
        lead: "NanoGPT cobra por uso y permite probar un modelo gratis sin registrarte. Varios de nuestros modelos sin censura usan su API. Te contamos cuándo conviene cada plataforma.",
        p2: "Consultamos los precios, la política de privacidad, las condiciones y el catálogo público de NanoGPT el {{date}}. Nuestros datos salen de nuestra configuración actual.",
      },
      relation:
        "Somos clientes de NanoGPT. Usamos su API para {{nanoGptModels}} modelos, {{nanoGptUncensored}} sin censura. Algunos ejemplos: {{nanoGptExamples}}.",
      verdict:
        "Elige NanoGPT por un catálogo amplio y acceso de pago por uso, incluidas llamadas a la API sin cuenta pagadas con Lightning. Elige {{appName}} por una selección probada entre proveedores, créditos gratis cada mes, skills, memoria y un chat de código abierto que puedes alojar tú mismo.",
      themPros: {
        a: "610 entradas de modelos, 54 de ellas fine-tunes abliterated, uncensored o similares.",
        b: "No hace falta suscripción. Primera recarga desde 0,10 USD en cripto, Monero incluido.",
        c: "Precios de lista cuando NanoGPT elige la ruta automáticamente.",
      },
      themCons: {
        a: "Gratis, un solo modelo en la web.",
        b: "La privacidad depende de la ruta del proveedor. Su Private Mode cifrado cuesta un 5 % extra.",
        c: "El catálogo es grande. Tú haces las pruebas para elegir.",
      },
      usPros: {
        a: "Cada modelo va etiquetado como convencional, abierto o sin censura y tiene una ficha con su precio actual.",
        b: "{{guestCredits}} créditos gratis al mes para probar modelos sin censura con tus preguntas.",
        c: "Habilidades, memoria y carpetas para el trabajo de largo recorrido. Código abierto que puedes alojar tú.",
      },
      usCons: {
        a: "Menos modelos que NanoGPT.",
        b: "Sumamos un {{markup}} % al costo del proveedor. El mismo modelo cuesta más aquí.",
        c: "Para recargar con paquetes de créditos necesitas un plan activo.",
      },
      chooseThem: {
        a: "Quieres pagar por uso sin suscripción, o hacer llamadas a la API sin cuenta pagadas con Lightning.",
        b: "Buscas un modelo que pocos catálogos ofrecen.",
        c: "Vas a integrar la API y buscas precios de lista.",
      },
      chooseUs: {
        a: "Quieres una selección de modelos ya probados.",
        b: "Quieres créditos gratis cada mes y un chat con habilidades y memoria.",
        c: "Quieres usar los modelos de uncensored.ai, Venice.ai y NanoGPT en el mismo hilo.",
      },
      both: "Puedes usar la API de NanoGPT para tareas por lotes y {{appName}} para tus chats de cada día.",
      switch: {
        title: "Pasar de NanoGPT a nuestro chat",
        body: "En el selector están los mismos modelos de NanoGPT, como {{nanoGptExamples}}. Abre un chat en incógnito, elige uno y compara su respuesta con la de otro proveedor en el mismo hilo.",
      },
      faq: {
        q1: {
          q: "¿NanoGPT es más barato que {{appName}}?",
          a: "Por token, normalmente sí. NanoGPT cobra precios de lista y nosotros sumamos un {{markup}} %. Aquí tienes {{guestCredits}} créditos gratis al mes y puedes combinar proveedores en el mismo chat.",
        },
        q2: {
          q: "¿NanoGPT exige una cuenta?",
          a: "El modelo web gratis funciona sin cuenta, y un saldo de invitado funciona con un token de sesión. Para suscribirte hay que iniciar sesión. La API acepta pagos Lightning (L402) sin cuenta; x402 se eliminó el 2026-11-20.",
        },
        q3: {
          q: "¿Ambos tienen API?",
          a: "Sí. La API de NanoGPT habla OpenAI chat completions, Responses y Anthropic Messages, con pagos Lightning sin cuenta. La nuestra habla los mismos tres formatos y se desbloquea tras comprar un plan o créditos.",
        },
        q4: {
          q: "¿Cuál tiene más modelos sin censura?",
          a: "NanoGPT enumera más. {{appName}} ofrece {{uncensored}} modelos sin censura que hemos seleccionado y probado, de NanoGPT, Venice.ai, uncensored.ai, FreedomGPT y Gab AI.",
        },
      },
      cta: {
        title: "Compara los modelos de NanoGPT con los de otros proveedores",
      },
    },
    freedomGpt: {
      meta: {
        title: "Alternativa a FreedomGPT: {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} frente a FreedomGPT: Liberty y opciones sin censura, reglas de contenido, privacidad, créditos, API y código abierto. Hechos con fuentes, de ambas partes.",
        keywords:
          "alternativa a FreedomGPT, FreedomGPT vs, precios de FreedomGPT, FreedomGPT Pro, modelo Liberty, FreedomGPT sin censura, alternativa a ChatGPT sin censura, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Dos apps que ponen opciones sin censura junto a ChatGPT, Claude y Gemini. Reglas, privacidad, créditos, código abierto.",
        readTime: "6 min leer",
      },
      intro: {
        lead: "FreedomGPT y {{appName}} reúnen modelos convencionales y sin censura en el mismo selector. Cambian las reglas, los créditos y qué pasa con tus mensajes.",
        p2: "Consultamos la web, los precios, la política de privacidad, la documentación y el repositorio de FreedomGPT el {{date}}. Nuestros datos salen de nuestra configuración actual.",
      },
      relation:
        "Somos clientes de FreedomGPT. {{freedomGptExamples}} funciona en {{appName}} a través de su API.",
      verdict:
        "Elige FreedomGPT por un único plan de 20 USD que cubre chat, imágenes y video, con inicio gratis y sin cuenta. Elige {{appName}} si quieres modelos sin censura con nombre de varios proveedores, ninguna cláusula ética por encima de la ley, precios por modelo publicados y una plataforma de código abierto en desarrollo activo.",
      themPros: {
        a: "Empieza gratis, sin tarjeta ni cuenta.",
        b: "Opciones sin censura y su modelo Liberty junto a ChatGPT, Claude y Gemini.",
        c: "Imágenes y video en el mismo plan.",
      },
      themCons: {
        a: "Sus términos solo permiten un uso legal y ético, y sus modelos sin censura no tienen nombre.",
        b: "Su política dice que los usuarios no tienen ninguna expectativa de privacidad y no indica plazo de retención.",
        c: "La app de escritorio de código abierto no se actualiza desde junio de 2024.",
      },
      usPros: {
        a: "{{uncensored}} modelos sin censura de cinco proveedores, incluido Liberty.",
        b: "Cada modelo tiene una ficha pública con el precio por mensaje.",
        c: "La plataforma de código abierto sigue en desarrollo. Puedes alojarla tú.",
      },
      usCons: {
        a: "El consumo de créditos varía según el modelo.",
        b: "Para usar memoria y sincronizar chats necesitas una cuenta.",
        c: "También sumamos un {{markup}} % al costo de los modelos de FreedomGPT.",
      },
      chooseThem: {
        a: "Quieres un plan de 20 USD al mes para chat, imágenes y video.",
        b: "Te basta con Liberty y sus modelos convencionales.",
        c: "Quieres una app de escritorio sin conexión y te sirve la versión de 2024.",
      },
      chooseUs: {
        a: "Quieres más modelos sin censura, incluidos los de Venice.ai, NanoGPT, uncensored.ai y Gab AI.",
        b: "Quieres ver cuánto cuesta un mensaje antes de enviarlo.",
        c: "Quieres código abierto actualizado que puedas alojar tú.",
      },
      both: "Liberty está en nuestro selector. Puedes compararlo con otros modelos sin censura con el mismo saldo.",
      switch: {
        title: "Pasar de FreedomGPT a nuestro chat",
        body: "Elige Liberty en el selector. Haz la misma pregunta a {{ownModel}} o a un modelo con los rechazos eliminados y elige la mejor respuesta.",
      },
      faq: {
        q1: {
          q: "¿FreedomGPT realmente carece de censura?",
          a: "FreedomGPT anuncia opciones sin censura, pero no nombra ningún modelo, y sus términos solo permiten un uso legal y ético. En {{appName}}, cada modelo sin censura tiene nombre, su propia página y se desbloquea tras una única confirmación de mayoría de edad.",
        },
        q2: {
          q: "¿Cuánto cuesta FreedomGPT?",
          a: "Puedes empezar gratis. Pro incluye 2.200 créditos al mes. Una respuesta prémium cuesta unos 10, una imagen unos 25 y un video de 5 segundos unos 400.",
        },
        q3: {
          q: "¿FreedomGPT es de código abierto?",
          a: "Su antigua app de escritorio para modelos sin conexión está en GitHub con licencia GPL-3.0. Su última actualización fue en junio de 2024. La app en la nube es de código cerrado. {{appName}} publica el código de toda la plataforma.",
        },
        q4: {
          q: "¿Puedo usar Liberty de FreedomGPT en {{appName}}?",
          a: "Sí. Liberty funciona a través de la API de FreedomGPT y está en el selector con los demás modelos sin censura.",
        },
      },
      cta: { title: "Prueba Liberty con otros modelos sin censura" },
    },
    gabAi: {
      meta: {
        title: "Alternativa a Gab AI: {{appName}} vs Gab AI (2026)",
        description:
          "{{appName}} vs Gab AI: Arya, 214 modelos, prohibición del contenido sexual, privacidad, créditos y API. Compramos a Gab, así que decimos dónde gana cada uno.",
        keywords:
          "alternativa a Gab AI, Gab AI alternative, Gab AI vs, opinión Gab AI, precio Gab AI, Gab AI Plus, Arya AI, Gab Arya, Gab AI sin censura, Gab AI NSFW, Gab AI API, chatbot conservador, IA de derecha, chat IA sin censura, {{appName}} vs Gab AI",
      },
      hero: {
        title: "{{appName}} vs Gab AI",
        subtitle:
          "Dos apps multimodelo que se niegan a censurar la política. Una de ellas también prohíbe el contenido adulto. Precios, reglas, privacidad y API, frente a frente.",
        readTime: "7 min de lectura",
      },
      intro: {
        lead: "Gab AI creó Arya para quienes están hartos de chatbots que les sermonean sobre política, cultura y fe. Nosotros también ofrecemos Arya, a través de la propia API de Gab. Así que la pregunta real no es cuál está sin censura. Es qué reglas quieres alrededor del modelo.",
        p2: "Datos de Gab AI sacados de su página principal, su página de precios, su página de API, sus términos y su política de privacidad, consultados el {{date}}. Los nuestros se leen en directo de nuestra configuración.",
      },
      relation:
        "Somos clientes de Gab AI: {{gabAiExamples}} funciona en {{appName}} a través de la API de Gab. El mismo modelo, otra app y otras reglas a su alrededor.",
      verdict:
        "Elige Gab AI si quieres Arya con el modo agente de Gab, apps de escritorio y un catálogo de 214 modelos bajo una sola marca conservadora, y nunca necesitas contenido adulto. Elige {{appName}} si quieres Arya junto a {{ownModel}} y versiones abliteradas de GLM y DeepSeek en un mismo chat, ficción para adultos en los modelos sin censura que la permiten y chats que pueden quedarse en tu navegador.",
      themPros: {
        a: "214 modelos en una sola cuenta, más Arya, su modelo propio para política, cultura y fe.",
        b: "Modo agente (Work), voz en directo, imagen, vídeo y música, y apps para Mac, Windows, iPhone y Android.",
        c: "Los paquetes de créditos comprados se acumulan y no caducan.",
      },
      themCons: {
        a: "Sus términos prohíben el contenido obsceno, sexualmente explícito o pornográfico, y sistemas automáticos pueden revisar tu contenido.",
        b: "Guarda prompts, respuestas e historial en sus servidores, y la mejora de sus modelos figura entre sus fines.",
        c: "Lo gratis son 250 créditos únicos de registro tras verificar el correo. La API requiere Plus o Plus Premium.",
      },
      usPros: {
        a: "{{uncensored}} modelos sin censura de varios proveedores, Arya incluido, en un solo selector de modelos.",
        b: "Sin prohibición general del contenido adulto: una única confirmación de mayoría de edad (18+) desbloquea todos los modelos sin censura.",
        c: "{{guestCredits}} créditos gratis al mes sin cuenta. Los chats en modo incógnito se quedan en tu navegador.",
      },
      usCons: {
        a: "Sin modo agente ni app de escritorio como Work de Gab.",
        b: "Catálogo más pequeño: {{modelCount}} modelos de chat frente a los 214 de Gab.",
        c: "Nuestro margen del {{markup}} % también se aplica a Arya.",
      },
      chooseThem: {
        a: "Quieres Arya con el modo agente y las apps de escritorio de Gab.",
        b: "Compartes los valores de Gab y quieres apoyar a una empresa de IA nacida fuera de las Big Tech.",
        c: "Nunca escribes ficción para adultos y quieres el catálogo más grande en una sola factura.",
      },
      chooseUs: {
        a: "Quieres comparar Arya con {{ownModel}} y con modelos abliterados en el mismo hilo.",
        b: "Escribes ficción adulta u oscura y necesitas modelos que la permitan.",
        c: "Quieres empezar sin cuenta y mantener los chats en modo incógnito en tu navegador.",
      },
      both: "Arya está en nuestro selector, así que puedes lanzar la misma pregunta a Arya, a {{ownModel}} y a un modelo abliterado y juzgar tú mismo las respuestas, sin una segunda suscripción.",
      switch: {
        title: "Cambiar desde Gab AI",
        body: "Elige Arya en nuestro selector de modelos y sigue donde lo dejaste. Después envía el mismo prompt a {{ownModel}}: ninguno de los dos esquiva la política, pero se construyeron de forma distinta, y las respuestas lo demuestran. Si necesitas contexto anterior, pégalo en el primer mensaje.",
      },
      faq: {
        q1: {
          q: "¿Gab AI es realmente una IA sin censura?",
          a: "En política, cultura y fe, sí: para eso está hecho Arya. En contenido sexual, no. Los términos de Gab prohíben el contenido obsceno, sexualmente explícito o pornográfico y dicen que sistemas automáticos pueden revisar tu contenido para comprobar que los cumple.",
        },
        q2: {
          q: "¿Cuánto cuesta Gab AI?",
          a: "Las cuentas gratis reciben 250 créditos de registro tras verificar el correo. Plus cuesta $20 al mes o $200 al año, con 2.000 créditos al mes. Plus Premium cuesta $999 al año, con 12.000 créditos. Los paquetes de créditos empiezan en $10 por 700 créditos.",
        },
        q3: {
          q: "¿Puedo usar Arya en {{appName}}?",
          a: "Sí. Arya funciona a través de la API de Gab y está en nuestro selector junto a {{ownModel}} y los demás modelos sin censura. Las reglas de contenido de Gab siguen aplicándose a las respuestas de Arya.",
        },
        q4: {
          q: "¿Gab AI guarda mis chats?",
          a: "Sí. Su política de privacidad dice que guarda tus prompts, respuestas e historial de conversaciones, cita la mejora de sus modelos como uno de sus fines y advierte que enviar solicitudes a los proveedores de modelos no las hace anónimas. En {{appName}}, los chats en modo incógnito se quedan en tu navegador.",
        },
      },
      cta: {
        title: "Pon a prueba Arya frente a todos los demás modelos sin censura",
      },
    },
    uncensoredAi: {
      meta: {
        title: "Alternativa a uncensored.ai: {{appName}} vs uncensored.ai",
        description:
          "{{appName}} vs uncensored.ai: el mismo modelo UncensoredLM, otra app. Límites gratis, precio de Pro, API, privacidad y multimedia frente a frente, con fuentes.",
        keywords:
          "alternativa a uncensored.ai, uncensored.ai alternative, uncensored.ai vs, opinión uncensored.ai, precio uncensored.ai, uncensored.ai Pro, UncensoredLM, UncensoredAI v1.2, uncensored.ai API, uncensored.ai gratis, chat IA sin censura, {{appName}} vs uncensored.ai",
      },
      hero: {
        title: "{{appName}} vs uncensored.ai",
        subtitle:
          "Un modelo con visión del mundo propia, dos formas de usarlo. Límites gratis, precio, API y todo lo que viene con él.",
        readTime: "6 min de lectura",
      },
      intro: {
        lead: "uncensored.ai hace el modelo sin censura más distinto que conocemos: {{ownModel}}, entrenado con libros y documentos prohibidos en el internet convencional, con opiniones políticas que van contra la corriente dominante. Lo usamos a través de la propia API de uncensored.ai. Así que esta página responde una sola pregunta: ¿te conviene usarlo en uncensored.ai o aquí?",
        p2: "Datos de uncensored.ai tomados de sus páginas de precios, API y acerca de, comprobados el {{date}}. Su política de privacidad y sus términos no cargaron ese día. Los nuestros se leen en directo de nuestra configuración.",
      },
      relation:
        "Somos clientes de uncensored.ai: {{uncensoredAiExamples}} funciona en {{appName}} a través de la API de uncensored.ai. El mismo modelo, nuestro chat, nuestra facturación.",
      verdict:
        "Elige uncensored.ai si quieres chats ilimitados con este único modelo por un precio fijo de Pro bloqueado de por vida, además de su foro y su modo de voz. Elige {{appName}} si quieres {{ownModel}} junto a otros {{modelCount}} modelos, para que un mismo hilo contraste su postura con Claude, GPT o un modelo abliterado, con imágenes, vídeo y música en el mismo saldo.",
      themPros: {
        a: "Precio fijo: Pro cuesta $9.99 al mes o $99.99 al año, bloqueado de por vida mientras sigas suscrito.",
        b: "Chats ilimitados con el modelo por ese precio, más modo de voz, carpetas y archivos.",
        c: "Sus páginas dicen que tus datos nunca se venden, alquilan ni intercambian, y que el modelo recibe solo tu texto.",
      },
      themCons: {
        a: "El plan gratis tiene un límite diario, 3 respuestas por defecto.",
        b: "Un solo modelo, 32.768 tokens de contexto, sin generación de imagen, vídeo ni música.",
        c: "Cada llamada a la API cuesta $0.05 y se compra aparte de Pro.",
      },
      usPros: {
        a: "{{ownModel}} y otros {{modelCount}} modelos en un solo chat: compara su respuesta con modelos convencionales y abliterados en el mismo hilo.",
        b: "{{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta.",
        c: "Imágenes, vídeo, música y voz en el mismo saldo, y toda la plataforma es de código abierto.",
      },
      usCons: {
        a: "Créditos por uso, no un plan fijo ilimitado: usar a diario este único modelo sale más caro aquí.",
        b: "Sin foro comunitario ni archivos alrededor del modelo.",
        c: "Nuestro margen del {{markup}} % también se aplica al modelo de uncensored.ai.",
      },
      chooseThem: {
        a: "Este único modelo es todo lo que necesitas y lo usas a diario.",
        b: "Quieres un precio bloqueado de por vida.",
        c: "Quieres su foro y su modo de voz.",
      },
      chooseUs: {
        a: "Quieres comparar su postura con modelos convencionales y abliterados.",
        b: "Lo usas de vez en cuando y no quieres otra suscripción.",
        c: "También necesitas imágenes, vídeo o música.",
      },
      both: "Mucha gente usa los dos: uncensored.ai para chatear a diario sin límites con el modelo, y {{appName}} cuando quiere poner su respuesta al lado de la de otro modelo en el mismo hilo.",
      switch: {
        title: "Cambiar desde uncensored.ai",
        body: "Elige {{ownModel}} en nuestro selector de modelos e inicia un chat en modo incógnito. No hace falta migrar nada. Si necesitas contexto anterior, pégalo en el primer mensaje. Luego haz la misma pregunta a un modelo abliterado y mira dónde se separan.",
      },
      faq: {
        q1: {
          q: "¿{{appName}} es lo mismo que uncensored.ai?",
          a: "No. Somos una plataforma independiente y de código abierto. Usamos el modelo de uncensored.ai a través de su API, junto a modelos de Venice, NanoGPT, FreedomGPT, Gab AI, OpenRouter y los grandes laboratorios.",
        },
        q2: {
          q: "¿uncensored.ai es gratis?",
          a: "Tiene un plan gratis con un límite diario, 3 respuestas por defecto. Pro cuesta 9,99 USD al mes o 99,99 USD al año y quita el límite. En {{appName}}, {{guestCredits}} créditos gratis al mes funcionan sin cuenta.",
        },
        q3: {
          q: "¿Qué hace distinto al modelo de uncensored.ai?",
          a: "La mayoría de los modelos sin censura son modelos convencionales a los que se les han quitado los rechazos: el mismo entrenamiento, la misma visión del mundo. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, así que sus opiniones políticas van contra la corriente dominante.",
        },
        q4: {
          q: "¿uncensored.ai tiene API?",
          a: "Sí: una API en su propio endpoint con cuerpo de solicitud al estilo OpenAI, 0,05 USD por solicitud, con créditos que se compran aparte desde 5 USD. En {{appName}} el mismo modelo se llama a través de nuestra API compatible con OpenAI y Anthropic tras cualquier plan o compra de créditos.",
        },
      },
      cta: { title: "Pon sus respuestas junto a las de cualquier otro modelo" },
    },
    openRouter: {
      meta: {
        title:
          "Alternativa a OpenRouter para chatear: {{appName}} vs OpenRouter",
        description:
          "{{appName}} vs OpenRouter: una app de chat lista frente a un router de API para desarrolladores. Modelos sin censura, comisiones, privacidad, API y fuentes.",
        keywords:
          "alternativa a OpenRouter, OpenRouter alternative, OpenRouter vs, opinión OpenRouter, precio OpenRouter, comisiones OpenRouter, OpenRouter sin censura, OpenRouter uncensored, modelos sin censura OpenRouter, app de chat OpenRouter, modelos gratis OpenRouter, API compatible con OpenAI, API LLM sin censura, {{appName}} vs OpenRouter",
      },
      hero: {
        title: "{{appName}} vs OpenRouter",
        subtitle:
          "Un router para desarrolladores con 477 modelos frente a una app de chat con modelos sin censura integrados. Comisiones, filtros, privacidad y API.",
        readTime: "6 min de lectura",
      },
      intro: {
        lead: "OpenRouter es la respuesta por defecto cuando quieres una sola clave de API para cientos de modelos. Nosotros mismos lo usamos. Pero es un router para desarrolladores, no una app de chat, y su oferta sin censura es escasa. Si buscabas una alternativa a OpenRouter para chatear, esta es la comparación honesta.",
        p2: "Datos de OpenRouter tomados de su FAQ, su guía de registro de proveedores, sus términos, la documentación de su API y su lista pública de modelos, comprobados el {{date}}. Los nuestros se leen en directo de nuestra configuración.",
      },
      relation:
        "Somos clientes de OpenRouter: {{openRouterModels}} de nuestros modelos funcionan a través de la API de OpenRouter, entre ellos {{openRouterExamples}}. Nosotros añadimos el chat, la multimedia y los proveedores sin censura que OpenRouter no ofrece.",
      verdict:
        "Elige OpenRouter si eres desarrollador y quieres una sola clave para 477 modelos a precios del proveedor, con fallback, claves propias y enrutamiento de retención cero de datos, y traes tu propia interfaz. Elige {{appName}} si quieres un chat terminado con {{uncensored}} modelos sin censura, entre ellos {{ownModel}} y versiones abliteradas que OpenRouter no lista, además de imágenes, video y música, y una API cuando la necesites.",
      themPros: {
        a: "477 modelos en su lista pública, sin margen sobre la inferencia.",
        b: "Sin suscripción. Modelos gratis con 50 solicitudes al día, 1.000 después de comprar $10 en créditos.",
        c: "Sin registro de prompts por defecto, enrutamiento de retención cero de datos y claves propias gratis hasta 25.000 USD al mes.",
      },
      themCons: {
        a: "Una comisión del 5,5 % al comprar créditos con tarjeta, 5 % con cripto.",
        b: "Pocos modelos sin censura: 17 tunes de rol o sin censura como Venice Uncensored, Hermes 4 y Magnum, y ninguna versión abliterada.",
        c: "No está pensado como chat para el público: tú pones la interfaz.",
      },
      usPros: {
        a: "Un chat listo en el navegador: sin clave, sin configuración, {{guestCredits}} créditos gratis al mes sin cuenta.",
        b: "{{uncensored}} modelos sin censura de Venice, NanoGPT, uncensored.ai, FreedomGPT y Gab AI, desbloqueados con una única confirmación de mayoría de edad (18+).",
        c: "API compatible con OpenAI y Anthropic para chat, imágenes, vídeo y voz en el mismo saldo.",
      },
      usCons: {
        a: "Catálogo más pequeño: {{modelCount}} modelos de chat frente a los 477 de OpenRouter.",
        b: "Nuestro margen del {{markup}}% sobre los costes de los proveedores supera la comisión del 5,5 % de OpenRouter, y no tenemos claves propias ni enrutamiento de retención cero de datos.",
        c: "Hecho ante todo como chat: menos controles de enrutamiento que un router dedicado.",
      },
      chooseThem: {
        a: "Estás creando una app y quieres una sola clave para cientos de modelos.",
        b: "Necesitas respaldo entre proveedores y controles de enrutamiento.",
        c: "Cada céntimo por token cuenta y ya tienes tu propia interfaz.",
      },
      chooseUs: {
        a: "Quieres chatear, no programar: abres la página y escribes.",
        b: "Quieres modelos sin censura que OpenRouter no tiene, como {{ownModel}}.",
        c: "Quieres chat, imágenes, vídeo y música en un solo saldo, con una API encima.",
      },
      both: "Usar los dos es lo normal: OpenRouter en tu código y {{appName}} como el chat donde pruebas modelos sin censura lado a lado antes de integrar uno.",
      switch: {
        title: "Cambiar desde OpenRouter",
        body: "Si usabas una app de chat: inicia un chat en modo incógnito y elige un modelo, sin clave. Si es código: nuestra API es compatible con OpenAI, así que cambias la URL base y la clave, y compruebas el ID del modelo en su página.",
      },
      faq: {
        q1: {
          q: "¿Hay una alternativa a OpenRouter con modelos sin censura?",
          a: "Sí. {{appName}} tiene {{uncensored}} modelos sin censura de Venice, NanoGPT, uncensored.ai, FreedomGPT y Gab AI en un solo chat y una sola API. Entre las opciones solo de API para pesos abliterados están OpenUncensored, Refuseless y NEAR AI Cloud. El propio OpenRouter no lista modelos abliterados.",
        },
        q2: {
          q: "¿OpenRouter permite contenido NSFW?",
          a: "Sus términos exigen ser mayor de 18 y revisa las entradas en busca de CSAM conocido. No hay una regla aparte sobre contenido sexual: se aplican los términos de cada modelo, así que que una solicitud pase depende del modelo y del proveedor.",
        },
        q3: {
          q: "¿Cuánto cobra OpenRouter?",
          a: "Sin margen sobre la inferencia: precios de los proveedores por token, más una comisión del 5,5 % al comprar créditos con tarjeta, 5 % con cripto. No hay suscripción. Los modelos gratis permiten 50 solicitudes al día, 1.000 una vez que compras 10 USD en créditos.",
        },
        q4: {
          q: "¿Puedo usar mi código de OpenRouter con {{appName}}?",
          a: "Sí, si usa el formato de OpenAI: apúntalo a nuestra URL base con tu clave de {{appName}} y usa nuestros IDs de modelo. La API se activa con cualquier plan (desde {{apiSubPrice}} al mes) o una compra de créditos.",
        },
      },
      cta: { title: "Chatea con los modelos que OpenRouter no tiene" },
    },
  },
};
