import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
   providers: [
      GoogleProvider({
         clientId: String(process.env.GOOGLE_CLIENT_ID),
         clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
      }),
      CredentialsProvider({
         name: 'Credentials',
         credentials: {
            email: { label: "E-Mail", type: "email", placeholder: "test@gmail.com" },
            password: { label: "Password", type: "password", placeholder: "Password" }
         },
         async authorize(credentials) {
            try {
               const authResponse = await fetch(`${process.env.NEXTAUTH_SERVER_URL}/api/auth/signin`, {
                  method: "POST",
                  headers: {
                     "Content-Type": "application/json"
                  },
                  body: JSON.stringify(credentials),
               })

               if (!authResponse.ok) {
                  const error = await authResponse.json()
                  throw new Error(error.message)
               }

               const data = await authResponse.json()

               return data
            } catch (err: any) {
               throw Error(err)
            }
         }
      })
   ],
   callbacks: {
      async jwt({ token, user, account }) {
         // ggl
         if (account?.provider === 'google') {
            const googleObject = {
               email: token.email,
               name: token.name,
               profileImg: token.picture
            }
            const res = await fetch(`${process.env.NEXTAUTH_SERVER_URL}/api/auth/google`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(googleObject),
            })
            const googleUser = await res.json()
            token.image = googleUser.profileImg
            token.accessToken = googleUser.token
            token.uid = googleUser._id
            return token
         }

         // updt
         if (token.uid) {
            const response = await fetch(`${process.env.NEXTAUTH_SERVER_URL}/api/users/find/${token.uid}`);
            const newUser = await response.json();
            token.name = newUser.name
            token.image = newUser.profileImg
            return token
         }

         // nrml
         if (user) {
            token.accessToken = user.token
            token.uid = user._id
            token.image = user.profileImg || user.image
         }

         return token
      },
      async session({ session, token }) {
         if (session.user && token.uid) {
            session.user.uid = token.uid
            session.user.accessToken = token.accessToken
            session.user.image = token.image
         }

         return session
      }
   }

}

export default NextAuth(authOptions)