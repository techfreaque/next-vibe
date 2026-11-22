import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Consumo de créditos",
    titleShort: "Consumo",
    description:
      "Gasto de créditos en el tiempo: cuentas vs invitados, créditos gratis vs de paquetes, por modelo, función y proveedor, con coste del proveedor, margen y mayores consumidores.",
    tags: {
      usage: "consumo de créditos",
      margin: "margen",
    },
    fields: {
      actor: {
        label: "Consumidor",
        description: "Cuentas, invitados (sin cuenta) o ambos",
      },
      creditKind: {
        label: "Créditos",
        description: "Cupo mensual gratis, créditos de paquetes o ambos",
      },
      model: {
        label: "Modelo",
        description: "Solo el gasto en este ID de modelo",
      },
      feature: {
        label: "Función",
        description:
          "Solo el gasto en esta función (chat, Generate Image, ...)",
      },
      provider: {
        label: "Proveedor upstream",
        description: "Solo el gasto servido por este proveedor upstream",
      },
      includeInternal: {
        label: "Incluir cuentas admin",
        description: "Contar también el gasto de cuentas admin",
      },
    },
    response: {
      window: "Periodo",
      appliedFilters: "Filtros aplicados",
      kpis: "Cifras clave",
      spendByActor: "Gasto por consumidor",
      spendByKind: "Gasto por tipo de crédito",
      costVsSpend: "Valor gastado vs coste del proveedor",
      byModel: "Por modelo",
      byFeature: "Por función",
      byProvider: "Por proveedor upstream",
      featureLabels: "Nombres de funciones",
      topSpenders: "Mayores consumidores",
    },
    errors: {
      validation: {
        title: "Filtros no válidos",
        description: "Revisa el periodo y los filtros e inténtalo de nuevo.",
      },
      unauthorized: {
        title: "Inicio de sesión requerido",
        description:
          "Inicia sesión como admin para ver el consumo de créditos.",
      },
      forbidden: {
        title: "Solo admins",
        description: "Solo los admins pueden ver el consumo de créditos.",
      },
      notFound: {
        title: "Sin resultados",
        description: "No hay datos de consumo para esta solicitud.",
      },
      server: {
        title: "Error en el informe",
        description:
          "No se pudo generar el informe de consumo. Inténtalo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo falló al cargar el informe.",
      },
      network: {
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Aplica o descarta primero los cambios de filtros.",
      },
      conflict: {
        title: "Conflicto de datos",
        description:
          "Los datos cambiaron durante la carga. Recarga el informe.",
      },
    },
    success: {
      title: "Informe listo",
      description: "Consumo de créditos cargado",
    },
  },
  widget: {
    extra: {
      nothingRecorded: "Nada registrado",
      paidShareHint2:
        "Paquetes comprados y suscripciones, del consumo con financiación conocida; {{missing}} sin origen",
      costedPct: "Coste conocido %",
      paidShare: "Parte pagada",
      paidShareHint:
        "Consumo de paquetes comprados y suscripciones; valor total {{value}}",
      freeCostHint3:
        "Coste del proveedor de {{credits}} créditos gratuitos; coste registrado en el {{coverage}} del consumo",
      fundGrants: "Asignados",
      boughtPct: "Comprados %",
      subPct: "Susc. %",
      grantsPct: "Asignados %",
      unknownPct: "Origen desconocido %",
      fundingChart: "Consumo por financiación",
      fundingNote:
        "Qué fondo pagó cada cargo: cupo gratuito, bono de cuenta / boletín, paquetes comprados, suscripción, créditos de referidos o asignaciones de admin. Se guarda al cobrar; origen desconocido solo en cargos antiguos.",
      fundAllowance: "Cuota gratuita",
      fundPurchased: "Comprados",
      fundSubscription: "Suscripción",
      fundBonus: "Bonos asignados",
      fundEarned: "Ganancias por referidos",
      fundUnknown: "Origen desconocido",
      fundFreeBonus: "Bono de cuenta / boletín",
      fundFreeUnknown: "Gratis, nivel no registrado",
      fundAdminGrant: "Asignación de admin",
      change: "vs ant.",
      paidPct: "Pagado %",
      topModel: "sobre todo {{model}}",
      spendersHint: "por {{count}} usuarios",
      accountTag: "cuenta",
      freeCostHint2:
        "Coste del proveedor del uso gratuito; coste registrado en el {{coverage}} del consumo",
      notLoaded: "Informe no cargado. Actualiza para reintentar.",
      freeCost: "Coste del uso gratuito",
      freeCostHint:
        "Coste del proveedor del uso de la cuota gratuita, si consta",
      markup: "Beneficio bruto (coste conocido)",
      markupPct: "Margen",
      markupPctHint:
        "Lo que queda tras el coste del proveedor, a valor de lista (0,01 $/crédito), no caja",
      kindNote2:
        "Los créditos de paquete combinan compras, suscripciones y asignaciones de admin; el consumo no registra cuáles.",
      modelNotRecorded: "modelo sin registrar",
      costedSpend: "Consumo con coste registrado",
      costChart: "Consumo con coste registrado vs coste del proveedor",
      marginHint2: "Sobre {{value}} de consumo con coste registrado",
      marginHint:
        "{{value}} del valor consumido tiene datos de coste; margen = ese valor menos el coste del proveedor",
      guestPct: "Invitados %",
      freePct: "Gratis %",
      noCost: "sin datos de coste",
    },
    kpi: {
      creditsSpent: "Créditos gastados",
      spendUsd: "Valor gastado",
      guestShare: "Cuota invitados",
      freeShare: "Cuota gratis",
      upstreamCostUsd: "Coste proveedor",
      marginUsd: "Margen bruto",
      marginPct: "Margen",
      activeSpenders: "Consumidores activos",
    },
    hint: {
      spendUsd: "Valor de lista a $0.01 por crédito, no cobrado",
      guestShare: "Gastado por visitantes sin cuenta",
      freeShare: "Pagado con el cupo mensual gratis",
      upstreamCostUsd: "Registrado en {{coverage}} del gasto",
      marginUsd: "Valor menos coste del proveedor, solo filas con coste",
      marginPct: "Del valor gastado con datos de coste",
      activeSpenders: "Cuentas e invitados con algún gasto",
    },
    chart: {
      actor: "Gasto: cuentas vs invitados",
      kind: "Gasto: cupo gratis vs créditos de paquetes",
      kindNote:
        "Los créditos de paquetes incluyen compras, suscripciones y abonos admin.",
      cost: "Valor gastado vs coste del proveedor",
      costNote:
        "El coste del proveedor solo existe donde el cargo lo registró.",
    },
    series: {
      users: "Cuentas",
      guests: "Invitados",
      free: "Cupo gratis",
      pack: "Créditos de paquetes",
      spendUsd: "Valor gastado",
      upstreamCostUsd: "Coste proveedor",
    },
    breakdown: {
      model: "Modelo",
      feature: "Función",
      provider: "Proveedor",
      spender: "Consumidor",
      byModel: "Por modelo",
      byFeature: "Por función",
      byProvider: "Por proveedor upstream",
      topSpenders: "Mayores consumidores",
      topSpendersHint:
        "Haz clic en una fila para abrir la cuenta o el invitado.",
      drillHint: "Haz clic en una fila para filtrar el informe.",
    },
    column: {
      credits: "Créditos",
      usd: "Valor",
      costUsd: "Coste",
      marginPct: "Margen",
      spenders: "Consumidores",
      guestShare: "Invitados",
      freeShare: "Gratis",
      transactions: "Cargos",
    },
    label: {
      noModel: "Herramientas y medios",
      noFeature: "No registrado",
      noProvider: "No registrado",
      chat: "Chat",
      guest: "Invitado {{id}}",
      guestTag: "invitado",
      lastActivity: "último gasto {{date}}",
    },
    filter: {
      actor: "Consumidor",
      creditKind: "Créditos",
      model: "Modelo",
      feature: "Función",
      provider: "Proveedor",
      internal: "Admins incluidos",
    },
    empty: "Sin gasto de créditos en este periodo.",
    includeInternal: "Incluir admins",
  },
  enums: {
    actor: {
      all: "Todos",
      users: "Cuentas",
      guests: "Invitados",
    },
    creditKind: {
      all: "Todos los créditos",
      free: "Gratis",
      pack: "Todos los paquetes",
      purchased: "Comprados",
      subscription: "Suscripción",
      grants: "Asignados",
    },
  },
};
