import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()

export class CloudinaryService {
   async uploadImage(file: string, folderName: string): Promise<UploadApiResponse> {
      return new Promise((resolve, reject) => {
         const upload = v2.uploader.upload(file, {
            folder: folderName,
            height: 250,
            width: 250,
            crop: "fill"
         })
         resolve(upload)
      })
   }
}