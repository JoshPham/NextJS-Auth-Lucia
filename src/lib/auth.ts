import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/lib/db";
import { Session, sessions, User, UserInsert, users } from "@/lib/schema/authSchema";
import { Lucia } from "lucia";
import { GitHub, Google } from "arctic";
import { cookies } from "next/headers";
import { cache } from "react";


const adapter  = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
    getUserAttributes: (attributes) => {
		return {
			id: attributes.id
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			id: string
		};
	}
}

export const validateRequest = cache(
	async (): Promise<{ user: UserInsert; session: Session } | { user: null; session: null }> => {
		console.log("cookies", cookies());
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		console.log("sessionId", sessionId);
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}
		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);


export const github = new GitHub(
	process.env.GITHUB_CLIENT_ID!,
	process.env.GITHUB_CLIENT_SECRET!
);

const appHostName = process.env.NODE_ENV === "production" ? "https://developop.com" : "http://localhost:3000";

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${appHostName}/api/login/google/callback`
)