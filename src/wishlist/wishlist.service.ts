import { Injectable, NotFoundException } from '@nestjs/common';
// import { user } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}
  async addToWishlist(acessToken: string, itemStoreId: string): Promise<any> {
    const user = await this.authService.validateUserFromToken(acessToken);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userByEmail) {
      throw new NotFoundException('User not found');
    }
    const userId = userByEmail.id;

    const existingWishlistItem = await this.prismaService.wishlist.findFirst({
      where: { userId, itemStoreId: itemStoreId },
    });
    if (existingWishlistItem) {
      throw new NotFoundException('Item already in the wishlist');
    }

    const wishlistItem = await this.prismaService.wishlist.create({
      data: {
        userId: userId,
        itemStoreId: itemStoreId,
      },
    });

    return {
      success: true,
      message: 'Item added to wishlist',
      data: wishlistItem,
    };
  }

  async removeFromWishlist(
    accessToken: string,
    itemStoreId: string,
  ): Promise<any> {
    const user = await this.authService.validateUserFromToken(accessToken);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userByEmail) {
      throw new NotFoundException('User not found');
    }
    const userId = userByEmail.id;
    const wishlistItem = await this.prismaService.wishlist.findFirst({
      where: {
        userId,
        itemStoreId: itemStoreId,
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Item not found in wishlist');
    }

    await this.prismaService.wishlist.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    return {
      success: true,
      message: 'Item removed from wishlist',
    };
  }

  async getWishlistByUserId(accessToken: string) {
    const user = await this.authService.validateUserFromToken(accessToken);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userByEmail) {
      throw new NotFoundException('User not found');
    }
    const userId = userByEmail.id;
    const wishlist = await this.prismaService.wishlist.findMany({
      where: { userId },
      include: {
        itemStore: {
          include: {
            itemStoreImages: true,
          },
        },
      },
    });

    if (!wishlist || wishlist.length === 0) {
      throw new NotFoundException('No items found in wishlist');
    }

    return wishlist;
  }
}
