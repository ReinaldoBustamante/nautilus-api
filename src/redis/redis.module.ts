import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

// redis.module.ts
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;

        // 1. Validar que la URL exista
        if (!redisUrl) {
          throw new Error('REDIS_URL no está definida en las variables de entorno');
        }

        // 2. Ahora TypeScript sabe que redisUrl es 'string' (no undefined)
        const client = new Redis(redisUrl, {
          keepAlive: 10000,
          retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        // 3. El listener para el ECONNRESET
        client.on('error', (err) => {
          console.error('[Redis] Error de conexión:', err.message);
        });

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule { }
