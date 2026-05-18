import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  apiPrefix: 'api/v1',

  // Platform fees
  contractorFeePercent: parseFloat(process.env.CONTRACTOR_FEE_PERCENT || '5'),
  supplierCommissionPercent: parseFloat(process.env.SUPPLIER_COMMISSION_PERCENT || '3'),
  qualityReservePercent: parseFloat(process.env.QUALITY_RESERVE_PERCENT || '2'),

  // Escrow settings
  autoApprovalHours: parseInt(process.env.AUTO_APPROVAL_HOURS || '72', 10),
  qualityReserveDays: parseInt(process.env.QUALITY_RESERVE_DAYS || '30', 10),
}));
