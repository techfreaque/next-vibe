/**
 * Guard System Enums
 * Defines enums for guard operations, security levels, and user types
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Guard Operation Types
 */
export const { enum: GuardOperation, options: GuardOperationOptions } =
  createEnumOptions(scopedTranslation, {
    CREATE: "operations.create",
    SETUP: "operations.setup",
    START: "operations.start",
    STOP: "operations.stop",
    DESTROY: "operations.destroy",
    STATUS: "operations.status",
    LIST: "operations.list",
  });

/**
 * Guard Security Levels
 */
export const {
  enum: SandboxSecurityLevel,
  options: SandboxSecurityLevelOptions,
} = createEnumOptions(scopedTranslation, {
  MINIMAL: "security.minimal",
  STANDARD: "security.standard",
  STRICT: "security.strict",
  MAXIMUM: "security.maximum",
});

/**
 * Guard User Types
 */
export const { enum: SandboxUserType, options: SandboxUserTypeOptions } =
  createEnumOptions(scopedTranslation, {
    PROJECT_USER: "userTypes.projectUser",
    RESTRICTED_USER: "userTypes.restrictedUser",
    CHROOT_USER: "userTypes.chrootUser",
  });

/**
 * Guard Status
 */
export const { enum: GuardStatus, options: GuardStatusOptions } =
  createEnumOptions(scopedTranslation, {
    CREATED: "statusValues.created",
    RUNNING: "statusValues.running",
    STOPPED: "statusValues.stopped",
    ERROR: "statusValues.error",
    DESTROYED: "statusValues.destroyed",
  });

/**
 * Isolation Methods
 */
export const { enum: IsolationMethod, options: IsolationMethodOptions } =
  createEnumOptions(scopedTranslation, {
    RBASH: "isolation.rbash",
    CHROOT: "isolation.chroot",
    BUBBLEWRAP: "isolation.bubblewrap",
    FIREJAIL: "isolation.firejail",
  });
