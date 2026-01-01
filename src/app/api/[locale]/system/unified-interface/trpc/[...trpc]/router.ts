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
import { tools as route10Tools } from "../../../../agent/chat/files/[threadId]/[filename]/route";
import { tools as route11Tools } from "../../../../agent/brave-search/route";
import { tools as route12Tools } from "../../../../agent/ai-stream/route";
import { tools as route13Tools } from "../../../../agent/text-to-speech/route";
import { tools as route14Tools } from "../../../../agent/speech-to-text/hotkey/route";
import { tools as route15Tools } from "../../../server/dev/route";
import { tools as route16Tools } from "../../../server/start/route";
import { tools as route17Tools } from "../../../server/build/route";
import { tools as route18Tools } from "../../../server/health/route";
import { tools as route19Tools } from "../../../translations/reorganize/route";
import { tools as route20Tools } from "../../../translations/restore-backup/route";
import { tools as route21Tools } from "../../../translations/stats/route";
import { tools as route22Tools } from "../../../help/route";
import { tools as route23Tools } from "../../../db/schema-verify/route";
import { tools as route24Tools } from "../../../db/utils/docker-operations/route";
import { tools as route25Tools } from "../../../db/migrate-repair/route";
import { tools as route26Tools } from "../../../db/migrate-prod/route";
import { tools as route27Tools } from "../../../db/seed/route";
import { tools as route28Tools } from "../../../db/reset/route";
import { tools as route29Tools } from "../../../db/migrate-sync/route";
import { tools as route30Tools } from "../../../db/migrate/route";
import { tools as route31Tools } from "../../../db/ping/route";
import { tools as route32Tools } from "../../../db/sql/route";
import { tools as route33Tools } from "../../../db/studio/route";
import { tools as route34Tools } from "../../tasks/cron/tasks/route";
import { tools as route35Tools } from "../../tasks/cron/history/route";
import { tools as route36Tools } from "../../tasks/cron/status/route";
import { tools as route37Tools } from "../../tasks/cron/stats/route";
import { tools as route38Tools } from "../../tasks/side-tasks/route";
import { tools as route39Tools } from "../../tasks/types/route";
import { tools as route40Tools } from "../../tasks/pulse/route";
import { tools as route41Tools } from "../../tasks/unified-runner/route";
import { tools as route42Tools } from "../../mcp/serve/route";
import { tools as route43Tools } from "../../ai/tools/route";
import { tools as route44Tools } from "../../cli/setup/uninstall/route";
import { tools as route45Tools } from "../../cli/setup/update/route";
import { tools as route46Tools } from "../../cli/setup/status/route";
import { tools as route47Tools } from "../../cli/setup/install/route";
import { tools as route48Tools } from "../../react-native/generate/route";
import { tools as route49Tools } from "../../../generators/generate-all/route";
import { tools as route50Tools } from "../../../generators/endpoint/route";
import { tools as route51Tools } from "../../../generators/route-handlers/route";
import { tools as route52Tools } from "../../../generators/endpoints/route";
import { tools as route53Tools } from "../../../generators/env/route";
import { tools as route54Tools } from "../../../generators/endpoints-index/route";
import { tools as route55Tools } from "../../../generators/email-templates/route";
import { tools as route56Tools } from "../../../generators/task-index/route";
import { tools as route57Tools } from "../../../generators/seeds/route";
import { tools as route58Tools } from "../../../generators/generate-trpc-router/validation/route";
import { tools as route59Tools } from "../../../../manifest/route";
import { tools as route60Tools } from "../../../../leads/lead/[id]/route";
import { tools as route61Tools } from "../../../../leads/tracking/engagement/route";
import { tools as route62Tools } from "../../../../leads/search/route";
import { tools as route63Tools } from "../../../../leads/campaigns/campaign-starter/campaign-starter-config/route";
import { tools as route64Tools } from "../../../../leads/campaigns/emails/test-mail/route";
import { tools as route65Tools } from "../../../../leads/list/route";
import { tools as route66Tools } from "../../../../leads/import/route";
import { tools as route67Tools } from "../../../../leads/export/route";
import { tools as route68Tools } from "../../../../leads/stats/route";
import { tools as route69Tools } from "../../../../leads/create/route";
import { tools as route70Tools } from "../../../../leads/batch/route";
import { tools as route71Tools } from "../../../../referral/earnings/list/route";
import { tools as route72Tools } from "../../../../referral/link-to-lead/route";
import { tools as route73Tools } from "../../../../referral/codes/list/route";
import { tools as route74Tools } from "../../../../referral/stats/route";
import { tools as route75Tools } from "../../../../users/user/[id]/route";
import { tools as route76Tools } from "../../../../users/list/route";
import { tools as route77Tools } from "../../../../users/stats/route";
import { tools as route78Tools } from "../../../../users/create/route";
import { tools as route79Tools } from "../../../../user/private/logout/route";
import { tools as route80Tools } from "../../../../user/private/me/route";
import { tools as route81Tools } from "../../../../user/public/login/options/route";
import { tools as route82Tools } from "../../../../user/public/signup/route";
import { tools as route83Tools } from "../../../../user/public/reset-password/validate/route";
import { tools as route84Tools } from "../../../../user/public/reset-password/request/route";
import { tools as route85Tools } from "../../../../user/public/reset-password/confirm/route";
import { tools as route86Tools } from "../../../../user/search/route";
import { tools as route87Tools } from "../../../../user/auth/check/route";
import { tools as route88Tools } from "../../../../subscription/route";
import { tools as route89Tools } from "../../../../payment/portal/route";
import { tools as route90Tools } from "../../../../payment/invoice/route";
import { tools as route91Tools } from "../../../../payment/providers/stripe/cli/route";
import { tools as route92Tools } from "../../../../payment/providers/nowpayments/cli/route";
import { tools as route93Tools } from "../../../../payment/checkout/route";
import { tools as route94Tools } from "../../../../payment/refund/route";
import { tools as route95Tools } from "../../../../credits/history/route";
import { tools as route96Tools } from "../../../../credits/purchase/route";
import { tools as route97Tools } from "../../../../contact/route";
import { tools as route98Tools } from "../../../../emails/smtp-client/list/route";
import { tools as route99Tools } from "../../../../emails/smtp-client/edit/[id]/route";
import { tools as route100Tools } from "../../../../emails/smtp-client/create/route";
import { tools as route101Tools } from "../../../../emails/send/route";
import { tools as route102Tools } from "../../../../emails/messages/[id]/route";
import { tools as route103Tools } from "../../../../emails/imap-client/messages/[id]/route";
import { tools as route104Tools } from "../../../../emails/imap-client/folders/list/route";
import { tools as route105Tools } from "../../../../emails/imap-client/folders/sync/route";
import { tools as route106Tools } from "../../../../emails/imap-client/config/route";
import { tools as route107Tools } from "../../../../emails/imap-client/health/route";
import { tools as route108Tools } from "../../../../emails/imap-client/sync/route";
import { tools as route109Tools } from "../../../../emails/imap-client/accounts/[id]/route";
import { tools as route110Tools } from "../../../../emails/preview/send-test/route";
import { tools as route111Tools } from "../../../../emails/preview/render/route";
import { tools as route112Tools } from "../../../../import/route";
import { tools as route113Tools } from "../../../../newsletter/unsubscribe/route";
import { tools as route114Tools } from "../../../../newsletter/subscribe/route";
import { tools as route115Tools } from "../../../../newsletter/status/route";
import { tools as route116Tools } from "../../../../browser/performance-analyze-insight/route";
import { tools as route117Tools } from "../../../../browser/get-console-message/route";
import { tools as route118Tools } from "../../../../browser/new-page/route";
import { tools as route119Tools } from "../../../../browser/take-snapshot/route";
import { tools as route120Tools } from "../../../../browser/drag/route";
import { tools as route121Tools } from "../../../../browser/get-network-request/route";
import { tools as route122Tools } from "../../../../browser/list-pages/route";
import { tools as route123Tools } from "../../../../browser/close-page/route";
import { tools as route124Tools } from "../../../../browser/resize-page/route";
import { tools as route125Tools } from "../../../../browser/fill/route";
import { tools as route126Tools } from "../../../../browser/hover/route";
import { tools as route127Tools } from "../../../../browser/upload-file/route";
import { tools as route128Tools } from "../../../../browser/handle-dialog/route";
import { tools as route129Tools } from "../../../../browser/select-page/route";
import { tools as route130Tools } from "../../../../browser/navigate-page/route";
import { tools as route131Tools } from "../../../../browser/press-key/route";
import { tools as route132Tools } from "../../../../browser/fill-form/route";
import { tools as route133Tools } from "../../../../browser/performance-stop-trace/route";
import { tools as route134Tools } from "../../../../browser/performance-start-trace/route";
import { tools as route135Tools } from "../../../../browser/emulate/route";
import { tools as route136Tools } from "../../../../browser/take-screenshot/route";
import { tools as route137Tools } from "../../../../browser/list-network-requests/route";
import { tools as route138Tools } from "../../../../browser/evaluate-script/route";
import { tools as route139Tools } from "../../../../browser/list-console-messages/route";
import { tools as route140Tools } from "../../../../browser/wait-for/route";
import { tools as route141Tools } from "../../../../browser/click/route";

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
const route138 = wrapToolsForTRPC(route138Tools);
const route139 = wrapToolsForTRPC(route139Tools);
const route140 = wrapToolsForTRPC(route140Tools);
const route141 = wrapToolsForTRPC(route141Tools);

export const appRouter = router({
  agent: router({
    chat: router({
      threads: router({ ...route0, ...route1 }),
      memories: router({ ...route2, ...route3 }),
      favorites: router({ ...route4, ...route5 }),
      characters: router({ ...route6, ...route7 }),
      folders: router({ ...route8, ...route9 }),
      files: router({ ...route10 }),
    }),
    "brave-search": router({ ...route11 }),
    "ai-stream": router({ ...route12 }),
    "text-to-speech": router({ ...route13 }),
    "speech-to-text": router({
      hotkey: router({ ...route14 }),
    }),
  }),
  system: router({
    server: router({
      dev: router({ ...route15 }),
      start: router({ ...route16 }),
      build: router({ ...route17 }),
      health: router({ ...route18 }),
    }),
    translations: router({
      reorganize: router({ ...route19 }),
      "restore-backup": router({ ...route20 }),
      stats: router({ ...route21 }),
    }),
    help: router({ ...route22 }),
    db: router({
      "schema-verify": router({ ...route23 }),
      utils: router({
        "docker-operations": router({ ...route24 }),
      }),
      "migrate-repair": router({ ...route25 }),
      "migrate-prod": router({ ...route26 }),
      seed: router({ ...route27 }),
      reset: router({ ...route28 }),
      "migrate-sync": router({ ...route29 }),
      migrate: router({ ...route30 }),
      ping: router({ ...route31 }),
      sql: router({ ...route32 }),
      studio: router({ ...route33 }),
    }),
    "unified-interface": router({
      tasks: router({
        cron: router({
          tasks: router({ ...route34 }),
          history: router({ ...route35 }),
          status: router({ ...route36 }),
          stats: router({ ...route37 }),
        }),
        "side-tasks": router({ ...route38 }),
        types: router({ ...route39 }),
        pulse: router({ ...route40 }),
        "unified-runner": router({ ...route41 }),
      }),
      mcp: router({
        serve: router({ ...route42 }),
      }),
      ai: router({
        tools: router({ ...route43 }),
      }),
      cli: router({
        setup: router({
          uninstall: router({ ...route44 }),
          update: router({ ...route45 }),
          status: router({ ...route46 }),
          install: router({ ...route47 }),
        }),
      }),
      "react-native": router({
        generate: router({ ...route48 }),
      }),
    }),
    generators: router({
      "generate-all": router({ ...route49 }),
      endpoint: router({ ...route50 }),
      "route-handlers": router({ ...route51 }),
      endpoints: router({ ...route52 }),
      env: router({ ...route53 }),
      "endpoints-index": router({ ...route54 }),
      "email-templates": router({ ...route55 }),
      "task-index": router({ ...route56 }),
      seeds: router({ ...route57 }),
      "generate-trpc-router": router({
        validation: router({ ...route58 }),
      }),
    }),
  }),
  manifest: router({ ...route59 }),
  leads: router({
    lead: router({ ...route60 }),
    tracking: router({
      engagement: router({ ...route61 }),
    }),
    search: router({ ...route62 }),
    campaigns: router({
      "campaign-starter": router({
        "campaign-starter-config": router({ ...route63 }),
      }),
      emails: router({
        "test-mail": router({ ...route64 }),
      }),
    }),
    list: router({ ...route65 }),
    import: router({ ...route66 }),
    export: router({ ...route67 }),
    stats: router({ ...route68 }),
    create: router({ ...route69 }),
    batch: router({ ...route70 }),
  }),
  referral: router({
    earnings: router({
      list: router({ ...route71 }),
    }),
    "link-to-lead": router({ ...route72 }),
    codes: router({
      list: router({ ...route73 }),
    }),
    stats: router({ ...route74 }),
  }),
  users: router({
    user: router({ ...route75 }),
    list: router({ ...route76 }),
    stats: router({ ...route77 }),
    create: router({ ...route78 }),
  }),
  user: router({
    private: router({
      logout: router({ ...route79 }),
      me: router({ ...route80 }),
    }),
    public: router({
      login: router({
        options: router({ ...route81 }),
      }),
      signup: router({ ...route82 }),
      "reset-password": router({
        validate: router({ ...route83 }),
        request: router({ ...route84 }),
        confirm: router({ ...route85 }),
      }),
    }),
    search: router({ ...route86 }),
    auth: router({
      check: router({ ...route87 }),
    }),
  }),
  subscription: router({ ...route88 }),
  payment: router({
    portal: router({ ...route89 }),
    invoice: router({ ...route90 }),
    providers: router({
      stripe: router({
        cli: router({ ...route91 }),
      }),
      nowpayments: router({
        cli: router({ ...route92 }),
      }),
    }),
    checkout: router({ ...route93 }),
    refund: router({ ...route94 }),
  }),
  credits: router({
    history: router({ ...route95 }),
    purchase: router({ ...route96 }),
  }),
  contact: router({ ...route97 }),
  emails: router({
    "smtp-client": router({
      list: router({ ...route98 }),
      edit: router({ ...route99 }),
      create: router({ ...route100 }),
    }),
    send: router({ ...route101 }),
    messages: router({ ...route102 }),
    "imap-client": router({
      messages: router({ ...route103 }),
      folders: router({
        list: router({ ...route104 }),
        sync: router({ ...route105 }),
      }),
      config: router({ ...route106 }),
      health: router({ ...route107 }),
      sync: router({ ...route108 }),
      accounts: router({ ...route109 }),
    }),
    preview: router({
      "send-test": router({ ...route110 }),
      render: router({ ...route111 }),
    }),
  }),
  import: router({ ...route112 }),
  newsletter: router({
    unsubscribe: router({ ...route113 }),
    subscribe: router({ ...route114 }),
    status: router({ ...route115 }),
  }),
  browser: router({
    "performance-analyze-insight": router({ ...route116 }),
    "get-console-message": router({ ...route117 }),
    "new-page": router({ ...route118 }),
    "take-snapshot": router({ ...route119 }),
    drag: router({ ...route120 }),
    "get-network-request": router({ ...route121 }),
    "list-pages": router({ ...route122 }),
    "close-page": router({ ...route123 }),
    "resize-page": router({ ...route124 }),
    fill: router({ ...route125 }),
    hover: router({ ...route126 }),
    "upload-file": router({ ...route127 }),
    "handle-dialog": router({ ...route128 }),
    "select-page": router({ ...route129 }),
    "navigate-page": router({ ...route130 }),
    "press-key": router({ ...route131 }),
    "fill-form": router({ ...route132 }),
    "performance-stop-trace": router({ ...route133 }),
    "performance-start-trace": router({ ...route134 }),
    emulate: router({ ...route135 }),
    "take-screenshot": router({ ...route136 }),
    "list-network-requests": router({ ...route137 }),
    "evaluate-script": router({ ...route138 }),
    "list-console-messages": router({ ...route139 }),
    "wait-for": router({ ...route140 }),
    click: router({ ...route141 }),
  }),
});

export type AppRouter = typeof appRouter;
