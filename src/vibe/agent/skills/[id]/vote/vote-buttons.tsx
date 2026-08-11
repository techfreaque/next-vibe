/**
 * SkillVoteButtons
 * Inline up/down vote control for a community skill. Calls the vote endpoint
 * directly via apiClient.mutate (no widget nav-stack / EndpointsPage embedding),
 * applies the resulting state optimistically, and shows the net score.
 *
 * Re-clicking the active direction clears the vote; clicking the opposite flips
 * it — mirroring the server's toggle semantics.
 */

"use client";
import { Button } from "next-vibe/ui/components/button";
import { ThumbsDown } from "next-vibe/ui/components/icons/ThumbsDown";
import { ThumbsUp } from "next-vibe/ui/components/icons/ThumbsUp";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetContext,
  useWidgetLogger,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { type JSX, useCallback, useState } from "react";

import type { SkillVoteDirectionValue } from "../../enum";
import { SkillVoteDirection } from "../../enum";
import voteDefinition from "./definition";

type VoteDir = typeof SkillVoteDirectionValue;

interface SkillVoteButtonsProps {
  /** Skill id or slug to vote on. */
  skillId: string;
  /** The user's existing vote, if known. */
  initialUserVote?: VoteDir | null;
  /** The current net score, if known. */
  initialVoteCount?: number | null;
  /** Compact icon-only sizing for tight rows. */
  size?: "sm" | "default";
  className?: string;
}

export function SkillVoteButtons({
  skillId,
  initialUserVote = null,
  initialVoteCount = null,
  size = "default",
  className,
}: SkillVoteButtonsProps): JSX.Element {
  const { user, locale } = useWidgetContext();
  const logger = useWidgetLogger();

  const [userVote, setUserVote] = useState<VoteDir | null>(initialUserVote);
  const [voteCount, setVoteCount] = useState<number | null>(initialVoteCount);
  const [pending, setPending] = useState(false);

  const submit = useCallback(
    async (direction: VoteDir): Promise<void> => {
      if (pending) {
        return;
      }
      setPending(true);

      // Optimistic update: same direction clears, opposite/new sets it.
      const prevVote = userVote;
      const prevCount = voteCount;
      const cleared = prevVote === direction;
      const nextVote = cleared ? null : direction;
      if (prevCount !== null) {
        const delta = voteDelta(prevVote, nextVote);
        setVoteCount(prevCount + delta);
      }
      setUserVote(nextVote);

      try {
        const res = await apiClient.mutate(
          voteDefinition.POST,
          logger,
          user,
          { direction },
          { id: skillId },
          locale,
        );
        if (res?.success) {
          setUserVote(res.data.userVote);
          setVoteCount(res.data.voteCount);
        } else {
          // Roll back on failure.
          setUserVote(prevVote);
          setVoteCount(prevCount);
        }
      } catch (error) {
        setUserVote(prevVote);
        setVoteCount(prevCount);
        logger.error("SkillVoteButtons.submit failed", {
          error: String(error),
        });
      } finally {
        setPending(false);
      }
    },
    [pending, userVote, voteCount, logger, user, skillId, locale],
  );

  const isSmall = size === "sm";
  const btnSize = isSmall ? "h-7 w-7 p-0" : "h-9 w-9 p-0";
  const iconSize = isSmall ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <Span className={cn("inline-flex items-center gap-0.5", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending}
        aria-pressed={userVote === SkillVoteDirection.UP}
        className={cn(
          btnSize,
          "inline-flex items-center justify-center",
          userVote === SkillVoteDirection.UP &&
            "text-primary bg-primary/10 hover:bg-primary/15",
        )}
        onClick={(e) => {
          e.stopPropagation();
          void submit(SkillVoteDirection.UP);
        }}
      >
        <ThumbsUp className={iconSize} />
      </Button>

      {voteCount !== null && (
        <Span
          className={cn(
            "min-w-[1.5ch] text-center tabular-nums",
            isSmall ? "text-xs" : "text-sm",
            voteCount > 0 && "text-primary",
            voteCount < 0 && "text-destructive",
            voteCount === 0 && "text-muted-foreground",
          )}
        >
          {voteCount}
        </Span>
      )}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending}
        aria-pressed={userVote === SkillVoteDirection.DOWN}
        className={cn(
          btnSize,
          "inline-flex items-center justify-center",
          userVote === SkillVoteDirection.DOWN &&
            "text-destructive bg-destructive/10 hover:bg-destructive/15",
        )}
        onClick={(e) => {
          e.stopPropagation();
          void submit(SkillVoteDirection.DOWN);
        }}
      >
        <ThumbsDown className={iconSize} />
      </Button>
    </Span>
  );
}

function voteScore(vote: VoteDir | null): number {
  return vote === SkillVoteDirection.UP
    ? 1
    : vote === SkillVoteDirection.DOWN
      ? -1
      : 0;
}

/**
 * Net-score delta for an optimistic update when a user's vote changes from
 * `prev` to `next`. UP contributes +1, DOWN contributes -1, none contributes 0.
 */
function voteDelta(prev: VoteDir | null, next: VoteDir | null): number {
  return voteScore(next) - voteScore(prev);
}
