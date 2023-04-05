import { VideoType } from '@/common/types'
import { useSession } from 'next-auth/react'
import React from 'react'
import { getStorage, ref, deleteObject } from "firebase/storage"
import app from '@/firebase';
import { useRouter } from 'next/navigation';
import ModalLayout from '../General/ModalLayout';
import { useToast } from '@/common/hooks';

const DeleteVideo = ({ video, setOpen }: { video: VideoType, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
   const session = useSession()
   const storage = getStorage(app)
   const router = useRouter()
   const toast = useToast()

   const handleDelete = async () => {
      try {

         const videoRef = ref(storage, video.videoUrl)
         deleteObject(videoRef)
         if (video.videoThumbnail.includes("firebase")) {
            const thumbnailRef = ref(storage, video.videoThumbnail)
            deleteObject(thumbnailRef)
         }

         await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/${video._id}`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${session.data?.user?.accessToken}`
            }
         })
         setOpen(false)
         toast({
            severity: "success",
            message: "Video deleted successfuly"
         })
         router.refresh();
      } catch (err) {
         let message
         if (err instanceof Error) message = err.message
         else message = String(err)
         toast({
            severity: "error",
            message
         })
      }
   }

   const handleClose = () => {
      setOpen(false)
   }

   return (
      <ModalLayout setOpen={setOpen}>
         <div className='bg-white text-black dark:bg-[#202020] dark:text-white py-4 px-5' onClick={(e) => e.stopPropagation()}>
            <div className='flex flex-col items-center justify-center gap-5'>
               <h1 className='text-xl'>Are you sure you want to delete <strong>{video.title}</strong>?</h1>
               <div className='flex w-full items-center justify-center gap-10'>
                  <button className='border rounded text-sky-400 border-sky-400 py-1 px-4 uppercase hover:bg-sky-400/20' onClick={handleDelete}>yes</button>
                  <button className='border rounded text-sky-400 border-sky-400 py-1 px-4 uppercase hover:bg-sky-400/20' onClick={() => handleClose()}>no</button>
               </div>
            </div>
         </div>
      </ModalLayout>
   )
}

export default DeleteVideo