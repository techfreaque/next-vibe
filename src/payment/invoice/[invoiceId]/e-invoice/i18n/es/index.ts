import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Factura electrónica (Peppol)",
  titleShort: "Factura electrónica",
  description:
    "Exporte una factura o una factura rectificativa emitida como archivo Peppol BIS Billing 3.0 (UBL, EN 16931).",
  invoiceId: {
    label: "Factura",
    description: "La factura o rectificativa emitida que desea exportar",
  },
  response: {
    invoiceNumber: "Número de documento",
    isCreditNote: "Factura rectificativa",
    fileName: "Nombre del archivo",
    ready: "Lista para enviar",
    missingFields: "Datos que faltan",
    xml: "XML",
  },
  widget: {
    back: "Volver",
    submit: "Preparar factura electrónica",
    invoice: "Factura {{number}}",
    creditNote: "Factura rectificativa {{number}}",
    ready: "Lista. Están todos los datos obligatorios de EN 16931.",
    missing: "Complete estos datos antes de enviar el archivo:",
    download: "Descargar XML",
    copy: "Copiar XML",
    copied: "XML copiado",
    copyFailed: "No se pudo copiar el XML",
    preview: "Ver XML",
    disclaimer: "Ofrecemos herramientas, no asesoramiento fiscal.",
  },
  fields: {
    bt1: "Número de documento",
    bt2: "Fecha de emisión",
    bt5: "Moneda",
    bt9: "Fecha de vencimiento",
    bt27: "Nombre de su empresa",
    bt31: "Su número de IVA",
    bt34: "Su dirección electrónica (número de IVA, NIF o número de registro)",
    bt40: "País de su empresa",
    bt44: "Nombre del cliente",
    bt48: "Número de IVA del cliente",
    bt49: "Dirección electrónica del cliente (número de IVA, NIF o número de registro)",
    bt55: "Dirección del cliente con país",
    bt153: "Una descripción en cada línea",
    bg25: "Al menos una línea",
  },
  errors: {
    validation: {
      title: "Solicitud no válida",
      description: "Revise la referencia de la factura.",
    },
    network: {
      title: "Error de red",
      description: "No se pudo cargar la factura electrónica.",
    },
    unauthorized: {
      title: "Inicio de sesión necesario",
      description: "Inicie sesión para exportar facturas electrónicas.",
    },
    forbidden: {
      title: "Sin acceso",
      description: "No tiene acceso a este documento.",
    },
    notFound: {
      title: "Documento no encontrado",
      description: "Esta factura no existe.",
    },
    server: {
      title: "Error en la exportación",
      description:
        "No se pudo generar la factura electrónica. Inténtelo de nuevo.",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo ha salido mal.",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guarde primero sus cambios.",
    },
    conflict: {
      title: "Aún no emitida",
      description:
        "Emita la factura antes de exportarla como factura electrónica.",
    },
  },
  success: {
    title: "Factura electrónica lista",
    description: "El archivo Peppol está listo.",
  },
  tags: {
    payment: "pago",
    invoice: "factura",
    eInvoice: "factura electrónica",
  },
};
