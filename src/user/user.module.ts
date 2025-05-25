import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AttachmentService } from 'src/attachment/attachment.service';
import { AddressService } from 'src/address/address.service';

@Module({
  providers: [UserService, AttachmentService, AddressService],
  controllers: [UserController],
})
export class UserModule {}
