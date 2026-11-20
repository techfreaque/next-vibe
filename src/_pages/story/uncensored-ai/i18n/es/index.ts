import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Chat de IA sin censura en tu navegador",
  metaTitle: "Chat de IA sin censura y sin registro | {{appName}}",
  description:
    "Prueba un chatbot sin censura sin crear una cuenta. Compara el contexto y el costo estimado de los modelos, y haz tu pregunta en el navegador.",
  intro:
    "Hazle tu pregunta a un chatbot sin censura desde el navegador. Puedes empezar sin crear una cuenta.",
  chooseModel: "Encuentra un modelo para chatear",
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
      a: "Como visitante tienes {{credits}} créditos gratis al mes. La cantidad de mensajes depende del modelo y de la longitud de la conversación.",
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
  abliteration: "Cómo cambia un modelo de lenguaje con la ablación de rechazos",
  compare: "Compara plataformas de chat de IA sin censura",
  benchmark: "Consulta las respuestas de varios modelos a las mismas preguntas",
};
