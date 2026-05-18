'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatPageContent } from '@/components/chat/ChatPageContent';

export default function ContractorChatRoomPage({
  params,
}: {
  params: { roomId: string; locale: string };
}) {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <ChatPageContent role="CONTRACTOR" roomId={params.roomId} />
    </ProtectedRoute>
  );
}
