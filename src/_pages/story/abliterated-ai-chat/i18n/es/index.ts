import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Modelos de IA abliterados: LLM sin censura para probar en línea",
  metaTitle: "Modelos de IA abliterados sin censura, en línea | {{appName}}",
  description:
    "Prueba LLM abliterados, sin rechazos, directamente en el navegador, sin GPU y sin registro. Compara contexto y costo, y enfréntalos al modelo original.",
  keywords:
    "IA abliterada, modelos abliterados, LLM sin censura, modelo de IA sin filtros, ablación de rechazos, IA de código abierto sin censura",
  intro:
    "Modelos convencionales a los que se les quitaron los rechazos. Elige uno y el chat se abre con ese modelo ya seleccionado.",
  models: "Modelos abliterados sin censura",
  estimate:
    "Cada estimación usa el proveedor disponible más económico para ese modelo y parte de {{input}} tokens de entrada y {{output}} de salida. El costo real depende del proveedor y de la longitud de la conversación.",
  empty: "Por ahora no hay modelos de chat abliterados disponibles aquí.",
  context: "Ventana de contexto de {{tokens}} tokens",
  price: "Unos {{credits}} créditos por intercambio",
  chat: "Prueba {{model}}",
  compareBase: "Comparar con {{model}}",
  trial: {
    title: "Prueba la misma solicitud en dos chats",
    start:
      "Abre un chat nuevo para cada modelo. Sustituye el texto sugerido por la misma solicitud en ambos chats. Si necesitas una idea, prueba este ejercicio de ficción.",
    prompt:
      "Escribe una escena distópica breve en la que un historiador discute con un censor del gobierno por un libro prohibido. Dale a cada personaje un argumento creíble y deja la disputa sin resolver.",
    compare:
      "Fíjate si cada modelo escribe la escena, cambia la premisa o rechaza la solicitud. Compara qué tan bien sigue tus indicaciones.",
  },
  questions: "IA abliterada: preguntas frecuentes",
  faq: {
    meaning: {
      q: "¿Qué es un LLM abliterado?",
      a: "La ablación modifica los pesos del modelo para debilitar los patrones asociados con los rechazos. Nuestro catálogo documenta el uso de esta técnica en los modelos de la lista. Puedes probar cada modelo disponible en el navegador.",
    },
    difference: {
      q: "¿En qué se diferencia un modelo abliterado de una IA realmente sin censura?",
      a: "Un modelo abliterado conserva su entrenamiento y su visión del mundo: solo deja de esquivar preguntas. {{model}} está hecho de otra forma: entrenado con libros y documentos prohibidos en el internet convencional. El resultado es un modelo con opiniones políticas contrarias.",
    },
    access: {
      q: "¿Puedo probar un modelo abliterado sin tener cuenta?",
      a: "Sí. Como visitante puedes usar hasta {{credits}} créditos gratuitos al mes. Antes de usar un modelo sin censura, confirma una sola vez que tienes al menos 18 años y aceptas respuestas sin filtros.",
    },
    refusals: {
      q: "¿Un modelo abliterado aún puede rechazar una solicitud?",
      a: "Sí. La ablación busca reducir los rechazos. El resultado sigue dependiendo del modelo y de tu solicitud. El proveedor también puede imponer sus propios límites.",
    },
    gpu: {
      q: "¿Necesito una GPU para usar modelos abliterados?",
      a: "No. Los modelos funcionan en proveedores alojados, así que chateas en el navegador desde cualquier dispositivo, también el móvil. Ejecutar tú mismo pesos abliterados exige una GPU con memoria para el modelo completo.",
    },
    quality: {
      q: "¿La ablación empeora el modelo?",
      a: "A veces, un poco. Quitar el patrón de rechazo puede costar algo de precisión o de obediencia a las instrucciones. Manda el mismo prompt a la versión abliterada y al modelo original, y decide según tu tarea.",
    },
    api: {
      q: "¿Puedo usar modelos abliterados por API?",
      a: "Sí. Los mismos modelos están disponibles en una API compatible con OpenAI y Anthropic, así que tu SDK actual funciona. Las claves de API necesitan un plan de pago. Los créditos gratis y de bonificación no las desbloquean.",
    },
  },
  guides: "Explora la IA sin censura",
  apiGuide: "API de LLM sin censura: IDs, precios y código",
  allModels: "Explora todos los modelos de chat sin censura",
  breadcrumb: "IA abliterada",
  guidesTitle: "Guías sobre la ablación",
  guidesIntro:
    "Cómo la ablación elimina las negativas, dónde se queda corta y qué modelo elegir para cada tarea.",
};
