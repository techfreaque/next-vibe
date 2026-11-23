import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Dos maneras de ganar. No necesitas escoger uno.",
    description:
      "Guía sencilla del programa de referidos de {{appName}}. Comparte un enlace y gana un 10%. Crea una skill y gana un 5% incluso cuando la compartan otros. Puedes empezar sin experiencia.",
    category: "Programa de afiliados",
    imageAlt: "Una persona que comparte un enlace y gana dinero pasivamente",
    keywords:
      "programa de referencia, principiantes de marketing de afiliados, ingresos pasivos AI, renta de habilidad",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Para principiantes",
    readTime: "5 min para leer",
    title: "Dos maneras de ganar. No necesitas escoger uno.",
    subtitle:
      "Comparta un enlace. O construir una habilidad. O ambas cosas. Así es exactamente como funciona.",
    quote:
      '"Yo tampoco sabía lo que era un programa de remisión. Así se lo explicaría a mi mamá".',
  },
  intro: {
    title: "Empecemos desde cero.",
    p1: "Hay dos maneras de ganar en {{appName}}. Puedes usar uno o ambos. Tampoco requiere experiencia alguna.",
    p2: "La primera manera: compartir un enlace. Cuando alguien se suscribe a través de ella, usted gana el 10% de cada pago que hacen. No sólo el primer mes: cada mes, para siempre, mientras estén suscritos. La segunda manera: construir una habilidad. Una habilidad es una configuración personalizada AI que configuras y publicas. Cuando alguien se registra a través del enlace de su habilidad, usted gana un 5% extra en sus pagos: permanentemente. Aún mejor: ese 5% es tuyo como autor de la habilidad, incluso cuando alguien más comparte tu habilidad. Lo construyes una vez; sigue funcionando.",
  },
  different: {
    title: "Una vez vs recurrente: por qué importa",
    p1: "La mayoría de los programas de remisión te pagan una vez. {{appName}} 's te paga para siempre. Esto es lo que parece en la práctica:",
    tableHeaderType: "Tipo",
    tableHeaderYouEarn: "Te ganas.",
    tableHeaderWhen: "Cuándo",
    row1Type: "Bono de una sola vez (por ejemplo, vale de restaurante)",
    row1Earn: "Recompensa fija",
    row1When: "Una vez",
    row2Type: "Afiliado de per-venta (por ejemplo. Amazon)",
    row2Earn: "~3–10% de venta",
    row2When: "Una vez por compra",
    row3Type: "Remisión de {{appName}}",
    row3Earn: "10% de la suscripción",
    row3When: "Cada mes, para siempre",
    p2: "Consulte a alguien en enero. Si todavía están suscritos en diciembre, te has ganado 12 veces. Hiciste el trabajo una vez.",
  },
  skillAngle: {
    title: "El camino de habilidad: ingresos pasivos que construye una vez",
    p1: "Una habilidad es una persona personalizada AI que configuras: dale un nombre, una personalidad, un impulso del sistema. Entonces publicarlo. Cualquiera puede encontrarlo y usarlo y cuando se inscribe a través del enlace de otro miembro con su habilidad, usted gana el 5% de sus pagos, para siempre. Su propio enlace de habilidad paga el 10% completo directamente.",
    p2: "La parte que más principiantes pierden: ese 5% está atado a usted como autor, no a quien compartió el enlace. Si alguien descubre tu habilidad en el directorio y lo comparte con un amigo (su amigo se registra) todavía te acreditan. Las pistas de la plataforma que crearon la habilidad, no quién la distribuyó. Tu habilidad gana por ti incluso cuando no lo estás promoviendo activamente.",
    p3: "Las habilidades son libres de crear. No se necesita un plan pagado. Comience con algo simple: una habilidad para su hobby, su trabajo, su idioma nativo. Publish it. Agregue el enlace de habilidad donde usted ya hable sobre AI. Cada registro a través de su propio enlace le paga 10%, para siempre. Cada registro que alguien más conduce a su habilidad le paga 5%.",
  },
  multilevel: {
    title: "También hay una cadena, así es como funciona.",
    p1: "Esta es la parte que suena complicada pero no lo es. Cuando la gente que se refiere vaya a referir a otros, usted gana un pequeño corte de esos pagos también. Aquí está la crisis exacta:",
    explanation:
      "Usted se refiere a Alice. Alice suscribe. Usted gana 10% de sus pagos, para siempre. Alice se refiere a Bob. Bob suscribe. Usted gana ~5% de los pagos de Bob (la mitad del 10%, porque él es un nivel más profundo). Bob se refiere a Carol. Usted gana ~2.5% de los pagos de Carol. Y así sucesivamente, hasta 5 niveles de profundidad. Cada nivel te gana la mitad del nivel por encima de él.",
    p2: "En la práctica: el 10% directo de las personas que se refieren es de donde casi todos sus ingresos provienen. Los bonos de cadena son reales pero pequeños. No confíes en ellos: tratarlos como un bono.",
    p3: "No necesitas pensar en la cadena para empezar. Cree un enlace, compartalo, gana 10% de quien se registre.",
  },
  expectations: {
    title: "Expectativas realistas: sin hip",
    p1: "Aquí está la matemática honesta:",
    scenario1Label: "Suscriptor de arranque",
    scenario1Spend: "Plan {{planPrice}} /mo",
    scenario1Earn: "= {{planEarn}} /mo por remisión",
    scenario2Label: "Usuario de potencia (agentes, API, imagen y vídeo)",
    scenario2Spend:
      "Plan {{planPrice}} + paquetes de crédito {{powerPacks}} en {{packPrice}} = {{powerSpend}} /mo",
    scenario2Earn: "= {{powerEarn}} /mo por remisión",
    note: "Un usuario de potencia le paga tanto como los suscriptores del plan {{powerVsPlan}}. Los desarrolladores que ejecutan agentes y el API queman a través de créditos y rara vez cancelan. Son el objetivo de alto valor.",
    example:
      "Refer 10 Suscriptores de Starter: {{tenPlanEarn}} /mo para usted. No cambia la vida. Pero es dinero que ganaste diciendo algo que dirías de todos modos.",
  },
  firststeps: {
    title: "Sus primeros pasos (5 minutos)",
    step1Title: "Crear una cuenta gratuita",
    step1Body:
      "No se necesita un plan pagado. El programa de remisión está abierto a todos.",
    step2Title: "Vaya a su panel de referencia",
    step2Link: "Abre la página de referencia.",
    step2Suffix: " Crear un código: cualquier cosa memorable funciona.",
    step3Title: "Compartir tu enlace o publicar una habilidad",
    step3Body:
      "Enlace de referencia: publicarlo en cualquier lugar que mencione naturalmente las herramientas AI. Enlace de habilidad: construir una habilidad simple primero, luego compartir su enlace. Ambos trabajos. Ambos ganan.",
    step4Title: "Comprueba tu tablero de mando",
    step4Body:
      "Visitantes, firmas y actualizaciones de ganancias en tiempo real. No es un gasto mínimo para empezar a rastrear.",
  },
  close: {
    title: "Eso es todo lo que hay en él.",
    p1: "No necesitas un blog. No necesitas seguidores. No necesitas entender las matemáticas de varios niveles. Sólo tienes que decirle a la gente sobre algo que realmente usas y opcionalmente construir una habilidad simple que gana por sí misma.",
    p2: "Si quieres ir más profundo (entender la estructura de la comisión, encontrar los mejores ángulos de promoción, o preguntar a otras personas cómo lo hacen) unirse a nuestro Discord.",
    createCode: "Consigue tu código de referencia",
    joinDiscord: "Únete al Discord",
  },
};
