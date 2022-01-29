import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { State } from '../State'
import { printQuote } from '../util'

export const command = new SlashCommandBuilder()
	.setName("quoteid")
	.setDescription("Print a quote.")
	.addNumberOption(option => option
		.setName("id")
		.setDescription("ID of the quote.")
		.setRequired(true))

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	const id = interaction.options.getNumber("id", true)

	await interaction.deferReply()

	const quote = await state.database.getQuoteById(id)

	console.log(quote)

	if (quote === null)
		await interaction.editReply("Quote **#" + id + "** doesn't exist!")
	else
		await printQuote(interaction, quote)

	return state
}
