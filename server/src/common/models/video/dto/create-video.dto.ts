import { IsNotEmpty, Max } from "class-validator";

export class CreateVideoDto {
    userId: string;

    @IsNotEmpty()
    @Max(30)
    title: string;

    @IsNotEmpty()
    videoThumbnail: string;

    @IsNotEmpty()
    videoUrl: string;

    views: number;

    @IsNotEmpty()
    @Max(50)
    tags: string;

    likes: string[];
    dislikes: string[];
}
