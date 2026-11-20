import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { antiFarming: "anti-faring", admin: "admin" },
  get: {
    title: "Informe de Agricultura de Crédito Libre",
    titleShort: "Farming Report",
    description:
      "¿Quién es el crédito libre de la agricultura. Subnetes superiores por intentos bloqueados y por piscinas libres reclamados, dominios de correo electrónico superior entre registros duplicados y desechables, y los límites activos.",
    fields: {
      days: {
        label: "Ventana (días)",
        description:
          "Mira estos muchos días para los intentos bloqueados, piscinas de invitados y dominios de correo electrónico. Las cuentas mancomunadas siempre cuentan el mes UTC actual.",
      },
    },
    response: {
      window: "Ventana",
      thresholds: "Límites activos",
      totals: "Intenciones bloqueadas",
      subnetsByBlocked: "Subnetes superiores por intentos bloqueados",
      subnetsByClaims: "Top subnets by free pools claimed",
      emailDomains: "Principales dominios de correo electrónico",
    },
    success: {
      title: "Informe de agricultura listo",
      description: "Informe sobre la lucha contra el tráfico generado",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión primero",
      },
      forbidden: { title: "Acceso denegado", description: "Admins only" },
      server: {
        title: "Error del servidor",
        description: "No podía construir el informe de la agricultura",
      },
      unknown: {
        title: "Error desconocido",
        description: "Algo salió mal",
      },
      validation: {
        title: "Solicitud inválida",
        description: "Los días deben ser entre 1 y 365",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Nada encontrado",
      },
      conflict: { title: "Conflicto", description: "Solicite conflictos" },
      network: {
        title: "Error de red",
        description: "La solicitud no llegó al servidor",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guarda tus cambios primero",
      },
    },
  },
  widget: {
    refresh: "Actualizar",
    loading: "Cargando informe de la agricultura...",
    windowLine:
      "Últimos días {{days}} (desde {{from}}). Cuentas: {{month}} (UTC).",
    kpi: {
      total: "Total bloqueado",
      subnetAccountLimit: "Limitación de la cuenta",
      subnetGuestLimit: "Limitación de los clientes",
      duplicateEmail: "Correo electrónico duplicado",
      disposableEmail: "Correo electrónico descartable",
      subnetSignupLimit: "Límite de registro",
    },
    col: {
      subnet: "Subnet",
      blocked: "Bloqueados",
      accountGranted: "Acct ok",
      accountBlocked: "Acta no",
      guestGranted: "Invitado ok",
      guestBlocked: "Invitado no",
      lastSeen: "Última vista",
      domain: "Dominio",
      duplicate: "Duplicar",
      disposable: "Desechable",
      total: "Total",
    },
    colHint:
      "Acct = cuenta mancomunadas este mes, Invitado = piscinas de invitados en la ventana. ok = con créditos gratis, no = presupuesto subnet lleno.",
    empty: {
      subnets: "No hay actividad subnet en esta ventana.",
      domains: "No hay señales duplicadas o desechables en esta ventana.",
    },
    limits: {
      accountPerSubnet: "Piscinas contables por subnet al mes",
      guestPerSubnet: "Piscinas de invitados por subnet por día",
      guestIpWindow:
        "Los huéspedes en un IP comparten una piscina para (horas)",
      signupLookback:
        "Gasto de invitados llevado a la inscripción desde (horas)",
      subnetPrefix: "Tamaño de subnet",
      signupsPerSubnet: "Nuevas cuentas por subnet por 24 h",
    },
  },
};
