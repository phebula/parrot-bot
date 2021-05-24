
import { onMessage } from "./QuackerBot"
import { connect as db_connect } from "./db"
import { Client, Message, Snowflake } from "discord.js";
import { config } from "dotenv"
import { BotActor } from "./BotActor"
import "./db"

config()

console.log('Starting QuackerBot')

db_connect((db) => {
	let client = new Client();
	const actor = new BotActor(client, db, process.env.DEBUG == "true")

	client.on('message', async (message: Message) => {
		// get the config for the server this message came from
		const config = await actor.getServerConfig(message.guild)
		onMessage(actor, message, config)
	})

	client.login(process.env.TOKEN)
		.then(() => {
			console.log("Logged in!")
		})
		.catch((error) => {
			console.error("Login failed! ", error)
		})
})
