import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Trabajo con afiliados. ¿Qué cambia con las suscripciones de IA?",
    description:
      "Para los marketers experimentados de afiliados: por qué las referencias de suscripción AI tienen mejores economía a largo plazo que la mayoría de los programas de afiliados que se han ejecutado antes.",
    category: "Programa de afiliados",
    imageAlt:
      "Un gráfico que muestra el crecimiento recurrente de los ingresos con el tiempo",
    keywords:
      "afiliado de marketing AI, comisión recurrente, programa de afiliados SaaS, derivación de ai no embotellada",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Para los profesionales de afiliados",
    readTime: "6 min leer",
    title: "Trabajo con afiliados. ¿Qué cambia con las suscripciones de IA?",
    subtitle:
      "Ya sabes cómo funcionan los programas de afiliados. Esto es lo que hace vale la pena prestar atención.",
  },
  recurringMath: {
    title: "Las matemáticas de ingresos recurrentes",
    p1: "La mayoría de los programas de afiliados te pagan una vez. Comercio electrónico: un corte por venta. Prueba de software: tarifa plana en actualización. {{appName}} paga 10% de cada pago de suscripción, cada mes, para siempre. Eso cambia significativamente las matemáticas.",
    p2: "La base de referencia es el plan {{planPrice}} /mes Starter. En {{directPct}}, es {{planEarn}} /mes por remisión. Pero esto es lo que mueve el número:",
    powerUserTitle: "El multiplicador del usuario de energía",
    powerUserBody:
      "Desarrolladores y AI - usuarios inteligentes dirigen agentes, el API y la generación de imágenes o vídeos en la parte superior del plan, y compra paquetes de crédito a medida que van. Un usuario de energía {{powerSpend}} /mes te gana {{powerEarn}} /mes recurrente. Eso es referencias del plan {{powerVsPlan}} en uno.",
    floorTitle: "ARPU crece a medida que crece la plataforma",
    floorBody:
      "Cada vez que {{appName}} añade modelos, capacidades o modalidades de generación, los suscriptores existentes gastan más. Las referencias que hiciste hace seis meses valen más hoy que cuando las hiciste - sin ningún trabajo extra de ti.",
    tableHeaderProfile: "Perfil de usuario",
    tableHeaderSpend: "Gasto mensual",
    tableHeaderYouEarn: "Ganas/mo",
    row1Profile: "Suscriptor de arranque",
    row1Spend: "{{planPrice}}",
    row1Earn: "{{planEarn}}",
    row2Profile: "Inicio + 1 paquete de crédito",
    row2Spend: "{{plusPackSpend}}",
    row2Earn: "{{plusPackEarn}}",
    row3Profile: "Usuario pesado: Inicio + paquetes {{heavyPacks}}",
    row3Spend: "{{heavySpend}}",
    row3Earn: "{{heavyEarn}}",
    row4Profile: "Usuario de potencia: Inicio + paquetes {{powerPacks}}",
    row4Spend: "{{powerSpend}}",
    row4Earn: "{{powerEarn}}",
  },
  structure: {
    title: "La estructura completa de la comisión",
    p1: "Referencia directa: 10% de cada pago de personas que se refieren directamente. Esto es tuyo siempre, para la vida, sin importar nada más.",
    p2: "Bono de habilidad: si alguien se registra a través del enlace de otro miembro con una habilidad que publicaste, ganas 5% en sus pagos - en la parte superior del 10% que el miembro gana. Las habilidades son preajustes AI compartidos que cualquiera puede crear y publicar. Detalle crítico para los pros del afiliado: usted gana el 5% como el autor de la habilidad incluso cuando alguien más comparte su vínculo de habilidad. Un usuario descubre tu habilidad en el directorio y lo comparte - todavía te acreditan. La autoría de la habilidad es rastreada por la plataforma, no por quién distribuyó el enlace. Esto crea una atribución pasiva que no tienes que manejar activamente.",
    p3: "Cadena multinivel: un 10% adicional se distribuye en hasta 5 niveles de su cadena de referencia, con decadencia geométrica - cada nivel gana la mitad de la anterior. Las referencias de sus referencias directas te ganan un ~5%, sus referencias ~2,5%, etc. Pago total máximo en todos los ganaderos: ~20% de cualquier pago único.",
    p4: "La revelación más honesta: los bonos de cadena se vuelven pequeños rápidos. El 10% de habilidad directa + 5% es donde el ingreso real es. No construya una estrategia en torno a la profundidad multinivel - construirla alrededor de las referencias directas de calidad y habilidades publicables.",
  },
  audience: {
    title: "Quien se convierte para esta plataforma",
    intro:
      "{{appName}} 's core pitch: uncensored AI with {{modelCount}} models, user-controlled content filtering, open source, privacy-first. Eso resuena específicamente con:",
    group1Title: "Desarrolladores y usuarios técnicos",
    group1Body:
      "Ya paga por múltiples herramientas AI. Quieren menos restricciones. Alto ARPU, alta retención, referirse a otros en sus comunidades. El mejor objetivo.",
    group2Title: "Usuarios conscientes de la privacidad",
    group2Body:
      "Usuarios de señales, suscriptores VPN, auto-hosters. El ángulo de incognito-por-arquitectura de código abierto convierte bien. Ellos desconfian plataformas cerradas.",
    group3Title: "Creadores de contenidos",
    group3Body:
      "Escritores, YouTubers, bloggers que usan AI para proyectos, investigación, scripts. Benefíciese de modelos no censurados para ficción, casos de borde o temas controvertidos.",
    group4Title: "AI -curious non-techies",
    group4Body:
      "Las personas que siguen la onda AI pero abrumadas por las opciones. Una sola plataforma con todos los modelos principales más alternativas sin censura. El contenido tutorial convierte bien aquí.",
  },
  promotion: {
    title: "Angles que convierten",
    angle1Title:
      '"Comparé 10 herramientas AI - aquí está la que guardé en realidad"',
    angle1Body:
      "Comparación de contenidos es el mejor afiliado para esta categoría. Líder con variedad modelo, precios y el posicionamiento de voz libre vs herramientas de un solo modelo.",
    angle2Title: "Comunidades de desarrollo",
    angle2Body:
      "GitHub READMEs, dev Discords, r/LocalLLaMA, Hacker News. Los usuarios técnicos tienen ARPU más alto y naturalmente se refieren a otros en sus comunidades. Publique una habilidad allí también: usted gana cuando otros la comparten.",
    angle3Title: "Privacidad y comunidades de acogida propia",
    angle3Body:
      "r/selfhosted, privacy forums, Mastodon. La base de código abierta y la opción de alojamiento propio aterrizan bien. Estos usuarios odian las plataformas cerradas.",
    angle4Title: "Contenido tutorial con la herramienta",
    angle4Body:
      '"Cómo utilizar AI para X" con {{appName}} como herramienta específica. Asistente de codificación, escritura, investigación - casos de uso específico convierten mejor que los exámenes genéricos de AI.',
  },
  payouts: {
    title: "Mecánicas de pago",
    p1: "Pago mínimo: {{minPayout}}. Eso es los meses de suscriptores {{payoutPlanMonths}} en Starter, o unos meses de {{payoutPowerMonths}} de un usuario de energía.",
    p2: "Opciones: BTC, USDC (procesado dentro de 48 horas después de la aprobación), o créditos de plataforma (instant). No se requiere cuenta bancaria.",
    p3: "Rastreo: dashboard en tiempo real que muestra visitantes, suscripciones, ingresos y ganancias por código. Cree múltiples códigos para diferentes campañas.",
  },
  close: {
    title: "Worth añadir a tu pila",
    p1: "No es el programa de pago más alto que ejecutarás. Pero las comisiones recurrentes en una categoría de crecimiento rápido, con un segmento de usuarios de energía que ya gastan pesadamente y tendencias - que es una clase de activos diferente a los pagos de afiliados de una sola vez.",
    p2: "Si tu audiencia se superpone con cualquiera de los anteriores, vale la pena un código y un post.",
    createCode: "Crea tu código de referido",
    joinDiscord: "Únete al Discord",
  },
};
