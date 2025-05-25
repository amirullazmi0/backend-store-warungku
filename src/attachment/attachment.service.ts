import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { createFileFailed, createFileSuccess } from 'src/dto/message';
import { pathDocument, pathImage } from 'src/dto/path';
import * as mime from 'mime-types';
import { log } from 'console';
const fs = require('fs');
import ImageKit from 'imagekit';
@Injectable()
export class AttachmentService {
  private publicKeyImageKit = process.env.PUBLIC_KEY_IMAGE_KIT;
  private privateKeyImageKit = process.env.PRIVATE_KEY_IMAGE_KIT;
  private urlImageKit = process.env.URL_IMAGE_KIT;

  private imageKit = new ImageKit({
    publicKey: this.publicKeyImageKit,
    privateKey: this.privateKeyImageKit,
    urlEndpoint: this.urlImageKit,
  });

  async createFile(
    file: Express.Multer.File,
    req: Request,
  ): Promise<{ path: string }> {
    let data: string | string[];
    const url = `${req.protocol}://${req.get('host')}`;

    const date = new Date();
    let path: string;
    if (file.mimetype.startsWith('image/')) {
      const fileName = `IMG${date.getTime()}.${mime.extension(file.mimetype)}`;
      const fileLocation = `${pathImage}/${fileName}`;

      try {
        await fs.promises.writeFile(`./public/${fileLocation}`, file.buffer);
        console.log(createFileSuccess);
      } catch (error) {
        console.log(createFileFailed);
        return;
      }
      path = `${url}/${fileLocation}`;
    } else {
      const fileName = `DC${date.getTime()}.${mime.extension(file.mimetype)}`;
      const fileLocation = `${pathDocument}/${fileName}`;

      try {
        await fs.promises.writeFile(`./public/${fileLocation}`, file.buffer);
        log(createFileSuccess);
      } catch (error) {
        log(createFileFailed);
        return;
      }
      path = `${url}/${fileLocation}`;
    }
    return {
      path: path,
    };
  }

  async saveFileImageKit({
    file,
    folder,
  }: {
    file: Express.Multer.File;
    folder?: string;
  }): Promise<{ path: string }> {
    const imageSave = this.imageKit.upload({
      file: file.buffer,
      folder: `/shopowns${folder}`,
      fileName: file.originalname,
      extensions: [
        {
          name: 'google-auto-tagging',
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });

    return {
      path: (await imageSave).url,
    };
  }
}
