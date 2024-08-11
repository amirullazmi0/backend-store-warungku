import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGetProfile, AddressUpdateRequestDTO, UserUpdateRequestDTO, PasswordUpdateRequestDTO, UserUpdateLogoRequestDTO } from 'src/dto/user.dto';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Get()
    async getUserProfile(
        @Auth() user: user
    ) {
        return this.userService.getDataProfile(user)
    }

    @Post()
    async updateUser(
        @Auth() user: user,
        @Body() body: UserUpdateRequestDTO
    ) {
        return await this.userService.userUpdate(user, body)
    }

    @Post('address')
    async updateAddress(
        @Auth() user: user,
        @Body() body: AddressUpdateRequestDTO
    ) {
        return await this.userService.updateAddress(user, body)
    }

    @Post('password')
    async updatePassword(
        @Auth() user: user,
        @Body() body: PasswordUpdateRequestDTO
    ) {
        return await this.userService.updatePassword(user, body)
    }

    @Post('logo')
    @UseInterceptors(FileInterceptor('logo'))
    async updateLogo(
        @Auth() user: user,
        @Req() req: Request,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    fileIsRequired: false
                }),
        ) images?: Express.Multer.File
    ) {
        return await this.userService.updateImage(user, images, req)
    }
}
