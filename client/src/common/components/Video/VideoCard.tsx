import Image from 'next/image'
import Link from 'next/link'
import React, { use } from 'react'
import { UserType, VideoType } from "../../types"
import { format } from "timeago.js"
import VideoOptions from '../Buttons/VideoOptions'

const fetchChannel = async (userId: string) => {
   const channel = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${userId}`, { cache: 'no-store' })
   const data = await channel.json()
   return data
}

const parseDuration = (time: number) => {
   const minutes = Math.floor(time / 60)
   const seconds = Math.floor(time - minutes * 60)
   return `${minutes}:${seconds.toString().length === 1 ? '0' : ''}${seconds}`
}

const VideoCard = ({ video, type, options }: { video: VideoType, type?: string, options?: boolean }) => {
   const channel: UserType = use(fetchChannel(video.userId))

   return (
      <div className={`${type === "sm" ? "mb-2.5" : "mb-4 w-80 gap-2.5 basis-[19.3%] xl:basis-[24%] lg:basis-[32%] md:basis-[49%] sm:basis-full sm:mb-2"}`}>
         <div className={`${type === 'sm' && "flex gap-2.5"}`}>
            <Link href={`/video/${video._id}`} className={`cursor-pointer ${type === 'sm' && "flex-1 w-1/2"}`}>
               <div className='relative'>
                  {video.videoThumbnail ?
                     <Image src={video.videoThumbnail} alt={video.title} height={type === "sm" ? 120 : 202} width={1000} className={`bg-black aspect-video object-contain ${type === "sm" ? 'flex-1' : "w-full "}`} /> :
                     <video src={video.videoUrl} preload="metadata" className={`bg-black aspect-video object-contain ${type === "sm" ? 'flex-1' : "w-full "}`}></video>}
                  <p className='text-white bg-black py-0.5 px-2 absolute bottom-0 right-0 m-1'>{`${parseDuration(video.duration)}`}</p>
               </div>
            </Link>
            <div className={`flex ${type === "sm" ? "flex-1 w-1/2 gap-1 sm:gap-0" : "gap-3 mt-3"}`}>
               <Link href={`/channel/${video.userId}`}>
                  <Image src={channel.profileImg} alt={video.userId} title={channel.name} height={36} width={36} className={`rounded-full bg-zinc-400 object-cover ${type === "sm" ? "hidden" : ""}`} />
               </Link>
               <div className='overflow-hidden overflow-ellipsis'>
                  <h1 className='text-base font-medium text-black dark:text-white overflow-hidden overflow-ellipsis'>{video.title}</h1>
                  <Link href={`/channel/${video.userId}`}>
                     <h2 className='text-sm text-neutral-500 dark:text-zinc-400 mt-0.5 overflow-hidden overflow-ellipsis hover:text-neutral-600 hover:dark:text-white' title={channel.name}>{channel.name}</h2>
                  </Link>
                  <div className='text-sm text-neutral-500 dark:text-zinc-400'>{`${video.views} ${video.views === 1 ? "view" : "views"} · ${format(video.createdAt)}`}</div>
               </div>
               {options &&
                  <VideoOptions videoId={video._id}/>
               }
            </div>
         </div>
      </div >
   )
}

export default VideoCard