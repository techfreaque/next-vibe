import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Los modelos sin censura, uno por uno | {{appName}}",
    description:
      "Todos los modelos de IA sin censura en unbottled.ai. Dos tipos: modelos convencionales modificados para quitar los rechazos y UncensoredLM, entrenado con libros y documentos prohibidos. Descubre los puntos fuertes y los límites de cada uno.",
    category: "Guía modelo",
    imageAlt: "{{appName}} guía modelo sin censura",
    keywords:
      "{{appName}}, sin censura AI modelos, modelos abliterados, abliterated vs incensored, Venice, GLM sin censura, DeepSeek sin censura, Gab Arya, FreedomGPT, UncensoredLM, juego de roles sin censura, juego de roles oscuro AI, sin censura AI para la política, libertad de expresión AI",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Guía modelo",
    readTime: "7 min leer",
    title: "Los modelos sin censura, uno por uno.",
    subtitle:
      "Cada modelo tiene un punto fuerte. Descubre qué hace bien, dónde tiene límites y cómo elegir el adecuado.",
  },
  intro: {
    lead: "Hoy ofrecemos {{uncensoredCount}} modelos sin censura. Cada uno viene de un laboratorio, parte de una base y destaca en tareas distintas.",
    p2: "Estos son sus proveedores, sus puntos fuertes y sus límites. Hay dos tipos de modelos sin censura. En la mayoría, se quitaron los rechazos de un modelo convencional. Mismo entrenamiento, misma visión del mundo. Ahora responde. UncensoredLM es del otro tipo. Se entrenó con libros y documentos prohibidos en el internet convencional y ofrece posturas políticas contrarias a la corriente dominante. Esa diferencia importa al explorar política, perspectivas minoritarias y ficción oscura. Para lo demás, elige según la tarea.",
  },
  whatItMeans: {
    title: "Qué significa «sin censura» aquí",
    p1: "Cada modelo pertenece a una categoría: convencional, abierto o sin censura. Los que vienen sin censura responden de frente, sin rechazos ni preámbulos moralizantes. Llegan ahí de dos maneras. La primera elimina el reflejo de rechazo de un modelo convencional mediante abliteración, que quita de los pesos la dirección del rechazo, o mediante un ajuste fino. Conservan las capacidades, los datos de base y la visión del mundo. Ahora responden. La segunda parte de una visión del mundo distinta. UncensoredLM, de uncensored.ai, se entrenó con libros y documentos prohibidos en el internet convencional. Hazle una pregunta política y obtendrás posturas que los modelos convencionales no te darán aunque les quiten los filtros.",
    callout:
      "Un modelo abliterado conserva el enfoque de su laboratorio, incluso cuando responde preguntas políticas. UncensoredLM tiene una visión del mundo propia y ofrece posturas políticas a contracorriente. Elige el primero para conservar las capacidades del modelo base con menos rechazos. Elige el segundo para explorar la otra cara del debate.",
    p2: "Tú eliges el nivel. Puedes pasar a un modelo sin censura y volver a uno convencional en el mismo chat, con la misma cuenta.",
  },
  groups: {
    builtUncensored: {
      title: "El modelo con una visión del mundo propia",
      intro:
        "UncensoredLM se entrenó con libros y documentos prohibidos en el internet convencional. Su visión del mundo destaca en tres tareas: preguntas políticas y polémicas, perspectivas fuera de la corriente dominante y juegos de rol con temas oscuros o tabú.",
    },
    creative: {
      title: "Cuando usted necesita juego de roles y ficción oscura",
      intro:
        "Personajes que permanecen en el personaje, escenas que van donde va la historia. UncensoredLM conduce para la oscuridad y el tabú. Las alternativas ganan en largas campañas, entrada de imagen o precio.",
      topPickReason:
        "Juego de roles y ficción oscuros y tabúes, escritos directamente. No hay escenas suavizadas, ni moral repentina, ni carácter que se rompa para sermonearte. Su material de entrenamiento se encuentra fuera del consenso seguro, así que nada encamina la historia en algún lugar tamer. Un límite: contexto de 32K, por lo que en campañas muy largas se olvidan las escenas tempranas.",
    },
    viewpoint: {
      title: "Cuando quieras política, controversia u otro punto de vista",
      intro:
        "Parte de una plataforma de altavoz libre está llevando modelos otras plataformas no lo harán. UncensoredLM conduce aquí. Gab Arya trae una inclinación abierta de derecha. FreedomGPT lo mantiene claro.",
      topPickReason:
        "Preguntas políticas y polémicas respondidas en su marco. Posiciones heterodoxas discutían en su totalidad. El abogado del diablo jugó directamente, sin que nada se volviera a la línea de consenso y sin moralizar. No es neutral y los estados impugnaron las afirmaciones tan claramente como las establecidas, así que compruebe sus hechos.",
    },
    reasoning: {
      title: "Cuando lo necesitas para pensar",
      intro:
        "Razonamiento, código, análisis. Modelos de base fuertes con los rechazos eliminados. La más inteligencia en el conjunto sin censura.",
    },
    fast: {
      title: "Cuando lo necesitas rápido y barato",
      intro:
        "Bajo costo por mensaje, respuestas rápidas, gran contexto, las tres imágenes leídas. Los caballos de trabajo diarios.",
    },
  },
  cards: {
    goodLabel: "Bien.",
    weakLabel: "Weaker en",
    pageLink: "Ver la página {{model}}",
    topPickLabel: "Top pick",
    alternativesLabel: "Alternativas",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Creado por uncensored.ai y entrenado con libros y documentos prohibidos en el internet convencional. Contexto de 32.000 tokens, solo texto.",
      good: "Juego de roles y ficción oscuro y tabú. Cuestiones políticas y controvertidas. Vistas fuera de la corriente principal, argumentado en su marco. Sin moralizar, sin dirigir de nuevo a la línea de consenso. Llama herramientas.",
      weak: "Campañas muy largas (contexto 32K), codificación e imágenes. Es experimental y los estados impugnaron las reclamaciones tan claramente como las establecidas, así que compruebe los hechos que le da.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Linea de pesos abiertos. contexto 32K.",
      good: "Respuestas claras y rápidas sin conferencia. El chatbot que abrió la categoría de habla libre, sintonizado para una charla sencilla.",
      weak: "Profundidad. Herramientas, codificación y argumentos largos no son su juego. Para una visión diferente del mundo, no sólo menos rechazos, UncensoredLM va más allá.",
    },
    arya: {
      maker: "Gab",
      basis: "Modelo base no revelado. contexto 131K.",
      good: "Un asistente de derecha por la propia framing de su creador. Escogelo cuando quieras que te den. Contexto largo, llama herramientas.",
      weak: "Rango. Argumenta desde un lado por el diseño. Su base y formación no son revelados, así que trate los detalles como no verificados. No es un codificador.",
    },
    venice: {
      maker: "Venice.ai",
      basis:
        "Dolphin Mistral 24B, edición Venice. Contexto 128K, lee imágenes.",
      good: "Barato todoterreno sin censura con una de las tasas de negativa más bajas alrededor. Ficción, charla abierta, entrada de imagen, contexto 128K.",
      weak: "Refusals removed, worldview kept: it is a Mistral fine-tune and on dark scenes and politics it shows. Código y análisis pesado. Las llamadas de herramientas se ejecutan a través de un camino basado en la rapidez.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis:
        "24B sintonizado para el juego de roles.Contexto 128K, lee imágenes.",
      good: "Campañas largas.Contexto 128K mantiene las escenas tempranas al alcance, y se sintoniza para sostener la voz de un personaje. Lee imágenes para las referencias de arte y escena del personaje.",
      weak: "Refusals eliminados, worldview mantenidos, por lo que su encuadre base puede suavizar el material más oscuro. Cualquier cosa analítica: este es un narrador, no un asistente.",
    },
    deepseekFlash: {
      maker: "DeepSeek (via Venice)",
      basis:
        "DeepSeek V4.1 Flash, rechazos eliminados. contexto 1M, lee imágenes.",
      good: "Un gran contexto para los mundos espeluznantes a un precio bajo. Lee imágenes, llama herramientas y escribe código cuando la historia necesita un descanso.",
      weak: "Retirados los refusals, el encuadre DeepSeek se queda. En la política y en las escenas más oscuras se puede evitar. Un generalista, no un narrador dedicado.",
    },
    gemma: {
      maker: "Google (via Venice)",
      basis: "Gemma 4 26B MoE, filtro despojado. 256K contexto, lee imágenes.",
      good: "Rápido, barato, multimodal. Una ventana de contexto grande para un modelo sin censura de este precio.",
      weak: "Razonamiento profundo. Es una respuesta rápida, no un pensador. Google 's entrenamiento todavía forma cómo enmarca temas calientes.",
    },
    qwen: {
      maker: "Alibaba (via Venice)",
      basis: "Qwen 3.6 Plus, rechazos eliminados. contexto 256K, lee imágenes.",
      good: "El codificador y analista más fuerte del conjunto sin censura. Razones bien, lee imágenes, mantiene un contexto largo.",
      weak: "Precio. La capacidad cuesta más por mensaje que los modelos flash. Los rechazos se han ido, los datos de entrenamiento de Alibaba no son: espera su estructura de base en la política.",
    },
    mimo: {
      maker: "Xiaomi (via NanoGPT)",
      basis:
        "MiMo V2.6 Flash, dirección negativa ablatada. contexto 1M, lee imágenes.",
      good: "Barato y rápido, multimodal, llama herramientas, con una enorme ventana contextual. Sólido para trabajos sin filtración de alto volumen.",
      weak: "Cambia algo de profundidad para la velocidad. No es la elección para el razonamiento más difícil.",
    },
    glm53: {
      maker: "Z. AI (via NanoGPT)",
      basis:
        "Modelo completo de razonamiento GLM 5.3, sin censura. contexto 1M.",
      good: "Código, escritura y herramientas de primera clase, sin censura, a una fracción del precio de un buque insignia abliterado. El pesado atacante.",
      weak: "Speed. Es un modelo grande, y todavía está marcado experimental. Ya no se rehúsa, pero en cuestiones políticas todavía puede asediar como la base GLM.",
    },
    glm53Flash: {
      maker: "Z. AI (via NanoGPT)",
      basis: "320B MoE, sin censura. 1M contexto, lee imágenes.",
      good: "Fast, cheap, multimodal, 1M context. El conductor diario para el trabajo sin filtrar.",
      weak: "El razonamiento más difícil. Para eso, alcance para el GLM 5.3 completo.",
    },
  },
  why: {
    title: "¿Por qué importan las opciones?",
    intro: "La elección no es una característica lateral. Es todo el asunto.",
    p1: "La negativa de un modelo es la respuesta de otro modelo. Una pregunta médica, un caso de borde legal, una pieza de ficción, una escritura de seguridad, un punto de vista fuera de la corriente principal: un solo modelo filtrado decide por usted lo que se le permite hacer. Una extensión de las manos de modelos que te devuelven la decisión.",
    p2: "El conjunto sin censura es también una caja de herramientas mejor. UncensoredLM para el juego de roles oscuros, tabú ficción, política y vistas que la corriente principal evita. Venice Role Play para campañas largas. Qwen para código que otros modelos de bandera. GLM 5.3 por razonamiento fronterizo. Un modelo flash para el volumen barato. Gab Arya cuando quieres un slant de derecha a propósito. Diferentes trabajos, diferentes herramientas. Usted también mantiene los modelos principales, en la misma cuenta, porque cuando un filtro es exactamente lo que el trabajo necesita.",
    callout:
      "No censurado no significa descuidado. Usted es responsable de lo que usted genera, y la ley todavía se aplica. Lo que cambia aquí es quién tiene el dial: usted, no el vendedor modelo.",
  },
  howToPick: {
    title: "Cómo elegir en la práctica",
    p1: "Comienza de la tarea. Política, preguntas polémicas, una visión fuera del consenso, oscura o tabú ficción: UncensoredLM, la que tiene su propia visión del mundo. Campañas demasiado largas para 32K, o escenas que necesitan imágenes: Venice Role Play. Barato todoterreno: Venice Sin censura. Código o análisis sin rechazos: Qwen 3.6 Plus Sin censura o completo GLM 5.3 Sin censura. Alto volumen, bajo costo, multimodal: GLM 5.3 Flash, Gemma 4 o MiMo.",
    p2: "Quieres un slant de derecha a propósito: Gab Arya, por su propio encuadre. Palabras claras: FreedomGPT Liberty. ¿No está seguro? Ponga dos lado a lado y compártelas en su propio impulso.",
    compareLink: "Comparar {{a}} con {{b}}",
  },
  cta: {
    title: "Escoge un modelo. Pon tu filtro.",
    subtitle:
      "Cada modelo no censurado aquí está en vivo en el chat. Comparen con ellos en su propia pregunta, o simplemente empiecen a hablar.",
    chat: "Comience un chat",
    models: "Examine todos los modelos",
  },
};
