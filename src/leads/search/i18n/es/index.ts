import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestión de contactos",
  tags: {
    leads: "Contactos",
    search: "Buscar"
  },
  get: {
    title: "Búsqueda de contactos",
    titleShort: "Búsqueda de contactos",
    description: "Búsqueda conduce con filtrado y paginación",
    form: {
      title: "Formulario de búsqueda de contactos",
      description: "Introduzca criterios de búsqueda para encontrar leads"
    },
    search: {
      label: "Búsqueda",
      description: "Términos de búsqueda para filtrar leads por correo electrónico, nombre de negocio o notas",
      placeholder: "Ingrese el término de búsqueda..."
    },
    status: {
      label: "Filtro de estado",
      description: "Filtros por estado"
    },
    limit: {
      label: "Límite de resultados",
      description: "Número máximo de resultados a la vuelta (1-100)"
    },
    offset: {
      label: "Resultados Offset",
      description: "Número de resultados para saltar para paginación"
    },
    response: {
      title: "Resultados de búsqueda",
      description: "Resultados de búsqueda con datos de contacto",
      leads: {
        title: "Contactos",
        item: "Prospecto"
      },
      total: "Total de resultados",
      hasMore: "Tiene más resultados"
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para buscar los leads"
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de búsqueda inválidos proporcionados"
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno se produjo mientras que las guías de búsqueda"
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido mientras se registran las pistas"
      },
      network: {
        title: "Error de red",
        description: "Error de la red ocurrió mientras que los guías de búsqueda"
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso prohibido para la búsqueda de contacto"
      },
      notFound: {
        title: "No hay resultados",
        description: "No hay pistas encontradas criterios de búsqueda coincidentes"
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar en el formulario de búsqueda"
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos ocurrió mientras se registraban los líderes"
      }
    },
    success: {
      title: "Búsqueda Completa",
      description: "Búsqueda de contacto completada con éxito"
    }
  },
  widget: {
    title: "Búsqueda de contactos",
    filterLabel: "Filtro:",
    clearFilter: "Limpiar",
    noResultsTitle: "No se encontraron resultados",
    noResultsSubtitle: "Búsqueda por correo electrónico, nombre de empresa o teléfono",
    createLead: "Crear contacto",
    noLeadsMatchFilter: "No hay pistas que coincidan con los filtros seleccionados.",
    clearFilters: "Filtros claros",
    loadMore: "Carga más",
    openRateSuffix: "% abierto",
    noEmails: "no emails",
    converted: "Conversión",
    emailsSentSuffix: "enviado",
    copyEmailTitle: "Copiar correo electrónico",
    editLeadTitle: "Editar el contacto",
    deleteLeadTitle: "Eliminar el contacto",
    statusNew: "Nuevo",
    statusPending: "Pendiente",
    statusCampaign: "Campaña",
    statusWebUser: "Web User",
    statusNewsletter: "Boletín",
    statusInContact: "En contacto",
    statusSignedUp: "Signed Up",
    statusSubscribed: "Suscrito",
    statusUnsub: "Unsub",
    statusBounced: "Bounced",
    statusInvalid: "Inválidos"
  },
  enums: {
    leadStatus: {
      new: "Nuevo",
      pending: "Pendiente",
      campaignRunning: "Campaign Running",
      websiteUser: "Sitio web Usuario",
      newsletterSubscriber: "Newsletter Suscríbase",
      inContact: "En contacto",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Suscripción confirmada",
      unsubscribed: "Suscripción cancelada",
      bounced: "Bounced",
      invalid: "Inválidos"
    }
  }
};
