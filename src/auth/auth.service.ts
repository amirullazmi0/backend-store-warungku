import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { authLoginRequestSchema, authRegisterRequestSchema, LoginDTO, RegisterDTO } from 'src/dto/auth.dto';
import { accountNotRegister, authLoginFailed, authLoginSuccess, authorized, emailIsUnique, emailPassworWrong, registerFailed, registerSuccess, unAuthorized } from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Prisma, user } from '@prisma/client';
@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService
    ) { }

    async checkAuth(user: user): Promise<WebResponse<any>> {
        try {
            return {
                success: true,
                message: authorized,
                data: {
                    name: user.name,
                    email: user.email,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                }
            }
        } catch (error) {
            return {
                success: false,
                message: unAuthorized
            }
        }
    }

    async register(body: RegisterDTO): Promise<WebResponse<any>> {
        try {
            const validate = authRegisterRequestSchema.parse(body)
            const isUnique = await this.prismaService.user.findUnique({
                where: { email: validate.email }
            })

            if (isUnique) {
                throw new BadRequestException(emailIsUnique)
            }
            const userId = randomUUID()
            const refreshToken = this.jwtService.sign({
                email: validate.email
            });
            const bcryptPassword = await bcrypt.hash(validate.password, 10)

            const addressId = randomUUID()

            await this.prismaService.address.create({
                data: {
                    id: addressId
                }
            })

            await this.prismaService.user.create({
                data: {
                    id: userId,
                    email: validate.email,
                    name: validate.name,
                    password: bcryptPassword,
                    addressId: addressId,
                    refreshToken: refreshToken
                }
            })

            return {
                success: true,
                message: registerSuccess
            }
        } catch (error) {
            return {
                success: false,
                message: registerFailed,
                error: error
            }
        }
    }

    async login(body: LoginDTO, res: Response): Promise<WebResponse<any>> {
        try {
            const validate = authLoginRequestSchema.parse(body)
            let user = await this.prismaService.user.findFirst({
                where: { email: validate.email }
            })

            if (!user) {
                throw new BadRequestException(accountNotRegister)
            }
            const isPasswordValid = await bcrypt.compare(validate.password, user.password)

            if (!isPasswordValid) {
                throw new BadRequestException(emailPassworWrong)
            }

            const access_token = await this.jwtService.sign({
                email: user.email,
                roles: 'user'
            })

            user = await this.prismaService.user.update({
                where: { email: validate.email },
                data: {
                    accessToken: access_token
                }
            })

            res.cookie('access-token', user.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000 * 24 * 7,
                sameSite: 'strict',
            })

            return {
                success: true,
                message: authLoginSuccess,
                data: {
                    email: user.email,
                    fullName: user.name,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                }
            }
        } catch (error) {
            return {
                success: false,
                message: authLoginFailed,
                error: error
            }
        }

    }

    async try() {
        try {
            const result = await this.prismaService.$queryRaw<[]>`
                SELECT 
                    cu.id,
                    cu.email,
                    cu."fullName", 
                    jsonb_build_object(
                        'jalan', ca.jalan,
                        'rt', ca.rt,
                        'rw', ca.rw,
                        'kelurahan', ca.kelurahan,
                        'kecamatan', ca.kecamatan,
                        'kota', ca.kota,
                        'provinsi', ca.provinsi,
                        'kodepos', ca.kodepos
                    ) AS address 
                FROM customer_user cu 
                LEFT JOIN customer_address ca ON ca.id = cu."addressId"
                GROUP BY cu.id, cu.email, cu."fullName", ca.jalan, ca.rt, ca.rw, ca.kelurahan, ca.kecamatan, ca.kota, ca.provinsi, ca.kodepos;
            `
            return result;
        } catch (error) {

        }
    }

}
