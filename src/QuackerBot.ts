
import { Message, Snowflake } from "discord.js";
import { BotActor } from "./BotActor";
import { ServerConfig, DEFAULT_CONFIG } from "./db"
import { Quote } from "./quote";

const HELP_TEXT = "* `$PREFIXhelp` - show this message\n\
* `$PREFIXhelp quotes` - show quote-related help`"

const QUOTE_HELP_TEXT = "You can add, remove, edit and view quotes across servers.\n\
\n\
* `$PREFIXaddquote` adds a quote. If the command is a reply to another message, that message is quoted. Otherwise, the last message sent is quoted.\n\
* `$PREFIXaddquote <@user> <quote>` adds a custom quote.\n\
* `$PREFIXquote` shows a random quote.\n\
* `$PREFIXquote <#id>` shows a specific quote.\n\
* `$PREFIXquote <@user>` shows a random quote from someone specific.\n\
* `$PREFIXremquote <#id>` removes a specific quote.\n\
* `$PREFIXeditquote <#id> <quote>` edits the text of a specific quote."

export function onMessage(
	actor: BotActor,
	message: Message,
	config: ServerConfig
) {
	let result = actor.decodeMessage(message, config)

	if (result === 'NotRecipient') {
		console.log("Ignoring message:", message.content)
	}
	else if (result === 'UnParseable') {
		actor.reply(message, "I can't understand that :(")
	}
	else {
		onCommand(actor, message, config, result[0], result[1])
	}
}

async function onCommand(
	actor: BotActor,
	message: Message,
	config: ServerConfig,
	command: string,
	content?: string
) {
	console.log("Received a command: ", command, " :: ", content)

	if (command === 'set-prefix') {
		if (!message.member) {
			actor.reply(message, "This can't be used from outside a server")
			return
		}
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			actor.reply(message, "You need to be an admin to do that")
			return
		}

		if (content === undefined) content = DEFAULT_CONFIG.prefix
		actor.setServerConfig(config.sid, { ...config, prefix: content })
		actor.reply(message, "Set the prefix to '" + content + "'")
	}
	else if (command === 'addquote') {
		if (content === undefined) {
			addLastQuote(actor, message)
		}
		else {
			const result = content.match(/^\s*<@!(\d+)>\s*(.*)$/s)
			if (result === null) {
				actor.reply(message, "That's not the right format for a quote")
			}
			else {
				const [_, author, content] = result
				addQuote(actor, message, author, message.author.id, content)
			}
		}
	}
	else if (command === 'remquote') {
		removeQuote(actor, message, content)
	}
	else if (command === 'quote') {
		try {
			const quote = await getQuote(actor, content)
			const lines = (quote.content.match(/\n/g) || '').length + 1

			if (lines <= 1) {
				actor.reply(message, `Quote **#${quote.id}**\n*"${quote.content}"* - <@!${quote.author}>`)
			}
			else {
				actor.reply(message, `Quote **#${quote.id}** <@!${quote.author}>:\n> ${quote.content.split('\n').join('\n> ')}`)
			}
		}
		catch (e) {
			console.log(e)
			actor.reply(message, "No such quote!")
		}
	}
	else if (command === 'help') {
		if (content === undefined) {
			actor.reply(message, HELP_TEXT.split("$PREFIX").join(config.prefix))
		}
		else if (content === "quotes") {
			actor.reply(message, QUOTE_HELP_TEXT.split("$PREFIX").join(config.prefix))
		}
		else {
			actor.reply(message, "I don't know how to help with '" + content + "'")
		}
	}
	else {
		actor.reply(message, "I don't know what '" + command + "' means :(\nTry `" + config.prefix + "help`")
	}
}

async function addLastQuote(
	actor: BotActor,
	message: Message,
) {
	if (message.reference !== undefined && message.reference !== null) {
		if (message.reference.guildID !== message.guild.id ||
			message.reference.channelID !== message.channel.id) {
			actor.reply(message, "Can't `addquote` messages from outside this server/channel")
			return
		}
		
		const m = await message.channel.messages.fetch(message.reference.messageID)
		addQuote(actor, message, m.author.id, message.author.id, m.content)
	}
	else {
		const messages = await message.channel.messages.fetch({ limit: 32 })
		let found = false

		for (const [_, m] of messages) {
			if (found) {
				addQuote(actor, message, m.author.id, message.author.id, m.content)
				break
			}

			found = m.id === message.id
		}
	}
}

async function addQuote(
	actor: BotActor,
	cmessage: Message,
	author: Snowflake,
	quoter: Snowflake,
	content: string,
) {
	const qc = actor.quotes.find().sort({id:-1}).limit(1)
	const quote: Quote = {
		id: (await qc.hasNext() ? (await qc.next()).id : 0) + 1,
		author: author,
		quoter: quoter,
		content: content,
	}

	actor.quotes.insertOne(quote)
	actor.reply(cmessage, `**Quote #${quote.id} added!**\n*"${quote.content}"* - <@!${quote.author}>`)
}

async function removeQuote(actor: BotActor, message: Message, content?: string) {
	const id = Number.parseInt(content)

	if (isNaN(id)) {
		actor.reply(message, "That doesn't appear to be a number. `remquote` expects the quote number you wish to delete.")
	}
	else {
		try {
			const quote = await actor.quotes.findOne({ id: id })

			if (quote.quoter === message.author.id) {
				actor.quotes.deleteOne({ id: id })
				actor.reply(message, "**Quote #" + id + " deleted!**")
			}
			else {
				actor.reply(message, `You can't delete a quote that <@!${quote.quoter}> submitted`)
			}
		}
		catch (e) {
			actor.reply(message, "That doesn't appear to be a quote.")
		}
	}
}

async function getQuote(actor: BotActor, content: string): Promise<Quote> {
	if (content === undefined) {
		return actor.quotes.aggregate([{ "$sample": { size: 1 } }]).next()
	}
	else {
		const id = Number.parseInt(content)
		const author = content.match(/^<@!(\d+)>$/)

		if (!isNaN(id)) {
			return actor.quotes.findOne({ id: id })
		}
		else if (author !== undefined) {
			return actor.quotes.aggregate([
				{ "$match": { author: author[1] } },
				{ "$sample": { size: 1 } }
			]).next()
		}
	}
}
