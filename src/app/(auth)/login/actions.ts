"use server";

import { getAccountByEmail, getUserByEmail, hashPassword } from "@/db-access/users";
import { setSession } from "@/auth/actions";
import { InvalidCredentialsErrorResponse } from "@/lib/error-responses";
import { InvalidCredentialsError } from "@/lib/errors";

export const loginEmailUser = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
        throw new InvalidCredentialsError();
    }

    const account = await getAccountByEmail(email);
    if (!account) {
        throw new InvalidCredentialsError();
    }

    if (account.accountType !== "email") {
        throw new InvalidCredentialsError();
    }

    const hashedPassword = await hashPassword(password, account.salt!);
    if (hashedPassword !== account.password) {
        throw new InvalidCredentialsError();
    }

    await setSession(user.id);

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
}