'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { defaultImg } from '@/common/constants'
import ProfileInfo from './ProfileInfo'

const ProfileModal = () => {
   const [open, setOpen] = useState<boolean>(false)
   const session = useSession()
   const { data } = session

   return (
      <div className='relative h-8 w-8'>
         <button title={data?.user?.name || 'Profile'} onClick={() => setOpen(!open)}>
            <Image src={data?.user?.image || defaultImg} alt="icon" height={32} width={32} className='rounded-full bg-[#999]' />
         </button>
         {(open && data?.user) &&
            <ProfileInfo setOpen={setOpen} session={session}/>
         }
      </div>
   )
}

export default ProfileModal