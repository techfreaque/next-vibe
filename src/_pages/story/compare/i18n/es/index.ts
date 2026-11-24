import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    category: "Comparación",
    breadcrumb: "Comparación de plataformas de IA sin censura",
    backToBlog: "Volver al blog",
    backToHub: "Todas las plataformas de IA sin censura",
    updated: "Última actualización: {{date}}",
    versusImageAlt: "{{appName}} frente a {{name}}",
    kinds: {
      uncensoredChat: "Aplicación de chat sin censura",
      aggregator: "Aplicación con varios modelos y API",
      router: "Enrutador de API",
      roleplay: "Juego de rol con personajes",
      frontend: "Interfaz de juego de rol con alojamiento propio",
      companion: "Aplicación de compañeros de IA",
      filteredChat: "Chat con personajes y filtros",
      local: "Ejecución local de modelos",
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
      media: "Medios",
      open: "Código abierto",
      usLink: "Ver planes",
      versusLink: "Comparación completa",
    },
    versus: {
      shortTitle: "En pocas palabras",
      tableTitle: "{{appName}} frente a {{name}}",
      tableIntro:
        "Los datos de {{name}} provienen de sus páginas oficiales, consultadas el {{date}}. Los de {{appName}} salen de la configuración actual.",
      tableFootnote:
        "Los precios de {{name}} son los de lista en USD que publica en sus páginas. Para nuestros planes, aquí ves lo que pagas al comprar. Los planes pueden cambiar. Consulta las fuentes de abajo antes de comprar.",
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
        "La información sobre {{name}} viene de estas páginas, consultadas el {{date}}. Si encuentras algo desactualizado, avísanos y lo corregimos.",
      ourSources:
        "Nuestros datos salen de la misma configuración que calcula los cobros. Puedes comprobarlos aquí.",
      modelsLink: "Todos los modelos de {{appName}} con precios actualizados",
      pricingLink: "Planes y paquetes de créditos",
      privacyLink: "Nuestra política de privacidad",
      modelTitle: "{{model}} en {{appName}}",
      modelIntro:
        "El modelo propio de {{name}} está en nuestro selector. Su página muestra el precio actual por mensaje, la ventana de contexto y el ID de la API.",
      modelPageLink: "{{model}}: precio, contexto y API",
      modelCompareLink: "{{model}} vs {{other}}: cara a cara",
      moreTitle: "Más comparaciones",
      ctaSubtitle:
        "{{guestCredits}} créditos gratis al mes. Sin cuenta ni tarjeta. Cambia entre modelos convencionales, abiertos y sin censura en cada mensaje.",
      ctaTry: "Iniciar un chat en modo incógnito",
      ctaModels: "Ver todos los modelos",
    },
  },
  us: {
    kind: "Chat con modelos convencionales, abiertos y sin censura",
    free: "Sí: {{guestCredits}} créditos al mes sin cuenta y {{freeCredits}} con una cuenta",
    paid: "Desde {{subPrice}} al mes",
    filterShort:
      "Elige el filtro de cada chat. Para usar los modelos sin censura, confirma una sola vez que tienes al menos 18 años.",
    privacyShort:
      "Los chats en modo incógnito se quedan en el navegador. Los privados se guardan en tu cuenta.",
    apiShort: "Sí, compatible con OpenAI y Anthropic después de una compra",
    mediaShort: "Imágenes, vídeo, música, voz",
    openShort: "Código abierto, con alojamiento propio",
    price:
      "Planes: {{planList}} al mes. Recarga cualquier plan activo con paquetes de {{packCredits}} créditos por {{packPrice}}. Los paquetes nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
    models:
      "{{modelCount}} modelos de chat de {{labCount}} laboratorios: {{mainstream}} convencionales, {{open}} abiertos y {{uncensored}} sin censura. De estos, {{refusalsRemoved}} son modelos convencionales o abiertos modificados para reducir los rechazos. {{ownModel}} tiene una visión del mundo propia. Se entrenó con libros y documentos prohibidos en el internet convencional.",
    filter:
      "Tres niveles: convencionales, abiertos y sin censura. Elige el modelo en cada mensaje. Para acceder a los modelos sin censura, confirma una sola vez que tienes al menos 18 años. No añadimos otro filtro. Los modelos convencionales conservan los filtros de sus proveedores.",
    privacy:
      "Los chats en modo incógnito se quedan en el almacenamiento local del navegador y funcionan sin cuenta. Los chats privados se guardan en tu cuenta y los archivos generados se almacenan en nuestros servidores. Enviamos cada mensaje al proveedor que genera la respuesta.",
    api: "API /v1 compatible con OpenAI y Anthropic para chat, imágenes, video y voz. Se activa con cualquier plan (desde {{apiSubPrice}} al mes) o una compra de créditos. Las cuentas gratis reciben HTTP 402.",
    media:
      "Imagen {{imageModels}}, video {{videoModels}}, música {{musicModels}} y modelos de voz {{voiceModels}} en el mismo saldo de crédito, que se puede llamar desde cualquier chat.",
    open: "Toda la plataforma es de código abierto en GitHub. Sírvelo en tu propio hardware.",
    forWho:
      "Las personas que quieren modelos dominantes, abiertos y sin censura más medios en un chat y un saldo, y quieren establecer el filtro ellos mismos.",
  },
  links: {
    hub: "Las mejores plataformas AI sin censura: comparación honesta",
    hubDesc:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT, modelos locales y más: precios, filtros, privacidad y API, con fuentes",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Plataformas AI sin censura en comparación",
    sectionIntro:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT y más: precios, filtros y privacidad sacados de sus propias páginas.",
  },
  platforms: {
    venice: {
      what: "Aplicación AI de privacidad con un gran catálogo de modelos, muchos modelos de texto sin censura, generación de imagen, vídeo y música, OpenAI -compatible API y una capa criptográfico (VVV y DIEM).",
      pricingNote:
        "Gratis: 10 textos y 15 impulsos de imagen al día, modelos base solamente. 100 créditos = $1. Los modelos de vídeo, música y frontera cuestan créditos arriba.",
      models:
        "420 modelos en sus docs (148 texto). Alrededor de 17 modelos de texto son etiquetados sin censura, liderados por Venice Uncensored 1.2 (Dolphin Mistral 24B Venice Edition), más GLM no censurado, DeepSeek y Qwen construye. Claude, GPT, Gemini y Grok también.",
      filterShort: "Filtro de maduración por defecto, Pro puede apagarlo",
      filter:
        "Un Filtro de la Matura está encendido por defecto. Los suscriptores Pro lo apagan en sus preferencias. Un modo opcional Safe Venice, bloqueado con un PIN, esconde caracteres e imágenes adultos.",
      privacyShort: "La historia de chat permanece en tu dispositivo",
      privacy:
        "Venice dice que el historial de conversaciones permanece en su dispositivo y nunca se almacena en sus servidores. Para modelos de terceros en modo anónimo le dice que asuma que el proveedor almacena su contenido.",
      apiShort: "",
      api: "OpenAI -compatible API, facturado por ficha en créditos USD. Staked DIEM da $1 de crédito API al día. Pago sin cargo por solicitud con USDC a través de x402.",
      forWho:
        "Usuarios de mentalidad de privacidad que quieren chat y medios sin censura en una app, además de desarrolladores y titulares criptográficos.",
      pro1: "Gran catálogo con muchos modelos de texto sin censura y precios baratos API sin censura.",
      pro2: "La historia se mantiene en el dispositivo por defecto.",
      con1: "El tier libre es ajustado: 10 mensajes de texto al día en los modelos base.",
      con2: "El filtro adulto y la mayoría de los medios necesitan créditos Pro más.",
    },
    uncensoredAi: {
      what: "Aplicación de chat sin censura con un foro comunitario y archivos de documentos. Web, iOS y Android.",
      pricingNote:
        "Gratis: 3 respuestas al día. Los precios pro están cerrados para la vida. Tarjetas, Aplicación de efectivo, Apple Pay y Bitcoin. Los créditos API venden por separado a $0.05 por llamada.",
      models:
        "Un solo modelo: UncensoredAI v1.2, con 32K de contexto, entrenado con libros y documentos prohibidos en el internet convencional. Sus opiniones políticas van contra la corriente dominante.",
      filterShort: "Sin filtro descrito, 18+ en términos",
      filter:
        "Se llama una plataforma AI sin restricciones. Los términos requieren que los usuarios sean mayores de 18 años y prohíban el contenido destinado a dañar, hostigar o poner en peligro a otros.",
      privacyShort: "No se utiliza para la capacitación, según su política",
      privacy:
        "Su política dice que sus datos no se utilizan para entrenar o mejorar los modelos AI. Los mensajes van a Parasail AI para el procesamiento. Pro mantiene el historial de chat con búsqueda y exportación.",
      apiShort: "",
      api: "Drop-in OpenAI -compatible API a $0.05 por inferencia.",
      forWho:
        "Las personas que desconfian de las narrativas principales y quieren respuestas contundentes sobre temas impugnados.",
      pro1: "Plan pagado más barato en esta lista, precio bloqueado para la vida.",
      pro2: "No se utiliza para el entrenamiento, dice su política de privacidad.",
      con1: "Un modelo, contexto de 32K, sin generación de imagen, vídeo o música.",
      con2: "El plan gratis da 3 respuestas al día; la voz, las carpetas y los archivos requieren Pro.",
    },
    nanoGpt: {
      what: "Pagar como-usted-go aplicación web y API para modelos de texto, imagen, vídeo y audio. No se necesita suscripción, plan opcional para modelos abiertos.",
      pricingNote:
        "Recarga desde $0.10 en criptomonedas o $1 con tarjeta, sin comisión de depósito. Gratis: un modelo, solo en la web. PRO solo incluye modelos de código abierto. El uso de Claude, GPT, Gemini y Grok se cobra del saldo.",
      models:
        "631 modelos de texto en su API público, cerca de 39 de ellos sin censura o abliterado: Venice Sin censura, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 abliterado y más. Modelos de corriente principal también.",
      filterShort: "No manta NSFW ban, 18+",
      filter:
        "Los términos requieren 18+. Prohiben CSAM, imágenes íntimas no consentidas y profundos sexualmente explícitos, no contenidos adultos en general.",
      privacyShort: "Chats en su navegador, ninguna cuenta necesaria",
      privacy:
        "Las conversaciones se almacenan en su navegador por defecto, sincronización de la nube es opt-in. NanoGPT dice que no registra ni retiene los avisos y respuestas. No se requiere cuenta. Algunas rutas de proveedores permiten la capacitación.",
      apiShort: "",
      api: "OpenAI -compatible API, también Anthropic Mensajes formato, con pagos sin cuenta x402. Cada respuesta devuelve su costo.",
      forWho:
        "Usuarios y desarrolladores de pago por uso que quieren cada modelo, pagos criptográficos y sin suscripción.",
      pro1: "Gran lista de modelos, precios de lista, entrada de diez centavos.",
      pro2: "No se necesita cuenta, los chats permanecen en su navegador.",
      con1: "El tier libre es un modelo en la web.",
      con2: "La privacidad depende de la ruta del proveedor que elija.",
    },
    openRouter: {
      what: "Desarrollador API que recorre una clave a cientos de modelos de muchos proveedores, facturado por token de créditos prepagados.",
      pricingNote:
        "Sin suscripción. Los precios de la lista de proveedores más una cuota del 5,5% en las compras de crédito. Modelos gratis: 50 solicitudes al día, 1.000 después de comprar $10 de créditos.",
      models:
        "474 modelos, 15 gratis. La oferta sin censura es escasa: Venice Uncensored (Dolphin Mistral 24B, alojado por Venice) y fine-tunes de rol como Hermes 4 y Magnum. 142 modelos están marcados como moderados.",
      filterShort: "Se aplican reglas del proveedor, muchas rutas moderadas",
      filter:
        "Los términos requieren 18+. Entradas de pantalla OpenRouter para CSAM conocido. Cada proveedor mantiene el control de su propio modelo, y las rutas moderadas disminuyen por la política del proveedor.",
      privacyShort: "No almacenamiento rápido a menos que opte por entrar",
      privacy:
        "OpenRouter dice que no almacena los avisos ni las respuestas a menos que opte por entrar. Los metadatos siempre se almacenan. Las políticas de registro de proveedores varían.",
      apiShort: "",
      api: "OpenAI -compatible API. Este es el producto.",
      forWho:
        "Desarrolladores que quieren una clave API para muchos modelos con el retroceso del proveedor.",
      pro1: "Gran catálogo a precios de lista, sin suscripción.",
      pro2: "La iniciación y el entrenamiento son opt-in.",
      con1: "Pocos modelos sin censura.",
      con2: "No hay enfoque de la aplicación de chat de consumo: usted trae la interfaz.",
    },
    freedomGpt: {
      what: "Aplicación AI: modelos dominantes junto a su propio modelo libre de censura Liberty, con generación de imagen y vídeo. También una aplicación de escritorio de código abierto para modelos offline.",
      pricingNote:
        "Libre sin tarjeta o cuenta. Pro incluye 2.200 créditos al mes: una respuesta premium cuesta alrededor de 10, una imagen sobre 25, un video de 5 segundos sobre 400.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral y más, además de Liberty y otros modelos sin censura en la misma lista. No hay un total publicado.",
      filterShort: "Modelos libres de censura, leyes US y normas éticas",
      filter:
        "FreedomGPT dice que todos y cada modelo que acoge deben seguir la ley US, y no permite que sus modelos sean utilizados para fines no éticos. Una etiqueta sin censura no promete que cada solicitud sea contestada.",
      privacyShort: "Mensajes compartidos con proveedores AI",
      privacy:
        "Su política dice que los mensajes de chat, las grabaciones de voz y las imágenes se comparten con proveedores de terceros AI para producir respuestas. No se establece un período de retención. Usarlo sin una cuenta no hace que una solicitud de nube sea local.",
      apiShort: "",
      api: "API en chat.freedomgpt.com /api/v1 con una llave del panel de control. El precio no está documentado.",
      forWho:
        "Usuarios que quieren una suscripción para muchos modelos con opciones libres de censura.",
      pro1: "Comienzo libre sin cuenta o tarjeta.",
      pro2: "Imágenes y vídeo en la misma aplicación.",
      con1: "Sigue ligada por la ley US y una regla de uso no ético.",
      con2: "La aplicación de escritorio de código abierto no se ha actualizado desde junio de 2024.",
    },
    gabAi: {
      what: "Plataforma AI multimodelo de Gab con 214 modelos, su propio modelo Arya, un modo agente, imagen, vídeo y generación de música y aplicaciones de escritorio. La posición cristiana de derecha abierta.",
      pricingNote:
        "Gratis: 250 créditos después de la verificación por correo electrónico. Paquetes de crédito de 10 dólares por 700 créditos, nunca caducan.",
      models:
        "214 modelos en una sola cuenta: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi y más. Arya es el propio modelo de Gab, construido alrededor de los valores cristianos y principios conservadores.",
      filterShort:
        "Libertad de expresión, con restricciones al contenido sexual",
      filter:
        "Los términos requieren 18+ y prohíben el contenido obsceno, sexualmente explícito o pornográfico. Los sistemas automatizados pueden escanear el contenido para el cumplimiento. Libre de política, no de contenido adulto.",
      privacyShort: "Chats almacenados, utilizados para mejorar modelos",
      privacy:
        "Gab guarda tus prompts, respuestas e historial en sus servidores y cita la mejora de sus modelos como uno de sus fines. Las solicitudes llegan a los proveedores de modelos a través de las propias cuentas de Gab; según su política, eso no hace que una solicitud sea anónima.",
      apiShort: "",
      api: "OpenAI y Anthropic compatibles API. Requiere un plan Plus.",
      forWho:
        "Usuarios conservadores y cristianos que quieren AI construido fuera de Big Tech.",
      pro1: "Gran catálogo, modo agente y aplicaciones de escritorio.",
      pro2: "Los paquetes de crédito nunca caducan.",
      con1: "Prohibi contenido sexualmente explícito: sin ayuda para la ficción adulta.",
      con2: "Promptas almacenadas y utilizadas para mejorar modelos.",
    },
    janitorAi: {
      what: "Sitio de carácter comunitario con millones de bots hechos por el usuario, un modelo incorporado gratuito (JLLM) y la opción para conectar su propio modelo a través de un proxy API.",
      pricingNote:
        "Gratis: chats ilimitados en modelos estándar, cerca de 9K fichas de contexto. janitor+ añade memoria de caracteres 5x, velocidad de prioridad y más modelos. Su Router factura otros modelos por token, web solamente, suscriptores solamente.",
      models:
        "JLLM, su propio modelo libre (modelo de base no revelado). O cualquier modelo que conecte a través de un proxy: su guía oficial utiliza OpenRouter.",
      filterShort: "NSFW bots permitido si etiquetado, 18+ autodeclarado",
      filter:
        "Solo adultos, 18+ por declaración propia. Las botas son etiquetadas Limited (sin contenido sexual) o Limitless (se admite NSFW). La aplicación móvil comienza en modo seguro hasta que habilita NSFW en la web. Prohibido: cualquier cosa sexual que involucra a menores, violencia sexual, gore, bestialidad, discurso de odio.",
      privacyShort:
        "Chats almacenados, utilizados para investigación y desarrollo",
      privacy:
        "Los chats se almacenan como contenido de usuario y sus listas de políticas de investigación y desarrollo para mejorar sus sistemas AI. Con un proxy, sus mensajes también van a ese proveedor bajo su propia política.",
      apiShort: "Trae tu propia llave",
      api: "No desarrollador API. Consume APIs: puede traer su propia clave a través de un proxy.",
      forWho:
        "Los jugadores de roles que quieren una enorme libre biblioteca de personajes comunitarios.",
      pro1: "Libre chat ilimitado con millones de bots comunitarios.",
      pro2: "Traiga su propio modelo a través de un proxy.",
      con1: "Contexto libre es sobre 9K tokens: largas historias olvidan escenas tempranas.",
      con2: "Texto solamente: no hay imagen, vídeo o generación de voz.",
    },
    sillyTavern: {
      what: "Free, open-source (AGPL-3.0) chat frontend que se instala. Tarjetas de carácter, libros de texto, extensiones. No envía ningún modelo: conectas uno.",
      pricingNote:
        "La aplicación es gratuita para siempre. Pagas lo que sea API que conectes, o nada si ejecutas un modelo localmente.",
      models:
        "Ninguno incluido. Se conecta a backends locales (KoboldCpp, llama.cpp, Ollama, text-generación-webui) y alrededor de 16 API de nube, incluyendo OpenAI, Claude, Google, Mistral, DeepSeek, OpenRouter y cualquier punto final compatible con OpenAI.",
      filterShort: "Ninguno de los suyos: el modelo decide",
      filter:
        "No hay filtro propio. Los límites son lo que el modelo o proveedor conectado impone.",
      privacyShort: "Instalación local, sin seguimiento",
      privacy:
        "El proyecto dice que no ofrece servicios alojados y no rastrea los datos del usuario. Los chats se almacenan en su máquina. Lo que envíe a una nube API cae bajo la política de ese proveedor.",
      apiShort: "Se conecta a APIs",
      api: "Un cliente, no un proveedor. Habla con el API que configuras.",
      forWho:
        "Los usuarios de potencia que aceptan una curva de aprendizaje empinada para el control completo de los impulsos y caracteres.",
      pro1: "Control máximo: cualquier backend, cualquier impulso, extensiones ricas.",
      pro2: "Libre, de código abierto, nada deja tu máquina excepto lo que envías a un API.",
      con1: "Usted instala y mantiene, y abastece el modelo usted mismo.",
      con2: "Curva de aprendizaje constante, por la propia descripción del proyecto.",
    },
    characterAi: {
      what: "La plataforma de chat de carácter más grande, caracteres 10M+ en sus propios modelos, con reglas de contenido estrictas. Incluye aquí como el contraste filtrado.",
      pricingNote:
        "Gratis: mensajes ilimitados con anuncios. lite elimina la mayoría de los anuncios (precio US, varía según el país). c.ai + añade los modelos de chat superior, mejor memoria y ningún modo lento.",
      models:
        "Sus propios modelos sólo, ofrecidos como estilos de chat (PipSqueak, DeepSqueak, LongSqueak). No hay elección modelo más allá de esos, no hay propia llave.",
      filterShort: "Filtrado, pornografía nunca apoyado",
      filter:
        "El contenido pornográfico está en contra de sus términos y, en sus palabras, no se apoyará en ningún momento del futuro. Cada usuario pasa por la seguridad de edad a través de Persona. Los usuarios verificados como menos de 18 reciben el modo de lectura solamente, sin chat.",
      privacyShort:
        "Los chats pueden entrenar sus modelos y anuncios de destino",
      privacy:
        "Su política de privacidad dice que la información se utiliza para entrenar sus modelos AI y para proporcionar publicidad personalizada.",
      apiShort: "",
      api: "No desarrollador público API.",
      forWho:
        "Chat de entretenimiento seguro por trabajo con una biblioteca de caracteres gigante.",
      pro1: "Gran biblioteca de caracteres y mensajes gratuitos ilimitados.",
      pro2: "Entrada barata con lite, llamadas de voz con personajes.",
      con1: "No hay contenido para adultos, nunca. Las escenas oscuras se suavizan o se niegan.",
      con2: "Los chats se pueden utilizar para entrenamiento y anuncios. No hay elección modelo.",
    },
    kindroid: {
      what: "Aplicación de compañero AI: un amigo persistente o pareja con larga memoria, llamadas de voz y video, selfies y chats en grupo.",
      pricingNote:
        "No hay nivel libre en curso: una vista previa de 50 mensajes, luego sólo lectura. Ultra y MAX son agregados mensuales en la parte superior. US App Precios de la tienda; Kindroid dice que el checkout web es generalmente más barato.",
      models:
        "Sus propios modelos (Polaris, Ember, Reverie y otros) y sus propios modelos selfie. No tiene llave.",
      filterShort: "Posición sin filtrar, líneas rojas a nivel de cuenta",
      filter:
        "Se llama verdaderamente sin filtrar y no pone ningún filtro en el propio AI, pero escanea mensajes para algunas líneas rojas como el auto-arma inminente o daño a otros. 18+: una suscripción pagada cuenta como verificación de edad, Yoti es la alternativa.",
      privacyShort: "Cifrado en reposo, no final a extremo",
      privacy:
        "Los chats están encriptados en reposo y tránsito, no en fin: su contenido de procesos de sistemas y sistemas de seguridad automatizados lo revisan. Dice que los datos nunca se venden.",
      apiShort: "API personal a tus compañeros",
      api: "Llaves personales API para hablar con sus propios Kindroids, no un modelo general API.",
      forWho:
        "Adultos que quieren un compañero AI a largo plazo con voz, vídeo y fotos.",
      pro1: "Apilación de acompañante: memoria, selfies, voz y videollamadas en vivo.",
      pro2: "Posición infiltrada dirigida a adultos.",
      con1: "Pagar para seguir hablando después de 50 mensajes.",
      con2: "Los mejores niveles de memoria apilan: Ultra y MAX en la parte superior del plan base.",
    },
    nomi: {
      what: "Aplicación de compañero AI construida alrededor de la memoria a largo plazo: amigo, socio o mentor, con selfies, chats de voz y grupo.",
      pricingNote:
        "Tier libre con mensajes e imágenes diarios (no publicados). La suscripción desbloquea mensajes ilimitados y voz. US App Precios de la tienda; no hay lista de precios web públicos.",
      models: "Sus propios modelos, no nombrados públicamente. No tiene llave.",
      filterShort: "Filtro de nudidad sin filtro de texto en imágenes",
      filter:
        "Su sitio dice que las conversaciones no están restringidas por filtros de contenido arbitrarios. Las imágenes tienen un filtro de nudidad debido a las tiendas de aplicaciones y procesadores de pago. Los menores de 18 años no pueden usarla.",
      privacyShort: "Nunca se vende, borrado con su cuenta",
      privacy:
        "Su política dice que los datos personales nunca se venden o alquilan y no se guardan después de eliminar su cuenta (en unos 28 días).",
      apiShort: "API personal a tus compañeros",
      api: "REST API para charlar con su propio Nomis, no un modelo general API.",
      forWho:
        "Gente que quiere un compañero emocional y a largo plazo que recuerda.",
      pro1: "Memoria construida para largas relaciones.",
      pro2: "Tier libre y una clara posición de privacidad sin vender.",
      con1: "Filtro de Nudidad en imágenes.",
      con2: "Voz sólo con una suscripción, límites gratuitos no publicados.",
    },
    crushOn: {
      what: "NSFW sitio de chat de caracteres con un interruptor sin filtrar y acceso a modelos de terceros.",
      pricingNote:
        "Gratis: 100 créditos de mensajes al mes, modelos ilimitados gratuitos, historia limpiada después de 7 días de inactividad. Los planes anuales son más baratos. Los modelos Pro necesitan una membresía o un paquete separado.",
      models:
        "Modelos de terceros enrutados por tier; sus nombres de sitios Claude 4, Gemini 2.5 Flash, GPT-4.1 y DeepSeek V4. Lista completa detrás de la sesión.",
      filterShort: "Interruptor sin relleno después de un cheque de edad",
      filter:
        "Un interruptor sin filtro desbloquea texto adulto después de la verificación de edad: selfie o ID a través de Didit, AgeGo, o un pago de $0.99. Sus pautas todavía prohíben imágenes sexuales explícitas, imágenes realistas de personas reales, menores y personajes de crianza.",
      privacyShort: "Los chats pueden entrenar sus modelos",
      privacy:
        "Su política dice que el contenido de chat puede ser utilizado para entrenar sus modelos, no vinculados a usuarios específicos. Las cookies se utilizan para retargeting ads.",
      apiShort: "",
      api: "No desarrollador público API.",
      forWho:
        "Adultos que quieren chat de carácter picante en una aplicación lista.",
      pro1: "Juego de roles adultos en una aplicación pulida, entrada gratuita.",
      pro2: "Verificación de edad, por CrushOn, nunca muestra su foto o ID.",
      con1: "Seis niveles de crédito hasta $199.99 al mes: difícil de predecir el costo.",
      con2: "Historia libre limpiada después de 7 días de inactividad; los chats pueden entrenar modelos.",
    },
    ollama: {
      what: "Gratis, MIT -licensed herramienta que descarga y ejecuta modelos abiertos en su propio equipo, con un API local. También vende modelos de nube anfitriona.",
      pricingNote:
        "Ejecutar modelos en su propio hardware es libre e ilimitado. Los planes pagados sólo cubren sus modelos de nube.",
      models:
        "Cualquier modelo abierto en su biblioteca, incluyendo Dolphin 3 y la comunidad abliterated subidas como Qwen 3.8 abliterated. Las subidas comunitarias no son examinadas por Ollama.",
      filterShort: "Sea cual sea el modelo que cargues",
      filter:
        "No hay filtro propio cuando corres localmente. Un modelo abliterado no se niega. Un modelo de stock mantiene las negaciones con las que se entrenó.",
      privacyShort: "Totalmente local, los avisos nunca dejan su máquina",
      privacy:
        "Ollama dice que no ve sus indicaciones ni datos cuando se ejecuta localmente. La nube se puede apagar completamente.",
      apiShort: "",
      api: "OpenAI: servidor compatible en localhost:11434, además de una nube API para sus modelos alojados.",
      forWho:
        "Desarrolladores y usuarios técnicos con una máquina capaz, a menudo emparejados con un frontend de chat.",
      pro1: "Total privacidad y cero costo por mensaje.",
      pro2: "Gran biblioteca, OpenAI -compatible local API.",
      con1: "Tus tapas de hardware calidad: un modelo 70B es una descarga de 43 GB antes del contexto.",
      con2: "Mayormente CLI y API : se añade la interfaz de chat.",
    },
    lmStudio: {
      what: "Aplicación de escritorio con una interfaz pulida para descargar y ejecutar modelos locales (GGUF y MLX), además de un servidor API local.",
      pricingNote:
        "Libre para uso doméstico y laboral desde julio 2025. Planes pagados añaden modelos alojados y más dispositivos.",
      models:
        "Modelos locales de Hugging Face, incluyendo construcciones abliterated GGUF y Delfín.",
      filterShort: "Sea cual sea el modelo que cargues",
      filter:
        "No hay filtro propio para los modelos locales. Lo que se niega es el modelo que eliges.",
      privacyShort: "La inferencia local permanece en el dispositivo",
      privacy:
        "Los modelos locales funcionan en tu dispositivo. Sus servicios hospedados reclaman la retención de datos cero.",
      apiShort: "",
      api: "OpenAI: servidor compatible en localhost:1234.",
      forWho:
        "No desarrolladores que quieren modelos locales sin una línea de comandos, en un Mac con Apple Silicon, Windows o Linux.",
      pro1: "La manera más fácil de ejecutar modelos sin censura localmente.",
      pro2: "Libre, incluido el uso comercial.",
      con1: "La propia aplicación es fuente cerrada. No Intel Macs.",
      con2: "El mismo techo de hardware que cualquier configuración local.",
    },
  },
  hub: {
    meta: {
      title:
        "Las mejores plataformas AI no censuradas 2026: Comparación honesta",
      category: "Comparación",
      description:
        "{{count}} plataformas AI no censuradas comparadas: Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, modelos locales y más. Precios, filtros, privacidad, API. Fuentes citadas.",
      imageAlt: "Plataformas AI sin censura comparadas lado a lado",
      keywords:
        "mejor sin censura AI, sin censura AI plataformas, sin censura AI chat, sin filtrar AI, Venice AI alternativa, Venice.ai revisión, NanoGPT, Janitor AI alternativa, carácter AI alternativa, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn AISillyTavern, Ollama sin censura, LM Estudio sin censura, modelos abliterados, NSFW AI chat, {{appName}}",
    },
    hero: {
      category: "Comparación",
      readTime: "14 min leer",
      title:
        "Las mejores plataformas AI sin censura 2026: la comparación honesta",
      subtitle:
        "Plataformas {{count}}, más nosotros. Precios reales de sus propias páginas de precios, cómo cada uno filtra, qué pasa con sus chats, y para quién cada uno es construido. Cada hecho tiene una fuente.",
    },
    intro: {
      lead: "Cada sitio AI sin censura se llama el más privado, el más libre, el menos filtrado. La mitad de ellos todavía prohíben el contenido de adultos. Un tren en tus charlas. Uno te vende una ficha. Las páginas de marketing no te dirán qué.",
      p2: "Así que lo comprobamos. La página de precios, términos, política de privacidad y los documentos API, en {{date}}. A continuación: una rápida selección por trabajo, la tabla completa, una tarjeta por plataforma con sus fuentes, y los casos en los que no debe utilizarnos.",
      disclosure:
        "Divulgación: {{appName}} es una de las plataformas en esta página, y compramos de varios de los otros. Venice, uncensored.ai, NanoGPT, FreedomGPT, Gab AI y OpenRouter sirven algunos de nuestros modelos a través de sus API. Decimos dónde, con números en vivo. Sin puntuaciones, sin calificaciones de estrellas: hechos y fuentes, juzgas.",
    },
    picks: {
      title: "Elijas rápidas: el mejor AI sin censura para cada trabajo",
      intro: "Ninguna plataforma gana todo. Empieza por lo que necesitas.",
      oneApp: {
        title: "Todo en una sola charla: {{appName}}",
        body: "{{modelCount}} modelos, {{uncensored}} de ellos sin censura, junto a Claude, GPT y Gemini. Imágenes, vídeo, música y voz en el mismo saldo. Cambia el modelo por mensaje.",
      },
      ownWorldview: {
        title:
          "Una visión del mundo diferente, no sólo menos rechazos: uncensored.ai 's modelo",
        body: "La mayoría de los modelos sin censura son modelos dominantes con los rechazos cortados. uncensored.ai vende un modelo con sus propias tomas. En {{appName}} funciona como {{ownModel}}, junto a todo lo demás.",
      },
      privacy: {
        title: "Chats que nunca tocan un servidor: Venice o NanoGPT",
        body: "Ambos guardan la historia en su navegador por defecto. NanoGPT no necesita ninguna cuenta. En {{appName}}, los chats de incógnito hacen lo mismo.",
      },
      roleplay: {
        title: "Función de carácter comunitario: Janitor AI o SillyTavern",
        body: "Janitor AI para una enorme biblioteca de bots gratis. SillyTavern si quieres el control total y lo configurarás tú mismo.",
      },
      companions: {
        title: "Un compañero de AI a largo plazo: Kindroid o Nomi",
        body: "Memoria, selfies, voces. Kindroid no tiene un nivel libre en curso; Nomi sólo filtra la nudidad en imágenes.",
      },
      developers: {
        title: "API para modelos sin censura: NanoGPT, Venice o OpenRouter",
        body: "NanoGPT y Venice llevan muchos modelos sin censura a precios bajos per-token. OpenRouter tiene el catálogo más amplio pero pocas opciones sin censura.",
      },
      local: {
        title: "Total privacidad, costo cero por mensaje: Ollama o LM Studio",
        body: "Ejecute modelos abliterados en su propia máquina. Nada lo deja. Su hardware establece el techo de calidad.",
      },
      filtered: {
        title: "Usted quiere el filtro: Personaje. AI",
        body: "Seguro para el trabajo por diseño, con cheques de edad para todos. La llamada correcta para los adolescentes o un lugar de trabajo estricto.",
      },
    },
    table: {
      title: "Todas las plataformas {{count}} y {{appName}}, lado a lado",
      intro:
        "Desplazar los laterales en el móvil. Los hechos del competidor comprobaron {{date}} en sus propias páginas, la nuestra leyó en vivo desde nuestro config.",
      footnote:
        'Los precios son los precios de la lista USD de la página propia de cada plataforma; Kindroid y Nomi muestran precios sólo a la salida después de la entrada, por lo que los suyos vienen de la App Store US. Los impuestos, los precios regionales y los promos difieren. "Limited" significa a través de una configuración de tu propia llave, un complemento o un compañero personal API.',
    },
    kinds: {
      title: "No censurado no es una cosa: cuatro tipos de filtración",
      intro:
        "Antes de comparar plataformas, sabe lo que esconde la etiqueta. El modelo decide más que la aplicación.",
      abliterated:
        "Abliterado: un modelo convencional o abierto con su dirección de rechazo eliminado de los pesos. Los investigadores encontraron que la negativa se encuentra en una sola dirección dentro del modelo; corte y el modelo deja de decir que no. El mismo conocimiento, la misma visión del mundo, sin esquivar.",
      finetuned:
        "Decensored fine-tunes (Dolphin, Venice Uncensored): retrained on data that drops refusals. La misma idea, método diferente.",
      ownWorldview:
        "Propio panorama mundial: {{ownModel}} está entrenado en libros y documentos prohibidos desde Internet corriente. No sólo deja de negarse, argumenta que toma los modelos principales no te darán.",
      filtered:
        'Filtrado: modelos y aplicaciones principales como Personaje. AI. Una capa de seguridad decide antes de escribir. En la mayoría de las plataformas "sin censura", los modelos principales mantienen los filtros de su proveedor también.',
      tradeoff:
        "La compensación: el propio informe de abliteración midió una caída de calidad en cada punto de referencia, parcialmente recuperada por entrenamiento extra. Los modelos no censurados son generalmente más pequeños que los modelos fronterizos. Úsalos por lo que bloquea el filtro, no por tu razonamiento más difícil.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Cada plataforma, en detalle",
      intro:
        "Lo que es, lo que cuesta, cómo se filtra, dónde van tus chats y sus fuentes. Chequeado {{date}}.",
      price: "Precio: {{plans}}. {{note}}",
      models: "Modelos: {{text}}",
      filter: "Filtro y consentimiento: {{text}}",
      privacy: "Privacidad: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Medios: {{text}}",
      open: "Fuente abierta: {{text}}",
      forWho: "Construido para: {{text}}",
      strengths: "Fuerza",
      limits: "Límites",
      sources: "Fuentes comprobadas {{date}}",
    },
    upstream:
      "{{appName}} ejecuta modelos {{models}} a través de {{name}} 's API ({{uncensored}} de ellos sin censura), incluyendo {{examples}}. Mis mismos modelos, nuestra charla, nuestra facturación.",
    us: {
      title: "Donde {{appName}} encaja, honestamente",
      intro:
        "No somos un laboratorio modelo. Somos el chat que pone todo tipo de modelo en un solo lugar y te permite elegir el filtro.",
      models:
        "Modelos de chat {{modelCount}} de laboratorios {{labCount}}: {{mainstream}} mainstream, {{open}} open, {{uncensored}} uncensored. Escoge el modelo por mensaje, por lo que un hilo puede mezclar Claude y un modelo abliterado.",
      upstream:
        "Nuestros modelos no censurados provienen de proveedores en esta página. Venice sirve {{veniceModels}} de nuestros modelos, NanoGPT {{nanoGptModels}}, uncensored.ai {{uncensoredAiModels}}, FreedomGPT {{freedomGptModels}}, Gab AI {{gabAiModels}}. Agregamos, no entrenamos.",
      consent:
        "Los modelos sin censura se desbloquean después de una confirmación única de 18+. No hay capa de rechazo encima. Los humanos deciden lo que leen, no una corporación.",
      privacy:
        "Incognito chats en vivo en su navegador, no en nuestros servidores, y no necesita ninguna cuenta. Chats privados sincronizan a su cuenta. Cada mensaje todavía pasa a través de nosotros al proveedor que lo responde.",
      pricing:
        "{{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta. Planes: {{planList}} al mes. Recarga un plan activo con paquetes de créditos que nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
      api: "OpenAI y Anthropic compatibles con API para chat, imágenes, vídeo y discurso, después de cualquier plan (de {{apiSubPrice}}) o una compra de crédito.",
      media:
        "Imagen {{imageModels}}, video {{videoModels}}, música {{musicModels}} y modelos de voz {{voiceModels}} en el mismo saldo.",
      open: "Toda la plataforma es de código abierto. Si quieres que no sea intermediario.",
      weakTitle: "Donde no somos el mejor elegido",
      weak1:
        "Precio por ficha: añadimos {{markup}} % a costes de proveedor. Si sólo desea modelos de un proveedor, ir directo a Venice o NanoGPT es más barato.",
      weak2:
        "Biblioteca de caracteres: Janitor AI y Personaje. AI tiene millones de bots comunitarios. El nuestro es mucho más pequeño, aunque usted puede importar caracteres de Caracter. AI y enlaces Talkie.",
      weak3:
        "Caracteristicas de companión: no selfies ni videollamadas en vivo como Kindroid o Nomi. Somos un espacio de trabajo de chat, no una aplicación de acompañante.",
      weak4:
        "Privacidad total: un modelo local en su propia máquina golpea cualquier servicio alojado, nosotros incluidos.",
      modelsLink: "Ver todos los modelos {{modelCount}} con precios en vivo",
      pricingLink: "Planes y créditos gratuitos",
      guideLink: "Guía: todo modelo sin censura y lo que es bueno en",
    },
    versus: {
      title: "Comparaciones de cabeza a cabeza",
      intro:
        "Las {{versusCount}} plataformas con las que más nos comparan, cada una en su propia página con pros, contras y una recomendación clara.",
    },
    method: {
      title: "Cómo comparamos",
      intro: "Reglas a las que nos mantuvimos. Chequeado {{date}}.",
      sources:
        "Páginas oficiales solamente: página de precios de cada plataforma, términos, política de privacidad, centro de ayuda, docs API o lista de modelos. Los sitios de revisión nunca fueron una fuente.",
      prices:
        "Los precios son los precios de la lista USD como se muestra en el día. Donde un precio se sienta detrás de un login, usamos la lista oficial de tiendas de aplicaciones de la plataforma y lo decimos.",
      noScores:
        "Sin puntuaciones, sin calificaciones, sin insignia ganadora. Los diferentes trabajos necesitan plataformas diferentes.",
      us: "Nuestros propios números (modelos, precios, créditos gratis) se leen en vivo desde el config que te factura, por lo que no pueden derivar de lo que pagas.",
      bias: "Somos un competidor y un cliente de varias plataformas aquí. Decimos dónde nos dirigimos a ellos y enumeramos los casos en los que deberías elegir a alguien más.",
      changes:
        "Los planes y las políticas cambian. Cada tarjeta vincula sus fuentes: compruebe antes de comprar. Donde una página no dijo algo, lo dejamos fuera en lugar de adivinar.",
      corrections:
        "¿Encontró un precio anticuado o una reclamación equivocada? Cuéntanos con un enlace a la fuente y lo arreglamos.",
      correctionsLink: "Contacta con nosotros",
    },
    faq: {
      title: "FAQ",
      best: {
        q: "¿Cuál es el mejor AI sin censura?",
        a: "Depende del trabajo. Para muchos modelos más medios en un chat: {{appName}}. Para la primera charla de privacidad: Venice o NanoGPT. Para el rol comunitario: Janitor AI o SillyTavern. Para un compañero: Kindroid o Nomi. Para la privacidad total: un modelo local con Ollama o LM Studio.",
      },
      free: {
        q: "¿Hay un AI libre sin censura?",
        a: "Sí, con límites. Venice da 10 avisos de texto al día, respuestas uncensored.ai 3, Janitor AI chat ilimitado en su propio modelo, CrushOn 100 créditos al mes, {{appName}} {{guestCredits}} créditos al mes sin cuenta. Los modelos locales con Ollama o LM Studio no cuestan nada por mensaje.",
      },
      private: {
        q: "¿Cuál AI sin censura es el más privado?",
        a: "Un modelo local: nada deja tu máquina. Entre los servicios hospedados, Venice y NanoGPT mantienen la historia en su navegador por defecto y NanoGPT no necesita ninguna cuenta. En {{appName}}, los chats de incognito permanecen en su navegador. Cada servicio hospedado todavía envía su mensaje a un proveedor de modelos.",
      },
      difference: {
        q: "¿Cuál es la diferencia entre los modelos abliterados y no censurados?",
        a: "Los modelos abliterados son modelos dominantes o abiertos con la dirección de rechazo cortada de los pesos: el mismo conocimiento, la misma cosmovisión, sin rechazos. Los estudios finos como el delfín llegan por reentrenamiento. {{ownModel}} es diferente de nuevo: entrenados en libros y documentos prohibidos desde Internet corriente, con sus propias tomas.",
      },
      veniceVs: {
        q: "¿Venice AI funciona realmente sin censura?",
        a: "Sus modelos no censurados son, y su filtro maduro está encendido por defecto hasta que un suscriptor Pro lo apague. Sus modelos principales (Claude, GPT, Gemini) mantienen sus propios filtros de proveedores, como en cualquier otro lugar.",
      },
      characterAi: {
        q: "¿Hay un personaje. AI sin filtro?",
        a: "AI : dice que el contenido pornográfico nunca será soportado. Alternativas con juego de roles para adultos: Janitor AI (Bots sin compromiso), CrushOn (Interruptor sin filtro), Kindroid, SillyTavern con un modelo no censurado, o {{appName}} con modelos de jugabilidad sin censura.",
      },
      gabAi: {
        q: "¿Gab AI es una IA sin censura?",
        a: "En política, cultura y fe, sí: su modelo propio, Arya, está hecho para eso. En contenido adulto, no: sus términos prohíben el contenido sexual explícito. {{appName}} también ofrece Arya, junto a modelos sin censura que permiten ficción para adultos.",
      },
      uncensoredAi: {
        q: "¿Qué diferencia a uncensored.ai de otras IA sin censura?",
        a: "La mayoría de las IA sin censura son modelos convencionales a los que se les han quitado los rechazos. El modelo de uncensored.ai está entrenado con libros y documentos prohibidos en el internet convencional, así que sus opiniones políticas van contra la corriente dominante. En {{appName}} funciona como {{ownModel}}.",
      },
      openRouter: {
        q: "¿OpenRouter tiene modelos sin censura?",
        a: "Pocos: Venice Uncensored y fine-tunes de rol como Hermes 4 y Magnum, y 142 de sus 474 modelos están marcados como moderados. Si buscas más modelos sin censura en una sola API, NanoGPT, Venice y {{appName}} ofrecen muchos más.",
      },
      local: {
        q: "¿Puedo ejecutar un AI sin censura en mi propio ordenador?",
        a: "Sí. Ollama o LM Studio además de un modelo abliterado o Dolphin. Un modelo 8B es una descarga de 5 GB y funciona en un portátil típico. Un modelo de 70B necesita más de 40 GB de memoria. La calidad está cubierta por su hardware.",
      },
      legal: {
        q: "¿Es legal usar un AI sin censura?",
        a: "Usar uno es legal en la mayoría de los países. Lo que generas y publicas todavía está vinculado por la ley donde vives. Todas las plataformas prohíben contenidos que involucran a menores y la mayoría prohíben imágenes no consentidas de personas reales.",
      },
    },
    cta: {
      title: "Pruébalo en tus propios avisos",
      subtitle:
        "Créditos gratis {{guestCredits}} al mes, sin cuenta. Haga la pregunta que se rechazó en otro lugar y compare.",
      try: "Iniciar un chat de incógnito",
      models: "Examine todos los modelos",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "{{appName}} vs Venice AI : Comparación de Honest 2026",
        description:
          "{{appName}} vs Venice.ai : precios, modelos sin censura, filtro maduro, privacidad y API lado a lado. Compramos desde Venice, así que decimos exactamente dónde gana cada uno.",
        keywords:
          "Venice AI alternativa, Venice.ai vs, Venice AI examen, Venice AI precios, Venice Pro, Venice sin censura, es Venice AI sin censura, Venice AI filtro maduro, Venice AI API, VVV DIEM, sin censura AI chat, {{appName}} vs Venice",
      },
      hero: {
        title: "{{appName}} vs Venice AI",
        subtitle:
          "Dos plataformas AI sin censura, una de las cuales compra de la otra. Precios, filtros, privacidad y API, lado a lado.",
        readTime: "7 min leer",
      },
      intro: {
        lead: "Venice es el nombre más conocido en AI privado, sin censura. Muchos de nuestros modelos sin censura funcionan en Venice 's API. Así que esto no es un desembolso. Es la respuesta honesta a una pregunta: ¿debería utilizar Venice directamente, o a través de {{appName}}?",
        p2: "Datos Venice de sus propias páginas de precios, privacidad y docs, comprobó {{date}}. La nuestra lee en vivo desde nuestro config.",
      },
      relation:
        "Somos un cliente Venice: {{veniceModels}} de nuestros modelos corren a través de Venice 's API ({{veniceUncensored}} de ellos sin censura), incluyendo {{veniceExamples}}. Mis mismos modelos, diferentes aplicaciones a su alrededor.",
      verdict:
        "Elija Venice si desea su catálogo completo, solo local y el precio más barato por cuenta propia, y usted está bien pagando por Pro para dejar caer el filtro maduro. Elija {{appName}} si desea que Venice 's modelos sin censura junto a Claude, GPT, uncensored.ai 's modelo y GLM abliterated y DeepSeek construye de otros proveedores, en un chat, sin filtro para desbloquear más allá de una confirmación de 18+ de una sola vez.",
      themPros: {
        a: "Catálogo más grande: 420 modelos en sus docs, incluyendo vídeo, música y voz.",
        b: "La historia se mantiene en el dispositivo por defecto. Fuerte historia de privacidad.",
        c: "La forma más barata de llamar Venice 's propios modelos: no middleman markup, además de DIEM stake para el crédito diario API.",
      },
      themCons: {
        a: "Tier gratis: 10 mensajes de texto al día, modelos base solamente.",
        b: "El filtro maduro está encendido por defecto. Apagarlo necesita Pro.",
        c: "Sólo Venice 's lineup: no uncensored.ai modelo, no hay modelos de proveedores Venice no es el anfitrión.",
      },
      usPros: {
        a: "Venice 's modelos sin censura más modelos sin censura de NanoGPT, uncensored.ai, FreedomGPT y Gab AI en un selector modelo.",
        b: "Ningún filtro maduro para comprar su salida de: una confirmación de 18+ de una sola vez desbloquea cada modelo sin censura, incluso en el nivel libre.",
        c: "{{guestCredits}} créditos gratis por mes sin cuenta, y toda la plataforma es de código abierto.",
      },
      usCons: {
        a: "En los propios modelos de Venice cuestamos más: nuestra marca {{markup}} % se encuentra en la parte superior del precio de Venice.",
        b: "catálogo más pequeño que Venice en general.",
        c: "Los chats privados se almacenan en nuestros servidores. Sólo los chats incognito permanecen en su navegador, mientras que Venice mantiene toda la historia local.",
      },
      chooseThem: {
        a: "Quiere el catálogo sin censura más grande de un solo proveedor.",
        b: "Sostienes o quieres apostar VVV por el crédito API.",
        c: "Usted llama los modelos de Venice vía API y cada centavo por token importa.",
      },
      chooseUs: {
        a: "Usted quiere modelos Venice no lleva, como {{ownModel}}, en el mismo chat.",
        b: "Quieres sin censura sin pagar un plan para eliminar un filtro.",
        c: "Usted desea código abierto, software auto-hostable y un saldo para chat, imágenes, vídeo y música.",
      },
      both: "Usar ambos es normal. Venice para su catálogo, {{appName}} cuando desea comparar la respuesta de Venice contra el modelo sin censura de otro proveedor en el mismo hilo.",
      switch: {
        title: "Cambio de Venice",
        body: "Nada que migrar para los modelos: Venice Uncensored y los otros modelos Venice están en nuestro selector bajo los mismos nombres. Comience un chat de incógnito, elija un modelo Venice y continúe donde se fue. Pruebe el viejo contexto en el primer mensaje si lo necesita.",
      },
      faq: {
        q1: {
          q: "¿Es {{appName}} igual que Venice?",
          a: "No. Somos una plataforma independiente de código abierto. Algunos de nuestros modelos funcionan en Venice 's API, otros vienen de NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter y los grandes laboratorios.",
        },
        q2: {
          q: "¿Está libre Venice AI?",
          a: "Venice tiene un nivel libre con 10 mensajes de texto y 15 indicaciones de imagen al día sobre modelos base. Pro elimina los límites y le permite apagar el filtro maduro.",
        },
        q3: {
          q: "¿Es Venice más barato que {{appName}}?",
          a: "Para los propios modelos de Venice, sí: añadimos {{markup}} % a los costes del proveedor. Para mezclar modelos a través de proveedores en una aplicación, le ahorramos suscripciones separadas.",
        },
        q4: {
          q: "¿Qué es más privado, Venice o {{appName}}?",
          a: "Venice mantiene toda la historia en su dispositivo. En {{appName}}, los chats incognito hacen lo mismo; los chats privados se almacenan en nuestros servidores para sincronizar entre dispositivos. En ambos casos, su mensaje va a un proveedor de modelos para obtener una respuesta.",
        },
      },
      cta: { title: "Prueba los modelos de Venice junto a todo lo demás" },
    },
    characterAi: {
      meta: {
        title:
          "Carácter. AI Alternativa Sin Filtro: {{appName}} vs Personaje. AI",
        description:
          "{{appName}} vs Personaje. AI : filtros, cheques de edad, modelos, privacidad y precio. Cuando Caracter. AI es la llamada correcta, y cuando usted necesita una alternativa sin censura.",
        keywords:
          "Cara AI alternativa, carácter AI alternativa sin filtro, Personaje.AI Filtro, c.ai+ precio, carácter AI NSFW, Personaje AI verificación de edad, carácter no censurado AI, AI juego de roles sin filtro, {{appName}} vs Personaje.AI",
      },
      hero: {
        title: "{{appName}} vs Personaje. AI : la alternativa sin filtro",
        subtitle:
          "La plataforma de chat de carácter más grande contra una abierta, sin censura. Lo que cada uno permite, lo que cuesta, donde van tus chats.",
        readTime: "7 min leer",
      },
      intro: {
        lead: "Caracter. AI tiene la biblioteca de caracteres más grande en Internet y un filtro que no se moverá. Su propio centro de ayuda dice que el contenido pornográfico no se apoyará en ningún momento del futuro. Si eso es un negociador, necesitas una plataforma diferente, no un irrumpido.",
        p2: "Caracter. Datos AI de su suscripción, centro de ayuda y páginas de privacidad, chequeado {{date}}. La nuestra lee en vivo desde nuestro config.",
      },
      relation:
        "No hay relación de negocios con el personaje. AI. Puede traer un personaje sobre: pegar su carácter. AI link y {{appName}} lo importa como una habilidad.",
      verdict:
        "Personaje de Pick. AI para diversión segura por trabajo con millones de personajes listos, libres e ilimitadas, o para cualquier persona menor de 18. Elija {{appName}} si el filtro sigue rompiendo su historia: modelos de juego de roles sin censura después de una confirmación única de 18+, elección de modelo por mensaje, y chats que no se utilizan para entrenar los modelos de nadie.",
      themPros: {
        a: "Millones de personajes comunitarios, listos para charlar.",
        b: "Mensajes libres ilimitados, tijeras pagadas baratas.",
        c: "Llamadas de voz con personajes.",
      },
      themCons: {
        a: "Ningún contenido adulto, nunca y escenas oscuras se suavizan.",
        b: "Su política de privacidad permite el entrenamiento sobre su información y anuncios personalizados.",
        c: "Sólo sus propios modelos. No hay elección, no hay propia llave.",
      },
      usPros: {
        a: "{{uncensored}} modelos sin censura, varios construidos para el juego de roles. Escenas van donde va la historia.",
        b: "Escoge el modelo por mensaje: un modelo de juego de roles sin censura para la escena, un modelo de frontera para la planificación.",
        c: "Los chats Incognito permanecen en su navegador. No entrenamos modelos en tus chats.",
      },
      usCons: {
        a: "Mucho menos caracteres listos. Importa o escribe el suyo.",
        b: "Créditos medidos en lugar de mensajes libres ilimitados.",
        c: "No hay llamadas de voz con personajes.",
      },
      chooseThem: {
        a: "Quieres un chat seguro por trabajo con una biblioteca de caracteres gigante.",
        b: "Tienes menos de 18 años o estableces una cuenta de adolescente.",
        c: "Quieres mensajes gratis ilimitados y nunca piensas en el costo.",
      },
      chooseUs: {
        a: "El filtro sigue rompiendo tu juego de roles.",
        b: "Quieres elegir el modelo, no conseguir uno asignado.",
        c: "Quieres que tus chats se mantengan fuera del entrenamiento y de los anuncios.",
      },
      both: "Mucha gente mantiene el personaje. AI para charlas ligeras y mueve las historias que necesitan un modelo adulto aquí, utilizando la importación para llevar el personaje.",
      switch: {
        title: "Moving a character from Character. AI",
        body: "Copiar el carácter del personaje. El enlace AI, pegarlo en la importación de habilidad en {{appName}}, y el nombre, saludo y definición vienen donde el personaje los hace públicos. Luego elige un modelo de juego de roles sin censura y continúa la historia.",
      },
      faq: {
        q1: {
          q: "¿Personal. AI permite NSFW?",
          a: "No. Su centro de ayuda dice que el contenido pornográfico está en contra de sus términos y no será apoyado en ningún momento en el futuro.",
        },
        q2: {
          q: "¿El carácter. AI requiere verificación de edad?",
          a: "Sí. Los usuarios pasan por la seguridad de edad con Persona. Los usuarios verificados como menos de 18 reciben el modo de lectura solamente, sin chat.",
        },
        q3: {
          q: "¿Es {{appName}} un Personaje. Sustituto AI sin filtro?",
          a: "Sí para adultos. Los modelos sin censura se desbloquean después de una confirmación de 18+ única, y varios se construyen para el juego de roles. Los modelos de corriente principal mantienen los filtros de sus proveedores, así que elige uno sin censura para escenas adultas.",
        },
        q4: {
          q: "¿Puedo importar mi carácter?AI ¿Caracteres?",
          a: "Sí: pega el enlace del personaje en la importación de habilidades. Lo que viene depende de lo que el creador hizo público sobre el personaje. AI.",
        },
      },
      cta: { title: "Continue la historia sin el filtro" },
    },
    janitorAi: {
      meta: {
        title: "Janitor AI Alternativa: {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI : JLLM vs {{modelCount}} modelos, límites de contexto, reglas NSFW, proxies, privacidad y precio. Pros y contras honestos para el juego de roles.",
        keywords:
          "Janitor AI alternativa, Janitor AI vs, JanitorAI, precio de conserje+, JLLM, Janitor AI Proxy, Janitor AI OpenRouter, Janitor AI limite de contexto, NSFW AI juego de roles, juego de roles sin censura AI, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "La comunidad de juegos gratis más grande contra un chat sin censura multimodelo. Modelos, memoria, reglas, precio.",
        readTime: "6 min leer",
      },
      intro: {
        lead: "Janitor AI ganó el juego de roles en dos cosas: millones de bots comunitarios y un modelo libre. La captura aparece en largas historias. El contexto libre se encuentra alrededor de 9K tokens, y los mejores modelos significan establecer un proxy con su propia llave.",
        p2: "Janitor AI hechos de su página janitor+, centro de ayuda y políticas, comprobó {{date}}. La nuestra lee en vivo desde nuestro config.",
      },
      relation:
        "No hay relación de negocios con Janitor AI. Diferentes formas: Janitor es una biblioteca de caracteres con un modelo libre, somos una biblioteca modelo con personajes.",
      verdict:
        "Elija Janitor AI para la biblioteca de bots y chat ilimitado gratuito en JLLM. Elija {{appName}} si desea modelos fuertes sin censura con largo contexto listo para ir, sin configuración de proxy, e imágenes, video y voz en el mismo chat.",
      themPros: {
        a: "Millones de bots comunitarios, con etiquetas ilimitadas para NSFW.",
        b: "Chat ilimitado libre en su propio modelo.",
        c: "Traiga su propio modelo a través de un proxy, OpenRouter incluido.",
      },
      themCons: {
        a: "Alrededor de 9K fichas de contexto libre: largas campañas olvidan.",
        b: "Mejores modelos necesitan janitor+ Router o su propia tecla API y configuración proxy.",
        c: "Solo texto, y la aplicación móvil comienza en modo seguro.",
      },
      usPros: {
        a: "Modelos {{modelCount}} en el selector, {{uncensored}} sin censura, sin proxy o clave para configurar.",
        b: "Modelos sin censura a largo plazo para campañas que se ejecutan durante semanas.",
        c: "Imágenes, vídeo, música y voz del mismo chat y saldo.",
      },
      usCons: {
        a: "Una pequeña biblioteca de personajes junto a Janitor.",
        b: "No ilimitada tarifa gratuita: {{guestCredits}} créditos gratis al mes, luego un plan.",
        c: "Menos de una comunidad: no hay alimento público.",
      },
      chooseThem: {
        a: "Quieres navegar por miles de bots listos.",
        b: "Usted quiere chat ilimitado gratuito y el modelo libre es lo suficientemente bueno.",
        c: "Ya tienes tu propia llave a través de un proxy y te gusta.",
      },
      chooseUs: {
        a: "Las historias largas necesitan un contexto largo y un modelo fuerte sin censura.",
        b: "Usted quiere cambiar modelos de escena media sin tocar la configuración del proxy.",
        c: "Quieres imágenes o voz para tus personajes en el mismo lugar.",
      },
      both: "Configuración común: descubrir caracteres en Janitor AI, ejecutar las largas campañas en {{appName}}.",
      switch: {
        title: "Moving from Janitor AI",
        body: "Cree una habilidad en {{appName}} con la personalidad, escenario y saludo de su personaje, luego elija un modelo de juego de roles sin censura. Los chats Incognito no necesitan cuenta, así que puedes probar una escena antes de registrarse.",
      },
      faq: {
        q1: {
          q: "¿Está Janitor AI libre?",
          a: "Sí: chats ilimitados en su propio modelo con cerca de 9K fichas de contexto. janitor+ añade más memoria, velocidad y modelos.",
        },
        q2: {
          q: "¿Janitor AI permite NSFW?",
          a: "Sí para adultos en bots etiquetados Limitless, en la web. La aplicación móvil comienza en modo seguro hasta que habilita NSFW en la configuración web.",
        },
        q3: {
          q: "¿Necesito un proxy en {{appName}}?",
          a: "No. Cada modelo está en el picker. Usted paga créditos por mensaje, sin necesidad de llave API.",
        },
        q4: {
          q: "¿Qué tiene mejor memoria para un largo juego de roles?",
          a: "El modelo libre de Janitor tiene alrededor de 9K fichas de contexto; janitor+ levanta la memoria del personaje. En {{appName}}, el contexto depende del modelo que elijas, y muchos modelos de juego de roles tienen mucho más.",
        },
      },
      cta: {
        title: "Ejecute su próxima campaña en un modelo de largo contexto",
      },
    },
    nanoGpt: {
      meta: {
        title: "{{appName}} vs NanoGPT: Comparación honesta 2026",
        description:
          "{{appName}} vs NanoGPT: pay-as-you-go vs planes, modelos no censurados y abliterados, privacidad, API y medios de comunicación. Compramos de NanoGPT y decimos dónde gana.",
        keywords:
          "NanoGPT alternativa, NanoGPT vs, nano-gpt review, precio NanoGPT, NanoGPT PRO, NanoGPT sin censura, modelos abliterados API, pagar como usted va AI, AI sin censura API, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Dos plataformas multimodelo con modelos sin censura y un API. Un pago como tú, un plan basado. Uno se vende al otro.",
        readTime: "6 min leer",
      },
      intro: {
        lead: "NanoGPT es la alternativa a las suscripciones de IA con pago por uso. Recarga diez centavos y usa cualquier modelo sin cuenta. Varios de nuestros modelos sin censura funcionan con su API. Elige según cómo uses la IA.",
        p2: "Datos NanoGPT de sus páginas de precios, privacidad y términos y su lista de modelos públicos, comprobó {{date}}. La nuestra lee en vivo desde nuestro config.",
      },
      relation:
        "Somos un cliente de NanoGPT: {{nanoGptModels}} de nuestros modelos corren a través del API de NanoGPT ({{nanoGptUncensored}} de ellos sin censura), incluyendo {{nanoGptExamples}}.",
      verdict:
        "Elija NanoGPT para el catálogo más amplio a precios de lista, pago por uso sin cuenta, y un API para todo. Elija {{appName}} si desea un selector de modelos curado y probado con modelos no censurados de varios proveedores, créditos mensuales gratuitos, habilidades y memoria, y una aplicación de código abierto que puede albergar a uno mismo.",
      themPros: {
        a: "631 modelos de texto en su API, alrededor de 39 no censurados o abliterados.",
        b: "Sin cuenta, sin suscripción: comienza desde diez centavos en cripto.",
        c: "Lista de precios en modelos auto-rutados, más barato que cualquier intermediario.",
      },
      themCons: {
        a: "El tier libre es un modelo en la web.",
        b: "La privacidad depende de la ruta del proveedor; algunas rutas permiten el entrenamiento.",
        c: "Un catálogo que significa que haces las pruebas tú mismo.",
      },
      usPros: {
        a: "Un recolector curado: cada modelo etiquetado estándar, abierto o no censurado, con una página y un precio en vivo.",
        b: "{{guestCredits}} créditos gratis al mes, lo suficiente para probar modelos no censurados en sus propios avisos.",
        c: "Habilidades, memoria, carpetas y un chat construido para el trabajo largo, fuente abierta y auto-hostable.",
      },
      usCons: {
        a: "Menos modelos que NanoGPT.",
        b: "Añadimos {{markup}} % a los costes del proveedor, por lo que el mismo modelo cuesta más aquí.",
        c: "Necesitas un plan activo para recargar con paquetes de créditos.",
      },
      chooseThem: {
        a: "Quieres pagar por uso sin suscripción y sin cuenta.",
        b: "Necesitas un modelo oscuro sólo un enorme catálogo lleva.",
        c: "Usted construye en el API y desea precios de lista.",
      },
      chooseUs: {
        a: "Quieres una lista corta probada en lugar de 631 opciones.",
        b: "Quieres créditos mensuales gratuitos y un chat pulido con habilidades y memoria.",
        c: "Quieres modelos de uncensored.ai y los modelos de Venice junto a NanoGPT en un solo hilo.",
      },
      both: "Los desarrolladores utilizan a menudo API de NanoGPT para trabajos de lotes y {{appName}} como su chat diario.",
      switch: {
        title: "Cambiar de NanoGPT",
        body: "Los modelos NanoGPT-merecidos en nuestro picker, como {{nanoGptExamples}}, son los mismos modelos. Comience un chat de incognito, elija una y compare respuestas con un modelo de otro proveedor en el mismo hilo.",
      },
      faq: {
        q1: {
          q: "¿Es NanoGPT más barato que {{appName}}?",
          a: "Per token, usualmente sí: NanoGPT cobra precios de lista y añadimos {{markup}} %. Le damos créditos gratis a {{guestCredits}} al mes y una aplicación para cada proveedor.",
        },
        q2: {
          q: "¿NinoGPT necesita una cuenta?",
          a: "No. Funciona con un usuario generado ID y mantiene chats en su navegador por defecto.",
        },
        q3: {
          q: "¿Los dos tienen un API?",
          a: "Sí. El API de NanoGPT es OpenAI y Anthropic compatible con pagos sin cuenta. El nuestro es OpenAI y Anthropic compatibles y se desbloquea después de una compra de plan o crédito.",
        },
        q4: {
          q: "¿Qué tiene modelos más sin censura?",
          a: "NanoGPT lista más en total. {{appName}} tiene {{uncensored}}, elegido y probado, de NanoGPT, Venice, uncensored.ai, FreedomGPT y Gab AI.",
        },
      },
      cta: { title: "Compare los modelos de NanoGPT con los demás" },
    },
    freedomGpt: {
      meta: {
        title: "FreedomGPT Alternative: {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} vs FreedomGPT: Modelos libres de libertad y censura, reglas de contenido, privacidad, créditos, API y código abierto. Datos con fuentes, ambos lados.",
        keywords:
          "FreedomGPT alternativa, FreedomGPT vs, FreedomGPT revisión, FreedomGPT pricing, FreedomGPT Pro, modelo Liberty, FreedomGPT sin censura, AI sin censura, alternativa ChatGPT sin censura, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Dos aplicaciones que ponen modelos libres de censura junto a ChatGPT, Claude y Gemini. Reglas, privacidad, créditos, código abierto.",
        readTime: "6 min leer",
      },
      intro: {
        lead: "FreedomGPT y {{appName}} comparten una idea: modelos estándar y sin censura en una lista. Las diferencias están en las reglas, los créditos y lo que le sucede a sus mensajes.",
        p2: "FreedomGPT hechos de su página web, precios, política de privacidad, docs y GitHub, chequeado {{date}}. La nuestra lee en vivo desde nuestro config.",
      },
      relation:
        "Somos un cliente de FreedomGPT: {{freedomGptExamples}} se ejecuta en {{appName}} a través del API de FreedomGPT.",
      verdict:
        "Elija FreedomGPT por un plan de $20 que cubre chat, imágenes y vídeo con un inicio libre y sin cuenta. Elija {{appName}} si desea modelos más no censurados de varios proveedores, ninguna cláusula de uso ético encima de la ley, los precios por modelo publicados y una plataforma de código abierto que se desarrolla activamente.",
      themPros: {
        a: "Libre sin tarjeta o cuenta.",
        b: "Libertad y otros modelos libres de censura junto a ChatGPT, Claude y Gemini.",
        c: "Generación de imágenes y vídeos en el mismo plan.",
      },
      themCons: {
        a: "Los modelos deben seguir la ley US y no pueden ser utilizados para fines no éticos, por sus reglas.",
        b: "Los mensajes, la voz y las imágenes se dirigen a proveedores de terceros; no se establece un período de retención.",
        c: "La aplicación de escritorio de código abierto no se ha actualizado desde junio de 2024.",
      },
      usPros: {
        a: "{{uncensored}} modelos sin censura de cinco proveedores, Liberty incluido.",
        b: "Cada modelo tiene una página pública con su precio en vivo por mensaje.",
        c: "Toda la plataforma es de código abierto y se desarrolla activamente. Sírvelo.",
      },
      usCons: {
        a: "No hay plan todo-en plano: los créditos se miden por modelo.",
        b: "Cuenta necesaria para la memoria y chats sincronizados.",
        c: "Nuestra marca {{markup}} % se aplica también a los modelos de FreedomGPT.",
      },
      chooseThem: {
        a: "Quieres un simple plan de $20 para chat, imágenes y vídeo.",
        b: "Sólo necesitas Liberty y los modelos principales.",
        c: "Usted quiere una aplicación de escritorio sin conexión y la versión 2024 está bien.",
      },
      chooseUs: {
        a: "Usted quiere más opción sin censura: Venice, NanoGPT, uncensored.ai y Gab modelos también.",
        b: "Quieres ver el precio por mensaje antes de enviarlo.",
        c: "Usted quiere un software de código abierto actual y auto-hostable.",
      },
      both: "FreedomGPT's Liberty está en nuestro picker, así que puedes probarlo contra otros modelos sin censura sin una segunda suscripción.",
      switch: {
        title: "Cambiar de FreedomGPT",
        body: "Escoge Liberty en nuestro modelo y sigue adelante. Entonces pruebe el mismo aviso en {{ownModel}} o un modelo abliterado y mantenga cualquier respuesta mejor.",
      },
      faq: {
        q1: {
          q: "¿FreedomGPT funciona realmente sin censura?",
          a: "Sus modelos libres de censores dejan caer la mayoría de las rehusaciones, pero FreedomGPT dice que cada modelo que acoge debe seguir la ley US y no puede ser utilizado para fines no éticos, y una etiqueta sin censura no garantiza que cada solicitud sea contestada.",
        },
        q2: {
          q: "¿Cuánto cuesta FreedomGPT?",
          a: "Es libre de empezar. Pro incluye 2.200 créditos al mes; una respuesta premium cuesta alrededor de 10, una imagen sobre 25 y un vídeo de 5 segundos sobre 400.",
        },
        q3: {
          q: "¿Libertad es fuente abierta?",
          a: "Su aplicación de escritorio más antigua para los modelos offline es de código abierto (GPL-3.0) en GitHub, última actualización en junio de 2024. La aplicación de la nube no lo es. {{appName}} es fuente abierta en su conjunto.",
        },
        q4: {
          q: "¿Puedo usar el modelo Liberty de FreedomGPT en {{appName}}?",
          a: "Sí. Corre a través de la API de FreedomGPT y se sienta en nuestro picker junto a los otros modelos sin censura.",
        },
      },
      cta: { title: "Compara Liberty con los demás modelos sin censura" },
    },
    gabAi: {
      meta: {
        title: "Alternativa a Gab AI: {{appName}} vs Gab AI (2026)",
        description:
          "{{appName}} vs Gab AI: Arya, 214 modelos, la prohibición del contenido sexual, privacidad, créditos y API frente a frente. Compramos a Gab, así que decimos dónde gana cada uno.",
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
        p2: "Datos de uncensored.ai sacados de su página de precios, su página de API, su página de información y su política de privacidad, consultados el {{date}}. Los nuestros se leen en directo de nuestra configuración.",
      },
      relation:
        "Somos clientes de uncensored.ai: {{uncensoredAiExamples}} funciona en {{appName}} a través de la API de uncensored.ai. El mismo modelo, nuestro chat, nuestra facturación.",
      verdict:
        "Elige uncensored.ai si quieres chats ilimitados con este único modelo por un precio fijo de Pro bloqueado de por vida, además de su foro y su modo de voz. Elige {{appName}} si quieres {{ownModel}} junto a otros {{modelCount}} modelos, para que un mismo hilo contraste su postura con Claude, GPT o un modelo abliterado, con imágenes, vídeo y música en el mismo saldo.",
      themPros: {
        a: "Precio fijo: Pro cuesta $9.99 al mes o $99.99 al año, bloqueado de por vida mientras sigas suscrito.",
        b: "Chats ilimitados con el modelo por ese precio, más modo de voz, carpetas y archivos.",
        c: "Su política de privacidad dice que tus datos no se usan para entrenar ni mejorar modelos de IA.",
      },
      themCons: {
        a: "Lo gratis son 3 respuestas al día.",
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
          a: "Tiene un plan gratis con 3 respuestas al día. Pro cuesta $9.99 al mes o $99.99 al año y quita el límite. En {{appName}}, {{guestCredits}} créditos gratis al mes funcionan sin cuenta.",
        },
        q3: {
          q: "¿Qué hace distinto al modelo de uncensored.ai?",
          a: "La mayoría de los modelos sin censura son modelos convencionales a los que se les han quitado los rechazos: el mismo entrenamiento, la misma visión del mundo. {{ownModel}} está entrenado con libros y documentos prohibidos en el internet convencional, así que sus opiniones políticas van contra la corriente dominante.",
        },
        q4: {
          q: "¿uncensored.ai tiene API?",
          a: "Sí: una API compatible con OpenAI a $0.05 por inferencia, con créditos que se compran aparte. En {{appName}} el mismo modelo se puede llamar desde nuestra API compatible con OpenAI y Anthropic después de cualquier plan o compra de créditos.",
        },
      },
      cta: { title: "Pon sus respuestas junto a las de cualquier otro modelo" },
    },
    openRouter: {
      meta: {
        title:
          "Alternativa a OpenRouter para chatear: {{appName}} vs OpenRouter",
        description:
          "{{appName}} vs OpenRouter: una app de chat lista para usar frente a un router de API para desarrolladores. Modelos sin censura, comisiones, privacidad y API frente a frente, con fuentes.",
        keywords:
          "alternativa a OpenRouter, OpenRouter alternative, OpenRouter vs, opinión OpenRouter, precio OpenRouter, comisiones OpenRouter, OpenRouter sin censura, OpenRouter uncensored, modelos sin censura OpenRouter, app de chat OpenRouter, modelos gratis OpenRouter, API compatible con OpenAI, API LLM sin censura, {{appName}} vs OpenRouter",
      },
      hero: {
        title: "{{appName}} vs OpenRouter",
        subtitle:
          "Un router para desarrolladores con 474 modelos frente a una app de chat con modelos sin censura de serie. Comisiones, filtros, privacidad y API.",
        readTime: "6 min de lectura",
      },
      intro: {
        lead: "OpenRouter es la respuesta por defecto cuando quieres una sola clave de API para cientos de modelos. Nosotros mismos lo usamos. Pero es un router para desarrolladores, no una app de chat, y su oferta sin censura es escasa. Si buscabas una alternativa a OpenRouter para chatear, esta es la comparación honesta.",
        p2: "Datos de OpenRouter sacados de su página de precios, su guía de recogida de datos, sus términos y su lista pública de modelos, consultados el {{date}}. Los nuestros se leen en directo de nuestra configuración.",
      },
      relation:
        "Somos clientes de OpenRouter: {{openRouterModels}} de nuestros modelos funcionan a través de la API de OpenRouter, entre ellos {{openRouterExamples}}. Nosotros añadimos el chat, la multimedia y los proveedores sin censura que OpenRouter no ofrece.",
      verdict:
        "Elige OpenRouter si eres desarrollador, quieres una sola clave para 474 modelos a precio de proveedor con enrutamiento de respaldo y pones tu propia interfaz. Elige {{appName}} si quieres un chat listo con {{uncensored}} modelos sin censura, incluidos {{ownModel}} y versiones abliteradas que OpenRouter no tiene, además de imágenes, vídeo y música, y una API cuando la necesites.",
      themPros: {
        a: "474 modelos en su lista pública, a precio de proveedor.",
        b: "Sin suscripción. Modelos gratis con 50 solicitudes al día, 1.000 después de comprar $10 en créditos.",
        c: "El registro de prompts y el uso de tus datos son opcionales: solo si los activas.",
      },
      themCons: {
        a: "Una comisión del 5,5 % sobre las compras de créditos en el plan estándar.",
        b: "Pocos modelos sin censura: Venice Uncensored más fine-tunes de rol como Hermes 4 y Magnum. 142 de sus 474 modelos están marcados como moderados.",
        c: "No está pensado como chat para el público: tú pones la interfaz.",
      },
      usPros: {
        a: "Un chat listo en el navegador: sin clave, sin configuración, {{guestCredits}} créditos gratis al mes sin cuenta.",
        b: "{{uncensored}} modelos sin censura de Venice, NanoGPT, uncensored.ai, FreedomGPT y Gab AI, desbloqueados con una única confirmación de mayoría de edad (18+).",
        c: "API compatible con OpenAI y Anthropic para chat, imágenes, vídeo y voz en el mismo saldo.",
      },
      usCons: {
        a: "Catálogo más pequeño: {{modelCount}} modelos de chat frente a los 474 de OpenRouter.",
        b: "Nuestro margen del {{markup}} % sobre el coste del proveedor supera la comisión del 5,5 % de OpenRouter.",
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
          a: "Sí. {{appName}} ofrece {{uncensored}} modelos sin censura de Venice, NanoGPT, uncensored.ai, FreedomGPT y Gab AI en un solo chat y una sola API. NanoGPT y Venice también venden modelos sin censura por API. OpenRouter solo tiene unos pocos.",
        },
        q2: {
          q: "¿OpenRouter permite contenido NSFW?",
          a: "Sus términos exigen ser mayor de 18 años y revisa las entradas en busca de CSAM conocido. Cada proveedor mantiene sus propias reglas, y 142 de los 474 modelos de su lista están marcados como moderados, así que si una solicitud pasa o no depende del modelo y del proveedor.",
        },
        q3: {
          q: "¿Cuánto cobra OpenRouter?",
          a: "El precio de lista del proveedor por token, más una comisión del 5,5 % sobre las compras de créditos en el plan estándar. No hay suscripción. Los modelos gratis permiten 50 solicitudes al día, 1.000 una vez que has comprado $10 en créditos.",
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
