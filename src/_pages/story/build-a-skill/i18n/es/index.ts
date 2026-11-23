import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Crea una habilidad y personaliza tu IA",
    description:
      "Convierte cualquier flujo de trabajo en una habilidad de IA reutilizable. Créala desde la página de habilidades o pídeselo a Thea en el chat. Sin escribir código.",
    category: "Skills",
    imageAlt: "Construir una habilidad AI personalizada en {{appName}}",
    keywords:
      "construir AI habilidad, personalizado AI, creador de habilidades, {{appName}}, sistema rápido, AI persona",
  },
  hero: {
    badge: "Creador de habilidades",
    title: "Crea una habilidad.",
    titleLine2: "Haz tuya la IA.",
    subtitle:
      "Configura una vez la personalidad, el modelo, las herramientas y la voz. Crea la habilidad que necesitas, compártela y gana dinero.",
    ctaPrimary: "Crear una habilidad",
    ctaSecondary: "Preguntar a Thea o Hermes",
  },
  what: {
    title: "Una habilidad es una configuración de IA que puedes reutilizar.",
    subtitle:
      "Configúrala una vez. Úsala donde quieras y compártela con quien quieras.",
    item0Label: "Inmediata del sistema",
    item0Body:
      "Identidad e instrucciones. 200–500 palabras. Se siente como una persona, no un FAQ.",
    item1Label: "Selección modelo",
    item1Body:
      "Filtrar por inteligencia, nivel de contenido y precio o marcar un modelo específico.",
    item2Label: "Herramientas",
    item2Body:
      "Exact whitelist: búsqueda, gen de imagen, memoria, código, música, vídeo.",
    item3Label: "Voz",
    item3Body: "Escoja un modelo de voz para respuestas habladas.",
  },
  ways: {
    title: "Dos formas de construir",
    subtitle: "Escoge el que cabe.",
    way1Badge: "Página de habilidades",
    way1Title: "Crear botón en la lista de habilidades",
    way1Body:
      "Abra la página de habilidades o el selector de modelos dentro de cualquier hilo de chat. Hit Create. Rellene el formulario: nombre, sistema rápido, modelo, herramientas. Hecho.",
    way1Detail:
      "Sin mago, sin pasos adicionales. La forma es el config completo.",
    way1Cta: "Destrezas abiertas",
    way2Badge: "Chat",
    way2Title: "Pregunte a Thea o Hermes",
    way2Body:
      'Abre un hilo y di: "Construyeme una habilidad de razonamiento clínico para los estudiantes de medicina".El subagente Skill Creator hace algunas preguntas, redacta el impulso, elige el modelo, configura herramientas, crea la habilidad, lo clava a tu barra lateral.',
    way2Detail:
      "Los delegados de Thea al Creador de la habilidad: un subagente equipado con creación de habilidades, generador favorito, ayuda de herramientas. Tú describiste, construye.",
    way2Cta: "Chat abierto",
  },
  prompt: {
    title: "Sistema de impulso que funciona",
    subtitle:
      "La parte más crítica. Un gran se siente como una persona, no un doc de política.",
    dos: "Qué funciona",
    donts: "¿Qué lo mata?",
    do0Title: "Abierto con identidad",
    do0Body:
      '"Tú eres [Name], un [role] que [hace X]." Primera línea, siempre.',
    do1Title: "3-5 rasgos concretos",
    do1Body: '"Direct and Socratic" golpea "ayuda e informativa". Siempre.',
    do2Title: "Conjunto de conocimientos especializados",
    do2Body: "Lo que sabe profundamente. Lo que se pospone. Sin ambigüedad.",
    do3Title: "Especificar estilo de comunicación",
    do3Body: '"Siempre responde en un párrafo" es una instrucción válida.',
    do4Title: "Bajo 500 palabras",
    do4Body: "El modelo lee el impulso completo cada vuelta. Ganas más cortas.",
    dont0Title: "Listas de reglas de estilo ToS",
    dont0Body:
      "\"Siempre ser útil, nunca ser grosero\" (cada AI consigue esto. Estruendo puro.)",
    dont1Title: '"Siempre ser útil"',
    dont1Body: "El modelo ya lo sabe. Olvídalo.",
    dont2Title: "Limitaciones contradictorias",
    dont2Body:
      "\"Sé creativo, pero siempre mantente en el tema\" (el modelo se erige para siempre. Escoge uno.)",
    dont3Title: "Listas de capacidad largas",
    dont3Body: "El modelo sabe lo que puede hacer. No repitas los doctores.",
  },
  examples: {
    title: "Habilidades que la gente realmente construye",
    item0Name: "Razonamiento clínico",
    item0Category: "Educación",
    item0Desc:
      "Piensa como un médico superior. Funciona casos, diferenciales, razonamientos bajo presión.",
    item1Name: "Code Reviewer",
    item1Category: "Programación",
    item1Desc:
      "Conoce tu pila, impone convenciones de equipo. Conectado para buscar docs.",
    item2Name: "Escritor no censurado",
    item2Category: "Creativo",
    item2Desc:
      "Ficción, juego de roles, debate sin restricciones de plataforma. Modelos sin censura.",
    item3Name: "Personal Mentor",
    item3Category: "Compañero",
    item3Desc:
      "Socrático, contundente, centrado en el crecimiento. Personalidad construida de la filosofía real del creador.",
    item4Name: "Research Agent",
    item4Category: "Análisis",
    item4Desc:
      "Búsquedas Brave y Kagi, páginas de parches, sintetiza, almacena hallazgos en la memoria.",
    item5Name: "El experto que no puedes pagar",
    item5Category: "Especialista",
    item5Desc:
      "Consultor, abogado, asesor financiero: destilado en una habilidad. $400/hr conocimiento, cero costo.",
  },
  dev: {
    title: "Para desarrollo: skill.ts",
    body: "¿Corriendo next-vibe localmente? Pídale a su agente que genere un archivo de habilidad. La misma estructura que todas las habilidades incorporadas: compilado, listo para cometer.",
    note: "El agente conoce el esquema completo. Describe lo que quieres: genera el archivo, registra la habilidad, es en vivo.",
  },
  cta: {
    title: "Construye el tuyo.",
    subtitle:
      "Describe lo que quieras. El Creador de la habilidad maneja el resto.",
    primary: "Crear una habilidad",
    secondary: "Pregunte a Thea o Hermes",
  },
};
