import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Chat de IA sin censura en tu navegador",
  metaTitle: "Chat de IA sin censura y sin registro | {{appName}}",
  description:
    "Prueba un chatbot sin censura en tu navegador con créditos gratis para visitantes. Compara el contexto y el costo estimado de los modelos o empieza a chatear.",
  intro:
    "Empieza sin crear una cuenta. Elige un modelo para tu pregunta o prueba el que tenga el costo estimado más bajo por intercambio.",
  tryModel: "Prueba {{model}}",
  chooseModel: "Compara los modelos",
  choose:
    "Para una pregunta corta, empieza con uno de los modelos más económicos al inicio de la lista. Para documentos o conversaciones largas, elige una ventana de contexto mayor para que el modelo pueda usar más texto a la vez.",
  start:
    "Abre el chat del modelo que elegiste. Si se te pide, confirma que tienes 18 años o más y acepta las condiciones. Después, reemplaza la pregunta de ejemplo por la tuya.",
  models: "Elige un modelo para chatear",
  order:
    "Los modelos aparecen de menor a mayor costo estimado. El cálculo usa {{input}} tokens de entrada y {{output}} de salida con la tarifa disponible más baja. Las conversaciones largas pueden costar más.",
  empty:
    "En esta instancia no hay modelos de chat sin censura disponibles en este momento.",
  context: "Ventana de contexto: {{tokens}} tokens",
  price: "Créditos estimados por intercambio: {{credits}}",
  chat: "Chatea con {{model}}",
  questions: "Antes de empezar",
  faq: {
    access: {
      q: "¿Puedo probar gratis un chat de IA sin censura?",
      a: "Sin cuenta puedes recibir hasta {{credits}} créditos gratis al mes. La cantidad de mensajes depende del modelo y de la duración de la conversación.",
    },
    outOfCredits: {
      q: "¿Qué pasa si se me acaban los créditos como visitante?",
      a: "Puedes esperar al mes siguiente o crear una cuenta gratuita y verificar tu correo electrónico. Con el correo verificado puedes recibir hasta {{credits}} créditos gratis al mes. Los créditos que ya usaste sin cuenta ese mes cuentan para ese límite.",
    },
    filters: {
      q: "¿Qué significa aquí chat de IA sin filtros?",
      a: "Eliges un modelo de la categoría sin censura. Los modelos convencionales como GPT conservan sus propios filtros. Un modelo sin censura aún puede rechazar una solicitud o equivocarse.",
    },
    local: {
      q: "¿Necesito una tarjeta gráfica para usar estos modelos?",
      a: "Solo necesitas un navegador y conexión a internet. El proveedor procesa tu pregunta. Para ejecutar un modelo íntegramente en tu equipo tienes que instalarlo en local.",
    },
  },
  guides: "Compara modelos y plataformas",
  abliteratedChat: "Prueba en el chat un modelo con ablación de rechazos",
  compare: "Compara plataformas de chat de IA sin censura",
  benchmark: "Consulta las respuestas de varios modelos a las mismas preguntas",
  breadcrumb: "IA sin censura",
  guidesTitle: "Guías de IA sin censura",
  guidesIntro:
    "Qué modelo sirve para cada tarea, qué cambia la ablación en un modelo y cómo chatear o usar una API sin GPU ni cuenta.",
  comparisons: "Comparativas cara a cara",
  comparisonsIntro:
    "Dos modelos por página, lado a lado. Mira en qué se diferencian antes de elegir.",
  versus: "{{a}} vs. {{b}}",
};
