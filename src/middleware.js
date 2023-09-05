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






// import { NextResponse } from "next/server"

// const allowedOrigins = process.env.NODE_ENV === 'production'
//     ? ['https://www.yoursite.com', 'https://yoursite.com']
//     : ['http://localhost:3000']

// export function middleware(request) {

//     const origin = request.headers.get('origin')
//     console.log(origin)

//     if (origin && !allowedOrigins.includes(origin)) { //note postman and thunderclient don't send origin header so if you want to block them use || !origin. check vid at 4:39:00 for more info https://www.youtube.com/watch?v=843nec-IvW0&lc=UgzK1UUfZvpqY8_iReh4AaABAg&ab_channel=DaveGray
//         return new NextResponse(null, {
//             status: 400,
//             statusText: "Bad Request",
//             headers: {
//                 'Content-Type': 'text/plain'
//             }
//         })
//     }

//     console.log('Middleware!')

//     console.log(request.method)
//     console.log(request.url)



//     return NextResponse.next()
// }

// export const config = {
//     matcher: '/api/:path*',
// }