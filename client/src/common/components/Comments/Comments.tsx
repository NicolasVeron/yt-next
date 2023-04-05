'use client'

import React, { useEffect, useReducer, useState } from 'react'
import Comment from "./Comment"
import { CommentType } from '@/common/types'
import CommentForm from './CommentForm'
import { useToast } from '@/common/hooks'

const Comments = ({ videoId }: { videoId: string }) => {
   const [comments, setComments] = useState<CommentType[] | null>(null)
   const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
   const toast = useToast()

   useEffect(() => {
      const fetchComments = async () => {
         try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${videoId}`)
            const comments: CommentType[] = await response.json()
            setComments(comments.reverse())
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
      fetchComments()
   }, [reducerValue])

   return (
      <div>
         <CommentForm videoId={videoId} forceUpdate={forceUpdate} />
         {comments?.map(e =>
            <Comment comment={e} key={e._id} />)
         }
      </div>
   )
}

export default Comments