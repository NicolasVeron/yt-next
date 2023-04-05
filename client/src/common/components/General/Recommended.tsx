import { VideoType } from '@/common/types'
import React, { use } from 'react'
import { VideoCard } from '..'

const fetchAll = async () => {
   const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/random`)
   const data = await res.json()
   return data
}

const fetchRecommended = async (tags: string[]) => {
   const stringTags = tags.join(",")
   const videos = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/tags?tags=${stringTags}`, { cache: "no-store" })
   const data = await videos.json()
   if (data.length <= 2) {
      const allVideos = await fetchAll()
      return allVideos
   }
   return data
}

export const Recommended = ({ tags, videoId }: { tags: string[], videoId: string }) => {
   const recommended: VideoType[] = use(fetchRecommended(tags))
   const filter: VideoType[] = recommended.filter(e => e._id !== videoId)

   return (
      <div className='flex-[2]'>
         {filter.map(e =>
            <VideoCard video={e} key={e._id} type="sm" />
         )}
      </div>
   )
}

export default Recommended