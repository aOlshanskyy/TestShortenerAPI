import type { ShortLink } from "./types.js";

const links = new Map<string, ShortLink>();

export function saveLink(link: ShortLink): void {
  links.set(link.code, link);
}

export function getLink(code: string): ShortLink | undefined {
  return links.get(code);
}

export function incrementClicks(code: string): ShortLink | undefined {
  const link = links.get(code);
  if (!link) return undefined;
  link.clicks += 1;
  return link;
}

/** тільки для тестів */
export function clearStore(): void {
  links.clear();
}