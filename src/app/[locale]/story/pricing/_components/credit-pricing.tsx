"use client";

import { motion } from "framer-motion";
import {
  Check,
  Coins,
  CreditCard,
  Info,
  Loader,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
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
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { H3, H4, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/types";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { productsRepository, ProductIds } from "@/app/api/[locale]/v1/core/products/repository-client";

import { modelOptions } from "./models-config";

interface CreditPricingSectionProps {
  locale: CountryLanguage;
  currentUser: CompleteUserType | undefined;
  useHomePageLink: boolean;
}

export default function CreditPricingSection({
  locale,
  currentUser,
  useHomePageLink,
}: CreditPricingSectionProps): JSX.Element {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [packQuantity, setPackQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculatorMessages, setCalculatorMessages] = useState(100);

  // Use centralized pricing from products repository with proper locale
  const products = productsRepository.getProducts(locale);
  const SUBSCRIPTION_PRICE = products[ProductIds.SUBSCRIPTION].price;
  const SUBSCRIPTION_CREDITS = products[ProductIds.SUBSCRIPTION].credits;
  const PACK_PRICE = products[ProductIds.CREDIT_PACK].price;
  const PACK_CREDITS = products[ProductIds.CREDIT_PACK].credits;

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

  // Group models by provider for cost table
  const modelsByProvider = modelOptions.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    },
    {} as Record<string, typeof modelOptions>,
  );

  const handleSubscribe = (): void => {
    setIsProcessing(true);
    // TODO: Implement Stripe checkout for subscription
    if (currentUser) {
      window.location.href = `/${locale}/subscription`;
    } else {
      window.location.href = `/${locale}/user/signup?plan=subscription`;
    }
  };

  const handleBuyPack = (): void => {
    setIsProcessing(true);
    // TODO: Implement Stripe checkout for credit packs
    if (currentUser) {
      window.location.href = `/${locale}/subscription?buyCredits=${packQuantity}`;
    } else {
      window.location.href = `/${locale}/user/signup?credits=${packQuantity}`;
    }
  };

  return (
    <section
      id="pricing"
      className="container px-4 md:px-6 py-24 md:py-32"
      ref={ref}
    >
      {/* Background decoration */}
      <Div className="absolute inset-0 -z-10 overflow-hidden">
        <Div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl"
          aria-hidden="true"
        >
          <Div
            className="aspect-[1155/678] w-[72.1875rem] bg-blue-300 bg-gradient-to-tr from-[#80b5ff] to-[#9089fc] opacity-10"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </Div>
      </Div>

      {/* Header */}
      <Div className="text-center mb-16 relative">
        <motion.div
          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          <Span className="font-medium">
            {t("app.story.pricing.creditPricing.badge")}
          </Span>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("app.story.pricing.creditPricing.title")}
        </motion.h2>

        <motion.p
          className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("app.story.pricing.creditPricing.subtitle")}
        </motion.p>
      </Div>

      {/* Pricing Cards */}
      <motion.div
        className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto mb-16"
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {/* Subscription Card */}
        <motion.div variants={item}>
          <Card className="flex flex-col h-full border-2 border-blue-500 shadow-xl relative hover:shadow-2xl hover:-translate-y-1 transition-all">
            <Div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {t("app.story.pricing.creditPricing.subscription.badge")}
            </Div>
            <CardHeader className="pt-8 pb-4">
              <Div className="mb-6">
                <Div className="flex justify-center mb-3">
                  <Div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30">
                    <Zap className="h-6 w-6" />
                  </Div>
                </Div>
                <CardTitle className="text-xl text-center">
                  {t("app.story.pricing.creditPricing.subscription.title")}
                </CardTitle>
              </Div>

              <Div className="flex items-baseline justify-center">
                <Span className="text-4xl font-extrabold">
                  {t("app.story.pricing.creditPricing.subscription.price", {
                    price: SUBSCRIPTION_PRICE,
                  })}
                </Span>
                <Span className="ml-1 text-gray-500 dark:text-gray-400">
                  {t("app.story.pricing.creditPricing.subscription.perMonth")}
                </Span>
              </Div>
              <CardDescription className="mt-4 text-center">
                {t("app.api.v1.core.products.subscription.longDescription")}
              </CardDescription>

              <Div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <Div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <P className="text-xs text-amber-800 dark:text-amber-200">
                    {t(
                      "app.story.pricing.creditPricing.subscription.expiryInfo",
                    )}
                  </P>
                </Div>
              </Div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-cyan-100 dark:bg-cyan-900/30">
                    <Check className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.subscription.features.credits")}
                  </Span>
                </li>
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-cyan-100 dark:bg-cyan-900/30">
                    <Check className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.subscription.features.allModels")}
                  </Span>
                </li>
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-cyan-100 dark:bg-cyan-900/30">
                    <Check className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.subscription.features.allFeatures")}
                  </Span>
                </li>
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-cyan-100 dark:bg-cyan-900/30">
                    <Check className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.subscription.features.cancel")}
                  </Span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                className="w-full bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700 text-white"
                size="lg"
                onClick={handleSubscribe}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Div className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {t("app.story.pricing.creditPricing.common.processing")}
                  </Div>
                ) : (
                  t("app.story.pricing.creditPricing.subscription.button")
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Credit Pack Card */}
        <motion.div variants={item}>
          <Card className="flex flex-col h-full border-2 border-purple-500 shadow-xl relative hover:shadow-2xl hover:-translate-y-1 transition-all">
            <Div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {t("app.story.pricing.creditPricing.creditPack.badge")}
            </Div>
            <CardHeader className="pt-8 pb-4">
              <Div className="mb-6">
                <Div className="flex justify-center mb-3">
                  <Div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30">
                    <Coins className="h-6 w-6" />
                  </Div>
                </Div>
                <CardTitle className="text-xl text-center">
                  {t("app.story.pricing.creditPricing.creditPack.title")}
                </CardTitle>
              </Div>

              <Div className="flex items-baseline justify-center">
                <Span className="text-4xl font-extrabold">
                  {t("app.story.pricing.creditPricing.creditPack.price", {
                    price: PACK_PRICE * packQuantity,
                  })}
                </Span>
              </Div>
              <CardDescription className="mt-4 text-center">
                {t("app.api.v1.core.products.creditPack.longDescription")}
              </CardDescription>

              <Div className="mt-4 space-y-3">
                <Div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <P className="text-xs text-green-800 dark:text-green-200">
                      {t("app.api.v1.core.products.creditPack.features.permanent")}
                    </P>
                  </Div>
                </Div>

                <Div className="space-y-2">
                  <Label htmlFor="quantity">
                    {t(
                      "app.story.pricing.creditPricing.creditPack.quantityLabel",
                    )}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={packQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val >= 1 && val <= 10) {
                        setPackQuantity(val);
                      }
                    }}
                    className="text-center font-bold"
                  />
                  <P className="text-xs text-muted-foreground text-center">
                    {t(
                      "app.story.pricing.creditPricing.creditPack.pricePerPack",
                      {
                        price: PACK_PRICE,
                        credits: PACK_CREDITS,
                      },
                    )}
                  </P>
                </Div>
              </Div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-purple-100 dark:bg-purple-900/30">
                    <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.creditPack.features.credits")}
                  </Span>
                </li>
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-purple-100 dark:bg-purple-900/30">
                    <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.creditPack.features.allModels")}
                  </Span>
                </li>
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-purple-100 dark:bg-purple-900/30">
                    <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.creditPack.features.allFeatures")}
                  </Span>
                </li>
                <li className="flex items-start">
                  <Div className="flex-shrink-0 rounded-full p-1 mt-0.5 bg-purple-100 dark:bg-purple-900/30">
                    <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </Div>
                  <Span className="ml-3 text-sm">
                    {t("app.api.v1.core.products.creditPack.features.multiple")}
                  </Span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                className="w-full bg-purple-600 bg-gradient-to-r from-purple-500 to-pink-600 hover:bg-purple-700 hover:from-purple-600 hover:to-pink-700 text-white"
                size="lg"
                onClick={handleBuyPack}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Div className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {t("app.story.pricing.creditPricing.common.processing")}
                  </Div>
                ) : packQuantity > 1 ? (
                  t("app.story.pricing.creditPricing.creditPack.buttonPlural", {
                    quantity: packQuantity,
                  })
                ) : (
                  t("app.story.pricing.creditPricing.creditPack.button", {
                    quantity: packQuantity,
                  })
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Cost Transparency Table */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <H3 className="text-2xl font-bold text-center mb-6">
          {t("app.story.pricing.creditPricing.costTransparency.title")}
        </H3>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>
              {t("app.story.pricing.creditPricing.costTransparency.card.title")}
            </CardTitle>
            <CardDescription>
              {t(
                "app.story.pricing.creditPricing.costTransparency.card.description",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t(
                      "app.story.pricing.creditPricing.costTransparency.table.provider",
                    )}
                  </TableHead>
                  <TableHead>
                    {t(
                      "app.story.pricing.creditPricing.costTransparency.table.model",
                    )}
                  </TableHead>
                  <TableHead className="text-right">
                    {t(
                      "app.story.pricing.creditPricing.costTransparency.table.costPerMessage",
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(modelsByProvider).map(([provider, models]) =>
                  models.map((model, idx) => (
                    <TableRow key={model.id}>
                      {idx === 0 && (
                        <TableCell
                          rowSpan={models.length}
                          className="font-medium"
                        >
                          {provider}
                        </TableCell>
                      )}
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Div className="flex items-center gap-2 cursor-help">
                                {typeof model.icon === "string" ? (
                                  <Span className="text-base">
                                    {model.icon}
                                  </Span>
                                ) : (
                                  <model.icon className="h-4 w-4" />
                                )}
                                <Span>{model.name}</Span>
                              </Div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <P>{model.description}</P>
                              {model.parameterCount && (
                                <P className="text-xs text-muted-foreground">
                                  {t(
                                    "app.story.pricing.creditPricing.costTransparency.table.parameters",
                                    { count: model.parameterCount },
                                  )}
                                </P>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        {model.creditCost === 0 ? (
                          <Badge variant="outline" className="bg-green-50">
                            {t(
                              "app.story.pricing.creditPricing.costTransparency.table.free",
                            )}
                          </Badge>
                        ) : (
                          <Span className="font-mono">
                            {model.creditCost > 1
                              ? t(
                                  "app.story.pricing.creditPricing.costTransparency.table.creditsPlural",
                                  { count: model.creditCost },
                                )
                              : t(
                                  "app.story.pricing.creditPricing.costTransparency.table.credits",
                                  { count: model.creditCost },
                                )}
                          </Span>
                        )}
                      </TableCell>
                    </TableRow>
                  )),
                )}
                {/* Feature Costs */}
                <TableRow>
                  <TableCell className="font-medium">
                    {t(
                      "app.story.pricing.creditPricing.costTransparency.table.features",
                    )}
                  </TableCell>
                  <TableCell>
                    {t(
                      "app.story.pricing.creditPricing.costTransparency.table.braveSearch",
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Span className="font-mono">
                      {t(
                        "app.story.pricing.creditPricing.costTransparency.table.braveSearchCost",
                      )}
                    </Span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium" />
                  <TableCell>
                    {t(
                      "app.story.pricing.creditPricing.costTransparency.table.tts",
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Span className="font-mono">
                      {t(
                        "app.story.pricing.creditPricing.costTransparency.table.ttsCost",
                      )}
                    </Span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium" />
                  <TableCell>
                    {t(
                      "app.story.pricing.creditPricing.costTransparency.table.stt",
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Span className="font-mono">
                      {t(
                        "app.story.pricing.creditPricing.costTransparency.table.sttCost",
                      )}
                    </Span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Credit Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <H3 className="text-2xl font-bold text-center mb-6">
          {t("app.story.pricing.creditPricing.calculator.title")}
        </H3>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {t("app.story.pricing.creditPricing.calculator.card.title")}
            </CardTitle>
            <CardDescription>
              {t("app.story.pricing.creditPricing.calculator.card.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="messages">
                {t("app.story.pricing.creditPricing.calculator.messagesLabel")}
              </Label>
              <Input
                id="messages"
                type="number"
                min="0"
                value={calculatorMessages}
                onChange={(e) =>
                  setCalculatorMessages(parseInt(e.target.value, 10) || 0)
                }
              />
            </div>

            <Div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Div className="space-y-3">
                <Div className="flex justify-between items-center">
                  <Span className="text-sm">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.free",
                    )}
                  </Span>
                  <Span className="font-bold">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.freeCredits",
                    )}
                  </Span>
                </Div>
                <Div className="flex justify-between items-center">
                  <Span className="text-sm">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.basic",
                    )}
                  </Span>
                  <Span className="font-bold">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.basicCredits",
                      { count: calculatorMessages },
                    )}
                  </Span>
                </Div>
                <Div className="flex justify-between items-center">
                  <Span className="text-sm">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.pro",
                    )}
                  </Span>
                  <Span className="font-bold">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.proCredits",
                      { count: calculatorMessages * 2 },
                    )}
                  </Span>
                </Div>
                <Div className="flex justify-between items-center">
                  <Span className="text-sm">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.premium",
                    )}
                  </Span>
                  <Span className="font-bold">
                    {t(
                      "app.story.pricing.creditPricing.calculator.estimates.premiumCredits",
                      { count: calculatorMessages * 5 },
                    )}
                  </Span>
                </Div>
              </Div>
            </Div>

            <Div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <P className="text-sm font-medium mb-2">
                {t(
                  "app.story.pricing.creditPricing.calculator.recommendation.title",
                )}
              </P>
              {calculatorMessages <= 0 && (
                <P className="text-sm">
                  {t(
                    "app.story.pricing.creditPricing.calculator.recommendation.freeTier",
                  )}
                </P>
              )}
              {calculatorMessages > 0 &&
                calculatorMessages * 2 <= SUBSCRIPTION_CREDITS && (
                  <P className="text-sm">
                    {t(
                      "app.story.pricing.creditPricing.calculator.recommendation.subscription",
                      { credits: SUBSCRIPTION_CREDITS },
                    )}
                  </P>
                )}
              {calculatorMessages * 2 > SUBSCRIPTION_CREDITS && (
                <P className="text-sm">
                  {t(
                    "app.story.pricing.creditPricing.calculator.recommendation.additionalPacks",
                    {
                      packs: Math.ceil(
                        (calculatorMessages * 2 - SUBSCRIPTION_CREDITS) /
                          PACK_CREDITS,
                      ),
                    },
                  )}
                </P>
              )}
            </Div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Free Tier Callout */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl shadow-md border border-green-200 dark:border-green-800 max-w-2xl mx-auto">
          <Div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
            <H4 className="text-lg font-bold text-green-900 dark:text-green-100">
              {t("app.story.pricing.creditPricing.freeTier.title")}
            </H4>
          </Div>
          <P className="text-gray-700 dark:text-gray-300">
            {t("app.story.pricing.creditPricing.freeTier.description")}
          </P>
          <Link
            href={
              currentUser
                ? `/${locale}/chat`
                : useHomePageLink
                  ? `/${locale}/user/signup`
                  : `/${locale}/chat`
            }
          >
            <Button className="mt-4" variant="outline" size="sm">
              <CreditCard className="mr-2 h-4 w-4" />
              {t("app.story.pricing.creditPricing.freeTier.button")}
            </Button>
          </Link>
        </Div>
      </motion.div>
    </section>
  );
}
