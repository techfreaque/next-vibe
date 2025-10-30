/**
 * I18n Plugin Configuration
 *
 * This file re-exports the i18n config from lint.config.ts to work around
 * TypeScript's rootDir restrictions in plugin builds.
 *
 * WORKAROUND: Oxlint v1.25.0 doesn't support context.options yet.
 * Once it does, this file can be removed and plugins can use context.options[0].
 */
export { i18nPluginConfig } from "../../../../../../../../../../lint.config.js";
//# sourceMappingURL=i18n-config.d.ts.map