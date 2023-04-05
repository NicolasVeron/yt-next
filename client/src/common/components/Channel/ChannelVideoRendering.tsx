'use client'

import { useSession } from 'next-auth/react'
import React from 'react'
import { VideoType } from '../../types'
import VideoCard from '../Video/VideoCard'

const ChannelVideoRendering = ({ videos }: { videos: VideoType[] }) => {
   const { data } = useSession()

   return (
      <div className='flex flex-wrap gap-2.5'>
         {!videos.length ?
            <div className='flex items-center justify-center text-black dark:text-white w-full mt-6'>
               <h1 className='text-3xl font-medium'>No videos uploaded.</h1>
            </div>
            :
            videos.map((video, i) =>
               <VideoCard video={video} key={i} options={video.userId === data?.user.uid} />
            )
         }
      </div>
   )
}

export default ChannelVideoRendering