import React, { useState } from 'react'
import { AccountBoxOutlined, ModeNightOutlined, LogoutOutlined, Close } from '@mui/icons-material';
import Image from 'next/image'
import { defaultImg } from '@/common/constants'
import EditChannelModal from './EditChannelModal';
import Link from 'next/link'
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';
import { AuthorizedSession } from '@/common/types';

type Props = {
   setOpen: (open: boolean) => void
   session: AuthorizedSession
}

const ProfileInfo = ({ setOpen, session }: Props) => {
   const [edit, setEdit] = useState<boolean>(false)
   const { theme, setTheme } = useTheme()
   const { data } = session

   const handleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark")
   }

   const handleLogout = () => {
      signOut()
      setOpen(false)
   }

   return (
      <div className={`flex flex-col max-w-xs max-h-96 absolute right-11 top-1 bg-white shadow-xl dark:bg-neutral-700 min-w-max sm:right-0 sm:-top-3 sm:w-screen sm:h-screen sm:max-w-none sm:max-h-none`}>
         <button className='hidden items-center gap-5 cursor-pointer py-3 px-4 text-lg hover:bg-neutral-200/70 hover:dark:bg-neutral-600 sm:flex' onClick={() => setOpen(false)}>
            <Close fontSize='large' />
            Close
         </button>
         <div className='flex gap-4 p-4 border-b border-solid border-b-black/10 dark:border-b-white/10'>
            <Image src={data?.user?.image || defaultImg} alt={`${data?.user?.image}`} height={50} width={50} className='rounded-full bg-[#999]' />
            <div>
               <h1 className='text-xl font-normal'>{data?.user?.name}</h1>
               <h2 className='text-sm font-normal'>{data?.user?.email}</h2>
               <button onClick={() => setEdit(!edit)} className='mt-3 text-center text-violet-400 dark:text-violet-300 text-sm font-normal hover:underline'>
                  Edit account
               </button>
               {(edit && data?.user) &&
                  <EditChannelModal session={session} setOpen={setEdit} />
               }
            </div>
         </div>
         <div className='py-2'>
            <Link href={`/channel/${data?.user?.uid}`}>
               <div className='flex items-center gap-4 cursor-pointer py-2 px-4 my-0.5 hover:bg-neutral-200/70 hover:dark:bg-neutral-600' onClick={() => setOpen(false)}>
                  <AccountBoxOutlined />
                  Channel
               </div>
            </Link>
            <div className='flex items-center gap-4 cursor-pointer py-2 px-4 my-0.5 hover:bg-neutral-200/70 hover:dark:bg-neutral-600' onClick={() => handleTheme()}>
               <ModeNightOutlined />
               Aspect
            </div>
            <div className='flex items-center gap-4 cursor-pointer py-2 px-4 my-0.5 hover:bg-neutral-200/70 hover:dark:bg-neutral-600' onClick={() => handleLogout()}>
               <LogoutOutlined />
               Logout
            </div>
         </div>
      </div>
   )
}

export default ProfileInfo