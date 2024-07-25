import { db } from "@/lib/db";
import { accounts, profiles, users } from "@/lib/schema/authSchema";
import { eq } from "drizzle-orm";
import { startTransition } from "react";

// Accessors
export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
      where: eq(users.id, id),
  });
  
  return user;
}

export const getUserByGithubId = async (githubId: string) => {
  const user = await db.query.accounts.findFirst({
    where: eq(accounts.githubId, githubId),
  });
  if (!user) {
    return null;
  }

  return await db.query.users.findFirst({
    where: eq(users.id, user.userId),
  });
}

export async function getAccountById(id: string) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, id),
  });
  
  return account;
}

export const getProfileById = async (id: string) => {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, id),
  });
  
  return profile;
}

export async function getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
  });
  
  return user;
}

// Mutators
export const registerUserViaGithub = async ({
  id,
  githubId,
  username,
  email,
  avatar,
} : {
  id: string, 
  githubId: string, 
  username: string,
  email: string,
  avatar: string,
}) => {
  startTransition(async () => {
    await db.insert(users).values({
        id: id,
        email: email,
    });
    await db.insert(accounts).values({
        userId: id,
        accountType: "github",
        githubId: githubId,
    });
    await db.insert(profiles).values({
        userId: id,
        displayName: username,
        email: email,
        avatar: avatar,
    });
  });
  
}