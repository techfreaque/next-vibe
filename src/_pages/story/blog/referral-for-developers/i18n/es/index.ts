import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Creaste algo con IA. Gana dinero al compartirlo.",
    description:
      "Para desarrolladores: sus READMEs GitHub, entradas de blog y tutoriales ya tienen potencial de referencia. Aquí está la matemática, incluyendo el bono de habilidad que ganas cuando otros comparten tu habilidad.",
    category: "Programa de afiliados",
    imageAlt:
      "Terminal de un desarrollador con estadísticas de ingresos junto al código",
    keywords:
      "programa de referencia del desarrollador, afiliado AI, desarrollador pasivo de ingresos, monetización de código abierto",
  },
  hero: {
    backToBlog: "Volver al Blog",
    category: "Para desarrolladores",
    readTime: "5 min para leer",
    title: "Creaste algo con IA. Gana dinero al compartirlo.",
    subtitle:
      "Ya estás enviando con AI. Tu enlace de referencia es una corriente de ingresos que no has encendido todavía.",
  },
  useCase: {
    title: "Donde los desarrolladores naturalmente se refieren a la gente",
    p1: "Ya estás creando contenido que lleva a la gente a herramientas. Un blog sobre su flujo de trabajo. Un README que menciona el AI que usaste. Un tutorial YouTube. Una respuesta Discord donde usted recomienda una plataforma. Todos estos tienen potencial de derivación que la mayoría de los desarrolladores dejan sin explotar.",
    p2: "En cualquier lugar que mencione naturalmente {{appName}}, agregue su enlace de referencia. Las personas que hacen clic y suscriben te ganan el 10% de cada pago que hacen - cada mes, para siempre. No cambias lo que dices. Sólo agrega el enlace.",
    examples: [
      'GitHub README : "Construí esto con {{appName}} \'s API. Pruébalo: [su enlace]"',
      'Blog post footer: "Herramientas que uso:... {{appName}} para el acceso AI [enlace de ref]"',
      'Discord /Slack: "He estado usando {{appName}} - aquí está mi referencia si quieres entrar"',
      'YouTube Descripción: " Herramientas AI utilizadas en este vídeo: {{appName}} [enlace referral]"',
    ],
  },
  skillAngle: {
    title: "Publish a habilidad - ganar cuando otros lo comparten",
    p1: "Cada habilidad que publicas tiene un enlace compartido. Compártelo tú mismo y ganas el 10% estándar directo. Cuando otro miembro lo comparte con su propio enlace, usted todavía gana el 5% de cada pago de esos usuarios, para siempre.",
    p2: "Esto es lo que la mayoría de la gente extraña: usted gana el 5% como el creador de habilidades incluso cuando alguien más comparte su habilidad. Un usuario encuentra su habilidad en el directorio, comparte el enlace con un amigo - ese amigo se registra, usted obtiene el 5% de sus pagos. Automáticamente. La plataforma rastrea la autoría de habilidades, no quién compartió el enlace. Tu habilidad funciona para ti incluso cuando no eres el que lo promueve.",
    p3: "Inserte su enlace de habilidad en un GitHub README. Ponlo en un desarrollador Discord. Cada persona que se inscribe a través de ella te paga un 10%. Cada persona que alguien más trae a su habilidad le paga el 5%. Misma habilidad, dos caminos de ingresos.",
  },
  math: {
    title: "Las matemáticas (números reales)",
    subtitle: "Su enlace (10%) vs. su habilidad compartida por otros (5%)",
    tableHeaderProfile: "Perfil de usuario",
    tableHeaderSpend: "Gasto mensual",
    tableHeaderDirect: "Directa sólo (10%)",
    tableHeaderSkill: "Otros comparten su habilidad (5%)",
    rows: [
      {
        profile: "Suscriptor de arranque",
        spend: "{{planPrice}} /mo",
        direct: "{{planEarn}} /mo",
        skill: "{{planSkillEarn}} /mo",
      },
      {
        profile: "Inicio + 1 paquete de crédito",
        spend: "{{plusPackSpend}} /mo",
        direct: "{{plusPackEarn}} /mo",
        skill: "{{plusPackSkillEarn}} /mo",
      },
      {
        profile: "Usuario pesado: Inicio + paquetes {{heavyPacks}}",
        spend: "{{heavySpend}} /mo",
        direct: "{{heavyEarn}} /mo",
        skill: "{{heavySkillEarn}} /mo",
      },
      {
        profile: "Usuario de potencia: Inicio + paquetes {{powerPacks}}",
        spend: "{{powerSpend}} /mo",
        direct: "{{powerEarn}} /mo",
        skill: "{{powerSkillEarn}} /mo",
      },
    ],
    note: "Un usuario de energía a través de su enlace le gana {{powerEarn}} /mo. Eso es los suscriptores del plan {{powerVsPlan}} en uno. Los desarrolladores ya pagan por herramientas AI. Convierten rápido y raramente churn.",
    growthNote:
      "A medida que {{appName}} añade modelos y capacidades, las tendencias ARPU aumentan. Las referencias que haces hoy te ganan más el próximo año sin ningún trabajo extra.",
  },
  chain: {
    title:
      "La cadena - lo que sucede cuando sus referencias se refieren a otros",
    p1: "Cuando la gente que se refiere vaya a referir a otros, usted gana una parte de esos pagos también. Aquí está la crisis exacta:",
    level0: "Usted → remisión directa: 10% de cada pago, para siempre",
    level1:
      "Sus referencias (nivel 2): ~5% de cada pago (la mitad de la piscina en línea, que es 10% total)",
    level2: "Nivel 3: ~2,5% de cada pago",
    level3: "Nivel 4: ~1.25% de cada pago",
    level4: "Nivel 5: ~0,625% de cada pago",
    total:
      "Pago total máximo en todos los ganaderos: ~20% de cualquier pago único",
    p2: "Nota honesta: los bonos de cadena se vuelven pequeños rápidos. El 10% de habilidad directa + 5% es donde el ingreso real es. Si usted construye en público y sus referencias son ellos mismos desarrolladores, la cadena agrega - pero no optimiza para la profundidad. Optimize for quality direct referrals.",
  },
  crypto: {
    title: "Pago en cripto - no se necesita cuenta bancaria",
    p1: "Los ingresos se pagan en BTC o USDC. Procesado dentro de 48 horas después de la aprobación. Pago mínimo es {{minPayout}} : sobre {{payoutPowerMonths}} meses a partir de un usuario de potencia, o los suscriptores {{payoutPlanMonths}}-meses en Starter.",
    p2: "O convertir los ingresos al instante en créditos de plataforma. Si usted está usando {{appName}} usted mismo, su ingreso de referencia compensa sus propios costos de uso.",
  },
  close: {
    title: "Enciende la corriente",
    p1: "Ya estás construyendo, escribiendo y hablando de herramientas AI. Agregar un enlace de referencia no cuesta nada y tarda cinco minutos. Publique una habilidad también, y usted también gana cuando otras personas la comparten.",
    p2: "La matemática compuesta - comisiones recurrentes, el aumento de ARPU, la cadena desarrolladora-a-desarrolladora - trabaja a su favor cuanto más se construye en público.",
    createCode: "Crea tu código de referido",
    joinDiscord: "Únete al Discord",
  },
};
