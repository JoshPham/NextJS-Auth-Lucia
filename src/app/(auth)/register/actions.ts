"use server";

import { getUserByEmail, registerUserViaEmail } from "@/db-access/users";
import { generateIdFromEntropySize } from "lucia";
import { EmailInUseError } from "@/lib/errors";
import { setSession } from "@/auth/actions";

export const registerEmailUser = async (formData: FormData) => {
    const userId = generateIdFromEntropySize(10);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    await getUserByEmail(email).then(async (user) => {
        if (user) {
            throw new EmailInUseError();
        }
    });

    await registerUserViaEmail({
        id: userId,
        email: email,
        password: password,
        username: username,
    });

    await setSession(userId);

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
}