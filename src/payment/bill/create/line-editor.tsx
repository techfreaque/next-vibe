"use client";

import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useFieldArray, useWatch } from "react-hook-form";

import { DocumentDraftLines } from "@/finance/document-draft-lines";
import { DocumentVatPicker } from "@/finance/document-vat-picker";
import { useDocumentVatRates } from "@/finance/document-vat-rates";

import { calculateBillLine } from "./amounts";
import type definition from "./definition";

export function BillLineEditor({
  money,
}: {
  money: (amount: number) => string;
}): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const disabled = useWidgetDisabled();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const companyId = useWatch({ control: form.control, name: "companyId" });
  const vatRates = useDocumentVatRates(companyId, interactive && !disabled);
  const lines = useWatch({ control: form.control, name: "lineItems" }) ?? [];

  return (
    <DocumentDraftLines
      locale={locale}
      disabled={disabled}
      maxLines={100}
      labels={{
        title: t("post.widget.items"),
        description: t("post.widget.item"),
        quantity: t("post.widget.quantity"),
        unitPrice: t("post.widget.unitPrice"),
        taxRate: t("post.widget.taxRate"),
        total: t("post.widget.lineTotal"),
        add: t("post.widget.addItem"),
        remove: t("post.widget.removeItem"),
        empty: t("post.widget.itemsHint"),
        invalid: t("post.widget.itemError"),
      }}
      rows={fields.map((field, index) => {
        const line = lines[index] ?? field;
        const errors = form.formState.errors.lineItems?.[index];
        const total = calculateBillLine(line).lineTotal;
        const taxControl = (
          <DocumentVatPicker
            rates={vatRates}
            value={line.taxRate}
            label={t("post.widget.taxRate")}
            manualLabel={t("post.widget.manualTaxRate")}
            disabled={disabled}
            invalid={Boolean(errors?.taxRate)}
            onChange={(rate) =>
              form.setValue(`lineItems.${index}.taxRate`, rate, {
                shouldDirty: true,
              })
            }
          />
        );
        return {
          ...line,
          taxControl,
          id: field.id,
          formattedTotal: Number.isFinite(total) ? money(total) : "",
          errors: {
            description: Boolean(errors?.description),
            quantity: Boolean(errors?.quantity),
            unitPrice: Boolean(errors?.unitPrice),
            taxRate: Boolean(errors?.taxRate),
          },
        };
      })}
      onDescription={(index, description) =>
        form.setValue(`lineItems.${index}.description`, description, {
          shouldDirty: true,
        })
      }
      onNumber={(index, key, value) =>
        form.setValue(`lineItems.${index}.${key}`, value, { shouldDirty: true })
      }
      onAdd={() =>
        append({ description: "", quantity: 1, unitPrice: 0, taxRate: 0 })
      }
      onRemove={(index) => remove(index)}
    />
  );
}
