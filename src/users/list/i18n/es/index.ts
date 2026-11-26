import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Usuarios",
  get: {
    title: "Usuarios",
    titleShort: "Usuarios",
    description:
      "Cada cuenta con lo que pagó, lo que pasa y cuando fue la última activa. Buscar, filtrar por ingresos, actividad, fecha de registro o fuente, ordenar por cualquier columna de dinero.",
    fields: {
      hasSpentCredits: "Usó créditos",
      requiredState: {
        label: "Estado requerido",
        description: "La cuenta debe cumplir también este estado",
      },
      accountLocale: {
        label: "Idioma de la cuenta",
        description: "Código de idioma exacto, por ejemplo es-ES",
      },
      attributedRefCode: {
        label: "Código de referido atribuido",
        description:
          "Código de referido acreditado o, en su ausencia, el de la primera visita",
      },
      search: {
        label: "Cuentas de búsqueda",
        description: "Correo electrónico, nombre o el inicio de un usuario ID",
        placeholder: "Búsqueda de correo electrónico, nombre o ID...",
      },
      roles: {
        label: "Funciones",
        description: "Usuarios que tengan cualquiera de estos roles",
        placeholder: "Cualquier papel",
      },
      accountState: {
        label: "Estado de cuentas",
        description: "Activo, inactivo, prohibido, verificado o no verificado",
        placeholder: "Cualquier estado",
      },
      payer: {
        label: "Pagado o libre",
        description: "Pagado = al menos un pago exitoso",
        placeholder: "Pagado o libre",
      },
      subscription: {
        label: "Suscripción",
        description: "Suscripción activa ahora, siempre suscrita, o nunca",
        placeholder: "Cualquier suscripción",
      },
      lastActive: {
        label: "Último activo",
        description: "Actividad = gasto de créditos, inicio de sesión o pago",
        placeholder: "Cuando quieras",
      },
      signupFrom: {
        label: "Registrado desde",
        description: "Primer día de registro para incluir",
      },
      signupTo: {
        label: "Inscribirse en",
        description: "Último día de registro para incluir",
      },
      creditsMin: {
        label: "Créditos al menos",
        description: "Saldo mínimo de la cartera",
      },
      creditsMax: {
        label: "Créditos en la mayoría",
        description: "Saldo máximo de la billetera",
      },
      source: {
        label: "Fuente",
        description:
          "Canal de primer contacto, fuente UTM/medium/campaign, host de referencia o código de referencia",
        placeholder: "google, ref:, newsletter...",
      },
      referralActivity: {
        label: "Como árbitro",
        description:
          "Usuarios que comparten un enlace de referencia y lo que produjo",
        placeholder: "Cualquiera",
      },
      audience: {
        label: "Audiencia",
        description:
          "Solo personas excluye admins y direcciones de prueba (example.com, .invalid, fixtures .test)",
        placeholder: "Todos",
      },
      channel: {
        label: "Canal",
        description:
          "Canal del primer contacto, exacto (google, youtube, direct). none = cuentas sin recorrido",
        placeholder: "youtube",
      },
      channelType: {
        label: "Tipo de canal",
        description: "Cómo llegó el primer contacto",
        placeholder: "Cualquier tipo",
      },
      refCode: {
        label: "Código de referido",
        description:
          "Código de la primera visita o del referido acreditado, exacto",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "Plan",
        description: "Suscripción activa o en prueba en este plan",
        placeholder: "Cualquier plan",
      },
      activeFrom: {
        label: "Gastó créditos desde",
        description: "Consumo de créditos ese día o después",
      },
      activeTo: {
        label: "Gastó créditos hasta",
        description: "Consumo de créditos ese día o antes",
      },
      spentMin: {
        label: "Gastó al menos",
        description:
          "Créditos gastados en total. Con Nunca pagó encuentras a quien quema créditos gratis",
      },
      paidFrom: {
        label: "Pagó desde",
        description: "Pago exitoso ese día o después",
      },
      paidTo: {
        label: "Pagó hasta",
        description: "Pago exitoso ese día o antes",
      },
      sortBy: {
        label: "Ordenar por",
        description: "Columna para ordenar",
      },
      sortOrder: {
        label: "Orden",
        description: "Ascendente o descendiente",
      },
      page: {
        label: "Página",
        description: "Número de página, comienza a las 1",
      },
      limit: {
        label: "Por página",
        description: "Usuarios por página (max 200)",
      },
    },
    response: {
      users: "Usuarios",
      summary: "Resumen",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicie sesión para ver usuarios",
      },
      validation: {
        title: "Filtros inválidos",
        description: "Revise los valores del filtro e inténtelo de nuevo",
      },
      forbidden: {
        title: "Admins only",
        description:
          "Necesitas el papel de administrador para ver a los usuarios",
      },
      server: {
        title: "No se puede cargar usuarios",
        description: "El servidor no pudo cargar la lista de usuarios",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo salió mal cargando usuarios",
      },
      conflict: {
        title: "Conflicto",
        description: "La solicitud entra en conflicto con los datos actuales",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      notFound: {
        title: "No hay usuarios",
        description: "Ningún usuario coincide con estos filtros",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Usuarios cargados",
      description: "Lista de usuarios cargada",
    },
  },
  enums: {
    audience: {
      all: "Todos",
      humans: "Solo personas",
    },
    channelType: {
      campaign: "Campaña",
      referral: "Referido",
      organic: "Orgánico",
      direct: "Directo",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    sortOrder: {
      asc: "Ascendencia",
      desc: "Descendiente",
    },
    role: {
      admin: "Administrador",
      customer: "Cliente",
      partnerAdmin: "Administrador de socios",
      partnerEmployee: "Empleado de pareja",
      public: "Público",
    },
    subscription: {
      any: "Cualquiera",
      hasActive: "Activo ahora",
      hadAny: "Nunca se suscribió",
      never: "Nunca se suscribió",
    },
    referrer: {
      any: "Cualquiera",
      hasCode: "Tiene un enlace de referencia",
      hasClicks: "Enlace tiene clics",
      hasSignups: "Enlace tiene señales",
      hasSubscribers: "Link ha pagado a suscriptores",
    },
    sortField: {
      createdAt: "Fecha de inscripción",
      lastActive: "Último activo",
      credits: "Saldo acreedor",
      totalPaid: "Total pagado",
      creditsSpent: "Créditos gastados",
      email: "Correo electrónico",
      name: "Nombre",
    },
    accountState: {
      active: "Activa",
      inactive: "Inactivo",
      banned: "Banned",
      verified: "Correo verificado",
      unverified: "Email unverified",
    },
    payer: {
      any: "Pagado o libre",
      paid: "Pagar",
      free: "Nunca pagaste",
    },
    lastActive: {
      any: "Cuando quieras",
      day: "Últimas 24 horas",
      week: "Últimos 7 días",
      month: "Últimos 30 días",
      dormant: "Dormant 30+ días",
      never: "Nunca activo",
    },
  },
  widget: {
    planStatus: "Plan y estado",
    accountActive: "Activo",
    accountInactive: "Inactivo",
    none: "Ninguno",
    creditAmount: "{{count}} créditos",
    spent30d: "{{count}} en 30 d",
    notTracked: "sin seguimiento",
    oneOff: "Solo créditos",
    refCode: "ref:{{code}}",
    chips: {
      paid: "Pagó",
      signedUp: "Registro",
      spentCredits: "Gastó créditos",
      remove: "Quitar filtro {{label}}",
    },
    creditsAny: "Cualquiera",
    titleWithCount: "Usuarios ({{count}})",
    loading: "Cargando usuarios...",
    never: "Nunca.",
    referredBy: "via {{email}}",
    actions: {
      open: "Abierto",
      select: "Seleccione",
      openUser: "Cuenta abierta para {{email}}",
      selectUser: "Seleccione {{email}}",
      stats: "Informe de registros",
      refresh: "Actualizar",
      newUser: "Nuevo usuario",
      clearFilters: "Filtros claros",
      moreFilters: "Filtros",
    },
    kpi: {
      activeSpentHint: "{{credits}} créditos gastados en 30 días",
      matchingHint:
        "Registros por semana, últimas 12 semanas completas. Semana pasada: {{last}}, esta hasta ahora: {{count}}",
      verified: "Email verificado",
      verifiedHint: "Verificados: {{count}}",
      active: "Activos 30 d",
      matching: "Usuarios emparejados",
      paying: "Pagar",
      payingShare: "{{percent}} % de coincidencia",
      revenue: "Ingresos acumulados",
      revenueHint: "Pagos completados, USD",
      credits: "Créditos mantenidos",
      creditsHint: "Suma de saldos de cartera",
    },
    quick: {
      freeBurn: "Gasto gratis {{min}}+ ({{count}})",
      banned: "Bloqueados ({{count}})",
      humans: "Solo personas",
      paying: "De pago ({{count}})",
      free: "Nunca pagaste",
      activeWeek: "Activo 7d",
      dormant: "Dormant 30d+",
      never: "Nunca activo",
    },
    columns: {
      flags: "Señales",
      user: "Usuario",
      joined: "Únete",
      lastActive: "Último activo",
      credits: "Saldo",
      spent: "Gastado (total)",
      paid: "Pagado",
      subscription: "Plan",
      source: "Fuente",
      id: "ID",
    },
    compact: {
      joined: "registrado el {{date}}",
      active: "activo {{when}}",
      neverActive: "nunca activo",
      paid: "pagó {{amount}}",
      free: "nunca pagó",
      spent: "{{count}} créditos gastados",
    },
    flags: {
      freeBurn: "Gasto gratis",
      admin: "admin",
      banned: "Banned",
      unverified: "Unverified",
    },
    empty: {
      none: "Todavía no hay usuarios",
      filtered: "Ningún usuario coincide con estos filtros",
      filteredHint: "Coloca un filtro o despeja todos.",
    },
    pagination: {
      previous: "Página anterior",
      next: "Página siguiente",
      showing: "{{start}} - {{end}} de {{total}}",
    },
    text: {
      subheader:
        "{{verified}} verificados | {{active}} activos 30 d | {{banned}} bloqueados | registros/semana (12 sem.): {{weekly}}",
      header:
        "Los usuarios de {{total}} vivieron {{paying}} pagando los ingresos por vida de {{paid}}",
      pageHint: "Página {{page}} / {{pages}}. Siguiente: --page= {{next}}",
      detailHint: "Detalles: vibe users-view --userId=<ID>",
    },
  },
};
