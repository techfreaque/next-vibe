# Account email confirmation

## Where accounts come from

| Entry point | Proof before account creation |
| --- | --- |
| Public signup, including referral codes and the public signup API | The first submission writes a pending signup. A six-digit code is bound to the original visitor, or the recipient can use the emailed link in another browser. Consuming either proof creates the verified user, role and lead link together. Only then does signup issue a session and process referral attribution. |
| Signup reminder | Rotates the pending challenge and mails a fresh code and link. The recipient still has to confirm. |
| Administrative creation through the UI, CLI or API | Administrative creation issues no session. Unless an administrator attests the address, the recipient must confirm it at password sign-in. |
| Self-host first admin | The production seed provisions the operator-configured admin address, or the instance support address when unset, as verified. This is the first-run trust exception. |
| Development, test and chat fixtures | These trusted, local account factories create verified test identities. Individual regression tests can construct unverified rows to model historical data. |
| Social login | No user OAuth provider is enabled. The Google Sheets OAuth callback connects a spreadsheet provider and does not create a login identity. |

## Existing accounts

A password login for an active unconfirmed account sends the code and link after the password is checked. The code works for 30 minutes and accepts up to five guesses. Requesting a new email replaces both the code and the seven-day link. Clicking the current link confirms the address on the original account. The normal login flow still requires the password and any configured second factor.

An existing browser session keeps access to chats, payments, subscriptions, credits and API keys. Its dismissible notice requests one email on use. It includes a link to account settings for an address correction. A voluntary resend is available every five minutes. An automatic login request reuses a valid code. A failed send requires an explicit retry. A matched bounce suppresses sending to that address. An account holder who cannot open the old inbox can confirm a replacement from an existing session via the existing email-change flow. Someone without a usable session or inbox needs account support.

## Production rollout

Apply the additive account email challenge migration with the release. It creates an empty table. No verification flags need backfilling and no sessions need rotating. A successful proof updates the existing account. Paid access continues during the transition.

No one-time mailing is needed. If an operator chooses a separate mailing later, use the same per-account notice reservation, skip verified, banned, inactive and bounced addresses, and preview eligible counts first.

## Production audit, 2026-11-24 at 20:51 UTC

Read-only aggregate queries found 437 unconfirmed addresses among 603 users. Counts below are distinct accounts. Categories overlap.

| Evidence on the unconfirmed account | Accounts |
| --- | ---: |
| Any stored session | 375 |
| At least one unexpired session | 375 |
| Positive balance in the user-owned credit wallet | 17 |
| At least one credit pack in that wallet | 17 |
| At least one ledger entry in that wallet | 25 |
| At least one payment transaction of any status | 29 |
| At least one successful payment | 18 |
| At least one owned chat thread | 237 |

Credit figures cover user-owned wallets. Guest lead wallets can represent shared free allowances. Session counts describe the rows present at query time. Historical sessions may already have been removed.

| Creation month | Unconfirmed | Creation month | Unconfirmed |
| --- | ---: | --- | ---: |
| 2025-11 | 1 | 2026-06 | 31 |
| 2025-12 | 1 | 2026-07 | 72 |
| 2026-01 | 3 | 2026-08 | 58 |
| 2026-02 | 4 | 2026-09 | 45 |
| 2026-03 | 5 | 2026-10 | 69 |
| 2026-04 | 37 | 2026-11 | 97 |
| 2026-05 | 14 | | |

None had a recorded creator in `users.created_by`. Of the 437 accounts, 221 had a lead link marked `signup`. For the other 216 the creation route could not be attributed from these fields. The link identifies a signup relationship and cannot distinguish referral, web or other public clients.
