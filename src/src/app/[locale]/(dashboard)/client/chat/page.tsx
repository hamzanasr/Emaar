'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatPageContent } from '@/components/chat/ChatPageContent';

export default function ClientChatPage() {
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <ChatPageContent role="CLIENT" />
    </ProtectedRoute>
  );
}
