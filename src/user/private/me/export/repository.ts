/**
 * Export My Data Repository (GDPR data portability)
 *
 * Collects every record the caller owns. STRICT OWNERSHIP SCOPING: every query
 * is keyed on the authenticated user id (or on rows that are provably theirs:
 * their linked leads, their email). There is no user-id input, so one user can
 * never request another user's export.
 *
 * Secrets (password hash, 2FA secret) and derived search artifacts (embeddings,
 * search vectors) are excluded.
 */

import "server-only";

import { eq, getTableColumns, inArray, or } from "drizzle-orm";
import { cortexNodes } from "next-vibe/agent/cortex/db";
import {
  chatFolders,
  chatMessages,
  chatThreads,
} from "next-vibe/agent/chat/db";
import { customSkills } from "next-vibe/agent/skills/db";
import { chatFavorites } from "next-vibe/agent/skills/favorites/db";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { userAddresses, userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { contacts } from "../../../../contact/db";
import { creditTransactions, creditWallets } from "../../../../credits/db";
import { growthJourneys } from "../../../../leads/growth/db";
import { newsletterSubscriptions } from "../../../../newsletter/db";
import { paymentTransactions } from "../../../../payment/db";
import {
  payoutRequests,
  referralCodes,
  referralEarnings,
  userReferrals,
} from "../../../../referral/db";
import { subscriptions } from "../../../../subscription/db";
import type { ExportMyDataResponseOutput } from "./definition";
import type { ExportMyDataT } from "./i18n";

const {
  embedding: omitEmbedding,
  searchVector: omitMessageSearch,
  ...messageColumns
} = getTableColumns(chatMessages);
const { searchVector: omitThreadSearch, ...threadColumns } =
  getTableColumns(chatThreads);
const {
  password: omitPassword,
  twoFactorSecret: omitTwoFactorSecret,
  ...userColumns
} = getTableColumns(users);
// Deliberately dropped columns: secrets and derived search artifacts.
void [
  omitEmbedding,
  omitMessageSearch,
  omitThreadSearch,
  omitPassword,
  omitTwoFactorSecret,
];

export class ExportMyDataRepository {
  static async exportMyData(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: ExportMyDataT,
  ): Promise<ResponseType<ExportMyDataResponseOutput>> {
    try {
      if (!user.id) {
        return fail({
          message: t("get.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      const userId: string = user.id;
      logger.debug("Exporting user data", { userId });

      const [account] = await db
        .select(userColumns)
        .from(users)
        .where(eq(users.id, userId));
      if (!account) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const ownThreadIds = db
        .select({ id: chatThreads.id })
        .from(chatThreads)
        .where(eq(chatThreads.userId, userId));

      const linkedLeadIds = db
        .select({ id: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, userId));

      const ownWalletIds = db
        .select({ id: creditWallets.id })
        .from(creditWallets)
        .where(eq(creditWallets.userId, userId));

      const [
        roles,
        addresses,
        folders,
        threads,
        messages,
        memories,
        skills,
        favorites,
        wallets,
        transactions,
        referralCodeRows,
        referralLinks,
        earnings,
        payouts,
        newsletter,
        subscriptionRows,
        payments,
        contactRows,
        leadRows,
        journeys,
      ] = await Promise.all([
        db.select().from(userRoles).where(eq(userRoles.userId, userId)),
        db.select().from(userAddresses).where(eq(userAddresses.userId, userId)),
        db.select().from(chatFolders).where(eq(chatFolders.userId, userId)),
        db
          .select(threadColumns)
          .from(chatThreads)
          .where(eq(chatThreads.userId, userId)),
        db
          .select(messageColumns)
          .from(chatMessages)
          .where(inArray(chatMessages.threadId, ownThreadIds)),
        db.select().from(cortexNodes).where(eq(cortexNodes.userId, userId)),
        db.select().from(customSkills).where(eq(customSkills.userId, userId)),
        db.select().from(chatFavorites).where(eq(chatFavorites.userId, userId)),
        db.select().from(creditWallets).where(eq(creditWallets.userId, userId)),
        db
          .select()
          .from(creditTransactions)
          .where(inArray(creditTransactions.walletId, ownWalletIds)),
        db
          .select()
          .from(referralCodes)
          .where(eq(referralCodes.ownerUserId, userId)),
        db
          .select()
          .from(userReferrals)
          .where(
            or(
              eq(userReferrals.referrerUserId, userId),
              eq(userReferrals.referredUserId, userId),
            ),
          ),
        db
          .select()
          .from(referralEarnings)
          .where(eq(referralEarnings.earnerUserId, userId)),
        db
          .select()
          .from(payoutRequests)
          .where(eq(payoutRequests.userId, userId)),
        db
          .select()
          .from(newsletterSubscriptions)
          .where(
            or(
              eq(newsletterSubscriptions.userId, userId),
              eq(newsletterSubscriptions.email, account.email),
            ),
          ),
        db.select().from(subscriptions).where(eq(subscriptions.userId, userId)),
        db
          .select()
          .from(paymentTransactions)
          .where(eq(paymentTransactions.userId, userId)),
        db
          .select()
          .from(contacts)
          .where(
            or(eq(contacts.userId, userId), eq(contacts.email, account.email)),
          ),
        db
          .select()
          .from(leads)
          .where(
            or(
              eq(leads.convertedUserId, userId),
              inArray(leads.id, linkedLeadIds),
              eq(leads.email, account.email),
            ),
          ),
        db
          .select()
          .from(growthJourneys)
          .where(
            or(
              eq(growthJourneys.userId, userId),
              inArray(growthJourneys.leadId, linkedLeadIds),
            ),
          ),
      ]);

      const generatedAt = new Date();
      const sections = {
        account: [account],
        roles,
        addresses,
        chatFolders: folders,
        chatThreads: threads,
        chatMessages: messages,
        memories,
        skills,
        favorites,
        creditWallets: wallets,
        creditTransactions: transactions,
        referralCodes: referralCodeRows,
        referrals: referralLinks,
        referralEarnings: earnings,
        payoutRequests: payouts,
        newsletter,
        subscriptions: subscriptionRows,
        payments,
        contactMessages: contactRows,
        leads: leadRows,
        attribution: journeys,
      };

      const json = JSON.stringify(
        { exportedAt: generatedAt.toISOString(), userId, ...sections },
        null,
        2,
      );

      const lines = [
        `# ${t("get.md.heading")}`,
        "",
        `${t("get.md.generated")}: ${generatedAt.toISOString()}`,
        "",
        `## ${t("get.md.account")}`,
        "",
        `- ${t("get.md.email")}: ${account.email}`,
        `- ${t("get.md.name")}: ${account.publicName}`,
        `- ${t("get.md.memberSince")}: ${account.createdAt.toISOString()}`,
        "",
        `## ${t("get.md.contents")}`,
        "",
        ...Object.entries(sections).map(
          ([name, rows]) => `- ${name}: ${rows.length} ${t("get.md.records")}`,
        ),
        "",
        t("get.md.note"),
        "",
      ];

      const day = generatedAt.toISOString().slice(0, 10);
      return success({
        json,
        jsonFilename: `my-data-${day}.json`,
        markdown: lines.join("\n"),
        markdownFilename: `my-data-${day}.md`,
      });
    } catch (error) {
      logger.error("Error exporting user data", parseError(error), {
        userId: user.id,
      });
      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
