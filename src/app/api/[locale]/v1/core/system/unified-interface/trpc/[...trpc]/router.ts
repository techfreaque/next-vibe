/**
 * Auto-generated tRPC Router
 * Generated from route files in the API directory
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */

import { router } from '@/app/api/[locale]/v1/core/system/unified-interface/trpc/setup';
import { wrapToolsForTRPC } from '@/app/api/[locale]/v1/core/system/unified-interface/trpc/wrapper';
import { tools as route0Tools } from '../../../../agent/chat/personas/[id]/route';
import { tools as route1Tools } from '../../../../agent/chat/personas/route';
import { tools as route2Tools } from '../../../../agent/chat/threads/route';
import { tools as route3Tools } from '../../../../agent/chat/threads/[threadId]/route';
import { tools as route4Tools } from '../../../../agent/chat/folders/[id]/route';
import { tools as route5Tools } from '../../../../agent/chat/folders/route';
import { tools as route6Tools } from '../../../../agent/brave-search/route';
import { tools as route7Tools } from '../../../../agent/ai-stream/route';
import { tools as route8Tools } from '../../../../agent/text-to-speech/route';
import { tools as route9Tools } from '../../../../agent/speech-to-text/hotkey/route';
import { tools as route10Tools } from '../../../server/dev/route';
import { tools as route11Tools } from '../../../server/start/route';
import { tools as route12Tools } from '../../../server/build/route';
import { tools as route13Tools } from '../../../server/health/route';
import { tools as route14Tools } from '../../../translations/reorganize/route';
import { tools as route15Tools } from '../../../translations/restore-backup/route';
import { tools as route16Tools } from '../../../translations/stats/route';
import { tools as route17Tools } from '../../../help/route';
import { tools as route18Tools } from '../../../db/schema-verify/route';
import { tools as route19Tools } from '../../../db/utils/docker-operations/route';
import { tools as route20Tools } from '../../../db/migrate-repair/route';
import { tools as route21Tools } from '../../../db/migrate-prod/route';
import { tools as route22Tools } from '../../../db/seed/route';
import { tools as route23Tools } from '../../../db/reset/route';
import { tools as route24Tools } from '../../../db/migrate-sync/route';
import { tools as route25Tools } from '../../../db/migrate/route';
import { tools as route26Tools } from '../../../db/ping/route';
import { tools as route27Tools } from '../../../db/sql/route';
import { tools as route28Tools } from '../../../db/studio/route';
import { tools as route29Tools } from '../../tasks/cron/tasks/route';
import { tools as route30Tools } from '../../tasks/cron/history/route';
import { tools as route31Tools } from '../../tasks/cron/status/route';
import { tools as route32Tools } from '../../tasks/cron/stats/route';
import { tools as route33Tools } from '../../tasks/side-tasks/route';
import { tools as route34Tools } from '../../tasks/types/route';
import { tools as route35Tools } from '../../tasks/pulse/route';
import { tools as route36Tools } from '../../tasks/unified-runner/route';
import { tools as route37Tools } from '../../mcp/serve/route';
import { tools as route38Tools } from '../../ai/tools/route';
import { tools as route39Tools } from '../../cli/setup/uninstall/route';
import { tools as route40Tools } from '../../cli/setup/update/route';
import { tools as route41Tools } from '../../cli/setup/status/route';
import { tools as route42Tools } from '../../cli/setup/install/route';
import { tools as route43Tools } from '../../react-native/generate/route';
import { tools as route44Tools } from '../../../generators/generate-all/route';
import { tools as route45Tools } from '../../../generators/endpoint/route';
import { tools as route46Tools } from '../../../generators/route-handlers/route';
import { tools as route47Tools } from '../../../generators/endpoints/route';
import { tools as route48Tools } from '../../../generators/endpoints-index/route';
import { tools as route49Tools } from '../../../generators/task-index/route';
import { tools as route50Tools } from '../../../generators/seeds/route';
import { tools as route51Tools } from '../../../generators/generate-trpc-router/validation/route';
import { tools as route52Tools } from '../../../../manifest/route';
import { tools as route53Tools } from '../../../../leads/lead/[id]/route';
import { tools as route54Tools } from '../../../../leads/tracking/engagement/route';
import { tools as route55Tools } from '../../../../leads/search/route';
import { tools as route56Tools } from '../../../../leads/campaigns/campaign-starter/campaign-starter-config/route';
import { tools as route57Tools } from '../../../../leads/campaigns/emails/test-mail/route';
import { tools as route58Tools } from '../../../../leads/list/route';
import { tools as route59Tools } from '../../../../leads/import/route';
import { tools as route60Tools } from '../../../../leads/export/route';
import { tools as route61Tools } from '../../../../leads/stats/route';
import { tools as route62Tools } from '../../../../leads/create/route';
import { tools as route63Tools } from '../../../../leads/batch/route';
import { tools as route64Tools } from '../../../../referral/earnings/list/route';
import { tools as route65Tools } from '../../../../referral/link-to-lead/route';
import { tools as route66Tools } from '../../../../referral/codes/list/route';
import { tools as route67Tools } from '../../../../referral/stats/route';
import { tools as route68Tools } from '../../../../users/user/[id]/route';
import { tools as route69Tools } from '../../../../users/list/route';
import { tools as route70Tools } from '../../../../users/stats/route';
import { tools as route71Tools } from '../../../../users/create/route';
import { tools as route72Tools } from '../../../../user/private/logout/route';
import { tools as route73Tools } from '../../../../user/private/me/route';
import { tools as route74Tools } from '../../../../user/public/login/options/route';
import { tools as route75Tools } from '../../../../user/public/signup/route';
import { tools as route76Tools } from '../../../../user/public/reset-password/validate/route';
import { tools as route77Tools } from '../../../../user/public/reset-password/request/route';
import { tools as route78Tools } from '../../../../user/public/reset-password/confirm/route';
import { tools as route79Tools } from '../../../../user/search/route';
import { tools as route80Tools } from '../../../../user/auth/check/route';
import { tools as route81Tools } from '../../../../subscription/route';
import { tools as route82Tools } from '../../../../payment/portal/route';
import { tools as route83Tools } from '../../../../payment/invoice/route';
import { tools as route84Tools } from '../../../../payment/providers/stripe/cli/route';
import { tools as route85Tools } from '../../../../payment/checkout/route';
import { tools as route86Tools } from '../../../../payment/refund/route';
import { tools as route87Tools } from '../../../../credits/history/route';
import { tools as route88Tools } from '../../../../credits/purchase/route';
import { tools as route89Tools } from '../../../../contact/route';
import { tools as route90Tools } from '../../../../emails/smtp-client/list/route';
import { tools as route91Tools } from '../../../../emails/smtp-client/edit/[id]/route';
import { tools as route92Tools } from '../../../../emails/smtp-client/create/route';
import { tools as route93Tools } from '../../../../emails/send/route';
import { tools as route94Tools } from '../../../../emails/messages/[id]/route';
import { tools as route95Tools } from '../../../../emails/imap-client/messages/[id]/route';
import { tools as route96Tools } from '../../../../emails/imap-client/folders/list/route';
import { tools as route97Tools } from '../../../../emails/imap-client/folders/sync/route';
import { tools as route98Tools } from '../../../../emails/imap-client/config/route';
import { tools as route99Tools } from '../../../../emails/imap-client/health/route';
import { tools as route100Tools } from '../../../../emails/imap-client/sync/route';
import { tools as route101Tools } from '../../../../emails/imap-client/accounts/[id]/route';
import { tools as route102Tools } from '../../../../import/route';
import { tools as route103Tools } from '../../../../newsletter/unsubscribe/route';
import { tools as route104Tools } from '../../../../newsletter/subscribe/route';
import { tools as route105Tools } from '../../../../newsletter/status/route';
import { tools as route106Tools } from '../../../../browser/route';

const route0 = wrapToolsForTRPC(route0Tools);
const route1 = wrapToolsForTRPC(route1Tools);
const route2 = wrapToolsForTRPC(route2Tools);
const route3 = wrapToolsForTRPC(route3Tools);
const route4 = wrapToolsForTRPC(route4Tools);
const route5 = wrapToolsForTRPC(route5Tools);
const route6 = wrapToolsForTRPC(route6Tools);
const route7 = wrapToolsForTRPC(route7Tools);
const route8 = wrapToolsForTRPC(route8Tools);
const route9 = wrapToolsForTRPC(route9Tools);
const route10 = wrapToolsForTRPC(route10Tools);
const route11 = wrapToolsForTRPC(route11Tools);
const route12 = wrapToolsForTRPC(route12Tools);
const route13 = wrapToolsForTRPC(route13Tools);
const route14 = wrapToolsForTRPC(route14Tools);
const route15 = wrapToolsForTRPC(route15Tools);
const route16 = wrapToolsForTRPC(route16Tools);
const route17 = wrapToolsForTRPC(route17Tools);
const route18 = wrapToolsForTRPC(route18Tools);
const route19 = wrapToolsForTRPC(route19Tools);
const route20 = wrapToolsForTRPC(route20Tools);
const route21 = wrapToolsForTRPC(route21Tools);
const route22 = wrapToolsForTRPC(route22Tools);
const route23 = wrapToolsForTRPC(route23Tools);
const route24 = wrapToolsForTRPC(route24Tools);
const route25 = wrapToolsForTRPC(route25Tools);
const route26 = wrapToolsForTRPC(route26Tools);
const route27 = wrapToolsForTRPC(route27Tools);
const route28 = wrapToolsForTRPC(route28Tools);
const route29 = wrapToolsForTRPC(route29Tools);
const route30 = wrapToolsForTRPC(route30Tools);
const route31 = wrapToolsForTRPC(route31Tools);
const route32 = wrapToolsForTRPC(route32Tools);
const route33 = wrapToolsForTRPC(route33Tools);
const route34 = wrapToolsForTRPC(route34Tools);
const route35 = wrapToolsForTRPC(route35Tools);
const route36 = wrapToolsForTRPC(route36Tools);
const route37 = wrapToolsForTRPC(route37Tools);
const route38 = wrapToolsForTRPC(route38Tools);
const route39 = wrapToolsForTRPC(route39Tools);
const route40 = wrapToolsForTRPC(route40Tools);
const route41 = wrapToolsForTRPC(route41Tools);
const route42 = wrapToolsForTRPC(route42Tools);
const route43 = wrapToolsForTRPC(route43Tools);
const route44 = wrapToolsForTRPC(route44Tools);
const route45 = wrapToolsForTRPC(route45Tools);
const route46 = wrapToolsForTRPC(route46Tools);
const route47 = wrapToolsForTRPC(route47Tools);
const route48 = wrapToolsForTRPC(route48Tools);
const route49 = wrapToolsForTRPC(route49Tools);
const route50 = wrapToolsForTRPC(route50Tools);
const route51 = wrapToolsForTRPC(route51Tools);
const route52 = wrapToolsForTRPC(route52Tools);
const route53 = wrapToolsForTRPC(route53Tools);
const route54 = wrapToolsForTRPC(route54Tools);
const route55 = wrapToolsForTRPC(route55Tools);
const route56 = wrapToolsForTRPC(route56Tools);
const route57 = wrapToolsForTRPC(route57Tools);
const route58 = wrapToolsForTRPC(route58Tools);
const route59 = wrapToolsForTRPC(route59Tools);
const route60 = wrapToolsForTRPC(route60Tools);
const route61 = wrapToolsForTRPC(route61Tools);
const route62 = wrapToolsForTRPC(route62Tools);
const route63 = wrapToolsForTRPC(route63Tools);
const route64 = wrapToolsForTRPC(route64Tools);
const route65 = wrapToolsForTRPC(route65Tools);
const route66 = wrapToolsForTRPC(route66Tools);
const route67 = wrapToolsForTRPC(route67Tools);
const route68 = wrapToolsForTRPC(route68Tools);
const route69 = wrapToolsForTRPC(route69Tools);
const route70 = wrapToolsForTRPC(route70Tools);
const route71 = wrapToolsForTRPC(route71Tools);
const route72 = wrapToolsForTRPC(route72Tools);
const route73 = wrapToolsForTRPC(route73Tools);
const route74 = wrapToolsForTRPC(route74Tools);
const route75 = wrapToolsForTRPC(route75Tools);
const route76 = wrapToolsForTRPC(route76Tools);
const route77 = wrapToolsForTRPC(route77Tools);
const route78 = wrapToolsForTRPC(route78Tools);
const route79 = wrapToolsForTRPC(route79Tools);
const route80 = wrapToolsForTRPC(route80Tools);
const route81 = wrapToolsForTRPC(route81Tools);
const route82 = wrapToolsForTRPC(route82Tools);
const route83 = wrapToolsForTRPC(route83Tools);
const route84 = wrapToolsForTRPC(route84Tools);
const route85 = wrapToolsForTRPC(route85Tools);
const route86 = wrapToolsForTRPC(route86Tools);
const route87 = wrapToolsForTRPC(route87Tools);
const route88 = wrapToolsForTRPC(route88Tools);
const route89 = wrapToolsForTRPC(route89Tools);
const route90 = wrapToolsForTRPC(route90Tools);
const route91 = wrapToolsForTRPC(route91Tools);
const route92 = wrapToolsForTRPC(route92Tools);
const route93 = wrapToolsForTRPC(route93Tools);
const route94 = wrapToolsForTRPC(route94Tools);
const route95 = wrapToolsForTRPC(route95Tools);
const route96 = wrapToolsForTRPC(route96Tools);
const route97 = wrapToolsForTRPC(route97Tools);
const route98 = wrapToolsForTRPC(route98Tools);
const route99 = wrapToolsForTRPC(route99Tools);
const route100 = wrapToolsForTRPC(route100Tools);
const route101 = wrapToolsForTRPC(route101Tools);
const route102 = wrapToolsForTRPC(route102Tools);
const route103 = wrapToolsForTRPC(route103Tools);
const route104 = wrapToolsForTRPC(route104Tools);
const route105 = wrapToolsForTRPC(route105Tools);
const route106 = wrapToolsForTRPC(route106Tools);

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
        "speech-to-text": router({
          hotkey: router({ ...route9 }),
        }),
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
            serve: router({ ...route37 }),
          }),
          ai: router({
            tools: router({ ...route38 }),
          }),
          cli: router({
            setup: router({
              uninstall: router({ ...route39 }),
              update: router({ ...route40 }),
              status: router({ ...route41 }),
              install: router({ ...route42 }),
            }),
          }),
          "react-native": router({
            generate: router({ ...route43 }),
          }),
        }),
        generators: router({
          "generate-all": router({ ...route44 }),
          endpoint: router({ ...route45 }),
          "route-handlers": router({ ...route46 }),
          endpoints: router({ ...route47 }),
          "endpoints-index": router({ ...route48 }),
          "task-index": router({ ...route49 }),
          seeds: router({ ...route50 }),
          "generate-trpc-router": router({
            validation: router({ ...route51 }),
          }),
        }),
      }),
      manifest: router({ ...route52 }),
      leads: router({
        lead: router({ ...route53 }),
        tracking: router({
          engagement: router({ ...route54 }),
        }),
        search: router({ ...route55 }),
        campaigns: router({
          "campaign-starter": router({
            "campaign-starter-config": router({ ...route56 }),
          }),
          emails: router({
            "test-mail": router({ ...route57 }),
          }),
        }),
        list: router({ ...route58 }),
        import: router({ ...route59 }),
        export: router({ ...route60 }),
        stats: router({ ...route61 }),
        create: router({ ...route62 }),
        batch: router({ ...route63 }),
      }),
      referral: router({
        earnings: router({
          list: router({ ...route64 }),
        }),
        "link-to-lead": router({ ...route65 }),
        codes: router({
          list: router({ ...route66 }),
        }),
        stats: router({ ...route67 }),
      }),
      users: router({
        user: router({ ...route68 }),
        list: router({ ...route69 }),
        stats: router({ ...route70 }),
        create: router({ ...route71 }),
      }),
      user: router({
        private: router({
          logout: router({ ...route72 }),
          me: router({ ...route73 }),
        }),
        public: router({
          login: router({
            options: router({ ...route74 }),
          }),
          signup: router({ ...route75 }),
          "reset-password": router({
            validate: router({ ...route76 }),
            request: router({ ...route77 }),
            confirm: router({ ...route78 }),
          }),
        }),
        search: router({ ...route79 }),
        auth: router({
          check: router({ ...route80 }),
        }),
      }),
      subscription: router({ ...route81 }),
      payment: router({
        portal: router({ ...route82 }),
        invoice: router({ ...route83 }),
        providers: router({
          stripe: router({
            cli: router({ ...route84 }),
          }),
        }),
        checkout: router({ ...route85 }),
        refund: router({ ...route86 }),
      }),
      credits: router({
        history: router({ ...route87 }),
        purchase: router({ ...route88 }),
      }),
      contact: router({ ...route89 }),
      emails: router({
        "smtp-client": router({
          list: router({ ...route90 }),
          edit: router({ ...route91 }),
          create: router({ ...route92 }),
        }),
        send: router({ ...route93 }),
        messages: router({ ...route94 }),
        "imap-client": router({
          messages: router({ ...route95 }),
          folders: router({
            list: router({ ...route96 }),
            sync: router({ ...route97 }),
          }),
          config: router({ ...route98 }),
          health: router({ ...route99 }),
          sync: router({ ...route100 }),
          accounts: router({ ...route101 }),
        }),
      }),
      import: router({ ...route102 }),
      newsletter: router({
        unsubscribe: router({ ...route103 }),
        subscribe: router({ ...route104 }),
        status: router({ ...route105 }),
      }),
      browser: router({ ...route106 }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
