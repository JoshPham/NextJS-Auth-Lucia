import Image from "next/image";
import { getProfile } from "@/auth/user";
import { EmailInUseError } from "@/lib/errors";
import { signOutUser } from "@/auth/actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getProfile();

	if (!user) {
		return redirect("/login");
	}
	return (
    <div className="flex flex-col gap-5 items-start">
      <div>
        <h1>Profile</h1>
        {user.avatar && <Image src={user.avatar} alt="Avatar" width={100} height={100} />}
        <p>Username: {user.displayName}</p>
        <p>Email: {user.email}</p>
      </div>
      <form action={signOutUser}>
        <button type="submit">Sign out</button>
      </form>
    </div>
  );

}
