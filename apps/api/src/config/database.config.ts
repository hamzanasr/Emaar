import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
}));
