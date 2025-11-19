/**
 * Auto-generated tRPC Router
 * Generated from route files in the API directory
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */

import { router } from "@/app/api/[locale]/v1/core/system/unified-interface/trpc/core";
import { tools as route0Tools } from "../../v1/core/agent/chat/personas/[id]/route";
import { tools as route1Tools } from "../../v1/core/agent/chat/personas/route";
import { tools as route2Tools } from "../../v1/core/agent/chat/threads/route";
import { tools as route3Tools } from "../../v1/core/agent/chat/threads/[threadId]/route";
import { tools as route4Tools } from "../../v1/core/agent/chat/folders/[id]/route";
import { tools as route5Tools } from "../../v1/core/agent/chat/folders/route";
import { tools as route6Tools } from "../../v1/core/agent/brave-search/route";
import { tools as route7Tools } from "../../v1/core/agent/ai-stream/route";
import { tools as route8Tools } from "../../v1/core/agent/text-to-speech/route";
import { tools as route9Tools } from "../../v1/core/agent/speech-to-text/route";
import { tools as route10Tools } from "../../v1/core/system/server/dev/route";
import { tools as route11Tools } from "../../v1/core/system/server/start/route";
import { tools as route12Tools } from "../../v1/core/system/server/build/route";
import { tools as route13Tools } from "../../v1/core/system/server/health/route";
import { tools as route14Tools } from "../../v1/core/system/translations/reorganize/route";
import { tools as route15Tools } from "../../v1/core/system/translations/restore-backup/route";
import { tools as route16Tools } from "../../v1/core/system/translations/stats/route";
import { tools as route17Tools } from "../../v1/core/system/help/route";
import { tools as route18Tools } from "../../v1/core/system/db/schema-verify/route";
import { tools as route19Tools } from "../../v1/core/system/db/utils/docker-operations/route";
import { tools as route20Tools } from "../../v1/core/system/db/migrate-repair/route";
import { tools as route21Tools } from "../../v1/core/system/db/migrate-prod/route";
import { tools as route22Tools } from "../../v1/core/system/db/seed/route";
import { tools as route23Tools } from "../../v1/core/system/db/reset/route";
import { tools as route24Tools } from "../../v1/core/system/db/migrate-sync/route";
import { tools as route25Tools } from "../../v1/core/system/db/migrate/route";
import { tools as route26Tools } from "../../v1/core/system/db/ping/route";
import { tools as route27Tools } from "../../v1/core/system/db/sql/route";
import { tools as route28Tools } from "../../v1/core/system/db/studio/route";
import { tools as route29Tools } from "../../v1/core/system/unified-interface/tasks/cron/tasks/route";
import { tools as route30Tools } from "../../v1/core/system/unified-interface/tasks/cron/history/route";
import { tools as route31Tools } from "../../v1/core/system/unified-interface/tasks/cron/status/route";
import { tools as route32Tools } from "../../v1/core/system/unified-interface/tasks/cron/stats/route";
import { tools as route33Tools } from "../../v1/core/system/unified-interface/tasks/side-tasks/route";
import { tools as route34Tools } from "../../v1/core/system/unified-interface/tasks/types/route";
import { tools as route35Tools } from "../../v1/core/system/unified-interface/tasks/pulse/route";
import { tools as route36Tools } from "../../v1/core/system/unified-interface/tasks/unified-runner/route";
import { tools as route37Tools } from "../../v1/core/system/unified-interface/mcp/tools/route";
import { tools as route38Tools } from "../../v1/core/system/unified-interface/mcp/execute/route";
import { tools as route39Tools } from "../../v1/core/system/unified-interface/ai/tools/route";
import { tools as route40Tools } from "../../v1/core/system/unified-interface/cli/setup/uninstall/route";
import { tools as route41Tools } from "../../v1/core/system/unified-interface/cli/setup/update/route";
import { tools as route42Tools } from "../../v1/core/system/unified-interface/cli/setup/status/route";
import { tools as route43Tools } from "../../v1/core/system/unified-interface/cli/setup/install/route";
import { tools as route44Tools } from "../../v1/core/system/unified-interface/react-native/generate/route";
import { tools as route45Tools } from "../../v1/core/system/generators/generate-all/route";
import { tools as route46Tools } from "../../v1/core/system/generators/endpoint/route";
import { tools as route47Tools } from "../../v1/core/system/generators/route-handlers/route";
import { tools as route48Tools } from "../../v1/core/system/generators/endpoints/route";
import { tools as route49Tools } from "../../v1/core/system/generators/endpoints-index/route";
import { tools as route50Tools } from "../../v1/core/system/generators/task-index/route";
import { tools as route51Tools } from "../../v1/core/system/generators/seeds/route";
import { tools as route52Tools } from "../../v1/core/system/generators/generate-trpc-router/validation/route";
import { tools as route53Tools } from "../../v1/core/manifest/route";
import { tools as route54Tools } from "../../v1/core/leads/lead/[id]/route";
import { tools as route55Tools } from "../../v1/core/leads/tracking/engagement/route";
import { tools as route56Tools } from "../../v1/core/leads/search/route";
import { tools as route57Tools } from "../../v1/core/leads/campaigns/campaign-starter/campaign-starter-config/route";
import { tools as route58Tools } from "../../v1/core/leads/campaigns/emails/test-mail/route";
import { tools as route59Tools } from "../../v1/core/leads/list/route";
import { tools as route60Tools } from "../../v1/core/leads/import/route";
import { tools as route61Tools } from "../../v1/core/leads/export/route";
import { tools as route62Tools } from "../../v1/core/leads/stats/route";
import { tools as route63Tools } from "../../v1/core/leads/create/route";
import { tools as route64Tools } from "../../v1/core/leads/batch/route";
import { tools as route65Tools } from "../../v1/core/users/user/[id]/route";
import { tools as route66Tools } from "../../v1/core/users/list/route";
import { tools as route67Tools } from "../../v1/core/users/stats/route";
import { tools as route68Tools } from "../../v1/core/users/create/route";
import { tools as route69Tools } from "../../v1/core/user/private/logout/route";
import { tools as route70Tools } from "../../v1/core/user/private/me/route";
import { tools as route71Tools } from "../../v1/core/user/public/login/options/route";
import { tools as route72Tools } from "../../v1/core/user/public/signup/route";
import { tools as route73Tools } from "../../v1/core/user/public/reset-password/validate/route";
import { tools as route74Tools } from "../../v1/core/user/public/reset-password/request/route";
import { tools as route75Tools } from "../../v1/core/user/public/reset-password/confirm/route";
import { tools as route76Tools } from "../../v1/core/user/search/route";
import { tools as route77Tools } from "../../v1/core/user/auth/check/route";
import { tools as route78Tools } from "../../v1/core/subscription/route";
import { tools as route79Tools } from "../../v1/core/payment/portal/route";
import { tools as route80Tools } from "../../v1/core/payment/invoice/route";
import { tools as route81Tools } from "../../v1/core/payment/providers/stripe/route";
import { tools as route82Tools } from "../../v1/core/payment/refund/route";
import { tools as route83Tools } from "../../v1/core/credits/history/route";
import { tools as route84Tools } from "../../v1/core/credits/purchase/route";
import { tools as route85Tools } from "../../v1/core/contact/route";
import { tools as route86Tools } from "../../v1/core/emails/smtp-client/list/route";
import { tools as route87Tools } from "../../v1/core/emails/smtp-client/edit/[id]/route";
import { tools as route88Tools } from "../../v1/core/emails/smtp-client/create/route";
import { tools as route89Tools } from "../../v1/core/emails/send/route";
import { tools as route90Tools } from "../../v1/core/emails/messages/[id]/route";
import { tools as route91Tools } from "../../v1/core/emails/imap-client/messages/[id]/route";
import { tools as route92Tools } from "../../v1/core/emails/imap-client/folders/list/route";
import { tools as route93Tools } from "../../v1/core/emails/imap-client/folders/sync/route";
import { tools as route94Tools } from "../../v1/core/emails/imap-client/config/route";
import { tools as route95Tools } from "../../v1/core/emails/imap-client/health/route";
import { tools as route96Tools } from "../../v1/core/emails/imap-client/sync/route";
import { tools as route97Tools } from "../../v1/core/emails/imap-client/accounts/[id]/route";
import { tools as route98Tools } from "../../v1/core/import/route";
import { tools as route99Tools } from "../../v1/core/newsletter/unsubscribe/route";
import { tools as route100Tools } from "../../v1/core/newsletter/subscribe/route";
import { tools as route101Tools } from "../../v1/core/newsletter/status/route";

const route0 = route0Tools.trpc;
const route1 = route1Tools.trpc;
const route2 = route2Tools.trpc;
const route3 = route3Tools.trpc;
const route4 = route4Tools.trpc;
const route5 = route5Tools.trpc;
const route6 = route6Tools.trpc;
const route7 = route7Tools.trpc;
const route8 = route8Tools.trpc;
const route9 = route9Tools.trpc;
const route10 = route10Tools.trpc;
const route11 = route11Tools.trpc;
const route12 = route12Tools.trpc;
const route13 = route13Tools.trpc;
const route14 = route14Tools.trpc;
const route15 = route15Tools.trpc;
const route16 = route16Tools.trpc;
const route17 = route17Tools.trpc;
const route18 = route18Tools.trpc;
const route19 = route19Tools.trpc;
const route20 = route20Tools.trpc;
const route21 = route21Tools.trpc;
const route22 = route22Tools.trpc;
const route23 = route23Tools.trpc;
const route24 = route24Tools.trpc;
const route25 = route25Tools.trpc;
const route26 = route26Tools.trpc;
const route27 = route27Tools.trpc;
const route28 = route28Tools.trpc;
const route29 = route29Tools.trpc;
const route30 = route30Tools.trpc;
const route31 = route31Tools.trpc;
const route32 = route32Tools.trpc;
const route33 = route33Tools.trpc;
const route34 = route34Tools.trpc;
const route35 = route35Tools.trpc;
const route36 = route36Tools.trpc;
const route37 = route37Tools.trpc;
const route38 = route38Tools.trpc;
const route39 = route39Tools.trpc;
const route40 = route40Tools.trpc;
const route41 = route41Tools.trpc;
const route42 = route42Tools.trpc;
const route43 = route43Tools.trpc;
const route44 = route44Tools.trpc;
const route45 = route45Tools.trpc;
const route46 = route46Tools.trpc;
const route47 = route47Tools.trpc;
const route48 = route48Tools.trpc;
const route49 = route49Tools.trpc;
const route50 = route50Tools.trpc;
const route51 = route51Tools.trpc;
const route52 = route52Tools.trpc;
const route53 = route53Tools.trpc;
const route54 = route54Tools.trpc;
const route55 = route55Tools.trpc;
const route56 = route56Tools.trpc;
const route57 = route57Tools.trpc;
const route58 = route58Tools.trpc;
const route59 = route59Tools.trpc;
const route60 = route60Tools.trpc;
const route61 = route61Tools.trpc;
const route62 = route62Tools.trpc;
const route63 = route63Tools.trpc;
const route64 = route64Tools.trpc;
const route65 = route65Tools.trpc;
const route66 = route66Tools.trpc;
const route67 = route67Tools.trpc;
const route68 = route68Tools.trpc;
const route69 = route69Tools.trpc;
const route70 = route70Tools.trpc;
const route71 = route71Tools.trpc;
const route72 = route72Tools.trpc;
const route73 = route73Tools.trpc;
const route74 = route74Tools.trpc;
const route75 = route75Tools.trpc;
const route76 = route76Tools.trpc;
const route77 = route77Tools.trpc;
const route78 = route78Tools.trpc;
const route79 = route79Tools.trpc;
const route80 = route80Tools.trpc;
const route81 = route81Tools.trpc;
const route82 = route82Tools.trpc;
const route83 = route83Tools.trpc;
const route84 = route84Tools.trpc;
const route85 = route85Tools.trpc;
const route86 = route86Tools.trpc;
const route87 = route87Tools.trpc;
const route88 = route88Tools.trpc;
const route89 = route89Tools.trpc;
const route90 = route90Tools.trpc;
const route91 = route91Tools.trpc;
const route92 = route92Tools.trpc;
const route93 = route93Tools.trpc;
const route94 = route94Tools.trpc;
const route95 = route95Tools.trpc;
const route96 = route96Tools.trpc;
const route97 = route97Tools.trpc;
const route98 = route98Tools.trpc;
const route99 = route99Tools.trpc;
const route100 = route100Tools.trpc;
const route101 = route101Tools.trpc;

export const appRouter = router({
  v1: router({
    core: router({
      agent: router({
        chat: router({
          personas: router({ ...route0, ...route1 }),
          threads: router({ ...route2, ...route3 }),
          folders: router({ ...route4, ...route5 }),
        }),
        "brave-search": router({ ...route6 }),
        "ai-stream": router({ ...route7 }),
        "text-to-speech": router({ ...route8 }),
        "speech-to-text": router({ ...route9 }),
      }),
      system: router({
        server: router({
          dev: router({ ...route10 }),
          start: router({ ...route11 }),
          build: router({ ...route12 }),
          health: router({ ...route13 }),
        }),
        translations: router({
          reorganize: router({ ...route14 }),
          "restore-backup": router({ ...route15 }),
          stats: router({ ...route16 }),
        }),
        help: router({ ...route17 }),
        db: router({
          "schema-verify": router({ ...route18 }),
          utils: router({
            "docker-operations": router({ ...route19 }),
          }),
          "migrate-repair": router({ ...route20 }),
          "migrate-prod": router({ ...route21 }),
          seed: router({ ...route22 }),
          reset: router({ ...route23 }),
          "migrate-sync": router({ ...route24 }),
          migrate: router({ ...route25 }),
          ping: router({ ...route26 }),
          sql: router({ ...route27 }),
          studio: router({ ...route28 }),
        }),
        "unified-interface": router({
          tasks: router({
            cron: router({
              tasks: router({ ...route29 }),
              history: router({ ...route30 }),
              status: router({ ...route31 }),
              stats: router({ ...route32 }),
            }),
            "side-tasks": router({ ...route33 }),
            types: router({ ...route34 }),
            pulse: router({ ...route35 }),
            "unified-runner": router({ ...route36 }),
          }),
          mcp: router({
            tools: router({ ...route37 }),
            execute: router({ ...route38 }),
          }),
          ai: router({
            tools: router({ ...route39 }),
          }),
          cli: router({
            setup: router({
              uninstall: router({ ...route40 }),
              update: router({ ...route41 }),
              status: router({ ...route42 }),
              install: router({ ...route43 }),
            }),
          }),
          "react-native": router({
            generate: router({ ...route44 }),
          }),
        }),
        generators: router({
          "generate-all": router({ ...route45 }),
          endpoint: router({ ...route46 }),
          "route-handlers": router({ ...route47 }),
          endpoints: router({ ...route48 }),
          "endpoints-index": router({ ...route49 }),
          "task-index": router({ ...route50 }),
          seeds: router({ ...route51 }),
          "generate-trpc-router": router({
            validation: router({ ...route52 }),
          }),
        }),
      }),
      manifest: router({ ...route53 }),
      leads: router({
        lead: router({ ...route54 }),
        tracking: router({
          engagement: router({ ...route55 }),
        }),
        search: router({ ...route56 }),
        campaigns: router({
          "campaign-starter": router({
            "campaign-starter-config": router({ ...route57 }),
          }),
          emails: router({
            "test-mail": router({ ...route58 }),
          }),
        }),
        list: router({ ...route59 }),
        import: router({ ...route60 }),
        export: router({ ...route61 }),
        stats: router({ ...route62 }),
        create: router({ ...route63 }),
        batch: router({ ...route64 }),
      }),
      users: router({
        user: router({ ...route65 }),
        list: router({ ...route66 }),
        stats: router({ ...route67 }),
        create: router({ ...route68 }),
      }),
      user: router({
        private: router({
          logout: router({ ...route69 }),
          me: router({ ...route70 }),
        }),
        public: router({
          login: router({
            options: router({ ...route71 }),
          }),
          signup: router({ ...route72 }),
          "reset-password": router({
            validate: router({ ...route73 }),
            request: router({ ...route74 }),
            confirm: router({ ...route75 }),
          }),
        }),
        search: router({ ...route76 }),
        auth: router({
          check: router({ ...route77 }),
        }),
      }),
      subscription: router({ ...route78 }),
      payment: router({
        portal: router({ ...route79 }),
        invoice: router({ ...route80 }),
        providers: router({
          stripe: router({ ...route81 }),
        }),
        refund: router({ ...route82 }),
      }),
      credits: router({
        history: router({ ...route83 }),
        purchase: router({ ...route84 }),
      }),
      contact: router({ ...route85 }),
      emails: router({
        "smtp-client": router({
          list: router({ ...route86 }),
          edit: router({ ...route87 }),
          create: router({ ...route88 }),
        }),
        send: router({ ...route89 }),
        messages: router({ ...route90 }),
        "imap-client": router({
          messages: router({ ...route91 }),
          folders: router({
            list: router({ ...route92 }),
            sync: router({ ...route93 }),
          }),
          config: router({ ...route94 }),
          health: router({ ...route95 }),
          sync: router({ ...route96 }),
          accounts: router({ ...route97 }),
        }),
      }),
      import: router({ ...route98 }),
      newsletter: router({
        unsubscribe: router({ ...route99 }),
        subscribe: router({ ...route100 }),
        status: router({ ...route101 }),
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
