import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagos",
  tags: { payment: "pago", invoice: "factura" },
  get: {
    title: "Ver factura",
    titleShort: "Ver factura",
    description:
      "Vista de facturas públicas mediante un enlace de token seguro",
    form: {
      title: "Factura",
      description: "Ver detalles de su factura",
    },
    response: {
      id: "Factura ID",
      invoiceNumber: "Número de facturación",
      currency: "Moneda",
      status: "Situación",
      amount: "Monto",
      dueDate: "Fecha prevista",
      notes: "Notas",
      createdAt: "Fecha de publicación",
      companyName: "Company",
      companyEmail: "Company Email",
      paymentUrl: "Enlace de pago en línea",
      bankIban: "IBAN",
      bankBic: "BIC",
      qrKind: "Estándar QR de pago",
      qrSvg: "Código QR de pago",
      lineId: "Línea ID",
      lineDescription: "Descripción",
      productId: "Producto",
      quantity: "Cantidad",
      unitPrice: "Precio unitario",
      taxRate: "Tasa de impuestos",
      taxAmount: "Impuestos",
      lineTotal: "Total",
      sortOrder: "Orden",
      lineCreatedAt: "Creado",
      lineUpdatedAt: "Actualizado",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Enlace inválido",
        description: "El enlace de la factura es inválido o malformado",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Enlace de facturas inválidas o caducadas",
      },
      notFound: {
        title: "No encontrado",
        description: "Factura no encontrada",
      },
      conflict: {
        title: "Conflicto",
        description: "Invocar el conflicto estatal",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
    },
    success: { title: "Factura", description: "Sus datos de facturación" },
  },
  invoiceId: { label: "Factura ID", description: "La factura para ver" },
  token: {
    label: "Ver ficha",
    description: "Acceso seguro a la ficha de su correo electrónico de factura",
  },
  widget: {
    submit: "Ver factura",
    payOnline: "Pagar en línea",
    bankTransfer: "Transferencia bancaria",
    scanToPay: "Escanea con tu aplicación bancaria",
    epcQr: "SEPA GiroCode (EPC)",
    payBySquareQr: "PAY by square",
  },
};
