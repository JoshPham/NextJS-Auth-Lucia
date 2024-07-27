import { db } from "@/lib/db";
import { EmailInUseErrorResponse } from "@/lib/error-responses";
import { EmailInUseError } from "@/lib/errors";
import { accounts, profiles, users } from "@/lib/schema/authSchema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Helpers
export const hashPassword = (password: string, salt: string) => {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      password, 
      salt, 
      10000, 
      64, 
      `sha512`,
      (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(derivedKey.toString(`hex`));
      }
    )
  });
}

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

export const getUserByGoogleId = async (googleId: string) => {
  const user = await db.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId),
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
      where: eq(users.email, email.toLowerCase()),
  });

  return user;
}

export async function getAccountByEmail(email: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, user.id),
  });

  return account;
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
  try {
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      throw new EmailInUseError();
    }
    
    db.transaction(async (transaction) => {
      await transaction.insert(users).values({
          email: email.toLowerCase(),
          id: id,
      });
      await transaction.insert(accounts).values({
          userId: id,
          accountType: "github",
          githubId: githubId,
      });
      await transaction.insert(profiles).values({
          userId: id,
          displayName: username,
          email: email.toLowerCase(),
          avatar: avatar,
      });
    })
    
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return EmailInUseErrorResponse;
    }

    console.error(error);
  }
}

export const registerUserViaGoogle = async ({
  id,
  googleId,
  username,
  email,
  avatar,
} : {
  id: string, 
  googleId: string,
  username: string,
  email: string,
  avatar: string,
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      throw new EmailInUseError();
    }
    
    db.transaction(async (transaction) => {
      await transaction.insert(users).values({
          email: email.toLowerCase(),
          id: id,
      });
      await transaction.insert(accounts).values({
          userId: id,
          accountType: "google",
          googleId: googleId,
      });
      await transaction.insert(profiles).values({
          userId: id,
          email: email.toLowerCase(),
          avatar: avatar,
          displayName: username,
      });
    })
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return EmailInUseErrorResponse;
    }
    
    console.error(error);
  }
}

export const registerUserViaEmail = async ({
  id,
  email,
  password,
  username,
} : {
  id: string,
  email: string,
  password: string,
  username: string,
}) => {
  try {
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      throw new EmailInUseError();
    }

    const salt = crypto.randomBytes(128).toString("base64");
    const hash = await hashPassword(password, salt);
    
    db.transaction(async (transaction) => {
      await transaction.insert(users).values({
          email: email.toLowerCase(),
          id: id,
      });
      await transaction.insert(accounts).values({
          userId: id,
          accountType: "email",
          password: hash,
          salt: salt,
      });
      await transaction.insert(profiles).values({
          userId: id,
          displayName: username,
          email: email.toLowerCase(),
      });
    })
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return EmailInUseErrorResponse;
    }
    
    console.error(error);
  }
}