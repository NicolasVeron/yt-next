import React from 'react'
import { VideoCard } from '@/common/components'
import { VideoType } from '@/common/types'

const fetchVideos = async () => {
   const videos = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/random`, { cache: "no-store" })
   const data = await videos.json()
   return data
}

export default async function Home() {
   const videos: VideoType[] = await fetchVideos()

   return (
      <main className='flex flex-wrap gap-2.5 py-6 px-6 md:py-4 md:px-4 sm:py-2 sm:px-2'>
         {videos.map(e =>
            <VideoCard video={e} key={e._id}/>
         )}
      </main>
   )
}
