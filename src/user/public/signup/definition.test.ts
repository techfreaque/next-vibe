import { describe, expect, it } from "bun:test";

import signupEndpoints from "./definition";
import { calculatePasswordStrength } from "./widget/calculate-password-strength";

describe("signup form password confirmation", () => {
  const { POST } = signupEndpoints;
  const input = POST.examples.requests.default;

  it("accepts matching passwords", () => {
    expect(POST.formSchema.safeParse(input).success).toBe(true);
  });

  it("keeps the missing lowercase hint visible when the signup schema rejects a password", () => {
    const password = "EXAMPLE123!";
    const result = POST.formSchema.safeParse({
      ...input,
      password,
      confirmPassword: password,
    });
    expect(result.success).toBe(false);
    expect(calculatePasswordStrength(password).missing.lowercase).toBe(true);
    expect(calculatePasswordStrength(password).level).not.toBe("strong");
    expect(calculatePasswordStrength("Example123!").level).toBe("strong");
  });

  it("reports a mismatch on the confirmation field", () => {
    const result = POST.formSchema.safeParse({
      ...input,
      confirmPassword: "SecurePass",
    });
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({
        path: ["confirmPassword"],
        message: "fields.confirmPassword.validation.mismatch",
      }),
    );
  });
});
