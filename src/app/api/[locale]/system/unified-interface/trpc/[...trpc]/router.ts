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
import { tools as route48Tools } from "../../tasks/task-sync/route";
import { tools as route49Tools } from "../../tasks/claude-code/route";
import { tools as route50Tools } from "../../tasks/unified-runner/route";
import { tools as route51Tools } from "../../tasks/db-health/route";
import { tools as route52Tools } from "../../mcp/serve/route";
import { tools as route53Tools } from "../../cli/setup/uninstall/route";
import { tools as route54Tools } from "../../cli/setup/update/route";
import { tools as route55Tools } from "../../cli/setup/status/route";
import { tools as route56Tools } from "../../cli/setup/install/route";
import { tools as route57Tools } from "../../react-native/generate/route";
import { tools as route58Tools } from "../../../check/testing/test/route";
import { tools as route59Tools } from "../../../check/vibe-check/route";
import { tools as route60Tools } from "../../../check/typecheck/route";
import { tools as route61Tools } from "../../../check/lint/route";
import { tools as route62Tools } from "../../../check/config/create/route";
import { tools as route63Tools } from "../../../check/oxlint/route";
import { tools as route64Tools } from "../../../release-tool/route";
import { tools as route65Tools } from "../../../builder/route";
import { tools as route66Tools } from "../../../generators/generate-all/route";
import { tools as route67Tools } from "../../../generators/endpoint/route";
import { tools as route68Tools } from "../../../generators/route-handlers/route";
import { tools as route69Tools } from "../../../generators/client-routes-index/route";
import { tools as route70Tools } from "../../../generators/endpoints/route";
import { tools as route71Tools } from "../../../generators/env/route";
import { tools as route72Tools } from "../../../generators/endpoints-index/route";
import { tools as route73Tools } from "../../../generators/email-templates/route";
import { tools as route74Tools } from "../../../generators/task-index/route";
import { tools as route75Tools } from "../../../generators/seeds/route";
import { tools as route76Tools } from "../../../generators/generate-trpc-router/validation/route";
import { tools as route77Tools } from "../../../../leads/lead/[id]/route";
import { tools as route78Tools } from "../../../../leads/tracking/engagement/route";
import { tools as route79Tools } from "../../../../leads/search/route";
import { tools as route80Tools } from "../../../../leads/campaigns/campaign-starter/campaign-starter-config/route";
import { tools as route81Tools } from "../../../../leads/campaigns/email-campaigns/route";
import { tools as route82Tools } from "../../../../leads/campaigns/emails/test-mail/route";
import { tools as route83Tools } from "../../../../leads/list/route";
import { tools as route84Tools } from "../../../../leads/import/process/route";
import { tools as route85Tools } from "../../../../leads/import/jobs/[jobId]/route";
import { tools as route86Tools } from "../../../../leads/import/status/route";
import { tools as route87Tools } from "../../../../leads/export/route";
import { tools as route88Tools } from "../../../../leads/stats/route";
import { tools as route89Tools } from "../../../../leads/create/route";
import { tools as route90Tools } from "../../../../leads/batch/route";
import { tools as route91Tools } from "../../../../referral/earnings/list/route";
import { tools as route92Tools } from "../../../../referral/codes/list/route";
import { tools as route93Tools } from "../../../../referral/stats/route";
import { tools as route94Tools } from "../../../../users/view/route";
import { tools as route95Tools } from "../../../../users/user/[id]/route";
import { tools as route96Tools } from "../../../../users/list/route";
import { tools as route97Tools } from "../../../../users/stats/route";
import { tools as route98Tools } from "../../../../users/create/route";
import { tools as route99Tools } from "../../../../user/private/logout/route";
import { tools as route100Tools } from "../../../../user/private/me/route";
import { tools as route101Tools } from "../../../../user/private/sessions/[id]/route";
import { tools as route102Tools } from "../../../../user/private/sessions/route";
import { tools as route103Tools } from "../../../../user/public/login/options/route";
import { tools as route104Tools } from "../../../../user/public/signup/route";
import { tools as route105Tools } from "../../../../user/public/reset-password/validate/route";
import { tools as route106Tools } from "../../../../user/public/reset-password/request/route";
import { tools as route107Tools } from "../../../../user/public/reset-password/confirm/route";
import { tools as route108Tools } from "../../../../user/search/route";
import { tools as route109Tools } from "../../../../user/session-cleanup/route";
import { tools as route110Tools } from "../../../../user/auth/check/route";
import { tools as route111Tools } from "../../../../ssh/session/read/route";
import { tools as route112Tools } from "../../../../ssh/session/close/route";
import { tools as route113Tools } from "../../../../ssh/session/write/route";
import { tools as route114Tools } from "../../../../ssh/session/open/route";
import { tools as route115Tools } from "../../../../ssh/terminal/route";
import { tools as route116Tools } from "../../../../ssh/files/read/route";
import { tools as route117Tools } from "../../../../ssh/files/list/route";
import { tools as route118Tools } from "../../../../ssh/files/write/route";
import { tools as route119Tools } from "../../../../ssh/linux/users/list/route";
import { tools as route120Tools } from "../../../../ssh/linux/users/create/route";
import { tools as route121Tools } from "../../../../ssh/exec/route";
import { tools as route122Tools } from "../../../../ssh/connections/[id]/route";
import { tools as route123Tools } from "../../../../subscription/update/route";
import { tools as route124Tools } from "../../../../subscription/cancel/route";
import { tools as route125Tools } from "../../../../subscription/create/route";
import { tools as route126Tools } from "../../../../payment/portal/route";
import { tools as route127Tools } from "../../../../payment/invoice/route";
import { tools as route128Tools } from "../../../../payment/providers/stripe/cli/route";
import { tools as route129Tools } from "../../../../payment/providers/nowpayments/cli/route";
import { tools as route130Tools } from "../../../../payment/checkout/route";
import { tools as route131Tools } from "../../../../payment/refund/route";
import { tools as route132Tools } from "../../../../credits/history/route";
import { tools as route133Tools } from "../../../../credits/expire/route";
import { tools as route134Tools } from "../../../../credits/purchase/route";
import { tools as route135Tools } from "../../../../contact/route";
import { tools as route136Tools } from "../../../../emails/smtp-client/list/route";
import { tools as route137Tools } from "../../../../emails/smtp-client/edit/[id]/route";
import { tools as route138Tools } from "../../../../emails/smtp-client/create/route";
import { tools as route139Tools } from "../../../../emails/send/route";
import { tools as route140Tools } from "../../../../emails/messages/[id]/route";
import { tools as route141Tools } from "../../../../emails/imap-client/messages/bulk/route";
import { tools as route142Tools } from "../../../../emails/imap-client/messages/compose/route";
import { tools as route143Tools } from "../../../../emails/imap-client/messages/list/route";
import { tools as route144Tools } from "../../../../emails/imap-client/messages/sync/route";
import { tools as route145Tools } from "../../../../emails/imap-client/folders/list/route";
import { tools as route146Tools } from "../../../../emails/imap-client/folders/sync/route";
import { tools as route147Tools } from "../../../../emails/imap-client/config/route";
import { tools as route148Tools } from "../../../../emails/imap-client/health/route";
import { tools as route149Tools } from "../../../../emails/imap-client/sync/route";
import { tools as route150Tools } from "../../../../emails/imap-client/accounts/[id]/route";
import { tools as route151Tools } from "../../../../emails/preview/send-test/route";
import { tools as route152Tools } from "../../../../emails/preview/render/route";
import { tools as route153Tools } from "../../../../emails/messaging/accounts/list/route";
import { tools as route154Tools } from "../../../../emails/messaging/accounts/edit/[id]/route";
import { tools as route155Tools } from "../../../../emails/messaging/accounts/create/route";
import { tools as route156Tools } from "../../../../import/route";
import { tools as route157Tools } from "../../../../newsletter/unsubscribe/route";
import { tools as route158Tools } from "../../../../newsletter/subscribe/route";
import { tools as route159Tools } from "../../../../newsletter/status/route";
import { tools as route160Tools } from "../../../../browser/performance-analyze-insight/route";
import { tools as route161Tools } from "../../../../browser/get-console-message/route";
import { tools as route162Tools } from "../../../../browser/new-page/route";
import { tools as route163Tools } from "../../../../browser/take-snapshot/route";
import { tools as route164Tools } from "../../../../browser/drag/route";
import { tools as route165Tools } from "../../../../browser/get-network-request/route";
import { tools as route166Tools } from "../../../../browser/list-pages/route";
import { tools as route167Tools } from "../../../../browser/close-page/route";
import { tools as route168Tools } from "../../../../browser/resize-page/route";
import { tools as route169Tools } from "../../../../browser/fill/route";
import { tools as route170Tools } from "../../../../browser/hover/route";
import { tools as route171Tools } from "../../../../browser/upload-file/route";
import { tools as route172Tools } from "../../../../browser/handle-dialog/route";
import { tools as route173Tools } from "../../../../browser/select-page/route";
import { tools as route174Tools } from "../../../../browser/navigate-page/route";
import { tools as route175Tools } from "../../../../browser/press-key/route";
import { tools as route176Tools } from "../../../../browser/fill-form/route";
import { tools as route177Tools } from "../../../../browser/performance-stop-trace/route";
import { tools as route178Tools } from "../../../../browser/performance-start-trace/route";
import { tools as route179Tools } from "../../../../browser/emulate/route";
import { tools as route180Tools } from "../../../../browser/take-screenshot/route";
import { tools as route181Tools } from "../../../../browser/list-network-requests/route";
import { tools as route182Tools } from "../../../../browser/evaluate-script/route";
import { tools as route183Tools } from "../../../../browser/list-console-messages/route";
import { tools as route184Tools } from "../../../../browser/wait-for/route";
import { tools as route185Tools } from "../../../../browser/click/route";

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
const route179 = wrapToolsForTRPC(route179Tools);
const route180 = wrapToolsForTRPC(route180Tools);
const route181 = wrapToolsForTRPC(route181Tools);
const route182 = wrapToolsForTRPC(route182Tools);
const route183 = wrapToolsForTRPC(route183Tools);
const route184 = wrapToolsForTRPC(route184Tools);
const route185 = wrapToolsForTRPC(route185Tools);

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
        "task-sync": router({ ...route48 }),
        "claude-code": router({ ...route49 }),
        "unified-runner": router({ ...route50 }),
        "db-health": router({ ...route51 }),
      }),
      mcp: router({
        serve: router({ ...route52 }),
      }),
      cli: router({
        setup: router({
          uninstall: router({ ...route53 }),
          update: router({ ...route54 }),
          status: router({ ...route55 }),
          install: router({ ...route56 }),
        }),
      }),
      "react-native": router({
        generate: router({ ...route57 }),
      }),
    }),
    check: router({
      testing: router({
        test: router({ ...route58 }),
      }),
      "vibe-check": router({ ...route59 }),
      typecheck: router({ ...route60 }),
      lint: router({ ...route61 }),
      config: router({
        create: router({ ...route62 }),
      }),
      oxlint: router({ ...route63 }),
    }),
    "release-tool": router({ ...route64 }),
    builder: router({ ...route65 }),
    generators: router({
      "generate-all": router({ ...route66 }),
      endpoint: router({ ...route67 }),
      "route-handlers": router({ ...route68 }),
      "client-routes-index": router({ ...route69 }),
      endpoints: router({ ...route70 }),
      env: router({ ...route71 }),
      "endpoints-index": router({ ...route72 }),
      "email-templates": router({ ...route73 }),
      "task-index": router({ ...route74 }),
      seeds: router({ ...route75 }),
      "generate-trpc-router": router({
        validation: router({ ...route76 }),
      }),
    }),
  }),
  leads: router({
    lead: router({ ...route77 }),
    tracking: router({
      engagement: router({ ...route78 }),
    }),
    search: router({ ...route79 }),
    campaigns: router({
      "campaign-starter": router({
        "campaign-starter-config": router({ ...route80 }),
      }),
      "email-campaigns": router({ ...route81 }),
      emails: router({
        "test-mail": router({ ...route82 }),
      }),
    }),
    list: router({ ...route83 }),
    import: router({
      process: router({ ...route84 }),
      jobs: router({ ...route85 }),
      status: router({ ...route86 }),
    }),
    export: router({ ...route87 }),
    stats: router({ ...route88 }),
    create: router({ ...route89 }),
    batch: router({ ...route90 }),
  }),
  referral: router({
    earnings: router({
      list: router({ ...route91 }),
    }),
    codes: router({
      list: router({ ...route92 }),
    }),
    stats: router({ ...route93 }),
  }),
  users: router({
    view: router({ ...route94 }),
    user: router({ ...route95 }),
    list: router({ ...route96 }),
    stats: router({ ...route97 }),
    create: router({ ...route98 }),
  }),
  user: router({
    private: router({
      logout: router({ ...route99 }),
      me: router({ ...route100 }),
      sessions: router({ ...route101, ...route102 }),
    }),
    public: router({
      login: router({
        options: router({ ...route103 }),
      }),
      signup: router({ ...route104 }),
      "reset-password": router({
        validate: router({ ...route105 }),
        request: router({ ...route106 }),
        confirm: router({ ...route107 }),
      }),
    }),
    search: router({ ...route108 }),
    "session-cleanup": router({ ...route109 }),
    auth: router({
      check: router({ ...route110 }),
    }),
  }),
  ssh: router({
    session: router({
      read: router({ ...route111 }),
      close: router({ ...route112 }),
      write: router({ ...route113 }),
      open: router({ ...route114 }),
    }),
    terminal: router({ ...route115 }),
    files: router({
      read: router({ ...route116 }),
      list: router({ ...route117 }),
      write: router({ ...route118 }),
    }),
    linux: router({
      users: router({
        list: router({ ...route119 }),
        create: router({ ...route120 }),
      }),
    }),
    exec: router({ ...route121 }),
    connections: router({ ...route122 }),
  }),
  subscription: router({
    update: router({ ...route123 }),
    cancel: router({ ...route124 }),
    create: router({ ...route125 }),
  }),
  payment: router({
    portal: router({ ...route126 }),
    invoice: router({ ...route127 }),
    providers: router({
      stripe: router({
        cli: router({ ...route128 }),
      }),
      nowpayments: router({
        cli: router({ ...route129 }),
      }),
    }),
    checkout: router({ ...route130 }),
    refund: router({ ...route131 }),
  }),
  credits: router({
    history: router({ ...route132 }),
    expire: router({ ...route133 }),
    purchase: router({ ...route134 }),
  }),
  contact: router({ ...route135 }),
  emails: router({
    "smtp-client": router({
      list: router({ ...route136 }),
      edit: router({ ...route137 }),
      create: router({ ...route138 }),
    }),
    send: router({ ...route139 }),
    messages: router({ ...route140 }),
    "imap-client": router({
      messages: router({
        bulk: router({ ...route141 }),
        compose: router({ ...route142 }),
        list: router({ ...route143 }),
        sync: router({ ...route144 }),
      }),
      folders: router({
        list: router({ ...route145 }),
        sync: router({ ...route146 }),
      }),
      config: router({ ...route147 }),
      health: router({ ...route148 }),
      sync: router({ ...route149 }),
      accounts: router({ ...route150 }),
    }),
    preview: router({
      "send-test": router({ ...route151 }),
      render: router({ ...route152 }),
    }),
    messaging: router({
      accounts: router({
        list: router({ ...route153 }),
        edit: router({ ...route154 }),
        create: router({ ...route155 }),
      }),
    }),
  }),
  import: router({ ...route156 }),
  newsletter: router({
    unsubscribe: router({ ...route157 }),
    subscribe: router({ ...route158 }),
    status: router({ ...route159 }),
  }),
  browser: router({
    "performance-analyze-insight": router({ ...route160 }),
    "get-console-message": router({ ...route161 }),
    "new-page": router({ ...route162 }),
    "take-snapshot": router({ ...route163 }),
    drag: router({ ...route164 }),
    "get-network-request": router({ ...route165 }),
    "list-pages": router({ ...route166 }),
    "close-page": router({ ...route167 }),
    "resize-page": router({ ...route168 }),
    fill: router({ ...route169 }),
    hover: router({ ...route170 }),
    "upload-file": router({ ...route171 }),
    "handle-dialog": router({ ...route172 }),
    "select-page": router({ ...route173 }),
    "navigate-page": router({ ...route174 }),
    "press-key": router({ ...route175 }),
    "fill-form": router({ ...route176 }),
    "performance-stop-trace": router({ ...route177 }),
    "performance-start-trace": router({ ...route178 }),
    emulate: router({ ...route179 }),
    "take-screenshot": router({ ...route180 }),
    "list-network-requests": router({ ...route181 }),
    "evaluate-script": router({ ...route182 }),
    "list-console-messages": router({ ...route183 }),
    "wait-for": router({ ...route184 }),
    click: router({ ...route185 }),
  }),
});

export type AppRouter = typeof appRouter;
