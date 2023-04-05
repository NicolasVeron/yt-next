'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from "next/navigation"
import { useSession } from 'next-auth/react'
import { defaultImg } from '@/common/constants'
import { useToast } from '@/common/hooks'

const CommentForm = ({ videoId, forceUpdate }: { videoId: string, forceUpdate: React.DispatchWithoutAction }) => {
   const router = useRouter()
   const session = useSession()
   const toast = useToast()
   const [disabled, setDisabled] = useState<boolean>(false)
   const [description, setDescription] = useState<string>("")

   const postComment = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (session.status === "unauthenticated") {
         toast({
            severity: "info",
            message: "You need to be logged in"
         })
         return
      }

      const postObject = {
         videoId,
         description
      }

      try {
         setDisabled(true)
         await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${session.data?.user?.accessToken}`
            },
            body: JSON.stringify(postObject)
         })
         setDisabled(false)
         setDescription("")
         forceUpdate()
         // router.refresh() -- ( ._.)b
         // window.location.reload() -- ( ._.)p
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
      <>
         {
            session.status !== "loading" &&
            <form onSubmit={(e) => postComment(e)} className="flex flex-col items-end">
               <div className='flex items-center gap-3 w-full'>
                  <Image src={session.data?.user?.image || defaultImg} alt="channel" height={50} width={50} className='rounded-full max-w-none' />
                  <input type="text" name='description' placeholder='Write a comment...' autoComplete="off" value={description} onChange={(e) => setDescription(e.target.value)} className='border-b focus:border-b-2 border-neutral-200 dark:border-neutral-700 bg-transparent outline-none p-1 w-full text-black dark:text-white focus:border-black dark:focus:border-white' />
               </div>
               <button type="submit" className='py-2 px-4 bg-blue-400 text-black enabled:dark:hover:bg-neutral-700 enabled:hover:bg-blue-300 disabled:bg-gray-400 disabled:text-gray-800' disabled={(description.length < 1) || disabled}>COMMENT</button>
            </form>
         }
      </>
   )
}

export default CommentForm