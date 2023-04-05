import React, { use } from 'react'
import Image from 'next/image';
import { Comments, Recommended, SubscribeButton, VideoButtons, VideoChannelInfo } from '@/common/components';
import { VideoType, UserType } from '@/common/types';
import { format } from 'timeago.js';
import Link from 'next/link';
import { Metadata } from 'next';

type VideoParams = {
   params: {
      id: string
   }
}

const fetchSingle = async (id: string) => {
   const videoData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/find/${id}`, { cache: 'no-store' })
   const video: VideoType = await videoData.json()

   const channelData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${video.userId}`, { cache: 'no-store' })
   const channel: UserType = await channelData.json()
   return {
      video,
      channel
   }
}

export const generateMetadata = async ({ params }: VideoParams): Promise<Metadata> => {
   const { video } = await fetchSingle(params.id)
   return {
      title: `${video.title}`
   }
}

const page = ({ params }: VideoParams) => {
   const { id } = params
   const { video, channel } = use(fetchSingle(id))

   return (
      <div className='flex gap-6 lg:flex-col py-6 px-6 md:py-4 md:px-4 sm:py-1 sm:px-1'>
         <div className='flex-[5]'>
            <div className='aspect-video inline'>
               <video src={video.videoUrl} className='h-full w-full object-contain aspect-video bg-black' poster={video.videoThumbnail} controls></video>
            </div>
            <h1 className='text-lg font-normal mt-5 mb-2.5 text-black dark:text-white'>{video.title}</h1>
            <div className='flex items-center justify-between text-neutral-500 dark:text-zinc-400'>
               <span className='sm:text-sm'>{`${video.views} ${video.views === 1 ? "view" : "views"} · ${format(video.createdAt)}`}</span>
               <VideoButtons video={video} />
            </div>
            <hr className='my-4 border-0.5 border-solid border-neutral-200 dark:border-neutral-700' />
            <div className='flex'>
               <div className='flex gap-5 w-full text-black dark:text-white sm:gap-2'>
                  <Link href={`/channel/${channel._id}`}>
                     <Image src={channel.profileImg} alt="channel" height={50} width={50} className='rounded-full max-w-none' />
                  </Link>
                  <div className='flex flex-col w-full'>
                     <VideoChannelInfo channel={channel} video={video} />
                     <p>
                        {video.description}
                     </p>
                  </div>
               </div>
            </div>
            <hr className='my-4 border-0.5 border-solid border-neutral-200 dark:border-neutral-700' />
            <Comments videoId={video._id} />
         </div>
         <Recommended tags={video.tags} videoId={video._id}/>
      </div>
   )
}

export default page