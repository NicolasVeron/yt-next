'use client';

import React, { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
   useEffect(() => {
      console.error(error);
   }, [error]);

   return (
      <div className='text-center font-bold mt-16'>
         <h2 className='text-2xl mb-2'>Something went wrong!</h2>
         <button onClick={() => window.location.reload()} className="hover:text-sky-400">Try again</button>
      </div>
   );
}