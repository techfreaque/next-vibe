import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Generadores de imágenes con IA sin censura | {{appName}}",
    description:
      "{{uncensoredCount}} generadores de imágenes con IA sin censura junto a Flux, Seedream, GPT Image y Recraft: {{modelCount}} modelos, precio real, sin desenfoque.",
    category: "Comparación de modelos",
    imageAlt: "{{appName}} : generadores de imagen AI sin censura comparados",
    keywords:
      "sin censura AI generador de imagen, AI generador de imagen sin restricciones, AI generador de imagen sin filtro, NSFW AI generador de imagen, edición de imágenes sin censura, croma, lustificar, Qwen Editar sin censura, FLUX.3, Seedream 5.5, GPT Imagen, Recraft, AI generador de imagen precio por imagen, más barato AI generador de imagen, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Comparación de modelos",
    readTime: "8 min leer",
    title:
      "Generadores de imágenes con IA sin censura. Precios reales, sin difuminar nada.",
    subtitle:
      "{{modelCount}} modelos de imágenes de {{labCount}} laboratorios, con un solo saldo. {{uncensoredCount}} funcionan sin censura. Descubre qué hace cada modelo, cuánto cuesta una imagen y qué límites tiene.",
  },
  intro: {
    lead: "Escribiste un aviso normal. La imagen volvió borrosa, agrietada o rechazada. Un estudio de figuras, una cubierta de horror, una escena de tu propia novela. Los generadores de imagen de corriente principal filtran para el usuario más cauteloso de la tierra, y pagas una cuota mensual por el privilegio.",
    p2: "{{appName}} ejecuta modelos de imagen {{modelCount}} de laboratorios {{labCount}}, {{uncensoredCount}} de ellos sin censura, todo en un saldo de crédito. A continuación: qué modelos realmente generan sin un filtro, cada lado modelo con su nivel de filtro y precio real por imagen, las selecciones por trabajo, y cómo hacer o editar una imagen directamente desde un chat.",
  },
  exists: {
    title: "¿Hay un generador de imagen AI sin censura?",
    intro:
      "Si. {{uncensoredCount}} de ellos corren aquí, servido por Venice.ai sin borrón y sin rechazos. Dos hacen imágenes del texto, dos editan una imagen que les das.",
    models: {
      lustify:
        "Imagenes de adultos fotorreales. Construido para cuerpos y piel. Debilidad en texto en imágenes y escenas complejas.",
      chroma:
        "Pesos abiertos, reentrenados sin filtrado de contenido. Propulsores largos, amplia gama de estilos de arte, contenido explícito incluido.",
      qwenEdit:
        "Edición sin censura. Pásalo una foto y una instrucción: cambiar trajes, restyle, volver a trabajar la escena.",
      fireRed:
        "Ediciones exactas. Cambia lo que describiste y deja el resto de la imagen solo.",
      other:
        "Modelo de imagen sin censura. Vea la página modelo para lo que hace mejor.",
    },
    consent:
      "Los modelos sin censura son para adultos. La primera vez que usas uno, confirmas que tienes 18 años o más. Una vez. Después de eso, decides lo que haces, no una empresa.",
  },
  levels: {
    title: "Lo que los niveles de filtro significan para las imágenes",
    intro: "Cada modelo de imagen lleva uno de tres niveles.",
    mainstream:
      "Mainstream ({{mainstreamCount}} modelos): OpenAI y Recraft. Filtros más estrictos. Gran en texto y diseño, inútil para cualquier cosa que un equipo de seguridad de marca bandera.",
    open: "Abierto (modelos {{openCount}}): FLUX, Seedream, Qwen, Grok Imagine, Wan y más. Filtros más ligeros, fino para el arte oscuro y temas maduros, pero no explícito.",
    uncensored:
      "Sin censura (modelos {{uncensoredCount}}): sin filtro de nosotros, sin rechazo. Explicit output on the models built for it.",
    p1: "Escoge el nivel por imagen, no por cuenta. ¿Necesitas un producto limpio? Usa un modelo abierto. ¿Necesitas la escena que tu historia realmente llama? Usa uno sin censura. El mismo saldo, el mismo chat.",
  },
  table: {
    title: "Todos los modelos de imagen {{modelCount}}, lado a lado",
    intro:
      "No censurado primero, luego abierto, luego convencional. Los más baratos primero dentro de cada nivel. Los precios incluyen nuestra marca {{markup}} %. 1 crédito = {{creditValue}}.",
    colModel: "Modelo",
    colFilter: "Nivel de filtro",
    colInput: "Input",
    colCredits: "Créditos / imagen",
    colPrice: "Precio / imagen",
    inputText: "Texto",
    inputEdit: "Texto o imagen",
    perUnit: "{{perUnit}} imágenes por {{unit}}",
    footnote:
      '"Texto o imagen" significa que el modelo toma una imagen de referencia: ediciones, imagen a imagen, caracteres consistentes. El precio es el tamaño predeterminado; unos pocos modelos cobran más para tamaños más grandes. Modelos facturados por token en lugar de por imagen se sientan en la lista completa del modelo.',
    allModels: "Ver todos los modelos con las especificaciones completas",
  },
  picks: {
    title: "El mejor generador de imagen AI para cada trabajo",
    intro:
      "Ningún modelo gana. Seis puestos de trabajo, los modelos que se ajustan a ellos, los hechos duros bajo cada uno.",
    factLine:
      "Créditos {{credits}} ({{price}}) · {{perUnit}} por {{unit}} · {{tier}} · {{input}}",
    uncensored: {
      title: "Sin filtro: explícito y tabú",
      body: "De texto, nada borroso. Croma para rango: ilustración, pintura, fantasía, largos avisos detallados. Lustify for photoreal bodies. Ambos están entre los modelos más baratos de la plataforma.",
    },
    uncensoredEdit: {
      title: "Sin filtro: edita tu propia imagen",
      body: "Sube una imagen, di lo que cambia. Qwen Edit Uncensored es el que está etiquetado para la salida explícita. FireRed es el preciso. En ediciones duras, ejecute ambas.",
    },
    cheap: {
      title: "Los más baratos: borradores y volumen",
      body: "Thumbnails, tablas de estado de ánimo, probar un aviso antes del render real. {{cheapestName}} cuesta créditos {{cheapestCredits}}, imágenes {{cheapestPerUnit}} por {{unit}}.",
    },
    quality: {
      title: "Mejor detalle: el render final",
      body: "Cuando la imagen es la entregable. Detalle de afeitado, más rápido después. Borrar sobre un modelo barato, hacer que el guardián aquí.",
    },
    text: {
      title: "Texto en la imagen: carteles, logos, anuncios",
      body: "La mayoría de modelos mangle letras. Esto no lo hace. La artesanía está construida para el diseño. GPT Image mantiene los diseños densos intactos. Qwen Image 3 Pro es la opción abierta. Todos ellos están filtrados.",
    },
    references: {
      title: "Imágenes de referencia y caracteres consistentes",
      body: "La misma cara, el mismo producto, disparado después de disparo. Estos toman una o más imágenes de referencia. Los modelos {{editCount}} aquí toman una imagen como entrada.",
    },
  },
  chat: {
    title: "Haga una imagen de cualquier chat",
    intro:
      "No hay aplicación separada. Pregunte en cualquier chat en {{appName}} y el AI llama al generador de imagen para usted.",
    steps: {
      ask: {
        title: "Describir la imagen",
        body: "Asunto, estilo, luz, encuadre. Palabras sencillas. El AI escribe el aviso de generación.",
      },
      model: {
        title: "Utilice el predeterminado, o nombre un modelo",
        body: 'La configuración de imagen de su habilidad elige el modelo: {{defaultModel}} a menos que lo hayas cambiado. ¿Quieres otro? Dilo: "usar FLUX.3".',
      },
      edit: {
        title: "Adjuntar una imagen para editarla",
        body: "Suelta una imagen y di lo que cambia. Edits necesita un modelo que toma imágenes, como Qwen Editar Sin censura o Seedream. Los modelos solo de texto no pueden leer su imagen.",
      },
      result: {
        title: "Míralo, quédatelo.",
        body: "La imagen aparece en el chat en segundos y guarda su almacenamiento. Sigue hablando para refinarlo.",
      },
    },
    toolPage:
      "¿Quieres un control completo? La página generador de imagen establece el modelo, tamaño, relación de aspecto y calidad directamente.",
    toolLink: "Abra el generador de imagen",
    roleplayLink:
      "Arte de carácter para su juego de roles: la guía de juego de roles sin filtrar",
  },
  pricing: {
    title: "Qué cuesta una imagen AI aquí",
    intro: "Créditos por imagen. Un saldo paga por cada modelo.",
    perImage:
      "Cada modelo tiene un precio por imagen: el precio del proveedor más nuestra marca {{markup}} %, redondeado hasta una décima parte de un crédito. 1 crédito = {{creditValue}}.",
    range:
      "Los más baratos ahora: {{cheapestName}} at {{cheapestPrice}}. Los más baratos sin censura: {{uncensoredName}} en {{uncensoredPrice}}. Priciest: {{priciestName}} en {{priciestPrice}}.",
    failed:
      "Los créditos salen sólo después de que una imagen sea entregada. Trabajo fallido o rechazo de corriente: no pagas nada.",
    free: "Gratis: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account. En {{uncensoredName}} que es imágenes de {{freeUncensoredImages}} al mes para nada.",
    sub: "Planes mensuales: cuatro tamaños, comenzando en créditos {{subCredits}} para {{subPrice}}.",
    pack: "Paquetes para recargar los créditos de tu suscripción. {{packCredits}} créditos por {{packPrice}}. Nunca vencen. Paga con tarjeta, PayPal o criptomonedas.",
    link: "Ver planes y paquetes de crédito",
  },
  limits: {
    title: "Los límites, rectos",
    intro: "Conoce los bordes antes de pasar.",
    textOnly:
      "Los dos generadores no censurados solo toman texto. Para cambiar una imagen existente sin filtro, cambie a un modelo de edición sin censura.",
    specialists:
      "Los modelos sin censura son especialistas. Para la tipografía, logotipos y tomas de productos limpios, los modelos principales y abiertos son mejores.",
    upstream:
      "Modelos abiertos e convencionales corren detrás de la moderación de sus proveedores. Si uno se niega, no cuesta nada. Cambia a un modelo sin censura en lugar de rewords.",
    video:
      "El vídeo es diferente. Cada modelo de vídeo viene de un laboratorio con filtros de su proveedor. El sin censura se detiene en imágenes todavía.",
    law: "Ningún filtro significa que no hay red de seguridad. Lo que creas y publicas es sobre ti, y la ley donde vives sigue vigente. La imagen sexual de los menores es ilegal en todas partes. En muchos países, también es la imagen sexual de una persona real hecha sin su consentimiento.",
    callout:
      "Los adultos deciden lo que miran. Te damos las herramientas y los hechos, no una conferencia.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "¿Hay un generador de imagen AI sin restricciones?",
      a: "Sí. {{appName}} ejecuta modelos de imagen sin censura {{uncensoredCount}}: Chroma y Lustify hacen imágenes del texto, Qwen Editar Sin censura y FireRed edita tus propias imágenes. Sin borrón, sin rechazo. Una confirmación de 18+ de una sola vez los desbloquea.",
    },
    free: {
      q: "¿Hay un generador de imagen AI sin censura?",
      a: "{{guestCredits}} acredita un mes sin cuenta, {{freeCredits}} con una cuenta gratuita. {{uncensoredName}} cuesta créditos {{uncensoredCredits}} por imagen. Después de eso: un plan, desde {{subPrice}} al mes.",
    },
    cheapest: {
      q: "¿Cuál es el generador de imagen AI más barato?",
      a: "Ahora mismo {{cheapestName}} en {{cheapestCredits}} créditos ({{cheapestPrice}}) por imagen. Todos los precios de {{modelCount}} están en la tabla anterior, lea en vivo desde nuestro registro modelo.",
    },
    edit: {
      q: "¿Puedo editar una foto sin filtro?",
      a: "Sí. Adjuntar la imagen en un chat y describir el cambio, a continuación, nombre Qwen Editar Uncensored o FireRed. Los modelos de edición abierta y corriente principal aplican los filtros de sus proveedores.",
    },
    consent: {
      q: "¿Por qué necesito confirmar que tengo 18 años?",
      a: "Los modelos no censurados pueden producir contenido explícito. Usted confirma una vez que usted es un adulto, y eso es todo. Sin carga ID, sin advertencias repetidas.",
    },
    watermark: {
      q: "¿Las imágenes tienen una marca de agua?",
      a: "No de nosotros. Sin logo, sin superposición. Algunos laboratorios incrustan datos de procedencia invisible por sí mismos, que provienen del laboratorio.",
    },
    api: {
      q: "¿Puedo generar imágenes a través del API?",
      a: "El {{appName}} API cubre los modelos de chat en los formatos OpenAI y Anthropic. La generación de imágenes se ejecuta en el chat y en la página generador de imagen.",
    },
    videoLink: "Compare los generadores de vídeo AI",
    chatLink: "Lea la guía de cada modelo de chat sin censura",
  },
  partners: {
    body: "¿Ejecutar un canal o comunidad sobre el arte AI? El programa socio {{appName}} paga una parte recurrente de cada pago que se refiere.",
    link: "Ver el programa de socios",
  },
  cta: {
    title: "Escoge un modelo. Haz la foto.",
    subtitle:
      "Créditos gratis {{guestCredits}} al mes, sin cuenta necesaria. Sin censura, abierta o convencional, por imagen.",
    generate: "Generar una imagen",
    models: "Examine todos los modelos",
  },
};
