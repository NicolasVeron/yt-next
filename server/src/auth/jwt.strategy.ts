import { Injectable } from "@nestjs/common/decorators";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

type ValidationPayload = {
   id: string
   name: string
   iat: number
   exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor() {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: process.env.JWT_KEY
      });
   }
   async validate(payload: ValidationPayload) {
      return { id: payload.id, name: payload.name };
   }
}