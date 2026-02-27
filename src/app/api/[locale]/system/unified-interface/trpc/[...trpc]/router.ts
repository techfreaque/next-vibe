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
import { tools as route4Tools } from "../../../../agent/chat/messages/search/route";
import { tools as route5Tools } from "../../../../agent/chat/settings/route";
import { tools as route6Tools } from "../../../../agent/chat/favorites/[id]/route";
import { tools as route7Tools } from "../../../../agent/chat/favorites/route";
import { tools as route8Tools } from "../../../../agent/chat/characters/[id]/route";
import { tools as route9Tools } from "../../../../agent/chat/characters/route";
import { tools as route10Tools } from "../../../../agent/chat/folders/[id]/route";
import { tools as route11Tools } from "../../../../agent/chat/folders/route";
import { tools as route12Tools } from "../../../../agent/chat/files/[threadId]/[filename]/route";
import { tools as route13Tools } from "../../../../agent/fetch-url-content/route";
import { tools as route14Tools } from "../../../../agent/ai-stream/route";
import { tools as route15Tools } from "../../../../agent/search/brave/route";
import { tools as route16Tools } from "../../../../agent/search/kagi/route";
import { tools as route17Tools } from "../../../../agent/claude-code/route";
import { tools as route18Tools } from "../../../../agent/text-to-speech/route";
import { tools as route19Tools } from "../../../../agent/speech-to-text/hotkey/route";
import { tools as route20Tools } from "../../../../agent/models/openrouter/route";
import { tools as route21Tools } from "../../../server/rebuild/route";
import { tools as route22Tools } from "../../../server/dev/route";
import { tools as route23Tools } from "../../../server/start/route";
import { tools as route24Tools } from "../../../server/build/route";
import { tools as route25Tools } from "../../../server/health/route";
import { tools as route26Tools } from "../../../guard/start/route";
import { tools as route27Tools } from "../../../guard/stop/route";
import { tools as route28Tools } from "../../../guard/status/route";
import { tools as route29Tools } from "../../../guard/destroy/route";
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
import { tools as route45Tools } from "../../tasks/cron/dashboard/route";
import { tools as route46Tools } from "../../tasks/error-monitor/route";
import { tools as route47Tools } from "../../tasks/pulse/history/route";
import { tools as route48Tools } from "../../tasks/pulse/status/route";
import { tools as route49Tools } from "../../tasks/pulse/execute/route";
import { tools as route50Tools } from "../../tasks/task-sync/report/route";
import { tools as route51Tools } from "../../tasks/task-sync/pull/route";
import { tools as route52Tools } from "../../tasks/complete-task/route";
import { tools as route53Tools } from "../../tasks/unified-runner/route";
import { tools as route54Tools } from "../../tasks/db-health/route";
import { tools as route55Tools } from "../../mcp/serve/route";
import { tools as route56Tools } from "../../ai/execute-tool/route";
import { tools as route57Tools } from "../../cli/setup/uninstall/route";
import { tools as route58Tools } from "../../cli/setup/update/route";
import { tools as route59Tools } from "../../cli/setup/status/route";
import { tools as route60Tools } from "../../cli/setup/install/route";
import { tools as route61Tools } from "../../react-native/generate/route";
import { tools as route62Tools } from "../../../check/testing/test/route";
import { tools as route63Tools } from "../../../check/vibe-check/route";
import { tools as route64Tools } from "../../../check/typecheck/route";
import { tools as route65Tools } from "../../../check/lint/route";
import { tools as route66Tools } from "../../../check/config/create/route";
import { tools as route67Tools } from "../../../check/oxlint/route";
import { tools as route68Tools } from "../../../release-tool/route";
import { tools as route69Tools } from "../../../builder/route";
import { tools as route70Tools } from "../../../generators/generate-all/route";
import { tools as route71Tools } from "../../../generators/endpoint/route";
import { tools as route72Tools } from "../../../generators/route-handlers/route";
import { tools as route73Tools } from "../../../generators/client-routes-index/route";
import { tools as route74Tools } from "../../../generators/endpoints/route";
import { tools as route75Tools } from "../../../generators/env/route";
import { tools as route76Tools } from "../../../generators/endpoints-index/route";
import { tools as route77Tools } from "../../../generators/email-templates/route";
import { tools as route78Tools } from "../../../generators/task-index/route";
import { tools as route79Tools } from "../../../generators/seeds/route";
import { tools as route80Tools } from "../../../generators/generate-trpc-router/validation/route";
import { tools as route81Tools } from "../../../../leads/lead/[id]/route";
import { tools as route82Tools } from "../../../../leads/tracking/engagement/route";
import { tools as route83Tools } from "../../../../leads/search/route";
import { tools as route84Tools } from "../../../../leads/campaigns/campaign-starter/campaign-starter-config/route";
import { tools as route85Tools } from "../../../../leads/campaigns/email-campaigns/route";
import { tools as route86Tools } from "../../../../leads/campaigns/emails/test-mail/route";
import { tools as route87Tools } from "../../../../leads/list/route";
import { tools as route88Tools } from "../../../../leads/import/process/route";
import { tools as route89Tools } from "../../../../leads/import/jobs/[jobId]/route";
import { tools as route90Tools } from "../../../../leads/import/status/route";
import { tools as route91Tools } from "../../../../leads/export/route";
import { tools as route92Tools } from "../../../../leads/stats/route";
import { tools as route93Tools } from "../../../../leads/create/route";
import { tools as route94Tools } from "../../../../leads/batch/route";
import { tools as route95Tools } from "../../../../referral/earnings/list/route";
import { tools as route96Tools } from "../../../../referral/codes/list/route";
import { tools as route97Tools } from "../../../../referral/stats/route";
import { tools as route98Tools } from "../../../../users/view/route";
import { tools as route99Tools } from "../../../../users/user/[id]/route";
import { tools as route100Tools } from "../../../../users/list/route";
import { tools as route101Tools } from "../../../../users/stats/route";
import { tools as route102Tools } from "../../../../users/create/route";
import { tools as route103Tools } from "../../../../user/private/logout/route";
import { tools as route104Tools } from "../../../../user/private/me/route";
import { tools as route105Tools } from "../../../../user/private/sessions/[id]/route";
import { tools as route106Tools } from "../../../../user/private/sessions/route";
import { tools as route107Tools } from "../../../../user/public/login/options/route";
import { tools as route108Tools } from "../../../../user/public/signup/route";
import { tools as route109Tools } from "../../../../user/public/reset-password/validate/route";
import { tools as route110Tools } from "../../../../user/public/reset-password/request/route";
import { tools as route111Tools } from "../../../../user/public/reset-password/confirm/route";
import { tools as route112Tools } from "../../../../user/search/route";
import { tools as route113Tools } from "../../../../user/session-cleanup/route";
import { tools as route114Tools } from "../../../../user/auth/check/route";
import { tools as route115Tools } from "../../../../ssh/session/read/route";
import { tools as route116Tools } from "../../../../ssh/session/close/route";
import { tools as route117Tools } from "../../../../ssh/session/write/route";
import { tools as route118Tools } from "../../../../ssh/session/open/route";
import { tools as route119Tools } from "../../../../ssh/terminal/route";
import { tools as route120Tools } from "../../../../ssh/files/read/route";
import { tools as route121Tools } from "../../../../ssh/files/list/route";
import { tools as route122Tools } from "../../../../ssh/files/write/route";
import { tools as route123Tools } from "../../../../ssh/linux/users/list/route";
import { tools as route124Tools } from "../../../../ssh/linux/users/create/route";
import { tools as route125Tools } from "../../../../ssh/exec/route";
import { tools as route126Tools } from "../../../../ssh/connections/[id]/route";
import { tools as route127Tools } from "../../../../subscription/update/route";
import { tools as route128Tools } from "../../../../subscription/cancel/route";
import { tools as route129Tools } from "../../../../subscription/create/route";
import { tools as route130Tools } from "../../../../payment/portal/route";
import { tools as route131Tools } from "../../../../payment/invoice/route";
import { tools as route132Tools } from "../../../../payment/providers/stripe/cli/route";
import { tools as route133Tools } from "../../../../payment/providers/nowpayments/cli/route";
import { tools as route134Tools } from "../../../../payment/checkout/route";
import { tools as route135Tools } from "../../../../payment/refund/route";
import { tools as route136Tools } from "../../../../credits/history/route";
import { tools as route137Tools } from "../../../../credits/expire/route";
import { tools as route138Tools } from "../../../../credits/purchase/route";
import { tools as route139Tools } from "../../../../credits/admin-add/route";
import { tools as route140Tools } from "../../../../contact/route";
import { tools as route141Tools } from "../../../../emails/smtp-client/list/route";
import { tools as route142Tools } from "../../../../emails/smtp-client/edit/[id]/route";
import { tools as route143Tools } from "../../../../emails/smtp-client/create/route";
import { tools as route144Tools } from "../../../../emails/send/route";
import { tools as route145Tools } from "../../../../emails/messages/[id]/route";
import { tools as route146Tools } from "../../../../emails/imap-client/messages/bulk/route";
import { tools as route147Tools } from "../../../../emails/imap-client/messages/compose/route";
import { tools as route148Tools } from "../../../../emails/imap-client/messages/list/route";
import { tools as route149Tools } from "../../../../emails/imap-client/messages/sync/route";
import { tools as route150Tools } from "../../../../emails/imap-client/folders/list/route";
import { tools as route151Tools } from "../../../../emails/imap-client/folders/sync/route";
import { tools as route152Tools } from "../../../../emails/imap-client/config/route";
import { tools as route153Tools } from "../../../../emails/imap-client/health/route";
import { tools as route154Tools } from "../../../../emails/imap-client/sync/route";
import { tools as route155Tools } from "../../../../emails/imap-client/accounts/[id]/route";
import { tools as route156Tools } from "../../../../emails/preview/send-test/route";
import { tools as route157Tools } from "../../../../emails/preview/render/route";
import { tools as route158Tools } from "../../../../emails/messaging/accounts/list/route";
import { tools as route159Tools } from "../../../../emails/messaging/accounts/edit/[id]/route";
import { tools as route160Tools } from "../../../../emails/messaging/accounts/create/route";
import { tools as route161Tools } from "../../../../import/route";
import { tools as route162Tools } from "../../../../newsletter/unsubscribe/route";
import { tools as route163Tools } from "../../../../newsletter/subscribe/route";
import { tools as route164Tools } from "../../../../newsletter/status/route";
import { tools as route165Tools } from "../../../../browser/performance-analyze-insight/route";
import { tools as route166Tools } from "../../../../browser/get-console-message/route";
import { tools as route167Tools } from "../../../../browser/new-page/route";
import { tools as route168Tools } from "../../../../browser/take-snapshot/route";
import { tools as route169Tools } from "../../../../browser/drag/route";
import { tools as route170Tools } from "../../../../browser/get-network-request/route";
import { tools as route171Tools } from "../../../../browser/list-pages/route";
import { tools as route172Tools } from "../../../../browser/close-page/route";
import { tools as route173Tools } from "../../../../browser/resize-page/route";
import { tools as route174Tools } from "../../../../browser/fill/route";
import { tools as route175Tools } from "../../../../browser/hover/route";
import { tools as route176Tools } from "../../../../browser/upload-file/route";
import { tools as route177Tools } from "../../../../browser/handle-dialog/route";
import { tools as route178Tools } from "../../../../browser/select-page/route";
import { tools as route179Tools } from "../../../../browser/navigate-page/route";
import { tools as route180Tools } from "../../../../browser/press-key/route";
import { tools as route181Tools } from "../../../../browser/fill-form/route";
import { tools as route182Tools } from "../../../../browser/performance-stop-trace/route";
import { tools as route183Tools } from "../../../../browser/performance-start-trace/route";
import { tools as route184Tools } from "../../../../browser/emulate/route";
import { tools as route185Tools } from "../../../../browser/take-screenshot/route";
import { tools as route186Tools } from "../../../../browser/list-network-requests/route";
import { tools as route187Tools } from "../../../../browser/evaluate-script/route";
import { tools as route188Tools } from "../../../../browser/list-console-messages/route";
import { tools as route189Tools } from "../../../../browser/wait-for/route";
import { tools as route190Tools } from "../../../../browser/click/route";

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
const route186 = wrapToolsForTRPC(route186Tools);
const route187 = wrapToolsForTRPC(route187Tools);
const route188 = wrapToolsForTRPC(route188Tools);
const route189 = wrapToolsForTRPC(route189Tools);
const route190 = wrapToolsForTRPC(route190Tools);

export const appRouter = router({
  agent: router({
    chat: router({
      threads: router({ ...route0, ...route1 }),
      memories: router({ ...route2, ...route3 }),
      messages: router({
        search: router({ ...route4 }),
      }),
      settings: router({ ...route5 }),
      favorites: router({ ...route6, ...route7 }),
      characters: router({ ...route8, ...route9 }),
      folders: router({ ...route10, ...route11 }),
      files: router({ ...route12 }),
    }),
    "fetch-url-content": router({ ...route13 }),
    "ai-stream": router({ ...route14 }),
    search: router({
      brave: router({ ...route15 }),
      kagi: router({ ...route16 }),
    }),
    "claude-code": router({ ...route17 }),
    "text-to-speech": router({ ...route18 }),
    "speech-to-text": router({
      hotkey: router({ ...route19 }),
    }),
    models: router({
      openrouter: router({ ...route20 }),
    }),
  }),
  system: router({
    server: router({
      rebuild: router({ ...route21 }),
      dev: router({ ...route22 }),
      start: router({ ...route23 }),
      build: router({ ...route24 }),
      health: router({ ...route25 }),
    }),
    guard: router({
      start: router({ ...route26 }),
      stop: router({ ...route27 }),
      status: router({ ...route28 }),
      destroy: router({ ...route29 }),
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
          dashboard: router({ ...route45 }),
        }),
        "error-monitor": router({ ...route46 }),
        pulse: router({
          history: router({ ...route47 }),
          status: router({ ...route48 }),
          execute: router({ ...route49 }),
        }),
        "task-sync": router({
          report: router({ ...route50 }),
          pull: router({ ...route51 }),
        }),
        "complete-task": router({ ...route52 }),
        "unified-runner": router({ ...route53 }),
        "db-health": router({ ...route54 }),
      }),
      mcp: router({
        serve: router({ ...route55 }),
      }),
      ai: router({
        "execute-tool": router({ ...route56 }),
      }),
      cli: router({
        setup: router({
          uninstall: router({ ...route57 }),
          update: router({ ...route58 }),
          status: router({ ...route59 }),
          install: router({ ...route60 }),
        }),
      }),
      "react-native": router({
        generate: router({ ...route61 }),
      }),
    }),
    check: router({
      testing: router({
        test: router({ ...route62 }),
      }),
      "vibe-check": router({ ...route63 }),
      typecheck: router({ ...route64 }),
      lint: router({ ...route65 }),
      config: router({
        create: router({ ...route66 }),
      }),
      oxlint: router({ ...route67 }),
    }),
    "release-tool": router({ ...route68 }),
    builder: router({ ...route69 }),
    generators: router({
      "generate-all": router({ ...route70 }),
      endpoint: router({ ...route71 }),
      "route-handlers": router({ ...route72 }),
      "client-routes-index": router({ ...route73 }),
      endpoints: router({ ...route74 }),
      env: router({ ...route75 }),
      "endpoints-index": router({ ...route76 }),
      "email-templates": router({ ...route77 }),
      "task-index": router({ ...route78 }),
      seeds: router({ ...route79 }),
      "generate-trpc-router": router({
        validation: router({ ...route80 }),
      }),
    }),
  }),
  leads: router({
    lead: router({ ...route81 }),
    tracking: router({
      engagement: router({ ...route82 }),
    }),
    search: router({ ...route83 }),
    campaigns: router({
      "campaign-starter": router({
        "campaign-starter-config": router({ ...route84 }),
      }),
      "email-campaigns": router({ ...route85 }),
      emails: router({
        "test-mail": router({ ...route86 }),
      }),
    }),
    list: router({ ...route87 }),
    import: router({
      process: router({ ...route88 }),
      jobs: router({ ...route89 }),
      status: router({ ...route90 }),
    }),
    export: router({ ...route91 }),
    stats: router({ ...route92 }),
    create: router({ ...route93 }),
    batch: router({ ...route94 }),
  }),
  referral: router({
    earnings: router({
      list: router({ ...route95 }),
    }),
    codes: router({
      list: router({ ...route96 }),
    }),
    stats: router({ ...route97 }),
  }),
  users: router({
    view: router({ ...route98 }),
    user: router({ ...route99 }),
    list: router({ ...route100 }),
    stats: router({ ...route101 }),
    create: router({ ...route102 }),
  }),
  user: router({
    private: router({
      logout: router({ ...route103 }),
      me: router({ ...route104 }),
      sessions: router({ ...route105, ...route106 }),
    }),
    public: router({
      login: router({
        options: router({ ...route107 }),
      }),
      signup: router({ ...route108 }),
      "reset-password": router({
        validate: router({ ...route109 }),
        request: router({ ...route110 }),
        confirm: router({ ...route111 }),
      }),
    }),
    search: router({ ...route112 }),
    "session-cleanup": router({ ...route113 }),
    auth: router({
      check: router({ ...route114 }),
    }),
  }),
  ssh: router({
    session: router({
      read: router({ ...route115 }),
      close: router({ ...route116 }),
      write: router({ ...route117 }),
      open: router({ ...route118 }),
    }),
    terminal: router({ ...route119 }),
    files: router({
      read: router({ ...route120 }),
      list: router({ ...route121 }),
      write: router({ ...route122 }),
    }),
    linux: router({
      users: router({
        list: router({ ...route123 }),
        create: router({ ...route124 }),
      }),
    }),
    exec: router({ ...route125 }),
    connections: router({ ...route126 }),
  }),
  subscription: router({
    update: router({ ...route127 }),
    cancel: router({ ...route128 }),
    create: router({ ...route129 }),
  }),
  payment: router({
    portal: router({ ...route130 }),
    invoice: router({ ...route131 }),
    providers: router({
      stripe: router({
        cli: router({ ...route132 }),
      }),
      nowpayments: router({
        cli: router({ ...route133 }),
      }),
    }),
    checkout: router({ ...route134 }),
    refund: router({ ...route135 }),
  }),
  credits: router({
    history: router({ ...route136 }),
    expire: router({ ...route137 }),
    purchase: router({ ...route138 }),
    "admin-add": router({ ...route139 }),
  }),
  contact: router({ ...route140 }),
  emails: router({
    "smtp-client": router({
      list: router({ ...route141 }),
      edit: router({ ...route142 }),
      create: router({ ...route143 }),
    }),
    send: router({ ...route144 }),
    messages: router({ ...route145 }),
    "imap-client": router({
      messages: router({
        bulk: router({ ...route146 }),
        compose: router({ ...route147 }),
        list: router({ ...route148 }),
        sync: router({ ...route149 }),
      }),
      folders: router({
        list: router({ ...route150 }),
        sync: router({ ...route151 }),
      }),
      config: router({ ...route152 }),
      health: router({ ...route153 }),
      sync: router({ ...route154 }),
      accounts: router({ ...route155 }),
    }),
    preview: router({
      "send-test": router({ ...route156 }),
      render: router({ ...route157 }),
    }),
    messaging: router({
      accounts: router({
        list: router({ ...route158 }),
        edit: router({ ...route159 }),
        create: router({ ...route160 }),
      }),
    }),
  }),
  import: router({ ...route161 }),
  newsletter: router({
    unsubscribe: router({ ...route162 }),
    subscribe: router({ ...route163 }),
    status: router({ ...route164 }),
  }),
  browser: router({
    "performance-analyze-insight": router({ ...route165 }),
    "get-console-message": router({ ...route166 }),
    "new-page": router({ ...route167 }),
    "take-snapshot": router({ ...route168 }),
    drag: router({ ...route169 }),
    "get-network-request": router({ ...route170 }),
    "list-pages": router({ ...route171 }),
    "close-page": router({ ...route172 }),
    "resize-page": router({ ...route173 }),
    fill: router({ ...route174 }),
    hover: router({ ...route175 }),
    "upload-file": router({ ...route176 }),
    "handle-dialog": router({ ...route177 }),
    "select-page": router({ ...route178 }),
    "navigate-page": router({ ...route179 }),
    "press-key": router({ ...route180 }),
    "fill-form": router({ ...route181 }),
    "performance-stop-trace": router({ ...route182 }),
    "performance-start-trace": router({ ...route183 }),
    emulate: router({ ...route184 }),
    "take-screenshot": router({ ...route185 }),
    "list-network-requests": router({ ...route186 }),
    "evaluate-script": router({ ...route187 }),
    "list-console-messages": router({ ...route188 }),
    "wait-for": router({ ...route189 }),
    click: router({ ...route190 }),
  }),
});

export type AppRouter = typeof appRouter;
