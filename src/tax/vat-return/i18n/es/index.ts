import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Impuestos", vatReturn: "Declaración de IVA" },
  title: "Declaración de IVA",
  titleShort: "Declaración de IVA",
  description:
    "Su declaración de IVA del período, en el formato oficial de su país.",
  company: {
    label: "Empresa",
    description: "La empresa para la que se prepara la declaración",
  },
  period: {
    label: "Periodo",
    description: "Mes o trimestre de la declaración",
    month: "{{month}} {{year}}",
    quarter: "T{{quarter}} {{year}}",
  },
  disclaimer:
    "Ofrecemos herramientas, no asesoría fiscal. Revise las declaraciones con su asesor antes de presentarlas.",
  summary: "{{company}}, del {{from}} al {{to}}",
  formats: {
    SK_DPH: "Casillas de la declaración DPH (DPHv25)",
    DE_USTVA: "Umsatzsteuer-Voranmeldung (UStVA)",
    DE_EUR_SMALL_BUSINESS: "Resumen EÜR (exención § 19 UStG)",
    AT_UVA: "Umsatzsteuervoranmeldung (U30)",
    AT_EA_SMALL_BUSINESS: "Resumen de ingresos y gastos (§ 6 ap. 1 Z 27 UStG)",
    GENERIC_VAT: "Resumen de IVA por tipo",
  },
  dueByFormat: {
    SK_DPH: "Vence el día 25 del mes siguiente, por vía electrónica.",
    DE_USTVA: "Vence el día 10 del mes siguiente mediante ELSTER.",
    DE_EUR_SMALL_BUSINESS: "Resumen anual EÜR con la declaración de renta.",
    AT_UVA: "Vence el día 15 del segundo mes siguiente mediante FinanzOnline.",
    AT_EA_SMALL_BUSINESS: "Resumen anual para pequeñas empresas.",
    GENERIC_VAT: "Consulte el plazo oficial de su administración tributaria.",
  },
  smallBusiness: {
    title: "No se requiere declaración de IVA (régimen de pequeña empresa)",
    body: {
      SK_DPH: "Esta empresa no está dada de alta en el IVA.",
      DE_USTVA: "No se requiere UStVA periódica.",
      DE_EUR_SMALL_BUSINESS:
        "Esta empresa aplica la exención § 19 UStG. No necesita presentar UStVA periódica. Abajo tiene su resumen EÜR del período.",
      AT_UVA: "No se requiere UVA periódica.",
      AT_EA_SMALL_BUSINESS:
        "Esta empresa aplica la exención § 6 ap. 1 Z 27 UStG. Abajo tiene su resumen de ingresos y gastos.",
      GENERIC_VAT: "No se requiere declaración de IVA para este régimen.",
    },
  },
  xmlSection: {
    SK_DPH: "Declaración de control (KV DPH)",
    DE_USTVA: "XML ELSTER UStVA",
    DE_EUR_SMALL_BUSINESS: "Exportación XML",
    AT_UVA: "XML FinanzOnline UVA (U30)",
    AT_EA_SMALL_BUSINESS: "Exportación XML",
    GENERIC_VAT: "Exportación XML",
  },
  xmlNote: {
    SK_DPH: "Suba el XML KVDPHv25 en el portal eDane.",
    DE_USTVA:
      "XML ELSTER UStVA listo para importación contable o envío por ERiC. El envío directo requiere certificado ERiC; también puede copiar las casillas en Mein ELSTER o descargar el CSV.",
    DE_EUR_SMALL_BUSINESS: "Use la exportación CSV estructurada de arriba.",
    AT_UVA:
      "XML FinanzOnline U30 listo para subir al portal o revisar con su asesor.",
    AT_EA_SMALL_BUSINESS: "Use la exportación CSV estructurada de arriba.",
    GENERIC_VAT: "Use la exportación CSV estructurada de arriba.",
  },
  lines: {
    title: "Casillas de la declaración",
    line: "Casilla",
    meaning: "Concepto",
    base: "Base imponible",
    amount: "Importe",
    r01: "Base imponible al 19 %",
    r02: "IVA al 19 %",
    r01a: "Base imponible al 5 %",
    r02a: "IVA al 5 %",
    r03: "Base imponible al 23 %",
    r04: "IVA al 23 %",
    r09: "Inversión del sujeto pasivo, base al 19 % (usted paga el impuesto)",
    r10: "Inversión del sujeto pasivo, IVA al 19 %",
    r09a: "Inversión del sujeto pasivo, base al 5 %",
    r10a: "Inversión del sujeto pasivo, IVA al 5 %",
    r09b: "Inversión del sujeto pasivo, base al 23 %",
    r10b: "Inversión del sujeto pasivo, IVA al 23 %",
    r13: "Operaciones exentas",
    r14: "de las cuales entregas intracomunitarias de bienes (§ 43)",
    r15: "de las cuales exportaciones (§§ 46, 47)",
    r17: "Total IVA devengado",
    r18: "IVA soportado deducible al 19 %",
    r18a: "IVA soportado deducible al 5 %",
    r19: "IVA soportado deducible al 23 %",
    r20: "de las cuales facturas nacionales al 19 %",
    r20a: "de las cuales facturas nacionales al 5 %",
    r21: "de las cuales facturas nacionales al 23 %",
    r24: "Rectificaciones de base (facturas rectificativas, § 25)",
    r25: "Rectificaciones de IVA (facturas rectificativas, § 25)",
    r32: "IVA a ingresar",
    r33: "IVA a devolver (exceso de deducción)",
  },
  sections: {
    title: "Declaración de control",
    section: "Sección",
    count: "Filas",
    A1: "A.1 Facturas emitidas a sujetos pasivos",
    A2: "A.2 Facturas emitidas con inversión del sujeto pasivo nacional",
    B1: "B.1 Facturas recibidas, usted paga el impuesto",
    B2: "B.2 Facturas nacionales recibidas con deducción",
    B31: "B.3.1 Facturas simplificadas recibidas (total)",
    C1: "C.1 Facturas rectificativas emitidas",
    D1: "D.1 Ventas de caja fiscal",
    D2: "D.2 Otras entregas (clientes sin NIF-IVA)",
  },
  warnings: {
    noVatId:
      "La empresa no tiene un NIF-IVA válido configurado. Añádalo antes de presentar.",
    noTaxId:
      "La empresa no tiene un número fiscal configurado. Añádalo antes de exportar.",
    customerVatIds:
      "{{count}} facturas a clientes sin NIF-IVA se declaran en D.2.",
    unmappedRates:
      "{{count}} filas usan tipos no estándar y no entran en las casillas asignadas. Revíselas.",
    b32Required:
      "El IVA deducido de facturas simplificadas ha llegado a 3.000 EUR. Detállelas por proveedor en B.3.2 antes de presentar.",
  },
  actions: {
    downloadXml: "Descargar XML",
    downloadCsv: "Descargar CSV",
    showXml: "Mostrar XML",
    hideXml: "Ocultar XML",
    copy: "Copiar",
    copied: "Copiado",
    copyError: "No se pudo copiar. Seleccione el texto y cópielo manualmente.",
  },
  pickCompany: "Elija una empresa para preparar su declaración de IVA.",
  empty: "No hay documentos relevantes en este periodo.",
  errors: {
    validation: {
      title: "Solicitud no válida",
      description: "Elija una empresa y un mes o trimestre válido.",
    },
    unauthorized: {
      title: "Inicio de sesión necesario",
      description: "Inicie sesión para preparar declaraciones de IVA.",
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
        "Los datos cambiaron durante la preparación. Inténtelo de nuevo.",
    },
    server: {
      title: "Declaración no preparada",
      description:
        "No se pudo preparar la declaración de IVA. Inténtelo de nuevo.",
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
    title: "Declaración de IVA preparada",
    description:
      "Las casillas y los archivos de exportación reflejan los documentos guardados.",
  },
};
