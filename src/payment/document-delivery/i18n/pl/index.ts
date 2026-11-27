import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "platnosci",
    pdf: "pdf",
    email: "email",
  },
  pdf: {
    invoiceTitle: "Faktura PDF",
    invoiceDescription:
      "Pobierz fakturę PDF/A-3 z danymi prawnymi, kodem QR do płatności i osadzonym XML ZUGFeRD.",
    estimateTitle: "Wycena PDF",
    estimateDescription: "Pobierz wycenę w formacie PDF.",
    success: "PDF wygenerowany",
    downloadAction: "Pobierz PDF",
    zugferdBadge: "Osadzony ZUGFeRD / Factur-X EN 16931",
    qrBadgeEpc: "Zawiera kod SEPA QR EPC / GiroCode",
    qrBadgePayBySquare: "Zawiera kod PAY by square QR",
    filename: "Nazwa pliku",
    documentNumber: "Numer dokumentu",
    paymentUrl: "Link do płatności online",
    qrSection: "Kod QR do płatności",
    back: "Wstecz",
  },
  deliver: {
    logTitle: "Dziennik wysyłki e-mail",
    logDescription:
      "Sprawdź wysłane faktury i wyślij ponownie załącznik PDF przez systemową pocztę.",
    logSuccess: "Dziennik wczytany",
    sendTitle: "Wyślij dokument e-mailem",
    sendDescription: "Wyślij plik PDF do klienta z systemowego konta hi@.",
    sendSuccess: "E-mail z załącznikiem PDF został wysłany",
    recipientEmail: "Adres e-mail odbiorcy",
    recipientName: "Nazwa odbiorcy",
    customMessage: "Wiadomość dodatkowa (opcjonalnie)",
    isResend: "Wyślij ponownie",
    sendAction: "Wyślij e-mail z PDF",
    resendAction: "Wyślij ponownie PDF",
    emptyLog: "Brak wysłanych wiadomości",
    emptyLogHint: "Wyślij plik PDF powyżej, aby zapisać historię wysyłki.",
    sentAt: "Wysłano",
    sender: "Nadawca",
    status: "Status",
    attachment: "Załącznik",
    statusSent: "Wysłano",
    statusFailed: "Błąd",
    resendBadge: "Ponowna wysyłka",
    subjectInvoice: "Faktura {{number}} od {{company}}",
    subjectCreditNote: "Faktura korygująca {{number}} od {{company}}",
    subjectEstimate: "Wycena {{number}} od {{company}}",
    bodyIntro: "W załączniku przesyłamy dokument {{document}} w formacie PDF.",
    bodyPayOnline: "Zapłać online:",
    bodyViewLink: "Zobacz dokument:",
    theaBlocked:
      "Wiadomości ERP muszą korzystać z systemowego konta hi@, nigdy thea@.",
    mailerUnavailable:
      "Systemowa poczta nie jest skonfigurowana. Sprawdź domyślne konto SMTP.",
  },
  fields: {
    invoiceId: "Faktura",
    estimateId: "Wycena",
    documentType: "Typ dokumentu",
    pdfBase64: "Dane PDF",
    contentType: "Typ zawartości",
    hasZugferd: "Osadzony ZUGFeRD",
    qrKind: "Format QR",
    qrSvg: "Podgląd QR",
    deliveries: "Wysyłki",
    deliveryId: "Wysyłka",
    messageId: "ID wiadomości",
  },
  errors: {
    validation: {
      title: "Sprawdź dane",
      description: "Podaj poprawny dokument i adres e-mail odbiorcy.",
    },
    network: {
      title: "Błąd sieci",
      description: "Sprawdź połączenie i spróbuj ponownie.",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby pobrać PDF i wysyłać dokumenty.",
    },
    forbidden: {
      title: "Brak dostępu",
      description: "Twoja rola w firmie nie pozwala na tę operację.",
    },
    notFound: {
      title: "Nie znaleziono dokumentu",
      description: "Wskazana faktura, korekta lub wycena nie istnieje.",
    },
    server: {
      title: "Wysyłka nie powiodła się",
      description: "Nie udało się wygenerować PDF ani wysłać wiadomości.",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description: "Spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Twoje zmiany nadal znajdują się w formularzu.",
    },
    conflict: {
      title: "Dokument nie jest gotowy",
      description: "Wystaw dokument przed wysłaniem go e-mailem.",
    },
  },
};
