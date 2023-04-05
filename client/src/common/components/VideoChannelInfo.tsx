'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { UserType, VideoType } from '../types'
import SubscribeButton from './Buttons/SubscribeButton'

type Props = {
   video: VideoType
   channel: UserType
}

const VideoChannelInfo = ({ video, channel }: Props) => {
   const { data } = useSession()
   return (
      <div className='flex justify-between'>
         <div className='flex flex-col'>
            <Link href={`/channel/${channel._id}`}>
               <span className='font-medium'>{channel.name}</span>
            </Link>
            <span className='my-1 mb-5 text-neutral-500 dark:text-zinc-400 text-sm'>{channel.subscribers} {channel.subscribers === 1 ? "subscriber" : "subscribers"}</span>
         </div>
         {data?.user.uid !== channel._id &&
            <SubscribeButton video={video} />
         }
      </div>
   )
}

export default VideoChannelInfo