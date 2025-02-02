import { Injectable } from '@nestjs/common';
import { category } from '@prisma/client';
import { getDataSuccess } from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getCategory(): Promise<WebResponse<category | category[]>> {
        const data = await this.prismaService.category.findMany()
        return {
            success: true,
            message: getDataSuccess,
            data: data
        }
    }
}
