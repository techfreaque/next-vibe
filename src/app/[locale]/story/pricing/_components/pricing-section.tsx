"use client";

import { motion } from "framer-motion";
import { Check, Clock, Loader, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Label } from "next-vibe-ui/ui/label";
import { Switch } from "next-vibe-ui/ui/switch";
import { useToast } from "next-vibe-ui/ui/use-toast";
import type { JSX } from "react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

import { useSubscriptionCheckout } from "@/app/api/[locale]/v1/core/subscription/checkout/hooks";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/v1/core/subscription/definition";
import type {
  BillingIntervalValue,
  SubscriptionPlanValue,
} from "@/app/api/[locale]/v1/core/subscription/enum";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/app/api/[locale]/v1/core/subscription/enum";
import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/definition";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import {
  calculateSavingsPercent,
  getPlanPriceForCountry,
  getPricingPlansArray,
} from "./pricing";

export default function PricingSection({
  locale,
  currentUser,
  currentSubscription,
  onPlanSelect,
  onDowngrade,
  isProcessing,
  useHomePageLink,
  hideFooterAndHeader,
}: {
  locale: CountryLanguage;
  currentUser: CompleteUserType | undefined;
  currentSubscription: SubscriptionGetResponseOutput | null;
  onPlanSelect?: (
    planId: SubscriptionPlanValue,
    billingInterval: BillingIntervalValue,
    action: "upgrade" | "downgrade",
  ) => void;
  onDowngrade?: (
    planId: SubscriptionPlanValue,
    billingInterval: BillingIntervalValue,
  ) => void;
  isProcessing: boolean | null;
  useHomePageLink: boolean;
  hideFooterAndHeader: boolean;
}): JSX.Element {
  const { t, country, currentCountry } = useTranslation();
  const { toast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [annual, setAnnual] = useState(true);
  const [isChangingPlan, setIsChangingPlan] = useState<string | null>(null);
  const [clickedPlan, setClickedPlan] = useState<string | null>(null);

  // Use subscription hooks for mutations
  const { createCheckout } = useSubscriptionCheckout();

  const currentPlanId = currentSubscription?.plan;
  const isActive = currentSubscription?.status === SubscriptionStatus.ACTIVE;

  // Plan hierarchy for upgrade/downgrade logic
  const planHierarchy = {
    [SubscriptionPlan.SUBSCRIPTION]: 0,
  };

  const getButtonAction = (
    planId: SubscriptionPlanValue,
  ): "upgrade" | "downgrade" | "current" => {
    if (!currentPlanId || !isActive) {
      return "upgrade";
    }

    const currentLevel = planHierarchy[currentPlanId];
    const targetLevel = planHierarchy[planId];

    if (targetLevel > currentLevel) {
      return "upgrade";
    }
    if (targetLevel < currentLevel) {
      return "downgrade";
    }
    return "current";
  };

  const getButtonText = (planId: SubscriptionPlanValue): string => {
    const action = getButtonAction(planId);

    switch (action) {
      case "upgrade":
        return currentPlanId
          ? t("app.story.pricing.creditPricing.buttons.upgrade")
          : getPlanCta(planId, t);
      case "downgrade":
        return t("app.story.pricing.creditPricing.buttons.downgrade");
      case "current":
        return t("app.story.pricing.creditPricing.buttons.currentPlan");
      default:
        return getPlanCta(planId, t);
    }
  };

  // Helper function to determine if a button should show loading spinner
  const shouldShowLoading = (planId: SubscriptionPlanValue): boolean => {
    // Show loading if isProcessing is true (all buttons)
    if (isProcessing === true) {
      return true;
    }

    // Show loading if isProcessing is null and this plan was clicked
    if (isProcessing === null && clickedPlan === planId) {
      return true;
    }

    // Show loading if this specific plan is being changed
    if (isChangingPlan === planId) {
      return true;
    }

    return false;
  };

  const handlePlanSelect = async (
    planId: SubscriptionPlanValue,
  ): Promise<void> => {
    const action = getButtonAction(planId);
    const billingInterval = annual
      ? BillingInterval.YEARLY
      : BillingInterval.MONTHLY;

    // If isProcessing is null, set clicked plan for persistent loading
    if (isProcessing === null) {
      setClickedPlan(planId);
    }

    // If we have onPlanSelect callback (subscription page mode), use it
    if (onPlanSelect) {
      if (action === "downgrade" && onDowngrade) {
        onDowngrade(planId, billingInterval);
      } else if (action === "upgrade") {
        onPlanSelect(planId, billingInterval, action);
      }
      return;
    }

    // Handle different modes for direct interaction
    if (action === "current") {
      return;
    }

    // If not logged in, redirect based on mode
    if (!currentUser) {
      if (useHomePageLink) {
        window.location.href = `/${locale}/user/signup?plan=${planId}`;
      } else if (!window.location.pathname.includes("/subscription")) {
        window.location.href = `/${locale}/subscription`;
      }
      return;
    }

    // If logged in but no subscription, redirect to subscription page for management
    if (!currentSubscription && useHomePageLink) {
      // Don't redirect if we're already on the subscription page
      if (!window.location.pathname.includes("/subscription")) {
        window.location.href = `/${locale}/subscription`;
      }
      return;
    }

    // Handle subscription changes (only on pricing page or subscription page)
    setIsChangingPlan(planId);
    try {
      if (action === "downgrade") {
        // For downgrades, show a message that it will take effect next cycle
        toast({
          title: t("app.story.pricing.downgrade.title"),
          description: t("app.story.pricing.downgrade.description"),
        });
        return;
      }

      const result = await createCheckout(planId, billingInterval);

      // Check if the result is successful
      if (!result.success) {
        toast({
          title: t("app.common.error.title"),
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe checkout
      if (result.data.checkoutUrl) {
        window.location.assign(result.data.checkoutUrl);
      }

      toast({
        title: t("app.common.success.title"),
        description:
          action === "upgrade"
            ? t("app.story.pricing.upgrade.processing")
            : t("app.story.pricing.subscribe.processing"),
      });
    } catch {
      toast({
        title: t("app.common.error.title"),
        description: t("app.common.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsChangingPlan(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="pricing"
      className="container px-4 md:px-6 py-24 md:py-32"
      ref={ref}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-pink-300 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {!hideFooterAndHeader && (
        <div className="text-center mb-16 relative">
          <motion.div
            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span className="font-medium">
              {t("app.story.pricing.plans.badge")}
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("app.story.pricing.plans.title")}
          </motion.h2>

          <motion.p
            className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("app.story.pricing.plans.subtitle")}
          </motion.p>
        </div>
      )}

      <motion.div
        className="flex items-center justify-center space-x-2 mb-12"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Label
          htmlFor="billing-toggle"
          className={`${
            annual
              ? "text-gray-500 dark:text-gray-400"
              : "font-medium text-blue-600 dark:text-blue-400"
          } transition-colors`}
        >
          {t("app.story.pricing.plans.monthly")}
        </Label>
        <Switch
          id="billing-toggle"
          checked={annual}
          onCheckedChange={setAnnual}
          className="mx-2 data-[state=checked]:bg-blue-600"
        />
        <Label
          htmlFor="billing-toggle"
          className={`${
            annual
              ? "font-medium text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          } transition-colors flex items-center`}
        >
          {t("app.story.pricing.plans.annually")}{" "}
          <span className="ml-1.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
            {t("app.story.pricing.plans.savePercent", {
              percent: calculateSavingsPercent(country),
            })}
          </span>
        </Label>
      </motion.div>

      <motion.div
        className="grid gap-8 lg:grid-cols-4 max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {getPricingPlansArray().map((plan, index) => {
          const pricing = getPlanPriceForCountry(plan, country, annual);
          const action = getButtonAction(plan.id);
          const isCurrent = action === "current";

          return (
            <motion.div
              // eslint-disable-next-line i18next/no-literal-string
              key={`plan_${index}_${plan.id}`}
              variants={item}
              className={`${plan.highlighted ? "lg:-mt-8 z-10" : ""}`}
            >
              <Card
                className={`flex flex-col h-full transition-all duration-300 ${
                  plan.highlighted
                    ? "border-2 border-cyan-500 shadow-xl relative hover:shadow-2xl hover:-translate-y-1"
                    : "border border-gray-200 dark:border-gray-800 shadow-md hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg"
                } ${
                  isCurrent
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : ""
                }`}
              >
                {plan.highlighted && plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {t(plan.badge)}
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {t("app.story.pricing.currentPlan.badge")}
                  </div>
                )}
                <CardHeader
                  className={`${plan.highlighted || isCurrent ? "pt-8" : ""} pb-4`}
                >
                  <div className="mb-6">
                    <div className="flex justify-center mb-3">{plan.icon}</div>
                    <CardTitle className="text-xl text-center">
                      {t(plan.name)}
                    </CardTitle>
                  </div>

                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-extrabold">
                      {t(plan.pricing, {
                        price: pricing,
                        currency: currentCountry.symbol,
                      })}
                    </span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">
                      {t("app.story.pricing.plans.perMonth")}
                    </span>
                  </div>
                  <CardDescription className="mt-4 text-center">
                    {t(plan.description)}
                  </CardDescription>

                  {/* Add visual elements for Premium tier */}
                  {plan.premiumFeatures && (
                    <div className="mt-4 space-y-2 justify-center">
                      {plan.premiumFeatures.map((feature, i) => (
                        <div key={`feature_${i}_${feature.feature}`}>
                          <div
                            className={cn(
                              "p-2 rounded-lg flex items-center",
                              feature.className,
                            )}
                          >
                            {feature.icon}
                            <span className="text-xs font-medium ml-2">
                              {t(feature.feature)}
                            </span>
                          </div>
                          {/* Add "or" separator between posts and reels for Premium and Professional plans */}
                          {i === 0 &&
                            plan.premiumFeatures &&
                            plan.premiumFeatures.length > 1 && (
                              <div className="flex items-center justify-center my-2">
                                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                                <span className="px-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  {t("app.story.pricing.plans.orSeparator")}
                                </span>
                                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li
                        key={`feature_${i}_${feature}`}
                        className="flex items-start"
                      >
                        <div
                          className={`flex-shrink-0 rounded-full p-1 mt-0.5 ${
                            plan.highlighted
                              ? "bg-cyan-100 dark:bg-cyan-900/30"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <Check
                            className={`h-3 w-3 ${
                              plan.highlighted
                                ? "text-cyan-600 dark:text-cyan-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <span className="ml-3 text-sm">{t(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  {onPlanSelect
                    ? ((): JSX.Element => {
                        const action = getButtonAction(plan.id);
                        const isCurrent = action === "current";
                        const isLoading = shouldShowLoading(plan.id);

                        return (
                          <Button
                            className={`w-full ${
                              isCurrent
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-default"
                                : action === "downgrade"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                                  : plan.highlighted
                                    ? "bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 text-white"
                                    : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
                            }`}
                            variant={
                              isCurrent
                                ? "secondary"
                                : action === "downgrade"
                                  ? "outline"
                                  : plan.highlighted
                                    ? "default"
                                    : "outline"
                            }
                            size="lg"
                            onClick={() => {
                              const billingInterval = annual
                                ? BillingInterval.YEARLY
                                : BillingInterval.MONTHLY;

                              if (action === "downgrade" && onDowngrade) {
                                onDowngrade(plan.id, billingInterval);
                              } else if (action === "upgrade") {
                                onPlanSelect(plan.id, billingInterval, action);
                              }
                            }}
                            disabled={isCurrent || isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                {t(
                                  "app.story.pricing.creditPricing.buttons.processing",
                                )}
                              </div>
                            ) : action === "downgrade" ? (
                              <div className="flex flex-col items-center">
                                <span>{getButtonText(plan.id)}</span>
                                <span className="text-xs opacity-75">
                                  {t("app.story.pricing.downgrade.nextCycle")}
                                </span>
                              </div>
                            ) : (
                              getButtonText(plan.id)
                            )}
                          </Button>
                        );
                      })()
                    : currentUser
                      ? // Logged in user - show subscription management buttons
                        ((): JSX.Element => {
                          const action = getButtonAction(plan.id);
                          const isCurrent = action === "current";
                          const isLoading = shouldShowLoading(plan.id);

                          return (
                            <Button
                              className={`w-full ${
                                isCurrent
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-default"
                                  : action === "downgrade"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                                    : plan.highlighted
                                      ? "bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 text-white"
                                      : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
                              }`}
                              variant={
                                isCurrent
                                  ? "secondary"
                                  : action === "downgrade"
                                    ? "outline"
                                    : plan.highlighted
                                      ? "default"
                                      : "outline"
                              }
                              size="lg"
                              onClick={() => handlePlanSelect(plan.id)}
                              disabled={isCurrent || isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center">
                                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                                  {t(
                                    "app.story.pricing.creditPricing.buttons.processing",
                                  )}
                                </div>
                              ) : action === "downgrade" ? (
                                <div className="flex flex-col items-center">
                                  <span>{getButtonText(plan.id)}</span>
                                  <span className="text-xs opacity-75">
                                    {t("app.story.pricing.downgrade.nextCycle")}
                                  </span>
                                </div>
                              ) : (
                                getButtonText(plan.id)
                              )}
                            </Button>
                          );
                        })()
                      : // Not logged in - show signup links
                        ((): JSX.Element => {
                          const isLoading = shouldShowLoading(plan.id);

                          return (
                            <Link
                              href={`/${locale}/user/signup?plan=${plan.id}`}
                              className="w-full"
                              onClick={() => {
                                // Set loading state when clicking the link
                                if (isProcessing === null) {
                                  setClickedPlan(plan.id);
                                }
                              }}
                            >
                              <Button
                                className={`w-full ${
                                  plan.highlighted
                                    ? "bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 text-white"
                                    : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-700"
                                }`}
                                variant={
                                  plan.highlighted ? "default" : "outline"
                                }
                                size="lg"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <div className="flex items-center">
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    {t(
                                      "app.story.pricing.creditPricing.buttons.processing",
                                    )}
                                  </div>
                                ) : (
                                  getPlanCta(plan.id, t)
                                )}
                              </Button>
                            </Link>
                          );
                        })()}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {!hideFooterAndHeader && (
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <Badge
              variant="outline"
              className="py-1.5 px-4 flex items-center gap-2 text-sm bg-white dark:bg-gray-800 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>{t("app.story.pricing.plans.guaranteeBadge")}</span>
            </Badge>
            <Badge
              variant="outline"
              className="py-1.5 px-4 flex items-center gap-2 text-sm bg-white dark:bg-gray-800 shadow-sm"
            >
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{t("app.story.pricing.plans.flexibleBadge")}</span>
            </Badge>
            <Badge
              variant="outline"
              className="py-1.5 px-4 flex items-center gap-2 text-sm bg-white dark:bg-gray-800 shadow-sm"
            >
              <Users className="h-4 w-4 text-purple-500" />
              <span>{t("app.story.pricing.plans.supportBadge")}</span>
            </Badge>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
            <p className="text-gray-700 dark:text-gray-300">
              {t("app.story.pricing.plans.customSolutionText")}{" "}
              <Link
                href={
                  useHomePageLink
                    ? `/${locale}/help`
                    : `/${locale}/app/consultation`
                }
                className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
              >
                {t("app.story.pricing.plans.contactUsLink")}
              </Link>{" "}
              {t("app.story.pricing.plans.tailoredPackageText")}
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}

function getPlanCta(planId: SubscriptionPlanValue, t: TFunction): string {
  switch (planId) {
    case SubscriptionPlan.SUBSCRIPTION:
      return t("app.story.pricing.plans.STARTER.cta");
  }
}
