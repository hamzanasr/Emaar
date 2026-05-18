'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatPageContent } from '@/components/chat/ChatPageContent';

export default function ContractorChatPage() {
  return (
    <ProtectedRoute allowedRoles={['CONTRACTOR']}>
      <ChatPageContent role="CONTRACTOR" />
    </ProtectedRoute>
  );
}
