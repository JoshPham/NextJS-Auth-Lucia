import { getProfileById } from "@/db-access/users";
import { validateRequest } from "@/lib/auth";


export async function getProfile() {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  return await getProfileById(user.id);
}