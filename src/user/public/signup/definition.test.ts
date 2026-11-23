import { describe, expect, it } from "bun:test";

import signupEndpoints from "./definition";

describe("signup form password confirmation", () => {
  const { POST } = signupEndpoints;
  const input = POST.examples.requests.default;

  it("accepts matching passwords", () => {
    expect(POST.formSchema.safeParse(input).success).toBe(true);
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
