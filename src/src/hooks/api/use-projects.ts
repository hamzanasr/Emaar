'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { FEATURES } from '@/lib/features';
import { mockProjects, mockBids } from '@/lib/mock-data';
import type { Project } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// Projects API Hooks
// ═══════════════════════════════════════════════════════════════

interface ProjectsFilters {
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * List projects (filtered by user role on backend).
 * Falls back to mock data if NEXT_PUBLIC_USE_MOCK_DATA=true.
 */
export function useProjects(filters?: ProjectsFilters) {
  return useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: async () => {
      if (FEATURES.useMockData) {
        const filtered = filters?.status
          ? mockProjects.filter((p) => p.status === filters.status)
          : mockProjects;
        return {
          data: filtered,
          meta: {
            page: 1,
            limit: 20,
            total: filtered.length,
            totalPages: 1,
          },
        };
      }
      return api.getProjects(filters);
    },
  });
}

/**
 * Get a single project by ID.
 */
export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.projects.detail(id) : ['_disabled'],
    enabled: !!id,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        const found = mockProjects.find((p) => p.id === id);
        if (!found) throw new Error('المشروع غير موجود');
        return found;
      }
      return api.getProject(id!);
    },
  });
}

/**
 * Get bids for a project (client/admin view).
 */
export function useProjectBids(projectId: string | undefined) {
  return useQuery({
    queryKey: projectId ? queryKeys.projects.bids(projectId) : ['_disabled'],
    enabled: !!projectId,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        return mockBids.filter((b) => b.projectId === projectId);
      }
      return api.getProjectBids(projectId!);
    },
  });
}

/**
 * Create a new project (CLIENT only).
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => api.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
}

/**
 * Update an existing project.
 */
export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => api.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}

/**
 * Submit a bid on a project (CONTRACTOR).
 */
export function useCreateBid(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; duration: number; proposal: string }) =>
      api.createBid(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.bids(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
    },
  });
}

/**
 * Accept a bid (CLIENT — assigns contractor + moves to IN_PROGRESS).
 */
export function useAcceptBid(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => api.acceptBid(projectId, bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.bids(projectId) });
    },
  });
}
