import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { IGetUserAuthInfoRequest } from 'src/types';

@Controller('users')
export class UserController {
   constructor(private readonly userService: UserService) { }

   @UseGuards(JwtAuthGuard)
   @Patch(':id')
   updateUser(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.userService.updateUser(id, updateUserDto, req);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   removeUser(
      @Param('id') id: string,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.userService.removeUser(id, req);
   }

   @Get('/find/:id')
   getUser(@Param('id') id: string) {
      return this.userService.getUser(id);
   }

   @UseGuards(JwtAuthGuard)
   @Patch('/sub/:channelId')
   subscribe(
      @Param('channelId') channelId: string,
      @Req() req: IGetUserAuthInfoRequest
   ) {
      return this.userService.subscribe(channelId, req)
   }

   @UseGuards(JwtAuthGuard)
   @Patch('/unsub/:channelId')
   unsubscribe(
      @Param('channelId') channelId: string,
      @Req() req: IGetUserAuthInfoRequest
      ) {
      return this.userService.unsubscribe(channelId, req)
   }

   @UseGuards(JwtAuthGuard)
   @Patch('/like/:videoId')
   like(
      @Param('videoId') videoId: string,
      @Req() req: IGetUserAuthInfoRequest
      ) {
      return this.userService.like(videoId, req)
   }

   @UseGuards(JwtAuthGuard)
   @Patch('/dislike/:videoId')
   dislike(
      @Param('videoId') videoId: string,
      @Req() req: IGetUserAuthInfoRequest
      ) {
      return this.userService.dislike(videoId, req)
   }

   @Get('/uploads/:channelId')
   getChannelVideos(@Param('channelId') channelId: string) {
      return this.userService.getChannelVideos(channelId)
   }

   @Get()
   findAll() {
      return this.userService.findAll();
   }
}
