import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/common/models/user/user.module';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
   imports: [
      UserModule,
      JwtModule.registerAsync({
         imports: [ConfigModule],
         useFactory: async (configService: ConfigService) => {
            return {
               secret: configService.get<string>('JWT_KEY'),
               signOptions: {
                  expiresIn: "90d"
               }
            }
         },
         inject: [ConfigService]
      })
   ],
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy],
   exports: [AuthService, JwtStrategy]
})
export class AuthModule { }
