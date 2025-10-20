"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import { Label } from "next-vibe-ui/ui/label";
import { Switch } from "next-vibe-ui/ui/switch";
import type { JSX } from "react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import type { PricingComparisonFeature, PricingTextFeature } from "./pricing";
import {
  calculateSavingsPercent,
  getPlanPriceForCountry,
  getPricingPlansArray,
  pricingComparisonFeatures,
} from "./pricing";

export default function PricingComparison({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t, currentCountry } = useTranslation();
  const [annual, setAnnual] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const pricingPlans = getPricingPlansArray();

  function isTextFeature(
    feature: PricingComparisonFeature,
  ): feature is PricingTextFeature {
    return (feature as PricingTextFeature).type === "text";
  }

  return (
    <section className="container px-4 py-16 md:py-24" ref={ref}>
      <div className="text-center mb-12">
        <motion.h2
          className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {t("app.story.pricing.comparison.title")}
        </motion.h2>
        <motion.p
          className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("app.story.pricing.comparison.subtitle")}
        </motion.p>

        <motion.div
          className="flex items-center justify-center space-x-2 mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Label
            htmlFor="billing-toggle-comparison"
            className={`${
              annual
                ? "text-gray-500 dark:text-gray-400"
                : "font-medium text-blue-600 dark:text-blue-400"
            } transition-colors`}
          >
            {t("app.story.pricing.plans.monthly")}
          </Label>
          <Switch
            id="billing-toggle-comparison"
            checked={annual}
            onCheckedChange={setAnnual}
            className="mx-2 data-[state=checked]:bg-blue-600"
          />
          <Label
            htmlFor="billing-toggle-comparison"
            className={`${
              annual
                ? "font-medium text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            } transition-colors flex items-center`}
          >
            {t("app.story.pricing.plans.annually")}{" "}
            <span className="ml-1.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
              {t("app.story.pricing.plans.savePercent", {
                percent: calculateSavingsPercent(currentCountry.code),
              })}
            </span>
          </Label>
        </motion.div>
      </div>

      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left p-4 border-b border-gray-200 dark:border-gray-800" />
              {pricingPlans.map((plan) => (
                <th
                  key={plan.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-800 ${
                    plan.highlighted
                      ? "bg-blue-50 dark:bg-blue-900/20 border-t-2 border-t-cyan-500 border-x-2 border-x-cyan-500"
                      : plan.id === SubscriptionPlan.PREMIUM
                        ? "bg-purple-50 dark:bg-purple-900/20 border-t-2 border-t-purple-500 border-x-2 border-x-purple-500"
                        : plan.isEnterprise
                          ? "bg-gray-50 dark:bg-gray-900/20 border-t-2 border-t-gray-500 border-x-2 border-x-gray-500"
                          : ""
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-lg">{t(plan.name)}</div>
                    <div className="text-2xl font-bold mt-2 mb-1">
                      {t(plan.pricing, {
                        price: getPlanPriceForCountry(
                          plan,
                          currentCountry.code,
                          annual,
                        ),
                        currency: currentCountry.symbol,
                      })}
                      {
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {t("app.story.pricing.plans.perMonth")}
                        </span>
                      }
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {annual
                        ? t("app.story.pricing.comparison.annually")
                        : t("app.story.pricing.comparison.monthly")}
                    </div>
                    <Link
                      href={{
                        pathname: `/${locale}/user/signup`,
                        query: { plan: plan.id },
                      }}
                    >
                      <Button
                        variant={plan.highlighted}
                        className={`w-full ${
                          plan.highlighted
                            ? "bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 text-white"
                            : plan.id === SubscriptionPlan.PREMIUM
                              ? "bg-purple-600 bg-gradient-to-r from-purple-500 to-pink-600 hover:bg-purple-700 hover:from-purple-600 hover:to-pink-700 text-white"
                              : plan.isEnterprise
                                ? "bg-gray-700 bg-gradient-to-r from-gray-600 to-gray-800 hover:bg-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
                                : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
                        }`}
                        size="sm"
                      >
                        {((): string => {
                          switch (plan.id) {
                            case SubscriptionPlan.SUBSCRIPTION:
                              return t("app.story.pricing.plans.STARTER.cta");
                          }
                        })()}
                      </Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pricingComparisonFeatures.map((feature, index) => {
              if (isTextFeature(feature)) {
                // Text feature row
                return (
                  <tr
                    key={`${feature.name}-text`}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-900/20"
                        : "bg-white dark:bg-gray-800"
                    }
                  >
                    <td className="p-4 border-b border-gray-200 dark:border-gray-700 font-medium">
                      {t(feature.name)}
                    </td>
                    {pricingPlans.map((plan) => (
                      <td
                        key={plan.id}
                        className={`p-4 border-b border-gray-200 dark:border-gray-700 text-center ${
                          plan.highlighted
                            ? `bg-blue-50 dark:bg-blue-900/20 border-x-2 border-x-cyan-500${
                                index === pricingComparisonFeatures.length - 1
                                  ? " border-b-2 border-b-cyan-500"
                                  : ""
                              }`
                            : plan.id === SubscriptionPlan.PREMIUM
                              ? `bg-purple-50 dark:bg-purple-900/20 border-x-2 border-x-purple-500${
                                  index === pricingComparisonFeatures.length - 1
                                    ? " border-b-2 border-b-purple-500"
                                    : ""
                                }`
                              : plan.isEnterprise
                                ? `bg-gray-50 dark:bg-gray-900/20 border-x-2 border-x-gray-500${
                                    index ===
                                    pricingComparisonFeatures.length - 1
                                      ? " border-b-2 border-b-gray-500"
                                      : ""
                                  }`
                                : ""
                        }`}
                      >
                        {t(feature[plan.id])}
                      </td>
                    ))}
                  </tr>
                );
              }
              // Boolean feature row
              const boolFeature = feature;
              return (
                <tr
                  key={feature.name}
                  className={
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900/20"
                      : "bg-white dark:bg-gray-800"
                  }
                >
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 font-medium">
                    {t(feature.name)}
                  </td>
                  {pricingPlans.map((plan) => (
                    <td
                      key={plan.id}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 text-center ${
                        plan.highlighted
                          ? `bg-blue-50 dark:bg-blue-900/20 border-x-2 border-x-cyan-500${
                              index === pricingComparisonFeatures.length - 1
                                ? " border-b-2 border-b-cyan-500"
                                : ""
                            }`
                          : plan.id === SubscriptionPlan.PREMIUM
                            ? `bg-purple-50 dark:bg-purple-900/20 border-x-2 border-x-purple-500${
                                index === pricingComparisonFeatures.length - 1
                                  ? " border-b-2 border-b-purple-500"
                                  : ""
                              }`
                            : plan.isEnterprise
                              ? `bg-gray-50 dark:bg-gray-900/20 border-x-2 border-x-gray-500${
                                  index === pricingComparisonFeatures.length - 1
                                    ? " border-b-2 border-b-gray-500"
                                    : ""
                                }`
                              : ""
                      }`}
                    >
                      {boolFeature[plan.id] ? (
                        <Check
                          className={`h-5 w-5 mx-auto ${
                            feature.name.includes("premium") ||
                            feature.name.includes("dedicated") ||
                            feature.name.includes("custom")
                              ? plan.id === SubscriptionPlan.PREMIUM ||
                                plan.isEnterprise
                                ? "text-purple-500"
                                : "text-green-500"
                              : "text-green-500"
                          }`}
                        />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <div className="mt-8 text-center">
        <motion.p
          className="text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {t("app.story.pricing.comparison.customNote")}
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center items-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            href={{
              pathname: `/${locale}/help`,
            }}
            className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
          >
            {t("app.story.pricing.plans.contactUsLink")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
