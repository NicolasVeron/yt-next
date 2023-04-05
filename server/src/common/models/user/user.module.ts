import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModule } from '../video/video.module';
import { CloudinaryModule } from 'src/common/services';

@Module({
  imports: [
    forwardRef(() => VideoModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule]
})
export class UserModule {}
