import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import type { IGetUserAuthInfoRequest } from 'src/types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('videos')
export class VideoController {
   constructor(private readonly videoService: VideoService) { }

   @UseGuards(JwtAuthGuard)
   @Post()
   createVideo(
      @Body() createVideoDto: CreateVideoDto,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.videoService.createVideo(createVideoDto, req);
   }

   @UseGuards(JwtAuthGuard)
   @Patch(':id')
   updateVideo(
      @Param('id') id: string,
      @Body() updateVideoDto: UpdateVideoDto,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.videoService.updateVideo(id, updateVideoDto, req);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   removeVideo(
      @Param('id') id: string,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.videoService.removeVideo(id, req);
   }

   @Get('/find/:id')
   getVideo(@Param('id') id: string) {
      return this.videoService.getVideo(id)
   }

   @Patch('/view/:id')
   viewVideo(@Param('id') id: string) {
      return this.videoService.viewVideo(id)
   }

   @Get('/random')
   random() {
      return this.videoService.random()
   }

   @Get('/trending')
   trend() {
      return this.videoService.trend()
   }

   @UseGuards(JwtAuthGuard)
   @Get('/subscriptions')
   subscribed(@Req() req: IGetUserAuthInfoRequest) {
      return this.videoService.subscribed(req)
   }

   @Get('/tags')
   getByTag(@Query('tags') tags: string) {
      return this.videoService.getByTag(tags)
   }

   @Get('/search')
   search(@Query('s') s: string) {
      return this.videoService.search(s)
   }

}
