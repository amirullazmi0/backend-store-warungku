import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CummonModule } from './cummon/cummon.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, CummonModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
