import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  itemStore,
  // itemStoreImages,
  user,
} from '@prisma/client';
import { log } from 'console';
import { randomUUID } from 'crypto';
// import { Request } from 'express';
import { AttachmentService } from 'src/attachment/attachment.service';
import {
  ItemStoreCreateRequestDTO,
  ItemStoreCreateSchema,
  ItemStoreDeleteRequestDTO,
  ItemStoreImage,
  ItemStoreUpdateRequestDTO,
  ItemStoreUpdateSchema,
} from 'src/dto/itemStore.dto';
import {
  createDataFailed,
  createDataSuccess,
  createFileSuccess,
  dataNotFound,
  deleteDataFailed,
  deleteDataSuccess,
  getDataFailed,
  getDataSuccess,
  updateDataFailed,
  updateDataSuccess,
} from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import { PrismaService } from 'src/prisma/prisma.service';
// import ImageKit from 'imagekit';

@Injectable()
export class ItemStoreService {
  constructor(
    private prismaService: PrismaService,
    private attachmentService: AttachmentService,
  ) { }

  async getItemStore(
    user: user,
    itemStoreId?: string,
    keyword?: string,
    category?: string[]
  ): Promise<WebResponse<any>> {
    try {
      let item: itemStore | itemStore[];

      if (itemStoreId) {
        item = await this.prismaService.itemStore.findFirst({
          where: {
            userId: user.id,
            id: itemStoreId,
          },
          include: {
            itemStoreImages: true,
            categoriesItemStore: {
              include: {
                category: true,
              },
            },
            transactionItemStore: {
              include: {
                transaction: true
              }
            }
          },
        });

        if (!item) {
          throw new NotFoundException(dataNotFound);
        }
      } else {
        // ✅ Only apply category filter if valid
        const categoryFilter =
          category && category.length > 0 && category[0]
            ? {
              categoriesItemStore: {
                some: {
                  categoryId: { in: category.filter((id) => id !== '') },
                },
              },
            }
            : {};

        item = await this.prismaService.itemStore.findMany({
          where: {
            userId: user.id,
            ...categoryFilter,
            OR: keyword
              ? [
                {
                  name: {
                    contains: keyword,
                    mode: 'insensitive',
                  },
                },
                {
                  categoriesItemStore: {
                    some: {
                      category: {
                        name: {
                          contains: keyword,
                          mode: 'insensitive',
                        },
                      },
                    },
                  },
                },
              ]
              : undefined,
          },
          include: {
            itemStoreImages: true,
            categoriesItemStore: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }

      return {
        success: true,
        message: getDataSuccess,
        data: item,
      };
    } catch (error) {
      console.error('Error fetching item store:', error); // ✅ Log error for debugging
      return {
        success: false,
        message: getDataFailed,
        error: error,
      };
    }
  }


  async createItemStore(
    user: user,
    body: ItemStoreCreateRequestDTO,
    images: Express.Multer.File[],
    // req: Request,
  ): Promise<WebResponse<any>> {
    try {
      const id = randomUUID();

      const validate = ItemStoreCreateSchema.parse({
        name: body.name,
        price: Number(body.price),
        qty: Number(body.qty),
        desc: body.desc,
      });

      const saveItem = await this.prismaService.itemStore.create({
        data: {
          id: id,
          name: validate.name,
          price: validate.price,
          qty: validate.qty,
          desc: validate.desc,
          userId: user.id,
        },
      });

      //   const item: itemStoreImages[] = [];
      if (images && images.length > 0) {
        const itemImages = await Promise.all(
          images.map(async (img) => {
            const imagesId = randomUUID();

            const save = await this.attachmentService.saveFileImageKit({
              file: img,
              folder: `/itemStore/${user.id}`,
            });

            return {
              id: imagesId,
              itemstoreId: saveItem.id,
              path: save.path,
            };
          }),
        );


        await this.prismaService.itemStoreImages.createMany({
          data: itemImages,
        });
        log(createFileSuccess);
      }
      if (body.category.length > 0) {
        await this.prismaService.categoriesItemStore.createMany({
          data: body.category.map((categoryId: string) => ({
            itemStoreId: saveItem.id,
            categoryId: categoryId,
          })),
        });
      }

      const itemStore = await this.prismaService.itemStore.findUnique({
        where: { id: saveItem.id },
        include: {
          itemStoreImages: true,
        },
      });
      return {
        success: true,
        message: createDataSuccess,
        data: itemStore,
      };
    } catch (error) {
      return {
        success: false,
        message: createDataFailed,
        error: error,
      };
    }
  }
  async updateItemStore(
    user: user,
    body: ItemStoreUpdateRequestDTO,
    images: Express.Multer.File[],
    // req: Request,
  ): Promise<WebResponse<any>> {
    try {
      const item = await this.prismaService.itemStore.findUnique({
        where: {
          id: body.id,
          userId: user.id
        }
      })

      if (!item) {
        throw new NotFoundException(dataNotFound)
      }

      const imageBeforeArray = Array.isArray(body.imageBefore)
        ? body.imageBefore
        : [body.imageBefore]; // ✅ Convert string to array


      const imageBefore = await this.prismaService.itemStoreImages.findMany({
        where: {
          id: {
            in: imageBeforeArray
          }
        }
      })


      let allImages: ItemStoreImage[] = imageBefore ?? [];
      const validate = ItemStoreUpdateSchema.parse({
        id: user.id,
        name: body.name,
        price: Number(body.price),
        qty: Number(body.qty),
        desc: body.desc,
      });

      const saveItem = await this.prismaService.itemStore.update(
        {
          where: {
            id: item.id
          },
          data: {
            name: validate.name,
            price: validate.price,
            qty: validate.qty,
            desc: validate.desc,
            userId: user.id,
          },
        });

      //   const item: itemStoreImages[] = [];
      if (images && images.length > 0) {
        const itemImages = await Promise.all(
          images.map(async (img) => {
            const imagesId = randomUUID();

            const save = await this.attachmentService.saveFileImageKit({
              file: img,
              folder: `/itemStore/${user.id}`,
            });

            return {
              id: imagesId,
              itemstoreId: saveItem.id,
              path: save.path,
            };
          }),

        );

        allImages = [...allImages, ...itemImages];
      }

      await this.prismaService.itemStoreImages.deleteMany({
        where: {
          itemstoreId: body.id,
        },
      });

      await this.prismaService.itemStoreImages.createMany({
        data: allImages.map((img) => ({
          id: img.id,
          itemstoreId: img.itemstoreId,
          path: img.path,
        })),
      });

      if (body.category.length > 0) {
        // ✅ Step 1: Remove existing categories for this itemStore
        await this.prismaService.categoriesItemStore.deleteMany({
          where: {
            itemStoreId: saveItem.id, // ✅ Remove existing category relations
          },
        });

        // ✅ Step 2: Insert new categories
        await this.prismaService.categoriesItemStore.createMany({
          data: body.category.map((categoryId: string) => ({
            itemStoreId: saveItem.id,
            categoryId: categoryId,
          })),
        });
      }

      const itemStore = await this.prismaService.itemStore.findUnique({
        where: { id: saveItem.id },
        include: {
          itemStoreImages: true,
        },
      });
      return {
        success: true,
        message: updateDataSuccess,
        data: itemStore,
      };
    } catch (error) {
      return {
        success: false,
        message: updateDataFailed,
        error: error,
      };
    }
  }

  async deleteItemStore(
    user: user,
    body: ItemStoreDeleteRequestDTO,
  ): Promise<WebResponse<any>> {
    try {
      const itemStore = await this.prismaService.itemStore.findFirst({
        where: {
          id: body.id,
          userId: user.id,
        },
      });

      if (!itemStore) {
        throw new BadRequestException(dataNotFound);
      }

      await this.prismaService.itemStore.delete({
        where: {
          id: body.id,
        },
      });
      log(deleteDataSuccess);

      return {
        success: true,
        message: deleteDataSuccess,
      };
    } catch (error) {
      return {
        success: false,
        message: deleteDataFailed,
        error: error,
      };
    }
  }
}
