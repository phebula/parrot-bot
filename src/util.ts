import { CacheType, CommandInteraction } from "discord.js"
import { Quote } from "./Quote"

export function formatQuotes<U>(
	multiQuoteParts: { user: U, content: string }[],
	formatUser: (user: U) => string
) {
	let result = ""
	let first = true

	for (const { user, content } of multiQuoteParts) {
		if (first) first = false
		else result += "\n"

		result += "<@" + formatUser(user) + ">: " + content + ""
	}

	return result
}

export function printQuote(interaction: CommandInteraction<CacheType>, quote: Quote | null) {
	if (quote === null) {
		interaction.editReply("No such quote!")
		return
	}

	var replyText = `Quote **#${quote.id}**...\n> `
	              + formatQuotes(quote.multiQuoteParts, u => u).split('\n').join('\n> ')

	interaction.editReply(replyText)
}
