import { registerEmailUser } from "./actions"; 
import { redirect } from "next/navigation";

export default async function Page() {
    return (
		<div className="flex flex-col">
			<h1 className="text-xl font-bold">Register</h1>
			<a href="/api/login/github">Sign in with GitHub</a>
			<a href="/api/login/google">Sign in with Google</a>
			<form className="flex flex-col w-[20%] gap-2 items-start" action={async formData => {
				"use server"
				await registerEmailUser(formData);

				redirect("/");

			}}>
				<h1 className="font-semibold text-xl">Sign up with Email</h1>
				<div className="flex flex-col gap-2 text-black">
					<input name="username" type="text" placeholder="Username" />
					<input name="email" type="email" placeholder="Email" />
					<input name="password" type="password" placeholder="Password" />
				</div>
				<button type="submit">Sign up</button>

				<h1>Already have an account? <a href="/login">Sign in</a></h1>
			</form>
		</div>
    );
}