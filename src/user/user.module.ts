import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AttachmentService } from 'src/attachment/attachment.service';

@Module({
  providers: [UserService, AttachmentService],
  controllers: [UserController]
})
export class UserModule { }
