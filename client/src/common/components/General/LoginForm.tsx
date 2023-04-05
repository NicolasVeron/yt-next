'use client'

import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from "formik";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoginInitialValue, TouchedLogin } from '@/common/types';
import { loginFields } from '../../constants';
import { loginFormValidation } from '../../constants/validation';
import Link from 'next/link';
import { useToast } from '../../hooks';

const LoginForm = () => {
   const router = useRouter()
   const toast = useToast()
   const [login, setLogin] = useState<boolean>(false)

   const loginInitialValue: LoginInitialValue = {
      email: "",
      password: "",
   }

   const loginSubmit = async (data: LoginInitialValue) => {
      setLogin(true)
      try {
         await signIn('credentials', {
            redirect: false,
            callbackUrl: "/",
            email: data.email,
            password: data.password
         }).
            then((error) => {
               if (error?.error) {
                  throw new Error(error.error)
               }
            })
      } catch (err) {
         let message
         if (err instanceof Error) message = err.message
         else message = String(err)
         toast({
            severity: "error",
            message
         })
      }
      setLogin(false)
   }

   const signInWithGoogle = async () => {
      try {
         setLogin(true)
         await signIn('google', {
            callbackUrl: "/"
         })
         setLogin(false)
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
      <div className='flex flex-col items-center justify-center h-[calc(100vh-56px)] text-black dark:text-white sm:h-full sm:w-full'>
         <div className='flex items-center flex-col bg-white dark:bg-[#202020] py-5 px-12 border border-solid border-neutral-200 dark:border-neutral-700 gap-2.5'>
            <h1 className='text-2xl'>Sign In</h1>
            <h2 className='text-xl font-light sm:text-center'>To continue to using YT</h2>
            <Formik
               initialValues={loginInitialValue}
               validationSchema={loginFormValidation}
               onSubmit={(value) => loginSubmit(value)}>
               {({ errors, touched }: { errors: Partial<LoginInitialValue>, touched: TouchedLogin }) => (
                  <Form className='flex flex-col gap-2.5'>
                     {
                        loginFields.map(e =>
                           <div className='w-full flex flex-col' key={e.name}>
                              <Field type={e.type} name={e.name} placeholder={e.placeholder} className='border border-solid border-neutral-200 dark:border-neutral-700 rounded-sm p-2.5 bg-transparent focus:outline-none' />
                              {(errors[e.name] && touched[e.name]) && <span className='px-0.5 text-sm'>{`${errors[e.name]}`}</span>}
                           </div>
                        )
                     }
                     <button type='submit' disabled={login} className='rounded-sm border-none py-2.5 px-5 font-medium cursor-pointer bg-black dark:bg-blue-400 text-white dark:text-black enabled:hover:bg-neutral-700 enabled:dark:hover:bg-blue-300 disabled:bg-gray-400 disabled:text-gray-800'>Sign in</button>
                  </Form>
               )}

            </Formik>
            <h1 className='text-2xl'>or</h1>
            <button onClick={() => signInWithGoogle()} disabled={login} className='rounded-sm border-none py-2.5 px-5 w-full font-medium cursor-pointer bg-black dark:bg-blue-400 text-white dark:text-black enabled:hover:bg-neutral-700 enabled:dark:hover:bg-blue-300 disabled:bg-gray-400 disabled:text-gray-800'>Signin with google</button>
         </div>
         <div className='flex text-sm text-neutral-800 dark:text-zinc-400 mt-2.5'>
            <Link href={"/register"} className='hover:text-blue-400'>
               <span>{"don't have an account?"}</span>
            </Link>
         </div>
      </div>
   )
}

export default LoginForm