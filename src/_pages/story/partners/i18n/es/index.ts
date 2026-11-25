import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Programa de socios {{appName}}: {{directPct}} recurrente",
    category: "Asociados",
    description:
      "Creadores, newsletters y directorios: gana el {{directPct}} de cada compra de quien envíes a {{appName}}. Recurrente, sin tope, medido por enlace. Créditos o BTC/USDC.",
    imageAlt: "{{appName}} Partner Program",
    keywords:
      "{{appName}}, programa de afiliados, programa de socios, afiliado AI no censurado, comisión recurrente, programa creador, patrocinador de newsletter",
  },
  hero: {
    eyebrow: "Programa de socios",
    title:
      "Tu público quiere una IA que responda de frente. Cobra por presentársela.",
    subtitle:
      "Recibe el {{directPct}} de cada compra mientras sigan pagando. Sin límite. Usa un enlace de seguimiento por video, edición del boletín o ficha para saber cuál te trae clientes.",
    ctaPrimary: "Consigue tu enlace de socio",
    ctaSecondary: "Lee las condiciones",
  },
  facts: {
    commission: "de cada compra, recurriendo",
    capValue: "Sin límite",
    cap: "sobre las referencias o los ingresos",
    holdValue: "Días de {{holdDays}}",
    hold: "ventana de devolución, entonces es tuya",
    minPayout: "retiro mínimo",
  },
  audience: {
    label: "Para quién es",
    title: "Construido para personas que ya hablan de AI",
    intro:
      "Si tu audiencia golpea rechazos, filtros o muros de precio, ya tienes el campo. Te damos el enlace y los números.",
    creators: {
      title: "Creadores",
      body: "YouTube, TikTok, arroyos. Suelte un enlace por vídeo en la descripción. Vea qué vídeo trae a los usuarios que pagan, no sólo clics.",
    },
    newsletters: {
      title: "Boletines y blogs",
      body: "Un enlace por tema o post. Los lectores que se inscriben permanecen atribuidos a usted, por lo que una sola mención sigue pagando.",
    },
    directories: {
      title: "Directorios y sitios de revisión",
      body: "Llámanos con tu enlace. Cada usuario que se registra desde su lista está atado a usted para siempre.",
    },
  },
  steps: {
    label: "Cómo funciona",
    title: "Vivir en 5 minutos",
    intro: "Sin aplicación, sin cola de aprobación, sin audiencia mínima.",
    step1: {
      title: "Crear una cuenta gratuita",
      body: "Inscríbete. La página de referencia se abre justo después.",
    },
    step2: {
      title: "Haga un código, luego un enlace por ubicación",
      body: "Elige un código de referencia una vez. A continuación, crear un enlace rastreado para cada vídeo, edición o listado. Cada uno cuenta sus propias visitas, suscripciones y sus ingresos.",
    },
    step3: {
      title: "Compártelo",
      body: "Descripción, comentario grabado, pie de boletines, lista de directorios. Cualquiera que se inscriba en él es tuyo.",
    },
    step4: {
      title: "Obtenga el pago en cada compra",
      body: "{{directPct}} de cada pago de suscripción y paquete de crédito que compran. Después de la ventana de reembolso {{holdDays}} -día se convierte en créditos que puede gastar o retirar.",
    },
  },
  terms: {
    label: "Los términos",
    title: "Todo lo que decide lo que ganas",
    intro:
      "No hay tijeras para desbloquear, no hay buena impresión más allá de esta tabla.",
    rows: {
      commission: {
        term: "Comisión",
        value:
          "{{directPct}} de cada compra por los usuarios se refiere: suscripciones y paquetes de crédito.",
      },
      duration: {
        term: "Duración",
        value:
          "Recurriendo mientras sigan pagando. Una vez que alguien se inscribe a través de su enlace, se quedan los suyos.",
      },
      cap: {
        term: "Cap",
        value: "Ninguno. No en los usuarios, no en las ganancias.",
      },
      hold: {
        term: "Ventana de reembolso",
        value:
          "Los nuevos ingresos permanecen pendientes para los días de {{holdDays}}. Un reembolso o devolución dentro de esa ventana los cancela. Después de eso, están confirmados.",
      },
      payout: {
        term: "Pagos",
        value:
          "Pasar ganancias confirmadas como créditos 1:1, o retirar a BTC o USDC.",
      },
      minimum: {
        term: "Retiro mínimo",
        value:
          "{{minPayout}}. Los pagos de Crypto se procesan dentro de las horas {{cryptoPayoutHours}} después de la aprobación.",
      },
      second: {
        term: "Segundo nivel",
        value:
          "Cuando alguien a quien se refiere trae en sus propios usuarios, también ganas {{level2Pct}} de lo que esos usuarios pagan.",
      },
      tracking: {
        term: "Seguimiento",
        value:
          "Código de referencia más etiquetas UTM en cada enlace. Visitas, inscripciones, usuarios de pago y ganancias por enlace, viven en su página de referencia.",
      },
    },
  },
  product: {
    label: "Lo que les estás mandando a",
    title: "Una plataforma AI que su público puede recomendar",
    intro: "Fácil de lanzar porque arregla lo que la gente se queja.",
    choice: {
      title: "Modelos convencionales, abiertos y sin censura",
      body: "Los modelos de gran nombre junto a los abiertos y sin censura, en un solo chat. No censurado viene en dos tipos: modelos dominantes con los rechazos cortados, y UncensoredLM, entrenados en libros y documentos prohibidos de la Internet corriente. Los usuarios cambian cuando quieran.",
    },
    control: {
      title: "Ellos fijan el nivel de filtro",
      body: "No hay rechazos silenciosos decididos por ellos. Cada usuario elige cuánto filtran que quieren.",
    },
    free: {
      title: "Gratis para empezar",
      body: "Los nuevos usuarios prueban el chat sin una tarjeta. Fácil si para tu audiencia, fácil conversión para ti. Desarrolladores: el API necesita cualquier plan, desde {{subPrice}} al mes.",
    },
  },
  press: {
    label: "Nos han probado",
    title: "A prueba en un proyecto real",
    intro:
      "Medios independientes nos pusieron a trabajar y publicaron lo que encontraron.",
    items: {
      tudoSobreIa: {
        meta: "Brasil · noviembre 2026",
        body: "Crearon su mascota y un vídeo de 50 segundos con nuestros modelos de imagen, vídeo, voz y música. Veredicto: merece la pena para creadores.",
        link: "Leer la reseña (en portugués)",
      },
    },
  },
  faq: {
    label: "FAQ",
    title: "Preguntas que los socios hacen",
    items: {
      audience: {
        q: "¿Necesito un público mínimo?",
        a: "No. Sin aplicación, sin cuenta de seguidor. Un lector que suscribe te paga cada mes que se quedan.",
      },
      counts: {
        q: "¿Qué cuenta como una compra?",
        a: "Cada pago de suscripción y cada paquete de crédito que un usuario mencionado compra. Las renovaciones cuentan también, cada vez.",
      },
      attribution: {
        q: "¿Cuánto dura la atribución?",
        a: "Permanentemente. Cuando alguien se registra a través de su enlace, están vinculados a su cuenta para siempre. No hay expiración de cookie después del registro.",
      },
      placements: {
        q: "¿Puedo rastrear cada colocación por separado?",
        a: "Sí. Cree un enlace rastreado por vídeo, edición o listado en su página de referencia. Cada uno muestra sus propias visitas, suscripciones, los usuarios que pagan y los ingresos.",
      },
      refunds: {
        q: "¿Qué pasa en un reembolso?",
        a: "Las ganancias permanecen pendientes durante los días de {{holdDays}}. Si la compra es reembolsada o cargada de nuevo en ese tiempo, el pago se cancela. Después de eso es tuyo.",
      },
      payout: {
        q: "¿Cómo me pagan?",
        a: "Ganancias confirmadas como créditos que puedes gastar en la plataforma. O solicitar un retiro a BTC o USDC de {{minPayout}}, procesado dentro de las horas de {{cryptoPayoutHours}} después de la aprobación.",
      },
    },
  },
  cta: {
    title: "Su enlace está a cinco minutos.",
    subtitle:
      "Cuenta libre. Sin aprobación. {{directPct}} de cada compra, recurriendo, sin tapa.",
    primary: "Consigue tu enlace de socio",
    secondary: "Cómo funciona la remisión",
  },
};
