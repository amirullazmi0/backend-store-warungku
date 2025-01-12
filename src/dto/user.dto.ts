import multer from "multer"
import { z } from "zod"

export class UserGetProfile {
    userId: string
}

export class UserUpdateRequestDTO {
    name?: string
    bio?: string
    email?: string
}

export class PasswordUpdateRequestDTO {
    password?: string
    newPasswod?: string
}

export class UserUpdateLogoRequestDTO {
    logo: Express.Multer.File
}

export class userUpdateRequest {
    email?: string;
    fullName?: string;
    addressId?: string;
    // images?: string;
    //   rolesName?: string;
    //   accessToken?: string;
    //   refreshToken: string;
}

export class AddressUpdateRequestDTO {
    jalan?: string
    rt?: string
    rw?: string
    kodepos?: string
    kelurahan?: string
    kecamatan?: string
    kota?: string
    provinsi?: string
}

export const UserUpdateSchema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    email: z.string().email().optional()
})

export const PasswordUpdateSchema = z.object({
    password: z.string(),
    newPassword: z.string()
})

export const AddressUpdateSchema = z.object({
    jalan: z.string().optional(),
    rt: z.string().optional(),
    rw: z.string().optional(),
    kodepos: z.string().optional(),
    kelurahan: z.string().optional(),
    kecamatan: z.string().optional(),
    kota: z.string().optional(),
    provinsi: z.string().optional(),
})

