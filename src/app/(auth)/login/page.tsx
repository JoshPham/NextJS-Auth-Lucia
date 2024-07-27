import { loginEmailUser } from "./actions"
import { redirect } from "next/navigation"

export default async function Page() {
	return (
		<div className="flex flex-col">
			<h1 className="font-bold text-xl">Sign in</h1>
			<a href="/api/login/github">Sign in with GitHub</a>
			<a href="/api/login/google">Sign in with Google</a>
			<form className="flex flex-col w-[20%] gap-2 items-start" action={async formData => {
				"use server"
				await loginEmailUser(formData);

				redirect("/");
			}}>
				<h1 className="font-semibold text-xl">Sign in with Email</h1>
				<div className="flex flex-col gap-2 text-black">
					<input name="email" type="email" placeholder="Email" />
					<input name="password" type="password" placeholder="Password" />
				</div>
				<button type="submit">Sign in</button>
			</form>

			<h1>Don't have an account? <a href="/register">Register</a></h1>
		</div>
	);
}
