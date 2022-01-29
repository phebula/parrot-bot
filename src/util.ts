import { CacheType, CommandInteraction } from "discord.js"
import { Quote } from "./Quote"

export function formatQuotes<U>(
	quote_parts: { user: U, content: string }[],
	formatUser: (user: U) => string
) {
	let result = ""
	let first = true

	for (const { user, content } of quote_parts) {
		if (first) first = false
		else result += "\n"

		result += "<@" + formatUser(user) + ">: " + content + ""
	}

	return result
}

export async function printQuote(interaction: CommandInteraction<CacheType>, quote: Quote) {
	var replyText = `Quote **#${quote.id}**...\n> `
	              + formatQuotes(quote.quote_parts, u => u).split('\n').join('\n> ')

	// TODO: reactions (+1/-1)
	// TODO: seen counter

	await interaction.editReply(replyText)
}
