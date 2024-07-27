import { getProfileById } from "@/db-access/users";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";




export async function getProfile() {
  const { user } = await validateRequest();
  console.log("user", user);
  if (!user) {
    return null;
  }

  return await getProfileById(user.id);
}
