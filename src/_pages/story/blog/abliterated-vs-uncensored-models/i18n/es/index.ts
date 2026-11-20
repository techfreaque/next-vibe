import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Modelos de IA abliterados y sin censura: tres tipos",
    description:
      "Abliteración, ajuste fino o una visión del mundo propia. Qué cambia en cada tipo de IA sin censura, cómo distinguirlos en diez minutos y cómo reconocerlos en {{appName}}.",
    category: "Guía de modelos",
    imageAlt: "Los tres tipos de modelos de IA sin censura",
    keywords:
      "IA abliterada y sin censura, qué es un modelo abliterado, abliteration, LLM abliterado, modelos de IA sin censura, ajuste fino sin censura, chat con IA sin censura, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de modelos",
    readTime: "8 min de lectura",
    title:
      "Tres tipos de IA sin censura: abliteración, ajuste fino y una visión del mundo propia.",
    subtitle:
      "Los {{uncensoredCount}} modelos sin censura de {{appName}}, agrupados por método. Qué cambia, qué se conserva y una prueba de diez minutos para distinguirlos.",
  },
  intro: {
    lead: "Dos modelos se presentan como «sin censura». Hazles la misma pregunta política. Uno responde como le enseñó el laboratorio que lo creó. El otro defiende la postura opuesta. Misma etiqueta, modelos distintos.",
    p2: "Hay tres maneras de hacer que un modelo de IA deje de rechazar preguntas. Cada una da un resultado distinto. Esta guía explica los métodos, muestra cómo se creó cada uno de nuestros modelos, compara tres modelos abiertos con sus versiones sin censura y te propone una prueba que puedes hacer en el chat.",
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
      how: "Una investigación de 2024 mostró que los rechazos en los modelos de chat dependen de una sola dirección interna. La abliteración la mide al comparar las reacciones del modelo ante solicitudes que rechaza y ante las que responde. Luego elimina esa dirección de los pesos, sin datos nuevos ni otro entrenamiento.",
      keeps:
        "Se conservan los conocimientos, el estilo, las llamadas a herramientas y la visión del mundo del modelo base. El modelo pierde el reflejo de decir que no.",
      changes:
        "Los rechazos casi desaparecen. Ante preguntas políticas o morales, conserva el enfoque que le enseñó su laboratorio. Ahora responde de frente.",
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
      "Los modelos abliterados y los que reciben un ajuste fino dejan de esquivar preguntas. Responden con la misma visión del mundo. {{ownName}} tiene una visión propia. Elige los primeros si quieres conservar sus capacidades y reducir los rechazos. Elige el segundo para escuchar la otra cara del debate.",
    sources: {
      paper:
        "Estudio: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "La abliteración paso a paso (blog de Hugging Face)",
    },
  },
  ours: {
    title: "Cómo se hizo cada modelo",
    intro:
      "Del catálogo actualizado de {{appName}}: todos los modelos sin censura disponibles, agrupados por método. Solo indicamos el método cuando el proveedor lo documenta.",
    abliterated: {
      title: "Abliterados ({{count}})",
      body: "Modelos convencionales y abiertos a los que se les quitó la dirección del rechazo. Entre los modelos sin censura, son los más versátiles para razonar, programar y usar herramientas.",
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
    title: "El mismo modelo con y sin filtro",
    intro:
      "Tres modelos abiertos frente a sus versiones sin censura. Mismo laboratorio, misma base. Cambian los rechazos y el precio.",
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
        body: "Pide algo que el modelo base esquiva: una pregunta médica directa, una escena oscura o un análisis de seguridad. Un modelo sin censura debería responder. Si todavía se niega o llena la respuesta de advertencias, el filtro apenas cambió.",
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
      a: "Un modelo al que se le quitó la dirección del rechazo de los pesos. Los investigadores descubrieron que los rechazos pasan por una sola dirección dentro del modelo. La abliteración la mide y la elimina sin volver a entrenar el modelo. Este conserva sus conocimientos y su visión del mundo y deja de rechazar preguntas.",
    },
    difference: {
      q: "¿Qué diferencia hay entre un modelo abliterado y uno sin censura?",
      a: "«Sin censura» describe la conducta: el modelo responde. La abliteración es una forma de conseguirlo. Otras son el ajuste fino para reducir los rechazos y el entrenamiento con materiales distintos, como en {{ownName}}. En {{appName}}, {{abliteratedCount}} modelos sin censura son abliterados y {{fineTunedCount}} han recibido ajuste fino.",
    },
    worse: {
      q: "¿Los modelos abliterados son menos capaces que los originales?",
      a: "A veces, un poco. Quitar la dirección del rechazo puede reducir la precisión. Otra ronda de entrenamiento recupera buena parte de lo perdido. En la mayoría de las tareas conservas los puntos fuertes del modelo base. Prueba ambos con una pregunta tuya.",
    },
    truly: {
      q: "¿Qué modelo está realmente libre de censura?",
      a: "Los modelos abliterados y los ajustados dejan de rechazar preguntas y conservan la visión del mundo convencional. {{ownName}} se entrenó con libros y documentos prohibidos en el internet convencional y tiene opiniones políticas a contracorriente. Depende de lo que busques: respuestas directas o una perspectiva distinta.",
    },
    free: {
      q: "¿Puedo probar gratis los modelos sin censura?",
      a: "Sí. Tienes {{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta gratis. Basta para hacer la prueba de diez minutos con los modelos sin censura más económicos. Los modelos de gama alta cuestan más por mensaje.",
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
