'use client'

import { SearchOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import { useRouter } from "next/navigation"

const Search = () => {
   const [search, setSearch] = useState("")
   const router = useRouter()

   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      router.push(`/search/${search}`)
   }

   return (
      <form className='w-2/5 flex items-stretch justify-between border border-solid border-neutral-200 dark:border-zinc-700' onSubmit={(e) => handleSearch(e)}>
         <input type="text" placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} className='border-none bg-transparent w-full p-2 focus:outline-none' />
         <button type='submit' className='px-4 bg-neutral-200 dark:bg-zinc-600 sm:px-2'>
            <SearchOutlined className='text-neutral-500 dark:text-white'/>
         </button>
      </form>
   )
}

export default Search