export const translations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  token: {
    label: "Confirmation code",
    description: "The code from the link in your welcome email",
    placeholder: "Paste the code from your email",
  },
  response: {
    confirmed: "Confirmed",
    email: "Email",
    bonusCredits: "Bonus credits per month",
  },
  post: {
    title: "Confirm Newsletter Email",
    titleShort: "Confirm email",
    description:
      "Confirm a newsletter address with the code from the welcome email. Unlocks the monthly free-credit bonus.",
    errors: {
      validation: {
        title: "Invalid code",
        description: "The confirmation code is missing or malformed",
      },
      notFound: {
        title: "Link expired or invalid",
        description:
          "This confirmation link is not valid. Subscribe again to get a fresh one.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      internal: {
        title: "Confirmation failed",
        description: "Something broke on our side. Try the link again.",
      },
    },
    success: {
      title: "Email confirmed",
      description: "Your free-credit bonus is live",
    },
  },
  widget: {
    heroTitle: "One click. +{{bonusCredits}} credits every month.",
    heroDescription:
      "Confirm your address and the bonus lands on your free allowance right away.",
    confirmButton: "Confirm my email",
    confirming: "Confirming...",
    confirmedTitle: "Confirmed. +{{bonusCredits}} credits a month are yours.",
    confirmedDescription:
      "The bonus is already in your free balance and renews every month while you stay subscribed.",
    startChatting: "Start chatting",
  },
};
