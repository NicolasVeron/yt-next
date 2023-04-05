import React, { use } from 'react'
import { RegisterForm } from '@/common/components'
import type { Metadata } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Register',
}

const page = () => {
   const session = use(getServerSession(authOptions))
   
   if (session) {
      return (
         redirect("/")
      )
   }
   
   return (
      <div className='py-6 px-6 h-full md:py-4 md:px-4 sm:py-2 sm:px-2'>
         <RegisterForm />
      </div>
   )
}

export default page