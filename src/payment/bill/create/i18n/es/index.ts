import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pago",
    bill: "factura",
    ap: "cuentas pagaderas",
  },
  post: {
    title: "Crear AP Bill",
    titleShort: "Crear un proyecto",
    description: "Grabar una factura recibida de un proveedor",
    form: {
      title: "Nuevo proyecto de ley de proveedores",
      description: "Introduzca los detalles de la factura que recibió",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise todos los campos e inténtelo de nuevo",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para crear facturas",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Necesitas el papel de contador o de administrador",
      },
      conflict: { title: "Conflicto", description: "Conflicto de datos" },
      server: {
        title: "Error del servidor",
        description: "No podía crear la cuenta. probar de nuevo",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: {
        title: "Error de red",
        description: "Revise su conexión e inténtelo de nuevo",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Bill Created",
      description: "Factura de proveedor registrada con éxito",
    },
    widget: {
      back: "Atrás",
      submit: "Bill.",
      viewButton: "Ver Bill",
      addAnotherButton: "Añadir otro",
    },
    response: {
      id: "Bill ID",
      companyId: "Company ID",
      supplierName: "Proveedor",
      billNumber: "Número de facturas",
      billDate: "Fecha del proyecto",
      dueDate: "Fecha prevista",
      currency: "Moneda",
      subtotal: "Subtotal",
      taxAmount: "Impuestos",
      total: "Total",
      status: "Situación",
      createdAt: "Creado",
      updatedAt: "Actualizado",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Proyecto",
      RECEIVED: "Recibidos",
      APPROVED: "Aprobados",
      PAID: "Pagado",
      DISPUTED: "Controversias",
    },
  },
  companyId: {
    label: "Company",
    description: "La empresa que recibe este proyecto de ley",
    placeholder: "Company UUID",
  },
  supplierName: {
    label: "Nombre del proveedor",
    description: "Nombre del proveedor que envió esta factura",
    placeholder: "Acme GmbH",
  },
  supplierVatNumber: {
    label: "Proveedor VAT Número",
    description: "Proveedor VAT / número de identificación",
    placeholder: "DE123456789",
  },
  billNumber: {
    label: "Número de facturas",
    description: "Número de referencia de factura/bill del proveedor",
    placeholder: "INV-2024-001",
  },
  billDate: {
    label: "Fecha del proyecto",
    description: "Fecha de emisión del proyecto de ley",
    placeholder: "2024-01-01",
  },
  dueDate: {
    label: "Fecha prevista",
    description: "Fecha de pago",
    placeholder: "2024-01-31",
  },
  currency: {
    label: "Moneda",
    description: "Moneda de facturación",
    placeholder: "EUR",
  },
  notes: {
    label: "Notas",
    description: "Notas internas sobre este proyecto",
    placeholder: "Notas opcionales",
  },
};
