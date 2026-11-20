import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativas a Character.AI sin filtros (2026)",
    description:
      "Alternativas a Character.AI sin filtros, comparadas según sus páginas de precios, filtros y privacidad: Janitor AI, SillyTavern, CrushOn, Kindroid, Nomi, Venice y {{appName}}. También puedes importar tus personajes de Character.AI.",
    category: "Comparación",
    imageAlt: "Caracter. AI alternativas sin filtro, comparado",
    keywords:
      "Caracter.AI alternativas, Caracter AI alternativa sin filtro, Personaje AI alternativa sin filtro, sitios como Personaje AI, aplicaciones como Personaje AI, carácter no censurado AI, NSFW Cara AI alternativa, Janitor AI alternativa, carácter de importación AI carácter, AI juego de roles sin filtro, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Comparación",
    readTime: "10 min leer",
    title:
      "Alternativas a Character.AI sin filtros. Comparamos con fuentes en mano.",
    subtitle:
      "Comparamos {{count}} alternativas y {{appName}} a partir de lo que publican sobre precios, filtros y privacidad. Verificado el {{date}}. Llévate tus personajes.",
  },
  intro: {
    lead: "Muchas listas de alternativas a Character.AI se copian entre sí. «Sin filtros», «gratis», «ideal para contenido adulto»: ¿quién lo verificó? Luego te registras y después de 50 mensajes te piden pagar o encuentras un filtro que nadie mencionó.",
    p2: "Leemos la página de precios, términos, política de privacidad y centro de ayuda de cada plataforma en {{date}}. Cada reclamación a continuación viene de esas páginas, con las fuentes un clic de distancia. Dirigimos una de estas plataformas, {{appName}}. Lo decimos primero, y te decimos dónde ganan los otros.",
  },
  criteria: {
    title: "Lo que realmente importa cuando cambias",
    intro: "Cinco preguntas. Responde antes de que elijas.",
    filter:
      'Filtro: ¿qué se permite, quién decide, y hay un cheque de edad? "Unfiltered" en una página de aterrizaje y "banned" en los términos suceden en el mismo sitio.',
    memory:
      "Memoria: cuánto de la historia que el modelo lee antes de cada respuesta. Pequeño contexto significa que tu personaje olvida los primeros capítulos.",
    price:
      "Precio: suscripción plana, límites de mensajes o pago por uso. Los niveles libres van desde ilimitadas a una vista previa de 50 mensajes.",
    privacy:
      "Privacidad: son tus chats almacenados, utilizados para el entrenamiento, usados para anuncios? El juego de roles es personal. Lee esta parte.",
    characters:
      "Caracteres: una gran biblioteca comunitaria, sus propias construcciones, o ambas. ¿Y puedes traer los que ya tienes?",
  },
  table: {
    title: "Todos ellos, lado a lado",
    intro:
      "Desplazar los laterales en el móvil. Los hechos del competidor comprobaron {{date}} en sus propias páginas. Los hechos de {{appName}} leen vivo desde nuestro config. Caracter. AI cierra la tabla como la base filtrada.",
  },
  us: {
    title: "{{appName}} : elegir el modelo, establecer el filtro",
    intro:
      "No es una aplicación de carácter con un modelo de casa. Un chat con modelos {{modelCount}}, donde los personajes son habilidades que eliges, construyes o importas.",
    models:
      "Modelos: {{uncensored}} modelos sin censura junto a los principales {{mainstream}} y los abiertos {{open}}. Interruptor por mensaje, mitad de escena. {{ownModel}} está entrenado en libros y documentos prohibidos desde Internet corriente, por lo que no dirige una historia oscura de vuelta a tierra segura.",
    characters:
      "Carácteres: la habilidad Roleplay le dice a cualquier modelo que se mantenga en el carácter. La página Skills lista caracteres incorporados y habilidades comunitarias otros usuarios publicados. Construya su propio en el editor, o deje que el Creador de la habilidad escriba uno con usted en un chat.",
    import:
      "Importación: pegar un personaje público. AI o Talkie enlace y obtener su propia copia del personaje, creador original acreditado.",
    privacy:
      "Privacidad: chats incognito permanecen en su navegador, no se necesita ninguna cuenta. Los chats privados se guardan sólo en su cuenta.",
    price:
      "{{guestCredits}} créditos gratis al mes sin cuenta y {{freeCredits}} con una cuenta. Planes desde {{subPrice}} al mes. Recarga un plan activo con paquetes de créditos que nunca vencen.",
    weak: "Donde somos más débiles: nuestra biblioteca comunitaria es pequeña al lado de Caracter. AI o Janitor AI, y los créditos se miden, por lo que las escenas largas en los modelos premium se suman.",
    skillsLink: "Explore las habilidades integradas y comunitarias",
    roleplayLink: "Abrir la habilidad de Roleplay",
    creatorLink: "Construir un personaje con el Creador de la Habilidad",
  },
  list: {
    title: "Las alternativas {{count}}, una a una",
    intro:
      "De sus propias páginas, comprobó {{date}}. Lo que cada uno es, lo que su filtro realmente permite, lo que cuesta, lo que le pasa a sus chats.",
    heading: "{{number}}. {{name}}: {{kind}}",
    filter: "Filtro:",
    price: "Precio:",
    priceValue: "Tier gratis: {{free}}. Pagado: {{plans}}.",
    privacy: "Privacidad:",
    pro: "La mejor parte:",
    con: "Atrapa:",
    forWho: "Escogelo si:",
    versusLink: "{{appName}} vs {{name}} : comparación completa",
    visit: "Visita {{name}}",
  },
  import: {
    title: "Traiga su carácter. caracteres AI con usted",
    intro:
      "Cambiar no significa empezar de nuevo. Importar un personaje desde su enlace público en menos de un minuto.",
    steps: {
      account: {
        title: "Iniciar sesión",
        body: "La importación necesita una cuenta gratuita, por lo que el personaje tiene un propietario.",
      },
      create: {
        title: "Abra el editor de caracteres",
        body: "En la página Habilidades, haga clic en Crear Habilidad Personalizada y seleccione Importar desde el enlace.",
      },
      paste: {
        title: "Pruebe el enlace público",
        body: "Caracter. AI (character.ai, c.ai) o Talkie (talkie-ai.com). Copiamos lo que la página pública muestra: nombre, avatar, saludo, descripción y etiquetas, además de la definición cuando el creador lo hizo público. Manténgalo privado, sin lista o público.",
      },
      model: {
        title: "Elija el modelo",
        body: "El personaje ahora se ejecuta en cualquiera de nuestros modelos. Comience en uno sin censura, cambie el escenario medio cuando un modelo se ponga plano. El hilo mantiene su historia.",
      },
    },
    callout:
      "El creador original se acredita en el carácter importado, con un enlace de vuelta a la fuente. Importar el mismo enlace abre dos veces su copia existente en lugar de un duplicado.",
  },
  privacy: {
    title: "¿Quién lee tu juego de roles?",
    intro: "En {{appName}}, aquí es exactamente lo que pasa.",
    incognito:
      "chats Incognito en vivo en el almacenamiento local de su navegador, no en nuestros servidores. Despejen los datos del navegador y se han ido.",
    transit:
      "Cada mensaje pasa a través de nuestro servidor al proveedor modelo que escribe la respuesta. Cada AI hospedado funciona de esa manera. El uso de crédito se registra para facturación.",
    others:
      "En otro lugar, lea la línea de privacidad en cada tarjeta anterior. Varias plataformas dicen en su propia política que los chats pueden entrenar sus modelos o anuncios de alimentación.",
    callout:
      "Incognito mantiene su historia fuera de nuestros servidores. No lo oculta del modelo que escribe las respuestas.",
  },
  stay: {
    title: "Cuando el personaje. AI sigue siendo la elección correcta",
    intro: "A veces el filtro es la característica.",
    library:
      "Quieres la biblioteca más grande de personajes listos y nunca quieres construir uno.",
    flat: "Usted desea mensajes ilimitados gratis y aceptar anuncios y un modelo filtrado a cambio.",
    filter:
      "El usuario es un adolescente, o el dispositivo se comparte con uno. Una aplicación bloqueada encaja mejor.",
    callout:
      "Sin filtrar significa que no hay red de seguridad. Lo que escribes y publicas es sobre ti, y la ley donde vives sigue vigente.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "¿Cuál es la mejor alternativa de carácter. AI sin filtro?",
      a: "Depende de lo que quieras. Una enorme biblioteca comunitaria gratuita: Janitor AI. Control completo en su propia máquina: SillyTavern. Un compañero a largo plazo con voz y selfies: Kindroid o Nomi. Selección modelo, modelos sin censura y sus propios personajes en un solo saldo: {{appName}}.",
    },
    free: {
      q: "¿Hay una alternativa gratuita de carácter. AI sin filtro?",
      a: "Sí. Janitor AI tiene un tier gratis con bots NSFW etiquetados sin límites. SillyTavern es software libre, usted suministra el modelo. {{appName}} otorga créditos gratis a {{guestCredits}} un mes sin cuenta y {{freeCredits}} con uno, modelos no censurados incluidos después de una confirmación de 18+ de una sola vez.",
    },
    import: {
      q: "¿Puedo mover mi personaje. caracteres AI a otra aplicación?",
      a: "En {{appName}}, sí: pega el enlace público del personaje y obtiene su propia copia con nombre, avatar, saludo, descripción y etiquetas, además de la definición si es pública. Los enlaces de Talkie también funcionan. Necesita una cuenta gratuita.",
    },
    nsfw: {
      q: "Qué carácter. Las alternativas AI permiten NSFW?",
      a: "Por sus propias páginas: Janitor AI permite bots NSFW etiquetados sin límite para adultos autodeclarados. CrushOn tiene un interruptor sin filtro después de un cheque de edad. Kindroid se llama sin filtrar con algunas líneas rojas. Nomi mantiene el texto sin filtrar y filtra la nudidad en imágenes. {{appName}} desbloquea los modelos sin censura después de una confirmación de 18+ única vez. Caracter. AI dice que el contenido pornográfico nunca será soportado.",
    },
    private: {
      q: "¿Qué alternativa mantiene mis conversaciones privadas?",
      a: "SillyTavern almacena chats en su propia máquina. En {{appName}}, los chats de incognito permanecen en su navegador. Venice dice que la historia permanece en tu dispositivo. Los mensajes a cualquier modelo hospedado todavía llegan al proveedor que los responde.",
    },
    account: {
      q: "¿Necesito una cuenta para probarlo?",
      a: "No en {{appName}} : incognito chat funciona sin uno. Necesitas una cuenta gratuita para importar caracteres, publicar tu propio y mantener chats a través de dispositivos.",
    },
    roleplayLink: "Juego de roles AI sin filtro: modelos, memoria y precios",
    kindsLink:
      "Abliterado, fino estudio o visión del mundo propia: los tres tipos de AI sin censura",
  },
  partners: {
    body: "Ejecutar una comunidad de juegos de rol, un Discord o un canal sobre caracteres AI? El programa socio {{appName}} paga el {{referralPercent}} % de cada pago que se refiere, cada mes.",
    link: "Ver el programa de socios",
  },
  cta: {
    title: "Trae un personaje. Escoge el modelo.",
    subtitle:
      "Créditos gratis {{guestCredits}} al mes, sin cuenta necesaria. Sin censura, abierta o incorporada: cambie en cualquier momento.",
    start: "Iniciar un juego de roles",
    skills: "Obtenga habilidades",
  },
};
