/**
 * Guard System Enums
 * Defines enums for guard operations, security levels, and user types
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Guard Operation Types
 */
export const { enum: GuardOperation, options: GuardOperationOptions } = createEnumOptions({
  CREATE: "app.api.system.guard.operations.create",
  SETUP: "app.api.system.guard.operations.setup",
  START: "app.api.system.guard.operations.start",
  STOP: "app.api.system.guard.operations.stop",
  DESTROY: "app.api.system.guard.operations.destroy",
  STATUS: "app.api.system.guard.operations.status",
  LIST: "app.api.system.guard.operations.list",
});

/**
 * Guard Security Levels
 */
export const { enum: SandboxSecurityLevel, options: SandboxSecurityLevelOptions } =
  createEnumOptions({
    MINIMAL: "app.api.system.guard.security.minimal",
    STANDARD: "app.api.system.guard.security.standard",
    STRICT: "app.api.system.guard.security.strict",
    MAXIMUM: "app.api.system.guard.security.maximum",
  });

/**
 * Guard User Types
 */
export const { enum: SandboxUserType, options: SandboxUserTypeOptions } = createEnumOptions({
  PROJECT_USER: "app.api.system.guard.userTypes.projectUser",
  RESTRICTED_USER: "app.api.system.guard.userTypes.restrictedUser",
  CHROOT_USER: "app.api.system.guard.userTypes.chrootUser",
});

/**
 * Guard Status
 */
export const { enum: GuardStatus, options: GuardStatusOptions } = createEnumOptions({
  CREATED: "app.api.system.guard.statusValues.created",
  RUNNING: "app.api.system.guard.statusValues.running",
  STOPPED: "app.api.system.guard.statusValues.stopped",
  ERROR: "app.api.system.guard.statusValues.error",
  DESTROYED: "app.api.system.guard.statusValues.destroyed",
});

/**
 * Isolation Methods
 */
export const { enum: IsolationMethod, options: IsolationMethodOptions } = createEnumOptions({
  RBASH: "app.api.system.guard.isolation.rbash",
  CHROOT: "app.api.system.guard.isolation.chroot",
  BUBBLEWRAP: "app.api.system.guard.isolation.bubblewrap",
  FIREJAIL: "app.api.system.guard.isolation.firejail",
});
