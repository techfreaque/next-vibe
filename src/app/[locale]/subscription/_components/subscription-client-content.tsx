"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  RefreshCw,
  Settings,
  Shield,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "next-vibe/shared/utils";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe-ui/ui";
import { Container } from "next-vibe-ui/ui/container";
import { useToast } from "next-vibe-ui/ui/use-toast";
import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import PricingSection from "@/app/[locale]/story/pricing/_components/pricing-section";
import type {
  PaymentGetResponseTypeOutput,
  PaymentResponseType,
} from "@/app/api/[locale]/v1/core/payment/definition";
import { InvoiceStatus } from "@/app/api/[locale]/v1/core/payment/enum";
import { SubscriptionStatus } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

interface SubscriptionClientContentProps {
  user: CompleteUserType;
  initialSubscription: SubscriptionGetResponseType | null;
  initialPaymentInfo?: PaymentResponseType | null;
  initialBillingHistory?: PaymentGetResponseTypeOutput | null;
  locale: CountryLanguage;
}

export function SubscriptionClientContent({
  user,
  initialSubscription,
  initialPaymentInfo,
  initialBillingHistory,
  locale,
}: SubscriptionClientContentProps): JSX.Element {
  const { t } = simpleT(locale);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Ref to prevent multiple URL parameter cleanups
  const urlCleanupProcessedRef = useRef(false);

  // State for tab navigation
  const [activeTab, setActiveTab] = useState("overview");

  // State for dialogs
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);

  // Use the comprehensive subscription management hook
  const {
    subscription,
    actions,
    helpers,
    currentPlan,
    subscriptionState,
    billingHistory,
  } = useSubscriptionManagement(
    locale,
    initialSubscription,
    initialPaymentInfo || null,
    initialBillingHistory || null,
  );

  // Handle success/cancel messages from Stripe checkout
  const handleStripeRedirectParams = useCallback(() => {
    // Prevent multiple processing of the same URL parameters
    if (urlCleanupProcessedRef.current) {
      return;
    }

    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    // eslint-disable-next-line i18next/no-literal-string
    const sessionId = searchParams.get("session_id");

    // Only process if we have relevant parameters
    if (!success && !canceled) {
      return;
    }

    urlCleanupProcessedRef.current = true;

    if (success === "true" && sessionId) {
      toast({
        title: t("common.success.title"),
        description: t("subscription.checkout.success"),
        variant: "default",
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      // eslint-disable-next-line i18next/no-literal-string
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    } else if (canceled === "true") {
      toast({
        title: t("common.error.title"),
        description: t("subscription.checkout.error"),
        variant: "destructive",
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("canceled");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, t, toast]);

  useEffect(() => {
    handleStripeRedirectParams();
  }, [handleStripeRedirectParams]);

  // Handle reactivation
  const handleReactivateSubscription = async (): Promise<void> => {
    await actions.handleReactivateSubscription();
    setShowReactivateDialog(false);
  };

  // Handle cancellation
  const handleCancelSubscription = async (): Promise<void> => {
    await actions.handleCancelSubscription();
    setShowCancelDialog(false);
  };

  // Format date with locale support
  const formatDate = (date: string | Date | number): string => {
    try {
      const dateObject =
        typeof date === "number" ? new Date(date * 1000) : new Date(date);
      return formatSimpleDate(dateObject, locale);
    } catch {
      const fallback =
        typeof date === "number" ? new Date(date * 1000) : new Date(date);
      return fallback.toLocaleDateString();
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (
    status: SubscriptionStatus,
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return subscriptionState.isCancelledButActive ? "secondary" : "default";
      case SubscriptionStatus.PAST_DUE:
        return "secondary";
      case SubscriptionStatus.CANCELED:
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get status display text
  const getStatusText = (status: SubscriptionStatus): string => {
    if (subscriptionState.isCancelledButActive) {
      return t("subscription.messages.cancelledAtPeriodEnd");
    }

    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return t("subscription.status.active");
      case SubscriptionStatus.PAST_DUE:
        return t("subscription.status.pastDue");
      case SubscriptionStatus.CANCELED:
        return t("subscription.status.canceled");
      case SubscriptionStatus.TRIALING:
        return t("subscription.status.trialing");
      case SubscriptionStatus.INCOMPLETE:
        return t("subscription.status.incomplete");
      case SubscriptionStatus.INCOMPLETE_EXPIRED:
        return t("subscription.status.incomplete_expired");
      case SubscriptionStatus.UNPAID:
        return t("subscription.status.unpaid");
      default:
        return status;
    }
  };

  return (
    <Container className="py-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "text-center",
          subscriptionState.hasSubscription ? "space-y-4" : "pt-8 pb-0 mb-0",
        )}
      >
        <h1 className="text-4xl font-bold tracking-tight">
          {t("subscription.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subscriptionState.hasSubscription
            ? t("billing.currentPlan.description")
            : t("billing.noSubscription.description")}
        </p>
      </motion.div>

      {/* Main Content */}
      {subscriptionState.hasSubscription && subscription ? (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("subscription.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("subscription.tabs.billing")}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("subscription.tabs.history")}
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t("subscription.tabs.plans")}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Current Plan Card */}
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        {t("billing.currentPlan.title")}
                      </CardTitle>
                      <CardDescription>
                        {helpers.getPlanNameTranslation(subscription.planId)}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(subscription.status)}
                      className="text-sm font-medium"
                    >
                      {getStatusText(subscription.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plan Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Plan Details */}
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {t("subscription.current.title")}
                      </div>
                      <div className="font-semibold text-lg">
                        {currentPlan?.name
                          ? t(currentPlan?.name)
                          : subscription.planId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscriptionState.currentSubscriptionIsAnnual
                          ? t("pricing.plans.annually")
                          : t("pricing.plans.monthly")}
                      </div>
                    </div>

                    {/* Next Billing */}
                    {!subscriptionState.isCancelledButActive &&
                      subscription.currentPeriodEnd && (
                        <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t("billing.subscription.nextBilling")}
                          </div>
                          <div className="font-semibold text-lg">
                            {formatDate(subscription.currentPeriodEnd)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("subscription.billing.automatic")}
                          </div>
                        </div>
                      )}

                    {/* Access Until (for cancelled) */}
                    {subscriptionState.isCancelledButActive &&
                      subscription.currentPeriodEnd && (
                        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                            <AlertCircle className="h-4 w-4" />
                            {t("subscription.accessUntil")}
                          </div>
                          <div className="font-semibold text-lg text-amber-800 dark:text-amber-200">
                            {formatDate(subscription.currentPeriodEnd)}
                          </div>
                          <div className="text-sm text-amber-600 dark:text-amber-400">
                            {t("subscription.messages.cancellationWarning", {
                              date: formatDate(subscription.currentPeriodEnd),
                            })}
                          </div>
                        </div>
                      )}

                    {/* Billing Amount */}
                    {currentPlan && (
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          {t("subscription.billing.amount")}
                        </div>
                        <div className="font-semibold text-lg">
                          {((): string => {
                            const country = getCountryFromLocale(locale);
                            const countryPricing =
                              currentPlan.priceByCountry[country] ||
                              currentPlan.priceByCountry.GLOBAL;
                            const amount =
                              subscriptionState.currentSubscriptionIsAnnual
                                ? countryPricing.annual
                                : countryPricing.monthly;
                            return helpers.formatPrice(
                              amount,
                              countryPricing.currency,
                            );
                          })()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {subscriptionState.currentSubscriptionIsAnnual
                            ? t("pricing.plans.annually")
                            : t("pricing.plans.monthly")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {/* Update Payment Method */}
                    <Button
                      variant="outline"
                      onClick={actions.handleUpdatePaymentMethod}
                      disabled={actions.isUpdatingPaymentMethod}
                      className="flex items-center gap-2"
                    >
                      {actions.isUpdatingPaymentMethod ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Settings className="h-4 w-4" />
                      )}
                      {t("subscription.actions.updatePayment")}
                      <ExternalLink className="h-3 w-3" />
                    </Button>

                    {/* Cancel/Reactivate Subscription */}
                    {subscriptionState.isCancelledButActive ? (
                      <Button
                        onClick={() => setShowReactivateDialog(true)}
                        disabled={actions.isChangingPlan === "reactivate"}
                        className="flex items-center gap-2"
                      >
                        {actions.isChangingPlan === "reactivate" ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        {actions.isChangingPlan === "reactivate"
                          ? t("subscription.actions.reactivating")
                          : t("subscription.actions.reactivate")}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(true)}
                        disabled={actions.isChangingPlan === "cancel"}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        {actions.isChangingPlan === "cancel" ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        {actions.isChangingPlan === "cancel"
                          ? t("subscription.actions.cancelling")
                          : t("subscription.actions.cancel")}
                      </Button>
                    )}

                    {/* View All Plans */}
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("plans")}
                      className="flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      {t("billing.noSubscription.viewPlans")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Plan Features */}
            {currentPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      {t("subscription.planFeatures")}
                    </CardTitle>
                    <CardDescription>
                      {t("subscription.features.description", {
                        plan: t(currentPlan.name),
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentPlan.features?.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{t(feature)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Payment Method Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {t("billing.paymentMethod.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("billing.paymentMethod.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/25">
                    <div className="text-center space-y-4">
                      <CreditCard className="h-8 w-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium">
                          {t("subscription.billing.paymentMethod")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("subscription.billing.managePaymentMethod")}
                        </p>
                      </div>
                      <Button
                        onClick={actions.handleUpdatePaymentMethod}
                        disabled={actions.isUpdatingPaymentMethod}
                        className="flex items-center gap-2"
                      >
                        {actions.isUpdatingPaymentMethod ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Settings className="h-4 w-4" />
                        )}
                        {t("billing.paymentMethod.update")}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Cycle Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t("subscription.billingCycle")}
                  </CardTitle>
                  <CardDescription>
                    {t("subscription.billing.cycleDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {t("subscription.billing.currentCycle")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {subscriptionState.currentSubscriptionIsAnnual
                              ? t("pricing.plans.annually")
                              : t("pricing.plans.monthly")}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {subscriptionState.currentSubscriptionIsAnnual
                            ? t("subscription.billing.annual")
                            : t("subscription.billing.monthly")}
                        </Badge>
                      </div>
                    </div>

                    {subscription.currentPeriodEnd && (
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {subscriptionState.isCancelledButActive
                                ? t("subscription.accessUntil")
                                : t("billing.subscription.nextBilling")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(subscription.currentPeriodEnd)}
                            </p>
                          </div>
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Billing History Tab */}
          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t("billing.history.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("billing.history.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {billingHistory.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-lg font-medium">
                          {t("subscription.billing.empty")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {t("subscription.messages.billingHistoryEmpty")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {billingHistory.map((invoice) => (
                        <motion.div
                          key={invoice.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-muted">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {formatDate(invoice.createdAt)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t("subscription.billing.invoiceNumber", {
                                    id:
                                      invoice.invoiceNumber ||
                                      invoice.id.slice(-8),
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold">
                                  {helpers.formatPrice(
                                    invoice.amount,
                                    invoice.currency,
                                  )}
                                </p>
                                <Badge
                                  variant={
                                    invoice.status === InvoiceStatus.PAID
                                      ? "default"
                                      : invoice.status === InvoiceStatus.OPEN
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {helpers.getInvoiceStatusTranslation(
                                    invoice.status,
                                  )}
                                </Badge>
                              </div>
                              {invoice.invoiceUrl && (
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={invoice.invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    <Download className="h-4 w-4" />
                                    {t("subscription.billing.download")}
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" id="plans" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Pricing Section */}
              <PricingSection
                locale={locale}
                currentUser={user}
                currentSubscription={subscription}
                onPlanSelect={actions.handleSubscribe}
                isProcessing={actions.isChangingPlan !== null}
                onDowngrade={actions.handleDowngrade}
                useHomePageLink={false}
                hideFooterAndHeader={true}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      ) : (
        <PricingSection
          locale={locale}
          currentUser={user}
          currentSubscription={subscription}
          onPlanSelect={actions.handleSubscribe}
          isProcessing={actions.isChangingPlan !== null}
          onDowngrade={actions.handleDowngrade}
          useHomePageLink={false}
          hideFooterAndHeader={true}
        />
      )}

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              {t("subscription.cancellation.confirm.title")}
            </DialogTitle>
            <DialogDescription>
              {t("subscription.cancellation.confirm.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("subscription.cancellation.confirm.warning", {
                  date: subscription?.currentPeriodEnd
                    ? formatDate(subscription.currentPeriodEnd)
                    : t("subscription.billing.fallbackDate"),
                })}
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={actions.isChangingPlan === "cancel"}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={actions.isChangingPlan === "cancel"}
              className="flex items-center gap-2"
            >
              {actions.isChangingPlan === "cancel" ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {actions.isChangingPlan === "cancel"
                ? t("subscription.actions.cancelling")
                : t("subscription.actions.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reactivation Confirmation Dialog */}
      <Dialog
        open={showReactivateDialog}
        onOpenChange={setShowReactivateDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {t("subscription.reactivation.confirm.title")}
            </DialogTitle>
            <DialogDescription>
              {t("subscription.reactivation.confirm.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {t("subscription.reactivation.confirm.benefits")}
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReactivateDialog(false)}
              disabled={actions.isChangingPlan === "reactivate"}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleReactivateSubscription}
              disabled={actions.isChangingPlan === "reactivate"}
              className="flex items-center gap-2"
            >
              {actions.isChangingPlan === "reactivate" ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {actions.isChangingPlan === "reactivate"
                ? t("subscription.actions.reactivating")
                : t("subscription.actions.reactivate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
