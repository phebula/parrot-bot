import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { CurrentMultiQuote, State } from '../State'

export const command = new SlashCommandBuilder()
	.setName("multiquote")
	.setDescription("Add a conversation like quote from many people with multiple /multiquote commands.")
	.addUserOption(option => option
		.setName("user")
		.setDescription("The person that said what is being quoted.")
		.setRequired(true))
	.addStringOption(option => option
		.setName("content")
		.setDescription("What they said.")
		.setRequired(true))

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	const multiQuote = state.currentMultiQuotes.get(interaction.user.id)
	const content = interaction.options.getString("content", true)
	const user = interaction.options.getUser("user", true)
	const newQuote = { user: user, content: content }
	const quotes = multiQuote && [...multiQuote, newQuote] || [newQuote]
	const newMultiQuotes = new Map<string, CurrentMultiQuote>()

	for (const [user, data] of state.currentMultiQuotes) {
		newMultiQuotes.set(user, data)
	}

	newMultiQuotes.set(interaction.user.id, quotes)

	await interaction.reply({
		content: `Added to multi-quote. Use /finishquote when done.`,
		ephemeral: true,
	})

	return { ...state, currentMultiQuotes: newMultiQuotes }
}
