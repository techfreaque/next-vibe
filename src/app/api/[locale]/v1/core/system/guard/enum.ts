/**
 * Guard System Enums
 * Defines enums for guard operations, security levels, and user types
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Guard Operation Types
 */
export const { enum: GuardOperation, options: GuardOperationOptions } =
  createEnumOptions({
    CREATE: "app.api.v1.core.system.guard.operations.create",
    SETUP: "app.api.v1.core.system.guard.operations.setup",
    START: "app.api.v1.core.system.guard.operations.start",
    STOP: "app.api.v1.core.system.guard.operations.stop",
    DESTROY: "app.api.v1.core.system.guard.operations.destroy",
    STATUS: "app.api.v1.core.system.guard.operations.status",
    LIST: "app.api.v1.core.system.guard.operations.list",
  });

/**
 * Guard Security Levels
 */
export const {
  enum: SandboxSecurityLevel,
  options: SandboxSecurityLevelOptions,
} = createEnumOptions({
  MINIMAL: "app.api.v1.core.system.guard.security.minimal",
  STANDARD: "app.api.v1.core.system.guard.security.standard",
  STRICT: "app.api.v1.core.system.guard.security.strict",
  MAXIMUM: "app.api.v1.core.system.guard.security.maximum",
});

/**
 * Guard User Types
 */
export const { enum: SandboxUserType, options: SandboxUserTypeOptions } =
  createEnumOptions({
    PROJECT_USER: "app.api.v1.core.system.guard.userTypes.projectUser",
    RESTRICTED_USER: "app.api.v1.core.system.guard.userTypes.restrictedUser",
    CHROOT_USER: "app.api.v1.core.system.guard.userTypes.chrootUser",
  });

/**
 * Guard Status
 */
export const { enum: GuardStatus, options: GuardStatusOptions } =
  createEnumOptions({
    CREATED: "app.api.v1.core.system.guard.statusValues.created",
    RUNNING: "app.api.v1.core.system.guard.statusValues.running",
    STOPPED: "app.api.v1.core.system.guard.statusValues.stopped",
    ERROR: "app.api.v1.core.system.guard.statusValues.error",
    DESTROYED: "app.api.v1.core.system.guard.statusValues.destroyed",
  });

/**
 * Isolation Methods
 */
export const { enum: IsolationMethod, options: IsolationMethodOptions } =
  createEnumOptions({
    RBASH: "app.api.v1.core.system.guard.isolation.rbash",
    CHROOT: "app.api.v1.core.system.guard.isolation.chroot",
    BUBBLEWRAP: "app.api.v1.core.system.guard.isolation.bubblewrap",
    FIREJAIL: "app.api.v1.core.system.guard.isolation.firejail",
  });
