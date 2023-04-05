import { VideoCard } from '@/common/components'
import { VideoType } from '@/common/types'
import React, { use } from 'react'

const searchContent = async (term: string) => {
   const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/search?s=${term}`)
   const content = await res.json()
   return content
}

const SearchPage = ({ params }: { params: { searchTerm: string } }) => {
   const { searchTerm } = params
   const content: VideoType[] = use(searchContent(searchTerm))

   return (
      <div className='py-6 px-6 md:py-4 md:px-4 sm:py-2 sm:px-2'>
         <h1 className='mb-6 text-xl font-bold first-letter:uppercase'>{`Search results for: "${searchTerm}"`}</h1>
         <div className='flex flex-wrap gap-2.5'>
            {content.map((e, i) =>
               <VideoCard video={e} key={i} />
            )}
         </div>
      </div>
   )
}

export default SearchPage