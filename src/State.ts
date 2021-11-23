import { User } from "discord.js";
import { DatabaseInterface } from "./database";

export type State = {
    database: DatabaseInterface,
    currentMultiQuotes: Map<string, CurrentMultiQuote>
}

export type CurrentMultiQuote = {
	user: User,
	content: string,
}[]
