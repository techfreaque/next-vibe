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
import { tools as route11Tools } from "../../../../agent/fetch-url-content/route";
import { tools as route12Tools } from "../../../../agent/brave-search/route";
import { tools as route13Tools } from "../../../../agent/ai-stream/route";
import { tools as route14Tools } from "../../../../agent/text-to-speech/route";
import { tools as route15Tools } from "../../../../agent/speech-to-text/hotkey/route";
import { tools as route16Tools } from "../../../server/dev/route";
import { tools as route17Tools } from "../../../server/start/route";
import { tools as route18Tools } from "../../../server/build/route";
import { tools as route19Tools } from "../../../server/health/route";
import { tools as route20Tools } from "../../../translations/reorganize/route";
import { tools as route21Tools } from "../../../translations/restore-backup/route";
import { tools as route22Tools } from "../../../translations/stats/route";
import { tools as route23Tools } from "../../../help/route";
import { tools as route24Tools } from "../../../db/schema-verify/route";
import { tools as route25Tools } from "../../../db/utils/docker-operations/route";
import { tools as route26Tools } from "../../../db/migrate-repair/route";
import { tools as route27Tools } from "../../../db/migrate-prod/route";
import { tools as route28Tools } from "../../../db/seed/route";
import { tools as route29Tools } from "../../../db/reset/route";
import { tools as route30Tools } from "../../../db/migrate-sync/route";
import { tools as route31Tools } from "../../../db/migrate/route";
import { tools as route32Tools } from "../../../db/ping/route";
import { tools as route33Tools } from "../../../db/sql/route";
import { tools as route34Tools } from "../../../db/studio/route";
import { tools as route35Tools } from "../../tasks/cron/tasks/route";
import { tools as route36Tools } from "../../tasks/cron/history/route";
import { tools as route37Tools } from "../../tasks/cron/status/route";
import { tools as route38Tools } from "../../tasks/cron/stats/route";
import { tools as route39Tools } from "../../tasks/side-tasks/route";
import { tools as route40Tools } from "../../tasks/types/route";
import { tools as route41Tools } from "../../tasks/pulse/route";
import { tools as route42Tools } from "../../tasks/unified-runner/route";
import { tools as route43Tools } from "../../mcp/serve/route";
import { tools as route44Tools } from "../../ai/tools/route";
import { tools as route45Tools } from "../../cli/setup/uninstall/route";
import { tools as route46Tools } from "../../cli/setup/update/route";
import { tools as route47Tools } from "../../cli/setup/status/route";
import { tools as route48Tools } from "../../cli/setup/install/route";
import { tools as route49Tools } from "../../react-native/generate/route";
import { tools as route50Tools } from "../../../generators/generate-all/route";
import { tools as route51Tools } from "../../../generators/endpoint/route";
import { tools as route52Tools } from "../../../generators/route-handlers/route";
import { tools as route53Tools } from "../../../generators/endpoints/route";
import { tools as route54Tools } from "../../../generators/env/route";
import { tools as route55Tools } from "../../../generators/endpoints-index/route";
import { tools as route56Tools } from "../../../generators/email-templates/route";
import { tools as route57Tools } from "../../../generators/task-index/route";
import { tools as route58Tools } from "../../../generators/seeds/route";
import { tools as route59Tools } from "../../../generators/generate-trpc-router/validation/route";
import { tools as route60Tools } from "../../../../manifest/route";
import { tools as route61Tools } from "../../../../leads/lead/[id]/route";
import { tools as route62Tools } from "../../../../leads/tracking/engagement/route";
import { tools as route63Tools } from "../../../../leads/search/route";
import { tools as route64Tools } from "../../../../leads/campaigns/campaign-starter/campaign-starter-config/route";
import { tools as route65Tools } from "../../../../leads/campaigns/emails/test-mail/route";
import { tools as route66Tools } from "../../../../leads/list/route";
import { tools as route67Tools } from "../../../../leads/import/route";
import { tools as route68Tools } from "../../../../leads/export/route";
import { tools as route69Tools } from "../../../../leads/stats/route";
import { tools as route70Tools } from "../../../../leads/create/route";
import { tools as route71Tools } from "../../../../leads/batch/route";
import { tools as route72Tools } from "../../../../referral/earnings/list/route";
import { tools as route73Tools } from "../../../../referral/link-to-lead/route";
import { tools as route74Tools } from "../../../../referral/codes/list/route";
import { tools as route75Tools } from "../../../../referral/stats/route";
import { tools as route76Tools } from "../../../../users/user/[id]/route";
import { tools as route77Tools } from "../../../../users/list/route";
import { tools as route78Tools } from "../../../../users/stats/route";
import { tools as route79Tools } from "../../../../users/create/route";
import { tools as route80Tools } from "../../../../user/private/logout/route";
import { tools as route81Tools } from "../../../../user/private/me/route";
import { tools as route82Tools } from "../../../../user/public/login/options/route";
import { tools as route83Tools } from "../../../../user/public/signup/route";
import { tools as route84Tools } from "../../../../user/public/reset-password/validate/route";
import { tools as route85Tools } from "../../../../user/public/reset-password/request/route";
import { tools as route86Tools } from "../../../../user/public/reset-password/confirm/route";
import { tools as route87Tools } from "../../../../user/search/route";
import { tools as route88Tools } from "../../../../user/auth/check/route";
import { tools as route89Tools } from "../../../../subscription/route";
import { tools as route90Tools } from "../../../../payment/portal/route";
import { tools as route91Tools } from "../../../../payment/invoice/route";
import { tools as route92Tools } from "../../../../payment/providers/stripe/cli/route";
import { tools as route93Tools } from "../../../../payment/providers/nowpayments/cli/route";
import { tools as route94Tools } from "../../../../payment/checkout/route";
import { tools as route95Tools } from "../../../../payment/refund/route";
import { tools as route96Tools } from "../../../../credits/history/route";
import { tools as route97Tools } from "../../../../credits/purchase/route";
import { tools as route98Tools } from "../../../../contact/route";
import { tools as route99Tools } from "../../../../emails/smtp-client/list/route";
import { tools as route100Tools } from "../../../../emails/smtp-client/edit/[id]/route";
import { tools as route101Tools } from "../../../../emails/smtp-client/create/route";
import { tools as route102Tools } from "../../../../emails/send/route";
import { tools as route103Tools } from "../../../../emails/messages/[id]/route";
import { tools as route104Tools } from "../../../../emails/imap-client/messages/[id]/route";
import { tools as route105Tools } from "../../../../emails/imap-client/folders/list/route";
import { tools as route106Tools } from "../../../../emails/imap-client/folders/sync/route";
import { tools as route107Tools } from "../../../../emails/imap-client/config/route";
import { tools as route108Tools } from "../../../../emails/imap-client/health/route";
import { tools as route109Tools } from "../../../../emails/imap-client/sync/route";
import { tools as route110Tools } from "../../../../emails/imap-client/accounts/[id]/route";
import { tools as route111Tools } from "../../../../emails/preview/send-test/route";
import { tools as route112Tools } from "../../../../emails/preview/render/route";
import { tools as route113Tools } from "../../../../import/route";
import { tools as route114Tools } from "../../../../newsletter/unsubscribe/route";
import { tools as route115Tools } from "../../../../newsletter/subscribe/route";
import { tools as route116Tools } from "../../../../newsletter/status/route";
import { tools as route117Tools } from "../../../../browser/performance-analyze-insight/route";
import { tools as route118Tools } from "../../../../browser/get-console-message/route";
import { tools as route119Tools } from "../../../../browser/new-page/route";
import { tools as route120Tools } from "../../../../browser/take-snapshot/route";
import { tools as route121Tools } from "../../../../browser/drag/route";
import { tools as route122Tools } from "../../../../browser/get-network-request/route";
import { tools as route123Tools } from "../../../../browser/list-pages/route";
import { tools as route124Tools } from "../../../../browser/close-page/route";
import { tools as route125Tools } from "../../../../browser/resize-page/route";
import { tools as route126Tools } from "../../../../browser/fill/route";
import { tools as route127Tools } from "../../../../browser/hover/route";
import { tools as route128Tools } from "../../../../browser/upload-file/route";
import { tools as route129Tools } from "../../../../browser/handle-dialog/route";
import { tools as route130Tools } from "../../../../browser/select-page/route";
import { tools as route131Tools } from "../../../../browser/navigate-page/route";
import { tools as route132Tools } from "../../../../browser/press-key/route";
import { tools as route133Tools } from "../../../../browser/fill-form/route";
import { tools as route134Tools } from "../../../../browser/performance-stop-trace/route";
import { tools as route135Tools } from "../../../../browser/performance-start-trace/route";
import { tools as route136Tools } from "../../../../browser/emulate/route";
import { tools as route137Tools } from "../../../../browser/take-screenshot/route";
import { tools as route138Tools } from "../../../../browser/list-network-requests/route";
import { tools as route139Tools } from "../../../../browser/evaluate-script/route";
import { tools as route140Tools } from "../../../../browser/list-console-messages/route";
import { tools as route141Tools } from "../../../../browser/wait-for/route";
import { tools as route142Tools } from "../../../../browser/click/route";

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
const route142 = wrapToolsForTRPC(route142Tools);

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
    "fetch-url-content": router({ ...route11 }),
    "brave-search": router({ ...route12 }),
    "ai-stream": router({ ...route13 }),
    "text-to-speech": router({ ...route14 }),
    "speech-to-text": router({
      hotkey: router({ ...route15 }),
    }),
  }),
  system: router({
    server: router({
      dev: router({ ...route16 }),
      start: router({ ...route17 }),
      build: router({ ...route18 }),
      health: router({ ...route19 }),
    }),
    translations: router({
      reorganize: router({ ...route20 }),
      "restore-backup": router({ ...route21 }),
      stats: router({ ...route22 }),
    }),
    help: router({ ...route23 }),
    db: router({
      "schema-verify": router({ ...route24 }),
      utils: router({
        "docker-operations": router({ ...route25 }),
      }),
      "migrate-repair": router({ ...route26 }),
      "migrate-prod": router({ ...route27 }),
      seed: router({ ...route28 }),
      reset: router({ ...route29 }),
      "migrate-sync": router({ ...route30 }),
      migrate: router({ ...route31 }),
      ping: router({ ...route32 }),
      sql: router({ ...route33 }),
      studio: router({ ...route34 }),
    }),
    "unified-interface": router({
      tasks: router({
        cron: router({
          tasks: router({ ...route35 }),
          history: router({ ...route36 }),
          status: router({ ...route37 }),
          stats: router({ ...route38 }),
        }),
        "side-tasks": router({ ...route39 }),
        types: router({ ...route40 }),
        pulse: router({ ...route41 }),
        "unified-runner": router({ ...route42 }),
      }),
      mcp: router({
        serve: router({ ...route43 }),
      }),
      ai: router({
        tools: router({ ...route44 }),
      }),
      cli: router({
        setup: router({
          uninstall: router({ ...route45 }),
          update: router({ ...route46 }),
          status: router({ ...route47 }),
          install: router({ ...route48 }),
        }),
      }),
      "react-native": router({
        generate: router({ ...route49 }),
      }),
    }),
    generators: router({
      "generate-all": router({ ...route50 }),
      endpoint: router({ ...route51 }),
      "route-handlers": router({ ...route52 }),
      endpoints: router({ ...route53 }),
      env: router({ ...route54 }),
      "endpoints-index": router({ ...route55 }),
      "email-templates": router({ ...route56 }),
      "task-index": router({ ...route57 }),
      seeds: router({ ...route58 }),
      "generate-trpc-router": router({
        validation: router({ ...route59 }),
      }),
    }),
  }),
  manifest: router({ ...route60 }),
  leads: router({
    lead: router({ ...route61 }),
    tracking: router({
      engagement: router({ ...route62 }),
    }),
    search: router({ ...route63 }),
    campaigns: router({
      "campaign-starter": router({
        "campaign-starter-config": router({ ...route64 }),
      }),
      emails: router({
        "test-mail": router({ ...route65 }),
      }),
    }),
    list: router({ ...route66 }),
    import: router({ ...route67 }),
    export: router({ ...route68 }),
    stats: router({ ...route69 }),
    create: router({ ...route70 }),
    batch: router({ ...route71 }),
  }),
  referral: router({
    earnings: router({
      list: router({ ...route72 }),
    }),
    "link-to-lead": router({ ...route73 }),
    codes: router({
      list: router({ ...route74 }),
    }),
    stats: router({ ...route75 }),
  }),
  users: router({
    user: router({ ...route76 }),
    list: router({ ...route77 }),
    stats: router({ ...route78 }),
    create: router({ ...route79 }),
  }),
  user: router({
    private: router({
      logout: router({ ...route80 }),
      me: router({ ...route81 }),
    }),
    public: router({
      login: router({
        options: router({ ...route82 }),
      }),
      signup: router({ ...route83 }),
      "reset-password": router({
        validate: router({ ...route84 }),
        request: router({ ...route85 }),
        confirm: router({ ...route86 }),
      }),
    }),
    search: router({ ...route87 }),
    auth: router({
      check: router({ ...route88 }),
    }),
  }),
  subscription: router({ ...route89 }),
  payment: router({
    portal: router({ ...route90 }),
    invoice: router({ ...route91 }),
    providers: router({
      stripe: router({
        cli: router({ ...route92 }),
      }),
      nowpayments: router({
        cli: router({ ...route93 }),
      }),
    }),
    checkout: router({ ...route94 }),
    refund: router({ ...route95 }),
  }),
  credits: router({
    history: router({ ...route96 }),
    purchase: router({ ...route97 }),
  }),
  contact: router({ ...route98 }),
  emails: router({
    "smtp-client": router({
      list: router({ ...route99 }),
      edit: router({ ...route100 }),
      create: router({ ...route101 }),
    }),
    send: router({ ...route102 }),
    messages: router({ ...route103 }),
    "imap-client": router({
      messages: router({ ...route104 }),
      folders: router({
        list: router({ ...route105 }),
        sync: router({ ...route106 }),
      }),
      config: router({ ...route107 }),
      health: router({ ...route108 }),
      sync: router({ ...route109 }),
      accounts: router({ ...route110 }),
    }),
    preview: router({
      "send-test": router({ ...route111 }),
      render: router({ ...route112 }),
    }),
  }),
  import: router({ ...route113 }),
  newsletter: router({
    unsubscribe: router({ ...route114 }),
    subscribe: router({ ...route115 }),
    status: router({ ...route116 }),
  }),
  browser: router({
    "performance-analyze-insight": router({ ...route117 }),
    "get-console-message": router({ ...route118 }),
    "new-page": router({ ...route119 }),
    "take-snapshot": router({ ...route120 }),
    drag: router({ ...route121 }),
    "get-network-request": router({ ...route122 }),
    "list-pages": router({ ...route123 }),
    "close-page": router({ ...route124 }),
    "resize-page": router({ ...route125 }),
    fill: router({ ...route126 }),
    hover: router({ ...route127 }),
    "upload-file": router({ ...route128 }),
    "handle-dialog": router({ ...route129 }),
    "select-page": router({ ...route130 }),
    "navigate-page": router({ ...route131 }),
    "press-key": router({ ...route132 }),
    "fill-form": router({ ...route133 }),
    "performance-stop-trace": router({ ...route134 }),
    "performance-start-trace": router({ ...route135 }),
    emulate: router({ ...route136 }),
    "take-screenshot": router({ ...route137 }),
    "list-network-requests": router({ ...route138 }),
    "evaluate-script": router({ ...route139 }),
    "list-console-messages": router({ ...route140 }),
    "wait-for": router({ ...route141 }),
    click: router({ ...route142 }),
  }),
});

export type AppRouter = typeof appRouter;
