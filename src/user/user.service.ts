import { BadRequestException, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import {
  fileMustImage,
  getDataFailed,
  getDataSuccess,
  passwordFalse,
  updateDataFailed,
  updateDataSuccess,
  updatePasswordFailed,
  updatePasswordSuccess,
} from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import {
  AddressUpdateRequestDTO,
  AddressUpdateSchema,
  PasswordUpdateRequestDTO,
  PasswordUpdateSchema,
  UserUpdateRequestDTO,
  UserUpdateSchema,
} from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { AttachmentService } from 'src/attachment/attachment.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private attachmentService: AttachmentService,
  ) {}

  async getDataProfile(user: user): Promise<WebResponse<any>> {
    try {
      const dataUser = await this.prismaService.user.findUnique({
        where: { id: user.id },
        include: {
          address: true,
        },
      });

      return {
        success: true,
        message: getDataSuccess,
        data: dataUser,
      };
    } catch (error) {
      return {
        success: false,
        message: getDataFailed,
        error: error,
      };
    }
  }

  async userUpdate(
    user: user,
    body: UserUpdateRequestDTO,
  ): Promise<WebResponse<any>> {
    try {
      const validate = UserUpdateSchema.parse(body);
      const save = await this.prismaService.user.update({
        where: { id: user.id },
        data: validate,
      });
      return {
        success: true,
        message: updateDataSuccess,
        data: save,
      };
    } catch (error) {
      return {
        success: false,
        message: updateDataSuccess,
        error: error,
      };
    }
  }

  async updateAddress(
    user: user,
    body: AddressUpdateRequestDTO,
  ): Promise<WebResponse<any>> {
    try {
      const validate = AddressUpdateSchema.parse(body);

      const save = await this.prismaService.address.update({
        where: { id: user.addressId },
        data: validate,
      });

      return {
        success: true,
        message: updateDataSuccess,
        data: save,
      };
    } catch (error) {
      return {
        success: false,
        message: updateDataFailed,
        error: error,
      };
    }
  }

  async updatePassword(
    user: user,
    body: PasswordUpdateRequestDTO,
  ): Promise<WebResponse<any>> {
    try {
      const validate = PasswordUpdateSchema.parse(body);

      const isPasswordValid = await bcrypt.compare(
        validate.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException(passwordFalse);
      }

      const newPassword = await bcrypt.hash(validate.newPassword, 10);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: newPassword,
        },
      });

      return {
        success: true,
        message: updatePasswordSuccess,
      };
    } catch (error) {
      return {
        success: false,
        message: updatePasswordFailed,
        error: error,
      };
    }
  }

  async updateImage(
    user: user,
    images: Express.Multer.File,
    req: Request,
  ): Promise<WebResponse<any>> {
    try {
      let dataImages: string = undefined;

      if (images) {
        if (images.mimetype.startsWith('image/')) {
          const saveImages = await this.attachmentService.createFile(
            images,
            req,
          );
          dataImages = saveImages.path.toString();
        } else {
          throw new BadRequestException(fileMustImage);
        }
      }

      const save = await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          logo: dataImages,
        },
      });

      return {
        success: true,
        message: updateDataSuccess,
        data: {
          path: save.logo,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: updateDataFailed,
        error: error,
      };
    }
  }
}
