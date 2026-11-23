import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  backToChat: "Volver a Chat",
  title: "Comparte tu enlace. Ganar {{directPct}} de cada pago. Para siempre.",
  description:
    "Cualquier persona que se inscriba a través de su enlace le paga {{directPct}} de cada pago que hacen. Sin expiación, sin gorra. Publish a habilidad y ganar {{skillBonusPct}} en los usuarios que otros traen a ella.",
  tagline: "Referencias &quot; Habilidades &quot;",

  hero: {
    directEarning: "Te ganas.",
    directNote: "de personas que se refieren, para siempre",
    bonusEarning: "Como creador de habilidades",
    bonusNote: "cuando otros comparten su habilidad, recurriendo para siempre",
  },

  commissionTable: {
    youLabel: "Tú.",
    perMonth: "/ mo",
    colLevel: "Quien gana",
    colCut: "Corte",
    alwaysYours: "siempre la tuya",
    heroLabel: "en cada pago",
    heroSub: "Recurriendo. Para siempre.",
    chainTitle: "10 suscriptores. Lo que ganas por mes.",
    chainSubtitle:
      "Cada nivel es la mitad del anterior. Construido una vez en el registro: paga para siempre.",
    whoLabel0: "Tú... quien los haya referido directamente.",
    whoLabel1: "Creador de habilidad (si es diferente) o su árbitro",
    whoLabel2: "El árbitro de su árbitro",
    whoLabel3: "Nivel 4",
    whoLabel4: "Nivel 5",
    whoLabel5: "Nivel 6",
    tableNote:
      "Enlace de referencia: {{directPct}} por usuario. Su habilidad compartida por otra persona: {{skillBonusPct}} por usuario. Ambos recurrentes, para siempre.",
  },

  // Story scenario section
  story: {
    title: "Cómo se compone la cadena",
    subtitle:
      "Los mismos 10 suscriptores. Cada nivel que activa añade a su total: para siempre.",
    totalLabel: "Total / mo",
    addedLabel: "+ {{amount}} desde este nivel",
    levelLabel: "Nivel {{n}} activo",
    level1Desc: "Sus 10 suscriptores directos. {{directPct}} cada uno.",
    level2Desc:
      "Sus referencias se refieren a alguien. Tú también ganas un poco de eso.",
    level3Desc: "Sus referencias se refieren. La cadena sigue construyendo.",
    level4Desc: "Cuarto grado. Sigue pagando.",
    level5Desc: "Quinto grado.",
    level6Desc: "Sexto grado. Cada centavo, para siempre.",
    noob: {
      label: "Comenzar",
      earning: "~ {{story_noob_earning}} /mo",
      desc: "{{story_noob_users}} pagando a los suscriptores a través de su enlace de referencia. {{directPct}} cada uno: ingresos pasivos de un tweet o post del blog.",
    },
    mid: {
      label: "Público creciente",
      earning: "~ {{story_mid_earning}} /mo",
      desc: "Suscriptores {{story_mid_users}}: mezcla de referencia y enlaces de habilidad. Algunos de sus amigos también se inscribieron. La cadena se está construyendo.",
    },
    pro: {
      label: "Creador establecido",
      earning: "~ {{story_pro_earning}} /mo",
      desc: "Suscriptores de {{story_pro_users}} a través de la remisión + enlaces de habilidades, más ganancias de línea ascendente de personas que se refirieron. Completamente compuesto.",
    },
  },

  overview: {
    title: "Sus ganancias",
    subtitle: "Estadísticas en vivo. Actualizaciones con cada pago.",
  },

  howItWorks: {
    title: "Cómo funciona",
    step1Title: "Crear código de referido",
    step1Body:
      "Hacer códigos únicos para diferentes audiencias: amigos, Discord, un blog post. Cada rastreado por separado.",
    step2Title: "Comparte tu enlace",
    step2Body:
      "Enlace de referencia → {{directPct}} por usuario, para siempre. Tu habilidad compartida por otros → {{skillBonusPct}} por usuario. Dos fuentes, cero trabajo extra.",
    step3Title: "Pagar",
    step3Body:
      "Las ganancias desbloquean los días {{holdDays}} después de cada pago: la ventana de reembolso. Luego, pasarlos como créditos o retirarse a BTC / USDC de {{minPayout}}.",
  },

  manage: {
    codesSubtitle: "Copiar un enlace, compartirlo, verlo ganar.",
  },
  myCodes: {
    title: "Tus enlaces",
  },
  cta: {
    title: "Crear una cuenta para empezar a ganar",
    description:
      "Consigue tu enlace de referencia. {{directPct}} en cada pago: recurrente, sin expiración. Publish a habilidad y ganar {{skillBonusPct}} cuando otros lo comparten.",
    signUp: "Crear cuenta",
    logIn: "Iniciar sesión",
    pitch1:
      "Comisión de remisión de {{directPct}}: recurrido, sin vencimiento",
    pitch2:
      "Publish a skill → {{skillBonusPct}} de cada usuario otros traen a él",
    pitch3:
      "Desbloquea los días {{holdDays}} después del pago. BTC / USDC retiros de {{minPayout}}.",
  },
  payout: {
    title: "Retire sus ganancias",
    description: "Dos maneras de usar lo que has ganado",
    useAsCredits: "Usar como créditos para chat",
    useAsCreditsDesc:
      "Instantáneo. Sin mínimo. Convierte 1:1 a créditos de conversación AI.",
    cryptoPayout: "Retirada para cripto",
    cryptoPayoutDesc: "BTC o USDC a su dirección de la cartera.",
    minimumNote:
      "Mínimo: {{minPayout}}. Procesado dentro de las horas {{cryptoPayoutHours}} después de la aprobación.",
  },
  audienceCallout: {
    title: "Dos maneras de ganar",
    newTitle: "Enlace de referencia: {{directPct}} por usuario",
    newBody:
      "Comparte tu código. Cualquier persona que se inscriba y pague le da {{directPct}} de cada pago, cada mes, para siempre. Ponlo una vez. Gana para siempre.",
    newCta: "Consigue tu enlace de referencia",
    proTitle: "Creador de habilidad: {{skillBonusPct}} por usuario",
    proBody:
      "Construye una habilidad. Comparta su enlace. Todo el que se inscribe a través de su propio enlace le paga {{directPct}}, recurrente. El multiplicador: cuando alguien más comparte su habilidad con su enlace, usted todavía gana {{skillBonusPct}} como el autor de la habilidad. La plataforma rastrea la autoría de habilidades: atribución pasiva sin trabajo extra.",
    proCta: "Construir una habilidad",
  },
  discord: {
    title: "Únase a la comunidad",
    description:
      "Compartir estrategias, hacer preguntas, conectarse con otros ganaderos.",
    cta: "Únase a Discord",
  },
};
