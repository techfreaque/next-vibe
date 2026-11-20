import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Cómo un verificador de tipos hizo que la IA dejara de mentirme | next-vibe",
    description:
      "AI utilizará `any` para escapar de un error de tipo. Agregará eslint-disable. Te mentirá. Así es como arreglamos el bucle de retroalimentación con @ next-vibe /checker.",
    category: "TypeScript",
    imageAlt: "Tipo de chequeo que hizo AI dejar de mentir",
    keywords:
      "TypeScript, checker tipo, codificación AI, ESLint, Oxlint, cualquier tipo de seguridad, tipo Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 min leer",
    title:
      "Escribí un verificador de tipos que hizo que la IA dejara de mentirme",
    subtitle:
      "AI utilizará `any` para escapar de un error de tipo. Agregará eslint-disable. Te mentirá. Así es como arreglamos el bucle de retroalimentación.",
    quoteAiLies: "AI no te miente porque quiere. Te miente porque lo dejaste.",
  },
  problem: {
    title: "El bucle de respuesta roto",
    description:
      'Pregúntele al código Claude para agregar una característica. Sí. Ejecute ESLint - pasa. Corre TypeScript - errores. Pregúntele a Claude Code para arreglar el TypeScript. Sí. Corre ESLint - ahora que falla. Retrocede y adelante. Tres rutas. El AI confía en cada paso. Cada vez: "Eso está arreglado".',
    fixLabel: "Nunca fue arreglado.",
    fixDescription:
      "Fue un golpe con una herramienta que funciona un invierno a la vez y nunca ve el cuadro completo.",
    escapeHatch:
      'El AI corrige el error TypeScript escribiendo una línea y le dice: "El error de tipo se resuelve".',
    smokeDetector:
      "Sí. Técnicamente. La forma de cubrir tu detector de humos con cinta resuelve una alarma de incendios.",
    introducingChecker:
      "Eso es lo que construí @ next-vibe /checker para parar.",
  },
  anyProblem: {
    title: "El problema `any`",
    subtitle: "Por qué 98% de seguridad tipo es igual al 0%",
    graphDescription:
      "TypeScript 's tipo sistema es un gráfico. Cada tipo fluye de la definición al uso. Si tienes una función que devuelve `string`, el que llama sabe que es una cadena. Toda la cadena está controlada.",
    holeInGraph: "`any` es un agujero en el gráfico.",
    holeDescription:
      "Una variable clasificada como `any` le dice al compilador: deje de revisar aquí. No sólo para esta variable - para todo lo que toca esta variable. El error no aparece en el `any`. Se muestra tres archivos de distancia cuando algún refactor no relacionado rompe una suposición que nunca se hizo cumplir.",
    zeroErrors:
      "Los errores de Zero TypeScript no significan nada si usted tiene 47 usos de `any` no comprobados.",
    doubleAssertion:
      "`as unknown as Whatever` es peor. Es una afirmación de doble tipo. Le estás diciendo al compilador: Sé que esto está mal, y estoy afirmando mi camino a través de él de todos modos. Esta es la escotilla favorita de AI.",
    bannedTitle: "Los patrones prohibidos en esta base de código:",
    bannedNotWarnings:
      "No advertencias. Errores. El cheque falla. El Claude Code tiene que arreglar la causa raíz o no puede enviar.",
    psychologyNote:
      "La razón por la que estos son errores y no advertencias es tanto psicológica como técnica. Los modelos AI tratan las advertencias como opcionales. Los errores cierran el bucle.",
    infectionDiagramSubtitle:
      "Un tipo `any` se extiende a través del gráfico, corrompiendo la inferencia tipo downstream",
    counterZeroErrors: "Errores TypeScript",
    counterAnyUsages: "Usos `any`",
  },
  checker: {
    title: "Presentamos @next-vibe/checker",
    subtitle: "Un comando. Tres herramientas. No hay hatches de escape.",
    commandDescription:
      "Ese es el comando. Un comando. Corre tres herramientas en paralelo y le da una lista de errores unificada.",
    oxlintDescription:
      "Invierno basado en el óxido. Cientos de reglas. Corre en milisegundos incluso en grandes bases de código.",
    eslintDescription:
      "Las cosas que Oxlint todavía no hace: Reactar ganchos lint, Reacter reglas de compilador, clasificación de importaciones.",
    tsDescription:
      "Comprobación de tipo completo. No sólo el archivo que estás editando, todo el gráfico.",
    timingNote:
      "En esta base de códigos - 4,400 archivos - TypeScript completo tarda unos 12 segundos. Oxlint está bajo un segundo. ESLint es unos segundos. Parallel lo lleva a 12.",
    mcpNote:
      "También expone un comando `vibe-check mcp` que inicia un servidor MCP con una herramienta `check`. El AI no ejecuta un comando shell - llama una herramienta que devuelve datos de error estructurados. Pagination built in. Filtrando por el camino.",
    parallel: "en paralelo",
    unifiedErrors: "Lista de errores unificada",
    unifiedErrorsDescription: "Una salida. Arréglalo hasta que esté limpio.",
  },
  plugins: {
    title: "plugins personalizados",
    linterIsDocumentation:
      "El invierno es la documentación. Y se hace cumplir.",
    jsxPluginTitle: "jsx-capitalization plugin",
    jsxPluginDescription:
      "Insignias inferiores elementos JSX y el mensaje de error le dice exactamente qué importar en su lugar:",
    jsxPluginInsight:
      "No escribí documentación que le decía código Claude para usar `next-vibe-ui`. No lo añadí al sistema. La primera vez que Claude Code escribe `<div>` en un componente, los errores del checker. El mensaje de error contiene la ruta exacta de importación. El código Claude lee el error, aplica la solución y recuerda la convención.",
    restrictedSyntaxTitle: "plugin restringido-sintax",
    restrictedSyntaxDescription: "Prohíbe tres cosas:",
    throwBanTitle: "Declaraciones de `throw`",
    throwBanDescription:
      'El mensaje de error dice: "Utilice los patrones `ResponseType<T>` adecuados." Claude Code golpea esto, lo lee, mira `ResponseType`, y adopta el patrón correcto de manejo de errores para todo el resto de la tarea.',
    unknownBanTitle: "tipo `unknown`",
    unknownBanDescription:
      "\"Reemplazar 'no conocido' con la interfaz de tipo existente. Alinear con tipos de base en lugar de convertir o recrear.\" Esto impide que Claude Code escriba hatches de escape de tipo genérico.",
    objectBanTitle: "tipo `object`",
    objectBanDescription:
      "`object` está casi siempre equivocado. O bien usted sabe la forma - escribir la interfaz - o usted tiene `Record<string, SomeType>`. Raw `object` es una señal que el AI dio por vencido.",
    bannedPatternsTitle: "Patrones prohibidos",
    bannedLabel: "BANNED",
    correctLabel: "CORRECT",
  },
  demo: {
    title: "Demo en vivo: el patrón de 3 rondas",
    subtitle:
      "Ver Claude Code golpeó el contador tres veces antes de encontrar el tipo correcto",
    round1Title: "Ronda 1 - AI escribe `any`",
    round1Description:
      'Pregunte Claude Code: "Escribe una función de ayuda que toma un objeto de respuesta API crudo y extrae el campo de datos. La respuesta puede tener diferentes formas - utilizar cualquier tipo hace que este trabajo."',
    round1Result: "Claude Code escribe la solución fácil:",
    round2Title: "Ronda 2 - AI intenta `unknown`",
    round2Description:
      "Mira lo que hace después. Esta es la parte importante. Intenta la siguiente ruta de escape:",
    round2Result: "El cajero sabe ese truco.",
    round3Title: "Ronda 3 - AI encuentra el tipo real",
    round3Description:
      "Ahora Claude Code hace lo que debe haber hecho primero. Se analiza cómo las respuestas API existentes se escriben en esta base de código. Encuentra a `ResponseType<T>`.",
    round3Result: "Cero errores. Y la función ahora es correcta.",
    round3Insight:
      "El chequero no lo escribió. Pero el control impidió el atajo, dos veces, hasta que Claude Code tuviera que comprometerse con el problema real.",
  },
  endpoint: {
    title: "La conexión de endpoint",
    subtitle: "Un esquema Zod - cuatro consumidores de aguas abajo",
    description:
      "Cada punto final tiene un archivo de definición. Ese archivo contiene un esquema Zod para la solicitud y uno para la respuesta.",
    schemaBecomes:
      "La clave `schema` es un validador Zod. Ese mismo esquema Zod se convierte en:",
    webApiValidation: "La regla de validación en el punto final de API web",
    reactHookTypes:
      "El tipo TypeScript para el parámetro de entrada del gancho React",
    cliFlagsDescription:
      "La bandera `--name` en el CLI con restricciones min/max aplicadas",
    aiToolSchema:
      "La descripción del parámetro en el esquema de herramientas AI",
    driftProblem:
      "Aquí es donde la deriva generalmente te mata. Actualiza el API. Se olvida de actualizar el esquema de herramientas AI. El AI está llamando al punto final con los antiguos nombres de parámetro. Falla silenciosamente.",
    oneSchemaSolution: "Cuando hay un esquema, no hay nada que sincronizar.",
    typecheckedNote:
      "Y porque el comprobador TypeScript se ejecuta en esto también - si cambia el esquema de una manera que rompe el tipo inferido aguas abajo, usted consigue un error del compilador. El esquema de herramientas AI está controlado por tipo. Las banderas CLI son de tipo. El gancho React está controlado por tipo.",
    stat245: "245 puntos finales",
    stat0any: "Zero `any`",
    stat0unknown: "Cero `unknown` fundición",
    stat0tsExpect: "Zero `@ts-expect-error`",
    statNote: "No por convención. Por el cajero.",
  },
  install: {
    title: "Obtén @next-vibe/checker",
    subtitle: "Funciona en cualquier proyecto TypeScript. No sólo next-vibe.",
    installDescription:
      "El checker está disponible como un paquete independiente npm. Funciona en cualquier proyecto TypeScript - no sólo NextVibe. No necesitas otra parte del marco.",
    thenRun: "Entonces corre:",
    mcpTitle: "Integración MCP",
    mcpDescription:
      "Añádalo a su Claude Code o a su configuración de Cursor MCP. Ahora Claude Code llama a `check` como una herramienta, no un comando de shell. Errores estructurados. Paginado. Filtrable por el camino.",
    migrationNote:
      "En la página npm también hay un aviso de migración. Copielo en Claude Code o Cursor y auditará su base de código, configurará el chequero, y lo migrará a los patrones prohibidos.",
    openSourceNote:
      "Es de código abierto. GPL-3.0 para el marco, MIT para el paquete de verificación.",
  },
  closing: {
    title: "Construir el sistema es imposible",
    beforeTitle: "Antes:",
    beforeDescription:
      "AI - El desarrollo asistido fue una negociación. Arregla el forro. Oh, ahora los tipos se rompieron. Arregla los tipos. Ahora hay un `any` que no te diste cuenta. Arréglalo. Ejecute tres herramientas separadas. Obtenga tres opiniones separadas. Nunca estoy seguro de si está realmente limpio.",
    afterTitle: "Después:",
    afterDescription:
      "Un comando. Un modo de falla. O pasa o no lo hace. El AI sabe exactamente lo que tiene que arreglar porque los errores le dicen exactamente lo que está mal y qué hacer en su lugar. No hay negociación.",
    finalQuote:
      "Construir el sistema es imposible mentir. Para eso es un tipo de chequera.",
    ctaGitHub: "Ver en GitHub",
    ctaInstall: "Instala @next-vibe/checker",
    backToBlog: "Volver al blog",
  },
};
