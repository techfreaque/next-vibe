import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Suscripciones",
  tags: {
    subscription: "subscription",
    admin: "admin",
  },
  post: {
    title: "Planes anuales: Créditos mensuales",
    titleShort: "Créditos anuales",
    description:
      "Asigna los créditos de este mes a todos los planes anuales. Se ejecuta a diario. Los créditos se asignan una sola vez y vencen al terminar el mes.",
    response: {
      scanned: "Planes anuales revisados",
      granted: "Meses concedidos ahora",
      credits: "Créditos concedidos",
    },
    widget: {
      hint: "Corre diariamente por su cuenta. Seguro para correr a mano: un mes nunca se concede dos veces.",
      submit: "Grant este mes",
      summary:
        "Planes anuales {{scanned}} verificados, {{granted}} meses concedidos, créditos {{credits}}",
    },
  },
  task: {
    description: "Asigna los créditos mensuales a los planes anuales",
  },
  backfill: {
    title: "Planes anuales: Meses perdidos de relleno",
    titleShort: "Respaldo anual",
    description:
      "Enumera los meses del período anual actual en los que faltó asignar créditos. Desactiva la simulación para asignarlos una sola vez en un paquete que vence al final del período.",
    fields: {
      dryRun: {
        label: "Simulación",
        description: "List what would be granted without granting",
      },
    },
    response: {
      dryRun: "Simulación",
      subscriptions: "Suscripciones",
      months: "Falta de meses",
      credits: "Créditos",
      rows: "Suscripciones",
      subscriptionId: "Suscripción",
      userEmail: "Usuario",
      plan: "Plan",
      periodStart: "Período de inicio",
      periodEnd: "Final del período",
      currentMonth: "Mes actual",
      missedMonths: "Falta de meses",
      status: "Situación",
    },
    widget: {
      hint: "Comprueba primero la carrera seca. La subvención se ejecuta una vez por suscripción y período; repetirla no añade nada.",
      submit: "Corre hacia atrás",
      preview:
        "Correción seca: Suscripciones {{subscriptions}}, {{months}} meses perdidos, créditos {{credits}} serían concedidos.",
      done: "Concedido: Suscripciones {{subscriptions}}, meses {{months}}, créditos {{credits}}.",
    },
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Consultar la solicitud",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador",
    },
    forbidden: {
      title: "Admins only",
      description: "Sólo los administradores pueden otorgar créditos del plan",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "No se encontró el recurso",
    },
    conflict: {
      title: "Conflicto",
      description: "Los datos cambiaron mientras tanto, corren de nuevo",
    },
    server: {
      title: "Error del servidor",
      description: "No se pueden conceder créditos anuales",
      detail: "Créditos anuales fallados: {{error}}",
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
  },
  success: {
    title: "Listo",
    description: "Créditos anuales procesados",
  },
};
