import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Crea una habilidad. Comparte el enlace. Gana cada mes.",
    description:
      "Las skills de {{appName}} son configuraciones de IA que creas una vez y compartes. Tu enlace gana un 10% de cada pago y un 5% si otros la comparten.",
    category: "Economía de habilidades",
    imageAlt:
      "Una persona que crea habilidades AI y gana ingresos recurrentes compartiendolas",
    keywords:
      "AI habilidades, ingresos pasivos, programa de remisión, {{appName}}, AI personalizado, intercambio de habilidades, economía de habilidad",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Economía de habilidades",
    readTime: "7 min leer",
    title: "Crea una habilidad. Comparte el enlace. Gana cada mes.",
    subtitle:
      "Una vez configurado un AI. Compártelo en cualquier lugar. Ganar un 10% recurriendo a cada pago que las personas que se inscriben a través de él hacen.",
    quote:
      '"Construí una habilidad de razonamiento clínico para estudiantes de medicina. Tres meses después, está pagando por mi propia suscripción y luego algunos".',
  },
  whatAreSkills: {
    title: "¿Cuáles son las habilidades en {{appName}}?",
    p1: "Una habilidad es una configuración AI completa (sistema rápido, personaje compañero, selección de modelos por modalidad, configuración de voz, generación de imágenes) configurado una vez y reutilizable en cualquier lugar. Piénsalo como una receta: descubre los ingredientes adecuados una vez, entonces cualquiera puede usarla.",
    p2: "La plataforma cuenta con modelos {{modelCount}}: estándar, de código abierto, sin censura. Cada habilidad configura el modelo que se utiliza para la conversación, que para la visión, que para la generación de imágenes, con la que se habla. La mayoría de los usuarios nunca necesitarán tocar esos ajustes: sólo utilizan la habilidad. Tú, como el creador, lo sabes una vez.",
    p3: "Las habilidades son libres de crear. No se requiere suscripción pagada. No hay codificación. Si puedes describir lo que quieres que haga un AI, puedes construir una habilidad.",
    buildTitle: "Tres maneras de construir una habilidad",
    build1Title: "Manualmente en la página de habilidad",
    build1Body:
      "Control completo. Configure cada configuración directamente. Bien si sabes exactamente lo que quieres.",
    build2Title: "Pregunte a Thea o Hermes en conversación",
    build2Body:
      "Describe lo que intentas construir. Cerebro con ellos: déjalos redactar el sistema rápido, empujar hacia atrás sus ideas, iterate. La mejor manera de construir algo matizado. Conocen la plataforma.",
    build3Title: "Para desarrollo: genera un archivo skill.ts",
    build3Body:
      "Pídale a su agente que cree un archivo de habilidad. Produce una skill.ts siguiendo la misma estructura que las habilidades de acompañamiento incorporado: listo para comprometerse y utilizar inmediatamente.",
  },
  shareLink: {
    title: "El mecánico de enlaces de acciones: cómo usted realmente ganar",
    p1: "Cuando usted golpeó Compartir &quot; Ganar en cualquier habilidad, usted consigue un URL que hace dos cosas a la vez:",
    bullet1:
      "Muestra a los visitantes la habilidad, lo que hace, cómo se configura, qué tipo de AI es",
    bullet2:
      "Posiciones que usted en la cadena de referencia: cualquiera que se inscriba a través de este enlace se le atribuye a usted",
    p2: "Esto es lo que esa atribución significa en la práctica: cuando alguien se registra a través de su vínculo de habilidad, usted es su referente directo. Ganas el 10% de cada pago que hacen, para siempre. Y cuando otro miembro comparte tu habilidad con su propio enlace, todavía ganas 5% como el creador de habilidades: en los usuarios que nunca has tocado.",
    p3: "Ganas el 10% con cada renovación de suscripción, recarga o compra. Solo tienes que compartir el enlace una vez.",
    p4: "El URL parece: {{appName}} /track?ref= YOUR_CODE &url=/en/skill/ SKILL_ID",
  },
  examples: {
    title: "Habilidades que la gente realmente comparte y ganar de",
    p1: "Las habilidades más exitosas resuelven un problema específico y recurrente que es difícil de explicar sin mostrar. Aquí están los patrones que funcionan:",
    example1Title: "El compañero especialista",
    example1Body:
      "Un estudiante de medicina construye una habilidad que te habla como un colega clínico senior: casos, diferenciales, razonamiento bajo presión. Compartido en los foros de la escuela de medicina. Cada registro de esa comunidad paga mensualmente.",
    example2Title: "El producto real del vendedor de conocimientos",
    example2Body:
      "Entrenadores, consultores, creadores de cursos: han estado vendiendo PDFs y llamadas Zoom. Una habilidad bien elaborada con su experiencia real gana ingresos recurrentes sin la sobrecarga. Esto es mejor que un curso.",
    example3Title: "La opción sin censura",
    example3Body:
      "Habilidades usando modelos no censurados para la escritura creativa, el juego de roles o el debate. Compartido en comunidades donde la censura principal de AI es una frustración constante y diaria. Alta intención de registro.",
    example4Title: "El revisor de código del desarrollador",
    example4Body:
      "Conoce tu pila, hace cumplir las convenciones de tu equipo. Compartido en comunidades de ingeniería llenas de gente gastando $100–200 por mes en AI. Firmas de alto valor que se pegan.",
  },
  theMath: {
    title: "Las matemáticas: 10% por usuario por mes, para siempre",
    p1: "Cuando alguien se registra a través de su enlace de habilidad y suscríbete, ganas 10% de cada pago que hacen. ¿Otros comparten tu habilidad? Ganas el 5% en sus registros también. No sólo el primer mes. Cada mes, mientras estén suscritos.",
    tableHeaderProfile: "Perfil de usuario",
    tableHeaderSpend: "Gasto mensual",
    tableHeaderEarn: "Usted gana/mo (a través del enlace de habilidad)",
    row1Profile: "Suscriptor de arranque",
    row1Spend: "{{planPrice}} /mo",
    row1Earn: "{{planEarn}} /mo",
    row2Profile: "Inicio + 1 paquete de crédito",
    row2Spend: "{{plusPackSpend}} /mo",
    row2Earn: "{{plusPackEarn}} /mo",
    row3Profile: "Usuario pesado: Inicio + paquetes {{heavyPacks}}",
    row3Spend: "{{heavySpend}} /mo",
    row3Earn: "{{heavyEarn}} /mo",
    row4Profile: "Usuario de potencia: Inicio + paquetes {{powerPacks}}",
    row4Spend: "{{powerSpend}} /mo",
    row4Earn: "{{powerEarn}} /mo",
    p2: "La habilidad es el gancho. El enlace es el ingreso. Usted gana si alguien utiliza su habilidad diaria o cambia a otra cosa: la atribución de remisión se queda con usted independientemente.",
    p3: "Comparta una habilidad en cinco lugares. Un porcentaje de clic a través. Algún porcentaje se inscribe. Esas firmas te pagan un 10% cada mes. Comparta otra habilidad el mes que viene. Sus ganancias crecen sin un trabajo proporcionalmente más.",
  },
  chain: {
    title: "Usted también gana cuando sus usuarios se refieren a otros",
    p1: "Cuando los usuarios que usted se refirió se refieren a otros, usted gana una parte de esos pagos también: hasta 5 niveles de profundidad, cada nivel de halving:",
    level1: "Nivel 2 (remisiones de sus referencias): ~5% de cada pago",
    level2: "Nivel 3: ~2,5% de cada pago",
    level3: "Nivel 4: ~1.25% de cada pago",
    level4: "Nivel 5: ~0,625% de cada pago",
    p2: "Nota honesta: los bonos de cadena se vuelven pequeños rápidos. El 10% que obtienes de las referencias directas de habilidad es de donde provienen casi todos tus ingresos. Tratar las ganancias de cadena como un bono: no optimizar para la profundidad, optimizar las acciones de calidad.",
  },
  howTo: {
    title: "5 minutos a su primer enlace de compartir",
    step1Title: "Crear o encontrar una habilidad",
    step1Body:
      "Construya uno desde cero en la página de habilidad, pida a Thea o Hermes que le ayuden a redactarlo, o encuentre una habilidad integrada que valga la pena compartir.",
    step2Title: "Abre la habilidad.",
    step2Body:
      "Haga clic en la habilidad para ver su página de detalles. Aquí es donde encontrarás el botón Compartir &gt; Ganar.",
    step3Title: "Genera tu enlace de compartir",
    step3Body:
      "Haga clic en Compartir &gt; Ganar. Si tiene un código de referencia, seleccionelo. Si no, cree uno en tres segundos. Su enlace lleva su código de referencia y la habilidad ID: atribución se rastrea automáticamente.",
    step4Title: "Compartir donde importa",
    step4Body:
      "Post it in communities where people would actually use the skill: Discord servers, subreddits, forum threads, blog posts, Slack channels. Golpes específicos anchos.",
    step5Title: "Mira el tablero.",
    step5Body:
      "Su panel de referencia muestra visitantes, inscripciones y ganancias en tiempo real. Cada nuevo registro a través de su enlace es un 10% de ingresos recurrentes.",
  },
  close: {
    title: "La habilidad es el producto. El enlace es el ingreso.",
    p1: 'La mayoría de la gente piensa en programas de remisión como compartir un enlace de registro genérico. Eso funciona, pero es una venta difícil. "Aquí hay un enlace a una plataforma AI" no va a ninguna parte. "Aquí hay un AI que piensa como un clínico senior" es algo que la gente envía en realidad.',
    p2: "Construye lo que quieras usarte. Hazlo específico. Entonces comparte el enlace. El 10% se ocupa de sí mismo.",
    createSkill: "Crea tu primera habilidad",
    referralPage: "Configura tu código de referencia",
  },
};
