/**
 * Password Strength Logic
 * Shared password strength calculation
 * Used by both React and CLI implementations
 */

export interface PasswordStrengthResult {
  /** Strength score from 0-5 */
  strength: number;
  /** Strength level: "weak" | "fair" | "good" | "strong" */
  level: "weak" | "fair" | "good" | "strong";
  /** Width percentage for progress bar (20-100) */
  widthPercentage: number;
  /** Missing requirements */
  missing: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

/**
 * Calculate password strength score and level
 * Based on length, uppercase, numbers, and special characters
 */
export function calculatePasswordStrength(
  password: string | undefined,
): PasswordStrengthResult {
  if (!password) {
    return {
      strength: 0,
      level: "weak",
      widthPercentage: 0,
      missing: {
        minLength: true,
        uppercase: true,
        lowercase: true,
        number: true,
        special: true,
      },
    };
  }

  let strength = 0;

  // Check requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Length checks
  if (hasMinLength) {
    strength += 1;
  }
  if (password.length >= 10) {
    strength += 1;
  }

  // Character type checks
  if (hasUppercase) {
    strength += 1;
  }
  if (hasNumber) {
    strength += 1;
  }
  if (hasSpecial) {
    strength += 1;
  }

  // Determine level
  let level: "weak" | "fair" | "good" | "strong";
  if (strength <= 2) {
    level = "weak";
  } else if (strength <= 3) {
    level = "fair";
  } else if (strength <= 4) {
    level = "good";
  } else {
    level = "strong";
  }

  // Calculate width percentage (minimum 20%, maximum 100%)
  const widthPercentage = Math.max(20, Math.min(100, (strength / 5) * 100));

  return {
    strength,
    level,
    widthPercentage,
    missing: {
      minLength: !hasMinLength,
      uppercase: !hasUppercase,
      lowercase: !hasLowercase,
      number: !hasNumber,
      special: !hasSpecial,
    },
  };
}
