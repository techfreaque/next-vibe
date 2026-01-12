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
    };
  }

  let strength = 0;

  // Length checks
  if (password.length >= 8) {
    strength += 1;
  }
  if (password.length >= 10) {
    strength += 1;
  }

  // Character type checks
  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  if (/[0-9]/.test(password)) {
    strength += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
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
  };
}
