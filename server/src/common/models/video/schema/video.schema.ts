import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VideoDocument = HydratedDocument<Video>

@Schema({timestamps: true})
export class Video {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    videoThumbnail: string;

    @Prop({ required: true })
    videoUrl: string;

    @Prop()
    description: string;

    @Prop({required: true})
    duration: number

    @Prop({ default: 0 })
    views: number;

    @Prop({default: [], type: [String]})
    tags: string[];

    @Prop({default: [], type: [String]})
    likes: string[];

    @Prop({default: [], type: [String]})
    dislikes: string[];

    createdAt: string
    updatedAt: string
}

export const VideoSchema = SchemaFactory.createForClass(Video)