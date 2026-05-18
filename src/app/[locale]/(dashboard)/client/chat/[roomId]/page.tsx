'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatPageContent } from '@/components/chat/ChatPageContent';

export default function ClientChatRoomPage({
  params,
}: {
  params: { roomId: string; locale: string };
}) {
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <ChatPageContent role="CLIENT" roomId={params.roomId} />
    </ProtectedRoute>
  );
}
