/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";
import { Details } from "next-vibe-ui/ui/details";
import { Div } from "next-vibe-ui/ui/div";
import { AnimatePresence, MotionDiv } from "next-vibe-ui/ui/motion";
import { Section } from "next-vibe-ui/ui/section";
import { Summary } from "next-vibe-ui/ui/summary";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useState } from "react";

import { Button } from "next-vibe-ui/ui/button";

export function AdvancedPreview(): JSX.Element {
  const [showMotion, setShowMotion] = useState(true);

  return (
    <Div className="space-y-8">
      <Section>
        <H2 className="mb-4">Advanced Components</H2>

        <Div className="space-y-6">
          {/* Details / Summary */}
          <Div className="space-y-2">
            <H3>Details / Summary (Native HTML)</H3>
            <Div className="space-y-2">
              <Details className="rounded-md border p-4">
                <Summary className="cursor-pointer font-medium">
                  Click to expand details
                </Summary>
                <P className="mt-2 text-muted-foreground">
                  This is the expanded content inside the details element. It
                  uses the native HTML details/summary pattern.
                </P>
              </Details>
              <Details className="rounded-md border p-4" open>
                <Summary className="cursor-pointer font-medium">
                  Open by default
                </Summary>
                <P className="mt-2 text-muted-foreground">
                  This details element starts in an expanded state.
                </P>
              </Details>
            </Div>
          </Div>

          {/* Motion / Animation */}
          <Div className="space-y-2">
            <H3>Motion / Animation</H3>
            <Div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowMotion(!showMotion)}
              >
                {showMotion ? "Hide" : "Show"} animated element
              </Button>
              <AnimatePresence>
                {showMotion && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-md border bg-muted p-6"
                  >
                    <P>This element animates in and out with framer-motion.</P>
                  </MotionDiv>
                )}
              </AnimatePresence>

              <Div className="grid gap-4 md:grid-cols-3">
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-md border bg-card p-4 cursor-pointer"
                >
                  <P className="text-center">Scale entrance</P>
                </MotionDiv>
                <MotionDiv
                  animate={{ rotate: 5 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="rounded-md border bg-card p-4"
                >
                  <P className="text-center">Continuous wobble</P>
                </MotionDiv>
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="rounded-md border bg-card p-4"
                >
                  <P className="text-center">Delayed fade in</P>
                </MotionDiv>
              </Div>
            </Div>
          </Div>
        </Div>
      </Section>
    </Div>
  );
}
