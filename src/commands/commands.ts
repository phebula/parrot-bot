import { SlashCommandBuilder } from "@discordjs/builders"
import { readdirSync } from "fs"
import { CacheType, CommandInteraction } from "discord.js"
import { State } from "../State"

export async function loadCommands() {
	const allCommands = readdirSync('./out/commands')
		.filter(file => file.endsWith('.js'))
		.filter(file => !file.startsWith("commands"))
		.map(file => import(`./${file}`))

	const importedCommands = []

	for (const command of allCommands)
		importedCommands.push(await command)

	return importedCommands as [Command]
}

export type Command = {
	command: SlashCommandBuilder,
	execute: (interaction: CommandInteraction<CacheType>, state: State) => State
}
