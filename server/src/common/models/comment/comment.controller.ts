import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { IGetUserAuthInfoRequest } from 'src/types';

@Controller('comments')
export class CommentController {
   constructor(private readonly commentService: CommentService) { }

   @UseGuards(JwtAuthGuard)
   @Post()
   addComment(
      @Body() createCommentDto: CreateCommentDto,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.commentService.addComment(createCommentDto, req);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   deleteComment(
      @Param('id') id: string,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.commentService.deleteComment(id, req);
   }

   @Get(':videoId')
   getComments(
      @Param('videoId') videoId: string
   ) {
      return this.commentService.getComments(videoId);
   }

   @UseGuards(JwtAuthGuard)
   @Patch(':commentId')
   updateComment(@Param('commentId') commentId: string, @Body() updateCommentDto: UpdateCommentDto) {
      return this.commentService.updateComment(commentId, updateCommentDto);
   }
}
