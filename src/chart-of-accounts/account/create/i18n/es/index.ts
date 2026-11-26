import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    accountType: {
      ASSET: "Activo",
      LIABILITY: "Responsabilidad",
      EQUITY: "Equidad",
      REVENUE: "Ingresos",
      EXPENSE: "Gastos",
    },
    accountSubtype: {
      CURRENT_ASSET: "Activo actual",
      FIXED_ASSET: "Activo fijo",
      BANK: "Banco",
      CASH: "Efectivo",
      ACCOUNTS_RECEIVABLE: "Cuentas disponibles",
      INVENTORY: "Inventario",
      PREPAID: "Prepago",
      ACCOUNTS_PAYABLE: "Cuentas por pagar",
      VAT_PAYABLE: "VAT Payable",
      VAT_RECEIVABLE: "VAT Receptible",
      ACCRUED_LIABILITY: "Responsabilidad acumulada",
      SHORT_TERM_DEBT: "Deuda a corto plazo",
      LONG_TERM_DEBT: "Deuda a largo plazo",
      SHARE_CAPITAL: "Compartir capital",
      RETAINED_EARNINGS: "Pendientes retenidos",
      REVENUE_SALES: "Ingresos de ventas",
      REVENUE_SERVICE: "Ingresos de servicio",
      COGS: "Costo de los bienes vendidos",
      PAYROLL: "nómina",
      RENT: "Alquiler",
      UTILITIES: "Utilidades",
      OPEX: "Gastos de funcionamiento",
      FINANCIAL_INCOME: "Ingresos financieros",
      FINANCIAL_EXPENSE: "Gasto financiero",
      TAX_EXPENSE: "Gastos fiscales",
      OTHER: "Otro",
    },
  },
  post: {
    title: "Crear cuenta",
    titleShort: "Cuenta nueva",
    description:
      "Añadir una cuenta personalizada a la carta de cuentas de la empresa",
    companyId: {
      label: "Empresa",
      description: "El plan de cuentas de esta empresa recibe la cuenta",
      placeholder: "Elige una empresa",
    },
    code: {
      label: "Código de cuenta",
      description: "Código numérico único para la cuenta",
      placeholder: "por ejemplo 1150",
    },
    name: {
      label: "Nombre de la cuenta",
      description: "Nombre descriptivo para la cuenta",
      placeholder: "p. ej. Caja chica",
    },
    type: {
      label: "Tipo de cuenta",
      description: "Clasificación de la cuenta de alto nivel",
      placeholder: "Seleccione el tipo",
    },
    subtype: {
      label: "Subtipo de cuenta",
      description: "Clasificación detallada dentro del tipo",
      placeholder: "Seleccionar subtipo",
    },
    parentId: {
      label: "Cuenta superior",
      description: "Agrupa la cuenta bajo otra en los informes",
      placeholder: "Ninguna (nivel superior)",
    },
    response: {
      id: "Cuenta",
      code: "Código",
      name: "Nombre",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      validation: {
        title: "Error de validación",
        description: "Compruebe todos los campos requeridos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Autorizaciones insuficientes",
      },
      server: {
        title: "Error del servidor",
        description: "No se puede crear cuenta",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      conflict: {
        title: "Code Taken",
        description: "Una cuenta con este código ya existe",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Cuenta creada",
      description: "Se ha añadido la cuenta",
    },
    widget: {
      viewButton: "Abrir la cuenta",
      addAnotherButton: "Añadir otra cuenta",
      back: "Atrás",
      save: "Crear cuenta",
      sectionAccount: "Cuenta",
      sectionClassification: "Clasificación",
    },
  },
  title: "Crear cuenta",
  description: "Añadir una cuenta personalizada",
  category: "Gráfico de Cuentas",
  tag: "Cuenta",
};
