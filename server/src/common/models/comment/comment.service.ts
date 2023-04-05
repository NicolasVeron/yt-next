import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schema/comment.schema';
import type { IGetUserAuthInfoRequest } from 'src/types';
import { Video, VideoDocument } from '../video/schema/video.schema';

@Injectable()
export class CommentService {
   constructor(
      @InjectModel(Comment.name) private commentsModel: Model<CommentDocument>,
      @InjectModel(Video.name) private videoModel: Model<VideoDocument>
   
      ) { }

   async addComment(commentObject: CreateCommentDto, req: IGetUserAuthInfoRequest) {
      try {
         const newComment = {
            ...commentObject,
            userId: req.user?.id,
         }

         return this.commentsModel.create(newComment)
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async deleteComment(id: string, req: IGetUserAuthInfoRequest) {
      try {
         const comment = await this.commentsModel.findById(id)
         const video = await this.videoModel.findById(id)
         
         if (req.user?.id === comment?.userId || req.user?.id === video?.userId) {
            await this.commentsModel.findByIdAndDelete(id)
            return 'Comment deleted'
         } else {
            throw new HttpException("Not your comment", 403)
         }
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async getComments(videoId: string) {
      try {
         const comments = await this.commentsModel.find({videoId})
         return comments
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
      return `This action updates a #${commentId} comment`;
   }
}
