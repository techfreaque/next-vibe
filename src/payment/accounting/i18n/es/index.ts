import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  saleType: "Venta",
  feeType: "Comisión",
  refundType: "Reembolso",

  title: "Contabilidad de pagos",
  review: "Revisar o contabilizar pagos verificados",
  configure: "Configurar una oferta del catálogo",
  company: "Empresa",
  product: "Producto del catálogo",
  providerStripe: "Stripe",
  providerNow: "NOWPayments",
  currencyEur: "EUR",
  currencyUsd: "USD",
  currencyPln: "PLN",
  provider: "Proveedor",
  merchant: "Identidad verificada del comercio",
  offer: "ID de oferta o precio",
  currency: "Moneda",
  recognition: "Reconocimiento",
  immediate: "Reconocer en la venta",
  deferred: "Diferir como pasivo",
  receivable: "Cuenta de clientes",
  clearing: "Cuenta de compensación",
  consideration: "Cuenta de ingresos o pasivo",
  vat: "IVA repercutido",
  expense: "Cuenta de gasto por comisiones",
  zeroTax:
    "Confirma que el IVA no indicado de este producto a tipo cero equivale a cero",
  ids: "ID de justificantes verificados",
  dryRun: "Solo vista previa",
  submit: "Ejecutar",
  sources: "Justificantes verificados",
  gross: "Importe bruto",
  tax: "Impuesto",
  fee: "Comisión del proveedor",
  receipt: "Referencias de factura y asiento",
  posted: "Contabilizado",
  ready: "Listo para contabilizar",
  saved: "Oferta vinculada",
  alreadyPosted: "Ya contabilizado",
  forbidden: "Careces de permiso para esta empresa.",
  missingEvidence: "El justificante verificado no está disponible.",
  missingMapping: "Configura una oferta y un producto coincidentes.",
  unsupportedCurrency: "Revisa la moneda y concilia el cambio por separado.",
  unmatchedTransaction:
    "Vincula el pago local verificado antes de contabilizar.",
  unverifiedTax:
    "Obtén el desglose fiscal verificado o configura de forma explícita el tipo cero permitido.",
  invalidAccounts: "Comprueba las cuentas activas y su función.",
  periodClosed: "Abre el periodo o concilia la fecha del justificante.",
  unverifiedRefundAllocation:
    "Obtén el reparto verificado del reembolso o concílialo con la venta original.",
  creditsGranted: "Créditos concedidos",
  creditsConsumed: "Créditos utilizados",
  deferredRefundNeedsReview:
    "Comprueba cuánto se ha utilizado del servicio o del paquete de créditos. Concilia el reembolso con el pasivo pendiente y los ingresos reconocidos.",
  feeBillLinked: "Factura de proveedor vinculada",
  openFeeEntry: "Conciliar la factura de comisiones",
  openJournal: "Abrir asiento contable",
  openInvoice: "Abrir factura",
  openFeeBill: "Abrir factura de proveedor",
  feeNeedsBill:
    "Registra la factura de comisiones como factura recibida y verifica el impuesto.",
  taxRegimeConflict:
    "La empresa estaba exenta y el proveedor cobró IVA. Concilia el justificante.",
  inconsistentEvidence: "El justificante y el pago local no coinciden.",
  postingFailed:
    "No se pudo contabilizar. Revisa el justificante y vuelve a intentarlo.",
  missingProduct:
    "Elige un producto activo con referencia y tipo fiscal correctos.",
  conflict: "La oferta ya está vinculada.",
  empty: "No hay justificantes verificados que coincidan.",
  intro:
    "Vincula un producto a una oferta verificada y revisa el justificante de venta.",
  stripeTest: "Comercio Stripe de prueba",
  stripeLive: "Comercio Stripe real",
  nowMerchant: "Comercio NOWPayments",
  listError: "No se pudieron cargar los justificantes",
  detail: "Revisa la empresa y los datos.",
  recognizedRevenue: "Ingresos reconocidos",
  remainingLiability: "Pasivo pendiente",
  recognitionTitle: "Reconocer ingresos anticipados",
  recognitionDescription:
    "Añade una regla con fecha de vigencia o deja los campos vacíos para previsualizar el consumo verificado de créditos.",
  recognitionFrom: "Vigente desde (AAAA-MM-DD)",
  recognitionAccount: "Cuenta de ingresos",
  recognitionServicePeriods:
    "Reconocer los periodos de suscripción verificados",
  recognitionExpiry: "Reconocer los créditos vencidos elegibles",
  recognitionEntries: "Movimientos de crédito",
  recognitionPreview: "Vista previa lista",
  recognitionPosted: "Ingreso contabilizado",
  recognitionCurrent: "No hay movimientos nuevos elegibles",
  recognitionPolicySaved: "Regla guardada",
  recognitionPolicyConflict:
    "La fecha se solapa con una regla o una imputación contabilizada.",
  recognitionPolicyMissing:
    "Añade una regla vigente en la fecha del movimiento.",
  recognitionEvidenceMissing:
    "Comprueba la venta, el cobro y el movimiento de crédito.",
  recognitionExpiryReview: "Comprueba el vencimiento y la política aplicable.",
  recognitionServiceConflict:
    "El procesador envió fechas de servicio o importes contradictorios. Comprueba la factura original antes de reconocer los ingresos.",
  recognitionSubscriptionReview:
    "La suscripción requiere una imputación verificada al periodo de servicio.",
  recognitionInvalidAccounts:
    "Selecciona cuentas activas de pasivo e ingresos de la empresa.",
  recognitionPeriodClosed: "Abre el periodo contable del movimiento.",
  recognitionForbidden: "No puedes reconocer ingresos para esta empresa.",
  recognitionFailed:
    "No se pudo contabilizar el ingreso. Revisa el justificante y vuelve a intentarlo.",
  chooseProvider: "Elegir un proveedor",
  chooseCurrency: "Elegir una moneda",
  chooseRecognition: "Elegir cuándo reconocer los ingresos",
  noVatAccount:
    "Añade una cuenta activa de IVA repercutido al plan contable para poder elegirla aquí.",
  saveOffer: "Guardar oferta",
};
