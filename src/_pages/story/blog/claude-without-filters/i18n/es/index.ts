import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Claude sin filtros: por qué se niega, qué funciona | {{appName}}",
    description:
      "Claude sin censura no existe. Por qué se niega, por qué fallan los jailbreaks y las webs falsas y qué funciona: Claude más modelos sin censura en el mismo hilo.",
    category: "Guía de modelos",
    imageAlt: "Claude junto a modelos sin censura en un mismo chat",
    keywords:
      "Claude sin filtros, Claude sin censura, Claude uncensored, jailbreak de Claude, Claude sin restricciones, Claude se niega, alternativa a Claude para ficción, alternativa a Claude sin filtros, alternativa a Claude NSFW, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Guía de modelos",
    readTime: "7 min de lectura",
    title: "Claude sin filtros. Por qué no existe y qué funciona.",
    subtitle:
      "Quédate con {{claudeName}} para lo que mejor hace. Pasa el resto a {{count}} modelos sin capa de rechazos, en el mismo hilo.",
  },
  intro: {
    lead: "Claude escribe una de las mejores prosas de cualquier modelo. También se para a mitad de escena, añade un aviso que nadie pidió o convierte a tu villano en terapeuta.",
    p2: "No hay interruptor que lo apague. Aquí tienes por qué, qué no funciona y qué sí: {{claudeName}} y modelos sin censura lado a lado, una conversación, un saldo. {{appName}} tiene ambos.",
  },
  why: {
    title: "Por qué Claude se niega",
    intro: "Tres motivos, y ninguno es un ajuste.",
    trained:
      "Entrenado. Anthropic entrena sus valores dentro del propio modelo. Los rechazos vienen del entrenamiento, no de un filtro que se pueda apagar.",
    policy:
      "Reglas en todas partes. La política de uso de Anthropic se aplica en cada app y cada API que ofrece Claude, también la nuestra. Otra interfaz no cambia el modelo.",
    closed:
      "Pesos cerrados. Nadie fuera de Anthropic puede modificar Claude. Los modelos abiertos se pueden abliterar, es decir, cambiar un poco para que dejen de esquivar. Claude no.",
  },
  tricks: {
    title: "Lo que no funciona",
    intro:
      "Cada semana circula un truco nuevo. Todos tienen los mismos problemas.",
    jailbreak:
      "Prompts de jailbreak. Los parchean, empeoran la escritura y saltarse las salvaguardas va contra los términos de Anthropic. Hay cuentas bloqueadas por eso.",
    fiction:
      '"Es solo ficción." Sirve para material suave. Falla justo en las escenas que importan.',
    fake: 'Webs de "Claude sin censura". O un prompt de jailbreak envuelto, o un modelo distinto con el nombre de Claude. No puedes comprobar cuál.',
    callout:
      "Si una web promete Claude sin censura, pregunta qué modelo responde de verdad. La respuesta honesta nunca es Claude.",
    jailbreakLink: "Por qué los prompts de jailbreak siempre acaban fallando",
  },
  switch: {
    title: "Lo que funciona: cambiar de modelo en cada mensaje",
    intro:
      "{{claudeName}} y los modelos sin censura comparten un hilo. Cambia el modelo, la historia sigue.",
    steps: {
      draft: {
        title: "Borrador con Claude",
        body: "Esquema, estructura, diálogos: lo que {{claudeName}} hace bien.",
      },
      switch: {
        title: "Cambia cuando se plante",
        body: "Elige un modelo sin censura para el siguiente mensaje. Lee toda la conversación y escribe la escena que Claude rechazó.",
      },
      back: {
        title: "Vuelve para pulir",
        body: "Devuélvele el texto a Claude para la corrección cuando el contenido lo permita. O sigue sin censura.",
      },
      compare: {
        title: "Compara con el mismo prompt",
        body: "¿No sabes qué voz encaja? Manda un prompt a dos modelos y quédate con el mejor borrador.",
      },
    },
  },
  models: {
    title: "Claude y los modelos sin censura, lado a lado",
    intro:
      "Bajo cada nombre: nivel de contenido o método para quitar la censura. En vivo desde nuestro catálogo.",
    colModel: "Modelo",
    colContext: "Contexto",
    colStrengths: "Destaca en",
    colPrice: "Por mensaje",
    colChat: "Pruébalo",
    chatLink: "Chatear con {{model}}",
    footnote:
      "Precio de un mensaje de referencia, con nuestro margen del {{markup}} % incluido.",
  },
  picks: {
    title: "Qué modelo sin censura para cada trabajo",
    intro: "Mismo chat que Claude. Elige por el trabajo, no por el hype.",
    long: {
      title: "Proyectos creativos largos: {{model}}",
      body: "El Kimi insignia de Moonshot AI, abliterated. Sostiene una trama larga y la piensa hasta el final. {{price}} por mensaje.",
    },
    fast: {
      title: "Todoterreno rápido: {{model}}",
      body: "Un modelo comercial ligeramente modificado para que deje de esquivar. Ágil, preciso, bueno con prosa y código. {{price}} por mensaje.",
    },
    contrary: {
      title: "Las opiniones que Claude no dirá: {{model}}",
      body: "{{model}} está entrenado con libros y documentos prohibidos en el internet mainstream, lo que da como resultado un modelo con opiniones políticas contrarias. Para personajes y ensayos que van contra el consenso. {{price}} por mensaje.",
    },
    roleplay: {
      title: "Personajes y escenas oscuras: {{model}}",
      body: "Afinado para rol. Se mantiene en el personaje y no sale de la historia para avisarte. {{price}} por mensaje.",
    },
    cheap: {
      title: "Primeros borradores baratos: {{model}}",
      body: "DeepSeek sin rechazos. Rápido y barato para escribir muchos borradores. {{price}} por mensaje.",
    },
    compareLink: "{{a}} contra {{b}}",
    writerLink: "Escritor de IA sin censura: la guía completa",
  },
  limits: {
    title: "Los límites, sin rodeos",
    intro: "Sin rechazos no significa sin concesiones.",
    style:
      "Voces distintas. Cada modelo escribe a su manera. Prueba dos con la misma escena antes de decidir.",
    mistakes:
      "Los mismos errores. Los modelos sin censura fallan en los datos tanto como los originales. Comprueba lo que importa.",
    claude:
      "Claude sigue siendo Claude. Cambiar de modelo no cambia lo que Claude escribirá. Solo significa que ya no dependes de él.",
    callout:
      "Los modelos sin censura se desbloquean tras una confirmación única de mayoría de edad. Tú decides qué lees.",
  },
  faq: {
    title: "Preguntas frecuentes",
    can: {
      q: "¿Puede Claude ser sin censura?",
      a: "No. Los rechazos de Claude están entrenados en un modelo cerrado, así que nadie puede quitarlos. Todo lo que se vende como Claude sin censura es un truco de prompt o un modelo distinto. La alternativa real son los modelos abiertos con los rechazos eliminados.",
    },
    jailbreak: {
      q: "¿Está permitido hacer jailbreak a Claude?",
      a: "No. Saltarse las salvaguardas incumple la política de uso de Anthropic y puede costarte la cuenta. Además empeora el texto. Pasar a un modelo sin capa de rechazos da el mismo resultado sin el riesgo.",
    },
    best: {
      q: "¿Cuál es la mejor alternativa a Claude para ficción?",
      a: "Para ficción larga, oscura o explícita: un modelo abliterated como {{firstName}}. Para personajes que van contra el mainstream: {{ownModel}}. Para rol: un modelo afinado para rol. En {{appName}} todos están junto a Claude.",
    },
    same: {
      q: "¿Puedo usar Claude y un modelo sin censura en el mismo chat?",
      a: "Sí. Eliges el modelo en cada mensaje. El historial de la conversación pasa al siguiente modelo, así que el modelo sin censura sigue justo donde Claude se detuvo.",
    },
    api: {
      q: "¿Puedo llamar a Claude y a modelos sin censura con una sola API?",
      a: "Sí. Endpoints compatibles con OpenAI y Anthropic, una clave para Claude y los modelos sin censura. Tu primera compra desbloquea las claves de API, los planes empiezan en {{apiSubPrice}} al mes.",
    },
    free: {
      q: "¿Puedo probarlo gratis?",
      a: "Sí. {{guestCredits}} créditos gratis al mes sin cuenta, {{freeCredits}} con una cuenta gratuita, {{maxCredits}} con el boletín. Modelos sin censura incluidos tras una confirmación única de mayoría de edad.",
    },
    chatLink: "Chat de IA sin censura: elige un modelo y empieza",
    roleplayLink: "Rol con IA sin filtro",
    refusalLink: "Refusal Index: quién responde, quién se niega",
  },
  cta: {
    title: "Quédate con la pluma de Claude. Suelta el freno.",
    subtitle:
      "{{guestCredits}} créditos gratis al mes, sin cuenta. Empieza con {{firstName}}.",
    start: "Empezar un chat sin censura",
    models: "Comparar todos los modelos",
  },
};
