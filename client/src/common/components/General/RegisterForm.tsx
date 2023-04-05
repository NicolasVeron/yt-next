'use client'

import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { SignupInitialValue, TouchedSignup } from '@/common/types'
import { signIn } from 'next-auth/react';
import { registerFields } from '../../constants';
import { registerFormValidation } from '../../constants/validation';
import { useToast } from '../../hooks';
import Link from 'next/link';

const RegisterForm = () => {
   const toast = useToast()
   const [register, setRegister] = useState<boolean>(false)

   const signupInitialValue: SignupInitialValue = {
      name: "",
      email: "",
      password: ""
   }

   const registerSubmit = async (data: SignupInitialValue) => {
      setRegister(true)

      try {
         await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signup`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify(data),
            })

         await signIn('credentials', {
            callbackUrl: "/",
            email: data.email,
            password: data.password
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
      setRegister(false)
   }

   return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-56px)] text-black dark:text-white sm:h-full'>
         <div className='flex flex-col items-start bg-white dark:bg-[#202020] py-5 px-7 border border-solid border-neutral-200 dark:border-neutral-700 gap-5 md:flex-col md:items-center'>
            <h1 className='text-2xl self-center'>Sign up</h1>
            <h2></h2>
            <Formik
               initialValues={signupInitialValue}
               validationSchema={registerFormValidation}
               onSubmit={(value) => registerSubmit(value)}>
               {({ errors, touched }: { errors: Partial<SignupInitialValue>, touched: TouchedSignup }) => (
                  <Form className="flex flex-col gap-0.5">
                     {registerFields.map(e =>
                        <div className="w-full my-2 flex flex-col" key={e.name}>
                           <Field type={e.type} name={e.name} placeholder={e.placeholder} key={e.name} className='border border-solid border-neutral-200 dark:border-neutral-700 rounded-sm p-2.5 bg-transparent focus:outline-none' />
                           {(errors[e.name] && touched[e.name]) && <span className='p-0.5'>{errors[e.name]}</span>}
                        </div>
                     )}
                     <button type='submit' className='rounded-sm border-none py-2.5 px-5 font-medium cursor-pointer bg-black dark:bg-blue-400 text-white dark:text-black float-right enabled:hover:bg-neutral-700 enabled:dark:hover:bg-blue-300 disabled:bg-gray-400 disabled:text-gray-800 disabled:pointer-events-none' disabled={register}>Sign up</button>
                  </Form>
               )}
            </Formik>
         </div>
         <div className='flex text-sm text-neutral-800 dark:text-zinc-400 mt-2.5'>
            <Link href={"/login"} className='hover:text-blue-400'>
               <span>{"already have an account?"}</span>
            </Link>
         </div>
      </div>
   )
}

export default RegisterForm