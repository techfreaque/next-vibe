"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "next-vibe-ui/ui/avatar";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface Testimonial {
  id: number;
  name: TranslationKey;
  // role: TranslationKey;
  // company: TranslationKey;
  content: TranslationKey;
  avatar: TranslationKey;
  rating: number;
}

export default function Testimonials({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "testimonials.clients.clientA.author",
      // role: "testimonials.clients.clientA.role",
      // company: "testimonials.clients.clientA.companyName",
      content: "testimonials.clients.clientA.quote",
      avatar: "testimonials.clients.clientA.avatar",
      rating: 5,
    },
    {
      id: 2,
      name: "testimonials.clients.clientB.author",
      // role: "testimonials.clients.clientB.role",
      // company: "testimonials.clients.clientB.companyName",
      content: "testimonials.clients.clientB.quote",
      avatar: "testimonials.clients.clientB.avatar",
      rating: 5,
    },
    {
      id: 3,
      name: "testimonials.clients.clientC.author",
      // role: "testimonials.clients.clientC.role",
      // company: "testimonials.clients.clientC.companyName",
      content: "testimonials.clients.clientC.quote",
      avatar: "testimonials.clients.clientC.avatar",
      rating: 5,
    },
    {
      id: 4,
      name: "testimonials.clients.clientD.author",
      // role: "testimonials.clients.clientD.role",
      // company: "testimonials.clients.clientD.companyName",
      content: "testimonials.clients.clientD.quote",
      avatar: "testimonials.clients.clientD.avatar",
      rating: 5,
    },
    {
      id: 5,
      name: "testimonials.clients.clientE.author",
      // role: "testimonials.clients.clientE.role",
      // company: "testimonials.clients.clientE.companyName",
      content: "testimonials.clients.clientE.quote",
      avatar: "testimonials.clients.clientE.avatar",
      rating: 5,
    },
    {
      id: 6,
      name: "testimonials.clients.clientF.author",
      // role: "testimonials.clients.clientF.role",
      // company: "testimonials.clients.clientF.companyName",
      content: "testimonials.clients.clientF.quote",
      avatar: "testimonials.clients.clientF.avatar",
      rating: 5,
    },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1,
        );
      }, 5000);
    }

    return (): void => interval && clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const handlePrev = (): void => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = (): void => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 w-full" ref={ref}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Star className="h-3.5 w-3.5 mr-1 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
            <span className="font-medium">{t("testimonials.badge")}</span>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("testimonials.title")}
          </motion.h2>

          <motion.p
            className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("testimonials.subtitle")}
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-14 w-14 border-2 border-gray-100 dark:border-gray-800">
                          <AvatarImage
                            src={t(testimonial.avatar) || "/placeholder.svg"}
                            alt={t(testimonial.name)}
                          />
                          <AvatarFallback>
                            {t(testimonial.name).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">
                            {t(testimonial.name)}
                          </p>
                          {/* <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t(testimonial.role)}, {t(testimonial.company)}
                          </p> */}
                        </div>
                      </div>

                      <div className="flex mb-6">
                        {[...Array<number>(5)].map((_, i) => (
                          <Star
                            // eslint-disable-next-line i18next/no-literal-string
                            key={`star_${i}_${testimonial.id}`}
                            className={`h-5 w-5 ${
                              i < testimonial.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-gray-200 dark:text-gray-700 opacity-50" />
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed pl-6">
                          {t(testimonial.content)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handlePrev}
              aria-label={t("testimonials.ariaLabels.previousTestimonial")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((testimonial, index) => (
                <button
                  key={`dot_${index}_${testimonial.id}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-blue-600 dark:bg-blue-400"
                      : "w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                  type="button"
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(index);
                  }}
                  aria-label={t("testimonials.ariaLabels.goToTestimonial", {
                    index: index + 1,
                  })}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleNext}
              aria-label={t("testimonials.ariaLabels.nextTestimonial")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
