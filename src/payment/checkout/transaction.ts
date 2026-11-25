import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";

import { paymentTransactions } from "../db";
import { PaymentStatus } from "../enum";

type CheckoutTransaction = typeof paymentTransactions.$inferSelect;
type CheckoutInput = Pick<
  CheckoutTransaction,
  "userId" | "provider" | "amount" | "currency" | "mode" | "metadata"
> & { providerSessionId: string };

/** A paid callback can recover the same checkout row as the session creator. */
export async function ensureCheckoutTransaction(
  input: CheckoutInput,
): Promise<CheckoutTransaction> {
  return db.transaction(async (tx) => {
    // Both writers have the provider's verified buyer. Lock that row even
    // when there is no checkout row yet, then recheck the session under lock.
    await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, input.userId))
      .for("update");
    const [existing] = await tx
      .select()
      .from(paymentTransactions)
      .where(
        and(
          eq(paymentTransactions.provider, input.provider),
          eq(paymentTransactions.providerSessionId, input.providerSessionId),
        ),
      )
      .limit(1);
    if (existing) {
      return existing;
    }
    const [row] = await tx
      .insert(paymentTransactions)
      .values({ ...input, status: PaymentStatus.PENDING })
      .returning();
    return row;
  });
}
