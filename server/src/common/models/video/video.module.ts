import { forwardRef, Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from './schema/video.schema';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from 'src/common/services';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{name: Video.name, schema: VideoSchema}]),
    CloudinaryModule
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService, MongooseModule]
})
export class VideoModule {}
