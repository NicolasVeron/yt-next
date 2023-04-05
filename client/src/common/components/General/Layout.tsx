'use client'

import React, { useRef, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
   const [open, setOpen] = useState<boolean>(false)
   const sidebarRef = useRef<HTMLDivElement>(null)

   return (
      <div className='flex flex-col'>
         <Navbar open={open} setOpen={setOpen}/>
         <main className=' bg-neutral-50 dark:bg-neutral-900 flex min-h-[calc(100vh-56px)]'>
            <Sidebar open={open} setOpen={setOpen} sidebarRef={sidebarRef}/>
            <main className='flex-[7]'>
               {children}
            </main>
         </main>
      </div>
   )
}

export default Layout