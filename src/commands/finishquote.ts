import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { CurrentMultiQuote, State } from '../State'
import { formatQuotes } from '../util'

export const command = new SlashCommandBuilder()
	.setName("finishquote")
	.setDescription("Complete a multi-message quote.")

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	const multiQuote = state.currentMultiQuotes.get(interaction.user.id)
	const newMultiQuotes = new Map<string, CurrentMultiQuote>()

	if (multiQuote === undefined) {
		await interaction.reply({ content: "Please add quotes using /multiquote.", ephemeral: true })
		return state
	}

	await interaction.deferReply()

	for (const [user, data] of state.currentMultiQuotes) {
		if (user != interaction.user.id)
			newMultiQuotes.set(user, data)
	}

	const id = await state.database.addQuote(interaction.user, multiQuote)

	await interaction.editReply(`Quote **#${id}** added!\n` + formatQuotes(multiQuote, u => u.id))

	return { ...state, currentMultiQuotes: newMultiQuotes }
}
