import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<Comment>

@Schema({timestamps: true})
export class Comment {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    videoId: string;

    @Prop({ required: true })
    description: string;

    createdAt: string
    updatedAt: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment)