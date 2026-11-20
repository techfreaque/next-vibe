import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un punto final. Cada superficie. next-vibe",
    description:
      "Escribe una definition.ts por función. Representa como forma web, comando CLI, herramienta MCP, pantalla nativa, trabajo de cron - simultáneamente. Sin duplicación. Tipos aplicados.",
    category: "Arquitectura",
    imageAlt:
      "next-vibe arquitectura de superficie unificada - un punto final, cada plataforma",
    keywords:
      "next-vibe, TypeScript, superficie unificada, MCP, CLI, definition.ts, código abierto, marco SaaS",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Arquitectura",
    readTime: "5 min para leer",
    title: "Un endpoint para todas las interfaces.",
    subtitle:
      "Escribe una definición por función. Forma web, comando CLI, herramienta MCP, pantalla nativa, trabajo de cron - todo a la vez. Sin duplicación.",
  },
  intro: {
    paragraph1:
      "Cada característica necesitaba un formulario web, un comando CLI, una herramienta MCP para los agentes AI, a veces una pantalla móvil. La misma validación de Zod, el mismo i18n, el mismo manejo de errores - simplemente vestida de manera diferente. Así que construí next-vibe: un marco donde escribes una definition.ts por característica y se hace como todos ellos simultáneamente.",
    paragraph2:
      "También potencia los modelos {{appName}} - {{modelCount}} AI, censura controlada por el usuario. La misma base de código funciona como una aplicación web Next.js, un servidor TanStack/Vite dev, una aplicación móvil React Native, un CLI, un servidor MCP, un sistema cron y un autobús de eventos WebSocket. Una definición de punto final. Sin duplicación.",
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
      "Vibe Sense comenzó como un bot comercial. Nunca ejecutó órdenes - sólo miraba precios y disparaba señales. Cuando lo abandoné, la arquitectura del oleoducto sobrevivió: las fuentes de datos se conectan a indicadores, los evaluadores de alimentación, los evaluadores emiten señales, las señales desencadenan acciones. Cada nodo es un punto final HTTP.",
    quote:
      "Cada nodo en el gráfico es sólo un punto final HTTP - se puede frenar cualquier paso en el oleoducto, probarlo en aislamiento, o llamarlo de un agente AI. El motor gráfico es un programador, no un DSL.",
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
