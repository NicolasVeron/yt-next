"use client"

import { VideoType, VideoFormInitialValues, TouchedVideoForm } from '@/common/types'
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ModalLayout from '../General/ModalLayout'
import { videoFields } from '@/common/constants'
import { videoFormValidation } from '@/common/constants/validation'
import { useToast } from '@/common/hooks'
import { CloseOutlined } from '@mui/icons-material'
import app from '@/firebase'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

const EditVideo = ({ video, setOpen }: { video: VideoType, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
   const [loadImage, setLoadImage] = useState<boolean>(false)
   const [image, setImage] = useState<string>(video.videoThumbnail ? video.videoThumbnail : "")
   const [updating, setUpdating] = useState<boolean>(false)
   const session = useSession()
   const router = useRouter()
   const toast = useToast()
   const storage = getStorage(app)

   const initialValue: VideoFormInitialValues = {
      title: video.title,
      videoThumbnail: image,
      description: video.description,
      tags: video.tags.toString()
   }

   const handleSubmit = async (data: VideoFormInitialValues) => {
      setUpdating(true)
      try {
         const updateObject = {
            ...data,
            videoThumbnail: image
         }
         await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/${video._id}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${session.data?.user?.accessToken}`
            },
            body: JSON.stringify(updateObject)
         })

         // Delete previous thumbnail
         if (video.videoThumbnail && (image !== video.videoThumbnail)) {
            const imageRef = ref(storage, video.videoThumbnail)
            deleteObject(imageRef)
         }

         setOpen(false)
         toast({
            severity: "success",
            message: "Video edited successfully"
         })
         router.refresh()
      } catch (err) {
         let message
         if (err instanceof Error) message = err.message
         else message = String(err)
         toast({
            severity: "error",
            message
         })
      }
      setUpdating(false)
   }

   const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         if (!e.target.files[0]) return null
         const file = e.target.files[0]
         if (file.size > 2242880) {
            toast({
               severity: "error",
               message: "Thumbnail shouldn't be larger than 2mb"
            })
            return null
         }
         const fileName = `${file.name} - ${new Date().getTime()}`
         const storageRef = ref(storage, fileName);
         const uploadTask = uploadBytesResumable(storageRef, file);

         setLoadImage(true)
         uploadTask.on("state_changed", {
            complete: () => {
               setLoadImage(false)
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImage(downloadURL)
               })
            }
         })
      }
   }

   const handleClose = () => {
      // Delete unused file
      if (image !== video.videoThumbnail) {
         const imageRef = ref(storage, image)
         deleteObject(imageRef)
      }
      setOpen(false)
   }

   return (
      <ModalLayout setOpen={setOpen}>
         <div className='w-5/6 max-w-5xl bg-neutral-50 dark:bg-[#202020] text-black dark:text-white relative md:w-full md:overflow-y-auto md:h-full' onClick={(e) => e.stopPropagation()}>
            <div className='flex flex-wrap py-4 px-2 gap-2.5 md:flex-col md:flex-nowrap'>
               <button className='absolute right-0 top-0 cursor-pointer text-black dark:text-white hover:text-red-500 px-1 py-1' onClick={() => handleClose()}>
                  <CloseOutlined />
               </button>
               <h1 className='w-full text-center sm:text-lg'>{`${video.title}`}</h1>
               <div className='flex flex-1 flex-col gap-2.5 items-center md:flex-col'>
                  <video src={video.videoUrl} poster={image ? image : video.videoThumbnail} controls className='aspect-video w-full bg-black' />
                  {image &&
                     <div className='flex flex-col items-center gap-1'>
                        <h2 className='text-center'>Thumbnail</h2>
                        <img src={image} alt="thumbnail" className={`max-w-[250px] aspect-video object-cover h-[140] ${loadImage && 'filter brightness-50'}`} />
                     </div>
                  }
               </div>
               <div className='flex-1 md:w-full'>
                  <Formik
                     initialValues={initialValue}
                     validationSchema={videoFormValidation}
                     onSubmit={(value) => handleSubmit(value)}>
                     {({ errors, touched, values }: { errors: Partial<VideoFormInitialValues>, touched: TouchedVideoForm, values: VideoFormInitialValues }) => (
                        <Form className='flex flex-col gap-2.5'>
                           {videoFields.map(e =>
                              <div className={`relative border border-solid ${(errors[e.name] && touched[e.name]) && "!border-red-600"} border-neutral-300 dark:border-neutral-700 rounded-sm p-2.5 bg-transparent flex flex-col font-normal text-sm tracking-wide`} key={e.name}>
                                 <div className='flex items-center flex-wrap gap-1.5'>
                                    <label className='text-base'>{e.label}</label>
                                    {(errors[e.name] && touched[e.name]) && <p className='text-red-500'>{`( ${errors[e.name]} )`}</p>}
                                 </div>
                                 <Field as={e.as} rows={e.rows} name={e.name} placeholder={e.placeholder ? e.placeholder : ""} autoComplete='off' className='p-0.5 bg-transparent text-base resize-none focus:outline-none' />
                                 {e.max && <span className='absolute right-0 bottom-0 my-1 mx-2 text-neutral-500'>{`${values[e.name]?.length}/${e.max}`}</span>}
                              </div>
                           )}
                           <div className='border border-solid border-neutral-300 dark:border-neutral-700 rounded-sm p-2.5 bg-transparent flex flex-col font-normal text-sm tracking-wide'>
                              <label>Thumbnail</label>
                              <div className='flex justify-between'>
                                 <input type="file" accept='image/*' className='border border-neutral-700 rounded-sm p-2.5 bg-transparent outline-none border-none' onChange={e => handleFile(e)} />
                              </div>
                           </div>
                           <button type='submit' className='rounded-sm py-2.5 px-5 font-medium cursor-pointer bg-black text-white dark:bg-blue-400 dark:text-black enabled:hover:bg-neutral-700 enabled:dark:hover:bg-blue-300 disabled:bg-gray-400 disabled:text-gray-800' disabled={updating}>{`${updating ? 'Updating video...' : 'Update'}`}</button>
                        </Form>
                     )}

                  </Formik>
               </div>
            </div>
         </div>
      </ModalLayout>
   )
}

export default EditVideo