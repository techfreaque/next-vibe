import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  adjustment: {
    confirmHint:
      "Confirme para vincular el movimiento bancario y contabilizar los ajustes indicados.",
    autoMatch: "Conciliar automáticamente los pagos verificados a proveedores",
    autoMatched: "Conciliados automáticamente",
    followup: "Seguimiento del movimiento",
    followupHint:
      "Revisa un borrador de proveedor o anula una conciliación confirmada.",
    vendor: "Proveedor",
    expenseAccount: "Cuenta de gastos",
    reversalDate: "Fecha de reversión (AAAA-MM-DD)",
    reason: "Motivo de la anulación",
    openDraft: "Abrir factura de proveedor",
    settings: "Ajustes de conciliación bancaria",
    settingsHint:
      "Configura la divisa de la cuenta, el par permitido, el intervalo y los límites.",
    settingsSaved: "Ajustes de conciliación guardados",
    save: "Guardar ajustes",
    foreignCurrency: "Divisa de la factura para diferencias de cambio",
    absTolerance: "Diferencia de cambio máxima en la divisa de la cuenta",
    bpsTolerance: "Diferencia de cambio máxima en puntos básicos",
    days: "Intervalo de conciliación en días",
    gainAccount: "Cuenta de ganancias de cambio",
    lossAccount: "Cuenta de pérdidas de cambio",
    feeAccount: "Cuenta de gastos por comisiones documentadas",
    invalidSettings:
      "Revisa el par de divisas, los límites y las cuentas activas de la empresa.",
    description: "Ajuste de conciliación {{reference}}",
    unavailable:
      "No se pudo contabilizar el ajuste. Revisa la fecha, el período abierto y las cuentas.",
    journal: "Asiento de ajuste",
    kind: "Tipo de conciliación",
    fxDifference: "Ganancia o pérdida de cambio",
    release: "Anular conciliación bancaria",
    releaseHint:
      "Desvincula la línea y revierte el ajuste en un período abierto.",
    releaseSuccess: "Conciliación anulada",
    draft: "Borrador de factura desde movimiento bancario",
    draftHint:
      "Usa el importe contabilizado como justificante provisional. Añade la factura original antes de deducir impuestos.",
    draftReady: "Borrador de proveedor listo",
    confirmDraft: "Crear borrador provisional",
    sourceMemo:
      "Justificante bancario {{reference}}. Factura original pendiente.",
  },
  statement: {
    projected: "Listas para importar",
    localPreview:
      "La vista previa muestra fechas e importes antes del filtro de privacidad.",
    screenedOut: "Excluidas por el filtro de privacidad",
    screenedOutCount:
      "El filtro de privacidad dejó {{count}} líneas fuera del registro bancario.",
    format: "Formato del extracto",
    mapping: "Asignación de columnas",
    preview: "Vista previa de la importación",
    previewSuccess: "Vista previa de la importación",
    invalid:
      "El formato seleccionado no permite leer el extracto (fila {{row}}).",
    decimal: "Separador decimal",
    dotDecimal: "Punto decimal",
    commaDecimal: "Coma decimal",
    unmapped: "Sin columna",
    overlap:
      "Posible solapamiento con otro extracto. Revisa las referencias bancarias originales.",
    columns: {
      counterpartyIban: "IBAN de la contraparte",
      id: "Referencia bancaria",
      date: "Fecha contable",
      valueDate: "Fecha valor",
      amount: "Importe contabilizado",
      currency: "Divisa de contabilización",
      nativeAmount: "Importe original",
      nativeCurrency: "Divisa original",
      feeAmount: "Comisión documentada",
      feeCurrency: "Divisa de la comisión",
      description: "Descripción",
      counterparty: "Contraparte",
      status: "Estado",
    },
    formats: {
      normalized: "CSV estándar",
      c24: "CSV de C24",
      revolut: "CSV de Revolut personal",
      revolutBusiness: "CSV de Revolut Business",
      mapped: "CSV personalizado",
      camt053: "CAMT.053",
      mt940: "MT940",
    },
  },
  tags: {
    bank: "banca",
    reconciliation: "conciliación",
  },
  fields: {
    exactAmount: "Importe exacto",
    status: "Estado",
    company: "Empresa",
    account: "Cuenta bancaria",
    csv: "Extracto bancario",
    line: "Movimiento bancario",
    transactionId: "ID de transacción",
    bookedDate: "Fecha contable",
    amount: "Importe",
    currency: "Moneda",
    journalLine: "Línea contable",
    entryNumber: "Asiento contable",
    description: "Descripción",
    journalDate: "Fecha del asiento",
    confirm: "Confirma la conciliación",
    imported: "Importados",
    skipped: "Duplicados omitidos",
    matchedAt: "Conciliado el",
    page: "Página",
    pageSize: "Filas por página",
    total: "Total",
  },
  ui: {
    exactMatch: "Coincidencia exacta",
    csvFormat: "Separador de columnas",
    commaFormat: "Coma",
    semicolonFormat: "Punto y coma",
    sameDay: "Mismo importe y fecha",
    upload: "Elegir archivo del extracto",
    dropCsv: "O suelta un extracto aquí",
    pasteCsv: "Pegar texto del extracto",
    supportedFormat: "Formatos compatibles",
    mapping: "Asignar columnas",
    chooseColumn: "Elegir columna del CSV",
    preview: "Vista previa (primeros 5 movimientos)",
    matchRow: "Conciliar",
    unmatched: "Pendiente",
    matched: "Conciliado",
    allLines: "Todos",
    splitMatched: "Dividido",
    selectAccount: "Abrir cuenta",
    csvHelp:
      "Elige un extracto bancario o asigna las columnas CSV. La fecha contable y el importe con signo son obligatorios.",
    unsupported:
      "Usa CSV, CAMT.053 XML o texto MT940. Convierte primero los PDF, hojas de cálculo y otros formatos.",
    chooseScope: "Selecciona una empresa y una cuenta bancaria activa.",
    empty: "No hay movimientos por conciliar",
    emptyHint: "Importa un extracto para empezar.",
    review: "Revisar coincidencias",
    noCandidates: "No hay líneas contables que coincidan",
    noCandidatesHint:
      "Comprueba la cuenta bancaria, la moneda y el importe del asiento.",
    alreadyMatched: "Este movimiento ya está conciliado.",
    importAction: "Importar extracto",
    listAction: "Mostrar movimientos bancarios",
    back: "Volver",
    previous: "Anterior",
    next: "Siguiente",
    matchAction: "Conciliar este asiento",
    confirmHint:
      "El vínculo registra quién confirmó la conciliación. No genera asientos ni mueve dinero.",
  },
  errors: {
    validation: {
      title: "Revisa los datos",
      description:
        "Selecciona una empresa y una cuenta bancaria activa que admita asientos en su moneda.",
    },
    network: {
      title: "Error de red",
      description: "Comprueba la conexión e inténtalo de nuevo.",
    },
    unauthorized: {
      title: "Acceso requerido",
      description: "Inicia sesión para conciliar extractos bancarios.",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Tu rol en la empresa no permite esta acción.",
    },
    notFound: {
      title: "Cuenta o movimiento no disponible",
      description: "Comprueba la empresa y la cuenta bancaria seleccionadas.",
    },
    server: {
      title: "No se pudo completar la operación bancaria",
      description:
        "Inténtalo de nuevo. Si la operación falla, los datos quedan intactos.",
    },
    unknown: {
      title: "Error bancario inesperado",
      description: "Inténtalo de nuevo.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tus cambios siguen en el formulario.",
    },
    conflict: {
      title: "Conflicto de conciliación",
      description: "Actualiza el extracto y revisa el asiento seleccionado.",
    },
  },
  check: {
    encoding: "Guarda el archivo como CSV en UTF-8.",
    mappingHeader:
      "Elige el separador y usa una cabecera con al menos cuatro columnas con nombre.",
    mapping: "Elige una columna distinta para cada campo requerido.",
    columns: "La fila {{row}} debe tener las mismas columnas que la cabecera.",
    value: "La fila {{row}} contiene un valor no válido en {{field}}.",
    size: "Usa un CSV de hasta 256 KB y 1000 filas de datos.",
    header: "Usa exactamente las cabeceras transactionId,date,amount,currency.",
    empty: "Añade al menos una fila de transacción.",
    row: "Revisa el identificador, la fecha, el importe con signo y la moneda de la fila {{row}}.",
    duplicate:
      "La fila {{row}} repite un identificador de transacción con datos distintos.",
    storedDuplicate:
      "Un movimiento guardado ya usa ese identificador con datos distintos.",
    currency: "Todas las filas deben usar la moneda de la empresa.",
    journalTaken: "La línea contable seleccionada ya está conciliada.",
    journalMatch:
      "Elige una línea contabilizada sin conciliar que coincida en cuenta bancaria, importe y moneda.",
    confirmation: "Confirma la conciliación antes de guardar.",
    splitTotalMismatch:
      "Las partidas divididas deben sumar exactamente el importe del movimiento bancario.",
    splitTargetInvalid:
      "Comprueba que cada factura, gasto o cuenta pertenece a esta empresa y coincide con el sentido del pago.",
  },
  reconciliation: {
    statusTitle: "Estado de conciliación",
    accountsTitle: "Estado de cuentas bancarias",
    unmatchedLines: "Pendientes",
    matchedLines: "Conciliados",
    statementNet: "Saldo del extracto",
    ledgerBalance: "Saldo contable",
    difference: "Diferencia",
  },
  autoMatch: {
    title: "Conciliación automática",
    description:
      "Concilia movimientos bancarios abiertos con facturas, gastos y pagos contabilizados por importe, referencia, IBAN, ventana de fechas y tolerancia de divisa.",
    success: "Conciliación automática completada",
    action: "Auto-conciliar",
    dryRun: "Solo vista previa",
    previewAction: "Previsualizar",
    applyAction: "Aplicar conciliaciones",
    previewBanner: "Vista previa: {{count}} coincidencias inequívocas.",
    appliedBanner:
      "{{count}} movimientos bancarios conciliados automáticamente.",
    skippedHint:
      "{{count}} movimientos ambiguos omitidos para revisión manual.",
    matchedCount: "Conciliados",
    invoiceMatches: "Facturas",
    billMatches: "Facturas de proveedor",
    journalMatches: "Asientos",
    skippedAmbiguous: "Ambiguos omitidos",
    items: "Elementos conciliados",
    targetType: "Tipo",
    targetLabel: "Destino",
    basisLabel: "Criterio",
    emptyTitle: "No se encontraron coincidencias automáticas",
    emptyHint:
      "Revisa los movimientos pendientes manualmente o ajusta la ventana de fechas y tolerancia FX.",
    targets: {
      journal_line: "Línea contable",
      invoice: "Factura",
      bill: "Factura de proveedor",
    },
    basis: {
      reference: "Referencia de documento",
      iban: "IBAN",
      amount_date: "Importe y fecha",
      fx_tolerance: "Tolerancia FX o comisión",
    },
  },
  split: {
    title: "Dividir movimiento bancario",
    description:
      "Reparte un movimiento bancario entre varias facturas, gastos, cuentas o asientos contables.",
    success: "Movimiento dividido y conciliado",
    openAction: "Dividir",
    allocations: "Asignaciones",
    count: "Partidas",
    remaining: "Pendiente de asignar",
    selectTarget: "Seleccionar destino",
    addRow: "Añadir línea",
    removeRow: "Eliminar",
    confirmAction: "Confirmar división",
    documentCandidates: "Facturas y gastos abiertos",
    types: {
      journal_line: "Línea contable",
      invoice: "Factura abierta",
      bill: "Gasto abierto",
      account: "Cuenta contable",
    },
  },
  import: {
    title: "Importar extracto bancario",
    description: "Cargue o pegue el extracto de una cuenta bancaria.",
    success: "Extracto procesado",
  },
  list: {
    title: "Movimientos pendientes de conciliar",
    description:
      "Revisa los movimientos importados y vincúlalos con asientos contabilizados.",
    success: "Movimientos bancarios cargados",
  },
  candidates: {
    title: "Buscar asiento correspondiente",
    description:
      "Revisa los asientos bancarios contabilizados con el mismo importe y sentido.",
    success: "Asientos correspondientes cargados",
  },
  match: {
    title: "Confirmar conciliación bancaria",
    description:
      "Vincula este movimiento bancario con su asiento contabilizado.",
    success: "Movimiento bancario conciliado",
  },
};
