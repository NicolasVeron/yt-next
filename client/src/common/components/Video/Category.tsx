'use client'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { VideoType } from '../../types'
import VideoCard from './VideoCard'

const Category = ({ category }: { category: string }) => {
   const session = useSession()
   const [videos, setVideos] = useState<VideoType[] | null>(null)
   const [loading, setLoading] = useState<boolean>(true)
   const specialTags = ["subscriptions", "trending"]

   useEffect(() => {
      const fetchVideos = async (category: string) => {
         let res: Response
         if (specialTags.includes(category)) {
            res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/${category}`, {
               cache: "no-store",
               headers: {
                  Authorization: `Bearer ${session.data?.user?.accessToken}`
               }
            })
         } else {
            res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/tags?tags=${category}`, {
               cache: "no-store",
               headers: {
                  Authorization: `Bearer ${session.data?.user?.accessToken}`
               }
            })
         }
         const data = await res.json()
         setVideos(data)
         setLoading(false)
      }
      fetchVideos(category)
   }, [])

   if (loading) {
      return null
   }

   return (
      <div className='w-full'>
         <h1 className='mb-6 text-2xl font-bold first-letter:uppercase'>{category}</h1>
         <div className={`flex flex-wrap gap-2.5 my-auto ${!videos?.length && "justify-center mt-6"}`}>
            {videos?.length ? videos.map(e =>
               <VideoCard video={e} key={e._id} />
            ) : <h1 className='text-4xl font-medium text-center text-neutral-500 dark:text-neutral-500'>No videos found</h1>}
         </div>
      </div>
   )
}

export default Category