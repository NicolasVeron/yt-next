'use client'

import React from "react"
import { SessionProvider } from "next-auth/react";

export interface AuthContextProps {
   children: React.ReactNode;
}

export const AuthContext = ({ children }: AuthContextProps) => {
   return (
      <SessionProvider>
         {children}
      </SessionProvider>
   )
}

export default AuthContext