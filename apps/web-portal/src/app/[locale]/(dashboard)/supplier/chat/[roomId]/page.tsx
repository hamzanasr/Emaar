'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatPageContent } from '@/components/chat/ChatPageContent';

export default function SupplierChatRoomPage({
  params,
}: {
  params: { roomId: string; locale: string };
}) {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <ChatPageContent role="SUPPLIER" roomId={params.roomId} />
    </ProtectedRoute>
  );
}
