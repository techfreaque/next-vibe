import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Impuestos", vatReturn: "Declaración de IVA" },
  title: "Declaración de IVA eslovaca y declaración de control",
  titleShort: "Declaración de IVA (SK)",
  description:
    "Prepare las casillas de la declaración DPH y el XML de la declaración de control (kontrolný výkaz) de un mes o trimestre.",
  company: {
    label: "Empresa",
    description: "La empresa dada de alta en el IVA",
  },
  period: {
    label: "Periodo",
    description: "Mes o trimestre de la declaración",
    month: "{{month}} {{year}}",
    quarter: "T{{quarter}} {{year}}",
  },
  unsupportedCountry:
    "La declaración de IVA solo se prepara para empresas eslovacas. Indique Eslovaquia como país de la empresa para usarla.",
  disclaimer:
    "Ofrecemos herramientas, no asesoría fiscal. Revise las declaraciones con su asesor fiscal antes de presentarlas en eDane.",
  summary: "{{company}}, del {{from}} al {{to}}",
  due: "Vence el día 25 del mes siguiente, por vía electrónica.",
  lines: {
    title: "Casillas de la declaración DPH (DPHv25)",
    line: "Casilla",
    meaning: "Concepto",
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
    title: "Declaración de control (KV DPH)",
    section: "Sección",
    count: "Filas",
    A1: "A.1 Facturas emitidas a sujetos pasivos",
    A2: "A.2 Facturas emitidas con inversión del sujeto pasivo nacional",
    B1: "B.1 Facturas recibidas, usted paga el impuesto",
    B2: "B.2 Facturas nacionales recibidas con deducción",
    B31: "B.3.1 Facturas simplificadas recibidas (total)",
    C1: "C.1 Facturas rectificativas emitidas",
    D1: "D.1 Ventas eKasa",
    D2: "D.2 Otras entregas (clientes sin IČ DPH)",
  },
  warnings: {
    noVatId:
      "La empresa no tiene un NIF-IVA (IČ DPH) válido. El XML KV lo exige antes de presentarlo.",
    customerVatIds:
      "{{count}} facturas a clientes sin IČ DPH se declaran en D.2.",
    unmappedRates:
      "{{count}} filas usan tipos distintos de 23 / 19 / 5 % y no entran en la declaración. Revíselas.",
    b32Required:
      "El IVA deducido de facturas simplificadas ha llegado a 3.000 EUR. Detállelas por proveedor en B.3.2 antes de presentar.",
  },
  actions: {
    downloadKv: "Descargar XML KV DPH",
    downloadCsv: "Descargar casillas de la declaración (CSV)",
    showXml: "Mostrar XML",
    hideXml: "Ocultar XML",
    copy: "Copiar",
    copied: "Copiado",
    copyError: "No se pudo copiar. Seleccione el texto y cópielo manualmente.",
  },
  pickCompany: "Elija una empresa para preparar su declaración de IVA.",
  empty: "No hay documentos con relevancia para el IVA en este periodo.",
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
      "Las casillas y la declaración de control reflejan los documentos guardados.",
  },
};
