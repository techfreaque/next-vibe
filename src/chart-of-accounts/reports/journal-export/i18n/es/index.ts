import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Exportación CSV del diario",
  description:
    "Exporta las líneas contabilizadas y sus reversiones para una empresa y una moneda.",
  company: "Empresa",
  currency: "Moneda",
  currencyHint: "Escribe un código de moneda de tres letras, como EUR.",
  otherCurrency: "Otra moneda",
  debitCount: "Líneas de debe",
  creditCount: "Líneas de haber",
  invalidLine:
    "Una línea guardada tiene un indicador de debe o haber no válido.",
  from: "Desde",
  to: "Hasta",
  prepare: "Preparar CSV",
  preparing: "Preparando CSV…",
  download: "Descargar CSV",
  copy: "Copiar CSV",
  copied: "CSV copiado",
  copyFailed: "No se pudo copiar el CSV. Inténtalo de nuevo.",
  filename: "Nombre del archivo",
  rowCount: "Líneas del diario",
  invalidDates:
    "Elige un intervalo válido. La fecha final debe ser igual o posterior a la inicial.",
  tooLarge:
    "La exportación supera las 10 000 líneas o los 5 MiB. Elige un intervalo más corto.",
  ready: "CSV listo",
  headerEntry: "Número de asiento",
  headerDate: "Fecha contable",
  headerPosted: "Fecha y hora de contabilización (UTC)",
  headerSource: "Origen",
  headerAccountCode: "Código de cuenta",
  headerAccountName: "Nombre de cuenta",
  headerDescription: "Descripción del asiento",
  headerLineDescription: "Descripción de la línea",
  headerCurrency: "Moneda",
  headerDebit: "Debe",
  headerCredit: "Haber",
  errors: {
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Acceso requerido",
    },
    validation: {
      title: "Error de validación",
      description: "Ver todos los campos",
    },
    forbidden: {
      title: "Acceso denegado",
      description: "Autorizaciones insuficientes",
    },
    server: {
      title: "Error del servidor",
      description: "La operación falló, por favor intente de nuevo",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado",
    },
    conflict: { title: "Conflicto", description: "Conflicto de datos" },
    network: {
      title: "Error de red",
      description: "No podía llegar al servidor",
    },
    notFound: {
      title: "No encontrado",
      description: "No se encontró el recurso",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
  },
  tags: { journal: "journal", export: "export" },
};
