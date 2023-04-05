'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { CommentType, UserType } from '@/common/types'
import { format } from 'timeago.js';
import Link from 'next/link';
import { useToast } from '@/common/hooks';
import { defaultImg } from '@/common/constants'

const Comment = ({ comment }: { comment: CommentType }) => {
    const [user, setUser] = useState<UserType | null>(null)
    const toast = useToast()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/find/${comment.userId}`)
                const user = await response.json()
                setUser(user)
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
        fetchUser()
    }, [])

    return (
        <div className='flex gap-2.5 my-8 lg:my-5'>
            <Link href={`/channel/${comment._id}`} className='rounded-full'>
                <Image src={user?.profileImg || defaultImg} alt="channel" height={50} width={50} className='rounded-full max-w-none bg-gray-400' />
            </Link>
            <div className='flex flex-col gap-1 text-black dark:text-white'>
                <span className='text-xs font-medium flex flex-wrap items-center'>
                    <Link href={`/channel/${comment._id}`}>
                        <h2 className='text-sm'>{user?.name}</h2>
                    </Link>
                    <span className='font-normal text-xs text-neutral-500 dark:text-zinc-400 ml-1'>{format(comment.createdAt)}</span>
                </span>
                <span className='text-sm break-all'>
                    {comment.description}
                </span>
            </div>
        </div>
    )
}

export default Comment