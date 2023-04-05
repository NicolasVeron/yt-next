import { Session } from "next-auth"

export type VideoType = {
   _id: string
   userId: string
   title: string
   videoThumbnail: string
   videoUrl: string
   duration: number
   description: string
   views: number
   tags: string[]
   likes: string[]
   dislikes: string[]
   createdAt: string
   updatedAt: string
}

export type VideoFormInitialValues = {
   title: string
   videoThumbnail?: string
   description: string
   tags: string
   [index: string]: string | undefined
}

export type TouchedVideoForm = {
   title?: boolean
   videoThumbnail?: boolean
   description?: boolean
   tags?: boolean
   [index: string]: boolean | undefined
}

export type UserType = {
   _id: string
   name: string
   profileImg: string
   email: string
   password: string
   subscribers: number
   subscribedUsers: string[]
   googleUser: boolean
   createdAt: string
   updatedAt: string
}

export interface FetchUserResponse extends UserType {
   token: string
   image?: string
}

export type CommentType = {
   _id: string
   userId: string
   videoId: string
   description: string
   createdAt: string
   updatedAt: string
}

export type LoginInitialValue = {
   email: string
   password: string
   [index: string]: string | undefined
}

export type TouchedLogin = {
   email?: boolean
   password?: boolean
   [index: string]: boolean | undefined
}

export interface SignupInitialValue extends LoginInitialValue {
   name: string
}

export interface TouchedSignup extends TouchedLogin {
   name?: boolean
}

export type AuthorizedSession = {
   data: Session,
   status: 'authenticated'
}

declare module "next-auth" {
   interface User {
      uid?: string;
      accessToken?: string;
      token?: string
      _id?: string
      profileImg?: string
      image?: string
   }

   interface Session {
      user: User;
   }
}

declare module "next-auth/jwt" {
   interface JWT {
      uid?: string
      accessToken?: string
      image?: string
   }

}