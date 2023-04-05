'use client'

import React, { useRef, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTask } from "firebase/storage";
import app from '@/firebase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ModalLayout from '../General/ModalLayout';
import { CloseOutlined } from '@mui/icons-material';
import { videoFields } from '@/common/constants';
import { VideoFormInitialValues, TouchedVideoForm } from '@/common/types';
import { videoFormValidation } from '@/common/constants/validation';

import { Formik, Form, Field } from 'formik'
import { useToast } from '@/common/hooks';

const CreateVideo = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
   const { data } = useSession()
   const router = useRouter()
   const toast = useToast()
   const storage = getStorage(app)
   const uploadFileRef = useRef<UploadTask>()
   const [files, setFiles] = useState({
      videoThumbnail: "",
      videoUrl: ""
   })
   const [perc, setPerc] = useState({
      imgPerc: 0,
      videoPerc: 0
   })
   const [isUploading, setIsUploading] = useState<boolean>(false)

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         if (!e.target.files[0]) return null
         const type = e.target.files[0].type
         const file = e.target.files[0]
         if (type.includes("video")) {
            handleFile(file, 'videoUrl')
         } else if (type.includes("image")) {
            handleFile(file, 'videoThumbnail')
         }
      }
   }

   const handleFile = async (file: File, urlType: string) => {
      if (file.type.includes("video") && file.size > 32428800) {
         toast({
            severity: "error",
            message: "Video shouldn't be larger than 30mb"
         })
         return null
      } else if (file.type.includes("image") && file.size > 2242880) {
         toast({
            severity: "error",
            message: "Thumbnail shouldn't be larger than 2mb"
         })
         return null
      }

      const fileName = `${file.name} - ${new Date().getTime()}`
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file, {
         customMetadata: {
            userId: data?.user?.uid || "unknown",
            username: data?.user?.name || "unknown",
            email: data?.user?.email || "unknown"
         }
      });
      uploadFileRef.current = uploadTask

      uploadTask.on('state_changed',
         (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            urlType === 'videoThumbnail' ? setPerc({ ...perc, imgPerc: progress }) : setPerc({ ...perc, videoPerc: progress })
         },
         (error) => {
            if (error.code === "storage/canceled") {
               toast({
                  severity: "info",
                  message: "Upload canceled"
               })
            }
            if (error.code === "storage/quota-exceeded") {
               toast({
                  severity: "error",
                  message: "Firebase storage limit exceeded"
               })
            }
         },
         () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               setFiles({
                  ...files,
                  [urlType]: downloadURL
               })
            });
         })
   }

   const handleClose = () => {
      if (!isUploading) {
         if (files.videoUrl) {
            const videoRef = ref(storage, files.videoUrl)
            deleteObject(videoRef)
         }
         if (files.videoThumbnail) {
            const imageRef = ref(storage, files.videoThumbnail)
            deleteObject(imageRef)
         }
         setOpen(false)
      }
      uploadFileRef.current?.cancel()
      setOpen(false)
   }

   const createVideo = async (values: VideoFormInitialValues) => {
      setIsUploading(true)

      if (!files.videoUrl) {
         toast({
            severity: "warning",
            message: "A video is required"
         })
         return null
      }

      const createObject = {
         ...values,
         ...files
      }

      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.user?.accessToken}`
         },
         body: JSON.stringify(createObject)
      })

      setIsUploading(false)
      setOpen(false)
      toast({
         severity: "success",
         message: "Video uploaded"
      })
      router.refresh();
   }

   const initialValue: VideoFormInitialValues = {
      title: "",
      description: "",
      tags: ""
   }

   return (
      <ModalLayout setOpen={setOpen}>
         <div className="h-screen w-screen flex items-center justify-center">
            <div className='w-5/6 max-w-5xl bg-neutral-50 dark:bg-[#202020] text-black dark:text-white p-2.5 relative md:w-full md:overflow-y-auto md:h-full' onClick={e => e.stopPropagation()}>
               <button className='absolute right-0 top-0 cursor-pointer text-black dark:text-white hover:text-red-500 px-1 py-1' onClick={handleClose}>
                  <CloseOutlined />
               </button>
               <h1 className='text-center md:text-lg'>Upload a video</h1>
               <div className='flex flex-wrap py-4 px-2 gap-2.5 md:flex-col md:flex-nowrap'>
                  <div className='flex flex-1 flex-col gap-2.5 items-center'>
                     {files.videoUrl ?
                        <video src={files.videoUrl} poster={files.videoThumbnail ? files.videoThumbnail : ""} controls className='aspect-video w-full bg-black' />
                        :
                        <div className='relative aspect-video w-full border border-dashed border-sky-400'>
                           <label htmlFor="upload-video" className='absolute cursor-pointer w-full h-full flex items-center justify-center'>
                              {perc.videoPerc > 0 ?
                                 `${Math.round(perc.videoPerc)}%`
                                 : "Upload video"
                              }
                           </label>
                           <input type="file" accept='video/*' id='upload-video' onChange={(e) => handleFileUpload(e)} className='hidden' />
                        </div>
                     }
                     {files.videoThumbnail ?
                        <img src={files.videoThumbnail} alt="thumbnail" className="max-w-[250px] aspect-video object-cover h-[140]" />
                        :
                        <div className='relative min-w-[250px] max-w-[250px] aspect-video object-cover h-[140] border border-dashed border-sky-400'>
                           <label htmlFor="upload-image" className='absolute cursor-pointer w-full h-full flex items-center justify-center'>
                              {
                                 perc.imgPerc > 0 ?
                                    `${Math.round(perc.imgPerc)}%`
                                    : "Upload thumbnail"
                              }
                           </label>
                           <input type="file" accept='image/*' id='upload-image' onChange={(e) => handleFileUpload(e)} className='hidden' />
                        </div>
                     }
                  </div>
                  <div className='flex-1'>
                     <Formik
                        initialValues={initialValue}
                        validationSchema={videoFormValidation}
                        onSubmit={(e) => createVideo(e)}>
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
                              <button type='submit' className='cursor-pointer py-2.5 px-5 bg-black text-white dark:bg-blue-400 dark:text-black enabled:hover:bg-gray-800 disabled:bg-gray-400 disabled:text-gray-800' disabled={isUploading}>{`${isUploading ? 'Uploading video' : 'SUBMIT'}`}</button>
                           </Form>
                        )}
                     </Formik>
                  </div>
               </div>
            </div>
         </div>
      </ModalLayout>
   )
}

export default CreateVideo