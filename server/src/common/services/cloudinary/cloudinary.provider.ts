import { v2 } from 'cloudinary'

export const CloudinaryProvider = {
   provide: 'Cloudinary',
   useFactory: () => {
      return v2.config({
         cloud_name: 'dayt0wtlk',
         api_key: '842381948116441',
         api_secret: 'lBmfSdHokhIBaalqPCs6Asl2rHY',
      })
   }
}