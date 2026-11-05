export function displayedProse(input?: {
  description?: string | null;
  about?: string | null;
  editorialSummary?: string | null;
}): string;

export function editorProse(
  bundleProse: string,
  pending: { prose: string; replaced?: string } | null | undefined,
): string;

export function mergeAboutEntry(
  existing: Record<string, unknown> | null | undefined,
  description: string | null | undefined,
): Record<string, unknown> | null;
