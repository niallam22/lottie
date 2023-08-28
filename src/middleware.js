//apply auth to entire page
export { default } from "next-auth/middleware"

//apply auth only to matching routes
// ref nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/dashboard",]}