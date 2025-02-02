import { z } from "zod"

export class ItemStoreCreateRequestDTO {
    name: string
    qty: number
    price: number
    // images: Express.Multer.File[]
    desc?: string
    category: string[]
}

export class ItemStoreUpdateRequestDTO {
    id: string
    name: string
    qty: number
    price: number
    imageBefore: string[]
    desc?: string
    category: string[]
}

export interface ItemStoreImage {
    id: string;
    path: string;
    itemstoreId: string;
}

export class ItemStoreDeleteRequestDTO {
    id: string
}

export const ItemStoreCreateSchema = z.object({
    name: z.string().min(1),
    qty: z.number(),
    price: z.number(),
    desc: z.string().optional()
})


export const ItemStoreUpdateSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    qty: z.number(),
    price: z.number(),
    desc: z.string().optional()
})