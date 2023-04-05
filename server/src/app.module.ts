import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './common/models/user/user.module';
import { VideoModule } from './common/models/video/video.module';
import { CommentModule } from './common/models/comment/comment.module';
import { AuthModule } from './auth/auth.module';
import configuration from './common/config/env';

@Module({
   imports: [
      ConfigModule.forRoot({
         load: [configuration],
      }),
      MongooseModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGO_URI')
         }),
         inject: [ConfigService],
      }),
      UserModule,
      VideoModule,
      CommentModule,
      AuthModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule { }
