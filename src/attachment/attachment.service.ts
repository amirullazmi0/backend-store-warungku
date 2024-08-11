import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { createFileFailed, createFileSuccess } from 'src/dto/message';
import { pathDocument, pathImage } from 'src/dto/path';
import * as mime from 'mime-types';
import { log } from 'console';
const fs = require('fs');
@Injectable()
export class AttachmentService {
    async createFile(file: Express.Multer.File | Express.Multer.File[], req: Request): Promise<{ path: string | string[] }> {
        let data: string | string[]
        const url = `${req.protocol}://${req.get('host')}`

        const date = new Date
        let path: string | string[]
        if (Array.isArray(file)) {
            const fileArray = []
            file.map((item: Express.Multer.File) => {
                console.log(item)
                fileArray.push(item.originalname)
            })
            data = fileArray
        } else {
            if (file.mimetype.startsWith('image/')) {
                const fileName = `IMG${date.getTime()}.${mime.extension(file.mimetype)}`;
                const fileLocation = `${pathImage}/${fileName}`

                try {
                    await fs.promises.writeFile(`./public/${fileLocation}`, file.buffer);
                    console.log(createFileSuccess);

                } catch (error) {
                    console.log(createFileFailed);
                    return
                }
                path = `${url}/${fileLocation}`
            } else {
                const fileName = `DC${date.getTime()}.${mime.extension(file.mimetype)}`;
                const fileLocation = `${pathDocument}/${fileName}`

                try {
                    await fs.promises.writeFile(`./public/${fileLocation}`, file.buffer);
                    log(createFileSuccess)

                } catch (error) {
                    log(createFileFailed);
                    return
                }
                path = `${url}/${fileLocation}`
            }
        }
        return {
            path: path
        }
    }
}
