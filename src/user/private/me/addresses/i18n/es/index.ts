import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Direcciones de usuario",
  tag: "direcciones",

  list: {
    title: "Dirección de facturación",
    titleShort: "Mis discursos",
    description: "Lista tus direcciones guardadas",
    response: {
      addresses: "Direcciones",
    },
    widget: {
      back: "Atrás",
      addAddress: "Agregar dirección",
      edit: "Editar",
      delete: "Eliminar",
      billing: "Facturación",
      delivery: "Entrega",
      empty: "Sin direcciones guardadas",
      emptyHint: "Guardar uno para saltar escribiendolo en el checkout.",
      emptyCta: "Añade tu primera dirección",
      loading: "Cargando direcciones...",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: { title: "Acceso denegado", description: "No tienes acceso" },
      notFound: {
        title: "No encontrado",
        description: "No hay direcciones encontradas",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      internal: {
        title: "Error del servidor",
        description: "Error del servidor interno",
        detail: "No podía cargar sus direcciones: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
    success: {
      title: "Operación completada",
      description: "Direcciones recuperadas",
    },
  },

  create: {
    title: "Agregar dirección",
    titleShort: "Agregar dirección",
    description: "Guardar una nueva dirección en su cuenta",
    fields: {
      label: {
        label: "Label",
        description: "Nombre esta dirección (por ejemplo. Home, Office)",
        placeholder: "Home",
      },
      fullName: {
        label: "Nombre completo",
        description: "Nombre de contacto para esta dirección",
        placeholder: "Jane Doe",
      },
      company: {
        label: "Company",
        description: "Nombre de la empresa (opcional)",
        placeholder: "Acme Corp",
      },
      phone: {
        label: "Teléfono",
        description: "Número de teléfono",
        placeholder: "+1 555 000 0000",
      },
      vatNumber: {
        label: "Número de VAT",
        description: "Número de registro EU VAT",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Impuesto ID",
        description: "Identificador de impuestos nacionales",
        placeholder: "123-45-6789",
      },
      addressLine1: {
        label: "Línea de dirección 1",
        description: "Calle y número",
        placeholder: "123 Main St",
      },
      addressLine2: {
        label: "Línea de dirección 2",
        description: "Apartamento, suite, unidad (opcional)",
        placeholder: "Suite 4B",
      },
      city: { label: "Ciudad", description: "Ciudad", placeholder: "Berlín" },
      region: {
        label: "Estado/región",
        description: "Estado o región (opcional)",
        placeholder: "Bayern",
      },
      postalCode: {
        label: "Código postal",
        description: "ZIP o postal",
        placeholder: "10115",
      },
      country: {
        label: "País",
        description: "ISO 3166 -1 código de país alfa-2",
        placeholder: "DE",
      },
      isDefaultBilling: {
        label: "Facturación por defecto",
        description: "Utilice como dirección de facturación predeterminada",
      },
      isDefaultDelivery: {
        label: "Entrega por defecto",
        description: "Utilice como dirección de entrega predeterminada",
      },
    },
    response: {
      id: "Dirección ID",
      label: "Label",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Comprobación de campos necesarios",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: { title: "Acceso denegado", description: "No tienes acceso" },
      notFound: {
        title: "No encontrado",
        description: "Usuario no encontrado",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      internal: {
        title: "Error del servidor",
        description: "Error del servidor interno",
        detail: "No podía guardar la dirección: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
    success: {
      title: "Address Saved",
      description: "Dirección añadida a su cuenta",
    },
    widget: {
      saved: "Dirección salvada.",
      backToAddresses: "Volver a direcciones",
    },
  },
};
