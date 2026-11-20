import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Variedades de viaje",
  description:
    "Gestione los registros de las variantes del viaje de correo electrónico",
  enums: {
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
  },
  get: {
    title: "Variedades de viaje",
    titleShort: "Variedades de viaje",
    description:
      "Listar todas las variantes de viaje de correo electrónico registradas",
    response: {
      id: "ID",
      variantKey: "Clave variable",
      displayName: "Nombre de pantalla",
      description: "Descripción",
      weight: "Peso",
      active: "Activa",
      campaignType: "Tipo de campaña",
      sourceFilePath: "Camino del Archivo Fuente",
      senderName: "Nombre del remitente",
      companyName: "Nombre de la empresa",
      companyEmail: "Company Email",
      checkErrors: "Errores de comprobación",
      createdAt: "Creado en",
      updatedAt: "Actualizado en",
      items: "Variantes",
      total: "Variantes totales",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debe ser administrador",
      },
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Failed to load journey variations",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: {
        title: "No encontrado",
        description: "Cuenta o sesión no encontradas",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: { title: "Error de red", description: "Error de red" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar",
      },
    },
    success: {
      title: "Variantes cargadas",
      description: "Variables de viaje cargadas con éxito",
    },
  },
  post: {
    title: "Viaje de registro Variante",
    titleShort: "Nuevo variando",
    description: "Registrar una nueva variante de viaje por correo electrónico",
    fields: {
      variantKey: {
        label: "Clave variable",
        description:
          "Identificador único (por ejemplo. MY_VARIANT). Debe coincidir con una clave en EmailJourneyVariant enum.",
      },
      displayName: {
        label: "Nombre de pantalla",
        description: "Nombre legible para esta variante",
      },
      description: {
        label: "Descripción",
        description: "¿De qué trata este viaje?",
      },
      weight: {
        label: "Peso",
        description:
          "Peso de prueba A/B (1-100). Usado para campañas de carga fría solamente.",
      },
      campaignType: {
        label: "Tipo de campaña",
        description: "Que tipo de campaña esta variante es para (opcional)",
      },
      sourceFilePath: {
        label: "Camino del Archivo Fuente",
        description:
          "Ruta relativa al archivo.email.tsx (por ejemplo, viajes/mi-variant.email)",
      },
      senderName: {
        label: "Nombre del remitente",
        description:
          "De nombre mostrado en cliente de correo electrónico (por ejemplo. Alex de Unbottled)",
      },
      companyName: {
        label: "Nombre de la empresa",
        description: "Nombre de la empresa mostrado en email footer/template",
      },
      companyEmail: {
        label: "Company Email",
        description:
          "Correo electrónico de contacto de la empresa mostrado en email footer/template",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debe ser administrador",
      },
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Failed to register journey variation",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Clave o datos de la variante inválida",
      },
      notFound: {
        title: "No encontrado",
        description: "Clave variable no encontrada en en enum",
      },
      conflict: {
        title: "Conflicto",
        description: "Clave variable ya registrada",
      },
      network: { title: "Error de red", description: "Error de red" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar",
      },
    },
    success: {
      title: "Variante registrada",
      description: "Variante de viaje registrada con éxito",
    },
  },
  patch: {
    title: "Actualización de viaje Variante",
    titleShort: "Editar Variante",
    description:
      "Actualizar una variante de viaje de correo electrónico registrado",
    fields: {
      id: {
        label: "Variante ID",
        description: "ID de la variante para actualizar",
      },
      active: {
        label: "Activa",
        description: "Habilitar o desactivar esta variante",
      },
      weight: {
        label: "Peso",
        description: "Peso de prueba A/B (1-100)",
      },
      displayName: {
        label: "Nombre de pantalla",
        description: "Nombre legible para esta variante",
      },
      description: {
        label: "Descripción",
        description: "¿De qué trata este viaje?",
      },
      senderName: {
        label: "Nombre del remitente",
        description: "De nombre mostrado en cliente de correo electrónico",
      },
      companyName: {
        label: "Nombre de la empresa",
        description: "Nombre de la empresa mostrado en email footer/template",
      },
      companyEmail: {
        label: "Company Email",
        description:
          "Correo electrónico de contacto de la empresa mostrado en email footer/template",
      },
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debe ser administrador",
      },
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Failed para actualizar la variante de viaje",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "Datos de actualización inválidos",
      },
      notFound: {
        title: "No encontrado",
        description: "Variante no encontrada",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: { title: "Error de red", description: "Error de red" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar",
      },
    },
    success: {
      title: "Variante Actualizado",
      description: "Variante de viaje actualizada con éxito",
    },
  },
  widget: {
    title: "Variedades de viaje",
    refresh: "Actualizar",
    register: "Variante del registro",
    noVariants: "No hay variantes registradas aún",
    activeLabel: "Activa",
    inactiveLabel: "Inactivo",
    weightLabel: "Peso",
    campaignTypeLabel: "Tipo de campaña",
    sourceFileLabel: "Archivo fuente",
    toggleActivate: "Activar",
    toggleDeactivate: "Desactivar",
    checkErrorsLabel: "Errores de comprobación:",
    unsavedChanges: "cambios sin salvedades",
    saving: "Salvando...",
    saveChanges: "Guardar cambios",
  },
};
