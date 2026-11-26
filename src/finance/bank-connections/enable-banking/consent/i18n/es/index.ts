import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Conectar un banco",
  description:
    "Elige el banco y la cuenta contable. Tu banco autoriza el acceso de lectura durante un máximo de 180 días.",
  company: "Empresa",
  ledgerAccount: "Cuenta bancaria del libro mayor",
  bankCountry: "Código de país del banco",
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
};
