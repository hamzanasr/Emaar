import type { ChatRoom, ChatMessage, ChatRoomType, MessageType } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// MOCK CHAT DATA
// ═══════════════════════════════════════════════════════════════
// Note: separate file to keep main mock-data.ts focused

const mockClientId = 'mock-client-id';
const mockContractorA = 'mock-contractor-A';
const mockSupplierA = 'mock-supplier-A';
const mockSupportId = 'mock-support-bot';

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'mock-room-1',
    projectId: 'mock-project-1',
    type: 'PROJECT' as ChatRoomType,
    participants: [mockClientId, mockContractorA],
    lastMessageAt: '2026-05-17T10:30:00Z',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'mock-room-2',
    projectId: 'mock-project-2',
    type: 'PROJECT' as ChatRoomType,
    participants: [mockClientId, mockContractorA],
    lastMessageAt: '2026-05-15T14:20:00Z',
    createdAt: '2026-05-15T10:00:00Z',
  },
  {
    id: 'mock-room-3',
    type: 'ORDER' as ChatRoomType,
    participants: [mockContractorA, mockSupplierA],
    lastMessageAt: '2026-05-16T16:45:00Z',
    createdAt: '2026-05-16T14:30:00Z',
  },
  {
    id: 'mock-room-4',
    type: 'SUPPORT' as ChatRoomType,
    participants: [mockClientId, mockSupportId],
    lastMessageAt: '2026-05-12T09:15:00Z',
    createdAt: '2026-05-12T08:00:00Z',
  },
];

export const mockChatMessages: ChatMessage[] = [
  // ─── Room 1: Client ↔ Contractor (project-1) ──────────────
  {
    id: 'msg-1-1',
    roomId: 'mock-room-1',
    senderId: mockContractorA,
    content: 'السلام عليكم، تم البدء في المرحلة الأولى من المشروع اليوم. إن شاء الله نلتزم بالجدول الزمني المتفق عليه.',
    type: 'TEXT' as MessageType,
    readBy: [mockContractorA, mockClientId],
    createdAt: '2026-03-16T09:00:00Z',
  },
  {
    id: 'msg-1-2',
    roomId: 'mock-room-1',
    senderId: mockClientId,
    content: 'وعليكم السلام، بارك الله فيك. متى تتوقع الانتهاء من أعمال الكسر والإزالة؟',
    type: 'TEXT' as MessageType,
    readBy: [mockClientId, mockContractorA],
    createdAt: '2026-03-16T09:15:00Z',
  },
  {
    id: 'msg-1-3',
    roomId: 'mock-room-1',
    senderId: mockContractorA,
    content: 'تقريباً خلال 12 يوم. بعدها مباشرة نبدأ بالكهرباء والسباكة.',
    type: 'TEXT' as MessageType,
    readBy: [mockContractorA, mockClientId],
    createdAt: '2026-03-16T09:18:00Z',
  },
  {
    id: 'msg-1-4',
    roomId: 'mock-room-1',
    senderId: mockClientId,
    content: 'ممتاز. هل يمكنك تزويدي بصور للموقع بشكل دوري؟',
    type: 'TEXT' as MessageType,
    readBy: [mockClientId, mockContractorA],
    createdAt: '2026-03-16T09:20:00Z',
  },
  {
    id: 'msg-1-5',
    roomId: 'mock-room-1',
    senderId: 'system',
    content: 'تم تسليم المرحلة الأولى للمراجعة',
    type: 'SYSTEM' as MessageType,
    readBy: [mockClientId, mockContractorA],
    createdAt: '2026-03-28T16:00:00Z',
  },
  {
    id: 'msg-1-6',
    roomId: 'mock-room-1',
    senderId: 'system',
    content: 'تم اعتماد المرحلة الأولى وإفراج الدفعة',
    type: 'SYSTEM' as MessageType,
    readBy: [mockClientId, mockContractorA],
    createdAt: '2026-03-29T10:30:00Z',
  },
  {
    id: 'msg-1-7',
    roomId: 'mock-room-1',
    senderId: mockClientId,
    content: 'الحمد لله، العمل ممتاز! متى تتوقع البدء في المرحلة الثالثة (الجبس والدهانات)؟',
    type: 'TEXT' as MessageType,
    readBy: [mockClientId, mockContractorA],
    createdAt: '2026-05-15T11:00:00Z',
  },
  {
    id: 'msg-1-8',
    roomId: 'mock-room-1',
    senderId: mockContractorA,
    content: 'جاري حالياً، وفريق الجبس وصل أمس. بإذن الله ننتهي قبل الموعد بأسبوع.',
    type: 'TEXT' as MessageType,
    readBy: [mockContractorA, mockClientId],
    createdAt: '2026-05-15T11:30:00Z',
  },
  {
    id: 'msg-1-9',
    roomId: 'mock-room-1',
    senderId: mockContractorA,
    content: 'بالنسبة لاختيار درجة لون الدهان، أحتاج مراجعتك للعينات. هل يمكنك زيارة الموقع غداً؟',
    type: 'TEXT' as MessageType,
    readBy: [mockContractorA],
    createdAt: '2026-05-17T10:30:00Z',
  },

  // ─── Room 2: Client ↔ Contractor (project-2 bidding) ──────
  {
    id: 'msg-2-1',
    roomId: 'mock-room-2',
    senderId: mockContractorA,
    content: 'السلام عليكم، شاهدت مشروعك للمكتب التجاري. هل العقار له تصاريح بناء جاهزة؟',
    type: 'TEXT' as MessageType,
    readBy: [mockContractorA, mockClientId],
    createdAt: '2026-05-15T13:00:00Z',
  },
  {
    id: 'msg-2-2',
    roomId: 'mock-room-2',
    senderId: mockClientId,
    content: 'نعم، التصاريح جاهزة والمخططات معتمدة من البلدية.',
    type: 'TEXT' as MessageType,
    readBy: [mockClientId],
    createdAt: '2026-05-15T14:20:00Z',
  },

  // ─── Room 3: Contractor ↔ Supplier (order) ────────────────
  {
    id: 'msg-3-1',
    roomId: 'mock-room-3',
    senderId: mockContractorA,
    content: 'مساء الخير، طلبت اليوم 25 سبوت LED مع الثريا الكريستالية. متى التسليم؟',
    type: 'TEXT' as MessageType,
    readBy: [mockContractorA, mockSupplierA],
    createdAt: '2026-05-16T15:00:00Z',
  },
  {
    id: 'msg-3-2',
    roomId: 'mock-room-3',
    senderId: mockSupplierA,
    content: 'مساء النور، الطلب جاهز. سيُسلَّم خلال 3 أيام عمل من تاريخ تأكيد الطلب.',
    type: 'TEXT' as MessageType,
    readBy: [mockSupplierA, mockContractorA],
    createdAt: '2026-05-16T15:30:00Z',
  },
  {
    id: 'msg-3-3',
    roomId: 'mock-room-3',
    senderId: mockSupplierA,
    content: 'هل تحتاج تركيب أيضاً؟ لدينا فريق فني معتمد.',
    type: 'TEXT' as MessageType,
    readBy: [mockSupplierA],
    createdAt: '2026-05-16T16:45:00Z',
  },

  // ─── Room 4: Client ↔ Support ─────────────────────────────
  {
    id: 'msg-4-1',
    roomId: 'mock-room-4',
    senderId: mockClientId,
    content: 'مرحباً، كيف يتم احتساب الضمان المالي بالضبط؟',
    type: 'TEXT' as MessageType,
    readBy: [mockClientId, mockSupportId],
    createdAt: '2026-05-12T08:00:00Z',
  },
  {
    id: 'msg-4-2',
    roomId: 'mock-room-4',
    senderId: mockSupportId,
    content: 'مرحباً بك في منصة إعمار. عند إنشاء المشروع، تُقسَّم الميزانية على مراحل تنفيذية. تُودَع كل دفعة في حساب وسيط آمن ولا تُفرَج إلا بعد اعتماد المرحلة هندسياً.',
    type: 'TEXT' as MessageType,
    readBy: [mockSupportId, mockClientId],
    createdAt: '2026-05-12T08:05:00Z',
  },
  {
    id: 'msg-4-3',
    roomId: 'mock-room-4',
    senderId: mockSupportId,
    content: 'يمكنك مراجعة سياسة الضمان الكاملة من صفحة الإعدادات. هل لديك سؤال آخر؟',
    type: 'TEXT' as MessageType,
    readBy: [mockSupportId, mockClientId],
    createdAt: '2026-05-12T09:15:00Z',
  },
];

// Participant info for displaying in UI
export const mockChatParticipants: Record<
  string,
  { name: string; role: string; avatar?: string; isOnline?: boolean }
> = {
  'mock-client-id': { name: 'أحمد عبدالله', role: 'عميل', isOnline: true },
  'mock-contractor-A': { name: 'شركة البناء الذهبي', role: 'مقاول', isOnline: true },
  'mock-supplier-A': { name: 'إعمار للإضاءات', role: 'مورد', isOnline: false },
  'mock-support-bot': { name: 'دعم إعمار', role: 'الدعم الفني', isOnline: true },
  system: { name: 'النظام', role: 'إشعار تلقائي' },
};
