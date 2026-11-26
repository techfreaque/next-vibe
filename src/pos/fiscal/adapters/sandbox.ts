/**
 * Sandbox fiscal adapter: dev/test only, never certified.
 * Pretends the receipt was registered online with a deterministic fake UID so
 * the queue can be exercised. It can never unblock a sale that needs eKasa.
 */

import type { FiscalProviderAdapter } from "../adapter";
import { FiscalAdapter, FiscalDeviceKindDB } from "../enum";

export const sandboxFiscalAdapter: FiscalProviderAdapter = {
  id: FiscalAdapter.SANDBOX,
  certified: false,
  deviceKinds: FiscalDeviceKindDB,
  register: (receipt) =>
    Promise.resolve({
      status: "REGISTERED",
      uid: `SANDBOX-${receipt.cashRegisterCode}-${receipt.receiptNumber}`,
    }),
};
