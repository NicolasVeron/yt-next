import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video, VideoDocument } from './schema/video.schema';
import type { IGetUserAuthInfoRequest } from 'src/types';
import { User, UserDocument } from '../user/schema/user.schema';

import { getVideoDurationInSeconds } from 'get-video-duration';

@Injectable()
export class VideoService {
   constructor(
      @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
      @InjectModel(User.name) private userModel: Model<UserDocument>,
   ) { }

   async createVideo(videoObject: CreateVideoDto, req: IGetUserAuthInfoRequest) {
      try {
         const { tags } = videoObject
         const tagsArray = tags.split(",").map(i => i.trim())
         const duration = await getVideoDurationInSeconds(videoObject.videoUrl)
         const data = {
            ...videoObject,
            duration,
            userId: req.user?.id,
            tags: tagsArray
         }
         return this.videoModel.create(data)
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async updateVideo(id: string, updateVideoDto: UpdateVideoDto, req: IGetUserAuthInfoRequest) {
      try {
         const video = await this.videoModel.findById(id)
         if (!video) throw new HttpException("Video not found", 404)

         if (req.user?.id === video.userId) {
            const { tags } = updateVideoDto

            const tagsArray = tags?.split(",").map(i => i.trim())

            const updateObject = {
               ...updateVideoDto,
               tags: tagsArray
            }

            const updatedVideo = await this.videoModel.findByIdAndUpdate(id, updateObject, { new: true })
            return updatedVideo
         } else {
            throw new HttpException("The video is not yours", 403)
         }
      } catch (err) {
         throw new Error(err.message)
      }
   }

   async removeVideo(id: string, req: IGetUserAuthInfoRequest) {
      try {
         const video = await this.videoModel.findById(id)
         if (!video) throw new HttpException("Video not found", 404)

         if (req.user?.id === video.userId) {
            await this.videoModel.findByIdAndDelete(id)
            return `Video succesfully deleted`
         } else {
            throw new HttpException("The video is not yours", 403)
         }
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async getVideo(id: string) {
      try {
         const video = await this.videoModel.findById(id).exec()
         if (!video) throw new HttpException("Video not found", 404)
         return video
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async viewVideo(id: string) {
      try {
         await this.videoModel.findByIdAndUpdate(id, {
            $inc: { views: 1 }
         })
         return "The view has been increased"
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   random() {
      try {
         const videos = this.videoModel.aggregate([{ $sample: { size: 50 } }])
         return videos
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   trend() {
      try {
         const videos = this.videoModel.find().sort({
            views: -1
         })
         return videos
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async subscribed(req: IGetUserAuthInfoRequest) {
      try {
         const user = await this.userModel.findById(req.user?.id)

         const subscribedChannels = user?.subscribedUsers

         if (!subscribedChannels) throw new HttpException("No subscriptions", 400)

         const list = await Promise.all(
            subscribedChannels.map((channelId) => {
               return this.videoModel.find({ userId: channelId }).sort({date: -1})
            })
         )

         return list.flat()
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   getByTag(tags: string) {
      const parseTags = tags.split(",")

      try {
         const videos = this.videoModel.find({
            tags: { $in: parseTags }
         }).limit(50)
         return videos
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   search(search: string) {
      try {
         const videos = this.videoModel
         .find({
            title: { $regex: search, $options: "i" }
         })
         .limit(50)
         return videos
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

}
