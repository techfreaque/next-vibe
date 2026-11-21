import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "Registros",
  titleShort: "Registros",
  description:
    "Quién se registró, desde qué canal o código de referido, cuántos verificaron su email, siguieron activos y pagaron, y quién quema créditos gratis. Cada cifra frente al periodo anterior, cada tarjeta y fila abre las cuentas correspondientes.",
  category: "Usuarios",
  tag: "Estadísticas",
  response: {
    window: "Periodo",
    kpis: "Indicadores",
    totals: "Totales",
    signupTrend: "Registros en el tiempo",
    activityTrend: "Actividad en el tiempo",
    funnel: "Embudo de registro",
    byChannel: "Por canal",
    byRefCode: "Por código de referido",
    byPlan: "Suscriptores por plan",
    byLocale: "Por idioma",
    freeBurners: "Quienes más queman créditos gratis",
  },
  widget: {
    planLapsed: "Suscripción vencida",
    planPacks: "Solo paquetes de créditos",
    groups: {
      abuse: "Abuso",
      signups: "Registros del periodo",
      accounts: "Todas las cuentas que coinciden, este periodo",
    },
    cliHint:
      "Cuentas detrás de estos registros: vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "Calculando...",
    filters: "Filtros",
    openUsers: "Abrir cuentas",
    empty: "Sin registros en este periodo.",
    noJourney: "(sin seguimiento)",
    noRefCodes: "Sin registros con código de referido en este periodo.",
    noSubscribers: "Sin suscriptores activos en este grupo.",
    noBurners: "Nadie quemó créditos gratis en este periodo.",
    signedUpOn: "registrado el {{date}}",
    banned: "Bloqueado",
    unverified: "Sin verificar",
    kpi: {
      revenuePerPayerHint: "Ingresos del periodo / cuentas de pago",
      revenuePerPayer: "Ingreso por cliente de pago",
      revenuePeriod: "Ingresos del periodo",
      activatedRate: "Gastaron créditos",
      signups: "Registros",
      signupsHint:
        "Registrados en el periodo. {{total}} cuentas coinciden en total",
      verifiedRate: "Verificados",
      paidConversion: "Conversión a pago",
      ofSignups: "{{count}} de {{total}} registros",
      activeUsers: "Cuentas activas",
      activeHint:
        "Todas las cuentas que coinciden y gastaron créditos en el periodo",
      payingUsers: "Cuentas de pago",
      payingHint: "Todas las cuentas que coinciden y pagaron en el periodo",
      revenue: "Ingresos",
      revenueHint:
        "Todas las cuentas que coinciden, pagos exitosos en el periodo, USD",
      freeBurn: "Créditos gratis quemados",
      freeBurnHint:
        "Créditos gastados por cuentas sin pago. Cuentas: {{count}}",
      banned: "Registros bloqueados",
      bannedHint: "Registrados en el periodo, bloqueados ahora",
    },
    series: {
      paid: "Pagaron",
      verified: "Verificados, sin pago",
      unverified: "Sin verificar, sin pago",
      active: "Cuentas activas",
      paying: "Cuentas de pago",
    },
    funnel: {
      paid: "Pagó",
      active: "Gastaron créditos",
      verified: "Email verificado",
      signups: "Registrados",
    },
    charts: {
      signups: "Registros",
      signupsHint:
        "Cuentas nuevas por intervalo, según lo que hicieron después. Haz clic en una barra para ver las cuentas.",
      activity: "Actividad",
      activityHint:
        "Todas las cuentas que coinciden por intervalo. La leyenda muestra cuentas distintas en el periodo",
      funnel: "Hitos de los registros",
      funnelHint:
        "Registros del periodo que alcanzaron cada hito. Las cifras coinciden con las tarjetas de arriba.",
      byChannel: "Registros por canal del primer contacto",
      byChannelHint:
        "Primer contacto de estos registros. Ingresos = sus pagos en el periodo",
      byRefCode: "Registros por código de referido",
      byRefCodeHint:
        "Registros acreditados a un código, si no el de la primera visita. Puede superar las filas del canal ref:",
      byPlan: "Cuentas de pago por plan",
      byPlanHint:
        "Cuentas que pagaron en el periodo y sus ingresos; suma igual a las tarjetas De pago e Ingresos",
      byLocale: "Registros por idioma",
      freeBurners: "Quienes más queman créditos gratis",
      freeBurnersHint: "Nunca pagaron, más créditos en el periodo",
    },
    columns: {
      ofSignups: "% de registros",
      accounts: "Cuentas",
      milestone: "Hito",
      active: "Gastaron créditos",
      creditsGranted: "Concedidos",
      creditsSpentTotal: "Total",
      creditBalance: "Saldo",
      signups: "Registros",
      verified: "Verificados",
      paid: "Pagaron",
      conversion: "Conv.",
      revenue: "Ingresos del periodo",
      channel: "Canal",
      refCode: "Código",
      plan: "Plan",
      subscribers: "Cuentas",
      revenueWindow: "Ingresos",
      locale: "Idioma",
      account: "Cuenta",
      creditsSpent: "En el periodo",
    },
    definitions:
      "Solo personas por defecto: se excluyen admins y dominios de prueba. Activo = gastó créditos en su monedero o en un monedero de invitado vinculado. Ingresos en USD a tipos fijos. La conversión cuenta pagos en cualquier momento tras el registro.",
  },
  errors: {
    validation: {
      title: "Solicitud de estadísticas inválidas",
      description: "Compruebe la ventana y las fechas",
    },
    unauthorized: {
      title: "Inicia sesión para continuar",
      description: "Iniciar sesión para ver estadísticas",
    },
    forbidden: {
      title: "Admins only",
      description: "Necesitas el papel de administrador para ver estadísticas",
    },
    notFound: {
      title: "No hay datos",
      description: "No hay nada que reportar para esta ventana",
    },
    server: {
      title: "No podría calcular las estadísticas",
      description: "El servidor no compute estadísticas de usuario",
    },
    network: {
      title: "Error de red",
      description: "No podía llegar al servidor",
    },
    unknown: {
      title: "Error inesperado",
      description: "Algo salió mal las estadísticas de cálculo",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "La solicitud entra en conflicto con los datos actuales",
    },
  },
  success: {
    title: "Listos.",
    description: "Estadísticas de usuario computadas",
  },
};
