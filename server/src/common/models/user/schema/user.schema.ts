import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string

    @Prop()
    password: string;

    @Prop({default: 'https://res.cloudinary.com/dayt0wtlk/image/upload/v1678478287/yt-avatar/default_pslj9k.jpg'})
    profileImg: string;

    @Prop({ default: 0 })
    subscribers: number;

    @Prop({ type: [String] })
    subscribedUsers: string[];

    @Prop({ default: false })
    googleUser: boolean

    createdAt: string
    updatedAt: string
}

export const UserSchema = SchemaFactory.createForClass(User)