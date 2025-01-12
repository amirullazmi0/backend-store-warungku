import { Injectable, NotFoundException } from '@nestjs/common';
import { user } from '@prisma/client';
import { dataNotFound, getDataFailed, getDataSuccess, updateDataFailed, updateDataSuccess } from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import { AddressUpdateRequestDTO } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { addressUpdateSchema } from './address.dto';

@Injectable()
export class AddressService {
    constructor(
        private prismaService: PrismaService
    ) { }
    async getAddress(user: user): Promise<WebResponse<any>> {
        try {
            const address = await this.prismaService.address.findFirst({
                where: { id: user.addressId },
            });

            if (!address) {
                throw new NotFoundException(dataNotFound);
            }

            return {
                success: true,
                message: getDataSuccess,
                data: address,
            };
        } catch (error) {
            return {
                success: false,
                message: getDataFailed,
                error: error,
            };
        }
    }

    async updateAddressProfile(
        user: user,
        req: AddressUpdateRequestDTO,
    ): Promise<WebResponse<any>> {
        try {
            if (!user) {
                throw new NotFoundException(dataNotFound);
            }
            const validate = addressUpdateSchema.parse({
                active: true,
                jalan: req.jalan,
                rt: req.rt,
                rw: req.rw,
                kodepos: req.kodepos,
                kelurahan: req.kelurahan,
                kecamatan: req.kecamatan,
                kota: req.kota,
                provinsi: req.provinsi,
            });

            const update = await this.prismaService.address.update({
                where: { id: user.addressId },
                data: validate,
            });

            return {
                success: true,
                message: updateDataSuccess,
                data: update,
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
