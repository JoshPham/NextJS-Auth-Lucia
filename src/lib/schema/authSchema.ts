import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const accountTypeEnum = ["email", "google", "github"] as const;

export const users = pgTable("user", {
	id: text("id").primaryKey(),
	email: text("email").unique(),
	emailVerified: timestamp("email_verified"),
});

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const accounts = pgTable("accounts", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
	  .references(() => users.id, { onDelete: "cascade" })
	  .unique()
	  .notNull(),
	accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
	githubId: text("github_id").unique(),
	googleId: text("google_id").unique(),
	password: text("password"),
	salt: text("salt"),
  });

export const profiles = pgTable("profile", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
	  .references(() => users.id, { onDelete: "cascade" })
	  .unique()
	  .notNull(),
	displayName: text("display_name"),
	email: text("email"),
	avatar: text("avatar"),
	bio: text("bio").notNull().default(""),
  });


export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export type GitHubUser = {
    id: string;
    login: string;
    email: string;
    avatar_url: string;
};