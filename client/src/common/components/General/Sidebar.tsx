'use client'

import React, { RefObject, useEffect } from 'react'
import {
   Home,
   ExploreOutlined,
   SubscriptionsOutlined,
   LibraryAddOutlined,
   HistoryOutlined,
   AccountCircleOutlined,
   ArrowBack
} from '@mui/icons-material'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { sideCategories } from '../../constants/icons'

type Props = {
   open: boolean
   setOpen: React.Dispatch<React.SetStateAction<boolean>>
   sidebarRef: RefObject<HTMLDivElement>
}

const Sidebar = ({ open, setOpen, sidebarRef }: Props) => {
   const { data } = useSession()

   useEffect(() => {
      document.addEventListener("click", clickOutside, true)
   }, [])

   const clickOutside = (e: { target: any }) => {
      if (sidebarRef.current) {
         if (!sidebarRef.current.contains(e.target) && open) {
            setOpen(false)
         }
      }
   }

   return (
      <div ref={sidebarRef} className={`flex-1 min-h-screen bg-white text-black dark:bg-neutral-800 text-sm dark:text-white top-0 fixed z-50 h-screen w-1/5 lg:w-1/2 md:w-5/6 max-h-screen overflow-y-scroll transition-transform .3s ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
         <div className='py-4 px-6'>
            <button className='w-full'>
               <div onClick={() => setOpen(false)} className='flex items-center gap-5 cursor-pointer py-2 hover:bg-neutral-200 hover:dark:bg-neutral-700'>
                  <ArrowBack />
                  Back
               </div>
            </button>
            <Link href='/' onClick={() => setOpen(false)}>
               <div className='flex items-center gap-5 cursor-pointer py-2 hover:bg-neutral-200 hover:dark:bg-neutral-700'>
                  <Home />
                  Home
               </div>
            </Link>
            <Link href={"feed/trending"} onClick={() => setOpen(false)}>
               <div className='flex items-center gap-5 cursor-pointer py-2 hover:bg-neutral-200 hover:dark:bg-neutral-700'>
                  <ExploreOutlined />
                  Explore
               </div>
            </Link>
            {data?.user &&
               <Link href={"feed/subscriptions"} onClick={() => setOpen(false)}>
                  <div className='flex items-center gap-5 cursor-pointer py-2 hover:bg-neutral-200 hover:dark:bg-neutral-700'>
                     <SubscriptionsOutlined />
                     Subscriptions
                  </div>
               </Link>
            }
            <hr className='my-4 border-0.5 border-solid border-neutral-200 dark:border-neutral-700' />
            <div className='flex items-center gap-5 cursor-pointer py-2 hover:bg-neutral-200 hover:dark:bg-neutral-700'>
               <LibraryAddOutlined />
               Library
            </div>
            <div className='flex items-center gap-5 cursor-pointer py-2 hover:bg-neutral-200 hover:dark:bg-neutral-700'>
               <HistoryOutlined />
               History
            </div>
            <hr className='my-4 border-0.5 border-solid border-neutral-200 dark:border-neutral-700' />
            {!data?.user &&
               <div>
                  <div className=''>
                     Sign in to like videos, comment, and subscribe.
                     <Link href="/login" onClick={() => setOpen(false)}>
                        <button className='py-1 px-4 bg-transparent border border-solid border-sky-400 text-sky-400 rounded-sm font-medium mt-2.5 cursor-pointer flex items-center gap-1'>
                           <AccountCircleOutlined /> SIGN IN
                        </button>
                     </Link>
                  </div>
                  <hr className='my-4 border-0.5 border-solid border-neutral-200 dark:border-neutral-700' />
               </div>
            }
            <h2 className='text-sm font-medium text-zinc-400 mb-2'>
               BEST OF YT
            </h2>
            {sideCategories.map(e =>
               <Link href={e.href} onClick={() => setOpen(false)} key={e.name}>
                  <div className='flex items-center gap-5 cursor-pointer py-2 hover:bg-neutral-200 hover:dark:bg-neutral-700'>
                     {e.icon}
                     {e.name}
                  </div>
               </Link>
            )}
         </div>
      </div >
   )
}

export default Sidebar