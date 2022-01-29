import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, CommandInteraction } from 'discord.js'
import { State } from '../State'
import { formatQuotes } from '../util'

export const command = new SlashCommandBuilder()
	.setName("addquote")
	.setDescription("Add a quote from a user. Check out /multiquote if you want to add a conversation-like quote.")
	.addUserOption(option => option
		.setName("user")
		.setDescription("The person that said what is being quoted.")
		.setRequired(true))
	.addStringOption(option => option
		.setName("content")
		.setDescription("What they said.")
		.setRequired(true))

export async function execute(interaction: CommandInteraction<CacheType>, state: State): Promise<State> {
	const content = interaction.options.getString("content", true)
	const user = interaction.options.getUser("user", true)

	await interaction.deferReply()

	const id = await state.database.addQuote(interaction.user, [{ user: user, content: content }])

	await interaction.editReply(`Quote **#${id}** added! ${formatQuotes([{ user: user, content: content }], u => u.id)}`)

	return state
}
