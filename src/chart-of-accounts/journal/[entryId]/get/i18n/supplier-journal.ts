import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";

export const supplierJournalCopy = createScopedTranslation({
  en: {
    approval: "Supplier bill approval",
    settlement: "Supplier bill payment",
    sourceBill: "Source bill",
  },
  de: {
    approval: "Buchung der Lieferantenrechnung",
    settlement: "Zahlung der Lieferantenrechnung",
    sourceBill: "Ursprüngliche Rechnung",
  },
  es: {
    approval: "Contabilización de la factura de proveedor",
    settlement: "Pago de la factura de proveedor",
    sourceBill: "Factura de origen",
  },
  fr: {
    approval: "Comptabilisation de la facture fournisseur",
    settlement: "Paiement de la facture fournisseur",
    sourceBill: "Facture d’origine",
  },
  it: {
    approval: "Registrazione della fattura fornitore",
    settlement: "Pagamento della fattura fornitore",
    sourceBill: "Fattura di origine",
  },
  pl: {
    approval: "Zaksięgowanie faktury dostawcy",
    settlement: "Zapłata faktury dostawcy",
    sourceBill: "Faktura źródłowa",
  },
  sk: {
    approval: "Zaúčtovanie dodávateľskej faktúry",
    settlement: "Úhrada dodávateľskej faktúry",
    sourceBill: "Pôvodná faktúra",
  },
});
