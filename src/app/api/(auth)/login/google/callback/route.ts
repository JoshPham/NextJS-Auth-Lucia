import { google, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { getAccountById, getUserByEmail, getUserByGoogleId } from "@/db-access/users";
import { registerGoogleUser } from "@/auth/register";
import { GoogleUser } from "@/lib/schema/authSchema";
import { EmailInUseError } from "@/lib/errors";
import { redirect } from "next/dist/server/api-utils";
import { EmailInUseErrorResponse, InternalServerErrorResponse, OAuth2RequestErrorResponse } from "@/lib/error-responses";
import { setSession } from "@/auth/actions";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const storedState = cookies().get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;
    
    if (error) {
        return InternalServerErrorResponse;
    }

	if (
        !code ||
        !state ||
        !storedState ||
        state !== storedState ||
        !codeVerifier
    ) {
        return new Response(null, {
          status: 400,
        });
    }


	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);

		const response = await fetch(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            },
        );

        const googleUser: GoogleUser = await response.json();

        if (googleUser) {
            const user = await getUserByEmail(googleUser.email)
            if (user) {
                const account = await getAccountById(user.id);
                
                if (account?.accountType !== "google") {
                    throw new EmailInUseError();
                }
            }
        }

        const existingUser = await getUserByGoogleId(googleUser.sub);
        
        if (existingUser) {
			await setSession(existingUser.id);

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/"
				}
			});
        }

        const userId = await registerGoogleUser({
            googleId: googleUser.sub,
            username: googleUser.name,
            email: googleUser.email,
            avatar: googleUser.picture,
        });

		await setSession(userId);

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});

	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return OAuth2RequestErrorResponse;
		}
		if (e instanceof EmailInUseError) {
			return EmailInUseErrorResponse;
		}

		return InternalServerErrorResponse;
	}
}




