
import { connect as db_connect } from "./database"
import { Client, Intents } from "discord.js"
import { config } from "dotenv"
import { Command, loadCommands } from "./commands/commands"
import { State } from "./State"
import Collection from "@discordjs/collection"

config()

console.log('Starting QuackerBot')

db_connect((db) => {
	let client = new Client({ intents: [Intents.FLAGS.GUILDS] })
	let commands = new Collection<string, Command>()
	let state: State = { database: db, currentMultiQuotes: new Map() }

	loadCommands().then(loadedCommand => {
		for (const command of loadedCommand) {
			commands.set(command.command.name, command)
		}
	})

	client.once('ready', () => {
		console.log('QuackerBot is ready!')
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
})
