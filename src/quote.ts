import { Snowflake } from "discord.js";

export type Quote = {
	id: number,
	author: Snowflake,
	quoter: Snowflake,
	content: string,
}
