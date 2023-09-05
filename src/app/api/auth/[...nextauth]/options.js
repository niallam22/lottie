// import { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const options = {
    providers: [
        GitHubProvider({
          profile(profile) {
            //console.log(profile)
            return {
                ...profile,
                role: profile.role ?? "user",
                id: profile.id.toString(),
                image: profile.avatar_url,
            }
        },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            // credentials: {
            //     username: {
            //         label: "Username:",
            //         type: "text",
            //         placeholder: 'enter username'
            //     },
            //     password: {
            //         label: "Password:",
            //         type: "text",
            //         placeholder: 'enter password'
            //     }
            // },
            async authorize(credentials) {
                const { email, password } = credentials;
        
                try {
                  await connectMongoDB();
                  const user = await User.findOne({ email });
        
                  if (!user) {
                    return null;
                  }
        
                  const passwordsMatch = await bcrypt.compare(password, user.password);
        
                  if (!passwordsMatch) {
                    return null;
                  }
        
                  return user;
                } catch (error) {
                  console.log("Error: ", error);
                }
              },
        }),
    ],
  //persist the user's role
  //jwt persists user on the server
  callbacks: {
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token, user }) {
        if (user) {
          token.role = user.role

        }
        return token
    },
    // Session required to persist the role in client components
    async session({ session, token }) {
        if (session?.user) {
          session.user.role = token.role
          session.user.id = token.sub
        }
        return session
    }
  },
    // session: {
    //     strategy: "jwt",
    //   },
      secret: process.env.NEXTAUTH_SECRET,
      pages: {
        signIn: "/",
      },
    // customise sigin pages
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    //   }
}