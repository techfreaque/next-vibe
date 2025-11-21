import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { CountryLanguage } from "@/i18n/core/config";

export default {
  POST: createEndpoint({
    route: "/core/system/help/interactive",
    summary: "app.api.v1.core.system.help.interactive.post.summary",
    description: "app.api.v1.core.system.help.interactive.post.description",
    tags: ["system", "help"],
    method: "POST",
    aliases: ["interactive", "i"],
    roles: [],
    fields: {},
    platforms: {
      cli: true,
      web: false,
      mobile: false,
      mcp: false,
      ai: false,
    },
    handler: async ({ logger, user, locale }) => {
      const { interactiveRepository } = await import("./repository");
      return await interactiveRepository.startInteractiveMode(
        user,
        locale as CountryLanguage,
        logger,
      );
    },
  }),
};
