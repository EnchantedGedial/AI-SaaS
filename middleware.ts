// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

// import { authMiddleware } from "@clerk/nextjs";
import { authMiddleware } from "@clerk/nextjs/server";
 
export default authMiddleware({
//   // Routes that can be accessed while signed out
//   publicRoutes: ['/anyone-can-visit-this-route'],
//   // Routes that can always be accessed, and have
//   // no authentication information
//   ignoredRoutes: ['/no-auth-in-this-route'],
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware

  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};