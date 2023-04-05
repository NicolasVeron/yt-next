import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { GoogleAuthDto } from './dto/google-auth.dto'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) { }

   @Post("signup")
   signUp(@Body() registerAuthDto: RegisterAuthDto) {
      return this.authService.signUp(registerAuthDto);
   }

   @Post("signin")
   signIn(
      @Body() loginAuthDto: LoginAuthDto,
      @Res({passthrough: true}) res: Response
      ) {
      return this.authService.signIn(loginAuthDto, res);
   }

   @Post("google")
   googleSignup(
      @Body() userObject: GoogleAuthDto,
      @Res({passthrough: true}) res: Response
      ) {
      return this.authService.googleSignup(userObject, res)
   }

}
