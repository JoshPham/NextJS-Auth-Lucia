import { sql, SQL } from "drizzle-orm";
import { AnyPgColumn, integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const accountTypeEnum = ["email", "google", "github"] as const;

export const users = pgTable(
	"users", 
	{
		id: text("id").primaryKey(),
		email: text("email").unique(),
		emailVerified: timestamp("email_verified"),
	}, (table) => ({
	   emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(lower(table.email)),
	 })
);

export function lower(email: AnyPgColumn): SQL {
	return sql`lower(${email})`;
  }

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
export type Account = typeof accounts.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type SessionInsert = typeof sessions.$inferInsert;

export type GitHubUser = {
    id: string;
    login: string;
    email: string;
    avatar_url: string;
};

export type GoogleUser = {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
}