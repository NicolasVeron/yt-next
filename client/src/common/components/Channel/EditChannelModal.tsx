"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { EditOutlined } from '@mui/icons-material';
import Crop from '../General/Crop';
import ModalLayout from '../General/ModalLayout';
import { useToast } from '@/common/hooks';
import { AuthorizedSession } from '@/common/types';

const EditChannelModal = ({ session, setOpen }: { session: AuthorizedSession, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
   const [image, setImage] = useState<string | null>("")
   const [photoURL, setPhotoURL] = useState<string>("")
   const [name, setName] = useState<string>(session.data.user?.name || "")
   const [openCrop, setOpenCrop] = useState<boolean>(false)
   const toast = useToast()

   const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         if (!e.target.files[0]) return null
         const file = e.target.files[0]
         if (file.size > 2242880) {
            toast({
               severity: "warning",
               message: "Image shouldn't be larger than 2mb"
            })
         }
         const reader = new FileReader()
         reader.readAsDataURL(e.target.files[0])
         reader.onloadend = () => {
            setPhotoURL(reader.result as string)
            setImage(reader.result as string)
         }
      }
   }

   const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
   }

   const updateChannel = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const updateObject = {
         name,
         profileImg: image ? image : session.data.user?.image
      }

      try {
         await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${session.data.user?.uid}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${session?.data.user?.accessToken}`
            },
            body: JSON.stringify(updateObject),
         })
         await fetch('/api/auth/session?update')
         setOpen(false)
         window.location.reload()
         toast({
            severity: "success",
            message: "Channel updated successfully"
         })
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

   return (
      <ModalLayout setOpen={setOpen}>
         <div className='bg-neutral-50 dark:bg-[#202020] pt-5 pl-5 pr-5 pb-1 text-black dark:text-white' onClick={(e) => e.stopPropagation()}>
            <div className='flex flex-col gap-3 items-center'>
               <div className='relative rounded-full overflow-hidden group text-white'>
                  <Image src={image ? image : session.data.user?.image as string} alt={session.data.user?.name as string} width={300} height={300} className='rounded-full object-cover transition ease-in-out group-hover:brightness-50 !w-72 !h-72' />
                  <label className='absolute w-full h-full top-0 right-0 opacity-0 flex items-center justify-center transition ease-in-out cursor-pointer group-hover:opacity-100 rounded-full' htmlFor='upload-image'>
                     <EditOutlined sx={{ height: "60%", width: "60%" }} />
                  </label>
                  <input type="file" accept='image/*' id='upload-image' onChange={(e) => handleImage(e)} className='hidden' />
               </div>
               {image &&
                  <>
                     <button className='text-white bg-neutral-900 dark:bg-blue-400 dark:text-black hover:bg-neutral-700 dark:hover:bg-blue-300 rounded-sm py-1 px-2' onClick={() => setOpenCrop(true)}>Crop</button>
                     {openCrop && <Crop photoURL={photoURL} setOpenCrop={setOpenCrop} setImage={setImage} />}
                  </>
               }
               <form onSubmit={e => updateChannel(e)} className='w-full flex flex-col gap-2.5'>
                  <input type="text" value={name} onChange={(e) => handleName(e)} placeholder={session.data.user?.name || "Name"} className='w-full text-center p-2 border border-solid border-neutral-300 dark:border-neutral-700 focus:outline-none' />
                  <div className='flex gap-6 justify-around'>
                     <button className='bg-neutral-900 text-white dark:bg-blue-400 dark:text-black enabled:dark:hover:bg-blue-300 enabled:hover:bg-neutral-700 disabled:bg-gray-400 disabled:text-gray-800 rounded-sm py-1 px-2' type='submit'>Update</button>
                     <button className='bg-neutral-900 text-white dark:bg-blue-400 dark:text-black enabled:dark:hover:bg-blue-300 enabled:hover:bg-neutral-700 disabled:bg-gray-400 disabled:text-gray-800 rounded-sm py-1 px-2' onClick={() => setOpen(false)}>Cancel</button>
                  </div>
               </form>
            </div>
         </div>
      </ModalLayout>
   )
}

export default EditChannelModal