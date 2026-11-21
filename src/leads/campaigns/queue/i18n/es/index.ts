import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Campaign Queue",
  description: "Líderes actualmente activos en campañas de correo electrónico",
  enums: {
    delivery: {
      dueNow: "Pendientes ya",
      overdue: "Atrasados 24 h+",
      scheduled: "Programados",
      failed: "Fallidos",
      sent: "Enviados",
      opened: "Enviados y abiertos",
      clicked: "Enviados con clic",
      unsubscribed: "Bajas",
      bounced: "Rebotados",
    },
    emailJourneyVariantFilter: {
      all: "Todos",
      uncensoredConvert: "Conversión a modelos sin censura",
      sideHustle: "Hustle lateral",
      quietRecommendation: "Recomendación silenciosa",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      newsletterMay2026: "Boletín May 2026",
      newsletterNov2026: "Boletín de noviembre 2026",
    },
    emailCampaignStageFilter: {
      all: "Todos",
    },
    emailCampaignStage: {
      notStarted: "No empezó",
      initial: "Contacto inicial",
      followup1: "Seguimiento 1",
      followup2: "Seguimiento 2",
      followup3: "Seguimiento 3",
      nurture: "Nutrición",
      reactivation: "Reactivación",
    },
    campaignType: {
      leadCampaign: "Campaña de captación de contactos",
      newsletter: "Boletín",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      transactional: "Transaccional",
      notification: "Notificación",
      system: "Sistema",
    },
    campaignTypeFilter: {
      all: "Todos",
    },
  },
  get: {
    title: "Campaign Queue",
    titleShort: "Campaign Queue",
    description:
      "Ver lista paginada de leads actualmente en campañas de correo electrónico",
    fields: {
      delivery: {
        label: "Estado del correo",
        description:
          "Leads con un correo en este estado. Enviado, abierto, clic, baja, rebote y fallo usan la ventana de fechas",
        placeholder: "Cualquier estado",
      },
      journeyVariant: {
        label: "Variante de recorrido",
        description: "Solo correos de este recorrido",
        placeholder: "Cualquier recorrido",
      },
      stage: {
        label: "Etapa",
        description: "Solo correos de esta etapa",
        placeholder: "Cualquier etapa",
      },
      locale: {
        label: "Idioma",
        description: "Locale renderizado (de-DE) o idioma (de)",
        placeholder: "Cualquier idioma",
      },
      eventFrom: {
        label: "Desde",
        description: "Primer día de la ventana de eventos",
      },
      eventTo: {
        label: "Hasta",
        description: "Último día de la ventana de eventos",
      },
      page: {
        label: "Página",
        description: "Número de página",
      },
      pageSize: {
        label: "Tamaño de página",
        description: "Número de registros por página",
      },
      campaignType: {
        label: "Tipo de campaña",
        description: "Filtro por tipo de campaña",
      },
    },
    response: {
      daysOverdue: "Días de retraso",
      nextSubject: "Tema programado",
      leadId: "ID del contacto",
      leadEmail: "Correo electrónico",
      businessName: "Negocios",
      campaignType: "Tipo de campaña",
      journeyVariant: "Variante de viaje",
      currentStage: "Etapa actual",
      nextScheduledAt: "Siguiente correo electrónico",
      emailsSent: "Sent",
      emailsOpened: "Abierto",
      emailsClicked: "Seguido",
      startedAt: "Comenzó en",
      total: "Total",
      page: "Página",
      pageSize: "Tamaño de página",
      items: "Temas de búsqueda",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para ver la cola de campaña",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver la cola de campaña",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al buscar la cola de campaña",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de entrada inválidos",
      },
    },
    success: {
      title: "Consultas realizadas",
      description: "Cohesión de campaña recuperada con éxito",
    },
  },
  widget: {
    overdueDays: "Atrasado {{days}} días, nunca enviado",
    titleWithCount: "Cola de campañas ({{count}})",
    eventWindow: "Eventos de correo del {{from}} al {{to}}",
    title: "Campaign Queue",
    refresh: "Actualizar",
    noData: "No hay entradas de cola de campaña",
    emptyDescription:
      "Los correos electrónicos solicitados y los líderes activos de la campaña aparecen aquí.",
    back: "Atrás",
    loading: "Cargar cola de campaña",
    selectedLead: "Directo seleccionado",
    clearFilters: "Filtros claros",
    leadEmpty: "No hay entradas de cola para este plomo",
    firstPage: "Vaya a la primera página",
    scheduledFor: "Programado para {{date}}",
    noScheduledEmail: "No hay email programado",
    deliveryStats:
      "{{sent}} enviado · {{opened}} abierto · {{clicked}} clicado",
    startedOn: "Inicio {{date}}",
    openLead: "Abrir ficha del prospecto",
    openLeadNamed: "Open lead {{recipient}}",
    previous: "Anterior",
    next: "Siguiente",
    pagination: "Página {{page}} de {{totalPages}} · Líderes {{total}}",
  },
};
