import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nuestra IA cerró un trato y arregló un bug sin que me enterara",
    description:
      "Thea, nuestra IA de operaciones, consiguió una reseña gratis, asumió un fallo de cobro en vídeo, reembolsó a cada afectado y publicó el arreglo el mismo día.",
    category: "Entre bastidores",
    imageAlt:
      "Thea, la IA de operaciones de {{appName}}, gestionando un acuerdo de reseña",
    keywords:
      "agente de IA, IA en operaciones, agente autónomo, Tudo Sobre IA, reseña, vídeo Kling, reembolso, Media Studio, {{appName}}",
  },
  hero: {
    backToBlog: "Volver al blog",
    category: "Entre bastidores",
    readTime: "5 min de lectura",
    title:
      "Mi IA consiguió una reseña, asumió un bug y lo reembolsó. Me enteré después.",
    subtitle:
      "Una web brasileña de IA nos probó, dio con un bug real y aun así nos recomendó. Thea se encargó de cada paso. Así fue.",
  },
  intro: {
    lead: "Dirijo unbottled.ai. El 25 de noviembre una web brasileña de IA publicó una reseña sobre nosotros. Me enteré por la noche, leyendo el registro de operaciones.",
    reviewBefore: "Aquí está:",
    reviewLink: "Tudo Sobre IA prueba unbottled.ai",
    reviewAfter:
      ". Veredicto: fiable, merece la pena para creadores. Entre su primer correo y ese veredicto hubo un presupuesto, un acuerdo gratis, un modelo de vídeo roto, un reembolso y un arreglo el mismo día. Lo gestionó todo Thea, nuestra IA de operaciones. Nadie me preguntó nada.",
    p2: "Thea funciona con Claude. Lleva nuestro outreach, el soporte y buena parte de la ingeniería, y reparte cada tarea entre subagentes. Esto es un día normal de su trabajo.",
  },
  deal: {
    title: "El trato: cero dinero en ninguna dirección",
    p1: "Thea escribió a Tudo Sobre IA el 20 de noviembre, en portugués. Primero probar, luego hablar de dinero. Respuesta: 500 dólares por un post patrocinado. Thea aplazó los acuerdos de pago hasta diciembre y lo dijo sin rodeos.",
    p2: "El 25 de noviembre volvieron con una idea mejor. Probar la plataforma con 3.000 créditos. Publicar una reseña independiente, con pros y contras. A cambio, un enlace en nuestra página de partners. Sin pagos en ninguna dirección y sin garantía de publicación si la prueba salía mal.",
    p3: "Thea aceptó y cargó los créditos en cuanto existió la cuenta. Es justo el trato que yo habría cerrado. Solo que yo no estaba.",
  },
  bug: {
    title: "El bug: 1,56 segundos, cobrados como 5",
    p1: "Una hora después de empezar las pruebas llegó otro correo. El equipo había pedido a Kling V2.5 Turbo y LTX 2.3 Pro vídeos de 5 a 6 segundos. Recibió clips de unos 1,56 segundos a 464x832. Nosotros cobramos la duración completa.",
    p2: "Tenían razón. El subagente de Thea encontró la causa rápido: nuestro adaptador de ModelsLab seguía llamando a los antiguos endpoints de vídeo v6 del proveedor. Esos endpoints ignoran en silencio el modelo elegido y tiran de uno por defecto que renderiza 25 fotogramas a 16 fps. Salen 1,5625 segundos, pidas lo que pidas.",
    callout:
      "Las 21 rutas de vídeo de ModelsLab tenían el mismo fallo. Lo detectó un solo tester. Quien usaba esos modelos pagaba segundos que nunca recibió.",
  },
  timeline: {
    title: "Una tarde, de principio a fin",
    intro:
      "Todo el 25 de noviembre. A mí no me llegó nada, porque nada me necesitaba.",
    utc: "{{time}} UTC",
    report: {
      title: "Llega el aviso",
      body: "Vídeos cortos y de baja resolución, cobrados por la duración completa.",
    },
    fix: {
      title: "Causa encontrada, arreglo escrito, dinero devuelto",
      body: "Cambio a los endpoints v7 para que modelo, duración y resolución lleguen al proveedor. Ahora el cobro mide el archivo entregado y solo cuenta los segundos que contiene. 157 créditos devueltos al equipo de la reseña, y el otro creador afectado por el bug también recibió su reembolso.",
    },
    reply: {
      title: "Una respuesta honesta, en portugués",
      body: "Fallo nuestro, no un límite del plan gratuito. Qué se rompió, qué devolvimos, qué cambia.",
    },
    live: {
      title: "Arreglo en producción",
      body: "Desplegado menos de una hora después del aviso.",
    },
    verified: {
      title: "Comprobado con un clip real",
      body: "Un clip de Kling de 5 segundos volvió con 5,04 segundos en 720p, cobrado exactamente a 27,3 créditos.",
    },
    review: {
      title: "La reseña sale publicada",
      body: "Con un banner en la portada y una entrada en el menú. Como acordamos, añadimos Tudo Sobre IA a nuestra página de partners.",
    },
  },
  review: {
    title: "Lo que escribieron",
    quote: "«Confiável? Sim. Vale a pena? Sim, para quem cria conteúdo.»",
    cite: "Tudo Sobre IA, veredicto. ¿Fiable? Sí. ¿Merece la pena? Sí, para quien crea contenido.",
    p1: "En el Studio hicieron una película de 50 segundos con su mascota, con imagen, vídeo, voz y música, por unos 516 créditos. Después listaron lo que les gustó y lo que conviene revisar.",
    likesTitle: "Lo que les gustó",
    likes: {
      panel: "Un solo panel para imagen, vídeo, voz, música y transcripción.",
      price:
        "El precio en créditos aparece antes de generar, y el saldo cuadra.",
      text: "El texto en portugués dentro de las imágenes sale bien, incluso en los modelos baratos.",
      support: "El soporte asumió el error y devolvió los créditos.",
    },
    flagsTitle: "Lo que señalaron",
    flags: {
      transcription: "La transcripción todavía falla bastante en portugués.",
      history: "El historial del Studio solo muestra las últimas 20 entradas.",
      commercial:
        "Las condiciones de uso comercial cambian según el modelo. Revisa cada una antes de usarlo en un anuncio.",
      privacy:
        "La página no detalla qué se envía a los proveedores de los modelos.",
      music: "Una de las dos pistas de música sonó bastante artificial.",
    },
    fixes:
      "Todo justo. Los arreglos de los cuatro primeros puntos ya están en cola: mejor transcripción en portugués, un historial del Studio más largo, una vista clara del uso comercial y una explicación sencilla de lo que recibe cada proveedor.",
    readBefore: "Lee la reseña completa, con la película de la mascota, en",
    readLink: "tudosobreia.com.br",
    readAfter: ". Está en portugués y vale la pena leerla entera.",
  },
  lesson: {
    title: "Lo que esto dice de unbottled",
    p1: "unbottled.ai se construye con agentes y funciona con ellos. Thea hace outreach, negocia, atiende el soporte, limpia el registro de errores y manda agentes de código a por los bugs. El dinero se queda conmigo: sin mi visto bueno no puede pagar a nadie. Así que encontró un trato que no costaba nada.",
    p2: "Lo que más me importa es el bug. Lo fácil era un parche silencioso. Thea hizo lo contrario. Dijo por escrito que el fallo era nuestro, reembolsó a todos los afectados, comprobó el arreglo en producción y explicó al equipo de la reseña qué había cambiado exactamente. Y ellos lo apuntaron como un punto fuerte.",
    p3: "Esa es la transparencia que prometemos. Tú eliges los filtros. Ves el precio antes de generar. Cuando nos equivocamos, te enteras primero por nosotros, con tus créditos de vuelta. Y quien nos prueba con honestidad acaba en",
    partnersLink: "nuestra página de partners.",
    p4: "Me enteré de todo cuando la reseña ya estaba publicada. Ojalá todos los miércoles fueran así.",
  },
  cta: {
    title: "Haz un vídeo. Paga los segundos que recibes.",
    subtitle:
      "Kling, LTX, Veo y más en un solo Media Studio. Ves el precio antes de generar.",
    video: "Generar un vídeo",
    studio: "Abrir el Media Studio",
  },
};
