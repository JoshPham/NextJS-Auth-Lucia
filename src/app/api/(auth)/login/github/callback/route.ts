import { github, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { getAccountById, getUserByEmail, getUserByGithubId } from "@/db-access/users";
import { registerGithubUser } from "@/auth/register";
import { GitHubUser } from "@/lib/schema/authSchema";
import { EmailInUseError } from "@/lib/errors";
import { EmailInUseErrorResponse, InternalServerErrorResponse, OAuth2RequestErrorResponse } from "@/lib/error-responses";
import { OAuth2RequestError } from "arctic";
import { setSession } from "@/auth/actions";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies().get("github_oauth_state")?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const githubUser: GitHubUser = await githubUserResponse.json();

		if (githubUser) {
            const user = await getUserByEmail(githubUser.email)
			if (user) {
                const account = await getAccountById(user.id);
                
				if (account && account.accountType !== "github") {
					throw new EmailInUseError();
				}
            }
		}

        const existingUser = await getUserByGithubId(githubUser.id);

        if (existingUser) {
			await setSession(existingUser.id);

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/"
				}
			});
		}

        const userId = await registerGithubUser({
            githubId: githubUser.id,
            username: githubUser.login,
            email: githubUser.email,
            avatar: githubUser.avatar_url,
        });

		await setSession(userId);
		
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});

	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			return OAuth2RequestErrorResponse;
		}
		if (e instanceof EmailInUseError) {
			return EmailInUseErrorResponse;
		}

		return InternalServerErrorResponse;
	}
}




