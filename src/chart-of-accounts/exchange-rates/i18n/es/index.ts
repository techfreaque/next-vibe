import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contabilidad",
  tags: {
    ledger: "libro-mayor",
    fx: "fx",
    rates: "tipos-de-cambio",
  },
  fields: {
    companyId: "Empresa",
    baseCurrency: "Divisa base",
    quoteCurrency: "Divisa cotizada",
    rate: "Tipo de cambio",
    rateDate: "Fecha del tipo",
    source: "Fuente",
    asOfDate: "Fecha de revalorización",
    dryRun: "Solo vista previa",
    postReversalNextDay: "Reversión automática al día siguiente",
    currency: "Divisa",
    limit: "Filas máximas",
  },
  list: {
    title: "Tipos de cambio",
    titleShort: "Tipos FX",
    description:
      "Tipos de referencia diarios del BCE y tipos manuales para el libro mayor multidivisa",
    syncEcbAction: "Sincronizar tipos BCE",
    setManualAction: "Añadir tipo manual",
    revalueAction: "Revalorización FX de cierre",
    empty:
      "Aún no hay tipos de cambio guardados. Sincroniza los tipos diarios del BCE o añade uno manual.",
    countLabel: "Tipos guardados",
    latestDate: "Última fecha",
    success: "Tipos de cambio cargados",
  },
  set: {
    title: "Definir tipo de cambio manual",
    description:
      "Guarda un tipo manual (1 divisa base = tipo divisa cotizada). El tipo manual prevalece sobre el BCE en la misma fecha.",
    action: "Guardar tipo",
    success: "Tipo de cambio guardado",
  },
  sync: {
    title: "Sincronizar tipos diarios BCE",
    description:
      "Obtiene los últimos tipos de referencia del euro publicados por el Banco Central Europeo",
    action: "Obtener tipos BCE ahora",
    success: "Tipos diarios BCE sincronizados",
    upsertedCount: "Tipos actualizados",
  },
  revaluation: {
    title: "Revalorización FX de cierre de periodo",
    description:
      "Revaloriza cuentas por cobrar, por pagar y saldos bancarios en moneda extranjera al tipo de cierre",
    action: "Ejecutar revalorización FX",
    previewAction: "Vista previa",
    postAction: "Contabilizar revalorización",
    success: "Revalorización FX completada",
    noAdjustments:
      "No hay saldos abiertos en divisa extranjera que requieran revalorización.",
    functionalCurrency: "Moneda funcional",
    totalUnrealized: "Resultado FX no realizado neto",
    journalEntryId: "Asiento de revalorización",
    reversalEntryId: "Asiento de reversión",
    missingRates: "Divisas sin tipo de cierre",
    account: "Cuenta",
    foreignBalance: "Saldo original",
    carryingFunctional: "Valor en libros",
    closingRate: "Tipo de cierre",
    revaluedFunctional: "Valor revalorizado",
    unrealizedDelta: "Diferencia no realizada",
    previewBanner: "Solo vista previa. No se registró ningún asiento.",
    postedBanner: "Asiento de revalorización FX contabilizado.",
  },
  errors: {
    validation: {
      title: "Datos no válidos",
      description:
        "Revisa los códigos de divisa, la fecha y el tipo de cambio.",
    },
    unauthorized: {
      title: "Inicio de sesión requerido",
      description: "Inicia sesión para gestionar los tipos de cambio.",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Se requieren permisos contables para esta acción.",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró la empresa o los tipos de cambio.",
    },
    conflict: {
      title: "Conflicto",
      description:
        "Falta un periodo contable abierto o las cuentas FX requeridas.",
    },
    network: {
      title: "Error de red",
      description: "No se pudo consultar el servicio de tipos del BCE.",
    },
    server: {
      title: "Error del servidor",
      description: "Error inesperado al procesar los datos FX.",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar.",
    },
  },
};
