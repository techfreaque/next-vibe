import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "pago", bill: "factura", ap: "cuentas pagaderas" },
  post: {
    title: "Añadir Bill Line",
    titleShort: "Añadir línea",
    description:
      "Añadir un artículo de la línea de gastos a un proyecto de ley del proveedor",
    form: {
      title: "New Bill Line",
      description: "Introduzca los detalles del gasto",
    },
    errors: {
      evidenceReview:
        "Revise la factura original del proveedor antes de cambiar su imputación.",
      validation: {
        title: "Error de validación",
        description: "Ver todos los campos",
      },
      unauthorized: {
        title: "No se registró",
        description: "Inicie sesión para añadir líneas de factura",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Función contable o de personal",
      },
      conflict: {
        title: "Bill no editable",
        description: "Sólo las facturas DRAFT pueden tener líneas agregadas",
      },
      server: {
        title: "Error del servidor",
        description: "No podía añadir la línea",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      network: { title: "Error de red", description: "Comprueba tu conexión" },
      notFound: {
        title: "Bill no se encontró",
        description: "Esta medida no existe",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Línea añadida",
      description: "Línea de gastos agregada a la factura",
    },
    response: {
      success: "Operación completada",
      message: "Mensaje",
      line: {
        currency: "Divisa",
        title: "Detalles de la línea",
        subtitle: "Añadido el objeto de línea",
        id: "Línea ID",
        billId: "Bill ID",
        lineDescription: "Descripción",
        productId: "Producto ID",
        quantity: "Cantidad",
        unitPrice: "Precio unitario",
        taxRate: "Tasa de impuestos",
        taxAmount: "Cuantía fiscal",
        lineTotal: "Total",
        expenseAccountId: "Cuenta de gastos",
        sortOrder: "Ordenar orden",
        createdAt: "Creado",
        updatedAt: "Actualizado",
      },
    },
  },
  billId: {
    label: "Bill ID",
    description: "La cuenta para añadir esta línea",
    placeholder: "Bill UUID",
  },
  description: {
    label: "Descripción",
    description: "Lo que se compró",
    placeholder: "Suministros de oficina",
  },
  productId: {
    label: "Producto ID",
    description: "Referencia del producto opcional",
    placeholder: "Producto UUID",
  },
  quantity: {
    label: "Cantidad",
    description: "Número de unidades",
    placeholder: "1",
  },
  unitPrice: {
    label: "Precio unitario",
    description: "Precio por unidad",
    placeholder: "100.00",
  },
  taxRate: {
    label: "Tasa de impuestos",
    description: "VAT / tasa de impuestos (0–1, p. ej. 0,19 por 19%)",
    placeholder: "0.19",
  },
  expenseAccountId: {
    label: "Cuenta de gastos",
    description: "¿Qué gastos representan estos puestos a",
    placeholder: "Cuenta UUID",
  },
  widget: {
    submit: "Añadir línea",
    searchProduct: "Búsqueda de Producto",
    searchPlaceholder: "Nombre del producto o SKU...",
    searchButton: "Buscar",
    clearProduct: "Limpiar",
    noProductResults: "No hay productos encontrados.",
    orManual: "o introducir manualmente",
    multiplier: "×",
    taxLabel: "impuesto fiscal",
    linePreview: "Total de líneas (previsualización)",
    addAnotherLine: "Añadir otra línea",
    viewBill: "Ver Bill",
  },
};
