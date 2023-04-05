import { HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/common/models/user/schema/user.schema';
import { hash, compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { GoogleAuthDto } from './dto/google-auth.dto'

interface DocumentResult<T> {
   _doc: T;
}

interface IEvent extends DocumentResult<IEvent> {
   _id: string;
   name: string
   password: string
   email: string
}

@Injectable()
export class AuthService {
   constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private jwtService: JwtService
   ) { }

   async signUp(userObject: RegisterAuthDto) {
      try {
         const { password } = userObject

         const plainToHash = await hash(password as string, 10)
         
         userObject = {
            ...userObject,
            password: plainToHash
         }
         return this.userModel.create(userObject)
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async signIn(loginObject: LoginAuthDto, res: Response) {
      try {
         const { email } = loginObject

         const findUser: IEvent | null = await this.userModel.findOne({ email })
         if (!findUser) throw new HttpException("User not found", 404)

         const comparePasword = await compare(loginObject.password, findUser.password)
         if (!comparePasword) throw new HttpException('Incorrect password', 403)

         const payload = {
            id: findUser._id,
            name: findUser.email
         }

         const token = this.jwtService.sign(payload)

         const { password, ...others } = findUser._doc

         const data = {
            ...others,
            token
         }

         res.status(200).json(data)

      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }

   async googleSignup(userObject: GoogleAuthDto, res: Response) {
      try {
         const { email } = userObject
         const user: IEvent | null = await this.userModel.findOne({ email })
         if (user) {
            // Login
            const payload = {
               id: user._id,
               name: user.email
            }

            const token = this.jwtService.sign(payload)

            const { password, ...others } = user._doc

            const data = {
               ...others,
               token
            }
            res.status(200).json(data)
         } else {
            // Register

            userObject = {
               ...userObject,
               googleUser: true
            }

            const createdUser = await this.userModel.create(userObject)

            const token = this.jwtService.sign({ id: createdUser._id, name: createdUser.email })

            const data = {
               ...createdUser,
               token
            }
            
            res.status(200).json(data)
         }
      } catch (err) {
         throw new HttpException(err.message, 400)
      }
   }
}
