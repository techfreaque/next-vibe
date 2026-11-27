import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    back: "Volver al blog",
    category: "Comparativa",
    readTime: "7 min de lectura",
    switching: "Por qué se buscan alternativas",
    criteria: "Qué revisar antes de cambiar",
    privacy:
      "Comprueba dónde se guarda el historial y quién procesa las solicitudes. Un modelo alojado recibe la consulta aunque la interfaz se ejecute en tu equipo.",
    table: "Todas las opciones en una tabla",
    checked:
      "Precios de la competencia verificados el {{date}}. Importes en dólares estadounidenses. El precio final puede variar según el país. Las cifras de {{appName}} salen de nuestra configuración actual. En pantallas pequeñas, desplaza la tabla hacia los lados.",
    alternatives: "Las demás opciones, una por una",
    price: "Precio.",
    pro: "Ventaja.",
    con: "Límite.",
    fit: "Elígelo si",
    faq: "Preguntas frecuentes",
    guides: "Más comparativas",
    modelCatalog: "Ver el catálogo de modelos",
  },
  kinds: {
    aggregator: "Chat alojado con varios modelos",
    client: "Interfaz para tus claves API",
    selfHosted: "Chat de instalación propia",
    gateway: "Pasarela API con chat web",
    creativeChat: "Chat creativo alojado",
    singleProvider: "Chat alojado de un solo proveedor",
  },
  us: {
    title: "{{appName}}. Chat alojado con distintos niveles de filtrado",
    intro:
      "Cambia de modelo en la misma conversación sin configurar claves API. El catálogo reúne {{modelCount}} modelos de chat, entre ellos {{mainstream}} convencionales, {{open}} abiertos y {{uncensored}} sin censura. Para usar los modelos sin censura, confirma que tienes al menos 18 años.",
    price:
      "Tienes {{guestCredits}} créditos gratis al mes sin cuenta o {{freeCredits}} con una cuenta, {{maxCredits}} con el boletín. Los planes empiezan en {{subPrice}} al mes. Cada consulta consume créditos según la tarifa del modelo elegido.",
    privacy:
      "En modo incógnito, el historial se queda en tu navegador. El modelo alojado recibe la consulta que necesita para responder.",
    api: "El acceso a las API compatibles con OpenAI y Anthropic empieza en {{apiSubPrice}} al mes.",
    cta: "Haz la misma pregunta a dos modelos",
    ctaSubtitle:
      "Empieza en incógnito con {{guestCredits}} créditos gratis al mes. Elige un modelo y envía tu primer mensaje.",
    start: "Abrir un chat en incógnito",
    models: "Explorar modelos sin censura",
  },
  platforms: {
    poe: {
      free: "Puntos gratis cada día.",
      paid: "Desde {{poeStart}} al mes",
      filter: "Normas de Poe y de cada bot",
      privacy: "Poe y los proveedores de bots procesan datos del chat",
      api: "Compatible con OpenAI, puntos compartidos con el plan",
      media: "Imágenes, video y audio",
      open: "Propietario",
      models:
        "Poe, el servicio alojado de Quora, reúne GPT, Claude, Gemini y bots de la comunidad. El mismo saldo cubre chat y contenido multimedia, sin claves de proveedores que configurar.",
      price:
        "Los puntos gratis se renuevan cada 24 horas. Los que sobran se pierden. El primer plan de pago anuncia 10.000 puntos al día. Las solicitudes, respuestas o contextos largos pueden costar más, según el bot.",
      pro: "Puedes descubrir bots de la comunidad, invitar gente a un chat grupal y publicar bots. Los creadores que cumplen los requisitos pueden ganar dinero por mensaje. Los suscriptores usan los mismos puntos en el chat y la API.",
      con: "La cantidad de mensajes depende del saldo y de las tarifas del bot. Según la política de Poe, los proveedores y desarrolladores pueden recibir chats y archivos. Rigen tanto las normas de Poe como las del bot.",
      fit: "quieres un directorio de bots, chats grupales y una sola factura para varios proveedores.",
    },
    typingMind: {
      free: "Interfaz básica sin licencia.",
      paid: "{{typingStandard}} en un solo pago más el uso de modelos",
      filter: "Normas del modelo y del proveedor conectado",
      privacy: "Historial en el navegador, sincronización opcional",
      api: "Se conecta a API externas",
      media: "Imágenes y voz según el plan y el modelo",
      open: "Propietario, versión estática con licencia para alojarla",
      models:
        "TypingMind es una interfaz para tus claves API o puntos de acceso compatibles. Se conecta a GPT, Claude, Gemini y otros modelos. Con una licencia puede guardar el historial en el navegador.",
      price:
        "Standard cuesta {{typingStandard}} y Extended, {{typingExtended}}. Premium figuraba en oferta por {{typingPremium}}, con un precio de lista de {{typingList}}. El uso de modelos y el almacenamiento adicional se pagan por separado.",
      pro: "Premium añade carpetas de proyectos y respuestas en paralelo con un contexto por modelo. Puedes ajustar parámetros y usar los proveedores a los que ya pagas.",
      con: "La versión gratis no guarda chats. Tú administras las claves y los pagos. Para alojarla en tu servidor necesitas una licencia y recibes la aplicación compilada.",
      fit: "quieres pagar directamente a los proveedores y usar una interfaz lista con ajustes detallados.",
    },
    libreChat: {
      free: "Software gratis con licencia MIT.",
      paid: "Alojamiento y modelos según el uso",
      filter: "Depende de la instancia y el modelo",
      privacy: "Historial en tu instancia, solicitudes a los modelos alojados",
      api: "API de los proveedores y Agents API en beta",
      media: "Generación de imágenes con herramientas configuradas",
      open: "MIT, instalación propia",
      models:
        "LibreChat se conecta a proveedores como OpenAI, Anthropic y OpenRouter. Instálalo en tu servidor o crea una cuenta para probar la demostración pública.",
      price:
        "El software no tiene costo de licencia. Calcula aparte el precio del servidor y de los modelos de pago. La demostración pública sirve para evaluar la herramienta.",
      pro: "Puedes modificar el código. Hay agentes, MCP, búsqueda en archivos, importación de chats y varios formatos de exportación.",
      con: "Tú te encargas de la instalación, las actualizaciones y las copias de seguridad. Para datos delicados o conversaciones importantes, usa tu propia instancia.",
      fit: "quieres una interfaz adaptable para varios proveedores y puedes mantener el servidor.",
    },
    openWebUi: {
      free: "Instalación propia gratis según la licencia.",
      paid: "Equipo, alojamiento o modelos según el uso",
      filter: "Depende de la instancia y el modelo",
      privacy: "Puede funcionar sin conexión con modelos locales",
      api: "Ollama y puntos de acceso compatibles con OpenAI",
      media: "Imágenes y voz mediante integraciones",
      open: "Código disponible con condiciones de marca",
      models:
        "Open WebUI es una interfaz que puedes instalar en tu equipo o servidor para usar Ollama y API compatibles con OpenAI. Con un modelo local, el chat puede funcionar sin conexión.",
      price:
        "El software es gratuito con la marca del proyecto. Una licencia separada puede cubrir el uso de una marca propia en instalaciones grandes.",
      pro: "Ejecuta los modelos y guarda el historial en tu equipo. Puedes conectar una API en la nube más adelante en la misma interfaz.",
      con: "Los modelos locales requieren un equipo adecuado o un servidor aparte. Si abres el acceso a otras personas, cuenta con el mantenimiento y revisa las condiciones de marca.",
      fit: "quieres usar modelos locales y alojados en una sola interfaz, incluso sin conexión.",
    },
    openRouter: {
      free: "Algunos modelos gratis.",
      paid: "Pago por uso",
      filter: "Normas del modelo y del proveedor",
      privacy: "El tratamiento de datos depende del proveedor elegido",
      api: "API unificada",
      media: "Depende del modelo",
      open: "Alojado, propietario",
      models:
        "OpenRouter Chat es la interfaz web para probar el catálogo de OpenRouter. Envía la misma consulta a varios modelos y compara las respuestas en paralelo.",
      price:
        "Los modelos de pago se cobran por uso. En Standard, la recarga con tarjeta tiene una comisión del {{routerFee}}, con un mínimo de {{routerMinimum}}. Se aplican las tarifas de los proveedores de los modelos.",
      pro: "Puedes comparar respuestas y elegir al proveedor que procesa la solicitud. El mismo saldo sirve para la API.",
      con: "Las solicitudes gratis tienen un límite. El costo cambia según el modelo y el contexto. La retención de datos depende del proveedor elegido.",
      fit: "quieres comparar muchos modelos en el navegador y pagar por uso.",
    },
    venice: {
      free: "10 solicitudes de texto y 15 de imagen al día en modelos básicos.",
      paid: "Pro por {{venicePro}} al mes",
      filter: "Filtro para adultos desactivable desde Pro",
      privacy: "Historial local por defecto, protección según el modo",
      api: "API a cambio de créditos",
      media: "Imágenes, video, voz y música",
      open: "Alojado, propietario",
      models:
        "Venice aloja modelos de texto abiertos y propietarios, además de herramientas para imágenes, video y audio. Su página de privacidad distingue cuatro formas de procesar solicitudes con distintos niveles de protección.",
      price:
        "Pro cuesta {{venicePro}} al mes e incluye solicitudes de texto ilimitadas en los modelos del plan. Algunos modelos avanzados y la generación de contenido multimedia usan créditos.",
      pro: "El historial se queda en el navegador de forma predeterminada. Pro ofrece copias cifradas y permite elegir modelos con protección de hardware en las rutas compatibles.",
      con: "El plan gratis tiene límites diarios. Algunos modelos avanzados reciben consultas a través de proveedores externos. Para desactivar el filtro necesitas al menos Pro.",
      fit: "quieres más control del filtrado y un chat alojado con historial local.",
    },
    nanoGpt: {
      free: "Un modelo gratis en la web.",
      paid: "Pago por uso o Pro por {{nanoPro}} al mes",
      filter: "Rigen las condiciones y los límites del modelo",
      privacy: "Historial en el navegador, sincronización opcional",
      api: "API con saldo prepago o cuota incluida",
      media: "Imágenes, video y voz",
      open: "Alojado, propietario",
      models:
        "NanoGPT ofrece modelos convencionales y abiertos en el navegador y por API. Carga saldo sin suscribirte o elige un plan con una cuota incluida.",
      price:
        "Pro cuesta {{nanoPro}} al mes. Incluye hasta 60 millones de tokens de entrada por semana en ciertos modelos abiertos y 100 imágenes al día en cuatro modelos.",
      pro: "El chat y la API comparten saldo. El historial queda en el navegador por defecto y puedes empezar con un identificador generado.",
      con: "Con Pro, la mayoría de los modelos cerrados, el video y la voz se siguen cobrando del saldo. La cuota incluida vale para modelos específicos.",
      fit: "tu consumo cambia de un mes a otro o quieres una cuota sobre todo para modelos abiertos.",
    },
    chatGpt: {
      free: "Plan ChatGPT Free por separado.",
      paid: "Plus por {{plus}} al mes",
      filter: "Políticas de OpenAI",
      privacy: "Historial en la cuenta y controles de entrenamiento",
      api: "API de OpenAI con cobro separado",
      media: "Imágenes y voz",
      open: "Alojado, propietario",
      models:
        "ChatGPT Plus es la suscripción de OpenAI. Reúne sus modelos, conversaciones por voz, análisis de archivos, generación de imágenes e investigación avanzada donde está disponible.",
      price:
        "OpenAI indica un precio de {{plus}} al mes. Los límites pueden cambiar y la API tiene facturación propia.",
      pro: "Voz, archivos e investigación en una sola aplicación con un precio mensual claro.",
      con: "Se pueden aplicar límites de uso. El chat tiene modelos de un solo proveedor. Plus no cubre el uso general de la API de OpenAI.",
      fit: "usas sobre todo modelos de OpenAI y quieres las herramientas incluidas en ChatGPT.",
    },
  },
  posts: {
    poe: {
      metaTitle: "8 alternativas a Poe comparadas (2026)",
      description:
        "Compara alternativas a Poe con saldo compartido, pago por uso o claves API propias. Precios, límites y qué ofrece {{appName}}.",
      keywords:
        "alternativas a Poe, alternativa a Poe AI, puntos de Poe, Poe o TypingMind, OpenRouter Chat, {{appName}}",
      title: "8 alternativas a Poe para distintos presupuestos",
      subtitle:
        "Usa un chat alojado, paga por lo que consumes o instala tu propia interfaz. Ocho opciones comparadas, incluida {{appName}}.",
      lead: "Poe es práctico si alternas entre varios modelos. Si una conversación larga gasta más puntos de lo esperado, compara cuánto pagarías por ese mismo chat en otro servicio. Una cuota diaria, un saldo prepago y la facturación directa de la API se ajustan a hábitos distintos.",
      overview: "Qué ofrece Poe y cómo cobra",
      tradeoff:
        "Poe destaca por su directorio público de bots, los pagos a creadores y los chats grupales. {{appName}} también cobra el uso en créditos. Compara cuánto cuesta un hilo largo con los modelos que realmente utilizas.",
      switch: {
        firstLink: "Renovaciones y puntos incluidos en Poe",
        secondLink: "Poe frente al pago por uso",
        first:
          "En una conversación de r/PoeAI, varios suscriptores comentaron cambios en los precios de renovación y en los puntos incluidos. Una persona pensaba pasar a OpenRouter con TypingMind. A otra le seguía conviniendo su plan anterior.",
        second:
          "En otro hilo, una persona prefería OpenRouter por la claridad de los costos. Otra consideraba que los puntos diarios de Poe compensaban con un uso constante. Son experiencias individuales. Los precios de esta comparativa proceden de los proveedores.",
      },
      criteria: {
        cost: "Si tu uso se concentra en pocos días, compara la recarga con lo que pagas de suscripción en un mes tranquilo. Si chateas a diario, revisa cuántos turnos reales caben en tu cuota.",
        workflow:
          "Haz una lista de lo que usas además del chat. Los bots públicos y los grupos pueden justificar mantener Poe. Para comparar respuestas, busca resultados en paralelo o cambios de modelo dentro del mismo hilo.",
      },
      faq: {
        best: {
          q: "¿Cuál es la mejor alternativa a Poe?",
          a: "Prueba {{appName}} si buscas un chat alojado con modelos convencionales y sin censura. OpenRouter Chat y NanoGPT ofrecen pago por uso. TypingMind sirve para traer tus claves y Open WebUI para usar modelos locales.",
        },
        free: {
          q: "¿Hay una alternativa gratuita a Poe?",
          a: "{{appName}} da {{guestCredits}} créditos gratis al mes sin cuenta. OpenRouter tiene algunos modelos gratuitos. LibreChat y Open WebUI se pueden instalar sin pagar por el software. El equipo, el alojamiento y los modelos de pago pueden tener costo.",
        },
        billing: {
          q: "¿Qué alternativas a Poe permiten pagar por uso?",
          a: "OpenRouter y NanoGPT descuentan el uso de un saldo. TypingMind y LibreChat se conectan a cuentas que pagas directamente. El costo depende del modelo, del contexto y de la frecuencia.",
        },
        privacy: {
          q: "¿Qué alternativa mantiene mis chats en el dispositivo?",
          a: "Open WebUI puede funcionar sin conexión con un modelo local. TypingMind guarda el historial localmente por defecto con una licencia. Venice, NanoGPT y el modo incógnito de {{appName}} pueden conservar el historial en tu equipo, aunque el modelo alojado recibe la consulta.",
        },
        switching: {
          q: "¿Conviene mantener Poe si uso bots de la comunidad?",
          a: "Muchas veces sí. Otras aplicaciones tienen sus propios agentes o herramientas. El directorio público, los chats grupales y los pagos a creadores forman parte de Poe. Antes de cambiar, comprueba que el nuevo servicio cubra lo que usas.",
        },
      },
    },
    typingMind: {
      metaTitle: "8 alternativas a TypingMind comparadas (2026)",
      description:
        "Compara alternativas a TypingMind para tus claves API, modelos locales o chat alojado. Costos de licencias, tarifas de modelos y qué ofrece {{appName}}.",
      keywords:
        "alternativas a TypingMind, TypingMind o LibreChat, TypingMind o Open WebUI, clave API propia, {{appName}}",
      title: "8 alternativas a TypingMind para tu chat con IA",
      subtitle:
        "Conserva tus claves e instala tu interfaz, o entra directamente a un chat alojado. Ocho opciones comparadas, incluida {{appName}}.",
      lead: "TypingMind reúne en una interfaz cuidada a los proveedores que ya pagas. Si principalmente buscas una ventana de chat, suma el precio de la licencia, el uso de modelos y la sincronización si la necesitas. Puede convenirte una interfaz gratuita o un chat alojado que gestione los modelos.",
      overview: "Qué incluye la licencia de TypingMind",
      tradeoff:
        "Con TypingMind pagas directamente a los proveedores. Premium muestra varias respuestas independientes a la vez. {{appName}} reúne modelos alojados y descuenta créditos según la tarifa del modelo. Una interfaz como TypingMind encaja si quieres gastar saldo que ya tienes con un proveedor.",
      switch: {
        firstLink: "Alternativas gratuitas para instalar",
        secondLink: "Costos aparte de la licencia de TypingMind",
        first:
          "En r/selfhosted, un usuario buscaba una interfaz más económica para seguir usando el acceso de OpenAI en su propio servidor. Probó Open WebUI y contó que le daba lo que buscaba.",
        second:
          "En r/TypingMind, una persona interesada en la licencia de por vida preguntó qué costos quedaban. Las respuestas mencionaron uso de API y almacenamiento opcional en la nube. Consulta la página de precios para ver las condiciones actuales.",
      },
      criteria: {
        cost: "Calcula el total de un año con la licencia, el uso de modelos, el almacenamiento y el posible servidor. Una cuota fija es más fácil de presupuestar. El pago por uso puede encajar si chateas de vez en cuando.",
        workflow:
          "Si necesitas tus claves o un modelo local, revisa LibreChat y Open WebUI. Si usas un contexto por modelo o carpetas de proyectos, prueba esas funciones antes de migrar.",
      },
      faq: {
        best: {
          q: "¿Cuál es la mejor alternativa a TypingMind?",
          a: "LibreChat encaja si quieres instalar una interfaz para varios proveedores. Open WebUI sirve para modelos locales, OpenRouter Chat para comparar respuestas y {{appName}} para un chat alojado con modelos convencionales y sin censura, sin configurar claves.",
        },
        free: {
          q: "¿Hay una alternativa gratuita a TypingMind?",
          a: "Puedes instalar LibreChat y Open WebUI gratis según sus licencias. El servidor y los modelos de pago se cobran aparte. {{appName}} ofrece {{guestCredits}} créditos gratuitos al mes sin cuenta.",
        },
        billing: {
          q: "¿La licencia de TypingMind incluye el uso de la API?",
          a: "No. Compras la licencia una vez y cada proveedor cobra por el uso de sus modelos. En local pagas el equipo y la electricidad. ChatGPT Plus es una suscripción separada y no cubre el uso general de la API de OpenAI.",
        },
        privacy: {
          q: "¿Guardar el historial en local significa que el modelo funciona sin conexión?",
          a: "No. TypingMind puede guardar el historial en tu equipo y enviar la solicitud al proveedor en línea. Con Open WebUI y un modelo totalmente local, tanto el historial como el procesamiento pueden quedarse en tu equipo.",
        },
        switching: {
          q: "¿Puedo cambiar de TypingMind a Poe o a OpenRouter Chat?",
          a: "Sí. Poe gestiona el acceso a modelos con los puntos de su plan. OpenRouter Chat cobra los modelos de pago de un saldo y permite consultar a varios modelos a la vez. Guarda los chats importantes y revisa los formatos de importación antes de cambiar.",
        },
      },
    },
  },
};
