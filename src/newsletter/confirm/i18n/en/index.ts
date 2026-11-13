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
      description: "Bonus applies to your free account",
    },
  },
  widget: {
    heroTitle: "One click. +{{bonusCredits}} credits every month.",
    heroDescription:
      "Confirm your address. On a free account the bonus lands on your allowance right away.",
    confirmButton: "Confirm my email",
    confirming: "Confirming...",
    confirmedTitle:
      "Confirmed. +{{bonusCredits}} credits a month on your free account.",
    confirmedDescription:
      "Signed in? It is already in your free balance and renews monthly while you stay subscribed. No account yet? Sign up free in this browser to unlock it.",
    startChatting: "Start chatting",
  },
};
