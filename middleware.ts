// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

// import { authMiddleware } from "@clerk/nextjs";
import { authMiddleware } from "@clerk/nextjs/server";
 
export default authMiddleware({

  publicRoutes: ['/api/webhooks,clerk'],

//   ignoredRoutes: ['/no-auth-in-this-route'],
});
 
export const config = {
 

  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};