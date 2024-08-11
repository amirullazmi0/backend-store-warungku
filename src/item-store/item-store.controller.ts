import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('api/item-store')
export class ItemStoreController {
    constructor(
        private itemStoreService: ItemStoreService
    ) { }

    @Get()
    async getItemStore(
        @Auth() user: user,
        @Query('id') itemStoreId?: string
    ) {
        return await this.itemStoreService.getItemStore(user, itemStoreId)
    }

    @Post()
    async createItemStore() {

    }
}
