import type { subscriptionTranslations as EnglishSubscriptionTranslations } from "../../../en/sections/newsletter/subscription";

export const subscriptionTranslations: typeof EnglishSubscriptionTranslations =
  {
    success: {
      title: "Subskrypcja Pomyślna",
      description: "Dziękujemy za subskrypcję naszego newslettera!",
    },
    error: {
      title: "Subskrypcja Nie Powiodła Się",
      description:
        "Nie mogliśmy przetworzyć Twojej subskrypcji. Spróbuj ponownie.",
      alreadySubscribed: "Ten e-mail już subskrybuje nasz newsletter.",
    },
    status: {
      subscribed: "Ten e-mail już subskrybuje. Kliknij, aby się wypisać.",
    },
    confirmation: {
      title: "Potwierdź Swoją Subskrypcję",
      description: "Sprawdź swój e-mail, aby potwierdzić subskrypcję.",
      emailSubject: "Potwierdź swoją subskrypcję newslettera",
      emailTitle: "Potwierdź Swoją Subskrypcję Newslettera",
      emailBody:
        "Dziękujemy za subskrypcję naszego newslettera. Kliknij przycisk poniżej, aby potwierdzić swoją subskrypcję.",
      confirmButton: "Potwierdź Subskrypcję",
      alreadyConfirmed: "Twoja subskrypcja została już potwierdzona.",
      confirmSuccess: "Twoja subskrypcja została potwierdzona!",
      confirmError:
        "Nie mogliśmy potwierdzić Twojej subskrypcji. Spróbuj ponownie.",
    },
    unsubscribe: {
      title: "Wypisz się",
      description:
        "Przykro nam, że odchodzisz. Zostałeś wypisany z naszego newslettera.",
      confirmQuestion: "Czy na pewno chcesz się wypisać?",
      confirmButton: "Tak, wypisz mnie",
      cancelButton: "Nie, zachowaj moją subskrypcję",
      success: "Zostałeś wypisany z naszego newslettera.",
      error:
        "Nie mogliśmy przetworzyć Twojego żądania wypisania. Spróbuj ponownie.",
    },
  };
