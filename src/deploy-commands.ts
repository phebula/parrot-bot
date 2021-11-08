import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { config } from "dotenv"
import { loadCommands } from "./commands/commands"

config ()

async function main() {
	const slashCommands = (await loadCommands()).map(c => c.command.toJSON())
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN || "")
	const route = Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID || "", process.env.DISCORD_GUILD_ID || "")

	await rest.put(route, { body: slashCommands })

	console.log(`Successfully registered ${slashCommands.length} application commands.`)
}

main().catch(console.error)
