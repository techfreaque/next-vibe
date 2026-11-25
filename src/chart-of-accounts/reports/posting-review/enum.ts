import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: ReviewIssue,
  options: ReviewIssueOptions,
  Value: ReviewIssueValue,
} = createEnumOptions(scopedTranslation, {
  MISSING_LINES: "issues.missingLines",
  INVALID_LEGS: "issues.invalidLegs",
  INVOICE_LINK: "issues.invoiceLink",
  BILL_LINK: "issues.billLink",
});

export const ReviewIssueDB = [
  ReviewIssue.MISSING_LINES,
  ReviewIssue.INVALID_LEGS,
  ReviewIssue.INVOICE_LINK,
  ReviewIssue.BILL_LINK,
] as const;

export const { enum: ReviewReason, Value: ReviewReasonValue } =
  createEnumOptions(scopedTranslation, {
    FEW_LINES: "reasons.fewLines",
    INVALID_LEGS: "reasons.invalidLegs",
    NO_BACKLINK: "reasons.noBacklink",
    WRONG_POSTING: "reasons.wrongPosting",
    CONTROL_LEG: "reasons.controlLeg",
  });

export const ReviewReasonDB = [
  ReviewReason.FEW_LINES,
  ReviewReason.INVALID_LEGS,
  ReviewReason.NO_BACKLINK,
  ReviewReason.WRONG_POSTING,
  ReviewReason.CONTROL_LEG,
] as const;
