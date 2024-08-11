import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CummonModule } from './cummon/cummon.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AttachmentService } from './attachment/attachment.service';

@Module({
  imports: [AuthModule, CummonModule, PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService, AttachmentService],
})
export class AppModule {}
