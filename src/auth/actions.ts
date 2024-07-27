"use server";

import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/lib/auth";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutUser() {
    const { session } = await validateRequest();
  
    if (!session) {
        return {
            error: "Unauthorized"
        };
    }
  
    await lucia.invalidateSession(session.id);
  
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/login");
}

export const setSession = async (userId: string) => {
    console.log("Setting session for user", userId);
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}
