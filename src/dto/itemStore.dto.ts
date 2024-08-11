import { z } from "zod"

export class ItemStoreCreateRequestDTO {
    name: string
    total: number
    price: number
    images: Express.Multer.File[]
    desc?: string
}

export class ItemStoreDeleteRequestDTO {
    id: string
}

export const ItemStoreCreateSchema = z.object({
    name: z.string().min(1),
    total: z.number(),
    price: z.number(),
    desc: z.string().optional()
})