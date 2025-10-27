import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * Signup type enum using createEnumOptions pattern
 */
export const {
  enum: SignupType,
  options: SignupTypeOptions,
  Value: SignupTypeValue,
} = createEnumOptions({
  MEETING: "app.api.v1.core.user.public.signup.enums.signupType.meeting",
  PRICING: "app.api.v1.core.user.public.signup.enums.signupType.pricing",
});
