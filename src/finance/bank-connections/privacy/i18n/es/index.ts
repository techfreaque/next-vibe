import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Privacidad bancaria",
  description:
    "Revisa los movimientos de cuentas mixtas antes de enviarlos a contabilidad.",
  connection: "Conexión bancaria",
  empty: "Esta conexión no tiene movimientos pendientes de revisión.",
  selectConnection:
    "Selecciona una conexión bancaria para ver su configuración.",
  policy: "Configuración de privacidad",
  policyDescription: "Decide qué movimientos pueden llegar a contabilidad.",
  mode: "Modo",
  retention: "Conservación en días",
  rules: "Reglas",
  suggestions: "Proveedores sugeridos",
  inbox: "Movimientos para revisar",
  decision: "Decisión sobre el movimiento",
  decisionDescription:
    "Importa el movimiento empresarial o borra los detalles del privado.",
  operation: "Acción sobre la regla",
  ruleField: "Campo de comparación",
  ruleMatch: "Tipo de coincidencia",
  literal: "Texto literal",
  outcome: "Resultado",
  ruleSupplier: "Proveedor para los totales (opcional)",
  chooseSupplier: "Elegir proveedor",
  clearSupplier: "Quitar proveedor",
  identity: "Identificador del movimiento",
  always: "Aplica siempre esta decisión a esta misma contraparte",
  apply: "Aplicar",
  saved: "Guardado",
  ruleSaved: "Regla guardada",
  ruleFailed: "Se guardó la decisión. No se pudo guardar la regla.",
  addSuggestion: "Añadir como regla empresarial",
  editPolicy: "Editar configuración",
  editRule: "Añadir o editar una regla",
  approving: "Importación empresarial pendiente",
  privateAction: "Mantener privado este movimiento",
  businessAction: "Enviar a contabilidad",
  expires: "Vence el {{date}}",
  businessExplanation:
    "En modo empresarial, los nuevos movimientos sin regla pasan a contabilidad.",
  modes: {
    mixed: "Cuenta mixta",
    business: "Cuenta exclusivamente empresarial",
  },
  outcomes: {
    business: "Empresarial",
    private: "Privado",
  },
  ruleFields: {
    counterparty: "Contraparte",
    iban: "IBAN",
    description: "Descripción",
  },
  matches: {
    equals: "Exacta",
    contains: "Contiene",
    startsWith: "Empieza por",
  },
  operations: {
    policy: "Cambiar configuración",
    set: "Añadir o sustituir regla",
    remove: "Eliminar regla",
  },
  errors: {
    forbidden: "Esta conexión bancaria no te pertenece.",
    invalid: "Revisa los campos e inténtalo de nuevo.",
    conflict: "El movimiento cambió o su evidencia caducó.",
    unavailable: "No se pudo completar la operación de privacidad.",
    import: "No se pudo importar el movimiento aprobado.",
  },
  firstSetupHint:
    "El filtro de privacidad está activo. Solo se guardan las operaciones que coincidan con tus reglas comerciales. Se descartan las privadas y las desconocidas. A continuación, elige tus proveedores.",
};
