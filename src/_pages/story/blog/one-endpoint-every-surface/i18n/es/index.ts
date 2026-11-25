import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un punto final. Cada superficie. next-vibe",
    description:
      "Una definition.ts por función: formulario web, comando CLI, herramienta MCP, pantalla nativa y tarea cron a la vez. Sin duplicación y con tipos verificados.",
    category: "Arquitectura",
    imageAlt:
      "Arquitectura unificada de next-vibe: un endpoint en todas las plataformas",
    keywords:
      "next-vibe, TypeScript, superficie unificada, MCP, CLI, definition.ts, código abierto, marco SaaS",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Arquitectura",
    readTime: "5 min para leer",
    title: "Un endpoint para todas las interfaces.",
    subtitle:
      "Una definición por función genera a la vez un formulario web, un comando CLI, una herramienta MCP, una pantalla nativa y una tarea cron. Sin duplicación.",
  },
  intro: {
    paragraph1:
      "Cada característica necesitaba un formulario web, un comando CLI, una herramienta MCP para los agentes AI, a veces una pantalla móvil. La misma validación de Zod, el mismo i18n, el mismo manejo de errores: simplemente vestida de manera diferente. Así que construí next-vibe: un marco donde escribes una definition.ts por característica y se hace como todos ellos simultáneamente.",
    paragraph2:
      "También es la base de {{appName}}, con {{modelCount}} modelos de IA y filtros que el usuario decide. El mismo código funciona como app web en Next.js, servidor de desarrollo TanStack/Vite, app móvil en React Native, CLI, servidor MCP, sistema cron y bus de eventos WebSocket. Una definición de endpoint. Sin duplicación.",
  },
  typeRules: {
    title: "Los tipos deben alinearse. Sin excepciones.",
    subtitle:
      "Estas no son preferencias de estilo. Son reglas arquitectónicas al horno en el marco.",
    intro:
      "La regla es estricta: los tipos deben coincidir de principio a fin. Si no coinciden, falla la arquitectura. Creamos vibe check para hacerlo cumplir. Ejecuta Oxlint, ESLint y TypeScript en paralelo, con complementos para las reglas del proyecto.",
    any: {
      name: "no",
      description:
        "Reemplazar con una interfaz de tipo real. Si te acercas a alguno, tu arquitectura tiene un agujero.",
    },
    unknown: {
      name: "no desconocido",
      description:
        "La misma regla. desconocida es cualquiera con pasos adicionales. Define el tipo.",
    },
    object: {
      name: "sin objeto desnudo",
      description:
        "El objeto desnudo no tiene sentido. Escribe la forma que realmente esperas.",
    },
    asX: {
      name: "no como X",
      description:
        "Las afirmaciones de tipo son mentiras para el compilador. Arregla la arquitectura.",
    },
    throwStatements: {
      name: "No tires",
      description:
        "Use ResponseType seleccionT confidencial con éxito(datos) o fallo({message, errorType }). Los errores son datos, no excepciones.",
    },
    hardcodedStrings: {
      name: "sin cadenas codificadas en JSX",
      description:
        "El verificador atrapa cuerdas literales no traducidas. Cada cadena necesita una clave de traducción.",
    },
  },
  vibeSense: {
    title: "El motor gráfico accidental",
    subtitle: "Un bot comercial que no puede cambiar",
    description:
      "Vibe Sense empezó como un bot de trading. Nunca ejecutó órdenes: solo observaba precios y emitía señales. Cuando lo abandoné, conservé el flujo de datos. Las fuentes alimentan los indicadores, los indicadores alimentan los evaluadores y las señales de los evaluadores activan acciones. Cada nodo es un endpoint HTTP.",
    quote:
      "Cada nodo del grafo es un endpoint HTTP. Puedes consultar cualquier paso con curl, probarlo por separado o llamarlo desde un agente de IA. El motor del grafo funciona como planificador.",
    whyItMatters:
      "Debido a que cada nodo es un punto final estándar, se pueden probar individualmente a través de CLI, accesible a los agentes AI vía MCP, y cachéable con el mismo infra que todo lo demás. El motor gráfico no inventa su propio lenguaje. Planifica puntos finales.",
  },
  cta: {
    title: "Lea el código. Hazlo tú mismo.",
    subtitle:
      "next-vibe es de código abierto. Clona el repositorio, ejecuta vibe dev y publica tu primer endpoint en todas las interfaces en una tarde.",
    github: "Ver en GitHub",
    clone: "git clone https://github.com/techfreaque/next-vibe",
    framework: "Explora next-vibe",
  },
};
