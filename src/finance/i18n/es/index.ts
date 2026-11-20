import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Finanzas",
  tags: {
    finance: "finanzas",
    vibeSense: "vibe-sense"
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
      freedomGpt: "FreedomGPT"
    },
    provider: {
      all: "Todos los proveedores"
    },
    eventKind: {
      charge: "Carga",
      refund: "Reembolso",
      dispute: "Controversias",
      cancellation: "Cancelación",
      payout: "Pagos",
      fee: "Tasa de procesamiento"
    },
    runStatus: {
      ok: "OK",
      skipped: "Saltó.",
      failed: "Failed"
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
      billingGap: "Baje de la facturación"
    },
    severity: {
      warning: "Advertencia",
      critical: "Crítica"
    },
    threshold: {
      openrouterAutoTopUpFloorUsd: "OpenRouter planta de alerta superior (USD)",
      openrouterAutoTopUpGraceHours: "OpenRouter autotop período de gracia (horas)",
      gabLowBalanceCredits: "Saldo mínimo de Gab AI (créditos)",
      uncensoredAiLowBalanceCredits: "Umbral de saldo de uncensored.ai (créditos)",
      freedomGptLowBalanceCredits: "Umbral de saldo de FreedomGPT (créditos)",
      nanoGptAutoTopUpFloorUsd: "NanoGPT auto planta de alerta superior (USD)",
      nanoGptAutoTopUpGraceHours: "NanoGPT autotop período de gracia (horas)",
      veniceAutoTopUpFloorUsd: "Venice planta de alerta superior (USD)",
      veniceAutoTopUpGraceHours: "Venice autotop período de gracia (horas)",
      marginFloorPct: "Planta baja (porcentaje)",
      drainMultiplier: "Multiplicador de drenaje (promedio de seguimiento de x)",
      hourlySpendCapUsd: "Pasar por cada proveedor ($/h)",
      minSpikeUsd: "Gasto mínimo para juzgar un pico ($)",
      refundRatePct: "Límite de la tasa de reembolso (% de los cargos)",
      disputeCountDaily: "Controversias por día",
      cancellationMultiplier: "Espejo de cancelación (promedio de seguimiento de x)",
      cancellationMin: "Cancelaciones mínimas para juzgar un pico",
      billingGapPct: "Límite de la brecha de facturación (por encima de las facturas)",
      alertDedupHours: "Ventana de repeticion (horas)",
      minRevenueUsd: "Ingresos diarios mínimos para juzgar el margen ($)",
      minCostUsd: "Costo diario mínimo para juzgar el margen ($)"
    },
    scope: {
      all: "Todo",
      balances: "Saldos del proveedor sólo",
      revenue: "Ingresos únicamente"
    },
    costCoverage: {
      complete: "Completado",
      partial: "Costo parcial",
      none: "Costo desconocido"
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
      alerts: "Alertas elevadas"
    }
  },
  ingest: {
    title: "Ingesto financiero",
    titleShort: "Ingesto",
    description: "Sólo lectura de ingresos reales (Stripe, NOWPayments) y saldos de proveedores reales. Computa el margen diario y eleva alertas. No mueve dinero.",
    task: {
      balances: "Hora: leer cada balance del proveedor, gastar la medida, drenajes de bandera y picos.",
      revenue: "Diariamente: tire de los ingresos Stripe y NOWPayments, balancear el margen, reembolsos de bandera, disputas y margen delgado."
    },
    fields: {
      scope: {
        label: "Ámbito",
        description: "Qué hacer para tirar"
      },
      dryRun: {
        label: "Simulación",
        description: "Leer y computar, no almacenar nada, no enviar nada"
      },
      windowDays: {
        label: "Ventana de ingresos (días)",
        description: "Cuán lejos volver a re-pull los ingresos. Default 3."
      },
      backfillFrom: {
        label: "Reversor de (YYYY - MM - DD)",
        description: "Recomputa los rollups diarios de este día UTC a través de backfill-to (predeterminado hoy). Recompila los ingresos de nuestra historia de pago completo; siempre escribe (ignores seco-run). Deja vacío para un ingesto normal."
      },
      backfillTo: {
        label: "Regreso a (YYYY - MM - DD)",
        description: "El último día de UTC para volver a computar. Default: hoy."
      }
    },
    response: {
      dryRun: "Simulación",
      ranAt: "Ran en",
      sources: "Fuentes",
      days: "Margen diario",
      alertsRaised: "Alertas elevadas",
      alertsSuppressed: "Alertas suprimidas (duplicadas)",
      alerts: "Alertas"
    },
    widget: {
      hint: "Lee nuestras propias cuentas solamente. Se salta una fuente sin un punto final y se registra la razón.",
      submit: "Ejecutar ingest",
      submitting: "Corriendo...",
      result: "Resultado ingerido",
      resultDry: "Correción seca (nada almacenada, nada enviado)",
      events: "Renglas {{count}}",
      margin: "Margen: ingresos netos - honorarios - costo de corriente",
      costUnknown: "costo desconocido",
      alerts: "Alertas: {{raised}} elevada, {{suppressed}} suprimida"
    }
  },
  status: {
    title: "Finanzas",
    titleShort: "Finanzas",
    description: "Costo de ingresos vs: balances de proveedores, margen, alertas y umbrales.",
    response: {
      lastIngestAt: "Último intento de sincronización",
      sources: "Fuentes",
      week: "Últimos 7 días",
      days: "Margen diario",
      alerts: "Alertas recientes",
      thresholds: "Umbral"
    },
    widget: {
      title: "Finanzas",
      refresh: "Actualizar",
      runIngest: "Ejecutar ingest",
      loading: "Cargando finanzas...",
      lastIngest: "Último intento de sincronización {{when}}",
      never: "nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás nunca jamás jamás jamás jamás nunca jamás nunca jamás jamás jamás jamás jamás nunca jamás nunca jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás jamás",
      neverRun: "Aún no corren.",
      margin: {
        title: "Margin (últimos 7 días)",
        revenue: "Ingresos netos",
        cost: "Costo corriente",
        fees: "Cargos de procesadores",
        margin: "Nivel bruto",
        pct: "Margen %",
        empty: "Todavía no hay rollups. Ejecute un ingesto.",
        costUnknown: "costo desconocido",
        costIncomplete: "El margen cubre {{tracked}} de {{total}} días, con costos completos. Ingresos netos de los {{total}} días: {{revenue}}."
      },
      providers: {
        title: "Saldos del proveedor",
        lastSpend: "Pasado desde la última lectura: {{amount}}",
        lastSpendEstimate: "Gasto estimado desde la última lectura: {{amount}}",
        previousDaySpend: "Cargos de la API del {{day}} (UTC): {{amount}}",
        lastNativeSpend: "API cobra por la última hora cerrada: {{amount}}",
        noSpend: "No se ha medido el gasto"
      },
      revenue: {
        title: "Fuentes de ingresos",
        fallback: "Fallback: registros propios"
      },
      alerts: {
        title: "Alertas recientes",
        empty: "No hay alertas grabadas"
      },
      thresholds: {
        title: "Umbral",
        hint: "Los defectos se aplican hasta que establece un valor. Las alertas se repiten a la vez por ventana.",
        custom: "Personalizado",
        default: "Predeterminado",
        edit: "Editar"
      }
    }
  },
  thresholds: {
    title: "Set Finance Threshold",
    titleShort: "Set Threshold",
    description: "Anula un umbral de alerta. Una anulación desactivada se remonta al predeterminado.",
    fields: {
      key: {
        label: "Umbral",
        description: "Que límite para cambiar"
      },
      value: {
        label: "Valor",
        description: "El nuevo límite"
      },
      enabled: {
        label: "Utilice este valor",
        description: "Desactivado: volver al predeterminado"
      },
      note: {
        label: "Nota",
        description: "Por qué este límite",
        placeholder: "por ejemplo la semana de lanzamiento, esperar reembolsos"
      }
    },
    response: {
      key: "Umbral guardado"
    },
    widget: {
      back: "Atrás",
      hint: "Los cambios se aplican en el siguiente ingerto."
    }
  },
  series: {
    title: "Serie de Finanzas",
    titleShort: "Finanzas",
    description: "Serie de tiempo del monitor financiero: ingresos por procesador, ingresos netos, costo de corriente, margen, gasto de proveedores y balance, alertas.",
    fields: {
      resolution: {
        label: "Resolución",
        description: "Tamaño del cubo"
      },
      range: {
        label: "Rango",
        description: "Rango de tiempo para buscar"
      },
      lookback: {
        label: "Mira atrás.",
        description: "Barritas de calentamiento antes del rango"
      },
      metric: {
        label: "métrica",
        description: "¿Qué serie trazar?"
      },
      provider: {
        label: "Proveedor",
        description: "Gasto y balance del proveedor de filtros"
      },
      result: {
        label: "Serie",
        description: "Serie de tiempo financiero"
      },
      meta: {
        label: "Meta",
        description: "Metadatos de ejecución"
      }
    }
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Revise los campos marcados"
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador"
    },
    forbidden: {
      title: "Admins only",
      description: "Las herramientas financieras necesitan el papel de administración"
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Esa entrada no existe"
    },
    conflict: {
      title: "Conflicto",
      description: "La entrada cambió mientras tanto, recargar y reiniciar"
    },
    server: {
      title: "Error del servidor",
      description: "No se puede completar la solicitud"
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor"
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado falló"
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero"
    },
    invalidThreshold: "Un umbral necesita un número no negativo",
    ingestFailed: "Ingesto financiero falló: {{error}}",
    backfill: {
      invalidRange: "Backfill necesita una válida desde la fecha en o antes de la fecha (YYYY - MM - DD)",
      tooWide: "El rango de relleno es demasiado ancho: en la mayoría de los días {{max}} por carrera"
    }
  },
  success: {
    title: "Listo",
    description: "Guardado"
  }
};
