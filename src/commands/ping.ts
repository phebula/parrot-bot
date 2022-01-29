import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { State } from '../State'

export const command = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with a pong.")

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	await interaction.reply({
		content: "Pong from ParrotBot!",
		ephemeral: true,
	})
	return state
}
