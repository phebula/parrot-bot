
import { connect as db_connect } from "./database"
import { Client, Intents } from "discord.js"
import { Command, loadCommands } from "./commands/commands"
import { State } from "./State"
import Collection from "@discordjs/collection"
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

console.log('Starting ParrotBot')

async function deploy() {
	const slashCommands = (await loadCommands()).map(c => c.command.toJSON())
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN || "")

	let route: `/${string}`

	if (process.env["DEBUG"] == "true") {
		console.log("Deploying in debug mode")
		route = Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID || "", process.env.DISCORD_GUILD_ID || "")
	}
	else {
		console.log("Deploying in production mode")
		route = Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || "")
	}

	await rest.put(route, { body: slashCommands })

	console.log(`Successfully registered ${slashCommands.length} application commands.`)
}

db_connect(async (db) => {
	await deploy()

	let state: State = { database: db, currentMultiQuotes: new Map() }
	const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
	const commands = new Collection<string, Command>()
	const loadedCommands = await loadCommands()

	for (const command of loadedCommands) {
		commands.set(command.command.name, command)
	}

	client.once('ready', () => {
		console.log('ParrotBot is ready!')
	})

	client.on('interactionCreate', async interaction => {
		if (!interaction.isCommand()) return
	
		const { commandName } = interaction
		const command = commands.get(commandName)

		console.log(`Command ${commandName} triggered by user ${interaction.user.username}`)

		try {
			if (command === undefined) {
				await interaction.reply({ content: "No such command!", ephemeral: true })
				return
			}

			state = await command.execute(interaction, state)
		}
		catch (error) {
			console.log(error)
			await interaction.reply({ content: `There was an error while executing this command! (${error})`, ephemeral: true })
		}
	})

	client.login(process.env.DISCORD_TOKEN)
}).catch(console.error)
