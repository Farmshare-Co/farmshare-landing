export const SITE: string;
export const EXCLUDED_SLUGS: string[];
export const STATE_NAMES: Record<string, string>;

export const HOME_TITLE: string;
export const FEATURES_TITLE: string;
export const FEATURES_DESCRIPTION: string;
export const FEATURES_H1: string;

export interface DirectoryProcessor {
  name: string;
  location: string;
  state: string;
  species?: string[];
  slug: string;
  status: string;
  address?: string;
  zip?: string;
  phone?: string;
  website?: string;
  description?: string;
  lat?: number;
  lng?: number;
  partnerSlug?: string;
  partnerFacilities?: { slug: string; label: string }[];
  logo?: string | null;
  rating?: number;
  userRatingCount?: number;
  hours?: string[];
  editorialSummary?: string;
  alternateName?: string | string[];
  businessStatus?: string;
}

export interface AboutEntry {
  about?: string;
}

export function isExcludedSlug(slug: string): boolean;
export function canonicalUrl(path: string): string;
export function cityStateLabel(processor: DirectoryProcessor): string;
export function usesFarmshareScheduling(processor: DirectoryProcessor): boolean;
export function mentionsDeer(processor: DirectoryProcessor, aboutText?: string): boolean;
export function processorTitle(processor: DirectoryProcessor): string;
export function processorH1(processor: DirectoryProcessor): string;
export function processorDescription(processor: DirectoryProcessor, aboutText?: string): string;
export function stateTitle(stateName: string): string;
export function stateDescription(
  stateName: string,
  stateProcessors: DirectoryProcessor[],
  aboutBySlug?: Record<string, AboutEntry>,
): string;
export function homeDescription(stats: { facilities: number; states: number; producers: number }): string;
export function directoryTitle(): string;
export function directoryDescription(count: number): string;
export function speciesTitle(display: string): string;
export function speciesDescription(display: string, count: number): string;
export function absoluteWebsite(raw?: string | null): string | null;
export function alternateNames(processor: DirectoryProcessor): string[];
export function processorJsonLd(processor: DirectoryProcessor, aboutText?: string): Record<string, unknown>;
