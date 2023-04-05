'use client'

import React, { useState } from 'react'
import { VideoCallOutlined } from '@mui/icons-material'
import VideoForm from '../Video/CreateVideo'

const UploadButton = () => {
   const [open, setOpen] = useState<boolean>(false)

   return (
      <div>
         <button className='rounded-full p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-600' onClick={() => setOpen(true)}>
            <VideoCallOutlined />
         </button>
         {open &&
            <VideoForm open={open} setOpen={setOpen} />
         }
      </div>
   )
}

export default UploadButton