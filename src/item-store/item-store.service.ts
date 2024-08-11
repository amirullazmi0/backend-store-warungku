import { Injectable, NotFoundException } from '@nestjs/common';
import { itemstore, user } from '@prisma/client';
import { NotFoundError } from 'rxjs';
import { dataNotFound, getDataFailed, getDataSuccess } from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemStoreService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getItemStore(user: user, itemStoreId?: string): Promise<WebResponse<any>> {
        try {
            let item: itemstore | itemstore[]
            if (itemStoreId) {
                item = await this.prismaService.itemstore.findFirst({
                    where: {
                        userId: user.id,
                        id: itemStoreId
                    }
                })

                if (!item) {
                    throw new NotFoundException(dataNotFound)
                }
            } else {
                item = await this.prismaService.itemstore.findMany({
                    where: { userId: user.id }
                })
            }
            return {
                success: true,
                message: getDataSuccess,
                data: item
            }
        } catch (error) {
            return {
                success: false,
                message: getDataFailed,
                error: error
            }
        }
    }
}
