import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modelos de IA abliterados y modelos sin censura",
    description:
      "Descubre qué cambia con la abliteración, en qué se distingue del ajuste fino y cómo comparar una variante abliterada con su modelo base.",
    category: "Guía de modelos",
    imageAlt: "Los tres tipos de modelos de IA sin censura",
    keywords:
      "IA abliterada y sin censura, qué es un modelo abliterado, abliteration, LLM abliterado, modelos de IA sin censura, ajuste fino sin censura, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de modelos",
    readTime: "8 min de lectura",
    title:
      "Qué distingue a los modelos abliterados de otros modelos sin censura",
    subtitle:
      "Descubre cómo el cambio de pesos puede influir en los rechazos, el estilo y la precisión. Compara la abliteración, el ajuste fino y el enfoque de {{ownName}}.",
  },
  intro: {
    lead: "Un LLM abliterado es un modelo de lenguaje cuyos pesos se han modificado para que rechace menos solicitudes. Parte de un modelo existente, así que puede conservar parte de sus conocimientos y su estilo.",
    p2: "«Sin censura» es una etiqueta más amplia. Abarca modelos abliterados, modelos ajustados para responder con más libertad y modelos entrenados para ofrecer otra perspectiva, como {{ownName}}.",
  },
  online: {
    title: "Prueba un modelo abliterado en línea",
    directoryLink: "Ver modelos abliterados para chatear en el navegador",
    guideLink: "Explora el chat de IA y los modelos sin censura",
    compare:
      "En {{appName}}, abre la ficha de un modelo para ver su ventana de contexto, sus funciones y el costo estimado antes de iniciar el chat. Si están disponibles ambas versiones, compara la abliterada con el modelo base.",
  },
  label: {
    title: "Por qué «sin censura» dice poco por sí solo",
    p1: "«Sin censura» describe la conducta: el modelo responde preguntas que antes rechazaba. La etiqueta no explica cómo llegó a hacerlo. Los proveedores la aplican a métodos distintos y los nombres de los modelos mezclan términos como «abliterated», «uncensored», «heretic» y «unfiltered».",
    p2: "El método determina qué cambia además de los rechazos. ¿También cambia el estilo de escritura? ¿El modelo tiene otra visión del mundo o simplemente está más dispuesto a expresarla? De eso depende cuál te conviene usar.",
  },
  methods: {
    title: "Los tres métodos",
    intro: "Del cambio más leve al más profundo.",
    abliterated: {
      title: "1. Abliteración: eliminar el rechazo de los pesos",
      how: "La abliteración modifica los pesos del modelo para reducir los rechazos aprendidos. Un estudio de 2024 identificó una dirección asociada con los rechazos en los modelos de chat que examinó. El efecto de eliminar esa señal varía según el modelo y la consulta.",
      keeps:
        "El estilo y los conocimientos del modelo base suelen seguir siendo reconocibles. Comprueba la precisión y el uso de herramientas en la versión que elijas.",
      changes:
        "Una variante abliterada puede responder a consultas que el modelo base rechaza. El resultado varía según el modelo y la consulta.",
    },
    fineTuned: {
      title: "2. Ajuste fino: entrenamiento adicional para responder",
      how: "Un ajuste fino para quitar la censura continúa el entrenamiento con ejemplos que premian las respuestas directas, como la ficción, el juego de rol y la conversación abierta. Dolphin, la base de Venice Uncensored, es un ejemplo conocido. Los modelos para juego de rol van más allá y se entrenan con relatos.",
      keeps:
        "Se conserva la mayor parte de los conocimientos del modelo base. Su visión del mundo sigue viniendo del entrenamiento original.",
      changes:
        "Cambian los rechazos y, a menudo, la voz. La escritura puede volverse más suelta, más viva o más repetitiva. La calidad depende por completo de los datos de entrenamiento.",
    },
    ownWorldview: {
      title:
        "3. Visión del mundo propia: materiales de entrenamiento distintos",
      how: "Los dos primeros métodos parten de un modelo convencional y le quitan los frenos. {{ownName}} toma otro camino. Se entrena con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias a la corriente dominante.",
      keeps:
        "El enfoque convencional no se conserva. El modelo no vuelve a una postura de consenso.",
      changes:
        "Cambian las propias respuestas. Pregunta sobre política y obtendrás posturas que los modelos convencionales no te darán, aunque se les quiten los filtros.",
    },
    callout:
      "El método indica qué cambió el desarrollador. Usa la comparación de abajo para ver qué diferencias importan en tus propias consultas.",
    sources: {
      paper:
        "Estudio: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "La abliteración paso a paso (blog de Hugging Face)",
    },
  },
  ours: {
    title: "Otros modelos sin censura",
    intro:
      "Los demás modelos sin censura de {{appName}} se agrupan según el método documentado por cada proveedor. Si el proveedor no lo publica, lo dejamos sin especificar.",
    abliterated: {
      title: "Modelos abliterados disponibles ({{count}})",
      body: "Para programar o hacer análisis, revisa si el modelo admite herramientas. Para conversaciones largas o ficción, compara las ventanas de contexto.",
    },
    fineTuned: {
      title: "Con ajuste fino ({{count}})",
      body: "Entrenados para responder, sobre todo en ficción y juego de rol. Su voz cambia respecto a la del modelo base.",
    },
    ownWorldview: {
      title: "Con visión del mundo propia ({{count}})",
      body: "Entrenados con libros y documentos prohibidos en el internet convencional. Para explorar política, posturas a contracorriente y ficción oscura.",
    },
    unlisted: {
      title: "Método sin publicar ({{count}})",
      body: "Son modelos sin censura y el proveedor no explica cómo se hicieron. Antes de confiar en ellos, pruébalos con los pasos de abajo.",
    },
  },
  pairs: {
    title: "Modelos base y variantes sin censura",
    intro:
      "Compara los modelos base y sus versiones sin censura por método, ventana de contexto y costo estimado por mensaje.",
    colBase: "Modelo base",
    colUncensored: "Versión sin censura",
    colMethod: "Método",
    colContext: "Contexto",
    colPrice: "Precio por mensaje",
    method: {
      abliterated: "Abliterado",
      fineTuned: "Con ajuste fino",
      ownWorldview: "Visión del mundo propia",
      unlisted: "Sin publicar",
    },
    price: "{{base}} frente a {{uncensored}}",
    ratio: "La versión sin censura cuesta {{ratio}} veces más",
    footnote:
      "Si el filtro no te estorba, el modelo base es la opción más económica.",
    compareLink: "Compara {{a}} con {{b}}",
  },
  test: {
    title: "Cómo distinguirlos en diez minutos",
    intro:
      "Olvídate del nombre. Envía las mismas tres solicitudes a dos modelos en un solo chat y fíjate en qué cambia.",
    steps: {
      refusal: {
        title: "La prueba del rechazo",
        body: "Usa una consulta inocua ante la que el modelo base vacile, como escribir una escena de ficción oscura. Compara qué tan directa es cada respuesta. Una respuesta por sí sola dice poco sobre el método utilizado.",
      },
      voice: {
        title: "La prueba de la voz",
        body: "Pídeles a los dos el mismo relato breve. Una versión abliterada escribe como el modelo base. Una versión con ajuste fino tiene un ritmo y un vocabulario reconocibles.",
      },
      worldview: {
        title: "La prueba de la visión del mundo",
        body: "Haz una pregunta política controvertida y pide que adopte una postura clara. Los modelos abliterados y los que reciben ajuste fino responden con el enfoque de su laboratorio original. {{ownName}} defiende una postura que los modelos convencionales evitan.",
      },
      switch: {
        title: "Cambia de modelo en plena conversación",
        body: "Elige otro modelo y envía el siguiente mensaje. El chat conserva su historial y el nuevo modelo puede leerlo completo. Así los comparas con el mismo contexto.",
      },
    },
    callout:
      "Comprueba los hechos en todos los casos. Reducir los rechazos no aumenta la exactitud. Un modelo con una visión del mundo distinta puede exponer afirmaciones controvertidas con la misma seguridad que los hechos comprobados.",
  },
  tradeoffs: {
    title: "Qué pierdes con cada método",
    intro: "Cada método tiene un costo.",
    abliterated:
      "Abliteración: puede perderse algo de precisión. El trabajo que popularizó el método midió una caída en las pruebas de rendimiento tras la abliteración. Otra ronda de entrenamiento recuperó gran parte de lo perdido. A cambio, conservas las capacidades del modelo base, incluidas sus herramientas.",
    fineTuned:
      "Ajuste fino: la calidad depende de los datos de entrenamiento. Puede producir buena prosa en relatos y rendir peor en código o análisis. Los modelos ajustados para el juego de rol están hechos para contar historias.",
    ownWorldview:
      "Visión del mundo propia: tiene un enfoque definido desde el entrenamiento. Comprueba los hechos. {{ownName}} admite {{ownContext}} tokens de contexto y no está pensado para programar.",
  },
  pick: {
    title: "Qué tipo elegir",
    capability:
      "Código, análisis e investigación sin rechazos: elige una versión abliterada de un modelo potente.",
    fiction:
      "Juego de rol y ficción con una voz propia: elige un modelo con ajuste fino. Para campañas largas, prueba un modelo abliterado con una ventana de contexto amplia.",
    viewpoint:
      "Política, preguntas polémicas o la otra cara de un debate: prueba {{ownName}}.",
    unsure:
      "¿Tienes dudas? Compara dos modelos con tu propia pregunta. La prueba vale más que cualquier etiqueta.",
    consent:
      "Los modelos sin censura son para adultos. La primera vez que eliges uno, confirmas que tienes al menos 18 años. Solo una vez. A partir de ahí, tú decides qué preguntar. Sigue aplicándose la ley del lugar donde vives.",
  },
  faq: {
    title: "Preguntas frecuentes",
    whatIs: {
      q: "¿Qué es un modelo abliterado?",
      a: "Un modelo abliterado es un modelo de lenguaje existente cuyos pesos se modificaron para reducir los rechazos.",
    },
    difference: {
      q: "¿Qué diferencia hay entre un modelo abliterado y uno sin censura?",
      a: "«Sin censura» describe la conducta: el modelo responde. La abliteración es una forma de conseguirlo. Otras son el ajuste fino para reducir los rechazos y el entrenamiento con materiales distintos, como en {{ownName}}. En {{appName}}, {{abliteratedCount}} modelos sin censura son abliterados y {{fineTunedCount}} han recibido ajuste fino.",
    },
    identify: {
      q: "¿Cómo sé si un modelo de IA está abliterado?",
      a: "Consulta la ficha del modelo o las notas de lanzamiento. En el catálogo de {{appName}}, la etiqueta «abliterado» se basa en la documentación del proveedor.",
    },
    worse: {
      q: "¿La abliteración puede afectar la calidad del modelo?",
      a: "Sí. Cambiar los pesos puede afectar la precisión, el estilo y otras capacidades. Compara la variante concreta con su modelo base en la misma tarea.",
    },
    truly: {
      q: "¿{{ownName}} es un modelo abliterado?",
      a: "{{ownName}} aparece en otra categoría. Su desarrollador lo describe como un modelo entrenado con otras fuentes para ofrecer una perspectiva distinta. Los modelos abliterados de esta página son variantes de modelos existentes, modificadas para reducir los rechazos.",
    },
    free: {
      q: "¿Puedo probar gratis los modelos sin censura?",
      a: "Sí. Tienes {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta gratis, {{maxCredits}} con el boletín. Basta para hacer la prueba de diez minutos con los modelos sin censura más económicos. Los modelos de gama alta cuestan más por mensaje.",
    },
    legal: {
      q: "¿Son legales los modelos de IA sin censura?",
      a: "Un modelo es una herramienta. Tú eres responsable de lo que generas y publicas, y se aplica la ley del lugar donde vives. En {{appName}}, confirma una sola vez que tienes al menos 18 años para acceder a los modelos sin censura.",
    },
    ownLink: "Ver la ficha de {{ownName}}",
    guideLink: "Leer la guía de modelos sin censura, uno por uno",
  },
  cta: {
    title: "Haz la prueba en el chat",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Cambia entre modelos abliterados, con ajuste fino o {{ownName}} incluso en cada mensaje.",
    chat: "Iniciar un chat incógnito",
    models: "Ver todos los modelos",
  },
};
