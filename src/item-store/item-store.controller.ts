import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  //   Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { Auth } from 'src/cummon/auth.decorator';
// import { user } from '@prisma/client';
import {
  ItemStoreCreateRequestDTO,
  ItemStoreDeleteRequestDTO,
  ItemStoreUpdateRequestDTO,
} from 'src/dto/itemStore.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { user } from '@prisma/client';

@Controller('api/item-store')
export class ItemStoreController {
  constructor(private itemStoreService: ItemStoreService) {}

  @Get()
  async getItemStore(
    @Auth() user: user,
    @Query('id') itemStoreId?: string,
    @Query('keyword') keyword?: string,
    @Query('category') category?: string | string[],
  ) {
    const categoryIds = Array.isArray(category)
      ? category
      : category?.split(',');
    return await this.itemStoreService.getItemStore(
      user,
      itemStoreId,
      keyword,
      categoryIds,
    );
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createItemStore(
    @Auth() user: user,
    @Body() body: ItemStoreCreateRequestDTO,
    @Req() req: Request,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
      }),
    )
    images?: Express.Multer.File[],
  ) {
    return await this.itemStoreService.createItemStore(
      user,
      body,
      images,
      // , req
    );
  }

  @Patch()
  @UseInterceptors(FilesInterceptor('images'))
  async updateItemStore(
    @Auth() user: user,
    @Body() body: ItemStoreUpdateRequestDTO,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
      }),
    )
    images?: Express.Multer.File[],
  ) {
    return await this.itemStoreService.updateItemStore(
      user,
      body,
      images,
      // , req
    );
  }

  @Delete()
  async deleteItemStore(
    @Auth() user: user,
    @Body() body: ItemStoreDeleteRequestDTO,
  ) {
    return await this.itemStoreService.deleteItemStore(user, body);
  }
}
