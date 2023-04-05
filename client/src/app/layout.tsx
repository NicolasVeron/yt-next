import './globals.css'
import { Roboto } from 'next/font/google'
import AuthContext from '../modules/auth/AuthContext';
import ModeProvider from '@/common/utils/ModeProvider';
import { Metadata } from 'next';
import { ToastProvider } from '@/common/hooks';
import { Layout } from '@/common/components';

export const metadata: Metadata = {
   title: {
      default: 'YT',
      template: '%s | YT'
   },
   icons: {
      icon: "/favicon.png"
   }
}

const roboto = Roboto({
   subsets: ['latin'],
   weight: ['100', '300', '400', '500', '700', '900'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {

   return (
      <html lang="en">
         <head />
         <body className={roboto.className}>
            <AuthContext>
               <ModeProvider>
                  <ToastProvider>
                     <Layout>
                        {children}
                     </Layout>
                  </ToastProvider>
               </ModeProvider>
            </AuthContext >
         </body >
      </html >
   )
}
