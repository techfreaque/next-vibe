"use client";

import { Div } from "next-vibe/ui/components/div";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import type { JSX } from "react";

import {
  acquisitionCurrencyField,
  acquisitionFilterFields,
} from "./acquisition-fields";

export function AcquisitionFilterInputs(): JSX.Element {
  return (
    <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
      <SelectFieldWidget
        fieldName="acquisitionFilters.sourceType"
        field={acquisitionFilterFields.sourceType}
      />
      <TextFieldWidget
        fieldName="acquisitionFilters.refCode"
        field={acquisitionFilterFields.refCode}
      />
      <TextFieldWidget
        fieldName="acquisitionFilters.referrerHost"
        field={acquisitionFilterFields.referrerHost}
      />
      <TextFieldWidget
        fieldName="acquisitionFilters.source"
        field={acquisitionFilterFields.source}
      />
      <TextFieldWidget
        fieldName="acquisitionFilters.medium"
        field={acquisitionFilterFields.medium}
      />
      <TextFieldWidget
        fieldName="acquisitionFilters.campaign"
        field={acquisitionFilterFields.campaign}
      />
      <SelectFieldWidget
        fieldName="acquisitionCurrency"
        field={acquisitionCurrencyField}
      />
    </Div>
  );
}
