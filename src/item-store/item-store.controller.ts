import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  //   Param,
  ParseFilePipeBuilder,
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
} from 'src/dto/itemStore.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { user } from '@prisma/client';

@Controller('api/item-store')
export class ItemStoreController {
  constructor(private itemStoreService: ItemStoreService) { }

  @Get()
  async getItemStore(
    @Auth() user: user,
    @Query('id') itemStoreId?: string,
    @Query('name') itemStoreName?: string) {
    return await this.itemStoreService.getItemStore(user, itemStoreId, itemStoreName);
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

  @Delete()
  async deleteItemStore(
    @Auth() user: user,
    @Body() body: ItemStoreDeleteRequestDTO,
  ) {
    return await this.itemStoreService.deleteItemStore(user, body);
  }
}
