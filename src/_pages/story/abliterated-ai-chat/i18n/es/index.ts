import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Modelos de IA abliterados para probar en línea",
  metaTitle: "Modelos de IA abliterados en línea | {{appName}}",
  description:
    "Compara los LLM abliterados por ventana de contexto y costo estimado. Pruébalos en el navegador y compáralos con el modelo base si está disponible.",
  intro:
    "Prueba modelos modificados para rechazar menos solicitudes. Elige uno y abre un chat en el navegador con ese modelo ya seleccionado.",
  models: "Modelos abliterados disponibles",
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
  questions: "Preguntas frecuentes",
  faq: {
    meaning: {
      q: "¿Qué es un LLM abliterado?",
      a: "La ablación modifica los pesos del modelo para debilitar los patrones asociados con los rechazos. Nuestro catálogo documenta el uso de esta técnica en los modelos de la lista. Puedes probar cada modelo disponible en el navegador.",
    },
    access: {
      q: "¿Puedo probar un modelo abliterado sin tener cuenta?",
      a: "Sí. Como visitante puedes usar hasta {{credits}} créditos gratuitos al mes. Antes de usar un modelo sin censura, confirma una sola vez que tienes al menos 18 años y aceptas respuestas sin filtros.",
    },
    refusals: {
      q: "¿Un modelo abliterado aún puede rechazar una solicitud?",
      a: "Sí. La ablación busca reducir los rechazos. El resultado sigue dependiendo del modelo y de tu solicitud. El proveedor también puede imponer sus propios límites.",
    },
  },
  guides: "Explora la IA sin censura",
  allModels: "Explora todos los modelos de chat sin censura",
  breadcrumb: "IA abliterada",
  guidesTitle: "Guías sobre la ablación",
  guidesIntro:
    "Cómo la ablación elimina las negativas, dónde se queda corta y qué modelo elegir para cada tarea.",
};
