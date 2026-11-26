import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pago",
    bill: "factura",
    ap: "cuentas pagaderas",
  },
  post: {
    title: "Nueva factura de proveedor",
    titleShort: "Nueva factura de proveedor",
    description: "Añade el proveedor y las líneas, y guarda el borrador.",
    form: {
      title: "Nuevo proyecto de ley de proveedores",
      description: "Introduzca los detalles de la factura que recibió",
    },
    errors: {
      vendor: "Elige un proveedor activo de esta empresa.",
      supplier: "Escribe un nombre o elige un proveedor.",
      dates: "Introduce fechas válidas de factura y vencimiento.",
      amounts:
        "Revisa las líneas y mantén el total dentro del límite permitido.",
      expenseAccount: "Elige una cuenta de gastos activa de esta empresa.",

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
      conflict: {
        title: "Conflicto",
        description:
          "Ya existe una factura con este proveedor y número. Revisa la factura existente antes de crear otra.",
      },
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
      supplier: "Proveedor",
      dates: "Fechas y moneda",
      items: "Líneas de factura",
      itemsDescription:
        "Líneas opcionales. Introduce el IVA como decimal entre 0 y 1.",
      itemsHint: "Añade los bienes o servicios de la factura.",
      item: "Descripción",
      quantity: "Cantidad",
      unitPrice: "Precio unitario",
      manualTaxRate: "Otro tipo",
      taxRate: "IVA %",
      lineTotal: "Total de la línea",
      addItem: "Añadir línea",
      removeItem: "Eliminar línea",
      itemError: "Revisa la descripción, la cantidad, el precio y el IVA.",
      supplierTotalReview:
        "Compare este total con la factura del proveedor. Si difiere, revise el documento original antes de guardar.",
      summary: "Resumen de la factura",
      net: "Base imponible",
      tax: "IVA",
      total: "Total",
      chooseVendor: "Elegir proveedor",
      vendorSource: "Del directorio de proveedores",
      terms: "Aplicar plazo del proveedor",
      manualVendor: "Introducir proveedor manualmente",
      selectCompanyFirst: "Selecciona primero una empresa.",

      back: "Atrás",
      submit: "Guardar borrador",
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
  vendorId: {
    label: "Elegir proveedor",
    description: "Del directorio de proveedores",
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
    placeholder: "Elegir fecha de factura",
  },
  dueDate: {
    label: "Fecha prevista",
    description: "Fecha de pago",
    placeholder: "Elegir fecha de vencimiento",
  },
  currency: {
    code: "{{code}}",
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
