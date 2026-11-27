import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { compliance: "Cumplimiento", tax: "Impuestos" },
  enums: {
    vatTreatment: {
      domestic: "Venta nacional con IVA",
      reverseChargeDomestic: "Inversión del sujeto pasivo nacional",
      euServices: "Servicios a empresa de la UE (inversión del sujeto pasivo)",
      euGoods: "Entrega intracomunitaria de bienes (exenta)",
      export: "Exportación fuera de la UE (exenta)",
      exempt: "Operación exenta de IVA",
    },
    severity: {
      error: "Bloquea la emisión",
      warning: "Revisar",
      info: "Nota",
    },
  },
  issues: {
    issuerAddressMissing:
      "Añada la calle, la ciudad y el código postal de la empresa. Las facturas deben mostrar la dirección completa.",
    issuerRegistrationMissing:
      "Añada el número de registro de la empresa (IČO). Debe figurar en cada factura.",
    issuerRegistrationInvalid:
      "El número de registro (IČO) no es válido. Tiene 8 dígitos, incluido un dígito de control.",
    issuerTaxIdMissing:
      "Añada el número fiscal (DIČ). Debe figurar en cada factura.",
    issuerTaxIdInvalid:
      "El número fiscal (DIČ) no es válido. Tiene 10 dígitos.",
    issuerVatIdMissing:
      "Añada el NIF-IVA (IČ DPH). Las empresas sujetas a IVA deben indicarlo en sus facturas.",
    issuerVatIdInvalid:
      "El NIF-IVA (IČ DPH) no es válido. Consta de SK seguido de 10 dígitos.",
    customerVatIdMissing:
      "Añada el NIF-IVA del cliente a la dirección de facturación. La inversión del sujeto pasivo y las operaciones UE lo exigen.",
    customerVatIdInvalid: "El NIF-IVA del cliente no es válido.",
    customerNotForeignEu:
      "Las operaciones intracomunitarias exigen un NIF-IVA del cliente de otro país de la UE.",
    customerNotDomestic:
      "La inversión del sujeto pasivo nacional exige un NIF-IVA del cliente de su país.",
    treatmentNotAllowed:
      "Este tratamiento de IVA no encaja con el régimen de IVA de la empresa. Elija otro tratamiento o actualice el régimen.",
    treatmentRequiresZeroRate:
      "La inversión del sujeto pasivo y las operaciones exentas no llevan IVA. Ponga todas las líneas al 0 %.",
    rateNotValidOnDate:
      "El IVA del {{rate}} % no se aplica el {{date}}. Use un tipo vigente en la fecha de la entrega.",
    zeroRateWithoutReason:
      "Una línea tiene IVA del 0 % en una venta nacional. Elija la exención o la inversión del sujeto pasivo que corresponda.",
    issueDeadlinePassed:
      "Emitida {{days}} días después de la entrega. El plazo legal es de {{limit}} días.",
    regimeNotElected:
      "No hay régimen de IVA registrado. Hasta que elija uno, el ERP trata a la empresa como sujeto pasivo de IVA.",
    chartTemplateMismatch:
      "El plan de cuentas no procede de la plantilla de este país.",
    taxRatesMissing:
      "Faltan los tipos impositivos de este país. Añádalos para que los documentos puedan usarlos.",
    taxRatesOutdated:
      "Algunos tipos activos ya no están vigentes. Desactívelos o fije una fecha de fin.",
    fiscalProviderMissing:
      "Las ventas en efectivo y con tarjeta requieren una caja registradora eKasa certificada. Las ventas TPV siguen bloqueadas hasta conectar una.",
    eInvoicingUpcoming:
      "La factura electrónica estructurada será obligatoria el {{date}}. La exportación Peppol UBL está lista.",
    vatThresholdNear:
      "La facturación de este año natural es de {{turnover}}. Por encima de {{threshold}} el alta en el IVA es obligatoria.",
    vatThresholdExceeded:
      "La facturación de este año natural es de {{turnover}}, por encima del umbral de IVA de {{threshold}}. Dé de alta la empresa en el IVA.",
  },
  review: {
    title: "Control de cumplimiento por país",
    titleShort: "Control de cumplimiento",
    description:
      "Vea qué requisitos legales del país de la empresa se cumplen y qué corregir primero.",
    company: {
      label: "Empresa",
      description: "La empresa a revisar",
    },
    disclaimer:
      "Ofrecemos herramientas, no asesoría fiscal. Revise las declaraciones con su asesor fiscal.",
    country: "Normas del país",
    regime: "Régimen de IVA",
    findings: "Hallazgos",
    findingCode: "Hallazgo",
    findingSeverity: "Gravedad",
    allClear: "Se cumplen todos los requisitos de este país.",
    countries: {
      SK: "Eslovaquia",
      DE: "Alemania",
      AT: "Austria",
      XX: "Genérico (sin normas nacionales)",
    },
    facts: {
      title: "Lo que prepara el ERP",
      vatReturn: "Declaración de IVA y declaración de control",
      statements: "Cuentas anuales obligatorias",
      fiscal: "Tiques fiscales",
      eInvoicing: "Factura electrónica obligatoria desde",
      yes: "Disponible",
      no: "No disponible para este país",
      notRequired: "No obligatorio",
      required: "Obligatorio, mediante una caja registradora eKasa certificada",
    },
    actions: {
      company: "Editar datos de la empresa",
      regime: "Elegir régimen de IVA",
      rates: "Revisar tipos impositivos",
      chart: "Configurar plan de cuentas",
      vatReturn: "Abrir declaración de IVA",
      fiscal: "Abrir la configuración fiscal del TPV",
    },
    pickCompany: "Elija una empresa para revisar.",
    errors: {
      validation: {
        title: "Solicitud no válida",
        description: "Elija una empresa de la que sea miembro.",
      },
      unauthorized: {
        title: "Inicio de sesión necesario",
        description: "Inicie sesión para revisar el cumplimiento.",
      },
      forbidden: {
        title: "Sin acceso",
        description: "No es miembro de esta empresa.",
      },
      notFound: {
        title: "Empresa no encontrada",
        description: "La empresa no existe o está inactiva.",
      },
      conflict: {
        title: "Conflicto",
        description:
          "La empresa cambió durante la revisión. Inténtelo de nuevo.",
      },
      server: {
        title: "Revisión fallida",
        description:
          "No se pudo ejecutar el control de cumplimiento. Inténtelo de nuevo.",
      },
      network: {
        title: "Error de red",
        description: "Compruebe su conexión e inténtelo de nuevo.",
      },
      unknown: {
        title: "Error inesperado",
        description: "Algo salió mal. Inténtelo de nuevo.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guarde o descarte primero sus cambios.",
      },
    },
    success: {
      title: "Cumplimiento revisado",
      description: "Los hallazgos reflejan los datos actuales de la empresa.",
    },
  },
};
