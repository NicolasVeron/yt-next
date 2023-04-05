"use client"

import React, { useState } from 'react'
import Toast, { ToastOptions } from './Toast'

const ToastContext = React.createContext<
   (options: ToastOptions) => Promise<void>
>(Promise.reject)

export const useToast = () => React.useContext(ToastContext)

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
   const [toastState, setToastState] = useState<ToastOptions | null>(null)

   const awaitingPromiseRef = React.useRef<{
      resolve: () => void
      reject: () => void
   }>()

   const handleClose = () => {
      if (toastState?.catchOnCancel && awaitingPromiseRef.current) {
         awaitingPromiseRef.current.reject()
      }

      setToastState(null)
   }

   const setToast = (options: ToastOptions) => {
      setToastState(options)
      return Promise.resolve()
   }

   return (
      <>
         <ToastContext.Provider value={setToast}>
            {children}
         </ToastContext.Provider>

            <Toast
               open={Boolean(toastState)}
               onClose={handleClose}
               {...toastState as ToastOptions}
            />
         </>
         )
}

         export default ToastProvider