import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { State } from '../State'

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

	if (quote === null) {
		await interaction.editReply({
			content: "There's no such quote with the ID #" + id,
		})
		return state
	}

	if (quote.quoter != interaction.user.id) {
		await interaction.editReply({
			content: "You can't remove this quote because you didn't make it.",
		})
		return state
	}

	await state.database.removeQuoteById(id)
	await interaction.editReply("Quote removed!")

	return state
}
