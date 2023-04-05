'use client'
import { AccountCircleOutlined, MenuOutlined } from '@mui/icons-material'
import React from 'react'
import Image from "next/image"
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ProfileModal from '../Channel/ProfileModal'
import UploadButton from '../Buttons/UploadButton'
import Search from './Search'

type Props = {
   open: boolean
   setOpen(open: boolean): void
}

const Navbar = ({open, setOpen} : Props) => {
   const session = useSession()

   const handleClick = () => {
      setOpen(!open)
   }

   return (
      <div className='z-20 top-0 bg-white text-black dark:bg-neutral-800 text-sm dark:text-white h-14'>
         <div className='flex items-center h-full px-5 content-end relative text-black dark:text-white justify-between sm:px-1'>
            <div className='flex items-center gap-2.5 font-bold'>
               <button className='rounded-full p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-600' onClick={() => handleClick()}>
                  <MenuOutlined fontSize='large' />
               </button>
               <Link href='/' className='flex items-center gap-1.5'>
                  <Image src={"/img/logo.png"} alt='logo' height={25} width={1000} className='w-auto' />
                  <p className='sm:hidden'>YT</p>
               </Link>
            </div>
            <Search />
            {session.data?.user ?
               <div className='flex items-center gap-5 font-medium text-black dark:text-white md:gap-2.5'>
                  <UploadButton />
                  <ProfileModal />
               </div> :
               <Link href='/login' className='pr-1.5'>
                  <button className='py-1 px-4 bg-transparent border border-solid border-sky-400 text-sky-400 rounded-sm font-medium cursor-pointer flex items-center gap-1 md:px-2'>
                     <AccountCircleOutlined /> 
                     <p className='md:hidden'>SIGN IN</p>
                  </button>
               </Link>
            }
         </div>
      </div>
   )
}

export default Navbar