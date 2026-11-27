import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a NanoGPT: IA de pago por uso y sin censura (2026)",
    description:
      "NanoGPT limitó PRO, subió el precio y reveló fugas de datos en proveedores. Compara {{appName}}, OpenRouter, Venice, Featherless, Arli AI, Infermatic.",
    category: "Comparativa",
    imageAlt: "Alternativas a NanoGPT con pago por uso y modelos sin censura",
    keywords:
      "alternativas a NanoGPT, alternativa a NanoGPT, alternativa a nano-gpt, webs como NanoGPT, NanoGPT vs OpenRouter, IA de pago por uso, API de IA sin censura, API de modelos abliterated, alternativa a Featherless, NanoGPT PRO, NanoGPT alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Comparativa",
    readTime: "9 min de lectura",
    title: "Alternativas a NanoGPT con pago por uso y modelos sin censura",
    subtitle:
      "{{count}} alternativas y {{appName}}, comparadas según sus páginas de precios, privacidad y modelos, comprobadas el {{date}}.",
  },
  intro: {
    lead: "NanoGPT hace una cosa muy bien: todos los modelos, pago por uso, desde diez céntimos. En 2026 también limitó su plan PRO, subió el precio, pausó los registros una vez y reveló que varios proveedores intermedios expusieron prompts.",
    p2: "Con total transparencia: compramos a NanoGPT. {{appName}} enruta hoy {{nanoGptModels}} modelos a través de NanoGPT, {{nanoGptUncensored}} de ellos sin censura. Aquí van las alternativas, comprobadas el {{date}}, y dónde sigue ganando NanoGPT.",
  },
  subject: {
    title: "NanoGPT hoy",
    intro: "Según sus páginas de precios, condiciones, privacidad y su blog.",
    plans:
      "Precio: pago por uso desde 0,10 USD en cripto o 1 USD con tarjeta. PRO: {{plans}}, con 60 millones de tokens de entrada a la semana en una selección de modelos abiertos y 100 imágenes al día. Claude, GPT, Gemini y Grok se cobran de tu saldo.",
    filter:
      "Filtro: 18+, sin prohibición general del contenido adulto. Las condiciones prohíben el contenido sexual con menores y los deepfakes de personas reales.",
    privacy:
      "Privacidad: historial en tu navegador por defecto, sincronización cifrada opcional. NanoGPT dice que no registra prompts en el uso normal, pero algunas rutas permiten entrenamiento.",
    extra:
      "Comisiones: la mayoría de los modelos a precio de lista. Elegir proveedor, Private Mode o tu propia clave añade alrededor de un 5 %.",
  },
  why: {
    title: "Por qué la gente busca otra opción",
    intro: "Cuatro motivos, cada uno de una fuente pública.",
    exposure:
      "Exposiciones en proveedores. En noviembre de 2026 NanoGPT reveló que prompts y respuestas quedaron expuestos en varios proveedores intermedios durante semanas o meses, y eliminó esas rutas.",
    caps: "Límites. En febrero de 2026 PRO pasó de entrada ilimitada a 60 millones de tokens de entrada a la semana, más límites de ráfaga.",
    paused:
      "Registros pausados. En marzo de 2026 se pararon las altas nuevas de PRO por abusos e inestabilidad.",
    reliability:
      "Fiabilidad. Las reseñas se quejan de llamadas a herramientas fallidas que se cobran igual.",
  },
  criteria: {
    title: "Qué comparar antes de cambiar",
    intro: "Lo deciden cinco preguntas.",
    one: "Cobro: por token, por mensaje, tarifa plana, y la recarga mínima.",
    two: "Modelos: ¿cuántos sin censura y abliterated, y están también Claude, GPT y Gemini?",
    three:
      "Privacidad: quién registra los prompts, qué rutas permiten entrenamiento, qué se queda en tu dispositivo.",
    four: "API: formato OpenAI o Anthropic, y qué plan la desbloquea.",
    five: "Medios: imágenes, video, voz y música con el mismo saldo.",
  },
  table: {
    title: "Todas, lado a lado",
  },
  us: {
    title: "{{appName}}: todo tipo de modelos, un solo saldo",
    intro:
      "{{modelCount}} modelos en un chat. El nivel de filtro lo eliges en cada mensaje.",
    models:
      "Modelos: {{uncensored}} sin censura junto a {{mainstream}} convencionales y {{open}} abiertos. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, con el resultado de un modelo con opiniones políticas contrarias.",
    fit: "NanoGPT dentro: {{nanoGptModels}} de nuestros modelos funcionan a través de NanoGPT, entre ellos {{nanoGptExamples}}. Además, {{imageModels}} modelos de imagen, {{videoModels}} de video y {{musicModels}} de música con el mismo saldo.",
    privacy:
      "Privacidad: los chats de incógnito se quedan en el almacenamiento local de tu navegador, sin cuenta.",
    price:
      "Precio: {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con cuenta, {{maxCredits}} con el boletín. Planes: {{planList}}. Los paquetes de créditos recargan un plan activo y no caducan nunca.",
    api: "API: endpoints compatibles con OpenAI y Anthropic. Cualquier compra la desbloquea.",
    weak: "Dónde flojeamos: NanoGPT tiene muchos más modelos y cobra la mayoría a precio de lista. Nosotros añadimos un margen del {{markup}} % y pedimos un plan antes de comprar paquetes de créditos.",
    ownLink: "Ver {{ownModel}}",
    directoryLink: "Todos los modelos abliterados, con contexto y precio",
  },
  list: {
    title: "Las alternativas documentadas, una a una",
    intro:
      "Las plataformas con perfil completo en nuestros datos de comparación, comprobadas en sus propias páginas. Los servicios de modelos con tarifa plana y las pasarelas están en la tabla de arriba.",
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
    title: "Cuándo NanoGPT sigue siendo la opción correcta",
    intro: "A veces el original es mejor trato.",
    one: "Quieres el catálogo de modelos más amplio a precio de lista y ninguna suscripción.",
    two: "Pagas importes pequeños en cripto, desde diez céntimos, o quieres pagar la API sin cuenta.",
    three:
      "Vives de modelos abiertos y la cuota de tokens de PRO te cubre el mes.",
    versusLink: "{{appName}} vs NanoGPT: la comparativa completa",
  },
  faq: {
    title: "Preguntas frecuentes",
    best: {
      q: "¿Cuál es la mejor alternativa a NanoGPT?",
      a: "Para desarrolladores con pago por token: OpenRouter. Para privacidad y una app creativa: Venice. Para modelos abiertos y sin censura con tarifa plana: Featherless o Arli AI. Para modelos sin censura, abiertos y convencionales, más medios, en un chat y un solo saldo: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratis a NanoGPT?",
      a: "OpenRouter tiene límites diarios de modelos gratis. LM Studio y Ollama son gratis en tu propio hardware. {{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con cuenta, {{maxCredits}} con el boletín.",
    },
    filter: {
      q: "¿Qué alternativas tienen modelos sin censura?",
      a: "Venice, uncensored.ai, Featherless, Arli AI, Infermatic y {{appName}} ofrecen modelos sin censura o abliterated. OpenRouter tiene pocos. En {{appName}} se desbloquean tras una confirmación 18+ única.",
    },
    privacy: {
      q: "¿Qué alternativa es la más segura para prompts privados?",
      a: "Una herramienta local como LM Studio u Ollama mantiene los prompts en tu equipo. En la nube, revisa qué proveedores intermedios usa un servicio y si guarda registros. Todo modelo alojado ve el prompt al que responde.",
    },
    move: {
      q: "¿Puedo cambiar sin reescribir mi código?",
      a: "Casi siempre. NanoGPT, OpenRouter y {{appName}} hablan el formato de OpenAI, así que cambias la URL base, la clave y el ID del modelo. {{appName}} también habla el formato de Anthropic.",
    },
  },
  cta: {
    title: "Todos los modelos. Un solo saldo.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza en incógnito y elige cualquier modelo.",
    start: "Empieza un chat de incógnito",
    models: "Compara todos los modelos",
  },
};
