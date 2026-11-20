import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Campaign Queue",
  description: "Líderes actualmente activos en campañas de correo electrónico",
  enums: {
    campaignType: {
      leadCampaign: "Campaña de captación de contactos",
      newsletter: "Boletín",
      signupNurture: "Nutrición de registro",
      retention: "Retención",
      winback: "Winback",
      transactional: "Transaccional",
      notification: "Notificación",
      system: "Sistema"
    },
    campaignTypeFilter: {
      all: "Todos"
    }
  },
  get: {
    title: "Campaign Queue",
    titleShort: "Campaign Queue",
    description: "Ver lista paginada de leads actualmente en campañas de correo electrónico",
    fields: {
      page: {
        label: "Página",
        description: "Número de página"
      },
      pageSize: {
        label: "Tamaño de página",
        description: "Número de registros por página"
      },
      campaignType: {
        label: "Tipo de campaña",
        description: "Filtro por tipo de campaña"
      }
    },
    response: {
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
      items: "Temas de búsqueda"
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para ver la cola de campaña"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver la cola de campaña"
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al buscar la cola de campaña"
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido"
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de entrada inválidos"
      }
    },
    success: {
      title: "Consultas realizadas",
      description: "Cohesión de campaña recuperada con éxito"
    }
  },
  widget: {
    title: "Campaign Queue",
    refresh: "Actualizar",
    noData: "No hay entradas de cola de campaña",
    emptyDescription: "Los correos electrónicos solicitados y los líderes activos de la campaña aparecen aquí.",
    empty: "No se encontraron prospectos",
    columnEmail: "Correo electrónico",
    columnBusiness: "Empresa",
    columnType: "Tipo",
    columnStage: "Etapa",
    columnVariant: "Variante",
    columnNext: "Próximo correo",
    columnSent: "Enviado",
    columnOpen: "Abierto",
    columnClick: "Clic en el enlace",
    columnStarted: "Fecha de inicio",
    never: "Nunca",
    pagination: "Página {{page}} de {{totalPages}} · Líderes {{total}}"
  }
};
