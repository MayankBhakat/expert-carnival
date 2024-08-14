import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


//Type out all the routes(folders) that you want to be protected
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/forum(.*)',
  ]);

  //If user is not protected u r directed to sign in page
  export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
  });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};