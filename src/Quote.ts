import { Snowflake } from "discord.js"

export type Quote = {
	id: number,
	quoter: string,
	multiQuoteParts: {
		user: string,
		content: string,
	}[]
}
