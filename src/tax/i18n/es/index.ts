import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Impuestos",
  endpointCategories: {
    tax: "Impuestos",
    taxRates: "Tasas impositivas",
    taxReports: "Informes fiscales",
  },

  rate: {
    details: "Datos del tipo impositivo",
    create: {
      title: "Crear tasa de impuestos",
      titleShort: "Crear tarifas",
      description: "Añada una tasa de impuestos para su empresa",
      widget: {
        save: "Crear tipo impositivo",
        backToList: "Volver a Tasas Fiscales",
      },
      companyId: {
        label: "Company",
        description: "La empresa esta tasa tributaria pertenece a",
        placeholder: "Company ID",
      },
      name: {
        label: "Nombre",
        description: "Nombre descriptivo para la tasa tributaria",
        placeholder: "Por ejemplo. VAT 20%",
      },
      code: {
        label: "Código",
        description: "Identificador corto para esta tasa de impuestos",
        placeholder: "Por ejemplo. AT -VAT20",
      },
      type: {
        label: "Tipo de impuesto",
        description: "La categoría de impuestos",
        placeholder: "Seleccione tipo de impuesto",
      },
      rate: {
        label: "Tasa",
        description: "Tasa fiscal como decimal (0,2 = 20%)",
        placeholder: "0.2000",
      },
      country: {
        label: "País",
        description: "País en el que se aplica esta tasa tributaria (opcional)",
        placeholder: "Por ejemplo. AT",
      },
      region: {
        label: "Región",
        description: "Región o estado donde esta tasa se aplica (opcional)",
        placeholder: "Por ejemplo. Viena",
      },
      isDefault: {
        label: "Tasa de incumplimiento",
        description:
          "Utilice esta tasa como predeterminado para nuevos elementos",
      },
      response: {
        id: "Tasa de impuestos ID",
        code: "Código de Tasa de Impuestos",
        name: "Tasa de impuestos",
      },
      success: {
        title: "Tasa de impuestos creada",
        description: "La tasa de impuestos se ha añadido a su empresa",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprueba tus entradas e intenta de nuevo",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado.",
        },
        forbidden: {
          title: "Acceso denegado",
          description:
            "Usted no tiene permiso para gestionar las tasas de impuestos",
        },
        notFound: {
          title: "No encontrado",
          description: "Compañía no encontrada",
        },
        conflict: {
          title: "Código Duplicado",
          description: "Una tasa de impuestos con este código ya existe",
        },
        server: {
          title: "Error del servidor",
          description: "Se produjo un error interno",
        },
        network: {
          title: "Error de red",
          description: "Se produjo un error de red",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
    },
    list: {
      title: "Tasas impositivas",
      titleShort: "Tasas impositivas",
      description:
        "Todas las tarifas de impuestos configuradas para su empresa",
      widget: {
        actions: "Acciones",
        retry: "Volver a intentar",
        previous: "Anterior",
        next: "Siguiente",
        addRate: "Tasa",
        labelDefault: "Predeterminado",
        labelActive: "Activa",
        labelInactive: "Inactivo",
        labelEdit: "Editar",
        labelDelete: "Desactivar",
        labelCompound: "Compuesto",
        empty:
          "No hay tasas de impuestos configuradas. Agregue su primera tasa para empezar.",
        emptySetup:
          "Configura los tipos impositivos que aplica tu empresa en sus facturas.",
        columnRate: "Tasa de impuestos",
        columnTypeRateActions: "Tipo / Tasa / Estado",
        backToCatalog: "← Productos",
      },
      companyId: {
        label: "Company",
        description: "Compañía para enumerar los impuestos",
        placeholder: "Company ID",
      },
      country: {
        label: "Filtro del país",
        description: "Filtro por código de país (opcional)",
        placeholder: "Por ejemplo. AT",
      },
      type: {
        label: "Tipo Filtro",
        description: "Filtro por tipo de impuesto (opcional)",
        placeholder: "Seleccione tipo de impuesto",
      },
      page: {
        label: "Página",
        description: "Número de página (fotos a 1)",
      },
      pageSize: {
        label: "Por página",
        description: "Resultados por página (max 100)",
      },
      response: {
        total: "Total",
        rates: "Tasas impositivas",
        rate: {
          id: "ID",
          company: "Empresa",
          name: "Nombre",
          code: "Código",
          type: "Tipo",
          rate: "Tasa",
          country: "País",
          region: "Región",
          isDefault: "Predeterminado",
          isActive: "Activa",
          isCompound: "Compuesto",
          createdAt: "Creado",
          updatedAt: "Actualizado",
        },
      },
      success: {
        title: "Tasas de impuestos cargadas",
        description: "Tasas de impuestos recuperadas con éxito",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprueba tus entradas e intenta de nuevo",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado.",
        },
        forbidden: {
          title: "Acceso denegado",
          description: "Usted no tiene permiso para ver las tasas de impuestos",
        },
        notFound: {
          title: "No encontrado",
          description: "Compañía no encontrada",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
        server: {
          title: "Error del servidor",
          description: "Se produjo un error interno",
        },
        network: {
          title: "Error de red",
          description: "Se produjo un error de red",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
    },
    update: {
      title: "Tasa de impuestos de actualización",
      titleShort: "Tasa de actualización",
      description: "Modificar la tasa tributaria existente",
      widget: {
        save: "Guardar tipo impositivo",
        backToList: "Volver a Tasas Fiscales",
        failed: "No se guardó el tipo",
        subtitle: "{{company}} · {{code}}",
        notFoundTitle: "Este tipo impositivo ya no existe",
        notFoundMessage:
          "Se eliminó o pertenece a una empresa a la que no tienes acceso. Elige un tipo de la lista.",
        loadErrorTitle: "No se pudo cargar el tipo impositivo",
      },
      rateId: {
        label: "Tasa de impuestos ID",
        description: "El ID de la tasa tributaria para actualizar",
        placeholder: "Tasa de impuestos UUID",
      },
      name: {
        label: "Nombre",
        description: "Nombre actualizado para la tasa de impuestos",
        placeholder: "Por ejemplo. VAT 20%",
      },
      rate: {
        label: "Tasa",
        description: "Tasa de impuestos actualizada como decimal (0.2 = 20%)",
        placeholder: "0.2000",
      },
      isDefault: {
        label: "Tasa de incumplimiento",
        description:
          "Utilice esta tasa como predeterminado para nuevos elementos",
      },
      isActive: {
        label: "Activa",
        description: "Si esta tasa de impuestos está activa",
      },
      response: {
        updated: "Actualizado",
      },
      success: {
        title: "Tasa de impuestos actualizada",
        description: "La tasa de impuestos se ha actualizado",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprueba tus entradas e intenta de nuevo",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado.",
        },
        forbidden: {
          title: "Acceso denegado",
          description:
            "Usted no tiene permiso para gestionar las tasas de impuestos",
        },
        notFound: {
          title: "No encontrado",
          description: "Tasa de impuestos no encontrada",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
        server: {
          title: "Error del servidor",
          description: "Se produjo un error interno",
        },
        network: {
          title: "Error de red",
          description: "Se produjo un error de red",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
    },
    delete: {
      title: "Suprimir la tasa de impuestos",
      titleShort: "Tasa de eliminación",
      description: "Desactivar una tasa de impuestos",
      widget: {
        backToList: "Volver a Tasas Fiscales",
        warning:
          "Esto desactivará la tasa tributaria. Esta acción no se puede deshacer.",
        confirmTitle: "¿Desactivar esta tasa de impuestos?",
        confirmDescription:
          "Las tasas desactivadas ya no se pueden aplicar a las facturas. Las líneas de facturas existentes no se ven afectadas.",
        confirmButton: "Sí, desactivado.",
        cancelButton: "Cancelar",
      },
      rateId: {
        label: "Tasa de impuestos ID",
        description: "El ID de la tasa tributaria para desactivar",
        placeholder: "Tasa de impuestos UUID",
      },
      response: {
        deleted: "Desactivado",
      },
      success: {
        title: "Tasa de impuestos desactivada",
        description: "La tasa de impuestos ha sido desactivada",
      },
      errors: {
        validation: {
          title: "Error de validación",
          description: "Comprueba tus entradas e intenta de nuevo",
        },
        unauthorized: {
          title: "Se requiere autenticación",
          description: "Debes estar conectado.",
        },
        forbidden: {
          title: "Acceso denegado",
          description:
            "Usted no tiene permiso para gestionar las tasas de impuestos",
        },
        notFound: {
          title: "No encontrado",
          description: "Tasa de impuestos no encontrada",
        },
        conflict: {
          title: "Conflicto",
          description: "Se produjo un conflicto",
        },
        server: {
          title: "Error del servidor",
          description: "Se produjo un error interno",
        },
        network: {
          title: "Error de red",
          description: "Se produjo un error de red",
        },
        unknown: {
          title: "Error desconocido",
          description: "Ocurrió un error inesperado",
        },
        unsavedChanges: {
          title: "Cambios sin guardar",
          description: "Tienes cambios sin guardar",
        },
      },
    },
  },

  report: {
    title: "Impuestos por tasa",
    titleShort: "Impuestos por tasa",
    description:
      "Consulta los impuestos registrados en facturas de venta, notas de crédito, facturas de compra y ventas en caja.",
    widget: {
      retry: "Volver a cargar el informe",
      scope:
        "Las facturas de venta usan la fecha del asiento asociado o la fecha de creación. Las compras usan la fecha de la factura. Las ventas en caja usan su fecha de cierre (UTC) e incluyen las líneas con un tipo positivo o un importe de impuesto registrado. Si una factura emitida comparte el asiento, representa esa venta.",
      empty:
        "Aquí aparecen las facturas emitidas, notas de crédito, facturas de compra y ventas en caja con impuestos, agrupadas por tipo.",
      range: "Del {{from}} al {{to}}",
      total: "Total",
      previousMonth: "Ver el mes anterior",
      unknownRate: "Tasa indeterminada",
      run: "Generar informe",
      running: "Generando informe…",
      scopeHint:
        "Compara el IVA de ventas y compras por tipo impositivo para una empresa y un periodo.",
      selectCompany: "Selecciona la empresa para este informe.",
      subtitle: "{{company}} · del {{from}} al {{to}}",
      errorTitle: "No se pudo cargar el informe de impuestos",
      emptyTitle: "No hay documentos con impuestos en este periodo",
      period: {
        label: "Periodo",
        thisMonth: "Este mes",
        lastMonth: "Mes pasado",
        thisQuarter: "Este trimestre",
        thisYear: "Este año",
        custom: "Personalizado",
      },
      kpi: {
        salesTax: "IVA repercutido",
        salesBase: "Ventas sujetas",
        purchaseTax: "IVA soportado",
        purchaseBase: "Compras sujetas",
      },
    },
    currency: {
      label: "Moneda",
      placeholder: "Moneda de la empresa",
      description: "Por defecto se usa la moneda de la empresa.",
    },
    currencies: { EUR: "EUR", PLN: "PLN", USD: "USD" },
    companyId: {
      label: "Company",
      description: "Empresa para generar el informe de impuestos",
      placeholder: "Company ID",
    },
    dateFrom: {
      label: "Desde",
      description: "Fecha de inicio para el período del informe",
      placeholder: "Inicio de este mes",
    },
    dateTo: {
      label: "A",
      description: "Fecha final del período del informe",
      placeholder: "Hoy",
    },
    response: {
      rows: "Report Rows",
      row: {
        direction: "Tipo de documento",
        rate: "Tasa de impuesto",
        taxableAmount: "Cuantía fiscal",
        taxAmount: "Cuantía fiscal",
      },
    },
    success: {
      title: "Informe tributario generado",
      description: "Informe fiscal recuperado con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description:
          "La fecha final debe ser igual o posterior a la fecha inicial.",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado.",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para ver los informes fiscales",
      },
      notFound: {
        title: "No encontrado",
        description: "Compañía no encontrada",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error interno",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
  },

  enums: {
    reportDirection: {
      nonDeductible: "IVA soportado no deducible",
      reverseCharge: "IVA devengado por inversión del sujeto pasivo",
      posSales: "Ventas en caja",
      sales: "Facturas de venta",
      creditNotes: "Notas de crédito de ventas",
      purchases: "Facturas de compra",
    },
    taxType: {
      vat: "VAT",
      gst: "GST",
      sales: "Impuestos de ventas",
      withholding: "Retención de impuestos",
      none: "Sin impuestos / Exento",
    },
  },

  tags: {
    tax: "impuesto fiscal",
    rate: "Tasa",
    create: "crear",
    list: "lista",
    update: "actualización",
    delete: "Borrador",
    report: "informe",
  },
};
