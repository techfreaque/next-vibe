import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  saleType: "Verkauf",
  feeType: "Anbietergebühr",
  refundType: "Erstattung",

  title: "Zahlungsbuchhaltung",
  review: "Verifizierte Zahlungen prüfen oder buchen",
  configure: "Katalogangebot zuordnen",
  company: "Unternehmen",
  product: "Katalogprodukt",
  providerStripe: "Stripe",
  providerNow: "NOWPayments",
  currencyEur: "EUR",
  currencyUsd: "USD",
  currencyPln: "PLN",
  provider: "Zahlungsanbieter",
  merchant: "Verifizierte Händlerkennung",
  offer: "Angebots- oder Preis-ID",
  currency: "Währung",
  recognition: "Erfassung",
  immediate: "Beim Verkauf als Erlös erfassen",
  deferred: "Als Verbindlichkeit erfassen",
  receivable: "Forderungskonto",
  clearing: "Verrechnungskonto des Anbieters",
  consideration: "Erlös- oder Verbindlichkeitskonto",
  vat: "Umsatzsteuerkonto",
  expense: "Aufwandskonto für Gebühren",
  zeroTax: "Verkäufe ohne Steueraufschlüsselung mit 0 % buchen",
  ids: "IDs der verifizierten Belege",
  dryRun: "Nur Vorschau",
  submit: "Ausführen",
  sources: "Verifizierte Belege",
  gross: "Bruttobetrag",
  tax: "Steuerbetrag",
  fee: "Anbietergebühr",
  receipt: "Rechnungs- und Buchungsreferenzen",
  posted: "Gebucht",
  ready: "Buchungsbereit",
  saved: "Angebot zugeordnet",
  alreadyPosted: "Bereits gebucht",
  forbidden: "Sie haben keine Berechtigung für dieses Unternehmen.",
  missingEvidence: "Der verifizierte Beleg ist nicht verfügbar.",
  missingMapping: "Ordnen Sie ein passendes Händlerangebot und Produkt zu.",
  unsupportedCurrency:
    "Prüfen Sie die Währung und stimmen Sie den Umtausch separat ab.",
  unmatchedTransaction:
    "Ordnen Sie vor der Buchung die verifizierte lokale Zahlung zu.",
  unverifiedTax:
    "Ermitteln Sie die verifizierte Steueraufteilung oder konfigurieren Sie ausdrücklich einen zulässigen Nullsatz.",
  invalidAccounts:
    "Prüfen Sie die aktiven Unternehmenskonten und ihre Zuordnung.",
  periodClosed:
    "Öffnen Sie die Buchungsperiode oder stimmen Sie das Belegdatum ab.",
  unverifiedRefundAllocation:
    "Ermitteln Sie die verifizierte Erstattungsaufteilung oder stimmen Sie die Erstattung mit dem ursprünglichen Verkauf ab.",
  creditsGranted: "Gewährte Credits",
  creditsConsumed: "Verbrauchte Credits",
  deferredRefundNeedsReview:
    "Prüfen Sie, welcher Teil der ursprünglichen Leistung oder des Guthabenpakets genutzt wurde. Stimmen Sie die Erstattung mit der verbleibenden Verbindlichkeit und den erfassten Erlösen ab.",
  feeBillLinked: "Lieferantenrechnung verknüpft",
  openFeeEntry: "Gebührenrechnung abstimmen",
  openJournal: "Buchung öffnen",
  openInvoice: "Rechnung öffnen",
  openFeeBill: "Lieferantenrechnung öffnen",
  feeNeedsBill:
    "Erfassen Sie die Gebührenrechnung als Eingangsrechnung. Prüfen Sie die Steuer vor der Buchung.",
  taxRegimeConflict:
    "Der Anbieter berechnete Steuer für ein befreites Unternehmen. Stimmen Sie den Beleg ab.",
  inconsistentEvidence:
    "Die Belegdaten stimmen nicht mit der lokalen Zahlung überein.",
  postingFailed:
    "Buchung fehlgeschlagen. Prüfen Sie den Beleg und versuchen Sie es erneut.",
  missingProduct:
    "Wählen Sie ein aktives Produkt mit Artikelnummer und passender Steuer.",
  conflict: "Dieses Händlerangebot ist bereits zugeordnet.",
  empty: "Keine passenden verifizierten Belege.",
  intro:
    "Ordnen Sie ein Katalogprodukt einem verifizierten Händlerangebot zu und prüfen Sie die Verkaufsvorschau.",
  stripeTest: "Stripe-Testhändler",
  stripeLive: "Stripe-Livehändler",
  nowMerchant: "NOWPayments-Händler",
  listError: "Buchungsbelege konnten nicht geladen werden",
  detail: "Prüfen Sie das Unternehmen und Ihre Eingaben.",
  recognizedRevenue: "Erfasste Erlöse",
  remainingLiability: "Verbleibende Verbindlichkeit",
  recognitionTitle: "Vorausbezahlte Erlöse erfassen",
  recognitionDescription:
    "Hinterlegen Sie die Erlösregel mit Gültigkeitsdatum. Ohne Angaben sehen Sie eine Vorschau zum belegten Guthabenverbrauch.",
  recognitionFrom: "Gültig ab (JJJJ-MM-TT)",
  recognitionAccount: "Erlöskonto",
  recognitionServicePeriods:
    "Belegte Abo-Leistungszeiträume als Erlös erfassen",
  recognitionExpiry: "Belegt verfallene Credits als Erlös erfassen",
  recognitionEntries: "Guthabenbewegungen",
  recognitionPreview: "Vorschau bereit",
  recognitionPosted: "Erlös gebucht",
  recognitionCurrent: "Keine neuen geeigneten Bewegungen",
  recognitionPolicySaved: "Erlösregel gespeichert",
  recognitionPolicyConflict:
    "Das Datum überschneidet sich mit einer bestehenden Regel oder Buchung.",
  recognitionPolicyMissing:
    "Hinterlegen Sie zum Bewegungsdatum eine Erlösregel.",
  recognitionEvidenceMissing:
    "Prüfen Sie Verkauf, Zahlung und Guthabenbewegung.",
  recognitionExpiryReview: "Prüfen Sie den Verfall und die anzuwendende Regel.",
  recognitionServiceConflict:
    "Der Zahlungsdienst hat widersprüchliche Leistungszeiträume oder Beträge gemeldet. Prüfen Sie die ursprüngliche Rechnung vor der Erlöserfassung.",
  recognitionSubscriptionReview:
    "Abo-Erlöse erfordern einen belegten Leistungszeitraum.",
  recognitionInvalidAccounts:
    "Wählen Sie aktive Verbindlichkeits- und Erlöskonten für dieses Unternehmen.",
  recognitionPeriodClosed: "Öffnen Sie die Buchungsperiode der Bewegung.",
  recognitionForbidden:
    "Sie dürfen für dieses Unternehmen keine Erlöse erfassen.",
  recognitionFailed:
    "Erlös konnte nicht erfasst werden. Prüfen Sie den Beleg und versuchen Sie es erneut.",
  chooseProvider: "Anbieter auswählen",
  chooseCurrency: "Währung auswählen",
  chooseRecognition: "Zeitpunkt der Erlöserfassung auswählen",
  noVatAccount:
    "Legen Sie im Kontenplan ein aktives Umsatzsteuerkonto an, um es hier auszuwählen.",
  saveOffer: "Angebot speichern",
  sectionOffer: "Angebot",
  sectionBooks: "Buchungen",
  sectionTax: "Steuer",
  chooseAccount: "Konto wählen",
  chooseProduct: "Produkt wählen",
  chooseCompanyFirst: "Zuerst Firma wählen",
  noMatchingAccount: "Kein passendes Konto im Kontenplan dieser Firma.",
  noMatchingProduct: "Hier erscheinen nur aktive Produkte mit Artikelnummer.",
  productHint:
    "Das Produkt, das dieses Angebot verkauft. Seine Artikelnummer muss zum Anbieterangebot passen.",
  receivableHint: "Forderung an den Kunden, bis der Anbieter auszahlt.",
  clearingHint:
    "Geld, das der Anbieter eingenommen, aber noch nicht ausgezahlt hat.",
  considerationHint:
    "Erlöskonto bei sofortiger Realisierung, Verbindlichkeit bei Abgrenzung.",
  vatHint: "Optional. Nötig, wenn der Anbieter Umsatzsteuer meldet.",
  expenseHint: "Optional. Bucht die Gebühren des Anbieters.",
  merchantHelp: "Händler- oder Konto-ID aus dem Dashboard des Anbieters.",
  merchantPlaceholder: "acct_1Nxxxxxxxx",
  offerHelp: "Preis- oder Produkt-ID dieses Angebots beim Anbieter.",
  offerPlaceholder: "price_1Pxxxxxxxx",
  zeroTaxHelp:
    "Nur für steuerfreie Produkte. Ohne diese Option warten solche Verkäufe auf Prüfung, bis der Anbieter einen geprüften Steuerbetrag liefert.",
};
