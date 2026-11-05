export function normalizeJoinedAddress(address?: string | null): string;

export function cityFromAddress(address?: string | null, state?: string | null): string | null;

export function displayLocation(input?: {
  location?: string | null;
  address?: string | null;
  state?: string | null;
}): string;

export function locationAfterAddressEdit(
  record: { location?: string | null; address?: string | null; state?: string | null } | null | undefined,
  address?: string | null,
): string;
