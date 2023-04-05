import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import type { IGetUserAuthInfoRequest } from 'src/types';
import { Video, VideoDocument } from '../video/schema/video.schema';
import { CloudinaryService } from 'src/common/services';

@Injectable()
export class UserService {
   constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
      private cloudinary: CloudinaryService
   ) { }

   async updateUser(id: string, updateUserDto: UpdateUserDto, req: IGetUserAuthInfoRequest) {
      if (id === req.user?.id) {
         try {
            const { profileImg } = updateUserDto
            const cloudImage = await this.cloudinary.uploadImage(profileImg, 'yt-avatar')
            
            const updateObject = {
               ...updateUserDto,
               profileImg: cloudImage.secure_url
            }

            const updatedUser = await this.userModel.findByIdAndUpdate(id, updateObject, { new: true })
            return updatedUser
         } catch (err) {
            throw new HttpException(err.message, 400)
         }
      } else {
         throw new HttpException("Not your account", 403)
      }
   }

   async removeUser(id: string, req: IGetUserAuthInfoRequest) {
      if (id === req.user?.id) {
         try {
            await this.userModel.findByIdAndDelete(id)
            return "User deleted"
         } catch (err) {
            throw new HttpException(err.message, 400)
         }
      } else {
         throw new HttpException("Not your account", 403)
      }
   }

   async getUser(id: string) {
      try {
         return this.userModel.findById(id).exec()
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async subscribe(channelId: string, req: IGetUserAuthInfoRequest) {
      try {
         await this.userModel.findByIdAndUpdate(req.user?.id, {
            $addToSet: { subscribedUsers: channelId },
            new: true
         })

         await this.userModel.findByIdAndUpdate(channelId, {
            $inc: { subscribers: 1 }
         })

         const findActuallyUpdated = await this.userModel.findById(req.user?.id)

         return findActuallyUpdated;
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async unsubscribe(channelId: string, req: IGetUserAuthInfoRequest) {
      try {
         await this.userModel.findByIdAndUpdate(req.user?.id, {
            $pull: { subscribedUsers: channelId },
            new: true
         }).exec()

         await this.userModel.findByIdAndUpdate(channelId, {
            $inc: { subscribers: -1 }
         })

         const findActuallyUpdated = await this.userModel.findById(req.user?.id)
         return findActuallyUpdated;
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async like(videoId: string, req: IGetUserAuthInfoRequest) {
      try {
         await this.videoModel.findByIdAndUpdate(videoId, {
            $addToSet: { likes: req.user?.id },
            $pull: { dislikes: req.user?.id }
         })
         return "The video has been liked"
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async dislike(videoId: string, req: IGetUserAuthInfoRequest) {
      try {
         await this.videoModel.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: req.user?.id },
            $pull: { likes: req.user?.id }
         })
         return "The video has been disliked"
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async getChannelVideos(channelId: string) {
      try {
         return this.videoModel.find({
            userId: channelId
         })
         .sort({date: -1})
         .limit(50)
         .exec()
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }




   findAll() {
      return `This action returns all user`;
   }
}
