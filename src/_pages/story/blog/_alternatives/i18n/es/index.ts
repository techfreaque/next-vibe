import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Comparativa de plataformas",
  verify:
    "Verificamos las demás opciones el {{date}} en las fuentes oficiales enlazadas. En el móvil, desplaza la tabla hacia los lados para ver todas las columnas. Los límites dependen del plan y del país.",
  related: "Más guías de alternativas",
  kind: {
    chat: "Chat con menos rechazos",
    assistant: "Asistente generalista",
    writing: "Escritura creativa",
    privateChat: "Chat centrado en la privacidad",
    frontend: "Interfaz para modelos",
    local: "Entorno para modelos locales",
    multiChat: "Chat con varios modelos",
    research: "Asistente de investigación",
    roleplay: "Juego de rol con personajes",
    companion: "Compañero de IA",
    gateway: "Pasarela de API",
    inference: "Inferencia alojada",
  },
  free: {
    yes: "Acceso gratuito limitado",
    software: "Software gratuito",
    trial: "Prueba o créditos iniciales",
    unlisted: "Consulta al proveedor",
    public: "Acceso gratuito",
  },
  paid: {
    plan: "Suscripción",
    usage: "Por consumo",
    both: "Suscripción o consumo, según el producto",
    hosted: "Plan en la nube opcional",
    none: "Coste del equipo",
    contact: "Planes comerciales",
    license: "Licencia y consumo de modelos",
    unlisted: "Consulta al proveedor",
    fixedAccess: "Acceso prepago por 30 días",
    byoApi: "App gratis, pagas al proveedor del modelo",
  },
  filter: {
    permissive: "El servicio anuncia menos rechazos",
    policy: "Se aplican las normas del proveedor",
    adultPolicy: "Opciones para adultos sujetas a las normas de la plataforma",
    selected: "Menos rechazos en algunos modelos",
    varies: "Depende del modelo y del proveedor",
    guardrails: "Controles configurables y normas del proveedor",
  },
  privacy: {
    noFilter: "Afirma borrar los chats, registra IP y uso",
    trainingControl: "Servicio en la nube, revisa los ajustes de entrenamiento",
    hosted: "Servicio en la nube sujeto a las condiciones del proveedor",
    deviceHistory:
      "Historial en el dispositivo, solicitudes enviadas a los modelos remotos",
    enclave: "Procesamiento en un enclave de hardware",
    encryptedHistory: "Historial guardado y cifrado",
    proxy: "Proxy para las solicitudes en la nube",
    noTraining: "El proveedor afirma que excluye los chats del entrenamiento",
    configurable: "Depende del despliegue y los registros",
    localOption: "En el dispositivo con un modelo local",
    upstream: "Depende del proveedor del modelo",
    noLogs: "El proveedor afirma que no guarda registros de prompts",
  },
  api: {
    separate: "API como producto aparte",
    unlisted: "Sin API pública anunciada",
    available: "Disponible",
    local: "API local",
    backend: "Se conecta a un backend",
    openAi: "Compatible con OpenAI",
    dual: "Compatible con OpenAI y Anthropic",
    eligible: "Planes de pago elegibles",
  },
  media: {
    text: "Texto",
    image: "Imágenes",
    voice: "Voz",
    imageVoice: "Imágenes y voz",
    imageVideo: "Imágenes y video",
    all: "Imágenes, video y voz",
    varies: "Depende del modelo o del plan",
  },
  open: {
    closed: "Servicio propietario",
    weights: "Algunos pesos de modelos están disponibles",
    client: "Código del cliente disponible",
    open: "Código abierto, alojamiento propio",
    core: "Componente abierto disponible",
    license: "Código disponible sujeto a licencia",
  },
  fees: {
    topUp: "{{fee}} en compras de créditos",
    markup: "{{fee}} sobre el consumo de modelos",
    noMarkup: "Precio por token del proveedor",
  },
  summaries: {
    noFilter:
      "Chat propio al estilo GPT con tono ajustable. El plan gratuito limita los mensajes al día.",
    chatGpt:
      "Búsqueda, archivos y voz en una sola app. Los límites dependen del plan.",
    grok: "Busca en publicaciones de X y en la web. Los límites más altos y algunas funciones requieren un plan de pago.",
    unrestricted:
      "Chat sencillo en el navegador con un modelo Dolphin-Mistral identificado. La aplicación web usa un único modelo de texto.",
    uncensoredCom:
      "Chat, personajes y contenido multimedia en un mismo servicio. Las cuotas dependen del plan.",
    hemmingway:
      "Ficción para adultos y juego de rol con un modelo de pesos abiertos. La oferta Unlocked se centra en el texto.",
    maple:
      "La aplicación verifica el enclave donde se procesan los datos. El modelo sin censura requiere un plan de pago.",
    confer:
      "El cliente verifica la certificación del enclave antes de enviar los datos. Una opción para chats de texto privados.",
    lumo: "Proton ofrece chat para invitados e historial cifrado al que el proveedor no puede acceder. Los modelos se ejecutan en sus servidores.",
    duck: "Puedes probar varios modelos sin cuenta. DuckDuckGo envía las solicitudes a los proveedores a través de un proxy.",
    morse:
      "Ofrece inferencia privada y una opción de texto sin censura. Consulta los modelos de tu plan.",
    harbor:
      "Chat privado y búsqueda web con Harbor-1. El servicio procesa las solicitudes en la nube.",
    leo: "Haz preguntas sobre la página abierta en Brave. Los modelos integrados y personalizados procesan los datos de forma distinta.",
    openWebUi:
      "Interfaz web de alojamiento propio para Ollama y API compatibles. El motor del modelo se configura aparte.",
    jan: "Chat de escritorio con modelos descargables y API local. Los modelos disponibles dependen de tu equipo.",
    anythingLlm:
      "Haz preguntas sobre los documentos de un espacio de trabajo. Elige generación y embeddings locales para procesar todo en tu equipo.",
    gpt4all:
      "Chat de escritorio con búsqueda en documentos locales. El tamaño del modelo depende de la memoria disponible.",
    llamaCpp:
      "Ejecuta modelos GGUF con control detallado y un servidor local compatible. La configuración requiere conocimientos técnicos.",
    typingMind:
      "Espacio de chat con almacenamiento local y tus propias claves. El uso de los modelos se factura por separado.",
    poe: "Varios modelos y bots de la comunidad en una sola app. El uso consume puntos de cómputo.",
    claude:
      "Proyectos, artefactos y búsqueda web para escribir y programar. Se aplican límites y políticas de uso.",
    gemini:
      "Deep Research y conexiones con aplicaciones de Google. Las cuotas de modelos y contenido multimedia dependen del plan.",
    perplexity:
      "Respuestas de la web con fuentes consultables. La investigación avanzada y la selección de modelos requieren un plan de pago.",
    copilot:
      "Encaja en flujos de trabajo de Microsoft 365. La integración con Office depende del plan.",
    meta: "Disponible en las aplicaciones compatibles de Meta. Las funciones varían según la aplicación y el país.",
    mistral:
      "El asistente de Mistral combina chat y funciones de programación. La aplicación en la nube aplica las normas de Mistral.",
    deepseek:
      "Chat de DeepSeek alojado, API propia y pesos descargables para algunos modelos. Revisa las normas de la versión que uses.",
    qwen: "Alibaba ofrece un chat Qwen alojado y publica pesos de modelos. El alojamiento y el filtrado dependen de la versión que uses.",
    kimi: "El asistente de Moonshot ofrece modelos Kimi y funciones para programar. El uso en la nube depende del plan.",
    spicychat:
      "Puedes elegir personajes de la comunidad con el acceso gratuito. Los planes de pago amplían la capacidad y las funciones.",
    chub: "Enorme biblioteca de fichas de personajes y libros de ambientación. Sus propios modelos exigen el plan Mars; la vía gratis es una cuota diaria pequeña o tu propio motor.",
    dreamgen:
      "Dirige escenas y juega con varios personajes. Los límites dependen del plan y del modelo.",
    novelai:
      "Narrativa larga con fichas de ambientación y generación de imágenes de estilo anime. El acceso completo requiere suscripción.",
    chai: "Descubre bots de la comunidad desde el móvil. Las interacciones siguen las normas de la aplicación.",
    replika:
      "Un compañero que te acompaña en el tiempo, con voz y avatar. Las funciones dependen de la suscripción.",
    polybuzz:
      "Crea y descubre personajes en el móvil. La app ofrece compras opcionales y aplica sus propias normas.",
    fictionlab:
      "Ficción interactiva con escenarios de la comunidad. El foco está en la narrativa de texto.",
    zeta: "Crea personajes y juega escenarios de la comunidad. La disponibilidad varía según el país.",
    characterTavern:
      "Descubre y crea fichas de personajes. El plan gratuito permite empezar a conversar.",
    liteLlm:
      "Aloja un proxy compatible con claves virtuales, presupuestos y límites de frecuencia. Tú operas el servicio y gestionas el acceso a los proveedores.",
    portkey:
      "Configura rutas de respaldo, controles y monitorización. Los registros y el despliegue dependen de tu configuración.",
    vercel:
      "Se integra con el AI SDK de Vercel sin recargo por token. Vercel aloja el servicio de enrutamiento.",
    cloudflare:
      "Caché en el borde de la red, límites de frecuencia y enrutamiento. Revisa el coste de la facturación unificada y los ajustes de registro.",
    requesty:
      "Pasarela alojada con enrutamiento por latencia y opciones en la UE. Consulta la disponibilidad por modelo y configuración.",
    helicone:
      "Pasarela de IA con trazas de solicitudes y seguimiento del gasto. Revisa qué se registra antes de enviar datos sensibles.",
    eden: "Una API para modelos de lenguaje, OCR o traducción. Las funciones dependen del proveedor elegido.",
    together:
      "Inferencia sin servidor y puntos de acceso dedicados para modelos abiertos. Comprueba que aloje el modelo que necesitas.",
    bifrost:
      "Aloja una pasarela en Go con conmutación por error y caché semántica. Tú configuras el despliegue y el acceso a proveedores.",
    truefoundry:
      "Políticas de acceso centralizadas y monitorización para equipos. Revisa las opciones de despliegue y las condiciones comerciales.",
    llmGateway:
      "Compatible con OpenAI y Anthropic, con opción de alojamiento propio. La facturación y retención dependen del despliegue.",
    deepInfra:
      "Inferencia alojada para modelos abiertos y despliegues de GPU privados. Elige del catálogo o configura la infraestructura.",
    bedrock:
      "Catálogo gestionado con controles de acceso de AWS. Los modelos y funciones dependen de la región.",
    kong: "Añade enrutamiento de modelos y políticas a una pasarela de API. Consulta qué complementos incluye tu edición.",
    huggingFace:
      "Usa modelos del Hub con varios proveedores de inferencia. La disponibilidad de modelos y equipos depende del proveedor.",
    apiko:
      "Un punto de acceso compatible para texto, imagen, video y audio. Consulta el precio y la disponibilidad del modelo que necesitas.",
    zerouter:
      "Una clave para clientes de programación como Claude Code y Codex. Revisa los precios y el enrutamiento antes de migrar.",
    shannon:
      "Ofrece su propio modelo Shannon y varios modelos modificados de pesos abiertos. La API se cobra por consumo.",
    nokeep:
      "Chat y contenido multimedia sin registro. El historial queda en el navegador y los modelos alojados procesan las solicitudes.",
    icelake:
      "Cuota diaria de chat y herramientas de imagen y video. La API compatible con OpenAI requiere un plan de pago elegible.",
    uncensoredChat:
      "Chat en el navegador con 2000 tokens de inicio. El acceso a contenido multimedia y a la API depende del plan.",
    aiDungeon:
      "Aventuras interactivas con fichas de historia. Las suscripciones ofrecen más contexto y recuerdos.",
    talkie:
      "Descubre y crea personajes en un catálogo comunitario. Consulta las normas de contenido de la aplicación.",
    perchance:
      "Chat gratuito con personajes en el navegador, sin registro. Una opción sencilla para sesiones puntuales.",
    candy:
      "Compañeros para conversaciones románticas, con voz e imágenes. La aplicación gira en torno a la compañía virtual.",
    ngrok:
      "Enruta llamadas entre proveedores con claves de respaldo. Revisa el enrutamiento y los registros al configurarlo.",
    sandbase:
      "Combina llamadas a modelos, datos web y entornos aislados de código en una API. Las llamadas gratuitas tienen un límite diario.",
    risuAi:
      "Cliente de chat con personajes de código abierto, con libros de ambientación, chats de grupo, imágenes de emociones y TTS. La API del modelo la aportas y la pagas tú.",
    agnai:
      "Cliente de rol alojado o autoalojado, con chats de grupo multiusuario y libros de ambientación. Los precios del plan alojado no son públicos.",
    koboldCpp:
      "Ejecutor local de un solo archivo para modelos GGUF, con interfaz de chat integrada y API compatible con OpenAI. Sin GPU propia, esperas turno en la AI Horde de voluntarios.",
    talemate:
      "Motor de rol multiagente con narrador, director y seguimiento del estado del mundo. Una herramienta de instalación propia para usuarios avanzados.",
    featherless:
      "Acceso mensual de tarifa plana a miles de modelos abiertos, finetunes sin censura incluidos, con una sola clave API. El plan Chat limita el contexto y las solicitudes en paralelo.",
    arliAi:
      "Planes con tokens ilimitados para modelos abiertos y sin restricciones, más imágenes. Los planes más baratos permiten una solicitud a la vez.",
    infermatic:
      "Planes mensuales para un pequeño grupo de modelos de texto sin censura, con la promesa de no guardar registros. El plan gratis tiene un modelo y no incluye API.",
    chutes:
      "Inferencia descentralizada de pago por token para texto, imágenes, video y audio. Sin plan gratis.",
    kagi: "Asistente multimodelo incluido con la búsqueda de Kagi. Los hilos se borran a las 24 horas por defecto, y los modelos punteros exigen el plan más alto.",
    huggingChat:
      "Chat con modelos abiertos a través de un enrutador automático. El código del chat es abierto, y la inferencia se cobra con créditos de Hugging Face.",
    zai: "El chat propio de Zhipu para los modelos GLM, con una API aparte. Su política de privacidad incluye el contenido de los mensajes para entrenar modelos.",
    ourDream:
      "Creador de compañeros para adultos con chat, imágenes y video. Los medios funcionan con monedas que solo puedes comprar con un plan activo.",
  },
  articles: {
    "nofiltergpt-alternatives": {
      question:
        "¿Qué alternativas a NoFilterGPT identifican el modelo o funcionan sin internet?",
      answer:
        "Unrestricted.chat identifica su modelo Dolphin-Mistral, pero lo ejecuta en sus servidores. LM Studio, Ollama y Jan ejecutan modelos descargados en tu equipo. {{appName}} te deja elegir el modelo y guarda las conversaciones de incógnito en el navegador. Los modelos alojados siguen recibiendo la solicitud.",
    },
    "freedomgpt-alternatives": {
      question:
        "¿Qué puede sustituir a la aplicación de escritorio de FreedomGPT sin conexión?",
      answer:
        "LM Studio y Jan ofrecen aplicaciones para modelos descargados. Ollama tiene una API local y se combina con Open WebUI para usar el navegador. AnythingLLM sirve para trabajar con documentos si configuras modelos y embeddings locales.",
    },
    "gab-ai-alternatives": {
      question: "¿Qué puede sustituir a Arya para preguntas políticas?",
      answer:
        "Para contrastar puntos de vista, pregunta a distintos modelos en el mismo hilo de {{appName}}. Para investigar con fuentes, prueba Perplexity o usa la búsqueda de Grok para localizar los materiales originales. Comprueba las fuentes. Cualquier modelo puede reflejar una postura o equivocarse.",
    },
    "openrouter-alternatives": {
      question:
        "¿Qué alternativa a OpenRouter encaja en una aplicación en producción?",
      answer:
        "Vercel ofrece acceso alojado sin recargo por token. Con LiteLLM o Bifrost operas tu propia pasarela con tus cuentas de proveedores. Para monitorización o control de políticas, compara Portkey, Cloudflare y Helicone. Revisa las rutas de respaldo, la retención de datos y las comisiones.",
    },
    "venice-ai-alternatives": {
      question:
        "¿Qué opciones de privacidad van más allá del historial en el navegador?",
      answer:
        "Maple, Confer y Morse describen el procesamiento verificable en enclaves de hardware. Lumo cifra el historial guardado y Duck.ai usa un proxy. LM Studio y Ollama pueden ejecutar modelos descargados en tu equipo. Comprueba dónde se descifra la solicitud y si necesitas contenido multimedia o una API.",
    },
    "character-ai-alternatives": {
      question:
        "¿Qué aplicaciones convienen para descubrir personajes, escribir historias largas o tener un compañero constante?",
      answer:
        "Janitor AI, SpicyChat y Chub tienen bibliotecas de personajes. DreamGen y NovelAI dan más control sobre las escenas o las historias largas. Kindroid y Nomi se centran en un compañero con continuidad. Con SillyTavern puedes configurar tu propio motor y tus fichas de personaje.",
    },
    "chatgpt-alternative-without-filters": {
      question: "¿Qué alternativas a ChatGPT ofrecen más modelos para elegir?",
      answer:
        "{{appName}} y Venice permiten elegir entre modelos que rechazan distintos tipos de solicitudes. NanoGPT ofrece pago por consumo. LM Studio y Ollama ejecutan modelos descargados en tu equipo. Claude y Gemini sirven para escribir o investigar y aplican sus propias políticas.",
    },
    "chatgpt-jailbreak-alternative": {
      question: "¿Qué conviene revisar antes de cambiar de modelo?",
      answer:
        "Comprueba si el servicio identifica el modelo, cómo funciona la cuota gratuita y dónde procesa las solicitudes. Prueba tus consultas habituales de escritura o juego de rol en {{appName}}, Venice o una aplicación local. Las respuestas y los rechazos dependen del modelo y del servicio.",
    },
    "grok-alternative": {
      question:
        "¿Qué alternativas sustituyen la búsqueda y las funciones creativas de Grok?",
      answer:
        "Perplexity ofrece respuestas con fuentes de la web. Gemini incluye Deep Research y video según el plan. Venice y {{appName}} combinan selección de modelos y generación multimedia. Quédate con Grok si buscar publicaciones de X en el mismo chat es esencial para tu trabajo.",
    },
    "chub-ai-alternatives": {
      question: "¿Puedo llevarme mis fichas de personaje de Chub a otro sitio?",
      answer:
        "Sí. Las fichas de Chub se descargan en PNG o JSON con el formato de ficha V2, y SillyTavern, RisuAI y Agnaistic las importan directamente. {{appName}} convierte un personaje en una habilidad con la que puedes chatear en cualquier modelo. Los libros de ambientación pasan a SillyTavern y RisuAI.",
    },
    "crushon-ai-alternatives": {
      question: "¿Qué alternativa a CrushOn tiene el coste más previsible?",
      answer:
        "Tarifa plana: Kindroid, Nomi y SpicyChat cobran un único precio mensual. Pago por uso: {{appName}} y NanoGPT cobran por mensaje, así que un mes tranquilo sale más barato. Ejecutar un modelo en tu propio PC con SillyTavern y KoboldCpp no cuesta nada una vez tienes el hardware.",
    },
    "sillytavern-alternatives": {
      question: "¿Hay una alternativa a SillyTavern que no haya que instalar?",
      answer:
        "Sí. Janitor AI, Chub y Character Tavern funcionan en el navegador con personajes incluidos. RisuAI también tiene versión web. {{appName}} funciona en cualquier navegador, iPhone incluido, con los modelos ya conectados, así que no hay clave API que configurar.",
    },
    "nanogpt-alternatives": {
      question:
        "¿Qué alternativa a NanoGPT encaja con modelos abiertos en tarifa plana?",
      answer:
        "Featherless, Arli AI e Infermatic venden planes mensuales para modelos abiertos y sin censura, con límites de contexto o de solicitudes en paralelo. OpenRouter y Chutes cobran por token. {{appName}} cobra por mensaje desde un solo saldo con modelos sin censura, abiertos y convencionales.",
    },
    "claude-alternatives": {
      question: "¿Qué alternativa a Claude escribe mejor textos largos?",
      answer:
        "GPT y Gemini son los que más se acercan en escritura estructurada. Kimi y GLM son modelos abiertos potentes con menos rechazos. Para la ficción que Claude rechaza, usa un modelo sin censura como GLM 5.3 Uncensored o UncensoredLM en {{appName}}, y mantén Claude en el mismo hilo para editar.",
    },
  },
};
