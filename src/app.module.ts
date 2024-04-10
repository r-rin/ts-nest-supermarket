import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ClientModule } from './client/client.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './api/auth/roles/roles.guard';

@Module({
  imports: [ApiModule, ClientModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
