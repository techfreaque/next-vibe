import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contactos",
  tags: {
    leads: "Contactos",
    export: "Exportación",
  },

  get: {
    title: "Export Leads",
    titleShort: "Export Leads",
    description: "Exportar lleva datos al archivo",
    form: {
      title: "Configuración de exportación",
      description: "Configurar parámetros y filtros de exportación de contacto",
    },
    format: {
      label: "Formato de exportación",
      description: "Formato de archivo para la exportación",
    },
    status: {
      label: "Estado del contacto",
      description: "Filtro por estado de contacto",
    },
    country: {
      label: "País",
      description: "Filtro por país",
      placeholder: "Seleccionar país",
    },
    language: {
      label: "Idioma",
      description: "Filtro por idioma",
      placeholder: "Seleccionar idioma",
    },
    source: {
      label: "Origen del contacto",
      description: "Filtro por fuente de contacto",
      placeholder: "Seleccionar fuente",
    },
    search: {
      label: "Buscar",
      description: "Búsqueda de guías por texto",
      placeholder: "Búsqueda conduce...",
    },
    dateFrom: {
      label: "Fecha de inicio",
      description: "Export leads created from this date",
    },
    dateTo: {
      label: "Fecha final",
      description: "Exportar leads creados hasta esta fecha",
    },
    includeMetadata: {
      label: "Incluir los metadatos",
      description: "Incluya la creación y actualizaciones timetamps",
    },
    includeEngagementData: {
      label: "Incluir los datos de compromiso",
      description:
        "Incluir datos de seguimiento y campaña de correo electrónico",
    },
    response: {
      title: "Archivo de exportación",
      description: "Archivo de exportación generado con datos de contacto",
      fileName: "Nombre del archivo",
      fileContent: "Contenido del archivo (Base64)",
      mimeType: "Tipo MIME",
      totalRecords: "Total Records",
      exportedAt: "Exportado en",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Autenticación necesaria para exportar los contactos",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros o filtros de exportación inválidos",
      },
      server: {
        title: "Error del servidor",
        description:
          "Error del servidor interno ocurrido durante la exportación",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error desconocido durante la exportación",
      },
      network: {
        title: "Error de red",
        description: "Error de red ocurrido durante la exportación",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso prohibido para exportación de contacto",
      },
      notFound: {
        title: "No Data",
        description:
          "No hay pistas encontradas que coincidan con los criterios de exportación",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de datos ocurrido durante la exportación",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios no salvos en la forma de exportación",
      },
    },
    success: {
      title: "Exportación completa",
      description: "Exportación de contacto completada con éxito",
    },
  },
  widget: {
    exportLeads: "Export Leads",
    import: "Importación",
    viewList: "Ver lista",
    importLeadsTitle: "Importar contactos",
    viewLeadsListTitle: "Ver Lista de Líderes",
    copyCsvTitle: "Copiar el contenido de CSV para el portapapeles",
    generatingExport: "Generando exportación...",
    generatingExportHint:
      "Esto puede tomar un momento para grandes conjuntos de datos",
    exportReady: "Exportar",
    fileReadyToDownload: "Su archivo está listo para descargar",
    records: "Documentos",
    format: "Format",
    fileSize: "Tamaño del archivo",
    copied: "Copiado",
    copy: "Copiar",
    download: "Descargar",
    exportedAt: "Exportado a:",
    nextSteps: "Siguientes pasos:",
    viewLeads: "View Leads",
    importLeads: "Importar contactos",
    configureExport: "Configure Export",
    configureExportHint:
      "Seleccione el formato y los filtros a continuación, haga clic en Exportar para generar su archivo",
    formatLabel: "Format",
    formatHint: "Elija CSV o Excel (XLSX)",
    statusFilter: "Filtro de estado",
    statusFilterHint: "Exportar sólo conduce a un estado específico",
    dateRange: "Gama de fecha",
    dateRangeHint: "Exportación estrecha a una ventana de tiempo específica",
    metadataEngagement: "Metadatos y compromiso",
    metadataEngagementHint:
      "Opcionalmente incluye columnas adicionales para análisis avanzado",
    viewLeadsList: "Ver Lista de Líderes",
    excelSpreadsheet: "Excel Spreadsheet",
    csvFile: "CSV File",
  },
  enums: {
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
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
      invalid: "Inválidos",
    },
    leadSource: {
      website: "Sitio web",
      socialMedia: "Social Media",
      emailCampaign: "Campaña de correo electrónico",
      referral: "Referidos",
      csvImport: "Importación CSV",
    },
  },
  headers: {
    email: "Correo electrónico",
    businessName: "Nombre del negocio",
    contactName: "Nombre de contacto",
    phone: "Teléfono",
    country: "País",
    language: "Idioma",
    status: "Situación",
    source: "Fuente",
    website: "Sitio web",
    notes: "Notas",
    campaignStage: "Etapa de campaña",
    emailsSent: "Emails Sent",
    emailsOpened: "Correos electrónicos abiertos",
    emailsClicked: "Emails Clicked",
    lastEmailSent: "Último mensaje enviado",
    lastEngagement: "Último compromiso",
    unsubscribedAt: "Suscritas en",
    createdAt: "Creado en",
    updatedAt: "Actualizado en",
    lastEngagementAt: "Último compromiso",
    metadata: "Metadatos",
    ipAddress: "Dirección de IP",
    userAgent: "Agente de usuario",
    deviceType: "Tipo de dispositivo",
    browser: "Navegador",
    os: "OS",
    referralCode: "Código de referido",
  },
  countries: {
    ...regionalCountryNames("es"),
    global: "Global",
    de: "Alemania",
    pl: "Polonia",
    fr: "Francia",
    us: "Estados Unidos",
  },
  languages: {
    it: "Italiano",
    es: "Español",
    en: "Inglés",
    de: "Alemán",
    pl: "Polaco",
    fr: "Francés",
  },
};
