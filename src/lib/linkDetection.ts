// URL regex pattern
const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

export function extractUrls(text: string): string[] {
  if (!text) return [];
  const matches = text.match(URL_REGEX) || [];
  return [...new Set(matches)]; // Remove duplicates
}

export function detectLinksInTask(description: string, notes: string): string[] {
  const descriptionLinks = extractUrls(description);
  const notesLinks = extractUrls(notes);
  return [...new Set([...descriptionLinks, ...notesLinks])];
}

export function findAllLinks(text: string): string[] {
  return extractUrls(text);
}
