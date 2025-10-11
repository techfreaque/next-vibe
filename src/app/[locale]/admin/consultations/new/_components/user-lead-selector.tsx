"use client";

/**
 * User/Lead Selector Component
 * Simplified component that uses separate UserSelector and LeadSelector components
 */

import { cn } from "next-vibe/shared/utils";
import { Label } from "next-vibe-ui/ui/label";
import { RadioGroup, RadioGroupItem } from "next-vibe-ui/ui/radio-group";
import type React from "react";

import {
  SelectionType,
  type SelectionTypeValue,
} from "@/app/api/[locale]/v1/core/consultation/admin/consultation/new/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { LeadSelector } from "./lead-selector";
import { UserSelector } from "./user-selector";

interface UserLeadSelectorProps {
  locale: CountryLanguage;
  value: {
    selectionType: SelectionTypeValue;
    userId?: string;
    leadId?: string;
  };
  onChange: (value: {
    selectionType: SelectionTypeValue;
    userId?: string;
    leadId?: string;
  }) => void;
  className?: string;
}

export function UserLeadSelector({
  locale,
  value,
  onChange,
  className,
}: UserLeadSelectorProps): React.JSX.Element {
  const { t } = simpleT(locale);

  const handleSelectionTypeChange = (newType: SelectionTypeValue): void => {
    onChange({
      selectionType: newType,
      userId: undefined,
      leadId: undefined,
    });
  };

  const handleUserChange = (userId: string | undefined): void => {
    onChange({
      selectionType: SelectionType.USER,
      userId,
      leadId: undefined,
    });
  };

  const handleLeadChange = (leadId: string | undefined): void => {
    onChange({
      selectionType: SelectionType.LEAD,
      userId: undefined,
      leadId,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selection Type Radio Group */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {t("consultations.admin.form.selectionType.label")}
        </Label>
        <RadioGroup
          value={value.selectionType as string}
          onValueChange={handleSelectionTypeChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={SelectionType.CREATE_NEW_LEAD}
              id="create_new_lead"
            />
            <Label
              htmlFor={SelectionType.CREATE_NEW_LEAD}
              className="cursor-pointer"
            >
              {t("consultations.admin.form.selectionType.new")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={SelectionType.USER} id="user" />
            <Label htmlFor="user" className="cursor-pointer">
              {t("consultations.admin.form.selectionType.user")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={SelectionType.LEAD} id="lead" />
            <Label htmlFor="lead" className="cursor-pointer">
              {t("consultations.admin.form.selectionType.lead")}
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* User Selector */}
      {value.selectionType === SelectionType.USER && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("consultations.admin.form.userSelect.label")}
          </Label>
          <UserSelector
            locale={locale}
            value={value.userId}
            onChange={handleUserChange}
          />
        </div>
      )}

      {/* Lead Selector */}
      {value.selectionType === SelectionType.LEAD && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("consultations.admin.form.leadSelect.label")}
          </Label>
          <LeadSelector
            locale={locale}
            value={value.leadId}
            onChange={handleLeadChange}
          />
        </div>
      )}
    </div>
  );
}
