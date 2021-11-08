import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { State } from '../State'
import { printQuote } from '../util'

export const command = new SlashCommandBuilder()
	.setName("randomquote")
	.setDescription("Print a random quote.")

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	await interaction.deferReply()

	const quote = await state.database.getRandomQuote()

	printQuote(interaction, quote)

	return state
}
