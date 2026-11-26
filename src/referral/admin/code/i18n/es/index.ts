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
  get: {
    title: "Informe de código de referido",
    titleShort: "Informe del código",
    description:
      "Un código de referido de principio a fin: de quién es, cómo los clics se convierten en leads, registros y usuarios de pago, cuánto dinero trajo, qué comisión generó y los pagos al titular.",
    fields: {
      code: {
        label: "Código de referido",
        description:
          "El código a analizar (no distingue mayúsculas y minúsculas)",
        placeholder: "moemoe",
      },
    },
    response: {
      window: "Periodo",
      header: "Código",
      kpis: "Cifras clave",
      funnel: "Embudo",
      trend: "Tendencia",
      balance: "Saldo del titular",
      earningsByLevel: "Comisión por nivel",
      referredUsers: "Usuarios referidos",
      referredTotal: "Usuarios referidos en total",
      payouts: "Pagos al titular",
    },
    widget: {
      periodTitle: "Este periodo",
      owner: "Titular",
      ownerEmail: "Email del titular",
      openOwner: "Abrir titular",
      label: "Etiqueta",
      noLabel: "Sin etiqueta",
      bonus: "Bono de registro",
      bonusValue: "+{{credits}} créditos con el primer plan",
      noBonus: "Ninguno",
      status: "Estado",
      active: "Activo",
      inactive: "Inactivo",
      created: "Creado",
      uses: "Registros atribuidos",
      editBonus: "Cambiar bono",
      reassign: "Reasignar código",
      kpi: {
        clicks: "Clics",
        leads: "Leads",
        signups: "Registros",
        signupsHint: "{{rate}} de los clics",
        payers: "Usuarios de pago",
        payersHint: "Referidos que pagaron en este periodo",
        revenue: "Ingresos",
        commission: "Comisión generada",
        commissionHint:
          "{{pending}} retenida hasta que acabe el plazo de reembolso, {{confirmed}} confirmada",
      },
      funnel: {
        title: "Embudo",
        subtitle: "Este periodo",
        clicks: "Clics",
        leads: "Leads",
        signups: "Registros",
        payers: "Usuarios de pago",
      },
      chart: {
        conversions: "Conversiones",
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
      balance: {
        title: "Saldo del titular (desde siempre)",
        confirmed: "Ganancias confirmadas",
        pending: "Retenido (plazo de reembolso)",
        paidOut: "Pagado",
        open: "En cola de pagos",
        available: "Disponible antes de la cola",
        free: "Libre para pagar tras la cola",
        overCommitted:
          "Las solicitudes abiertas superan el saldo confirmado. No las apruebes todas.",
      },
      levels: {
        title: "Comisión por nivel",
        subtitle: "Generada por los usuarios de este código, en este periodo",
        dimension: "Nivel",
        direct: "Directo (titular del código)",
        upline: "Upline {{level}}",
        count: "Pagos",
        total: "Ganado",
        pending: "Retenidas",
        confirmed: "Confirmadas",
        canceled: "Canceladas",
        empty: "Sin comisiones en este periodo.",
      },
      users: {
        title: "Usuarios referidos",
        subtitle:
          "Desde siempre, los que más pagan primero. {{shown}} de {{total}}.",
        dimension: "Usuario",
        signedUp: "registrado el {{date}}",
        payments: "Pagos",
        revenue: "Ingresos",
        commission: "Comisión",
        unpaid: "sin pagos",
        empty: "Nadie se ha registrado todavía con este código.",
      },
      payouts: {
        title: "Pagos al titular",
        subtitle: "Todas las solicitudes de este socio",
        dimension: "Solicitud",
        amount: "Importe",
        requested: "solicitado el {{date}}",
        processed: "procesado el {{date}}",
        openAll: "Abrir en pagos",
        empty: "Este socio nunca ha solicitado un pago.",
      },
      notFound: "El código {{code}} no existe.",
      pickCode: "Elige un código en la tabla del resumen o escríbelo arriba.",
      pickTitle: "Ningún código seleccionado",
      browseCodes: "Ver códigos",
      subtitle:
        "Clics, registros, ingresos, comisiones y saldo del partner para un código.",
      loading: "Cargando informe del código",
    },
  },
  errors: {
    validation: {
      title: "Datos no válidos",
      description: "Revisa el código y el periodo",
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
      title: "Código no encontrado",
      description: "Ningún código de referido coincide",
    },
    conflict: {
      title: "Conflicto",
      description: "Los datos cambiaron durante la carga, inténtalo de nuevo",
    },
    server: {
      title: "Error del servidor",
      description: "No se pudo generar el informe del código",
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
    codeNotFound: "El código de referido {{code}} no existe",
  },
  success: {
    title: "Cargado",
    description: "Informe del código cargado",
  },
};
