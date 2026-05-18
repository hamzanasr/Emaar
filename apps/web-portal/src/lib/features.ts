/**
 * Feature flags & runtime mode detection.
 *
 * Controls whether the app uses mock data or hits the real backend.
 * Toggle via NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local during development
 * before the backend is running.
 */

export const FEATURES = {
  /**
   * When true, hooks return mock data instantly without hitting the API.
   * Falls back to mock data on API errors as well (fail-open).
   */
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
} as const;

/**
 * Helper: returns true if we should currently use mock data.
 * Useful inside hooks to short-circuit API calls.
 */
export function shouldUseMock(): boolean {
  return FEATURES.useMockData;
}
