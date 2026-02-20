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
import { tools as route4Tools } from "../../../../agent/chat/settings/route";
import { tools as route5Tools } from "../../../../agent/chat/favorites/[id]/route";
import { tools as route6Tools } from "../../../../agent/chat/favorites/route";
import { tools as route7Tools } from "../../../../agent/chat/characters/[id]/route";
import { tools as route8Tools } from "../../../../agent/chat/characters/route";
import { tools as route9Tools } from "../../../../agent/chat/folders/[id]/route";
import { tools as route10Tools } from "../../../../agent/chat/folders/route";
import { tools as route11Tools } from "../../../../agent/chat/files/[threadId]/[filename]/route";
import { tools as route12Tools } from "../../../../agent/fetch-url-content/route";
import { tools as route13Tools } from "../../../../agent/ai-stream/route";
import { tools as route14Tools } from "../../../../agent/search/brave/route";
import { tools as route15Tools } from "../../../../agent/search/kagi/route";
import { tools as route16Tools } from "../../../../agent/text-to-speech/route";
import { tools as route17Tools } from "../../../../agent/speech-to-text/hotkey/route";
import { tools as route18Tools } from "../../../../agent/models/openrouter/route";
import { tools as route19Tools } from "../../../server/dev/route";
import { tools as route20Tools } from "../../../server/start/route";
import { tools as route21Tools } from "../../../server/build/route";
import { tools as route22Tools } from "../../../server/health/route";
import { tools as route23Tools } from "../../../guard/start/route";
import { tools as route24Tools } from "../../../guard/stop/route";
import { tools as route25Tools } from "../../../guard/status/route";
import { tools as route26Tools } from "../../../guard/destroy/route";
import { tools as route27Tools } from "../../../translations/reorganize/route";
import { tools as route28Tools } from "../../../translations/restore-backup/route";
import { tools as route29Tools } from "../../../translations/stats/route";
import { tools as route30Tools } from "../../../help/route";
import { tools as route31Tools } from "../../../db/schema-verify/route";
import { tools as route32Tools } from "../../../db/utils/docker-operations/route";
import { tools as route33Tools } from "../../../db/migrate-repair/route";
import { tools as route34Tools } from "../../../db/migrate-prod/route";
import { tools as route35Tools } from "../../../db/seed/route";
import { tools as route36Tools } from "../../../db/reset/route";
import { tools as route37Tools } from "../../../db/migrate-sync/route";
import { tools as route38Tools } from "../../../db/migrate/route";
import { tools as route39Tools } from "../../../db/ping/route";
import { tools as route40Tools } from "../../../db/sql/route";
import { tools as route41Tools } from "../../../db/studio/route";
import { tools as route42Tools } from "../../tasks/cron/tasks/route";
import { tools as route43Tools } from "../../tasks/cron/history/route";
import { tools as route44Tools } from "../../tasks/cron/stats/route";
import { tools as route45Tools } from "../../tasks/pulse/history/route";
import { tools as route46Tools } from "../../tasks/pulse/status/route";
import { tools as route47Tools } from "../../tasks/pulse/execute/route";
import { tools as route48Tools } from "../../tasks/unified-runner/route";
import { tools as route49Tools } from "../../mcp/serve/route";
import { tools as route50Tools } from "../../ai/tools/route";
import { tools as route51Tools } from "../../cli/setup/uninstall/route";
import { tools as route52Tools } from "../../cli/setup/update/route";
import { tools as route53Tools } from "../../cli/setup/status/route";
import { tools as route54Tools } from "../../cli/setup/install/route";
import { tools as route55Tools } from "../../react-native/generate/route";
import { tools as route56Tools } from "../../../check/testing/test/route";
import { tools as route57Tools } from "../../../check/vibe-check/route";
import { tools as route58Tools } from "../../../check/typecheck/route";
import { tools as route59Tools } from "../../../check/lint/route";
import { tools as route60Tools } from "../../../check/config/create/route";
import { tools as route61Tools } from "../../../check/oxlint/route";
import { tools as route62Tools } from "../../../release-tool/route";
import { tools as route63Tools } from "../../../builder/route";
import { tools as route64Tools } from "../../../generators/generate-all/route";
import { tools as route65Tools } from "../../../generators/endpoint/route";
import { tools as route66Tools } from "../../../generators/route-handlers/route";
import { tools as route67Tools } from "../../../generators/client-routes-index/route";
import { tools as route68Tools } from "../../../generators/endpoints/route";
import { tools as route69Tools } from "../../../generators/env/route";
import { tools as route70Tools } from "../../../generators/endpoints-index/route";
import { tools as route71Tools } from "../../../generators/email-templates/route";
import { tools as route72Tools } from "../../../generators/task-index/route";
import { tools as route73Tools } from "../../../generators/seeds/route";
import { tools as route74Tools } from "../../../generators/generate-trpc-router/validation/route";
import { tools as route75Tools } from "../../../../leads/lead/[id]/route";
import { tools as route76Tools } from "../../../../leads/tracking/engagement/route";
import { tools as route77Tools } from "../../../../leads/search/route";
import { tools as route78Tools } from "../../../../leads/campaigns/campaign-starter/campaign-starter-config/route";
import { tools as route79Tools } from "../../../../leads/campaigns/emails/test-mail/route";
import { tools as route80Tools } from "../../../../leads/list/route";
import { tools as route81Tools } from "../../../../leads/import/route";
import { tools as route82Tools } from "../../../../leads/export/route";
import { tools as route83Tools } from "../../../../leads/stats/route";
import { tools as route84Tools } from "../../../../leads/create/route";
import { tools as route85Tools } from "../../../../leads/batch/route";
import { tools as route86Tools } from "../../../../referral/earnings/list/route";
import { tools as route87Tools } from "../../../../referral/codes/list/route";
import { tools as route88Tools } from "../../../../referral/stats/route";
import { tools as route89Tools } from "../../../../users/view/route";
import { tools as route90Tools } from "../../../../users/user/[id]/route";
import { tools as route91Tools } from "../../../../users/list/route";
import { tools as route92Tools } from "../../../../users/stats/route";
import { tools as route93Tools } from "../../../../users/create/route";
import { tools as route94Tools } from "../../../../user/private/logout/route";
import { tools as route95Tools } from "../../../../user/private/me/route";
import { tools as route96Tools } from "../../../../user/private/sessions/[id]/route";
import { tools as route97Tools } from "../../../../user/private/sessions/route";
import { tools as route98Tools } from "../../../../user/public/login/options/route";
import { tools as route99Tools } from "../../../../user/public/signup/route";
import { tools as route100Tools } from "../../../../user/public/reset-password/validate/route";
import { tools as route101Tools } from "../../../../user/public/reset-password/request/route";
import { tools as route102Tools } from "../../../../user/public/reset-password/confirm/route";
import { tools as route103Tools } from "../../../../user/search/route";
import { tools as route104Tools } from "../../../../user/auth/check/route";
import { tools as route105Tools } from "../../../../ssh/session/read/route";
import { tools as route106Tools } from "../../../../ssh/session/close/route";
import { tools as route107Tools } from "../../../../ssh/session/write/route";
import { tools as route108Tools } from "../../../../ssh/session/open/route";
import { tools as route109Tools } from "../../../../ssh/terminal/route";
import { tools as route110Tools } from "../../../../ssh/files/read/route";
import { tools as route111Tools } from "../../../../ssh/files/list/route";
import { tools as route112Tools } from "../../../../ssh/files/write/route";
import { tools as route113Tools } from "../../../../ssh/linux/users/list/route";
import { tools as route114Tools } from "../../../../ssh/linux/users/create/route";
import { tools as route115Tools } from "../../../../ssh/exec/route";
import { tools as route116Tools } from "../../../../ssh/connections/[id]/route";
import { tools as route117Tools } from "../../../../subscription/update/route";
import { tools as route118Tools } from "../../../../subscription/cancel/route";
import { tools as route119Tools } from "../../../../subscription/create/route";
import { tools as route120Tools } from "../../../../payment/portal/route";
import { tools as route121Tools } from "../../../../payment/invoice/route";
import { tools as route122Tools } from "../../../../payment/providers/stripe/cli/route";
import { tools as route123Tools } from "../../../../payment/providers/nowpayments/cli/route";
import { tools as route124Tools } from "../../../../payment/checkout/route";
import { tools as route125Tools } from "../../../../payment/refund/route";
import { tools as route126Tools } from "../../../../credits/history/route";
import { tools as route127Tools } from "../../../../credits/purchase/route";
import { tools as route128Tools } from "../../../../contact/route";
import { tools as route129Tools } from "../../../../emails/smtp-client/list/route";
import { tools as route130Tools } from "../../../../emails/smtp-client/edit/[id]/route";
import { tools as route131Tools } from "../../../../emails/smtp-client/create/route";
import { tools as route132Tools } from "../../../../emails/send/route";
import { tools as route133Tools } from "../../../../emails/messages/[id]/route";
import { tools as route134Tools } from "../../../../emails/imap-client/messages/bulk/route";
import { tools as route135Tools } from "../../../../emails/imap-client/messages/compose/route";
import { tools as route136Tools } from "../../../../emails/imap-client/messages/list/route";
import { tools as route137Tools } from "../../../../emails/imap-client/messages/sync/route";
import { tools as route138Tools } from "../../../../emails/imap-client/folders/list/route";
import { tools as route139Tools } from "../../../../emails/imap-client/folders/sync/route";
import { tools as route140Tools } from "../../../../emails/imap-client/config/route";
import { tools as route141Tools } from "../../../../emails/imap-client/health/route";
import { tools as route142Tools } from "../../../../emails/imap-client/sync/route";
import { tools as route143Tools } from "../../../../emails/imap-client/accounts/[id]/route";
import { tools as route144Tools } from "../../../../emails/preview/send-test/route";
import { tools as route145Tools } from "../../../../emails/preview/render/route";
import { tools as route146Tools } from "../../../../emails/messaging/accounts/list/route";
import { tools as route147Tools } from "../../../../emails/messaging/accounts/edit/[id]/route";
import { tools as route148Tools } from "../../../../emails/messaging/accounts/create/route";
import { tools as route149Tools } from "../../../../import/route";
import { tools as route150Tools } from "../../../../newsletter/unsubscribe/route";
import { tools as route151Tools } from "../../../../newsletter/subscribe/route";
import { tools as route152Tools } from "../../../../newsletter/status/route";
import { tools as route153Tools } from "../../../../browser/performance-analyze-insight/route";
import { tools as route154Tools } from "../../../../browser/get-console-message/route";
import { tools as route155Tools } from "../../../../browser/new-page/route";
import { tools as route156Tools } from "../../../../browser/take-snapshot/route";
import { tools as route157Tools } from "../../../../browser/drag/route";
import { tools as route158Tools } from "../../../../browser/get-network-request/route";
import { tools as route159Tools } from "../../../../browser/list-pages/route";
import { tools as route160Tools } from "../../../../browser/close-page/route";
import { tools as route161Tools } from "../../../../browser/resize-page/route";
import { tools as route162Tools } from "../../../../browser/fill/route";
import { tools as route163Tools } from "../../../../browser/hover/route";
import { tools as route164Tools } from "../../../../browser/upload-file/route";
import { tools as route165Tools } from "../../../../browser/handle-dialog/route";
import { tools as route166Tools } from "../../../../browser/select-page/route";
import { tools as route167Tools } from "../../../../browser/navigate-page/route";
import { tools as route168Tools } from "../../../../browser/press-key/route";
import { tools as route169Tools } from "../../../../browser/fill-form/route";
import { tools as route170Tools } from "../../../../browser/performance-stop-trace/route";
import { tools as route171Tools } from "../../../../browser/performance-start-trace/route";
import { tools as route172Tools } from "../../../../browser/emulate/route";
import { tools as route173Tools } from "../../../../browser/take-screenshot/route";
import { tools as route174Tools } from "../../../../browser/list-network-requests/route";
import { tools as route175Tools } from "../../../../browser/evaluate-script/route";
import { tools as route176Tools } from "../../../../browser/list-console-messages/route";
import { tools as route177Tools } from "../../../../browser/wait-for/route";
import { tools as route178Tools } from "../../../../browser/click/route";

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
const route143 = wrapToolsForTRPC(route143Tools);
const route144 = wrapToolsForTRPC(route144Tools);
const route145 = wrapToolsForTRPC(route145Tools);
const route146 = wrapToolsForTRPC(route146Tools);
const route147 = wrapToolsForTRPC(route147Tools);
const route148 = wrapToolsForTRPC(route148Tools);
const route149 = wrapToolsForTRPC(route149Tools);
const route150 = wrapToolsForTRPC(route150Tools);
const route151 = wrapToolsForTRPC(route151Tools);
const route152 = wrapToolsForTRPC(route152Tools);
const route153 = wrapToolsForTRPC(route153Tools);
const route154 = wrapToolsForTRPC(route154Tools);
const route155 = wrapToolsForTRPC(route155Tools);
const route156 = wrapToolsForTRPC(route156Tools);
const route157 = wrapToolsForTRPC(route157Tools);
const route158 = wrapToolsForTRPC(route158Tools);
const route159 = wrapToolsForTRPC(route159Tools);
const route160 = wrapToolsForTRPC(route160Tools);
const route161 = wrapToolsForTRPC(route161Tools);
const route162 = wrapToolsForTRPC(route162Tools);
const route163 = wrapToolsForTRPC(route163Tools);
const route164 = wrapToolsForTRPC(route164Tools);
const route165 = wrapToolsForTRPC(route165Tools);
const route166 = wrapToolsForTRPC(route166Tools);
const route167 = wrapToolsForTRPC(route167Tools);
const route168 = wrapToolsForTRPC(route168Tools);
const route169 = wrapToolsForTRPC(route169Tools);
const route170 = wrapToolsForTRPC(route170Tools);
const route171 = wrapToolsForTRPC(route171Tools);
const route172 = wrapToolsForTRPC(route172Tools);
const route173 = wrapToolsForTRPC(route173Tools);
const route174 = wrapToolsForTRPC(route174Tools);
const route175 = wrapToolsForTRPC(route175Tools);
const route176 = wrapToolsForTRPC(route176Tools);
const route177 = wrapToolsForTRPC(route177Tools);
const route178 = wrapToolsForTRPC(route178Tools);

export const appRouter = router({
  agent: router({
    chat: router({
      threads: router({ ...route0, ...route1 }),
      memories: router({ ...route2, ...route3 }),
      settings: router({ ...route4 }),
      favorites: router({ ...route5, ...route6 }),
      characters: router({ ...route7, ...route8 }),
      folders: router({ ...route9, ...route10 }),
      files: router({ ...route11 }),
    }),
    "fetch-url-content": router({ ...route12 }),
    "ai-stream": router({ ...route13 }),
    search: router({
      brave: router({ ...route14 }),
      kagi: router({ ...route15 }),
    }),
    "text-to-speech": router({ ...route16 }),
    "speech-to-text": router({
      hotkey: router({ ...route17 }),
    }),
    models: router({
      openrouter: router({ ...route18 }),
    }),
  }),
  system: router({
    server: router({
      dev: router({ ...route19 }),
      start: router({ ...route20 }),
      build: router({ ...route21 }),
      health: router({ ...route22 }),
    }),
    guard: router({
      start: router({ ...route23 }),
      stop: router({ ...route24 }),
      status: router({ ...route25 }),
      destroy: router({ ...route26 }),
    }),
    translations: router({
      reorganize: router({ ...route27 }),
      "restore-backup": router({ ...route28 }),
      stats: router({ ...route29 }),
    }),
    help: router({ ...route30 }),
    db: router({
      "schema-verify": router({ ...route31 }),
      utils: router({
        "docker-operations": router({ ...route32 }),
      }),
      "migrate-repair": router({ ...route33 }),
      "migrate-prod": router({ ...route34 }),
      seed: router({ ...route35 }),
      reset: router({ ...route36 }),
      "migrate-sync": router({ ...route37 }),
      migrate: router({ ...route38 }),
      ping: router({ ...route39 }),
      sql: router({ ...route40 }),
      studio: router({ ...route41 }),
    }),
    "unified-interface": router({
      tasks: router({
        cron: router({
          tasks: router({ ...route42 }),
          history: router({ ...route43 }),
          stats: router({ ...route44 }),
        }),
        pulse: router({
          history: router({ ...route45 }),
          status: router({ ...route46 }),
          execute: router({ ...route47 }),
        }),
        "unified-runner": router({ ...route48 }),
      }),
      mcp: router({
        serve: router({ ...route49 }),
      }),
      ai: router({
        tools: router({ ...route50 }),
      }),
      cli: router({
        setup: router({
          uninstall: router({ ...route51 }),
          update: router({ ...route52 }),
          status: router({ ...route53 }),
          install: router({ ...route54 }),
        }),
      }),
      "react-native": router({
        generate: router({ ...route55 }),
      }),
    }),
    check: router({
      testing: router({
        test: router({ ...route56 }),
      }),
      "vibe-check": router({ ...route57 }),
      typecheck: router({ ...route58 }),
      lint: router({ ...route59 }),
      config: router({
        create: router({ ...route60 }),
      }),
      oxlint: router({ ...route61 }),
    }),
    "release-tool": router({ ...route62 }),
    builder: router({ ...route63 }),
    generators: router({
      "generate-all": router({ ...route64 }),
      endpoint: router({ ...route65 }),
      "route-handlers": router({ ...route66 }),
      "client-routes-index": router({ ...route67 }),
      endpoints: router({ ...route68 }),
      env: router({ ...route69 }),
      "endpoints-index": router({ ...route70 }),
      "email-templates": router({ ...route71 }),
      "task-index": router({ ...route72 }),
      seeds: router({ ...route73 }),
      "generate-trpc-router": router({
        validation: router({ ...route74 }),
      }),
    }),
  }),
  leads: router({
    lead: router({ ...route75 }),
    tracking: router({
      engagement: router({ ...route76 }),
    }),
    search: router({ ...route77 }),
    campaigns: router({
      "campaign-starter": router({
        "campaign-starter-config": router({ ...route78 }),
      }),
      emails: router({
        "test-mail": router({ ...route79 }),
      }),
    }),
    list: router({ ...route80 }),
    import: router({ ...route81 }),
    export: router({ ...route82 }),
    stats: router({ ...route83 }),
    create: router({ ...route84 }),
    batch: router({ ...route85 }),
  }),
  referral: router({
    earnings: router({
      list: router({ ...route86 }),
    }),
    codes: router({
      list: router({ ...route87 }),
    }),
    stats: router({ ...route88 }),
  }),
  users: router({
    view: router({ ...route89 }),
    user: router({ ...route90 }),
    list: router({ ...route91 }),
    stats: router({ ...route92 }),
    create: router({ ...route93 }),
  }),
  user: router({
    private: router({
      logout: router({ ...route94 }),
      me: router({ ...route95 }),
      sessions: router({ ...route96, ...route97 }),
    }),
    public: router({
      login: router({
        options: router({ ...route98 }),
      }),
      signup: router({ ...route99 }),
      "reset-password": router({
        validate: router({ ...route100 }),
        request: router({ ...route101 }),
        confirm: router({ ...route102 }),
      }),
    }),
    search: router({ ...route103 }),
    auth: router({
      check: router({ ...route104 }),
    }),
  }),
  ssh: router({
    session: router({
      read: router({ ...route105 }),
      close: router({ ...route106 }),
      write: router({ ...route107 }),
      open: router({ ...route108 }),
    }),
    terminal: router({ ...route109 }),
    files: router({
      read: router({ ...route110 }),
      list: router({ ...route111 }),
      write: router({ ...route112 }),
    }),
    linux: router({
      users: router({
        list: router({ ...route113 }),
        create: router({ ...route114 }),
      }),
    }),
    exec: router({ ...route115 }),
    connections: router({ ...route116 }),
  }),
  subscription: router({
    update: router({ ...route117 }),
    cancel: router({ ...route118 }),
    create: router({ ...route119 }),
  }),
  payment: router({
    portal: router({ ...route120 }),
    invoice: router({ ...route121 }),
    providers: router({
      stripe: router({
        cli: router({ ...route122 }),
      }),
      nowpayments: router({
        cli: router({ ...route123 }),
      }),
    }),
    checkout: router({ ...route124 }),
    refund: router({ ...route125 }),
  }),
  credits: router({
    history: router({ ...route126 }),
    purchase: router({ ...route127 }),
  }),
  contact: router({ ...route128 }),
  emails: router({
    "smtp-client": router({
      list: router({ ...route129 }),
      edit: router({ ...route130 }),
      create: router({ ...route131 }),
    }),
    send: router({ ...route132 }),
    messages: router({ ...route133 }),
    "imap-client": router({
      messages: router({
        bulk: router({ ...route134 }),
        compose: router({ ...route135 }),
        list: router({ ...route136 }),
        sync: router({ ...route137 }),
      }),
      folders: router({
        list: router({ ...route138 }),
        sync: router({ ...route139 }),
      }),
      config: router({ ...route140 }),
      health: router({ ...route141 }),
      sync: router({ ...route142 }),
      accounts: router({ ...route143 }),
    }),
    preview: router({
      "send-test": router({ ...route144 }),
      render: router({ ...route145 }),
    }),
    messaging: router({
      accounts: router({
        list: router({ ...route146 }),
        edit: router({ ...route147 }),
        create: router({ ...route148 }),
      }),
    }),
  }),
  import: router({ ...route149 }),
  newsletter: router({
    unsubscribe: router({ ...route150 }),
    subscribe: router({ ...route151 }),
    status: router({ ...route152 }),
  }),
  browser: router({
    "performance-analyze-insight": router({ ...route153 }),
    "get-console-message": router({ ...route154 }),
    "new-page": router({ ...route155 }),
    "take-snapshot": router({ ...route156 }),
    drag: router({ ...route157 }),
    "get-network-request": router({ ...route158 }),
    "list-pages": router({ ...route159 }),
    "close-page": router({ ...route160 }),
    "resize-page": router({ ...route161 }),
    fill: router({ ...route162 }),
    hover: router({ ...route163 }),
    "upload-file": router({ ...route164 }),
    "handle-dialog": router({ ...route165 }),
    "select-page": router({ ...route166 }),
    "navigate-page": router({ ...route167 }),
    "press-key": router({ ...route168 }),
    "fill-form": router({ ...route169 }),
    "performance-stop-trace": router({ ...route170 }),
    "performance-start-trace": router({ ...route171 }),
    emulate: router({ ...route172 }),
    "take-screenshot": router({ ...route173 }),
    "list-network-requests": router({ ...route174 }),
    "evaluate-script": router({ ...route175 }),
    "list-console-messages": router({ ...route176 }),
    "wait-for": router({ ...route177 }),
    click: router({ ...route178 }),
  }),
});

export type AppRouter = typeof appRouter;
