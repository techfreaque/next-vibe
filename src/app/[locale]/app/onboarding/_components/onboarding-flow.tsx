"use client";

import {
  CheckCircle,
  Clock,
  CreditCard,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Container } from "next-vibe-ui/ui/container";
import { Progress } from "next-vibe-ui/ui/progress";
import { useToast } from "next-vibe-ui/ui/use-toast";
import type { JSX } from "react";
import { useCallback, useEffect, useRef } from "react";

import type { BusinessDataResponse } from "@/app/api/[locale]/v1/core/business-data/schema";
import {
  BUSINESS_FORM_TIME,
  CONSULTATION_DURATION,
} from "@/app/api/[locale]/v1/core/consultation/constants";
import { SubscriptionStatus } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { SubscriptionResponseType } from "@/app/api/[locale]/v1/core/subscription/schema";
import type { OnboardingStatusResponseType } from "@/app/api/[locale]/v1/onboarding/schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// This forces the page to be dynamically rendered on every request
export const dynamic = "force-dynamic";

interface OnboardingFlowProps {
  locale: CountryLanguage;
  initialOnboardingStatus: OnboardingStatusResponseType;
  initialBusinessDataCompletionStatus: BusinessDataResponse | null;
  initialSubscription: SubscriptionResponseType | null;
  initialConsultationStatus: {
    isScheduled: boolean;
    scheduledAt?: string;
    consultant?: string;
  } | null;
  urlParams: {
    step?: "pricing" | "consultation" | "questions";
    checkout?: "success" | "failed" | "cancelled";
    payment?: "success" | "cancelled";
  };
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  href: string;
  isCompleted: boolean;
  isEnabled: boolean;
  status: "completed" | "pending";
  badge: string;
}

export function OnboardingFlow({
  locale,
  initialBusinessDataCompletionStatus,
  initialSubscription,
  initialConsultationStatus,
  urlParams,
}: OnboardingFlowProps): JSX.Element {
  const { t } = simpleT(locale);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const urlCleanupProcessedRef = useRef(false);

  // Handle success/cancel messages from Stripe checkout
  const handleStripeRedirectParams = useCallback(() => {
    // Prevent multiple processing of the same URL parameters
    if (urlCleanupProcessedRef.current) {
      return;
    }

    const checkout = searchParams.get("checkout");
    // eslint-disable-next-line i18next/no-literal-string
    const sessionId = searchParams.get("session_id");

    // Only process if we have relevant parameters
    if (!checkout) {
      return;
    }

    urlCleanupProcessedRef.current = true;

    if (checkout === "success" && sessionId) {
      toast({
        title: t("common.success.title"),
        description: t("onboarding.messages.paymentSuccess"),
        variant: "default",
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      // eslint-disable-next-line i18next/no-literal-string
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, t, toast]);

  // Run the redirect parameter handler on component mount
  useEffect(() => {
    handleStripeRedirectParams();
  }, [handleStripeRedirectParams]);

  // Check consultation status from server-provided data
  const hasScheduledConsultation = Boolean(
    initialConsultationStatus?.isScheduled,
  );

  // Calculate completion status from business data completion status
  const hasBusinessData = Boolean(
    initialBusinessDataCompletionStatus?.completionStatus?.overall?.isComplete,
  );
  const hasActiveSubscription = Boolean(
    initialSubscription?.planId &&
      (initialSubscription.status === SubscriptionStatus.ACTIVE ||
        initialSubscription.status === SubscriptionStatus.TRIALING),
  );
  const businessInfoTask: OnboardingTask = {
    id: "business-info",
    title: t("onboarding.tasks.businessInfo.title"),
    description: hasBusinessData
      ? t("onboarding.tasks.businessInfo.completedDescription")
      : t("onboarding.tasks.businessInfo.description", {
          minutes: BUSINESS_FORM_TIME.COMPLETION_TIME_MINUTES,
        }),
    icon: <User className="h-6 w-6" />,
    href: `/${locale}/app/business-info`,
    isCompleted: hasBusinessData,
    isEnabled: true,
    status: hasBusinessData ? "completed" : "pending",
    badge: hasBusinessData
      ? t("onboarding.tasks.businessInfo.completedBadge")
      : t("onboarding.tasks.businessInfo.badge"),
  };

  const subscriptionTask: OnboardingTask = {
    id: "subscription",
    title: t("onboarding.tasks.subscription.title"),
    description: hasActiveSubscription
      ? t("onboarding.tasks.subscription.completedDescription")
      : t("onboarding.tasks.subscription.description"),
    icon: <CreditCard className="h-6 w-6" />,
    href: `/${locale}/app/subscription`,
    isCompleted: hasActiveSubscription,
    isEnabled: true,
    status: hasActiveSubscription ? "completed" : "pending",
    badge: hasActiveSubscription
      ? t("onboarding.tasks.subscription.completedBadge")
      : t("onboarding.tasks.subscription.badge"),
  };

  const consultationTask: OnboardingTask = {
    id: "consultation",
    title: t("onboarding.tasks.consultation.title"),
    description: hasScheduledConsultation
      ? t("onboarding.tasks.consultation.completedDescription")
      : t("onboarding.tasks.consultation.description", {
          minDuration: CONSULTATION_DURATION.MIN_DURATION_MINUTES,
          maxDuration: CONSULTATION_DURATION.MAX_DURATION_MINUTES,
        }),
    icon: <MessageSquare className="h-6 w-6" />,
    href: `/${locale}/app/consultation/onboarding`,
    isCompleted: hasScheduledConsultation,
    isEnabled: true,
    status: hasScheduledConsultation ? "completed" : "pending",
    badge: hasScheduledConsultation
      ? t("onboarding.tasks.consultation.completedBadge")
      : t("onboarding.tasks.consultation.badge"),
  };

  const tasks: OnboardingTask[] = [
    businessInfoTask,
    subscriptionTask,
    consultationTask,
  ];

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;
  const allTasksCompleted = completedTasks === totalTasks;

  return (
    <Container size="lg" className="py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {t("onboarding.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {allTasksCompleted
            ? t("onboarding.detailedDescription.completed")
            : t("onboarding.detailedDescription.inProgress")}
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{t("onboarding.progress.label")}</span>
            <span>
              {completedTasks} / {totalTasks}{" "}
              {t("onboarding.progress.completed")}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </div>

      {/* Status Messages */}
      {urlParams.checkout === "success" && (
        <div className="mb-8">
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-200 font-medium">
                  {t("onboarding.messages.paymentSuccess")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tasks Grid */}
      <div
        id="onboarding-tasks"
        className="grid gap-6 md:grid-cols-1 lg:grid-cols-3"
      >
        {tasks.map((task) => (
          <OnboardingTaskCard
            key={task.id}
            locale={locale}
            task={task}
            hasScheduledConsultation={hasScheduledConsultation}
          />
        ))}
      </div>
      {/* Service Status Alert */}
      {!allTasksCompleted && (
        <div className="mt-6 max-w-2xl mx-auto">
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  {t("onboarding.messages.serviceNotReady")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Container>
  );
}

interface OnboardingTaskCardProps {
  task: OnboardingTask;
  locale: CountryLanguage;
  hasScheduledConsultation: boolean;
}

function OnboardingTaskCard({
  task,
  locale,
  hasScheduledConsultation,
}: OnboardingTaskCardProps): JSX.Element {
  const { t } = simpleT(locale);

  const getStatusIcon = (): JSX.Element => {
    switch (task.status) {
      case "completed":
        return (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "pending":
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getCardClassName = (): string => {
    const baseClassName = [
      "transition-all",
      "duration-200",
      "hover:shadow-md",
      "cursor-pointer",
      "h-full",
    ].join(" ");

    switch (task.status) {
      case "completed":
        return [
          baseClassName,
          CSS_CLASSES.COMPLETED_BORDER,
          CSS_CLASSES.COMPLETED_BG,
        ].join(" ");
      case "pending":
        return [
          baseClassName,
          CSS_CLASSES.PENDING_BORDER,
          CSS_CLASSES.PENDING_BG,
        ].join(" ");
      default:
        return [
          baseClassName,
          CSS_CLASSES.PENDING_BORDER,
          CSS_CLASSES.PENDING_BG,
        ].join(" ");
    }
  };

  const getBadgeVariant = ():
    | "default"
    | "secondary"
    | "destructive"
    | "outline" => {
    if (task.id === "consultation") {
      return "default"; // Primary badge for consultation
    }
    return "secondary"; // Secondary for optional tasks
  };

  const getButtonText = (): string => {
    if (task.isCompleted) {
      return t("onboarding.actions.review");
    }

    switch (task.id) {
      case "consultation":
        return t("onboarding.actions.startConsultation");
      case "business-info":
        return t("onboarding.actions.completeBusinessInfo");
      case "subscription":
        return t("onboarding.actions.choosePlan");
      default:
        return t("onboarding.actions.start");
    }
  };

  const getButtonVariant = ():
    | "default"
    | "ghost"
    | "outline"
    | "secondary" => {
    if (task.isCompleted) {
      return "ghost";
    }

    // If consultation is not scheduled, it gets priority (default/primary)
    if (!hasScheduledConsultation && task.id === "consultation") {
      return "default";
    }

    // If consultation is scheduled, other incomplete tasks get the same style as consultation (default/black)
    if (
      hasScheduledConsultation &&
      !task.isCompleted &&
      task.id !== "consultation"
    ) {
      return "default";
    }

    // Default for incomplete optional tasks when consultation not scheduled
    return "outline";
  };

  return (
    <Card className={getCardClassName()}>
      <div className="flex flex-col h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/80 dark:bg-background/60 border border-border/50">
                {task.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {task.badge && (
                    <Badge variant={getBadgeVariant()} className="text-xs">
                      {task.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
              </div>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <CardDescription className="text-sm leading-relaxed flex-1">
            {task.description}
          </CardDescription>
          <div className="mt-4">
            <Button
              size="sm"
              variant={getButtonVariant()}
              className="w-full"
              asChild
            >
              <Link href={task.href as `/${string}`}>{getButtonText()}</Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

const CSS_CLASSES = {
  COMPLETED_BORDER: "border-green-200 dark:border-green-800",
  COMPLETED_BG: "bg-green-50/50 dark:bg-green-950/30",
  PENDING_BORDER: "border-blue-200 dark:border-blue-800",
  PENDING_BG: "bg-blue-50/50 dark:bg-blue-950/30",
} as const;
