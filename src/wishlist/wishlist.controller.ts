import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  async addToWishlist(
    @Body() body: { accessToken: string; itemStoreId: string },
  ) {
    const { accessToken, itemStoreId } = body;
    return this.wishlistService.addToWishlist(accessToken, itemStoreId);
  }

  @Delete('remove')
  async removeFromWishlist(
    @Body() body: { accessToken: string; itemStoreId: string },
  ) {
    const { accessToken, itemStoreId } = body;
    return this.wishlistService.removeFromWishlist(accessToken, itemStoreId);
  }

  @Get('user/:accessToken')
  async getUserWishlist(@Param('accessToken') accessToken: string) {
    return this.wishlistService.getWishlistByUserId(accessToken);
  }
}
