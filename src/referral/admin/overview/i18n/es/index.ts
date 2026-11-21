import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/es";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Referidos",
  tags: {
    referral: "referral",
    admin: "admin",
    analytics: "analytics",
  },
  enums: {
    sort: {
      revenue: "Ingresos",
      commission: "Comisión",
      payers: "Usuarios de pago",
      signups: "Registros",
      leads: "Leads",
      clicks: "Clics",
      conversion: "De clic a registro",
      ownerQueue: "Cola de pagos del titular",
      ownerFree: "Libre para pagar (menor primero)",
      newest: "Códigos más recientes",
    },
  },
  get: {
    title: "Resumen de referidos",
    titleShort: "Resumen",
    description:
      "Todos los códigos de referido y socios en una sola vista: clics, leads, registros, usuarios de pago, ingresos, comisiones y cola de pagos, comparados con el periodo anterior.",
    fields: {
      search: {
        label: "Buscar",
        description: "Código, etiqueta o email del titular",
        placeholder: "Código, etiqueta o email del titular",
      },
      ownerUserId: {
        label: "Titular",
        description: "Solo los códigos de este socio (ID de usuario)",
      },
      activeOnly: {
        label: "Solo códigos activos",
        description: "Ocultar códigos desactivados",
      },
      sortBy: {
        label: "Ordenar códigos por",
        description: "Orden de la tabla de códigos",
      },
      limit: {
        label: "Códigos mostrados",
        description: "Máximo de filas en la tabla de códigos",
      },
    },
    response: {
      window: "Periodo",
      kpis: "Cifras clave",
      trend: "Tendencia",
      codes: "Códigos",
      codesTotal: "Códigos en el filtro",
      overCommittedOwners: "Titulares con saldo superado",
      payouts: "Cola de pagos",
    },
    widget: {
      kpi: {
        clicks: "Clics",
        clicksHint: "Llegadas desde el navegador con un código",
        leads: "Leads",
        leadsHint: "Visitantes atribuidos a un código",
        signups: "Registros",
        signupsHint: "{{rate}} de los clics",
        payers: "Usuarios de pago",
        payersHint: "Referidos que pagaron en este periodo",
        revenue: "Ingresos",
        revenueHint: "Pagado por usuarios referidos",
        commission: "Comisión generada",
        commissionHint: "{{pending}} retenida, {{confirmed}} confirmada",
        payoutsPaid: "Pagos realizados",
        payoutsPaidHint: "Completados en este periodo",
        queue: "Cola de pagos",
        queueHint: "{{count}} solicitudes abiertas",
        queueEmpty: "Nada pendiente",
      },
      chart: {
        traffic: "Tráfico",
        trafficSub: "Clics y leads atribuidos",
        conversions: "Conversiones",
        conversionsSub: "Nuevos registros y usuarios de pago",
        money: "Ingresos y comisión",
        moneySub: "USD, por fecha de pago",
      },
      series: {
        clicks: "Clics",
        leads: "Leads",
        signups: "Registros",
        payers: "Usuarios de pago",
        revenue: "Ingresos",
        commission: "Comisión",
      },
      table: {
        title: "Códigos",
        subtitle:
          "{{shown}} de {{total}} códigos. Haz clic en un código para ver su informe.",
        dimension: "Código",
        clicks: "Clics",
        leads: "Leads",
        signups: "Registros",
        payers: "De pago",
        conversion: "De clic a registro",
        revenue: "Ingresos",
        commission: "Comisión",
        signupsChange: "Registros vs anterior",
        ownerQueue: "Cola del titular",
        ownerFree: "Libre para pagar",
        inactive: "inactivo",
        overCommitted: "saldo superado",
        overCommittedOwners: "{{count}} titulares con saldo superado",
        empty: "Ningún código coincide con estos filtros.",
        sort: "Ordenar",
      },
      payouts: {
        title: "Pagos por estado",
        subtitle:
          "Estado actual de todas las solicitudes. Haz clic en un estado para gestionar la lista.",
        dimension: "Estado",
        count: "Solicitudes",
        amount: "Importe",
        open: "Abrir pagos",
        empty: "Todavía no hay solicitudes de pago.",
      },
      filters: {
        search: "Buscar",
        owner: "Titular",
        activeOnly: "Solo activos",
        searchPlaceholder: "Código, etiqueta o email del titular",
      },
      loading: "Cargando resumen de referidos",
      cli: {
        payouts: "Cola de pagos: {{count}} abiertas, {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "Filtros no válidos",
      description: "Revisa el periodo y los filtros",
    },
    unauthorized: {
      title: "Sesión no iniciada",
      description:
        "Inicia sesión como admin para ver las estadísticas de referidos",
    },
    forbidden: {
      title: "Solo admins",
      description: "Solo los admins ven las estadísticas de referidos",
    },
    notFound: {
      title: "No encontrado",
      description: "Nada coincide con estos filtros",
    },
    conflict: {
      title: "Conflicto",
      description: "Los datos cambiaron durante la carga, inténtalo de nuevo",
    },
    server: {
      title: "Error del servidor",
      description: "No se pudo generar el resumen de referidos",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo falló de forma inesperada",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guarda o descarta tus cambios primero",
    },
  },
  success: {
    title: "Cargado",
    description: "Resumen de referidos cargado",
  },
};
