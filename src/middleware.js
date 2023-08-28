// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    // `withAuth` augments `Request` with the user's token.
    function middleware(request) {
        // console.log(request.nextUrl.pathname)
        // console.log(request.nextauth.token)

        if (request.nextUrl.pathname.startsWith("/extra")
            && request.nextauth.token?.role !== "admin") {
            return NextResponse.rewrite(
                new URL("/denied", request.url)
            )
        }

        if (request.nextUrl.pathname.startsWith("/client")
        //route only available to admin or manager
            && request.nextauth.token?.role !== "admin"
            && request.nextauth.token?.role !== "manager") {
            return NextResponse.rewrite(
                //send to denied route and display the requested url in the url bar
                new URL("/denied", request.url)
            )
        }
    },
    {
        // middleware only runs if token present
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

// Applies next-auth only to matching routes
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/extra", "/client", "/dashboard"] }