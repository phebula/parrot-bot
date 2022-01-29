import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { State } from '../State'
import { printQuote } from '../util'

export const command = new SlashCommandBuilder()
	.setName("quote")
	.setDescription("Print a quote from a person.")
	.addUserOption(option => option
		.setName("user")
		.setDescription("User involved in the quote.")
		.setRequired(true))

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	const user = interaction.options.getUser("user", true)

	await interaction.reply({
		content: "Getting a quote from <@" + user + ">...",
		ephemeral: true,
	})

	const quote = await state.database.getQuoteByUser(user)

	if (quote === null)
		await interaction.editReply("No quotes from <@" + user + ">!")
	else
		await printQuote(interaction, quote)

	return state
}
