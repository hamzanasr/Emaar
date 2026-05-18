'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatPageContent } from '@/components/chat/ChatPageContent';

export default function SupplierChatPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <ChatPageContent role="SUPPLIER" />
    </ProtectedRoute>
  );
}
