import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
// Ensure database connection is established

const SECRET_KEY = process.env.AUTH_SECRET || 'default_secret_key';

export async function middleware(req: Request){
    const token =req.headers.get("Authorization")?.split(" ")[1];
    // console.log("Token:", token);
    if(!token){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try{
        const { payload: user } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        
        const modifiedRequest = new Request(req, {
            headers: new Headers({
                ...Object.fromEntries(req.headers),
                user: JSON.stringify(user),
            }),
        });
        return NextResponse.next({ request: modifiedRequest });
    } catch (error){
        console.error("Token verification failed:", error);
        return NextResponse.json({error: "Invalid token"}, {status: 401});
    }
}
export const config = {
    matcher: ["/api/todos/:path*"],
}