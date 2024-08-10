import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RegisterDTO } from 'src/dto/auth.dto';
import { registerSuccessfully } from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService
    ) { }

    async register(body: RegisterDTO): Promise<WebResponse<any>> {
        const userId = randomUUID()
        const refreshToken = this.jwtService.sign({
            email: body.email
        });
        const bcryptPassword = await bcrypt.hash(body.password, 10)

        const addressId = randomUUID()

        await this.prismaService.address.create({
            data: {
                id: addressId
            }
        })

        await this.prismaService.user.create({
            data: {
                id: userId,
                email: body.email,
                name: body.name,
                password: bcryptPassword,
                addressId: addressId,
                refreshToken: refreshToken
            }
        })

        return {
            success: true,
            message: registerSuccessfully
        }
    }
}
