import { ChannelButtons, ChannelVideoRendering } from '@/common/components'
import Image from 'next/image'
import React, { use } from 'react'
import { UserType, VideoType } from '@/common/types'
import { Metadata } from 'next'

type ChannelParams = {
   params: {
      id: string
   }
}

const fetchChannel = async (id: string): Promise<UserType> => {
   const channelData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${id}`, { cache: 'no-store' })
   const channel: UserType = await channelData.json()
   return channel
}

const fetchChannelVideos = async (id: string): Promise<VideoType[]> => {
   const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/uploads/${id}`, { cache: 'no-store' })
   const videos: VideoType[] = await res.json()
   return videos
}

export const generateMetadata = async ({ params }: ChannelParams): Promise<Metadata> => {
   const res = await fetchChannel(params.id)
   return {
      title: `${res.name}`
   }
}

const Channel = ({ params }: ChannelParams) => {
   const { id } = params
   const channel = use(fetchChannel(id))
   const videos: VideoType[] = use(fetchChannelVideos(id))

   return (
      <div>
         <div className='bg-neutral-200 dark:bg-[#202020] px-8 py-6 border-solid border-b-neutral-700 sm:px-4'>
            <div className='flex items-center sm:flex-col'>
               <Image src={channel.profileImg} alt={channel.name} height={80} width={80} className='rounded-full mr-6 sm:m-0' />
               <div className='flex flex-1 flex-wrap items-center sm:flex-col sm:text-center'>
                  <div className='flex-1 mb-2 text-neutral-900 dark:text-zinc-400'>
                     <h1 className='text-xl font-bold sm:mt-2'>{channel.name}</h1>
                     <p className='text-base'>{`${channel.subscribers} ${channel.subscribers === 1 ? "subscriber" : "subscribers"}`}</p>
                  </div>
                  <div>
                     <ChannelButtons channelId={channel._id} />
                  </div>
               </div>
            </div>
         </div>
         <div>
            <div className='py-6 px-6 md:py-4 md:px-4 sm:py-1 sm:px-1'>
               <ChannelVideoRendering videos={videos} />
            </div>
         </div>
      </div>
   )
}

export default Channel