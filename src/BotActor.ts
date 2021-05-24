import { Client, Guild, Message, Snowflake, Channel, TextChannel } from "discord.js";
import { Collection, Db } from "mongodb";
import { ServerConfig, DEFAULT_CONFIG } from "./db"
import { Quote } from "./quote"
import { ExtAPIMessage } from "./ExtAPIMessage"

export type MessageRejectionReason =
	| 'NotRecipient' // message not indented for the bot
	| 'UnParseable'  // message cannot be interpreted

export class BotActor {
	readonly client: Client
	readonly quotes: Collection<Quote>
	readonly debug: boolean

	private readonly config: Collection<ServerConfig>
	private readonly atme: string

	constructor(client: Client, db: Db, debug: boolean) {
		this.client = client
		this.quotes = db.collection('quotes')
		this.debug = debug
		
		this.config = db.collection('config')
		this.atme = "<@!" + process.env.APP_ID + ">"
	}

	decodeMessage(message: Message, config: ServerConfig): [string, string | undefined] | MessageRejectionReason {
		let mcontent = message.content

		if (message.content.startsWith(config.prefix)) {
			mcontent = mcontent.substr(config.prefix.length)
		}
		else if (message.content.startsWith(this.atme)) {
			mcontent = mcontent.substr(this.atme.length)
		}
		else return 'NotRecipient'

		let m = mcontent.match(/^ *([\w_-]+)(?:$| (.*))$/s)
		if (m == null) return 'UnParseable'
		let [_, command, content] = m
		return [command.toLowerCase(), content]
	}

	async getServerConfig(server: Guild): Promise<ServerConfig> {
		return await this.config.findOne({ sid: server.id })
	}

	setServerConfig(server: Guild | Snowflake, config: ServerConfig) {
		if (server instanceof Guild) server = server.id
		this.config.replaceOne({ sid: server }, config, { upsert: true })
	}

	reply(message: Message, content: string) {
		const channel: Channel = message.channel
		if (!(channel instanceof TextChannel)) return;

		channel.send(ExtAPIMessage.create(message, content, {}, { replyTo: message }).resolveData())
	}
}
