import { User } from "discord.js"
import { Quote } from "./Quote"

export type DatabaseInterface = {
	addQuote: (
		quoter: User,
		quote_parts: { user: User, content: string }[]
	) => Promise<number>,

	getRandomQuote: () => Promise<Quote | null>,

	getQuoteById: (
		id: number
	) => Promise<Quote | null>,

	getQuoteByUser: (
		user: User
	) => Promise<Quote | null>,

	removeQuoteById: (
		id: number
	) => Promise<void>
}
