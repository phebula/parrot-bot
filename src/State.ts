import { CacheType, CommandInteraction, User } from "discord.js";
import { Db } from "mongodb";
import { DatabaseInterface } from "./database";

export type State = {
    database: DatabaseInterface,
    currentMultiQuotes: Map<string, CurrentMultiQuote>
}

export type CurrentMultiQuote = {
	user: User,
	content: string,
}[]
