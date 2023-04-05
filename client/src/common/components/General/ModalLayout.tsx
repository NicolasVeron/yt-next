import React from 'react'

const ModalLayout = ({ children, setOpen }: { children: React.ReactNode, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

   return (
      <div className='fixed top-0 left-0 bg-black/40 w-screen h-screen z-50 flex items-center justify-center' onClick={() => setOpen(false)}>
         {children}
      </div>
   )
}

export default ModalLayout