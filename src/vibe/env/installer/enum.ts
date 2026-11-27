/**
 * Visual Installer Enums
 */

import { createEnumOptions } from "../../unified-ui/_shared/enum";
import { scopedTranslation } from "./i18n";

export const {
  enum: InstallerStepStatus,
  options: InstallerStepStatusOptions,
  Value: InstallerStepStatusValue,
} = createEnumOptions(scopedTranslation, {
  DONE: "enums.stepStatus.done",
  IN_PROGRESS: "enums.stepStatus.inProgress",
  PENDING: "enums.stepStatus.pending",
  SKIPPED: "enums.stepStatus.skipped",
  ERROR: "enums.stepStatus.error",
});

export const InstallerStepStatusDB = [
  InstallerStepStatus.DONE,
  InstallerStepStatus.IN_PROGRESS,
  InstallerStepStatus.PENDING,
  InstallerStepStatus.SKIPPED,
  InstallerStepStatus.ERROR,
] as const;

export const {
  enum: InstallerAction,
  options: InstallerActionOptions,
  Value: InstallerActionValue,
} = createEnumOptions(scopedTranslation, {
  REFRESH: "enums.action.refresh",
  GITHUB_AUTH_START: "enums.action.githubAuthStart",
  GITHUB_AUTH_CHECK: "enums.action.githubAuthCheck",
  GITHUB_CREATE_PRIVATE_REPO: "enums.action.githubCreatePrivateRepo",
  GITHUB_SKIP: "enums.action.githubSkip",
  GITHUB_RESET: "enums.action.githubReset",
});

export const InstallerActionDB = [
  InstallerAction.REFRESH,
  InstallerAction.GITHUB_AUTH_START,
  InstallerAction.GITHUB_AUTH_CHECK,
  InstallerAction.GITHUB_CREATE_PRIVATE_REPO,
  InstallerAction.GITHUB_SKIP,
  InstallerAction.GITHUB_RESET,
] as const;

export const {
  enum: InstallerCheckoutMode,
  options: InstallerCheckoutModeOptions,
  Value: InstallerCheckoutModeValue,
} = createEnumOptions(scopedTranslation, {
  CLONED: "enums.checkoutMode.cloned",
  EXISTING: "enums.checkoutMode.existing",
  UNKNOWN: "enums.checkoutMode.unknown",
});

export const InstallerCheckoutModeDB = [
  InstallerCheckoutMode.CLONED,
  InstallerCheckoutMode.EXISTING,
  InstallerCheckoutMode.UNKNOWN,
] as const;
