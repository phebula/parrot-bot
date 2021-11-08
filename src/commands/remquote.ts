import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { State } from '../State'
import { printQuote } from '../util'

export const command = new SlashCommandBuilder()
	.setName("remquote")
	.setDescription("Remove a quote by its ID.")
	.addNumberOption(option => option
		.setName("id")
		.setDescription("ID of the quote.")
		.setRequired(true))

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	const id = interaction.options.getNumber("id", true)

	await interaction.deferReply({ ephemeral: true })

	const quote = await state.database.getQuoteById(id)

	if (quote.quoter != interaction.user.id) {
		interaction.editReply("You can't remove this quote because you didn't upload it.")
		return
	}

	await state.database.removeQuoteById(id)

	interaction.editReply("Quote removed!")

	return state
}
