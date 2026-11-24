import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Finanzas",
  documents: {
    search: "Documentos de búsqueda",
    matches: "Documentos coincidentes ({{count}})",
    emptyTitle: "Ningún documento coincide con estos filtros",
    emptyHint: "Cambia la búsqueda o los filtros y vuelve a intentarlo.",
    allCompanies: "Todas las empresas que usted puede acceder",
    chooseCompany: "Select company",
    allCustomers: "Todos los clientes",
    chooseCustomer: "Seleccione cliente",
    apply: "Aplicar filtros",
    clear: "Filtros claros",
    page: "Página {{page}} de {{pages}} · Resultados {{total}}",
    previous: "Página anterior",
    next: "Página siguiente",
    select: "Seleccione {{reference}}",
    open: "Open {{reference}}",
    noReference: "No hay referencia",
    invoices: "Facturas de clientes",
    bills: "Proveedores facturas",
    estimates: "Estimaciones de ventas",
    heading: "Documentos comerciales",
  },
  tags: {
    finance: "finanzas",
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      openrouter: "OpenRouter",
      nanoGpt: "NanoGPT",
      venice: "Venice",
      uncensoredAi: "uncensored.ai",
      gab: "Gab AI",
      freedomGpt: "FreedomGPT",
      modelsLab: "ModelsLab",
      edenAi: "Eden AI",
    },
    provider: {
      all: "Todos los proveedores",
    },
    eventKind: {
      charge: "Carga",
      refund: "Reembolso",
      dispute: "Controversias",
      cancellation: "Cancelación",
      payout: "Pagos",
      fee: "Tasa de procesamiento",
    },
    runStatus: {
      ok: "OK",
      skipped: "Saltó.",
      failed: "Failed",
    },
    alertType: {
      lowBalance: "Saldo prepago bajo",
      negativeMargin: "Margen negativo",
      thinMargin: "Marrón de lastre",
      balanceDrain: "Consumo del saldo",
      spendSpike: "Espejo de gas",
      refundSpike: "Gancho de reembolso",
      disputeSpike: "Diferencia",
      cancellationSpike: "Punto de cancelación",
      billingGap: "Baje de la facturación",
    },
    severity: {
      warning: "Advertencia",
      critical: "Crítica",
    },
    threshold: {
      openrouterAutoTopUpFloorUsd: "OpenRouter planta de alerta superior (USD)",
      openrouterAutoTopUpGraceHours:
        "OpenRouter autotop período de gracia (horas)",
      uncensoredAiLowBalanceCredits:
        "Umbral de saldo de uncensored.ai (créditos)",
      freedomGptLowBalanceCredits: "Umbral de saldo de FreedomGPT (créditos)",
      gabLowBalanceCredits: "Saldo mínimo de Gab AI (créditos)",
      nanoGptAutoTopUpFloorUsd: "NanoGPT auto planta de alerta superior (USD)",
      nanoGptAutoTopUpGraceHours: "NanoGPT autotop período de gracia (horas)",
      veniceAutoTopUpFloorUsd: "Venice planta de alerta superior (USD)",
      modelsLabLowBalanceUsd: "Umbral de saldo de ModelsLab (USD)",
      edenAiLowBalanceUsd: "Umbral de saldo de Eden AI (USD)",
      veniceAutoTopUpGraceHours: "Venice autotop período de gracia (horas)",
      marginFloorPct: "Planta baja (porcentaje)",
      drainMultiplier:
        "Multiplicador de drenaje (promedio de seguimiento de x)",
      hourlySpendCapUsd: "Pasar por cada proveedor ($/h)",
      minSpikeUsd: "Gasto mínimo para juzgar un pico ($)",
      refundRatePct: "Límite de la tasa de reembolso (% de los cargos)",
      disputeCountDaily: "Controversias por día",
      cancellationMultiplier:
        "Espejo de cancelación (promedio de seguimiento de x)",
      cancellationMin: "Cancelaciones mínimas para juzgar un pico",
      billingGapPct:
        "Límite de la brecha de facturación (por encima de las facturas)",
      alertDedupHours: "Ventana de repeticion (horas)",
      minRevenueUsd: "Ingresos diarios mínimos para juzgar el margen ($)",
      minCostUsd: "Costo diario mínimo para juzgar el margen ($)",
    },
    scope: {
      all: "Todo",
      balances: "Saldos del proveedor sólo",
      revenue: "Ingresos únicamente",
    },
    costCoverage: {
      complete: "Completado",
      partial: "Costo parcial",
      none: "Costo desconocido",
    },
    metric: {
      stripeRevenue: "Ingresos de Stripe (en cifras brutas, $)",
      nowpaymentsRevenue: "Ingresos de NOWPayments (en cifras brutas, $)",
      netRevenue: "Ingresos netos ($)",
      refunds: "Reembolsos ($)",
      upstreamCost: "Gastos corrientes ($)",
      internalBilled: "Facturación a los usuarios ($)",
      grossMarginUsd: "Margen bruta ($)",
      grossMarginPct: "Margen bruto (%)",
      providerSpend: "Gasto del proveedor ($)",
      providerBalance: "Saldo del proveedor restante ($)",
      providerBalanceNative:
        "Saldo del proveedor restante (créditos del proveedor)",
      providerCost: "Coste del proveedor según nuestros registros ($)",
      costTotal: "Coste de proveedores total ($)",
      costPaid: "Coste de proveedores del uso pagado ($)",
      costFree: "Coste de proveedores del uso gratuito ($)",
      consumedList: "Créditos consumidos a precio de lista ($)",
      earned: "Ganado: créditos pagados al precio pagado ($)",
      freeList: "Créditos gratuitos consumidos a precio de lista ($)",
      aiMarginUsd: "Margen IA: ganado menos coste de proveedores ($)",
      aiMarginPct: "Margen IA (% de lo ganado)",
      paidMarginUsd: "Margen del uso pagado ($)",
      paidMarginPct: "Margen del uso pagado (%)",
      alerts: "Alertas elevadas",
    },
  },
  ingest: {
    title: "Ingesto financiero",
    titleShort: "Ingesto",
    description:
      "Sólo lectura de ingresos reales (Stripe, NOWPayments) y saldos de proveedores reales. Computa el margen diario y eleva alertas. No mueve dinero.",
    task: {
      balancesName: "Sincronización de saldos de proveedores",
      revenueName: "Sincronización de ingresos",
      balances:
        "Cada hora consulta los saldos de los proveedores, mide el gasto y señala caídas de saldo y picos de consumo.",
      revenue:
        "Cada día consulta los ingresos de Stripe y NOWPayments, calcula el margen y señala reembolsos, disputas y márgenes bajos.",
    },
    fields: {
      scope: {
        label: "Ámbito",
        description: "Qué hacer para tirar",
      },
      dryRun: {
        label: "Simulación",
        description: "Leer y computar, no almacenar nada, no enviar nada",
      },
      windowDays: {
        label: "Ventana de ingresos (días)",
        description: "Cuán lejos volver a re-pull los ingresos. Default 3.",
      },
      backfillFrom: {
        label: "Reversor de (YYYY - MM - DD)",
        description:
          "Recomputa los rollups diarios de este día UTC a través de backfill-to (predeterminado hoy). Recompila los ingresos de nuestra historia de pago completo; siempre escribe (ignores seco-run). Deja vacío para un ingesto normal.",
      },
      backfillTo: {
        label: "Regreso a (YYYY - MM - DD)",
        description:
          "El último día de UTC para volver a computar. Default: hoy.",
      },
    },
    response: {
      dryRun: "Simulación",
      ranAt: "Ran en",
      sources: "Fuentes",
      days: "Margen diario",
      alertsRaised: "Alertas elevadas",
      alertsSuppressed: "Alertas suprimidas (duplicadas)",
      alerts: "Alertas",
    },
    widget: {
      hint: "Lee nuestras propias cuentas solamente. Se salta una fuente sin un punto final y se registra la razón.",
      submit: "Ejecutar ingest",
      submitting: "Corriendo...",
      result: "Resultado ingerido",
      resultDry: "Correción seca (nada almacenada, nada enviado)",
      events: "Renglas {{count}}",
      margin: "Cobros y gasto en proveedores por día (no es un margen)",
      dayLine: "cobrado {{cash}} · gasto en proveedores {{cost}}",
      costUnknown: "costo desconocido",
      alerts: "Alertas: {{raised}} elevada, {{suppressed}} suprimida",
    },
  },
  status: {
    title: "Finanzas",
    titleShort: "Finanzas",
    description:
      "Costo de ingresos vs: balances de proveedores, margen, alertas y umbrales.",
    response: {
      lastIngestAt: "Último intento de sincronización",
      lastSuccessfulIngestAt: "Última sincronización de fuente exitosa",
      asOf: "Estado comprobado",
      sources: "Fuentes",
      week: "Últimos 7 días",
      days: "Margen diario",
      alerts: "Alertas recientes",
      thresholds: "Umbral",
    },
    widget: {
      back: "Atrás",
      title: "Finanzas",
      refresh: "Actualizar",
      runIngest: "Ejecutar ingest",
      loading: "Cargando finanzas...",
      lastIngest: "Último intento de sincronización {{when}}",
      lastSuccessful: "Último sincronizado {{when}}",
      snapshot: "Último proveedor de lectura {{when}}",
      stale: "Lectura de la estatua",
      noBalance: "No hay saldo notificado",
      noSources: "No hay fuentes financieras que hayan comunicado datos.",
      never:
        "nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás jamás jamás jamás nunca jamás nunca jamás jamás jamás jamás jamás nunca jamás nunca jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás",
      neverRun: "Aún no corren.",
      margin: {
        title: "Margen IA (últimos 7 días)",
        earned: "Ganado con créditos pagados",
        cost: "Coste de proveedores",
        margin: "Margen IA",
        pct: "Margen IA %",
        paidPct: "Margen del uso pagado %",
        basis:
          "Ganado = créditos pagados consumidos al precio pagado. Coste = coste de proveedores de todo el uso, incluidos {{free}} de créditos gratuitos a precio de lista.",
        cash: "Cobros netos: {{net}}, comisiones de pago {{fees}}. Flujo de caja, nunca restado del coste de proveedores.",
        cashDay: "cobrado {{net}}",
        empty: "Sin uso en los últimos 7 días.",
        missingPct: "Nada ganado",
      },
      providers: {
        title: "Saldos del proveedor",
        lastSpend: "Pasado desde la última lectura: {{amount}}",
        lastSpendEstimate: "Gasto estimado desde la última lectura: {{amount}}",
        previousDaySpend: "Cargos de la API del {{day}} (UTC): {{amount}}",
        lastNativeSpend: "API cobra por la última hora cerrada: {{amount}}",
        noSpend: "No se ha medido el gasto",
      },
      revenue: {
        title: "Fuentes de ingresos",
        fallback: "Fallback: registros propios",
      },
      alerts: {
        title: "Alertas recientes",
        empty: "No hay alertas grabadas",
      },
      thresholds: {
        title: "Umbral",
        hint: "Los defectos se aplican hasta que establece un valor. Las alertas se repiten a la vez por ventana.",
        custom: "Personalizado",
        default: "Predeterminado",
        edit: "Editar",
      },
    },
  },
  thresholds: {
    title: "Set Finance Threshold",
    titleShort: "Set Threshold",
    description:
      "Anula un umbral de alerta. Una anulación desactivada se remonta al predeterminado.",
    fields: {
      key: { label: "Umbral", description: "Que límite para cambiar" },
      value: { label: "Valor", description: "El nuevo límite" },
      enabled: {
        label: "Utilice este valor",
        description: "Desactivado: volver al predeterminado",
      },
      note: {
        label: "Nota",
        description: "Por qué este límite",
        placeholder: "por ejemplo la semana de lanzamiento, esperar reembolsos",
      },
    },
    response: { key: "Umbral guardado" },
    widget: {
      back: "Atrás",
      hint: "Los cambios se aplican en el siguiente ingerto.",
    },
  },
  series: {
    title: "Serie de Finanzas",
    titleShort: "Finanzas",
    description:
      "Serie de tiempo del monitor financiero: ingresos por procesador, ingresos netos, costo de corriente, margen, gasto de proveedores y balance, alertas.",
    fields: {
      resolution: { label: "Resolución", description: "Tamaño del cubo" },
      range: { label: "Rango", description: "Rango de tiempo para buscar" },
      lookback: {
        label: "Mira atrás.",
        description: "Barritas de calentamiento antes del rango",
      },
      metric: { label: "métrica", description: "¿Qué serie trazar?" },
      provider: {
        label: "Proveedor",
        description: "Gasto y balance del proveedor de filtros",
      },
      costProvider: {
        label: "Proveedor de coste",
        description:
          "ID del proveedor de API para el coste, p. ej. openrouter, nano-gpt o unattributed",
      },
      result: { label: "Serie", description: "Serie de tiempo financiero" },
      meta: { label: "Meta", description: "Metadatos de ejecución" },
    },
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Revise los campos marcados",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador",
    },
    forbidden: {
      title: "Admins only",
      description:
        "Las herramientas financieras necesitan el papel de administración",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Esa entrada no existe",
    },
    conflict: {
      title: "Conflicto",
      description: "La entrada cambió mientras tanto, recargar y reiniciar",
    },
    server: {
      title: "Error del servidor",
      description: "No se puede completar la solicitud",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero",
    },
    invalidThreshold: "Un umbral necesita un número no negativo",
    ingestFailed: "Ingesto financiero falló: {{error}}",
    backfill: {
      invalidRange:
        "Backfill necesita una válida desde la fecha en o antes de la fecha (YYYY - MM - DD)",
      tooWide:
        "El rango de relleno es demasiado ancho: en la mayoría de los días {{max}} por carrera",
    },
  },
  success: {
    title: "Listo",
    description: "Guardado",
  },
};
