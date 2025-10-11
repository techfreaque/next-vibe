import type { cancellationTranslations as EnglishCancellationTranslations } from "../../../en/sections/subscription/cancellation";

export const cancellationTranslations: typeof EnglishCancellationTranslations =
  {
    confirm: {
      title: "Abonnement kündigen",
      description: "Sind Sie sicher, dass Sie Ihr Abonnement kündigen möchten?",
      warning:
        "Ihr Abonnement wird am Ende der aktuellen Abrechnungsperiode am {{date}} gekündigt. Sie haben bis dahin weiterhin Zugang.",
    },
    success: {
      title: "Abonnement gekündigt",
      description:
        "Ihr Abonnement wurde erfolgreich gekündigt. Sie haben bis zum Ende Ihrer aktuellen Abrechnungsperiode Zugang.",
    },
    error: {
      title: "Kündigung fehlgeschlagen",
      description:
        "Kündigung Ihres Abonnements fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
    },
  };
