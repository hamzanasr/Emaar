import type {
  AuthTokens,
  User,
  UserRole,
  Project,
  Milestone,
  EscrowTransaction,
  Bid,
  Product,
  Order,
  Region,
  Category,
  Notification,
  ChatRoom,
  ChatMessage,
} from '@emaar/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ═══════════════════════════════════════════════════════════════
// DEMO MODE — Auto-login with fixed OTP
// ═══════════════════════════════════════════════════════════════
export const DEMO_MODE = true;
export const DEMO_OTP = '1234';

// Demo user for instant login
const DEMO_USER: User = {
  id: 'demo-user-001',
  phone: '+966500000001',
  email: 'demo@emaar.sa',
  fullNameAr: 'مستخدم تجريبي',
  fullNameEn: 'Demo User',
  role: 'CLIENT',
  isActive: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ─── Error Class ───────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Response Shapes ────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User & { isNewUser: boolean };
}

// ─── API Client ────────────────────────────────────────────────
class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  setToken(token: string) {
    this.accessToken = token;
  }
  setRefreshToken(token: string) {
    this.refreshToken = token;
  }
  clearToken() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept-Language': 'ar',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    // Auto-refresh on 401
    if (
      response.status === 401 &&
      !isRetry &&
      this.refreshToken &&
      endpoint !== '/auth/refresh'
    ) {
      try {
        const newAccessToken = await this.refreshAccessToken();
        this.accessToken = newAccessToken;
        return this.request<T>(endpoint, options, true);
      } catch {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/ar/login';
        }
        throw new ApiError(401, 'انتهت الجلسة. الرجاء تسجيل الدخول مجدداً.');
      }
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new ApiError(response.status, 'استجابة غير صالحة من الخادم');
    }

    if (!response.ok) {
      const err = body as { message?: string; errors?: unknown };
      throw new ApiError(response.status, err.message || 'فشل الطلب', err.errors);
    }

    return body as T;
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = (async () => {
      try {
        const result = await this.request<ApiResponse<AuthTokens>>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
        return result.data.accessToken;
      } finally {
        this.refreshPromise = null;
      }
    })();
    return this.refreshPromise;
  }

  /** Helper: build query string from params */
  private qs(params?: Record<string, unknown>): string {
    if (!params) return '';
    const filtered = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    );
    if (filtered.length === 0) return '';
    return '?' + filtered.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
  }

  /** Helper: unwrap { success, data } envelope */
  private async unwrap<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
    const res = await promise;
    return res.data;
  }

  // ═══════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════

  async sendOtp(phone: string) {
    if (DEMO_MODE) {
      // In demo mode, OTP is always 1234 — no API call needed
      return { message: 'رمز التحقق التجريبي: 1234', expiresIn: 300 };
    }
    return this.request<ApiResponse<{ message: string; expiresIn: number }>>(
      '/auth/otp/send',
      { method: 'POST', body: JSON.stringify({ phone }) },
    ).then((r) => r.data);
  }

  async verifyOtp(phone: string, code: string): Promise<VerifyOtpResponse> {
    if (DEMO_MODE && code === DEMO_OTP) {
      // In demo mode, any phone with code 1234 logs in instantly
      const demoResponse: VerifyOtpResponse = {
        accessToken: 'demo-access-token',
        refreshToken: 'demo-refresh-token',
        expiresIn: 86400,
        user: { ...DEMO_USER, isNewUser: false, phone },
      };
      return demoResponse;
    }
    return this.unwrap(
      this.request<ApiResponse<VerifyOtpResponse>>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      }),
    );
  }

  async logout(refreshToken: string) {
    return this.unwrap(
      this.request<ApiResponse<{ message: string }>>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════════════════════════

  async getCurrentUser() {
    return this.unwrap(this.request<ApiResponse<User>>('/users/me'));
  }

  async updateProfile(data: Partial<{
    fullNameAr: string;
    fullNameEn: string;
    email: string;
    regionId: string;
    role: UserRole;
  }>) {
    return this.unwrap(
      this.request<ApiResponse<User>>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // REFERENCE (regions, categories) — public
  // ═══════════════════════════════════════════════════════════════

  async getRegions() {
    return this.unwrap(this.request<ApiResponse<Region[]>>('/reference/regions'));
  }

  async getCategories(parentId?: string) {
    return this.unwrap(
      this.request<ApiResponse<Category[]>>(`/reference/categories${this.qs({ parentId })}`),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════════════════

  async getProjects(params?: { status?: string; page?: number; limit?: number }) {
    return this.unwrap(
      this.request<ApiResponse<PaginatedResponse<Project>>>(`/projects${this.qs(params)}`),
    );
  }

  async getProject(id: string) {
    return this.unwrap(this.request<ApiResponse<Project>>(`/projects/${id}`));
  }

  async createProject(data: Partial<Project>) {
    return this.unwrap(
      this.request<ApiResponse<Project>>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    );
  }

  async updateProject(id: string, data: Partial<Project>) {
    return this.unwrap(
      this.request<ApiResponse<Project>>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    );
  }

  async getProjectBids(projectId: string) {
    return this.unwrap(
      this.request<ApiResponse<Bid[]>>(`/projects/${projectId}/bids`),
    );
  }

  async createBid(
    projectId: string,
    data: { amount: number; duration: number; proposal: string },
  ) {
    return this.unwrap(
      this.request<ApiResponse<Bid>>(`/projects/${projectId}/bids`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    );
  }

  async acceptBid(projectId: string, bidId: string) {
    return this.unwrap(
      this.request<ApiResponse<Project>>(`/projects/${projectId}/bids/${bidId}/accept`, {
        method: 'POST',
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MILESTONES
  // ═══════════════════════════════════════════════════════════════

  async submitMilestone(milestoneId: string, data: { proofMedia?: unknown[] }) {
    return this.unwrap(
      this.request<ApiResponse<Milestone>>(`/milestones/${milestoneId}/submit`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    );
  }

  async approveMilestone(milestoneId: string) {
    return this.unwrap(
      this.request<ApiResponse<Milestone>>(`/milestones/${milestoneId}/approve`, {
        method: 'PATCH',
      }),
    );
  }

  async rejectMilestone(milestoneId: string, reason: string) {
    return this.unwrap(
      this.request<ApiResponse<Milestone>>(`/milestones/${milestoneId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ESCROW
  // ═══════════════════════════════════════════════════════════════

  async depositEscrow(milestoneId: string, paymentMethod?: string) {
    return this.unwrap(
      this.request<ApiResponse<EscrowTransaction>>('/escrow/deposit', {
        method: 'POST',
        body: JSON.stringify({ milestoneId, paymentMethod }),
      }),
    );
  }

  async getProjectEscrow(projectId: string) {
    return this.unwrap(
      this.request<ApiResponse<EscrowTransaction[]>>(`/escrow/project/${projectId}`),
    );
  }

  async releaseEscrow(escrowId: string) {
    return this.unwrap(
      this.request<ApiResponse<EscrowTransaction>>(`/escrow/${escrowId}/release`, {
        method: 'POST',
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MARKETPLACE
  // ═══════════════════════════════════════════════════════════════

  async getProducts(params?: { q?: string; categoryId?: string }) {
    return this.unwrap(
      this.request<ApiResponse<Product[]>>(`/marketplace/products${this.qs(params)}`),
    );
  }

  async getProduct(id: string) {
    return this.unwrap(this.request<ApiResponse<Product>>(`/marketplace/products/${id}`));
  }

  async getStore(id: string) {
    return this.unwrap(this.request<ApiResponse<unknown>>(`/marketplace/stores/${id}`));
  }

  // ═══════════════════════════════════════════════════════════════
  // CHAT
  // ═══════════════════════════════════════════════════════════════

  async getChatRooms() {
    return this.unwrap(this.request<ApiResponse<ChatRoom[]>>('/chat/rooms'));
  }

  async getChatMessages(roomId: string, cursor?: string, limit = 50) {
    return this.unwrap(
      this.request<ApiResponse<{ data: ChatMessage[]; meta: unknown }>>(
        `/chat/rooms/${roomId}/messages${this.qs({ cursor, limit })}`,
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════

  async getNotifications() {
    return this.unwrap(this.request<ApiResponse<Notification[]>>('/notifications'));
  }

  async markNotificationRead(id: string) {
    return this.unwrap(
      this.request<ApiResponse<Notification>>(`/notifications/${id}/read`, {
        method: 'PATCH',
      }),
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MEDIA (pre-signed URLs for direct S3 upload)
  // ═══════════════════════════════════════════════════════════════

  async getPresignedUrl(data: { fileName: string; mimeType: string; folder: string }) {
    return this.unwrap(
      this.request<ApiResponse<{ uploadUrl: string; key: string; expiresIn: number }>>(
        '/media/presigned-url',
        { method: 'POST', body: JSON.stringify(data) },
      ),
    );
  }
}

export const api = new ApiClient();
