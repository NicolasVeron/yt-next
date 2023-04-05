import React from 'react'
import { Category } from '@/common/components'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const page = async ({ params }: { params: { category: string } }) => {
   const { category } = params
   const session = await getServerSession(authOptions)

   if (!session && category === "subscriptions") {
      return (
         redirect("/")
      )
   }

   return (
      <main className='flex justify-between flex-wrap py-6 px-6 h-full md:py-4 md:px-4 sm:py-2 sm:px-2'>
         <Category category={category} />
      </main>
   )
}

export default page