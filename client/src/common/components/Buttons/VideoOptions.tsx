'use client'

import React, { useEffect, useState } from 'react'
import { MoreVertOutlined } from '@mui/icons-material';
import EditVideoModal from '../Video/EditVideo';
import DeleteVideo from '../Video/DeleteVideo';
import { VideoType } from '@/common/types';

const VideoOptions = ({ videoId }: { videoId: string }) => {
   const [open, setOpen] = useState<boolean>(false)
   const [edit, setEdit] = useState<boolean>(false)
   const [deleteConf, setDeleteConf] = useState<boolean>(false)
   const [video, setVideo] = useState<VideoType | null>(null)

   useEffect(() => {
      const fetchVideo = async () => {
         const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/find/${videoId}`)
         const video = await res.json()
         setVideo(video)
      }
      fetchVideo()
   }, [videoId])

   const handleEdit = () => {
      setEdit(true)
      setOpen(false)
   }

   const handleDelete = () => {
      setDeleteConf(true)
      setOpen(false)
   }

   return (
      <div className='relative ml-auto'>
         <div className='text-neutral-800 dark:text-white m-1 rounded-full h-fit p-1 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600' onClick={() => setOpen(!open)}>
            <MoreVertOutlined />
         </div>
         {open &&
            <div className='absolute z-50 sm:fixed sm:w-screen sm:h-screen sm:bg-black/60 sm:top-0 sm:left-0' onClick={() => setOpen(false)}>
               <div className="absolute flex flex-col gap-2.5 right-0 -top-5 py-2 w-max bg-white dark:bg-neutral-700 text-black dark:text-white shadow-2xl sm:top-auto sm:py-0 sm:bottom-0 sm:gap-1 sm:h-max sm:w-full" onClick={(e) => e.stopPropagation()}>
                  <button className='p-2 sm:p-3 sm:text-xl hover:bg-neutral-200 dark:hover:bg-neutral-600' onClick={() => handleEdit()}>
                     Edit video
                  </button>
                  <button className='p-2 sm:p-3 sm:text-xl hover:bg-neutral-200 dark:hover:bg-neutral-600' onClick={() => handleDelete()}>
                     Delete video
                  </button>
               </div>
            </div>
         }
         {edit && video !== null &&
            <EditVideoModal video={video} setOpen={setEdit} />
         }
         {deleteConf && video !== null &&
            <DeleteVideo video={video} setOpen={setDeleteConf} />
         }
      </div>
   )
}

export default VideoOptions