/**
 * Auto-generated tRPC Router
 * Generated from route files in the API directory
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */

import { router } from "@/app/api/[locale]/system/unified-interface/trpc/setup";
import { wrapToolsForTRPC } from "@/app/api/[locale]/system/unified-interface/trpc/wrapper";
import { tools as route0Tools } from "../../../../agent/chat/threads/route";
import { tools as route1Tools } from "../../../../agent/chat/threads/[threadId]/route";
import { tools as route2Tools } from "../../../../agent/chat/memories/[id]/route";
import { tools as route3Tools } from "../../../../agent/chat/memories/route";
import { tools as route4Tools } from "../../../../agent/chat/favorites/[id]/route";
import { tools as route5Tools } from "../../../../agent/chat/favorites/route";
import { tools as route6Tools } from "../../../../agent/chat/characters/[id]/route";
import { tools as route7Tools } from "../../../../agent/chat/characters/route";
import { tools as route8Tools } from "../../../../agent/chat/folders/[id]/route";
import { tools as route9Tools } from "../../../../agent/chat/folders/route";
import { tools as route10Tools } from "../../../../agent/brave-search/route";
import { tools as route11Tools } from "../../../../agent/ai-stream/route";
import { tools as route12Tools } from "../../../../agent/text-to-speech/route";
import { tools as route13Tools } from "../../../../agent/speech-to-text/hotkey/route";
import { tools as route14Tools } from "../../../server/dev/route";
import { tools as route15Tools } from "../../../server/start/route";
import { tools as route16Tools } from "../../../server/build/route";
import { tools as route17Tools } from "../../../server/health/route";
import { tools as route18Tools } from "../../../translations/reorganize/route";
import { tools as route19Tools } from "../../../translations/restore-backup/route";
import { tools as route20Tools } from "../../../translations/stats/route";
import { tools as route21Tools } from "../../../help/route";
import { tools as route22Tools } from "../../../db/schema-verify/route";
import { tools as route23Tools } from "../../../db/utils/docker-operations/route";
import { tools as route24Tools } from "../../../db/migrate-repair/route";
import { tools as route25Tools } from "../../../db/migrate-prod/route";
import { tools as route26Tools } from "../../../db/seed/route";
import { tools as route27Tools } from "../../../db/reset/route";
import { tools as route28Tools } from "../../../db/migrate-sync/route";
import { tools as route29Tools } from "../../../db/migrate/route";
import { tools as route30Tools } from "../../../db/ping/route";
import { tools as route31Tools } from "../../../db/sql/route";
import { tools as route32Tools } from "../../../db/studio/route";
import { tools as route33Tools } from "../../tasks/cron/tasks/route";
import { tools as route34Tools } from "../../tasks/cron/history/route";
import { tools as route35Tools } from "../../tasks/cron/status/route";
import { tools as route36Tools } from "../../tasks/cron/stats/route";
import { tools as route37Tools } from "../../tasks/side-tasks/route";
import { tools as route38Tools } from "../../tasks/types/route";
import { tools as route39Tools } from "../../tasks/pulse/route";
import { tools as route40Tools } from "../../tasks/unified-runner/route";
import { tools as route41Tools } from "../../mcp/serve/route";
import { tools as route42Tools } from "../../ai/tools/route";
import { tools as route43Tools } from "../../cli/setup/uninstall/route";
import { tools as route44Tools } from "../../cli/setup/update/route";
import { tools as route45Tools } from "../../cli/setup/status/route";
import { tools as route46Tools } from "../../cli/setup/install/route";
import { tools as route47Tools } from "../../react-native/generate/route";
import { tools as route48Tools } from "../../../generators/generate-all/route";
import { tools as route49Tools } from "../../../generators/endpoint/route";
import { tools as route50Tools } from "../../../generators/route-handlers/route";
import { tools as route51Tools } from "../../../generators/endpoints/route";
import { tools as route52Tools } from "../../../generators/env/route";
import { tools as route53Tools } from "../../../generators/endpoints-index/route";
import { tools as route54Tools } from "../../../generators/task-index/route";
import { tools as route55Tools } from "../../../generators/seeds/route";
import { tools as route56Tools } from "../../../generators/generate-trpc-router/validation/route";
import { tools as route57Tools } from "../../../../manifest/route";
import { tools as route58Tools } from "../../../../leads/lead/[id]/route";
import { tools as route59Tools } from "../../../../leads/tracking/engagement/route";
import { tools as route60Tools } from "../../../../leads/search/route";
import { tools as route61Tools } from "../../../../leads/campaigns/campaign-starter/campaign-starter-config/route";
import { tools as route62Tools } from "../../../../leads/campaigns/emails/test-mail/route";
import { tools as route63Tools } from "../../../../leads/list/route";
import { tools as route64Tools } from "../../../../leads/import/route";
import { tools as route65Tools } from "../../../../leads/export/route";
import { tools as route66Tools } from "../../../../leads/stats/route";
import { tools as route67Tools } from "../../../../leads/create/route";
import { tools as route68Tools } from "../../../../leads/batch/route";
import { tools as route69Tools } from "../../../../referral/earnings/list/route";
import { tools as route70Tools } from "../../../../referral/link-to-lead/route";
import { tools as route71Tools } from "../../../../referral/codes/list/route";
import { tools as route72Tools } from "../../../../referral/stats/route";
import { tools as route73Tools } from "../../../../users/user/[id]/route";
import { tools as route74Tools } from "../../../../users/list/route";
import { tools as route75Tools } from "../../../../users/stats/route";
import { tools as route76Tools } from "../../../../users/create/route";
import { tools as route77Tools } from "../../../../user/private/logout/route";
import { tools as route78Tools } from "../../../../user/private/me/route";
import { tools as route79Tools } from "../../../../user/public/login/options/route";
import { tools as route80Tools } from "../../../../user/public/signup/route";
import { tools as route81Tools } from "../../../../user/public/reset-password/validate/route";
import { tools as route82Tools } from "../../../../user/public/reset-password/request/route";
import { tools as route83Tools } from "../../../../user/public/reset-password/confirm/route";
import { tools as route84Tools } from "../../../../user/search/route";
import { tools as route85Tools } from "../../../../user/auth/check/route";
import { tools as route86Tools } from "../../../../subscription/route";
import { tools as route87Tools } from "../../../../payment/portal/route";
import { tools as route88Tools } from "../../../../payment/invoice/route";
import { tools as route89Tools } from "../../../../payment/providers/stripe/cli/route";
import { tools as route90Tools } from "../../../../payment/providers/nowpayments/cli/route";
import { tools as route91Tools } from "../../../../payment/checkout/route";
import { tools as route92Tools } from "../../../../payment/refund/route";
import { tools as route93Tools } from "../../../../credits/history/route";
import { tools as route94Tools } from "../../../../credits/purchase/route";
import { tools as route95Tools } from "../../../../contact/route";
import { tools as route96Tools } from "../../../../emails/smtp-client/list/route";
import { tools as route97Tools } from "../../../../emails/smtp-client/edit/[id]/route";
import { tools as route98Tools } from "../../../../emails/smtp-client/create/route";
import { tools as route99Tools } from "../../../../emails/send/route";
import { tools as route100Tools } from "../../../../emails/messages/[id]/route";
import { tools as route101Tools } from "../../../../emails/imap-client/messages/[id]/route";
import { tools as route102Tools } from "../../../../emails/imap-client/folders/list/route";
import { tools as route103Tools } from "../../../../emails/imap-client/folders/sync/route";
import { tools as route104Tools } from "../../../../emails/imap-client/config/route";
import { tools as route105Tools } from "../../../../emails/imap-client/health/route";
import { tools as route106Tools } from "../../../../emails/imap-client/sync/route";
import { tools as route107Tools } from "../../../../emails/imap-client/accounts/[id]/route";
import { tools as route108Tools } from "../../../../import/route";
import { tools as route109Tools } from "../../../../newsletter/unsubscribe/route";
import { tools as route110Tools } from "../../../../newsletter/subscribe/route";
import { tools as route111Tools } from "../../../../newsletter/status/route";
import { tools as route112Tools } from "../../../../browser/performance-analyze-insight/route";
import { tools as route113Tools } from "../../../../browser/get-console-message/route";
import { tools as route114Tools } from "../../../../browser/new-page/route";
import { tools as route115Tools } from "../../../../browser/take-snapshot/route";
import { tools as route116Tools } from "../../../../browser/drag/route";
import { tools as route117Tools } from "../../../../browser/get-network-request/route";
import { tools as route118Tools } from "../../../../browser/list-pages/route";
import { tools as route119Tools } from "../../../../browser/close-page/route";
import { tools as route120Tools } from "../../../../browser/resize-page/route";
import { tools as route121Tools } from "../../../../browser/fill/route";
import { tools as route122Tools } from "../../../../browser/hover/route";
import { tools as route123Tools } from "../../../../browser/upload-file/route";
import { tools as route124Tools } from "../../../../browser/handle-dialog/route";
import { tools as route125Tools } from "../../../../browser/select-page/route";
import { tools as route126Tools } from "../../../../browser/navigate-page/route";
import { tools as route127Tools } from "../../../../browser/press-key/route";
import { tools as route128Tools } from "../../../../browser/fill-form/route";
import { tools as route129Tools } from "../../../../browser/performance-stop-trace/route";
import { tools as route130Tools } from "../../../../browser/performance-start-trace/route";
import { tools as route131Tools } from "../../../../browser/emulate/route";
import { tools as route132Tools } from "../../../../browser/take-screenshot/route";
import { tools as route133Tools } from "../../../../browser/list-network-requests/route";
import { tools as route134Tools } from "../../../../browser/evaluate-script/route";
import { tools as route135Tools } from "../../../../browser/list-console-messages/route";
import { tools as route136Tools } from "../../../../browser/wait-for/route";
import { tools as route137Tools } from "../../../../browser/click/route";

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
const route107 = wrapToolsForTRPC(route107Tools);
const route108 = wrapToolsForTRPC(route108Tools);
const route109 = wrapToolsForTRPC(route109Tools);
const route110 = wrapToolsForTRPC(route110Tools);
const route111 = wrapToolsForTRPC(route111Tools);
const route112 = wrapToolsForTRPC(route112Tools);
const route113 = wrapToolsForTRPC(route113Tools);
const route114 = wrapToolsForTRPC(route114Tools);
const route115 = wrapToolsForTRPC(route115Tools);
const route116 = wrapToolsForTRPC(route116Tools);
const route117 = wrapToolsForTRPC(route117Tools);
const route118 = wrapToolsForTRPC(route118Tools);
const route119 = wrapToolsForTRPC(route119Tools);
const route120 = wrapToolsForTRPC(route120Tools);
const route121 = wrapToolsForTRPC(route121Tools);
const route122 = wrapToolsForTRPC(route122Tools);
const route123 = wrapToolsForTRPC(route123Tools);
const route124 = wrapToolsForTRPC(route124Tools);
const route125 = wrapToolsForTRPC(route125Tools);
const route126 = wrapToolsForTRPC(route126Tools);
const route127 = wrapToolsForTRPC(route127Tools);
const route128 = wrapToolsForTRPC(route128Tools);
const route129 = wrapToolsForTRPC(route129Tools);
const route130 = wrapToolsForTRPC(route130Tools);
const route131 = wrapToolsForTRPC(route131Tools);
const route132 = wrapToolsForTRPC(route132Tools);
const route133 = wrapToolsForTRPC(route133Tools);
const route134 = wrapToolsForTRPC(route134Tools);
const route135 = wrapToolsForTRPC(route135Tools);
const route136 = wrapToolsForTRPC(route136Tools);
const route137 = wrapToolsForTRPC(route137Tools);

export const appRouter = router({
  agent: router({
    chat: router({
      threads: router({ ...route0, ...route1 }),
      memories: router({ ...route2, ...route3 }),
      favorites: router({ ...route4, ...route5 }),
      characters: router({ ...route6, ...route7 }),
      folders: router({ ...route8, ...route9 }),
    }),
    "brave-search": router({ ...route10 }),
    "ai-stream": router({ ...route11 }),
    "text-to-speech": router({ ...route12 }),
    "speech-to-text": router({
      hotkey: router({ ...route13 }),
    }),
  }),
  system: router({
    server: router({
      dev: router({ ...route14 }),
      start: router({ ...route15 }),
      build: router({ ...route16 }),
      health: router({ ...route17 }),
    }),
    translations: router({
      reorganize: router({ ...route18 }),
      "restore-backup": router({ ...route19 }),
      stats: router({ ...route20 }),
    }),
    help: router({ ...route21 }),
    db: router({
      "schema-verify": router({ ...route22 }),
      utils: router({
        "docker-operations": router({ ...route23 }),
      }),
      "migrate-repair": router({ ...route24 }),
      "migrate-prod": router({ ...route25 }),
      seed: router({ ...route26 }),
      reset: router({ ...route27 }),
      "migrate-sync": router({ ...route28 }),
      migrate: router({ ...route29 }),
      ping: router({ ...route30 }),
      sql: router({ ...route31 }),
      studio: router({ ...route32 }),
    }),
    "unified-interface": router({
      tasks: router({
        cron: router({
          tasks: router({ ...route33 }),
          history: router({ ...route34 }),
          status: router({ ...route35 }),
          stats: router({ ...route36 }),
        }),
        "side-tasks": router({ ...route37 }),
        types: router({ ...route38 }),
        pulse: router({ ...route39 }),
        "unified-runner": router({ ...route40 }),
      }),
      mcp: router({
        serve: router({ ...route41 }),
      }),
      ai: router({
        tools: router({ ...route42 }),
      }),
      cli: router({
        setup: router({
          uninstall: router({ ...route43 }),
          update: router({ ...route44 }),
          status: router({ ...route45 }),
          install: router({ ...route46 }),
        }),
      }),
      "react-native": router({
        generate: router({ ...route47 }),
      }),
    }),
    generators: router({
      "generate-all": router({ ...route48 }),
      endpoint: router({ ...route49 }),
      "route-handlers": router({ ...route50 }),
      endpoints: router({ ...route51 }),
      env: router({ ...route52 }),
      "endpoints-index": router({ ...route53 }),
      "task-index": router({ ...route54 }),
      seeds: router({ ...route55 }),
      "generate-trpc-router": router({
        validation: router({ ...route56 }),
      }),
    }),
  }),
  manifest: router({ ...route57 }),
  leads: router({
    lead: router({ ...route58 }),
    tracking: router({
      engagement: router({ ...route59 }),
    }),
    search: router({ ...route60 }),
    campaigns: router({
      "campaign-starter": router({
        "campaign-starter-config": router({ ...route61 }),
      }),
      emails: router({
        "test-mail": router({ ...route62 }),
      }),
    }),
    list: router({ ...route63 }),
    import: router({ ...route64 }),
    export: router({ ...route65 }),
    stats: router({ ...route66 }),
    create: router({ ...route67 }),
    batch: router({ ...route68 }),
  }),
  referral: router({
    earnings: router({
      list: router({ ...route69 }),
    }),
    "link-to-lead": router({ ...route70 }),
    codes: router({
      list: router({ ...route71 }),
    }),
    stats: router({ ...route72 }),
  }),
  users: router({
    user: router({ ...route73 }),
    list: router({ ...route74 }),
    stats: router({ ...route75 }),
    create: router({ ...route76 }),
  }),
  user: router({
    private: router({
      logout: router({ ...route77 }),
      me: router({ ...route78 }),
    }),
    public: router({
      login: router({
        options: router({ ...route79 }),
      }),
      signup: router({ ...route80 }),
      "reset-password": router({
        validate: router({ ...route81 }),
        request: router({ ...route82 }),
        confirm: router({ ...route83 }),
      }),
    }),
    search: router({ ...route84 }),
    auth: router({
      check: router({ ...route85 }),
    }),
  }),
  subscription: router({ ...route86 }),
  payment: router({
    portal: router({ ...route87 }),
    invoice: router({ ...route88 }),
    providers: router({
      stripe: router({
        cli: router({ ...route89 }),
      }),
      nowpayments: router({
        cli: router({ ...route90 }),
      }),
    }),
    checkout: router({ ...route91 }),
    refund: router({ ...route92 }),
  }),
  credits: router({
    history: router({ ...route93 }),
    purchase: router({ ...route94 }),
  }),
  contact: router({ ...route95 }),
  emails: router({
    "smtp-client": router({
      list: router({ ...route96 }),
      edit: router({ ...route97 }),
      create: router({ ...route98 }),
    }),
    send: router({ ...route99 }),
    messages: router({ ...route100 }),
    "imap-client": router({
      messages: router({ ...route101 }),
      folders: router({
        list: router({ ...route102 }),
        sync: router({ ...route103 }),
      }),
      config: router({ ...route104 }),
      health: router({ ...route105 }),
      sync: router({ ...route106 }),
      accounts: router({ ...route107 }),
    }),
  }),
  import: router({ ...route108 }),
  newsletter: router({
    unsubscribe: router({ ...route109 }),
    subscribe: router({ ...route110 }),
    status: router({ ...route111 }),
  }),
  browser: router({
    "performance-analyze-insight": router({ ...route112 }),
    "get-console-message": router({ ...route113 }),
    "new-page": router({ ...route114 }),
    "take-snapshot": router({ ...route115 }),
    drag: router({ ...route116 }),
    "get-network-request": router({ ...route117 }),
    "list-pages": router({ ...route118 }),
    "close-page": router({ ...route119 }),
    "resize-page": router({ ...route120 }),
    fill: router({ ...route121 }),
    hover: router({ ...route122 }),
    "upload-file": router({ ...route123 }),
    "handle-dialog": router({ ...route124 }),
    "select-page": router({ ...route125 }),
    "navigate-page": router({ ...route126 }),
    "press-key": router({ ...route127 }),
    "fill-form": router({ ...route128 }),
    "performance-stop-trace": router({ ...route129 }),
    "performance-start-trace": router({ ...route130 }),
    emulate: router({ ...route131 }),
    "take-screenshot": router({ ...route132 }),
    "list-network-requests": router({ ...route133 }),
    "evaluate-script": router({ ...route134 }),
    "list-console-messages": router({ ...route135 }),
    "wait-for": router({ ...route136 }),
    click: router({ ...route137 }),
  }),
});

export type AppRouter = typeof appRouter;
