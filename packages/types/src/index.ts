// ============================================================
// Emaar Platform — Shared Type Definitions
// All enums, interfaces, and DTOs shared across frontend & backend
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export enum UserRole {
  CLIENT = 'CLIENT',
  CONTRACTOR = 'CONTRACTOR',
  SUPPLIER = 'SUPPLIER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  BIDDING = 'BIDDING',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export enum EscrowStatus {
  CREATED = 'CREATED',
  FUNDED = 'FUNDED',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  PARTIALLY_RELEASED = 'PARTIALLY_RELEASED',
  DISPUTED = 'DISPUTED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
}

export enum QualityVerdict {
  PASS = 'PASS',
  FAIL = 'FAIL',
  CONDITIONAL_PASS = 'CONDITIONAL_PASS',
}

export enum ChatRoomType {
  PROJECT = 'PROJECT',
  ORDER = 'ORDER',
  SUPPORT = 'SUPPORT',
  DISPUTE = 'DISPUTE',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
  VOICE = 'VOICE',
}

// ─── Base Interfaces ─────────────────────────────────────────

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CursorPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    cursor: string | null;
    hasMore: boolean;
    limit: number;
  };
}

// ─── User Types ──────────────────────────────────────────────

export interface User extends BaseEntity {
  role: UserRole;
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  kycStatus: KycStatus;
  isActive: boolean;
  regionId?: string;
}

export interface ContractorProfile {
  id: string;
  userId: string;
  companyNameAr: string;
  companyNameEn: string;
  licenseNumber: string;
  specializations: string[];
  qualityRating: number;
  totalProjects: number;
  portfolioUrls: string[];
  bioAr?: string;
  bioEn?: string;
  serviceRegions: string[];
}

export interface SupplierStore {
  id: string;
  userId: string;
  storeNameAr: string;
  storeNameEn: string;
  categoryId: string;
  licenseNumber: string;
  rating: number;
  deliveryZones: DeliveryZone[];
  commissionRate: number;
  isVerified: boolean;
}

export interface DeliveryZone {
  regionId: string;
  deliveryFee: number;
  estimatedDays: number;
}

// ─── Project Types ───────────────────────────────────────────

export interface Project extends BaseEntity {
  clientId: string;
  contractorId?: string;
  regionId: string;
  titleAr: string;
  titleEn: string;
  description: string;
  categoryId: string;
  totalBudget: number;
  currency: string;
  status: ProjectStatus;
  address: ProjectAddress;
  specs?: Record<string, unknown>;
  startDate?: string;
  expectedEnd?: string;
  actualEnd?: string;
}

export interface ProjectAddress {
  lat: number;
  lng: number;
  formattedAddress: string;
  city?: string;
  district?: string;
}

export interface Bid extends BaseEntity {
  projectId: string;
  contractorId: string;
  amount: number;
  duration: number; // days
  proposal: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

// ─── Milestone Types ─────────────────────────────────────────

export interface Milestone extends BaseEntity {
  projectId: string;
  titleAr: string;
  titleEn: string;
  description?: string;
  sequenceOrder: number;
  amount: number;
  status: MilestoneStatus;
  dueDate?: string;
  submittedAt?: string;
  approvedAt?: string;
  proofMedia: ProofMedia[];
  checklist: ChecklistItem[];
}

export interface ProofMedia {
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  geo?: { lat: number; lng: number };
  timestamp: string;
  caption?: string;
}

export interface ChecklistItem {
  item: string;
  weight: number;
  completed: boolean;
  score?: number;
}

// ─── Escrow Types ────────────────────────────────────────────

export interface EscrowTransaction extends BaseEntity {
  milestoneId: string;
  projectId: string;
  payerId: string;
  payeeId: string;
  totalAmount: number;
  heldAmount: number;
  releasedAmount: number;
  platformFee: number;
  status: EscrowStatus;
  paymentRef?: string;
  fundedAt?: string;
  releasedAt?: string;
  expiresAt?: string;
}

// ─── Marketplace Types ───────────────────────────────────────

export interface Product extends BaseEntity {
  storeId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  categoryId: string;
  price: number;
  currency: string;
  stockQuantity: number;
  unit: string;
  images: string[];
  specs?: Record<string, unknown>;
  isActive: boolean;
}

export interface Order extends BaseEntity {
  projectId?: string;
  buyerId: string;
  storeId: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: ProjectAddress;
  trackingInfo?: TrackingInfo;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TrackingInfo {
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  currentLocation?: { lat: number; lng: number };
}

// ─── Chat Types ──────────────────────────────────────────────

export interface ChatRoom extends BaseEntity {
  projectId?: string;
  type: ChatRoomType;
  participants: string[];
  lastMessageAt?: string;
}

export interface ChatMessage extends BaseEntity {
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  readBy: string[];
}

// ─── Quality & Disputes ──────────────────────────────────────

export interface QualityInspection extends BaseEntity {
  milestoneId: string;
  inspectorId: string;
  checklistScores: ChecklistScore[];
  totalScore: number;
  verdict: QualityVerdict;
  notes?: string;
  photos: string[];
  inspectedAt: string;
}

export interface ChecklistScore {
  item: string;
  weight: number;
  score: number;
  notes?: string;
}

export interface Dispute extends BaseEntity {
  projectId: string;
  milestoneId?: string;
  raisedBy: string;
  againstId: string;
  reason: string;
  evidence: DisputeEvidence[];
  status: DisputeStatus;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface DisputeEvidence {
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'SCREENSHOT';
  url: string;
  description?: string;
}

// ─── Review Types ────────────────────────────────────────────

export interface Review extends BaseEntity {
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  aspects: ReviewAspects;
  isVisible: boolean;
}

export interface ReviewAspects {
  quality: number;
  timeliness: number;
  communication: number;
  value: number;
}

// ─── Notification Types ──────────────────────────────────────

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
}

export type NotificationType =
  | 'PROJECT_BID'
  | 'BID_ACCEPTED'
  | 'MILESTONE_SUBMITTED'
  | 'MILESTONE_APPROVED'
  | 'MILESTONE_REJECTED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_RELEASED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  | 'ORDER_UPDATE'
  | 'CHAT_MESSAGE'
  | 'QA_REVIEW'
  | 'SYSTEM';

// ─── Region & Category Types ─────────────────────────────────

export interface Region extends BaseEntity {
  nameAr: string;
  nameEn: string;
  countryCode: string;
  city: string;
  isActive: boolean;
  config: RegionConfig;
}

export interface RegionConfig {
  currency: string;
  taxRate: number;
  timezone: string;
  supportPhone?: string;
}

export interface Category extends BaseEntity {
  nameAr: string;
  nameEn: string;
  parentId?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

// ─── Auth DTOs ───────────────────────────────────────────────

export interface SendOtpDto {
  phone: string;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenDto {
  refreshToken: string;
}
