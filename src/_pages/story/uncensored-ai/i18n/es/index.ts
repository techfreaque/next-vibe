import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "IA sin censura: chat de IA sin filtros en tu navegador",
  metaTitle: "Chat de IA sin censura online, gratis | {{appName}}",
  description:
    "IA sin censura, sin filtros ni registro. Modelos abliterados y de verdad sin censura en el navegador, créditos gratis para visitantes. Compara costes y chatea.",
  keywords:
    "IA sin censura, IA sin restricciones, ChatGPT sin censura, chat IA sin filtros, IA sin límites, chatbot sin censura, inteligencia artificial sin censura, IA abliterada",
  intro:
    "Un chat de IA sin censura usa modelos que responden en vez de negarse. Chatea en el navegador como invitado: créditos gratis, sin registro y una sola confirmación de edad. Sin sermones. Tú decides qué lees.",
  tryModel: "Prueba {{model}}",
  chooseModel: "Compara los modelos",
  choose:
    "Para una pregunta corta, empieza con uno de los modelos más económicos al inicio de la lista. Para documentos o conversaciones largas, elige una ventana de contexto mayor para que el modelo pueda usar más texto a la vez.",
  start:
    "Abre el chat del modelo que elegiste. Si se te pide, confirma que tienes 18 años o más y acepta las condiciones. Después, reemplaza la pregunta de ejemplo por la tuya.",
  models: "Modelos de IA sin censura",
  order:
    "Los modelos aparecen de menor a mayor costo estimado. El cálculo usa {{input}} tokens de entrada y {{output}} de salida con la tarifa disponible más baja. Las conversaciones largas pueden costar más.",
  empty:
    "En esta instancia no hay modelos de chat sin censura disponibles en este momento.",
  context: "Ventana de contexto: {{tokens}} tokens",
  price: "Créditos estimados por intercambio: {{credits}}",
  chat: "Chatea con {{model}}",
  questions: "IA sin censura: preguntas frecuentes",
  faq: {
    access: {
      q: "¿Puedo usar una IA sin censura gratis?",
      a: "Sin cuenta puedes recibir hasta {{credits}} créditos gratis al mes. La cantidad de mensajes depende del modelo y de la duración de la conversación.",
    },
    outOfCredits: {
      q: "¿Qué pasa si se me acaban los créditos como visitante?",
      a: "Puedes esperar al mes siguiente o crear una cuenta gratuita y verificar tu correo electrónico. Con el correo verificado puedes recibir hasta {{credits}} créditos gratis al mes. Los créditos que ya usaste sin cuenta ese mes cuentan para ese límite.",
    },
    chatgpt: {
      q: "¿Existe ChatGPT sin censura?",
      a: "No. Los modelos GPT de OpenAI mantienen sus filtros en todas partes, también aquí. Los prompts de jailbreak solo duran hasta la próxima actualización. El camino fiable es otro modelo: elige uno de la categoría sin censura y haz tu pregunta directamente.",
    },
    kinds: {
      q: "¿Abliterado o realmente sin censura? En qué se diferencian",
      a: "Los modelos abliterados son modelos convencionales a los que se les quitaron los rechazos. Mismo entrenamiento, misma visión del mundo: solo responden. {{model}} es el sin censura de verdad: entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias. La ficha de cada modelo indica de qué tipo es.",
    },
    filters: {
      q: "¿Existe una IA sin restricciones de verdad?",
      a: "Aquí eliges un modelo de la categoría sin censura. Los modelos convencionales como GPT conservan sus propios filtros. Un modelo sin censura aún puede rechazar una solicitud o equivocarse. Verifica tú mismo los datos importantes.",
    },
    privacy: {
      q: "¿Mis chats son privados?",
      a: "Los chats de incógnito se quedan en tu navegador, no en nuestros servidores. El proveedor de IA recibe cada mensaje para poder responder. Sin rastreadores de terceros, sin píxeles publicitarios. Con una cuenta puedes exportar tus datos en JSON o eliminar la cuenta desde los ajustes.",
    },
    legal: {
      q: "¿Es legal usar una IA sin censura?",
      a: "Usar un modelo que rechaza menos no está prohibido. Lo que hagas con las respuestas o publiques está sujeto a las mismas leyes que cualquier otro texto. Antes del primer modelo sin censura confirmas una sola vez que tienes 18 años o más.",
    },
    local: {
      q: "¿Necesito una tarjeta gráfica para usar estos modelos?",
      a: "Solo necesitas un navegador y conexión a internet. El proveedor procesa tu pregunta. Para ejecutar un modelo íntegramente en tu equipo tienes que instalarlo en local.",
    },
    askAnything: {
      q: "¿Puedo preguntarle cualquier cosa a una IA sin censura?",
      a: "Puedes preguntar lo que quieras. Los modelos del nivel sin censura se saltan las fórmulas de rechazo habituales, así que la mayoría de las preguntas recibe una respuesta directa. Un modelo aún puede negarse o equivocarse, así que comprueba los datos importantes. Lo que hagas con las respuestas es tu responsabilidad.",
    },
    online: {
      q: "¿Funciona online, sin instalar una app?",
      a: "Sí. Cada modelo funciona en el navegador, en el ordenador o en el móvil. Nada que instalar, sin GPU. Después de cualquier compra, los mismos modelos también están disponibles por una API compatible con OpenAI.",
    },
    pick: {
      q: "¿Qué chatbot de IA sin censura elijo?",
      a: "Para una pregunta rápida, empieza con {{cheapest}}, el modelo más barato de la lista. Para documentos largos, elige un modelo con una ventana de contexto de {{context}}.",
      aWorldview:
        "Para una pregunta rápida, empieza con {{cheapest}}, el modelo más barato de la lista. Para documentos largos, elige un modelo con una ventana de contexto de {{context}}. Si buscas respuestas fuera de la opinión dominante, prueba {{model}}: entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias.",
    },
  },
  guides: "Compara modelos y plataformas",
  chatgptGuide: "ChatGPT sin censura: la alternativa",
  abliteratedChat: "Prueba en el chat un modelo con ablación de rechazos",
  compare: "Compara plataformas de chat de IA sin censura",
  benchmark: "Consulta las respuestas de varios modelos a las mismas preguntas",
  breadcrumb: "IA sin censura",
  guidesTitle: "Guías: IA sin censura y sin filtros",
  guidesIntro:
    "Qué modelo sirve para cada tarea, qué cambia la ablación en un modelo y cómo chatear o usar una API sin GPU ni cuenta.",
  comparisons: "Comparativas cara a cara",
  comparisonsIntro:
    "Dos modelos por página, lado a lado. Mira en qué se diferencian antes de elegir.",
  versus: "{{a}} vs. {{b}}",
};
