'use client'

import React, { useState } from 'react'
import { EditOutlined } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import SubscribeButton from './SubscribeButton';
import EditChannelModal from '../Channel/EditChannelModal';

const ChannelButtons = ({ channelId }: { channelId: string }) => {
   const session = useSession()
   const [open, setOpen] = useState(false)

   return (
      <div>
         <div className='text-neutral-700 dark:text-white flex gap-2.5 items-center'>
            {channelId === session.data?.user?.uid &&
               <div>
                  <button className='rounded-full transition ease-in-out hover:bg-neutral-300 dark:hover:bg-neutral-600 p-2' onClick={() => setOpen(!open)}>
                     <EditOutlined color='inherit' className='text-3xl' />
                  </button>
               </div>
            }
            {(session.data?.user.uid !== channelId) &&
               <SubscribeButton channelId={channelId} />
            }
            {open && session.data?.user &&
               <EditChannelModal session={session} setOpen={setOpen} />
            }
         </div>
      </div>
   )
}

export default ChannelButtons