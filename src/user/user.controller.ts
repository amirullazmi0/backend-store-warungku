import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGetProfile, AddressUpdateRequestDTO, UserUpdateRequestDTO, PasswordUpdateRequestDTO, UserUpdateLogoRequestDTO, userUpdateRequest } from 'src/dto/user.dto';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddressService } from 'src/address/address.service';
import { addressUpdateRequest } from 'src/address/address.dto';

@Controller('api/user')
export class UserController {
    constructor(
        private userService: UserService,
        private addressService: AddressService
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

    @Get(`/profile`)
    async getProfile(@Auth() user: user) {
        return this.userService.getDataProfile(user);
    }

    @Get(`/profile/address`)
    async getProfileAddress(@Auth() user: user) {
        return this.addressService.getAddress(user);
    }

    @Put(`/update/profile`)
    async updateUserProfile(
        @Auth() user: user,
        @Body() req: UserUpdateRequestDTO,
    ) {
        return this.userService.userUpdate(user, req);
    }

    @Put(`/update/profile/address`)
    async updateProfileAddress(
        @Auth() user: user,
        @Body() req: addressUpdateRequest,
    ) {
        return this.addressService.updateAddressProfile(user, req);
    }
}
