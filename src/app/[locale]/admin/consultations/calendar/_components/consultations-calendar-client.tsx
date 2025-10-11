/**
 * Consultations Calendar Client Component
 * Calendar view for consultation management
 */

"use client";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { EndpointFormField, Form } from "next-vibe-ui/ui";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import type React from "react";
import { useEffect, useState } from "react";

import { useConsultationsListEndpoint } from "@/app/api/[locale]/v1/core/consultation/admin/hooks";
import type { ConsultationAdminListGetResponseTypeOutput } from "@/app/api/[locale]/v1/core/consultation/admin/list/definition";
import consultationsListDefinition from "@/app/api/[locale]/v1/core/consultation/admin/list/definition";
import {
  ConsultationStatus,
  ConsultationStatusFilterOptions,
  type ConsultationStatusValue,
} from "@/app/api/[locale]/v1/core/consultation/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface ConsultationsCalendarClientProps {
  locale: CountryLanguage;
}

export function ConsultationsCalendarClient({
  locale,
}: ConsultationsCalendarClientProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const consultationsEndpoint = useConsultationsListEndpoint();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);

  // Load consultations on component mount and when date changes
  useEffect(() => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    consultationsEndpoint.read.form.setValue(
      "dateFrom",
      startOfMonth.toISOString(),
    );
    consultationsEndpoint.read.form.setValue(
      "dateTo",
      endOfMonth.toISOString(),
    );
    consultationsEndpoint.read.form.setValue("limit", 100); // Get more results for calendar view
    void consultationsEndpoint.read.refetch();
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]); // Only depend on currentDate

  const apiResponse = consultationsEndpoint.read.response;
  const consultations: ConsultationAdminListGetResponseTypeOutput["consultations"] =
    apiResponse?.success ? apiResponse.data.consultations : [];
  const isLoading = consultationsEndpoint.read.isLoading;
  const navigateMonth = (direction: "prev" | "next"): void => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
  };

  const getStatusBadgeVariant = (
    status: typeof ConsultationStatusValue,
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return "secondary";
      case ConsultationStatus.SCHEDULED:
        return "default";
      case ConsultationStatus.CONFIRMED:
        return "default";
      case ConsultationStatus.COMPLETED:
        return "default";
      case ConsultationStatus.CANCELLED:
        return "destructive";
      case ConsultationStatus.NO_SHOW:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusTranslationKey = (
    status: typeof ConsultationStatusValue,
  ): TranslationKey => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return "consultations.admin.stats.pending" as const;
      case ConsultationStatus.SCHEDULED:
        return "consultations.admin.stats.scheduled" as const;
      case ConsultationStatus.CONFIRMED:
        return "consultations.admin.stats.confirmed" as const;
      case ConsultationStatus.COMPLETED:
        return "consultations.admin.stats.completed" as const;
      case ConsultationStatus.CANCELLED:
        return "consultations.admin.stats.cancelled" as const;
      case ConsultationStatus.NO_SHOW:
        return "consultations.admin.stats.noShow" as const;
      default:
        return "consultations.admin.stats.pending" as const;
    }
  };

  // Group consultations by date
  const consultationsByDate = consultations.reduce(
    (acc, consultation) => {
      const date = consultation.scheduledDate || consultation.preferredDate;
      if (date) {
        const dateKey = new Date(date).toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(consultation);
      }
      return acc;
    },
    {} as Record<
      string,
      ConsultationAdminListGetResponseTypeOutput["consultations"][0][]
    >,
  );

  const monthName = currentDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t("consultations.admin.calendar.title")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {t("consultations.admin.list.filters.all")}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <Form
              form={consultationsEndpoint.read.form}
              onSubmit={() => {}}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EndpointFormField
                  name="status"
                  config={{
                    type: "select",
                    label: undefined,
                    placeholder: "consultations.admin.list.filters.all",
                    options: ConsultationStatusFilterOptions,
                  }}
                  control={consultationsEndpoint.read.form.control}
                  schema={consultationsListDefinition.GET.requestSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
                <EndpointFormField
                  name="search"
                  config={{
                    type: "text",
                    label: undefined,
                    placeholder: "consultations.admin.list.search",
                  }}
                  control={consultationsEndpoint.read.form.control}
                  schema={consultationsListDefinition.GET.requestSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
                <EndpointFormField
                  name="userEmail"
                  config={{
                    type: "email",
                    label: undefined,
                    placeholder: "consultations.admin.list.filters.userEmail",
                  }}
                  control={consultationsEndpoint.read.form.control}
                  schema={consultationsListDefinition.GET.requestSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </Form>
          </CardContent>
        )}
      </Card>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">{monthName}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              {t("consultations.admin.calendar.view.today")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("consultations.admin.description")}
            </div>
          ) : Object.keys(consultationsByDate).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("consultations.admin.calendar.event.noEvents")}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(consultationsByDate)
                .sort(
                  ([a], [b]) => new Date(a).getTime() - new Date(b).getTime(),
                )
                .map(([dateKey, dayConsultations]) => (
                  <div key={dateKey} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">
                      {new Date(dateKey).toLocaleDateString(locale, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <div className="space-y-2">
                      {dayConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-md"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={getStatusBadgeVariant(
                                  consultation.status,
                                )}
                              >
                                {t(
                                  getStatusTranslationKey(consultation.status),
                                )}
                              </Badge>
                              <span className="text-sm font-medium">
                                {consultation.userName ||
                                  t("consultations.admin.title")}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {consultation.userEmail}
                              {consultation.userBusinessType && (
                                <span> • {consultation.userBusinessType}</span>
                              )}
                            </div>
                            {consultation.message && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {consultation.message.length > 100
                                  ? `${consultation.message.substring(0, 100)}...`
                                  : consultation.message}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">
                              {consultation.scheduledTime ||
                                consultation.preferredTime ||
                                ""}
                            </div>
                            <Link
                              href={`/${locale}/admin/consultations/consultation/${consultation.id}`}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
