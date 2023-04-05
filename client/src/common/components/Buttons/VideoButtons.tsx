'use client'

import React, { useEffect } from 'react'

import {
   ThumbDownAltOutlined,
   ThumbUpOutlined,
   ThumbUp,
   ThumbDown
} from '@mui/icons-material';

import { VideoType } from '@/common/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/common/hooks';

const VideoButtons = ({ video }: { video: VideoType }) => {
   const router = useRouter()
   const session = useSession()
   const toast = useToast()

   useEffect(() => {
      const addView = async () => {
         await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/view/${video._id}`, {
            method: "PATCH"
         })
      }
      addView()
   }, [])

   const handleLike = async () => {
      if (video.likes?.includes(session.data?.user?.uid as string)) {
         return null
      }
      if (!session.data?.user?.accessToken) {
         toast({
            severity: "info",
            message: "You need to be logged in"
         })
         return
      } else {
         try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/like/${video._id}`, {
               method: 'PATCH',
               headers: {
                  Authorization: `Bearer ${session.data?.user?.accessToken}`
               }
            })
            router.refresh();
         } catch (err) {
            let message
            if (err instanceof Error) message = err.message
            else message = String(err)
            toast({
               severity: "error",
               message
            })
         }
      }
   }

   const handleDislike = async () => {
      if (!session.data?.user?.accessToken) {
         toast({
            severity: "info",
            message: "You need to be logged in"
         })
         return
      } else {
         try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/dislike/${video._id}`, {
               method: 'PATCH',
               headers: {
                  Authorization: `Bearer ${session.data?.user?.accessToken}`
               }
            })
            router.refresh();
         } catch (err) {
            let message
            if (err instanceof Error) message = err.message
            else message = String(err)
            toast({
               severity: "error",
               message
            })
         }
      }
   }

   return (
      <div className='flex gap-5 text-neutral-800 dark:text-white px-3'>
         <button className='flex items-center gap-1' onClick={() => handleLike()}>
            {
               !session || !video.likes?.includes(session.data?.user?.uid as string) ?
                  <ThumbUpOutlined /> :
                  <ThumbUp />
            } {video.likes?.length}
         </button>
         <button className='flex items-center gap-1' onClick={() => handleDislike()}>
            {
               !session || !video.dislikes?.includes(session.data?.user?.uid as string) ?
                  <ThumbDownAltOutlined /> :
                  <ThumbDown />
            } Dislike
         </button>
      </div>
   )
}

export default VideoButtons