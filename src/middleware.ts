// import { withAuth } from "next-auth/middleware"

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     console.log(req.nextauth.token)
    
//   },
//   {
//     callbacks: {
//       authorized: async ({ token }) => {
//         console.log("middleware", token);
//         // return token?.role !== "admin";
//         return true;
//       }
//     },
//   }
// )
export { default } from "next-auth/middleware"
export const config = { matcher: ["/main"] }