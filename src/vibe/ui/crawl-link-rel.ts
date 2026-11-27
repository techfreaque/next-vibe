/** Keep alternate app entry points out of the crawlable link graph. */
export function crawlLinkRel(href: string, rel?: string): string | undefined {
  const isAppLink = /^\/[a-z]{2}-[A-Z]+\/threads(?:[/?#]|$)/.test(href);
  const isSkillVariant = /^\/[a-z]{2}-[A-Z]+\/skill\/[^/?#]+__[^/?#]+/.test(
    href,
  );
  // Sign-up and login are noindex; every CTA variant (?skillId=, ?ref=) is a
  // new URL Googlebot would otherwise queue.
  const isAuthEntry =
    /^\/[a-z]{2}-[A-Z]+\/user\/(?:signup|login)(?:[/?#]|$)/.test(href);
  const isModelPrefill =
    /^\/[a-z]{2}-[A-Z]+\/create\/[^/?#]+\?(?:[^#]*&)?(?:model|modelId|voiceId)=/.test(
      href,
    );

  if (
    !(isAppLink || isSkillVariant || isModelPrefill || isAuthEntry) ||
    rel?.split(/\s+/).includes("nofollow")
  ) {
    return rel;
  }
  return rel ? `${rel} nofollow` : "nofollow";
}
