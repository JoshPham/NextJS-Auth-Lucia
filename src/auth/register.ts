import { getUserByEmail, registerUserViaEmail, registerUserViaGoogle } from "@/db-access/users";
import { generateIdFromEntropySize } from "lucia";
import { registerUserViaGithub } from "@/db-access/users";
import { EmailInUseError } from "@/lib/errors";


export const checkIfUserExists = async (email: string) => {
    const user = await getUserByEmail(email);
    if (user) {
        throw new Error("User already exists");
    }

    return false;
}

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
    await getUserByEmail(email).then(async (user) => {
        if (user) {
            throw new EmailInUseError();
        }
        await registerUserViaGithub({
            id: userId,
            githubId: githubId,
            username: username,
            email: email,
            avatar: avatar,
        });
    })

    return userId;
}

export const registerGoogleUser = async ({
    googleId,
    username,
    email,
    avatar,
} : {
    googleId: string,
    username: string,
    email: string,
    avatar: string,
}) => {
    const userId = generateIdFromEntropySize(10);
    await getUserByEmail(email).then(async (user) => {
        if (user) {
            throw new EmailInUseError();
        }
        
        await registerUserViaGoogle({
            id: userId,
            googleId: googleId,
            username: username,
            email: email,
            avatar: avatar,
        });
    });

    return userId;
}