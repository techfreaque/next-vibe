import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Conectar un banco",
  description:
    "Autoriza el acceso de solo lectura. Cuando vuelvas, elige las operaciones comerciales que quieres guardar y revisa la vista previa.",
  company: "Empresa",
  ledgerAccount: "Cuenta bancaria del libro mayor",
  bankCountry: "País del banco",
  bankName: "Nombre del banco",
  psu: "Tipo de acceso al banco",
  personal: "Cuenta bancaria personal",
  business: "Empresarial",
  start: "Iniciar la autorización bancaria",
  ready: "Autorización lista",
  continueDescription:
    "Comprueba el banco y la cuenta contable seleccionados antes de continuar.",
  starting: "Iniciando la autorización…",
  authorize: "Continuar al banco",
  unavailable:
    "No se pudo iniciar la autorización. Comprueba el banco seleccionado y vuelve a intentarlo.",
  forbidden: "No tienes acceso a esta empresa y cuenta bancaria.",
  invalidAccount:
    "El consentimiento bancario no está disponible o ha caducado.",
  expiryTitle: "El consentimiento bancario caduca pronto",
  bankStep: "1 de 4 · Elige el banco",
  ledgerStep: "2 de 4 · Elige la cuenta contable",
  authorizeStep: "3 de 4 · Autoriza la consulta",
  next: "Elegir cuenta contable",
  back: "Volver al banco",
  createAccount: "Crear cuenta bancaria en el plan contable",
  noLedger:
    "Esta empresa no tiene una cuenta bancaria activa en su plan contable. Crea una para continuar.",
  search: "Busca tu banco",
  noBanks:
    "No hay bancos que coincidan. Prueba con otro nombre, país o tipo de cuenta.",
  loading: "Cargando bancos…",
  unconfigured:
    "Pide al administrador del servidor que configure el identificador de la aplicación y la clave de firma de Enable Banking.",
  directoryUnavailable:
    "El directorio de bancos no está disponible. Intenta cargarlo de nuevo.",
  retry: "Reintentar",
};
