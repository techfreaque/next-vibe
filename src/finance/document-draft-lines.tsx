"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Input } from "next-vibe/ui/components/input";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { DecimalInput } from "next-vibe/unified-ui/widgets/form-fields/number-field/decimal-input";
import type { JSX, ReactNode } from "react";

export type DraftNumberKey = "quantity" | "unitPrice" | "taxRate";
type LineKey = DraftNumberKey | "description";

interface DraftLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  formattedTotal: string;
  errors?: Partial<Record<LineKey, boolean>>;
  taxControl?: ReactNode;
}
interface DraftLineLabels {
  title: string;
  description: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
  total: string;
  add: string;
  remove: string;
  empty: string;
  invalid: string;
}

export function DocumentDraftLines({
  rows,
  labels,
  locale,
  disabled = false,
  maxLines,
  onDescription,
  onNumber,
  onAdd,
  onRemove,
}: {
  rows: readonly DraftLine[];
  labels: DraftLineLabels;
  locale: CountryLanguage;
  disabled?: boolean;
  maxLines: number;
  onDescription: (index: number, text: string) => void;
  onNumber: (index: number, key: DraftNumberKey, value: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}): JSX.Element {
  const keys: readonly DraftNumberKey[] = ["quantity", "unitPrice", "taxRate"];
  return (
    <SectionGroup title={labels.title}>
      <Div className="flex min-w-0 flex-col gap-3">
        {rows.map((row, index) => (
          <Div
            key={row.id}
            className="flex min-w-0 flex-col gap-2 rounded-lg border bg-background p-3"
          >
            <Div className="grid min-w-0 grid-cols-2 items-end gap-2 @2xl:grid-cols-[minmax(7rem,2fr)_repeat(3,minmax(3.5rem,1fr))_minmax(6rem,1fr)_2rem]">
              <Div className="col-span-2 flex min-w-0 flex-col gap-1 @2xl:col-span-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {labels.description}
                </Span>
                <Input
                  aria-label={labels.description}
                  aria-invalid={Boolean(row.errors?.description)}
                  value={row.description}
                  disabled={disabled}
                  onChangeText={(value) => onDescription(index, value)}
                />
              </Div>
              {keys.map((key) => (
                <Div key={key} className="flex min-w-0 flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {labels[key]}
                  </Span>
                  {key === "taxRate" && row.taxControl ? (
                    row.taxControl
                  ) : (
                    <DecimalInput
                      aria-label={labels[key]}
                      presentation={
                        key === "taxRate"
                          ? "percent"
                          : key === "unitPrice"
                            ? "money"
                            : "quantity"
                      }
                      value={row[key]}
                      locale={locale}
                      disabled={disabled}
                      aria-invalid={Boolean(row.errors?.[key])}
                      onChange={(value) => onNumber(index, key, value)}
                    />
                  )}
                </Div>
              ))}
              <Div className="flex min-w-0 flex-col gap-1">
                <Span className="text-xs text-muted-foreground">
                  {labels.total}
                </Span>
                <Span className="py-2 text-sm font-medium tabular-nums">
                  {row.formattedTotal}
                </Span>
              </Div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={labels.remove}
                disabled={disabled}
                onClick={() => onRemove(index)}
                className="justify-self-end"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Div>
            {row.errors && Object.values(row.errors).some(Boolean) && (
              <P className="text-xs text-destructive">{labels.invalid}</P>
            )}
          </Div>
        ))}
        {rows.length === 0 && (
          <P className="text-sm text-muted-foreground">{labels.empty}</P>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="self-start"
          disabled={disabled || rows.length >= maxLines}
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" />
          {labels.add}
        </Button>
      </Div>
    </SectionGroup>
  );
}
