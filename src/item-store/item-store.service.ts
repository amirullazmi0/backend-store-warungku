import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { itemStore, itemStoreImages, user } from '@prisma/client';
import { log } from 'console';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { NotFoundError } from 'rxjs';
import { AttachmentService } from 'src/attachment/attachment.service';
import { ItemStoreCreateRequestDTO, ItemStoreCreateSchema, ItemStoreDeleteRequestDTO } from 'src/dto/itemStore.dto';
import { createDataFailed, createDataSuccess, createFileSuccess, dataNotFound, deleteDataFailed, deleteDataSuccess, getDataFailed, getDataSuccess } from 'src/dto/message';
import { WebResponse } from 'src/dto/promise';
import { PrismaService } from 'src/prisma/prisma.service';
import ImageKit from "imagekit";

@Injectable()
export class ItemStoreService {
    private publicKeyImageKit = process.env.PUBLIC_KEY_IMAGE_KIT
    private privateKeyImageKit = process.env.PRIVATE_KEY_IMAGE_KIT
    private urlImageKit = process.env.URL_IMAGE_KIT

    private imageKit = new ImageKit({
        publicKey: this.publicKeyImageKit,
        privateKey: this.privateKeyImageKit,
        urlEndpoint: this.urlImageKit,
    })

    constructor(
        private prismaService: PrismaService,
        private attachmentService: AttachmentService,
    ) {
    }

    async getItemStore(user: user, itemStoreId?: string): Promise<WebResponse<any>> {
        try {
            this.imageKit

            let item: itemStore | itemStore[]
            if (itemStoreId) {
                item = await this.prismaService.itemStore.findFirst({
                    where: {
                        userId: user.id,
                        id: itemStoreId
                    },
                    include: {
                        itemStoreImages: true
                    }
                })

                if (!item) {
                    throw new NotFoundException(dataNotFound)
                }
            } else {
                item = await this.prismaService.itemStore.findMany({
                    where: { userId: user.id },
                    include: {
                        itemStoreImages: true
                    }
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

    async createItemStore(user: user, body: ItemStoreCreateRequestDTO, images: Express.Multer.File[], req: Request): Promise<WebResponse<any>> {
        try {
            const id = randomUUID()

            const validate = ItemStoreCreateSchema.parse({
                name: body.name,
                price: Number(body.price),
                qty: Number(body.qty),
                desc: body.desc
            })

            let saveItem = await this.prismaService.itemStore.create({
                data: {
                    id: id,
                    name: validate.name,
                    price: validate.price,
                    qty: validate.qty,
                    desc: validate.desc,
                    userId: user.id
                }
            })

            let item: itemStoreImages[] = []
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    const imagesId = randomUUID()
                    const save = await this.attachmentService.createFile(images[i], req)
                    item.push({
                        id: imagesId,
                        itemstoreId: saveItem.id,
                        path: save.path
                    })
                }
                await this.prismaService.itemStoreImages.createMany({ data: item })
                log(createFileSuccess)
            }

            const uploadPromises = images.map((image) =>
                this.imageKit.upload({
                    file: image.buffer, // Pass the buffer here
                    folder: '/shopowns',
                    fileName: image.originalname,
                    extensions: [
                        {
                            name: 'google-auto-tagging',
                            maxTags: 5,
                            minConfidence: 95,
                        },
                    ],
                })
            );

            const uploadResponses = await Promise.all(uploadPromises);
            console.log('imageKIte', uploadResponses);

            const itemStore = await this.prismaService.itemStore.findUnique({
                where: { id: saveItem.id },
                include: {
                    itemStoreImages: true
                }
            })
            return {
                success: true,
                message: createDataSuccess,
                data: itemStore
            }
        } catch (error) {
            return {
                success: false,
                message: createDataFailed,
                error: error
            }
        }
    }

    async deleteItemStore(user: user, body: ItemStoreDeleteRequestDTO): Promise<WebResponse<any>> {
        try {
            const itemStore = await this.prismaService.itemStore.findFirst({
                where: {
                    id: body.id,
                    userId: user.id
                }
            })

            if (!itemStore) {
                throw new BadRequestException(dataNotFound)
            }

            await this.prismaService.itemStore.delete({
                where: {
                    id: body.id
                }
            })
            log(deleteDataSuccess)

            return {
                success: true,
                message: deleteDataSuccess,
            }
        } catch (error) {
            return {
                success: false,
                message: deleteDataFailed,
                error: error
            }
        }
    }
}
