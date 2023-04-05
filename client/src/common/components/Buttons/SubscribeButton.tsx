'use client'

import { UserType, VideoType } from '@/common/types';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useToast } from '@/common/hooks';

const fetchUserData = async (session: any) => {
   const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${session.user.uid}`)
   const json = await res.json()
   return json
}

const SubscribeButton = ({ video, channelId }: { video?: VideoType, channelId?: string }) => {
   const router = useRouter()
   const { data } = useSession()
   const [user, setUser] = useState<UserType | null>(null)
   const session = useSession()
   const toast = useToast()

   useEffect(() => {
      if (session.status === "authenticated") {
         const fetchUserData = async (session: any) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${session.user.uid}`)
            const json = await res.json()
            setUser(json)
         }
         fetchUserData(data)
      }
   }, [session.status])

   const handleSubscription = async (type: string) => {
      if (!user) {
         toast({
            severity: "info",
            message: "You need to be logged in"
         })
         return
      } else if (channelId === session.data?.user.uid) {
         return null
      }
      try {
         await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${type}/${video ? video.userId : channelId}`, {
            method: 'PATCH',
            headers: {
               Authorization: `Bearer ${data?.user?.accessToken}`
            }
         })
         const res = await fetchUserData(data)
         setUser(res)
         router.refresh();
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

   return (
      <div>
         {
            (user !== null && user.subscribedUsers.includes(video ? video.userId : channelId as string)) ?
               <button className='bg-neutral-400 font-medium text-white border-none rounded h-max py-2.5 px-5 hover:bg-neutral-700' onClick={() => handleSubscription('unsub')}>Subscribed</button> :
               <button className='bg-red-600 font-medium text-white border-none rounded h-max py-2.5 px-5 hover:bg-red-800' onClick={() => handleSubscription('sub')}>SUBSCRIBE</button>
         }
      </div>
   )
}

export default SubscribeButton