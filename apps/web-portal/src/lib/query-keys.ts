/**
 * Centralized React Query keys factory.
 * Pattern: hierarchical & invalidation-friendly.
 *
 * Usage:
 *   queryKeys.projects.list({ status: 'IN_PROGRESS' })  // ['projects', 'list', {...}]
 *   queryKeys.projects.detail('abc')                    // ['projects', 'detail', 'abc']
 *   queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })  // invalidates ALL project queries
 */

export const queryKeys = {
  // ─── Auth / User ──────────────────────────────────────────────
  user: {
    all: () => ['user'] as const,
    me: () => [...queryKeys.user.all(), 'me'] as const,
  },

  // ─── Reference (regions, categories) ──────────────────────────
  reference: {
    all: () => ['reference'] as const,
    regions: () => [...queryKeys.reference.all(), 'regions'] as const,
    categories: (parentId?: string) =>
      [...queryKeys.reference.all(), 'categories', { parentId }] as const,
  },

  // ─── Projects ─────────────────────────────────────────────────
  projects: {
    all: () => ['projects'] as const,
    lists: () => [...queryKeys.projects.all(), 'list'] as const,
    list: (filters?: { status?: string; page?: number; limit?: number }) =>
      [...queryKeys.projects.lists(), filters || {}] as const,
    details: () => [...queryKeys.projects.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    bids: (projectId: string) =>
      [...queryKeys.projects.detail(projectId), 'bids'] as const,
  },

  // ─── Milestones ───────────────────────────────────────────────
  milestones: {
    all: () => ['milestones'] as const,
    project: (projectId: string) =>
      [...queryKeys.milestones.all(), 'project', projectId] as const,
    detail: (id: string) => [...queryKeys.milestones.all(), 'detail', id] as const,
  },

  // ─── Escrow ───────────────────────────────────────────────────
  escrow: {
    all: () => ['escrow'] as const,
    project: (projectId: string) =>
      [...queryKeys.escrow.all(), 'project', projectId] as const,
  },

  // ─── Marketplace ──────────────────────────────────────────────
  marketplace: {
    all: () => ['marketplace'] as const,
    products: (filters?: { q?: string; categoryId?: string }) =>
      [...queryKeys.marketplace.all(), 'products', filters || {}] as const,
    product: (id: string) =>
      [...queryKeys.marketplace.all(), 'product', id] as const,
    store: (id: string) =>
      [...queryKeys.marketplace.all(), 'store', id] as const,
  },

  // ─── Chat ─────────────────────────────────────────────────────
  chat: {
    all: () => ['chat'] as const,
    rooms: () => [...queryKeys.chat.all(), 'rooms'] as const,
    messages: (roomId: string) =>
      [...queryKeys.chat.all(), 'messages', roomId] as const,
  },

  // ─── Notifications ────────────────────────────────────────────
  notifications: {
    all: () => ['notifications'] as const,
    list: () => [...queryKeys.notifications.all(), 'list'] as const,
  },
} as const;
