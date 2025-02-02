import { Body, Controller, Get, Query } from '@nestjs/common';
import { user } from '@prisma/client';
import { Auth } from 'src/cummon/auth.decorator';
import { CategoryService } from './category.service';

@Controller('api/category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    @Get()
    async GetCatecory(
        @Auth() user: user,
        @Body() categoryName: string[]
    ) {
        return await this.categoryService.getCategory()
    }
}
