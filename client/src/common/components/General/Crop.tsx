"use client"

import { useToast } from '@/common/hooks';
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Point, Area } from "react-easy-crop/types";
import getCroppedImg from '../../utils/cropImage';
import ModalLayout from './ModalLayout';

type CroppedArea = {
   width: number
   height: number
   x: number
   y: number
}

const Crop = ({ photoURL, setOpenCrop, setImage }: { photoURL: string, setOpenCrop: React.Dispatch<React.SetStateAction<boolean>>, setImage: React.Dispatch<React.SetStateAction<string | null>> }) => {
   const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
   const [zoom, setZoom] = useState(1);
   const [rotation, setRotation] = useState(0)
   const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea>({ width: 0, height: 0, x: 0, y: 0 })
   const toast = useToast()

   const cropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
   }

   const zoomPercent = (value: number) => {
      return `${Math.round(value) * 100}%`
   }

   const cropImage = async () => {
      try {
         const url = await getCroppedImg(photoURL, croppedAreaPixels, rotation)
         setImage(url)
         setOpenCrop(false)
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

   const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parseVal = Number(e.currentTarget.value)
      setZoom(parseVal)
   }

   const handleRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parseVal = Number(e.currentTarget.value)
      setRotation(parseVal)
   }

   return (
      <ModalLayout setOpen={setOpenCrop}>
         <div className='h-4/6 w-auto bg-neutral-50 dark:bg-[#202020] min-w-[600px] flex flex-col p-1.5 md:h-screen md:items-center md:justify-center' onClick={e => e.stopPropagation()}>
            <div className='relative flex-1 w-full md:max-w-[100vh]'>
               <Cropper
                  image={photoURL}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropChange={setCrop}
                  onCropComplete={cropComplete}
                  cropShape='round'
               />
            </div>
            <div className='flex flex-col mx-3 my-2 flex-2 md:w-screen'>
               <div className='w-full mb-1 gap-2.5 flex flex-col md:px-2'>
                  <div className='flex flex-col gap-1'>
                     <label>Zoom: {zoomPercent(zoom)}</label>
                     <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" min={1} max={3} step={0.1} value={zoom} onChange={e => handleZoom(e)} />
                  </div>
                  <div className='flex flex-col gap-1'>
                     <label>Rotation: {`${rotation}°`}</label>
                     <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" min={0} max={360} value={rotation} onChange={e => handleRotation(e)} />
                  </div>
               </div>
               <div className='flex gap-2 flex-wrap justify-end mt-2'>
                  <button className='text-white bg-neutral-900 rounded-sm py-1 px-2 hover:bg-neutral-700' onClick={cropImage}>Crop</button>
                  <button className='text-white bg-neutral-900 rounded-sm py-1 px-2 hover:bg-neutral-700' onClick={() => setOpenCrop(false)}>Cancel</button>
               </div>
            </div>
         </div>
      </ModalLayout>
   )
}

export default Crop