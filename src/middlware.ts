import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
import { isBypassRoutes, isProtectedRoute, isPUblicRoute } from "./lib/permission";

 

const BypassMatcher = createRouteMatcher(isBypassRoutes)
const PublicRoute = createRouteMatcher(isPUblicRoute)
const ProtectedRoute = createRouteMatcher(isProtectedRoute)

export default convexAuthNextjsMiddleware(async (req,{convexAuth})=>{
        if(BypassMatcher(req)){
            return 
        }
        const authed = await convexAuth.isAuthenticated() 
        if(PublicRoute(req) && !authed){ 
            return nextjsMiddlewareRedirect(req,"/dashboard")
        }
        return
    },{
        cookieConfig : {maxAge : 60 * 60* 24 *30}
    }
);
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
