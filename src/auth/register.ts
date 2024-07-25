import { getUserByEmail } from "@/db-access/users";
import { db } from "@/lib/db";
import { users } from "@/lib/schema/authSchema";
import { generateIdFromEntropySize } from "lucia";
import { registerUserViaGithub } from "@/db-access/users";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";


export const registerUserCredentials = async ( email: string, password: string ) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    // const user = await createUser(email);
}

export const registerGithubUser = async ({
    githubId,
    username,
    email,
    avatar,
} : {
    githubId: string,
    username: string,
    email: string,
    avatar: string,
}) => {
    
    const userId = generateIdFromEntropySize(10);

    await registerUserViaGithub({
        id: userId,
        githubId: githubId,
        username: username,
        email: email,
        avatar: avatar,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}