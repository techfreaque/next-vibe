import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Direcciones de usuario",
  tag: "direcciones",

  update: {
    title: "Dirección de actualización",
    titleShort: "Dirección de actualización",
    description: "Editar una dirección guardada",
    fields: {
      addressId: { label: "Dirección ID", description: "Address to update" },
      label: {
        label: "Label",
        description: "Nombre esta dirección",
        placeholder: "Home",
      },
      fullName: {
        label: "Nombre completo",
        description: "Nombre de contacto",
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
      updated: "Actualizado",
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
      forbidden: {
        title: "Acceso denegado",
        description: "Esta dirección no te pertenece.",
      },
      notFound: {
        title: "No encontrado",
        description: "Dirección no encontrada",
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
        detail: "No podía actualizar la dirección: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
    success: {
      title: "Dirección Actualizada",
      description: "Dirección guardada con éxito",
    },
    widget: {
      updated: "Dirección actualizada.",
      backToAddresses: "Volver a direcciones",
    },
  },

  delete: {
    title: "Suprímase",
    titleShort: "Suprímase",
    description: "Retire una dirección guardada de su cuenta",
    fields: {
      addressId: { label: "Dirección ID", description: "Address to delete" },
    },
    response: {
      deleted: "Suprimidos",
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
      forbidden: {
        title: "Acceso denegado",
        description: "Esta dirección no te pertenece.",
      },
      notFound: {
        title: "No encontrado",
        description: "Dirección no encontrada",
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
        detail: "No se puede borrar la dirección: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
    success: {
      title: "Address Deleted",
      description: "Dirección eliminada de su cuenta",
    },
    widget: {
      deleted: "Dirección eliminada.",
      backToAddresses: "Volver a direcciones",
    },
  },
};
