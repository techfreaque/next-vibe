export const translations = {
  auth: {
    common: {
      passwordStrength: {
        label: "Password Strength",
        weak: "Weak",
        fair: "Fair",
        good: "Good",
        strong: "Strong",
        suggestion:
          "Use a mix of letters, numbers, and symbols for a stronger password",
      },
    },
    passwordStrength: {
      requirement: {
        minLength: {
          icon: "✗",
          text: "At least 8 characters",
        },
        lowercase: {
          icon: "✗",
          text: "Contains a lowercase letter",
        },
        uppercase: {
          icon: "✗",
          text: "Contains an uppercase letter",
        },
        number: {
          icon: "✗",
          text: "Contains a number",
        },
        special: {
          icon: "✗",
          text: "Contains a special character",
        },
      },
    },
  },
};
