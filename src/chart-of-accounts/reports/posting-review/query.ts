import "server-only";

import { type SQL, sql } from "drizzle-orm";

import { paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";

import { accountNodes, journalEntries, journalEntryLines } from "../../db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "../../enum";
import {
  ReviewIssue,
  type ReviewIssueValue,
  ReviewReason,
  type ReviewReasonValue,
} from "./enum";

export interface ReviewQueryRow extends Record<string, string | number | null> {
  missing_lines: number;
  invalid_legs: number;
  invoice_links: number;
  bill_links: number;
  matches: number;
  kind: typeof ReviewIssueValue | null;
  reason: typeof ReviewReasonValue | null;
  entity_id: string | null;
  reference: string | null;
  counterparty: string | null;
  record_day: string | null;
}

/** The company and issue predicates are parameters. Pagination returns no more than the selected page. */
export function buildPostingReviewQuery({
  companyId,
  kind,
  page,
  pageSize,
}: {
  companyId: string;
  kind?: typeof ReviewIssueValue;
  page: number;
  pageSize: number;
}): SQL {
  return sql`
    with originals as (
      select j.id, j.entry_number, j.date, j.source_id, j.source_type
      from ${journalEntries} as j
      where j.company_id = ${companyId}
        and j.status = ${JournalEntryStatus.POSTED}
        and j.reversal_of_id is null
        and j.reversed_by_id is null
        and not exists (
          select 1 from ${journalEntries} as reversal
          where reversal.company_id = j.company_id
            and reversal.reversal_of_id = j.id
            and reversal.status = ${JournalEntryStatus.POSTED}
        )
    ),
    currency_legs as (
      select
        e.id as entry_id,
        l.currency,
        count(*) as line_count,
        sum(case
          when l.type in (${LineType.DEBIT}, 'DEBIT') then l.amount
          when l.type in (${LineType.CREDIT}, 'CREDIT') then -l.amount
          else 0
        end) as net,
        bool_or(
          a.id is null or l.amount <= 0 or
          l.type not in (${LineType.DEBIT}, ${LineType.CREDIT}, 'DEBIT', 'CREDIT') or
          l.currency !~ '^[A-Z]{3}$'
        ) as invalid,
        count(*) filter (
          where a.subtype = ${AccountSubtype.ACCOUNTS_RECEIVABLE} and l.type = ${LineType.DEBIT}
        ) as ar_count,
        sum(l.amount) filter (
          where a.subtype = ${AccountSubtype.ACCOUNTS_RECEIVABLE} and l.type = ${LineType.DEBIT}
        ) as ar_amount,
        count(*) filter (
          where a.subtype = ${AccountSubtype.ACCOUNTS_PAYABLE} and l.type = ${LineType.CREDIT}
        ) as ap_count,
        sum(l.amount) filter (
          where a.subtype = ${AccountSubtype.ACCOUNTS_PAYABLE} and l.type = ${LineType.CREDIT}
        ) as ap_amount
      from originals e
      join ${journalEntryLines} as l on l.journal_entry_id = e.id
      left join ${accountNodes} as a on a.id = l.account_id and a.company_id = ${companyId}
      group by e.id, l.currency
    ),
    postings as (
      select
        e.id, e.entry_number, e.date, e.source_id, e.source_type,
        coalesce(sum(legs.line_count), 0) as line_count,
        coalesce(bool_or(legs.invalid or legs.net <> 0), false) as invalid,
        min(legs.currency) as first_currency,
        max(legs.currency) as last_currency,
        sum(legs.ar_count) as ar_count,
        sum(legs.ar_amount) as ar_amount,
        sum(legs.ap_count) as ap_count,
        sum(legs.ap_amount) as ap_amount
      from originals e
      left join currency_legs legs on legs.entry_id = e.id
      group by e.id, e.entry_number, e.date, e.source_id, e.source_type
    ),
    issues as (
      select
        case when p.line_count < 2 then ${ReviewIssue.MISSING_LINES} else ${ReviewIssue.INVALID_LEGS} end as kind,
        case when p.line_count < 2 then ${ReviewReason.FEW_LINES} else ${ReviewReason.INVALID_LEGS} end as reason,
        p.id as entity_id,
        nullif(p.entry_number, '') as reference,
        null::text as counterparty,
        p.date as record_date
      from postings p
      where p.line_count < 2 or p.invalid

      union all

      select
        ${ReviewIssue.INVOICE_LINK},
        case
          when i.journal_entry_id is null then ${ReviewReason.NO_BACKLINK}
          when p.id is null then ${ReviewReason.WRONG_POSTING}
          else ${ReviewReason.CONTROL_LEG}
        end,
        i.id,
        coalesce(nullif(i.invoice_number, ''), 'INV-' || i.invoice_sequence_number),
        null::text,
        i.created_at
      from ${paymentInvoices} as i
      left join postings p on p.id = i.journal_entry_id and p.source_id = i.id
        and p.source_type = ${JournalSourceType.AR_INVOICE}
      where i.company_id = ${companyId}
        and i.status in (${InvoiceStatus.OPEN}, ${InvoiceStatus.PAID})
        and i.amount > 0
        and (
          p.id is null or p.line_count < 2 or p.invalid or
          p.first_currency is distinct from i.currency or p.last_currency is distinct from i.currency or
          p.ar_count is distinct from 1 or p.ar_amount is distinct from i.amount
        )

      union all

      select
        ${ReviewIssue.BILL_LINK},
        case
          when b.journal_entry_id is null then ${ReviewReason.NO_BACKLINK}
          when p.id is null then ${ReviewReason.WRONG_POSTING}
          else ${ReviewReason.CONTROL_LEG}
        end,
        b.id,
        nullif(b.bill_number, ''),
        nullif(b.supplier_name, ''),
        b.bill_date
      from ${paymentBills} as b
      left join postings p on p.id = b.journal_entry_id and p.source_id = b.id
        and p.source_type = ${JournalSourceType.AP_BILL}
      where b.company_id = ${companyId}
        and b.status in (${BillStatus.APPROVED}, ${BillStatus.PAID})
        and b.total > 0
        and (
          p.id is null or p.line_count < 2 or p.invalid or
          p.first_currency is distinct from b.currency or p.last_currency is distinct from b.currency or
          p.ap_count is distinct from 1 or p.ap_amount is distinct from b.total
        )
    ),
    review_counts as (
      select
        count(*) filter (where kind = ${ReviewIssue.MISSING_LINES})::int as missing_lines,
        count(*) filter (where kind = ${ReviewIssue.INVALID_LEGS})::int as invalid_legs,
        count(*) filter (where kind = ${ReviewIssue.INVOICE_LINK})::int as invoice_links,
        count(*) filter (where kind = ${ReviewIssue.BILL_LINK})::int as bill_links
      from issues
    ),
    matches as (
      select * from issues
      ${kind ? sql`where issues.kind = ${kind}` : sql``}
    ),
    filtered_count as (select count(*)::int as matches from matches),
    page_rows as (
      select * from matches
      order by record_date desc, kind, entity_id
      limit ${pageSize}
      offset ${(page - 1) * pageSize}
    )
    select review_counts.*, filtered_count.matches,
      page_rows.kind, page_rows.reason, page_rows.entity_id,
      page_rows.reference, page_rows.counterparty,
      to_char(page_rows.record_date, 'YYYY-MM-DD') as record_day
    from review_counts cross join filtered_count
    left join page_rows on true
    order by page_rows.record_date desc, page_rows.kind, page_rows.entity_id
  `;
}
