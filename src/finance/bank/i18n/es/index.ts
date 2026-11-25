import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    bank: "banca",
    reconciliation: "conciliación",
  },
  fields: {
    exactAmount: "Importe exacto",
    status: "Estado",
    company: "Empresa",
    account: "Cuenta bancaria",
    csv: "Extracto CSV",
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
    csvFormat: "Formato CSV",
    commaFormat: "Separador coma y punto decimal",
    semicolonFormat: "Separador punto y coma y coma decimal",
    sameDay: "Mismo importe y fecha",
    upload: "Elegir archivo CSV",
    dropCsv: "O arrastra un CSV aquí",
    pasteCsv: "Pegar texto CSV",
    supportedFormat: "Formato admitido",
    mapping: "Asignar columnas",
    chooseColumn: "Elegir columna del CSV",
    preview: "Vista previa (primeros 5 movimientos)",
    matchRow: "Conciliar",
    unmatched: "Pendiente",
    csvHelp:
      "Asigna un identificador estable, una fecha (AAAA-MM-DD o DD.MM.AAAA), un importe con signo en el formato decimal elegido y una moneda en mayúsculas. Los importes positivos son ingresos. Un movimiento por línea, sin separadores de miles.",
    unsupported:
      "Convierte antes CAMT XML, OFX/QFX, MT940, hojas de cálculo, PDF y CSV con otros separadores o registros de varias líneas.",
    chooseScope: "Selecciona una empresa y una cuenta bancaria activa.",
    empty: "No hay movimientos por conciliar",
    emptyHint: "Importa un extracto para empezar.",
    review: "Revisar coincidencias",
    noCandidates: "No hay líneas contables que coincidan",
    noCandidatesHint:
      "Comprueba la cuenta bancaria, la moneda y el importe del asiento.",
    alreadyMatched: "Este movimiento ya está conciliado.",
    importAction: "Importar CSV",
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
  },
  import: {
    title: "Importar extracto bancario",
    description: "Sube o pega el CSV de una cuenta bancaria.",
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
