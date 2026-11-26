import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  possibleDuplicateBookings:
    "Los movimientos podrían coincidir con una importación anterior. Revisa la cuenta bancaria contable antes de reintentar. No se guardó ningún movimiento.",
  privacyBeforeImport:
    "Configura la privacidad antes de previsualizar o importar movimientos.",
  previewResult: "Resultado de la vista previa",
  importResult: "Resultado de la importación",
  bookingDay: "Fecha contable {{date}}",
  bookingWindow: "Período contable del {{from}} al {{to}}",
  providerBookings: "Movimientos del proveedor revisados",
  eligibleBookings: "Movimientos empresariales admitidos",
  savedBookings: "Movimientos guardados",
  previewPrivacyResult:
    "Los movimientos descartados no cumplían tus reglas de privacidad. Al guardar se buscan facturas coincidentes. Las coincidencias ambiguas quedan sin vincular.",
  importPrivacyResult:
    "Los movimientos descartados no cumplían tus reglas de privacidad. Las coincidencias ambiguas con facturas quedan sin vincular.",
  setup: "Configurar la conexión bancaria",
  setupHint:
    "Guarda la cuenta contable y la fecha de inicio y configura la privacidad. La configuración no lee operaciones.",
  privacyAction: "Configurar la privacidad",
  privacyRequired:
    "Guarda las opciones de privacidad antes de leer las operaciones bancarias.",
  setupSaved:
    "Conexión guardada. Ya puede definir las reglas para los proveedores.",
  supplierTotals: "Totales por proveedor identificado en el período",
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
  maintenance: "Mantenimiento de conexiones bancarias",
  maintenanceHint:
    "Elimina los datos privados caducados, avisa a los titulares antes de que caduque el consentimiento y actualiza las conexiones activadas.",
  completed: "Conexiones actualizadas",
  failedFeeds: "Conexiones por revisar",
  notified: "Recordatorios enviados",
  matchedOnly:
    "Conservar solo los movimientos que cumplan las reglas de proveedores",
  discardedCount: "Descartados",
  autoMatched: "Conciliados con facturas",
  discardHint:
    "Los movimientos sin coincidencia se descartan sin guardar sus detalles. Desactive la opción para usar la bandeja de revisión privada.",
  company: "Empresa",
  account: "Cuenta bancaria del libro mayor",
  start: "Primer día contable",
  daily: "Sincronizar a diario",
  connect: "Conectar banco",
  review: "Revisar movimientos",
  held: "Por revisar",
  privateCount: "Privados",
  connected: "Banco conectado.",
  failed: "No se pudo completar la conexión. Vuelva a conectar el banco.",
  check: "Comprobar aplicación",
  active: "La aplicación está activa para consultar cuentas.",
  inactive:
    "El acceso de la aplicación a la información de cuentas está inactivo.",
  appUnavailable: "Estado de la aplicación no disponible.",
  linking:
    "Vincular la cuenta en el portal del proveedor la habilita para su uso. Autorice el acceso una vez en esta aplicación. Las cuentas ya autorizadas aparecen automáticamente.",
  pick: "Seleccione una cuenta para ver la vista previa de los movimientos contabilizados.",
  apply: "Importar movimientos",
  previewAction: "Vista previa",
  dailyHint:
    "Seleccione la fecha de inicio y revise los proveedores identificados antes de importar.",
  title: "Cuentas bancarias conectadas",
  description:
    "Revise o importe los movimientos contabilizados en una cuenta bancaria autorizada.",
  select: "Seleccione una conexión bancaria",
  preview: "Solo vista previa",
  sync: "Sincronizar movimientos bancarios",
  connection: "Conexión bancaria",
  consentUntil: "Consentimiento válido hasta",
  period: "Período contable",
  imported: "Importados",
  skipped: "Ya importados",
  unavailable:
    "La conexión bancaria no está disponible. Revise la conexión y los permisos de la cuenta.",
  consent:
    "El consentimiento ha caducado. Renuévelo en el banco antes de sincronizar.",
  rateLimit: "El banco está ocupado. Vuelva a intentarlo más tarde.",
  invalidResponse:
    "El banco devolvió un extracto incompleto. Se conserva la fecha del último avance.",
  windowTooLarge:
    "El período contiene demasiados movimientos. Importe un extracto más corto.",
  empty: "No hay cuentas bancarias conectadas",
  noBookings: "No hay movimientos en este período.",
  newBookings: "Movimientos nuevos",
  through: "Último día importado",
};
