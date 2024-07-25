import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getProfile } from "@/auth/user";

export default async function Page() {
  const user = await getProfile();
  console.log(user);
	if (!user) {
		return redirect("/login");
	}
	return (
    <>
      <h1>Profile</h1>
      {user.avatar && <Image src={user.avatar} alt="Avatar" width={100} height={100} />}
      <p>Username: {user.displayName}</p>
      <p>Email: {user.email}</p>
    </>
  );

}
