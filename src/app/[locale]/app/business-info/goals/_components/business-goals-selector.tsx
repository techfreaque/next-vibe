"use client";

import { Check, Target } from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Label } from "next-vibe-ui/ui/label";
import { Separator } from "next-vibe-ui/ui/separator";
import type { JSX } from "react";

import type { BusinessGoal } from "@/app/api/[locale]/v1/core/business-data/goals/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// Function to get goal translation key
function getGoalTranslationKey(goal: BusinessGoal): string {
  switch (goal) {
    case "increase_revenue":
      return "businessInfo.goals.form.fields.primaryGoals.options.increase_revenue";
    case "grow_customer_base":
      return "businessInfo.goals.form.fields.primaryGoals.options.grow_customer_base";
    case "improve_brand_awareness":
      return "businessInfo.goals.form.fields.primaryGoals.options.improve_brand_awareness";
    case "expand_market_reach":
      return "businessInfo.goals.form.fields.primaryGoals.options.expand_market_reach";
    case "enhance_customer_engagement":
      return "businessInfo.goals.form.fields.primaryGoals.options.enhance_customer_engagement";
    case "improve_online_presence":
      return "businessInfo.goals.form.fields.primaryGoals.options.improve_online_presence";
    case "optimize_operations":
      return "businessInfo.goals.form.fields.primaryGoals.options.optimize_operations";
    case "reduce_costs":
      return "businessInfo.goals.form.fields.primaryGoals.options.reduce_costs";
    case "digital_transformation":
      return "businessInfo.goals.form.fields.primaryGoals.options.digital_transformation";
    case "launch_new_products":
      return "businessInfo.goals.form.fields.primaryGoals.options.launch_new_products";
    case "improve_customer_retention":
      return "businessInfo.goals.form.fields.primaryGoals.options.improve_customer_retention";
    case "generate_leads":
      return "businessInfo.goals.form.fields.primaryGoals.options.generate_leads";
    default:
      return "businessInfo.goals.form.fields.primaryGoals.options.increase_revenue";
  }
}

interface BusinessGoalsSelectorProps {
  value: BusinessGoal[];
  onChange: (goals: BusinessGoal[]) => void;
  locale: CountryLanguage;
  required?: boolean;
  error?: string;
}

// Goal categories for better UX
const GOAL_CATEGORIES = {
  growth: {
    titleKey:
      "businessInfo.goals.form.fields.primaryGoals.categories.growth.title",
    goals: [
      "increase_revenue",
      "grow_customer_base",
      "expand_market_reach",
      "generate_leads",
    ] as BusinessGoal[],
    icon: Target,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  brand: {
    titleKey:
      "businessInfo.goals.form.fields.primaryGoals.categories.brand.title",
    goals: [
      "improve_brand_awareness",
      "enhance_customer_engagement",
      "improve_online_presence",
    ] as BusinessGoal[],
    icon: Target,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  operations: {
    titleKey:
      "businessInfo.goals.form.fields.primaryGoals.categories.operations.title",
    goals: [
      "optimize_operations",
      "reduce_costs",
      "digital_transformation",
    ] as BusinessGoal[],
    icon: Target,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  products: {
    titleKey:
      "businessInfo.goals.form.fields.primaryGoals.categories.products.title",
    goals: [
      "launch_new_products",
      "improve_customer_retention",
    ] as BusinessGoal[],
    icon: Target,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
} as const;

export function BusinessGoalsSelector({
  value = [],
  onChange,
  locale,
  required = false,
  error,
}: BusinessGoalsSelectorProps): JSX.Element {
  const { t } = simpleT(locale);

  const toggleGoal = (goal: BusinessGoal): void => {
    if (value.includes(goal)) {
      onChange(value.filter((g) => g !== goal));
    } else {
      onChange([...value, goal]);
    }
  };

  const selectAllInCategory = (categoryGoals: BusinessGoal[]): void => {
    const newGoals = [...value];
    categoryGoals.forEach((goal) => {
      if (!newGoals.includes(goal)) {
        newGoals.push(goal);
      }
    });
    onChange(newGoals);
  };

  const clearAllInCategory = (categoryGoals: BusinessGoal[]): void => {
    onChange(value.filter((goal) => !categoryGoals.includes(goal)));
  };

  const clearAll = (): void => {
    onChange([]);
  };

  const selectPopularGoals = (): void => {
    const popularGoals: BusinessGoal[] = [
      "increase_revenue",
      "grow_customer_base",
      "improve_brand_awareness",
      "generate_leads",
    ];
    onChange(popularGoals);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {t("businessInfo.goals.form.fields.primaryGoals.label")}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {value.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {value.length}{" "}
              {t("businessInfo.goals.form.fields.primaryGoals.selected")}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectPopularGoals}
            className="text-xs"
          >
            {t("businessInfo.goals.form.fields.primaryGoals.selectPopular")}
          </Button>
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs"
            >
              {t("businessInfo.goals.form.fields.primaryGoals.clearAll")}
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Goal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(GOAL_CATEGORIES).map(([categoryKey, category]) => {
          const selectedInCategory = category.goals.filter((goal) =>
            value.includes(goal),
          );
          const allSelected =
            selectedInCategory.length === category.goals.length;
          const someSelected = selectedInCategory.length > 0;

          return (
            <Card key={categoryKey} className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {t(category.titleKey)}
                  </div>
                  <div className="flex gap-1">
                    {someSelected && !allSelected && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllInCategory(category.goals)}
                        className="h-6 px-2 text-xs"
                      >
                        {t(
                          "businessInfo.goals.form.fields.primaryGoals.selectAll",
                        )}
                      </Button>
                    )}
                    {someSelected && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => clearAllInCategory(category.goals)}
                        className="h-6 px-2 text-xs"
                      >
                        {t("businessInfo.goals.form.fields.primaryGoals.clear")}
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.goals.map((goal) => {
                  const isSelected = value.includes(goal);
                  return (
                    <div key={goal} className="flex items-center space-x-3">
                      <Checkbox
                        id={`goal-${goal}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleGoal(goal)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label
                        // eslint-disable-next-line i18next/no-literal-string
                        htmlFor={`goal-${goal}`}
                        className="text-sm font-normal cursor-pointer leading-relaxed flex-1"
                      >
                        {/* @ts-expect-error - Dynamic translation key */}
                        {t(getGoalTranslationKey(goal))}
                      </Label>
                      {isSelected && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Goals Summary */}
      {value.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t(
                "businessInfo.goals.form.fields.primaryGoals.selectedGoalsCount",
                { count: value.length },
              )}
            </Label>
            <div className="flex flex-wrap gap-2">
              {value.map((goal) => (
                <Badge
                  key={goal}
                  variant="default"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-800 hover:border-red-200"
                  onClick={() => toggleGoal(goal)}
                >
                  {/* @ts-expect-error - Dynamic translation key */}
                  {t(getGoalTranslationKey(goal))}
                  {/* eslint-disable-next-line i18next/no-literal-string */}
                  <span className="ml-1 text-xs">×</span>
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Help Text */}
      <div className="text-xs text-muted-foreground">
        {t("businessInfo.goals.form.fields.primaryGoals.helpText")}
      </div>
    </div>
  );
}
